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

// CORSMiddleware handles CORS
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		c.Header("Access-Control-Allow-Origin", origin)
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
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
		&models.Activity{},
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
	profileRepo := models.CreateProfileRepository(db)
	activityRepo := models.NewActivityRepository(db)
	OTPRepo := models.NewOTPRepository(db)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(mailHandler, accountRepo, OTPRepo)
	profileHandler := handlers.NewProfileHandler(&profileRepo, &activityRepo)

	router := gin.Default()

	// Add CORS middleware
	router.Use(CORSMiddleware())

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

		// Profile routes
		profile := v1.Group("/profiles")
		{
			profile.GET("", middleware.RequiredAuth(), profileHandler.GetProfiles)
			profile.POST("", middleware.RequiredAuth(), profileHandler.CreateProfile)
			profile.PUT("/:id", middleware.RequiredAuth(), profileHandler.UpdateProfile)
			profile.DELETE("/:id", middleware.RequiredAuth(), profileHandler.DeleteProfile)
			profile.GET("/:id/activities", middleware.RequiredAuth(), profileHandler.GetActivities)
			profile.POST("/:id/activities", middleware.RequiredAuth(), profileHandler.SaveActivity)
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
