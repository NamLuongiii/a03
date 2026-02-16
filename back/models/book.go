package models

import (
	"time"

	"gorm.io/gorm"
)

type Book struct {
	ID           string         `json:"id" gorm:"primaryKey;type:varchar(255)"`
	Name         string         `json:"name" gorm:"type:varchar(255);not null;index:idx_books_name"`
	Description  string         `json:"description" gorm:"type:text"`
	Summary      string         `json:"summary" gorm:"type:text"`
	ViewNums     int            `json:"view_nums" gorm:"default:0"`
	DownloadNums int            `json:"download_nums" gorm:"default:0"`
	RatingAvg    float64        `json:"rating_avg" gorm:"default:0"`
	RatingCount  int            `json:"rating_count" gorm:"default:0"`
	Cover        string         `json:"cover" gorm:"type:varchar(255)"`
	IsHidden     bool           `json:"is_hidden" gorm:"default:false;index:idx_books_is_hidden_deleted_at,priority:1"`
	CategoryID   string         `json:"category_id" gorm:"type:varchar(255);not null;index:idx_books_category_id"`
	AuthorID     string         `json:"author_id" gorm:"type:varchar(255);not null;index:idx_books_author_id"`
	SeriesID     *string        `json:"series_id,omitempty" gorm:"type:varchar(255);index:idx_books_series_id"`
	CreatedBy    int            `json:"created_by" gorm:"not null;index:idx_books_created_by"`
	CreatedAt    time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt    gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index:idx_books_deleted_at;index:idx_books_is_hidden_deleted_at,priority:2" swaggerignore:"true"`

	// Relationships
	Category *Category   `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	Author   *Author     `json:"author,omitempty" gorm:"foreignKey:AuthorID"`
	Series   *BookSeries `json:"series,omitempty" gorm:"foreignKey:SeriesID"`
	Creator  *Account    `json:"creator,omitempty" gorm:"foreignKey:CreatedBy"`
}

type BookRepositoryInterface interface {
	GetByID(id string) (*Book, error)
	Create(book *Book) error
}

type BookRepository struct {
	db *gorm.DB
}

func NewBookRepository(db *gorm.DB) BookRepositoryInterface {
	return &BookRepository{db: db}
}

func (r *BookRepository) GetByID(id string) (*Book, error) {
	var book Book
	err := r.db.Where("id = ?", id).First(&book).Error
	return &book, err
}

func (r *BookRepository) Create(book *Book) error {
	return r.db.Create(book).Error
}
