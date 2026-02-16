package models

import (
	"time"

	"gorm.io/gorm"
)

type BookSeries struct {
	ID        int            `json:"id" gorm:"primaryKey;autoIncrement:true"`
	Name      string         `json:"name" gorm:"type:varchar(150);not null;index:idx_book_series_name"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index:idx_book_series_deleted_at" swaggerignore:"true"`
}

type BookSeriesRepositoryInterface interface {
	GetByName(name string) (*BookSeries, error)
}

type BookSeriesRepository struct {
	db *gorm.DB
}

func NewBookSeriesRepository(db *gorm.DB) BookSeriesRepositoryInterface {
	return &BookSeriesRepository{db: db}
}

func (r *BookSeriesRepository) GetByName(name string) (*BookSeries, error) {
	var bookSeries BookSeries
	err := r.db.Where("name = ?", name).First(&bookSeries).Error
	return &bookSeries, err
}
