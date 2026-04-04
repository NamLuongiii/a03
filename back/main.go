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
	"quickstart/queue"
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

type Application struct {
	DB          *gorm.DB
	Router      *gin.Engine
	QueueClient *queue.Client
	QueueServer *queue.Server
}

func connectDatabase() (*gorm.DB, error) {
	url := os.Getenv("TURSO_DATABASE_URL")
	token := os.Getenv("TURSO_AUTH_TOKEN")

	dbUrl := fmt.Sprintf("%s?authToken=%s", url, token)

	db, err := sql.Open("libsql", dbUrl)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize libsql driver: %w", err)
	}

	database, err := gorm.Open(sqlite.Dialector{Conn: db}, &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect GORM with Turso: %w", err)
	}

	log.Println("Successfully connected to Turso Cloud!")
	return database, nil
}

func initializeMailClient() (*mail.Client, error) {
	return mail.NewClient(
		env.GetEnv(env.MailHost),
		mail.WithPort(587),
		mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername(env.GetEnv(env.MailAddress)),
		mail.WithPassword(env.GetEnv(env.MailPassword)),
	)
}

func initializeRepositories(db *gorm.DB) map[string]interface{} {
	return map[string]interface{}{
		"book":          models.NewBookRepository(db),
		"account":       models.NewAccountRepository(db),
		"otp":           models.NewOTPRepository(db),
		"bookSeries":    models.NewBookSeriesRepository(db),
		"digitalBook":   models.NewDigitalBookRepository(db),
		"bookRating":    models.NewBookRatingRepository(db),
		"category":      models.NewCategoryRepository(db),
		"comment":       models.NewCommentRepository(db),
		"featuredGroup": models.NewFeaturedBookGroupRepository(db),
		"author":        models.NewAuthorRepository(db),
		"image":         models.NewImageRepository(db),
		"userBook":      models.NewUserBookRepository(db),
		"tags":          models.CreateTagsRepository(db),
	}
}

func setupCORS() gin.HandlerFunc {
	return cors.New(cors.Config{
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
	})
}

func setupAuthRoutes(group *gin.RouterGroup, handler *handlers.AuthHandler) {
	auth := group.Group("/auth")
	auth.GET("/me", middleware.RequiredAuth(types.RoleUser, types.RoleAdmin), handler.Me)
	auth.POST("/login", handler.Login)
	auth.POST("/signup", handler.SignUp)
	auth.POST("/ask-reset-password", handler.RequestChangePassword)
	auth.POST("/verify-OTP", handler.VerifyOTP)
	auth.POST("/reset-password", handler.ResetPassword)
}

func setupBookRoutes(group *gin.RouterGroup, handler *handlers.BooksHandler) {
	book := group.Group("/books")
	book.GET("", handler.GetBooks)
	book.GET("/most-viewed", handler.GetMostViewedBooks)
	book.GET("/featured", handler.GetFeaturedBooks)
	book.GET("/categories", handler.GetCategories)
	book.GET("/:id", handler.GetBookByID)
	book.GET("/authors/:authorID", handler.GetAuthors)
	book.GET("/:id/comments", handler.GetComments)
	book.POST("", middleware.RequiredAuth(types.RoleAdmin), handler.CreateBook)
	book.POST("/create-tool", middleware.RequiredAuth(types.RoleAdmin), handler.CreateBookForTool)
	book.POST("/test-upload", middleware.RequiredAuth(types.RoleAdmin), handler.TestUpload)
	book.POST("/test-delete", middleware.RequiredAuth(types.RoleAdmin), handler.TestDelete)
	book.POST("/:id/comments", middleware.RequiredAuth(types.RoleUser), handler.AddComment)
	book.POST("/:id/ratings", middleware.RequiredAuth(types.RoleUser), handler.AddRating)
	book.POST("/:id/view", handler.View)
	book.PUT("/:id", middleware.RequiredAuth(types.RoleAdmin), handler.UpdateBook)
	book.DELETE("/:id", middleware.RequiredAuth(types.RoleAdmin), handler.DeleteBook)
	book.DELETE("/test-delete-folder", handler.TestDeleteFolder)
}

func setupUserBookRoutes(group *gin.RouterGroup, handler handlers.UserBookHandlerInterface) {
	userBook := group.Group("/user-books")
	userBook.POST("", middleware.RequiredAuth(types.RoleUser), handler.AddBookToUser)
	userBook.GET("", middleware.RequiredAuth(types.RoleUser), handler.GetBooksByUser)
	userBook.GET("/:bookID", middleware.RequiredAuth(types.RoleUser), handler.FindByID)
	userBook.DELETE("/:bookID", middleware.RequiredAuth(types.RoleUser), handler.RemoveBookFromUser)
}

func setupAuthorRoutes(group *gin.RouterGroup, handler *handlers.AuthorHandler) {
	author := group.Group("/authors")
	author.GET("", handler.GetAll)
	author.POST("", handler.Create)
}

func setupTagRoutes(group *gin.RouterGroup, handler handlers.TagsHandlerInterface) {
	tags := group.Group("/tags")
	tags.GET("", handler.GetAll)
}

func setupAutomationRoutes(group *gin.RouterGroup, handler handlers.AutomationHandlerInterface) {
	automation := group.Group("/automation")
	automation.POST("task", middleware.RequiredAuth(types.RoleAdmin), handler.Task)
	automation.POST("book-processing", middleware.RequiredAuth(types.RoleAdmin), handler.BookProcessing)
}

