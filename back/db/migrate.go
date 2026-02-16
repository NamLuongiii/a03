package db

import (
	"log"
	"quickstart/models"

	"gorm.io/gorm"
)

// RunMigrations runs all database migrations
func RunMigrations(db *gorm.DB) error {
	log.Println("Running migrations...")

	// Run manual migrations first (for breaking changes)
	if err := runManualMigrations(db); err != nil {
		return err
	}

	// Auto migrate models
	if err := db.AutoMigrate(
		&models.Account{},
		&models.Profile{},
		&models.OTP{},
		&models.Author{},
		&models.Category{},
		&models.BookSeries{},
		&models.Book{},
		&models.DigitalBook{},
		&models.Comment{},
		&models.BookRating{},
		&models.FeaturedBookGroup{},
		&models.FeaturedGroupBook{},
	); err != nil {
		return err
	}

	log.Println("Migrations completed successfully")
	return nil
}

// runManualMigrations handles breaking changes that AutoMigrate can't handle
func runManualMigrations(db *gorm.DB) error {
	// Migration 1: Clean up duplicate password columns
	//if db.Migrator().HasColumn(&models.Account{}, "password") {
	//	log.Println("Migration: Dropping old 'password' column from accounts")
	//	if err := db.Migrator().DropColumn(&models.Account{}, "password"); err != nil {
	//		log.Printf("Warning: Failed to drop 'password' column: %v", err)
	//	}
	//}

	// Add more manual migrations here as needed
	// Example:
	// if db.Migrator().HasTable("old_table") {
	//     db.Migrator().DropTable("old_table")
	// }

	return nil
}
