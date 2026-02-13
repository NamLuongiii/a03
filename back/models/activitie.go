package models

import (
	"time"

	"gorm.io/gorm"
)

type Activity struct {
	ID          int       `json:"id" gorm:"primaryKey;autoIncrement:true"`
	LessonName  string    `json:"lesson_name"`
	EarnedStars int       `json:"earned_stars"`
	Result      string    `json:"result"`
	LogAt       time.Time `json:"log_at" gorm:"autoCreateTime:true"`
	ProfileID   int       `json:"profile_id" gorm:"not null"`
}

type ActivityRepositoryInterface interface {
	Create(activity *Activity) error
	FindByProfileID(profileID int) ([]Activity, error)
}

type ActivityRepository struct {
	db *gorm.DB
}

func NewActivityRepository(db *gorm.DB) ActivityRepositoryInterface {
	return &ActivityRepository{db: db}
}

func (ar *ActivityRepository) Create(activity *Activity) error {
	return ar.db.Create(activity).Error
}

func (ar *ActivityRepository) FindByProfileID(profileID int) ([]Activity, error) {
	var activities []Activity
	err := ar.db.Where("profile_id = ?", profileID).Find(&activities).Error
	return activities, err
}
