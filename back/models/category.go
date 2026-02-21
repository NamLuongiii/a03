package models

import (
	"time"

	"gorm.io/gorm"
)

type Category struct {
	ID        string         `json:"id" gorm:"primaryKey;type:varchar(255)"`
	Name      string         `json:"name" gorm:"type:varchar(255);not null;uniqueIndex"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index" swaggerignore:"true"`
}

type CategoryRepositoryInterface interface {
	GetByName(name string) (*Category, error)
	GetAll() ([]Category, error)
}

type CategoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) CategoryRepositoryInterface {
	return &CategoryRepository{db: db}
}

func (r *CategoryRepository) GetByName(name string) (*Category, error) {
	var category Category
	err := r.db.Where("name = ?", name).First(&category).Error
	return &category, err
}

func (r *CategoryRepository) GetAll() ([]Category, error) {
	var categories []Category
	err := r.db.Find(&categories).Error
	return categories, err
}
