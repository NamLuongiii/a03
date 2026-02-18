package seeding

import (
	"quickstart/functions"
	"quickstart/models"

	"gorm.io/gorm"
)

func AccountSeeding(db *gorm.DB) error {
	var count int64
	db.Model(&models.Account{}).Count(&count)

	if count > 0 {
		return nil
	}

	hp, e := functions.HashPassword("123")
	if e != nil {
		return e
	}
	accounts := []models.Account{
		{Name: "namlk", Email: "namlk@solashi.com", HPassword: hp},
		{Name: "namluong", Email: "luongkhacnam222@gmail.com", HPassword: hp},
	}

	db.Create(&accounts)
	return nil
}
