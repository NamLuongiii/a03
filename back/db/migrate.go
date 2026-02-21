package db

import (
	"log"
	"quickstart/db/seeding"
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

	// Run seeding
	e := runSeeding(db)
	if e != nil {
		return e
	}

	log.Println("Migrations completed successfully")
	return nil
}

// runManualMigrations handles breaking changes that AutoMigrate can't handle
func runManualMigrations(db *gorm.DB) error {
	return nil
}

func runSeeding(db *gorm.DB) error {
	e := seeding.AccountSeeding(db)
	if e != nil {
		return e
	}
	return seeding.CategoriesSeeding(db)
}
