package main

import (
	"log"
	"os"
	"quickstart/docs"
	"quickstart/env"
	"quickstart/handlers"
	"quickstart/middleware"
	"quickstart/models"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/wneessen/go-mail"
	"gorm.io/gorm"
)

// Database instance
var db *gorm.DB

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

	// Initialize Database
	var dbErr error
	db, dbErr = gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
	if dbErr != nil {
		log.Fatal("Failed to connect to database:", dbErr)
		return
	}

	// Auto Migrate the schema
	migrateErr := db.AutoMigrate(
		&models.Account{},
		&models.Profile{},
		&models.OTP{})

	if migrateErr != nil {
		log.Fatal("Failed to migrate database:", migrateErr)
		return
	}

	// Initialize mailer
	mailClient, mailErr := mail.NewClient(
		os.Getenv(env.MailHost),
		mail.WithPort(587),
		mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername(os.Getenv(env.MailAddress)),
		mail.WithPassword(os.Getenv(env.MailPassword)))
	if mailErr != nil {
		log.Fatal("failed to create mail client:", mailErr)
		return
	}
	mailHandler := handlers.NewMailHandler(mailClient)

	// Initialize repositories
	accountRepo := models.NewAccountRepository(db)
	OTPRepo := models.NewOTPRepository(db)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(mailHandler, accountRepo, OTPRepo)

	router := gin.Default()

	// Add CORS middleware
	router.Use(middleware.CORSMiddleware())

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
