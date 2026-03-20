package models

import (
	"time"

	"gorm.io/gorm"
)

type Tags struct {
	ID          int    `json:"id" gorm:"primaryKey"`
	Name        string `json:"name" gorm:"unique"`
	Description string `json:"description"`
	CreatedAt   time.Time
}

type TagsRepositoryInterface interface {
	GetByName(name string) (*Tags, error)
	GetAll() ([]Tags, error)
}

type TagsRepository struct {
	db *gorm.DB
}

func CreateTagsRepository(db *gorm.DB) TagsRepository {
	return TagsRepository{db: db}
}

func (r *TagsRepository) GetByName(name string) (*Tags, error) {
	var tags Tags
	err := r.db.First(&tags, "name = ?", name).Error
	return &tags, err
}

func (r *TagsRepository) GetAll() ([]Tags, error) {
	var tags []Tags
	err := r.db.Find(&tags).Error
	return tags, err
}
