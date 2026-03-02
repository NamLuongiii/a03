package models

import (
	"time"

	"gorm.io/gorm"
)

type DigitalBook struct {
	ID        int            `json:"id" gorm:"primaryKey;autoIncrement:true"`
	BookID    string         `json:"book_id" gorm:"type:varchar(255);not null;index:idx_digital_books_book_id"`
	Name      string         `json:"name" gorm:"type:varchar(255)"`
	FileType  string         `json:"file_type" gorm:"type:varchar(50)"`
	FileSize  int64          `json:"file_size" gorm:"type:bigint"`
	URL       string         `json:"url" gorm:"type:varchar(500);not null"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index:idx_digital_books_deleted_at" swaggerignore:"true"`

	// Relationships
	Book *Book `json:"book,omitempty" gorm:"foreignKey:BookID"`
}

type DigitalBookRepositoryInterface interface {
	GetByID(id int) (*DigitalBook, error)
	Create(book *DigitalBook) error
	GetByIDAndBookID(id int, bookID string) (*DigitalBook, error)
	DeleteByID(id int) error
}

type DigitalBookRepository struct {
	db *gorm.DB
}

func NewDigitalBookRepository(db *gorm.DB) DigitalBookRepositoryInterface {
	return &DigitalBookRepository{db: db}
}

func (r *DigitalBookRepository) GetByID(id int) (*DigitalBook, error) {
	var digitalBook DigitalBook
	err := r.db.First(&digitalBook, id).Error
	return &digitalBook, err
}

func (r *DigitalBookRepository) Create(book *DigitalBook) error {
	err := r.db.Create(book).Error
	return err
}

func (r *DigitalBookRepository) GetByIDAndBookID(id int, bookID string) (*DigitalBook, error) {
	var digitalBook DigitalBook
	err := r.db.Where("id = ? AND book_id = ?", id, bookID).First(&digitalBook).Error
	return &digitalBook, err
}

func (r *DigitalBookRepository) DeleteByID(id int) error {
	err := r.db.Delete(&DigitalBook{}, id).Error
	return err
}
