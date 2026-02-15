package models

import (
	"time"

	"gorm.io/gorm"
)

type Profile struct {
	ID        int       `json:"id" gorm:"primaryKey;autoIncrement:true"`
	AccountID int       `json:"account_id" gorm:"not null;uniqueIndex:idx_profiles_account_id"`
	FullName  string    `json:"full_name" gorm:"type:varchar(150)"`
	Avatar    string    `json:"avatar" gorm:"type:varchar(255)"`
	Bio       string    `json:"bio" gorm:"type:text"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
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
