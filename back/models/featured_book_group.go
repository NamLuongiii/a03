package models

import (
	"time"

	"gorm.io/gorm"
)

type FeaturedBookGroup struct {
	ID        string         `json:"id" gorm:"primaryKey;type:varchar(255)"`
	Name      string         `json:"name" gorm:"type:varchar(150);not null;index:idx_featured_book_groups_name"`
	Content   string         `json:"content" gorm:"type:text"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index:idx_featured_book_groups_deleted_at" swaggerignore:"true"`
}

type FeaturedBookGroupRepositoryInterface interface {
	GetByName(name string) (*FeaturedBookGroup, error)
}

type FeaturedBookGroupRepository struct {
	db *gorm.DB
}

func NewFeaturedBookGroupRepository(db *gorm.DB) FeaturedBookGroupRepositoryInterface {
	return &FeaturedBookGroupRepository{db: db}
}

func (r *FeaturedBookGroupRepository) GetByName(name string) (*FeaturedBookGroup, error) {
	var featuredBookGroup FeaturedBookGroup
	err := r.db.Where("name = ?", name).First(&featuredBookGroup).Error
	return &featuredBookGroup, err
}
