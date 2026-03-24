package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	dbmigrate "quickstart/db"
	"quickstart/docs"
	"quickstart/env"
	"quickstart/handlers"
	"quickstart/jobs"
	"quickstart/middleware"
	"quickstart/models"
	"quickstart/services"
	"quickstart/types"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
	"github.com/wneessen/go-mail"
	"gorm.io/gorm"
)

// Database instance
var database *gorm.DB

func ConnectDatabase() {
	url := os.Getenv("TURSO_DATABASE_URL")
	token := os.Getenv("TURSO_AUTH_TOKEN")

	// 1. Tạo URL đúng định dạng Turso yêu cầu
	dbUrl := fmt.Sprintf("%s?authToken=%s", url, token)

	// 2. Mở kết nối SQL thuần túy bằng driver libsql
	db, err := sql.Open("libsql", dbUrl)
	if err != nil {
		log.Fatal("Lỗi khởi tạo driver libsql:", err)
	}

	// 3. Truyền kết nối đó vào GORM
	// Dùng github.com/glebarez/sqlite thay vì gorm.io/driver/sqlite để tránh CGO
	var dbErr error
	database, dbErr = gorm.Open(sqlite.Dialector{Conn: db}, &gorm.Config{})

	if dbErr != nil {
		log.Fatal("Không thể kết nối GORM với Turso:", dbErr)
	}

	log.Println("--- Kết nối Turso Cloud thành công! ---")
}

//	@title		My API
//	@version	1.0
//	@BasePath	/api/v1

