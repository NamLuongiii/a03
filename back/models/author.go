package models

import (
	"time"

	"gorm.io/gorm"
)

type Author struct {
	ID        string         `json:"id" gorm:"primaryKey;type:varchar(255)"`
	Name      string         `json:"name" gorm:"type:varchar(150);not null;index:idx_authors_name"`
	Country   string         `json:"country" gorm:"type:varchar(100)"`
	Summary   string         `json:"summary" gorm:"type:text"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index:idx_authors_deleted_at" swaggerignore:"true"`
}

type AuthorRepositoryInterface interface {
	GetByID(id string) (*Author, error)
}

type AuthorRepository struct {
	db *gorm.DB
}

func NewAuthorRepository(db *gorm.DB) AuthorRepositoryInterface {
	return &AuthorRepository{db: db}
}

func (r *AuthorRepository) GetByID(id string) (*Author, error) {
	var author Author
	err := r.db.Where("id = ?", id).First(&author).Error
	return &author, err
}
