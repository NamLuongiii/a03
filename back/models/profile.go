package models

import "gorm.io/gorm"

type Profile struct {
	ID         int        `json:"id" gorm:"primaryKey;autoIncrement:true"`
	Name       string     `json:"name" gorm:"not null"`
	BirthYear  int        `json:"birth_year" gorm:"not null"`
	Stars      int        `json:"stars" gorm:"default:0"`
	AccountID  int        `json:"account_id" gorm:"not null"`
	Activities []Activity `json:"activities" gorm:"foreignKey:ProfileID"`
}

type ProfileRepositoryInterface interface {
	Create(profile *Profile) error
	FindByAccountID(accountId int) ([]Profile, error)
	GetByAccountID(accountId int) (*Profile, error)
	Save(profile *Profile) error
	Delete(profileId int) error
	FindOneById(profileId int) (*Profile, error)
}

type ProfileRepository struct {
	db *gorm.DB
}

func CreateProfileRepository(db *gorm.DB) ProfileRepositoryInterface {
	return &ProfileRepository{db: db}
}

func (r *ProfileRepository) Create(profile *Profile) error {
	return r.db.Create(profile).Error
}

func (r *ProfileRepository) FindByAccountID(accountId int) ([]Profile, error) {
	var profiles []Profile
	err := r.db.Where("account_id = ?", accountId).Find(&profiles).Error
	return profiles, err
}

func (r *ProfileRepository) GetByAccountID(accountId int) (*Profile, error) {
	var profile Profile
	err := r.db.First(&profile, "account_id = ?", accountId).Error
	return &profile, err
}

func (r *ProfileRepository) Save(profile *Profile) error {
	return r.db.Save(profile).Error
}

func (r *ProfileRepository) Delete(profileId int) error {
	return r.db.Delete(&Profile{}, profileId).Error
}

func (r *ProfileRepository) FindOneById(profileId int) (*Profile, error) {
	var profile Profile
	err := r.db.First(&profile, profileId).Error
	return &profile, err
}