// @securityDefinitions.apikey	BearerAuth
// @in							header
// @name						Authorization
// @description				Type only token (not include Bearer)
func main() {
	// Setup Environment Variables
	env.SetupEnv()

	docs.SwaggerInfo.Host = "localhost:8080"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

	// 3. Kết nối bằng GORM
	ConnectDatabase()

	dbmigrate.InitRedis()
	defer dbmigrate.CloseRedis()

	log.Println("Successfully connected to Turso!")

	// Run migrations
	if err := dbmigrate.RunMigrations(database); err != nil {
		log.Fatal("Failed to run migrations:", err)
		return
	}

	// Initialize repositories
	bookRepo := models.NewBookRepository(database)

	// Start cron jobs
	jobs.StartScheduler(bookRepo)
	defer jobs.StopScheduler()

	// Initialize mailer
	mailClient, mailErr := mail.NewClient(
		env.GetEnv(env.MailHost),
		mail.WithPort(587),
		mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername(env.GetEnv(env.MailAddress)),
		mail.WithPassword(env.GetEnv(env.MailPassword)))
	if mailErr != nil {
		log.Fatal("failed to create mail client:", mailErr)
		return
	}
	mailHandler := handlers.NewMailHandler(mailClient)

	// Initialize repositories (moved up)
	accountRepo := models.NewAccountRepository(database)
	OTPRepo := models.NewOTPRepository(database)
	bookSeriesRepo := models.NewBookSeriesRepository(database)
	digitalBookRepo := models.NewDigitalBookRepository(database)
	bookRatingRepo := models.NewBookRatingRepository(database)
	categoryRepo := models.NewCategoryRepository(database)
	commentRepo := models.NewCommentRepository(database)
	featuredGroupRepo := models.NewFeaturedBookGroupRepository(database)
	authorRepo := models.NewAuthorRepository(database)
	imageRepo := models.NewImageRepository(database)
	userBookRepo := models.NewUserBookRepository(database)
	tagsRepo := models.CreateTagsRepository(database)

	// Init services
	epubService := services.NewEpubService()
	userBookService := services.NewUserBookService(bookRepo, accountRepo, userBookRepo)
	tagsService := services.NewTagsService(tagsRepo)
	automationService := services.NewAutomationService()

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(mailHandler, accountRepo, OTPRepo)

	storage := handlers.NewFileStorage(
		env.GetEnv(env.R1Key),
		env.GetEnv(env.R1Keypassword),
		env.GetEnv(env.R1Bucket),
		env.GetEnv(env.R1Region),
		env.GetEnv(env.R1Endpoint),
	)

	authorHandler := handlers.NewAuthorHandler(authorRepo)

	imageProcessor := handlers.NewImageProcessor()

	bookHandler := handlers.NewBooksHandler(handlers.BookParams{
		BookRepository:          bookRepo,
		CategoryRepository:      categoryRepo,
		AuthorRepository:        authorRepo,
		CommentRepository:       commentRepo,
		FeaturedGroupRepository: featuredGroupRepo,
		DigitalBookRepository:   digitalBookRepo,
		BookSeriesRepository:    bookSeriesRepo,
		BookRatingRepository:    bookRatingRepo,
		FileStorage:             storage,
		ImageProcessor:          imageProcessor,
		ImageRepository:         imageRepo,
		EpubService:             epubService,
	})

	userBookHandler := handlers.NewUserBookHandler(userBookService)
	tagsHandler := handlers.NewTagsHandler(tagsService)
	automationHandler := handlers.NewAutomationHandler(automationService, bookRepo, categoryRepo)

	router := gin.Default()

	// Add CORS for all ip - Must be before ErrorHandler
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
			"http://localhost:5174",
			"http://localhost:3000",
			"https://docluon.com",
			"https://www.docluon.com",
			"https://admin.docluon.com",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Content-Length"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.Use(middleware.ErrorHandler())

	docs.SwaggerInfo.BasePath = "/api/v1"

	v1 := router.Group("/api/v1")
	{
		// Auth routes
		auth := v1.Group("/auth")
		{
			auth.GET("/me",
				middleware.RequiredAuth(types.RoleUser, types.RoleAdmin),
				authHandler.Me)
			auth.POST("/login", authHandler.Login)
			auth.POST("/signup", authHandler.SignUp)
			auth.POST("/ask-reset-password", authHandler.RequestChangePassword)
			auth.POST("/verify-OTP", authHandler.VerifyOTP)
			auth.POST("/reset-password", authHandler.ResetPassword)
		}

		// Book routes
		book := v1.Group("/books")
		{
			book.GET("", bookHandler.GetBooks)
			book.POST("/create-tool", middleware.RequiredAuth(types.RoleAdmin), bookHandler.CreateBookForTool)
			book.POST("/test-upload", middleware.RequiredAuth(types.RoleAdmin), bookHandler.TestUpload)
			book.POST("/test-delete", middleware.RequiredAuth(types.RoleAdmin), bookHandler.TestDelete)
			book.DELETE("/test-delete-folder", bookHandler.TestDeleteFolder)
			book.GET("/most-viewed", bookHandler.GetMostViewedBooks)
			book.GET("/:id", bookHandler.GetBookByID)
			book.POST("", middleware.RequiredAuth(types.RoleAdmin), bookHandler.CreateBook)
			book.GET("/featured", bookHandler.GetFeaturedBooks)
			book.GET("/categories", bookHandler.GetCategories)
			book.GET("/authors/:authorID", bookHandler.GetAuthors)
			book.POST("/:id/comments", middleware.RequiredAuth(types.RoleUser), bookHandler.AddComment)
			book.POST("/:id/ratings", middleware.RequiredAuth(types.RoleUser), bookHandler.AddRating)
			book.GET("/:id/comments", bookHandler.GetComments)
			book.DELETE("/:id", middleware.RequiredAuth(types.RoleAdmin), bookHandler.DeleteBook)
			book.PUT("/:id", middleware.RequiredAuth(types.RoleAdmin), bookHandler.UpdateBook)
			book.POST("/:id/view", bookHandler.View)
		}

		// UserBook routes
		userBook := v1.Group("/user-books")
		{
			userBook.POST("", middleware.RequiredAuth(types.RoleUser), userBookHandler.AddBookToUser)
			userBook.DELETE("/:bookID", middleware.RequiredAuth(types.RoleUser), userBookHandler.RemoveBookFromUser)
			userBook.GET("", middleware.RequiredAuth(types.RoleUser), userBookHandler.GetBooksByUser)
			userBook.GET("/:bookID", middleware.RequiredAuth(types.RoleUser), userBookHandler.FindByID)
		}

		// Author routes
		author := v1.Group("/authors")
		{
			author.GET("", authorHandler.GetAll)
			author.POST("", authorHandler.Create)
		}

		// Tag routes
		tags := v1.Group("/tags")
		{
			tags.GET("", tagsHandler.GetAll)
		}

		// Automation routes
		automation := v1.Group("/automation")
		{
			automation.POST("task", middleware.RequiredAuth(types.RoleAdmin), automationHandler.Task)
		}

	}

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler, ginSwagger.PersistAuthorization(true)))

	// Ping GoDoc
	//	@Summary	Ping the server
	//	@Schemes
	//	@Description	Ping the server to check if it's alive
	//	@Tags			example
	//	@Accept			JSON
	//	@Produce		JSON
	//	@Success		200	{object}	map[string]string
	//	@Router			/ping [get]
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong🚀 hehe",
		})
	})

	errRun := router.Run() // listens on 0.0.0.0:8080 by default
	if errRun != nil {
		log.Fatal(errRun)
	}

}
