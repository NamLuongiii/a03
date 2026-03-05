package models

import (
	"quickstart/types"
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
	RatingAvg    float64        `json:"rating_avg" gorm:"default:0;type:float"`
	RatingCount  int            `json:"rating_count" gorm:"default:0"`
	IsHidden     bool           `json:"is_hidden" gorm:"default:false;index:idx_books_is_hidden;index:idx_books_is_hidden_deleted_at,priority:1"`
	UnzipRootURL string         `json:"unzip_root_url" gorm:"type:text"`
	CoverID      *int           `json:"cover_id,omitempty" gorm:"type:int"`
	CategoryID   *string        `json:"category_id,omitempty" gorm:"type:varchar(255);index:idx_books_category_id"`
	AuthorID     *string        `json:"author_id,omitempty" gorm:"type:varchar(255);index:idx_books_author_id"`
	SeriesID     *string        `json:"series_id,omitempty" gorm:"type:varchar(255);index:idx_books_series_id"`
	CreatedBy    *int           `json:"created_by,omitempty" gorm:"type:int;index:idx_books_created_by"`
	CreatedAt    time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt    gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index:idx_books_deleted_at;index:idx_books_is_hidden_deleted_at,priority:2" swaggerignore:"true"`

	// Relationships
	Category     *Category     `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	Author       *Author       `json:"author,omitempty" gorm:"foreignKey:AuthorID"`
	Series       *BookSeries   `json:"series,omitempty" gorm:"foreignKey:SeriesID"`
	Creator      *Account      `json:"creator,omitempty" gorm:"foreignKey:CreatedBy"`
	Cover        *Image        `json:"cover,omitempty" gorm:"foreignKey:CoverID"`
	DigitalBooks []DigitalBook `json:"digital_books,omitempty" gorm:"foreignKey:BookID"`
}

type BookRepositoryInterface interface {
	GetByID(id string) (*Book, error)
	Create(book *Book) error
	GetAll(params types.PaginationParams) (types.PaginationData, error)
	GetNewestBooks(limit int) ([]Book, error)
	GetPopularBooks(limit int) ([]Book, error)
	GetBooksOtherUserRead(limit int) ([]Book, error)
	Update(book *Book) error
	Delete(id string) error
}

type BookRepository struct {
	db *gorm.DB
}

func NewBookRepository(db *gorm.DB) BookRepositoryInterface {
	return &BookRepository{db: db}
}

func (r *BookRepository) GetByID(id string) (*Book, error) {
	var book Book
	err := r.db.
		Preload("Cover").
		Preload("DigitalBooks").
		Preload("Category").
		Preload("Author").
		Preload("Series").
		Where("id = ?", id).
		First(&book).Error
	return &book, err
}

func (r *BookRepository) Create(book *Book) error {
	return r.db.Create(book).Error
}

func (r *BookRepository) GetAll(params types.PaginationParams) (types.PaginationData, error) {
	var books []Book
	query := r.db.Model(&Book{}).
		Preload("Cover").
		Preload("Author")

	// 1. Filtering by Category
	if params.Category != "" {
		query = query.Where("category_id = ?", params.Category)
	}

	// 2. Searching (Title or Description)
	if params.Search != "" {
		searchTerm := "%" + params.Search + "%"
		query = query.Where("name LIKE ? OR description LIKE ?", searchTerm, searchTerm)
	}

	// 3. Pagination
	// Calculate offset: (page - 1) * size
	offset := (params.Page - 1) * params.Size

	// 4. Total count
	var total int64
	query.Count(&total)

	// 5. Order by created_at desc
	query = query.Order("created_at DESC")

	err := query.Limit(params.Size).Offset(offset).Find(&books).Error

	return types.PaginationData{
		Page:  params.Page,
		Size:  params.Size,
		Total: total,
		Items: books,
	}, err
}

func (r *BookRepository) GetNewestBooks(limit int) ([]Book, error) {
	var books []Book
	err := r.db.
		Preload("Cover").
		Preload("Author").
		Order("created_at desc").
		Limit(limit).
		Find(&books).Error
	return books, err
}

func (r *BookRepository) GetPopularBooks(limit int) ([]Book, error) {
	var books []Book
	err := r.db.
		Preload("Cover").
		Preload("Author").
		Order("created_at desc").
		Limit(limit).
		Find(&books).Error
	return books, err
}

func (r *BookRepository) GetBooksOtherUserRead(limit int) ([]Book, error) {
	var books []Book
	err := r.db.
		Preload("Cover").
		Preload("Author").
		Order("created_at desc").
		Limit(limit).
		Find(&books).Error
	return books, err
}

func (r *BookRepository) Update(book *Book) error {
	return r.db.Model(book).Select("*").Updates(book).Error
}

func (r *BookRepository) Delete(id string) error {
	return r.db.Delete(&Book{}, id).Error
}
