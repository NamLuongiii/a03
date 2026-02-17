package models

import (
	"time"

	"gorm.io/gorm"
)

type Comment struct {
	ID        int            `json:"id" gorm:"primaryKey;autoIncrement:true"`
	BookID    string         `json:"book_id" gorm:"type:varchar(255);not null;index:idx_comments_book_id"`
	AccountID int            `json:"account_id" gorm:"not null;index:idx_comments_account_id"`
	Title     string         `json:"title" gorm:"type:varchar(255)"`
	Content   string         `json:"content" gorm:"type:text;not null"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index:idx_comments_deleted_at" swaggerignore:"true"`

	// Relationships
	Book    *Book    `json:"book,omitempty" gorm:"foreignKey:BookID"`
	Account *Account `json:"account,omitempty" gorm:"foreignKey:AccountID"`
}

type CommentRepositoryInterface interface {
	GetByID(id int) (*Comment, error)
}

type CommentRepository struct {
	db *gorm.DB
}

func NewCommentRepository(db *gorm.DB) CommentRepositoryInterface {
	return &CommentRepository{db: db}
}

func (r *CommentRepository) GetByID(id int) (*Comment, error) {
	var comment Comment
	err := r.db.First(&comment, id).Error
	return &comment, err
}
