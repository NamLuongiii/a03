package models

import "gorm.io/gorm"

type Profile struct {
	ID        string `json:"id" gorm:"primaryKey"`
	Name      string `json:"name" gorm:"not null"`
	Avatar    string `json:"avatar"`
	AccountID int    `json:"account_id" gorm:"unique;not null"`
}

type ProfileRepositoryInterface interface {
	GetByAccountID(accountId int) (*Profile, error)
	Save(profile *Profile) error
}

type ProfileRepository struct {
	db *gorm.DB
}

func CreateProfileRepository(db *gorm.DB) ProfileRepositoryInterface {
	return &ProfileRepository{db: db}
}

func (r *ProfileRepository) GetByAccountID(accountId int) (*Profile, error) {
	var profile Profile
	err := r.db.First(&profile, "account_id = ?", accountId).Error
	return &profile, err
}

func (r *ProfileRepository) Save(profile *Profile) error {
	return r.db.Save(profile).Error
}
