package models

import (
	"time"

	"gorm.io/gorm"
)

type BookRating struct {
	ID        int            `json:"id" gorm:"primaryKey;autoIncrement:true"`
	BookID    string         `json:"book_id" gorm:"type:varchar(255);not null;index:idx_book_ratings_book_id;uniqueIndex:idx_book_ratings_book_account"`
	AccountID int            `json:"account_id" gorm:"not null;index:idx_book_ratings_account_id;uniqueIndex:idx_book_ratings_book_account"`
	Rating    int            `json:"rating" gorm:"not null;comment:1-5"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index:idx_book_ratings_deleted_at" swaggerignore:"true"`

	// Relationships
	Book    *Book    `json:"book,omitempty" gorm:"foreignKey:BookID"`
	Account *Account `json:"account,omitempty" gorm:"foreignKey:AccountID"`
}

type BookRatingRepositoryInterface interface {
	GetByID(id int) (*BookRating, error)
}

type BookRatingRepository struct {
	db *gorm.DB
}

func NewBookRatingRepository(db *gorm.DB) BookRatingRepositoryInterface {
	return &BookRatingRepository{db: db}
}

func (r *BookRatingRepository) GetByID(id int) (*BookRating, error) {
	var bookRating BookRating
	err := r.db.First(&bookRating, id).Error
	return &bookRating, err
}
