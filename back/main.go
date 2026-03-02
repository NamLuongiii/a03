package main

import (
	"log"
	dbmigrate "quickstart/db"
	"quickstart/docs"
	"quickstart/env"
	"quickstart/handlers"
	"quickstart/middleware"
	"quickstart/models"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/wneessen/go-mail"
	"gorm.io/gorm"
)

// Database instance
var database *gorm.DB

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

	// Initialize Database
	var dbErr error
	database, dbErr = gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
	if dbErr != nil {
		log.Fatal("Failed to connect to database:", dbErr)
		return
	}

	// Run migrations
	if err := dbmigrate.RunMigrations(database); err != nil {
		log.Fatal("Failed to run migrations:", err)
		return
	}

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

	// Initialize repositories
	accountRepo := models.NewAccountRepository(database)
	OTPRepo := models.NewOTPRepository(database)
	bookRepo := models.NewBookRepository(database)
	bookSeriesRepo := models.NewBookSeriesRepository(database)
	digitalBookRepo := models.NewDigitalBookRepository(database)
	bookRatingRepo := models.NewBookRatingRepository(database)
	categoryRepo := models.NewCategoryRepository(database)
	commentRepo := models.NewCommentRepository(database)
	featuredGroupRepo := models.NewFeaturedBookGroupRepository(database)
	authorRepo := models.NewAuthorRepository(database)
	imageRepo := models.NewImageRepository(database)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(mailHandler, accountRepo, OTPRepo)

	storage := handlers.NewFileStorage(
		env.GetEnv(env.DOSpaceKey),
		env.GetEnv(env.DOSpaceSecret),
		env.GetEnv(env.DOSpaceBucket),
		env.GetEnv(env.DOSpaceRegion),
		env.GetEnv(env.DOSpaceEndpoint),
	)

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
	})

	router := gin.Default()

	// Add CORS for all ip
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
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
				middleware.RequiredAuth(),
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
			book.GET("/:id", bookHandler.GetBookByID)
			book.POST("", bookHandler.CreateBook)
			book.GET("/featured", bookHandler.GetFeaturedBooks)
			book.GET("/categories", bookHandler.GetCategories)
			book.GET("/authors/:authorID", bookHandler.GetAuthors)
			book.POST("/:id/comments", middleware.RequiredAuth(), bookHandler.AddComment)
			book.POST("/:id/ratings", middleware.RequiredAuth(), bookHandler.AddRating)
			book.GET("/:id/comments", bookHandler.GetComments)
			book.DELETE("/:id", bookHandler.DeleteBook)
			book.PUT("/:id", bookHandler.UpdateBook)
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