func initializeQueueClient() *queue.Client {
	redisAddr := os.Getenv("REDIS_HOST")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}
	redisPassword := os.Getenv("REDIS_PASSWORD")

	return queue.NewClient(redisAddr, redisPassword)
}

func initializeQueueServer() *queue.Server {
	redisAddr := os.Getenv("REDIS_HOST")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}
	redisPassword := os.Getenv("REDIS_PASSWORD")

	server := queue.NewServer(queue.ServerConfig{
		RedisAddr:     redisAddr,
		RedisPassword: redisPassword,
		Concurrency:   2,
		Queues: map[string]int{
			"critical": 6,
			"default":  3,
			"low":      1,
		},
	})

	// Register handlers
	server.RegisterHandler(queue.TypeEmailDelivery, queue.NewEmailHandler())
	server.RegisterHandler(queue.TypeBookProcess, queue.NewBookProcessHandler())
	server.RegisterHandler(queue.TypeImageResize, queue.NewImageResizeHandler())

	return server
}

//	@title		My API
//	@version	1.0
//	@BasePath	/api/v1

// @securityDefinitions.apikey	BearerAuth
// @in							header
// @name						Authorization
// @description				Type only token (not include Bearer)
func main() {
	env.SetupEnv()

	docs.SwaggerInfo.Host = "localhost:8080"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}
	docs.SwaggerInfo.BasePath = "/api/v1"

	db, err := connectDatabase()
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}

	dbmigrate.InitRedis()
	defer dbmigrate.CloseRedis()

	if err := dbmigrate.RunMigrations(db); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	repos := initializeRepositories(db)

	jobs.StartScheduler(repos["book"].(*models.BookRepository))
	defer jobs.StopScheduler()

	// Initialize queue client and server
	queueClient := initializeQueueClient()
	defer queueClient.Close()

	queueServer := initializeQueueServer()
	go func() {
		if err := queueServer.Start(); err != nil {
			log.Fatal("Failed to start queue server:", err)
		}
	}()
	defer queueServer.Shutdown()

	mailClient, err := initializeMailClient()
	if err != nil {
		log.Fatal("Failed to create mail client:", err)
	}

	mailHandler := handlers.NewMailHandler(mailClient)
	authHandler := handlers.NewAuthHandler(mailHandler, repos["account"].(*models.AccountRepository), repos["otp"].(*models.OTPRepository))

	storage := handlers.NewFileStorage(
		env.GetEnv(env.R1Key),
		env.GetEnv(env.R1Keypassword),
		env.GetEnv(env.R1Bucket),
		env.GetEnv(env.R1Region),
		env.GetEnv(env.R1Endpoint),
	)

	bookHandler := handlers.NewBooksHandler(handlers.BookParams{
		BookRepository:          repos["book"].(*models.BookRepository),
		CategoryRepository:      repos["category"].(*models.CategoryRepository),
		AuthorRepository:        repos["author"].(*models.AuthorRepository),
		CommentRepository:       repos["comment"].(*models.CommentRepository),
		FeaturedGroupRepository: repos["featuredGroup"].(*models.FeaturedBookGroupRepository),
		DigitalBookRepository:   repos["digitalBook"].(*models.DigitalBookRepository),
		BookSeriesRepository:    repos["bookSeries"].(*models.BookSeriesRepository),
		BookRatingRepository:    repos["bookRating"].(*models.BookRatingRepository),
		FileStorage:             storage,
		ImageProcessor:          handlers.NewImageProcessor(),
		ImageRepository:         repos["image"].(*models.ImageRepository),
		EpubService:             services.NewEpubService(),
	})

	userBookService := services.NewUserBookService(
		repos["book"].(*models.BookRepository),
		repos["account"].(*models.AccountRepository),
		repos["userBook"].(*models.UserBookRepository),
	)
	userBookHandler := handlers.NewUserBookHandler(userBookService)

	authorHandler := handlers.NewAuthorHandler(repos["author"].(*models.AuthorRepository))
	tagsHandler := handlers.NewTagsHandler(services.NewTagsService(repos["tags"].(models.TagsRepository)))
	automationHandler := handlers.NewAutomationHandler(
		services.NewAutomationService(queueClient, repos["book"].(*models.BookRepository)),
		repos["book"].(*models.BookRepository),
		repos["category"].(*models.CategoryRepository),
	)

	router := gin.Default()
	router.Use(setupCORS())
	router.Use(middleware.ErrorHandler())

	v1 := router.Group("/api/v1")
	setupAuthRoutes(v1, authHandler)
	setupBookRoutes(v1, bookHandler)
	setupUserBookRoutes(v1, userBookHandler)
	setupAuthorRoutes(v1, authorHandler)
	setupTagRoutes(v1, tagsHandler)
	setupAutomationRoutes(v1, automationHandler)

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler, ginSwagger.PersistAuthorization(true)))

	//	@Summary	Ping the server
	//	@Schemes
	//	@Description	Ping the server to check if it's alive
	//	@Tags			example
	//	@Accept			JSON
	//	@Produce		JSON
	//	@Success		200	{object}	map[string]string
	//	@Router			/ping [get]
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong🚀 hehe"})
	})

	if err := router.Run(); err != nil {
		log.Fatal(err)
	}
}
