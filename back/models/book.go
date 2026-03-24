package models

import (
	"errors"
	"quickstart/types"
	"time"

	"github.com/gosimple/slug"
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
	CoverID      *int           `json:"cover_id,omitempty" gorm:"type:int;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	CategoryID   *string        `json:"category_id,omitempty" gorm:"type:varchar(255);index:idx_books_category_id"`
	AuthorID     *string        `json:"author_id,omitempty" gorm:"type:varchar(255);index:idx_books_author_id"`
	SeriesID     *string        `json:"series_id,omitempty" gorm:"type:varchar(255);index:idx_books_series_id"`
	CreatedBy    *int           `json:"created_by,omitempty" gorm:"type:int;index:idx_books_created_by"`
	CreatedAt    time.Time      `json:"created_at" gorm:"autoCreateTime;index:idx_books_created_at"`
	UpdatedAt    time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt    gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index:idx_books_deleted_at;index:idx_books_deleted_created,priority:1;index:idx_books_is_hidden_deleted_at,priority:2" swaggerignore:"true"`

	// Relationships
	Category     *Category     `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	Author       *Author       `json:"author,omitempty" gorm:"foreignKey:AuthorID"`
	Series       *BookSeries   `json:"series,omitempty" gorm:"foreignKey:SeriesID"`
	Creator      *Account      `json:"creator,omitempty" gorm:"foreignKey:CreatedBy"`
	Cover        *Image        `json:"cover,omitempty" gorm:"foreignKey:CoverID"`
	DigitalBooks []DigitalBook `json:"digital_books,omitempty" gorm:"foreignKey:BookID"`
	UserBooks    []UserBook    `json:"user_books,omitempty" gorm:"foreignKey:BookID"`
}

type BookRepositoryInterface interface {
	GetByID(id string) (*Book, error)
	Create(book *Book) error
	GetAll(params types.PaginationParams) (types.PaginationData, error)
	GetNewestBooks(limit int) ([]Book, error)
	GetPopularBooks(limit int) ([]Book, error)
	GetBooksOtherUserRead(limit int) ([]Book, error)
	GetMostViewedBooks(limit int) ([]Book, error)
	Update(book *Book) error
	Delete(id string) error
	GetByIDSimple(id string) (Book, error)
	GetByAuthorID(authorID string) ([]Book, error)
	UpdateBookCategory(bookID string, categoryID string) error
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
	if e := r.validateName(book.Name); e != nil {
		return e
	}
	return r.db.Create(book).Error
}

func (r *BookRepository) GetAll(params types.PaginationParams) (types.PaginationData, error) {
	var books []Book
	var total int64

	// Khởi tạo query trên model Book
	query := r.db.Model(&Book{})

	// 1. Lọc theo Category
	if params.Category != "" {
		query = query.Where("books.category_id = ?", params.Category)
	}

	// 2. Lọc theo Author Name (Dùng Joins theo phong cách Type ORM)
	if params.Author != "" {
		// "Author" là tên trường (Field) trong struct Book
		// GORM sẽ tự động Join bảng authors
		query = query.Joins("Author").Where("Author.name LIKE ?", "%"+params.Author+"%")
	}

	// 3. Tìm kiếm (Title hoặc Description)
	if params.Search != "" {
		searchTerm := "%" + params.Search + "%"
		// Gom nhóm điều kiện bằng Group để không làm loạn logic Join/Where khác
		query = query.Where(r.db.Where("books.name LIKE ?", searchTerm).Or("books.description LIKE ?", searchTerm))
	}

	// 4. Đếm tổng số (Phải thực hiện trước khi Limit/Offset)
	query.Count(&total)

	// 5. Preload dữ liệu liên quan
	query = query.Preload("Cover").Preload("Author").Preload("Category")

	// 6. Phân trang và Sắp xếp
	// Luôn chỉ định "books.created_at" để tránh lỗi ambiguous khi có Join
	offset := (params.Page - 1) * params.Size
	err := query.Order("books.created_at DESC").
		Limit(params.Size).
		Offset(offset).
		Find(&books).Error

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
	if e := r.validateName(book.Name); e != nil {
		return e
	}
	return r.db.Model(book).Select("*").Updates(book).Error
}

func (r *BookRepository) Delete(id string) error {
	// 1. Tìm thông tin sách trước để lấy ID của Cover và danh sách DigitalBooks
	// (Cần thiết nếu bạn muốn xóa file vật lý sau đó)
	var book Book
	if err := r.db.Preload("DigitalBooks").First(&book, "id = ?", id).Error; err != nil {
		return err
	}

	// 2. Thực hiện xóa Book và các quan hệ 1-n (DigitalBooks) và 1-1 (Cover)
	// "Cover" và "DigitalBooks" phải khớp với tên trường trong struct Book của bạn
	return r.db.Select("Cover", "DigitalBooks").Delete(&book).Error
}

func (r *BookRepository) GetByIDSimple(id string) (Book, error) {
	var book Book
	err := r.db.
		Where("id = ?", id).
		First(&book).Error
	return book, err
}

func (r *BookRepository) validateName(name string) error {
	n := slug.Make(name)

	if len(n) < 4 {
		return errors.New("Name must be at least 4 characters long")
	}
	return nil
}

func (r *BookRepository) GetByAuthorID(authorID string) ([]Book, error) {
	var books []Book
	err := r.db.
		Preload("Cover").
		Preload("Category").
		Where("author_id = ?", authorID).
		Find(&books).Error
	return books, err
}

func (r *BookRepository) UpdateBookCategory(bookID string, categoryID string) error {
	return r.db.Model(&Book{}).Where("id = ?", bookID).Update("category_id", categoryID).Error
}

func (r *BookRepository) GetMostViewedBooks(limit int) ([]Book, error) {
	var books []Book
	err := r.db.
		Preload("Cover").
		Preload("Author").
		Preload("Category").
		Order("view_nums DESC").
		Limit(limit).
		Find(&books).Error
	return books, err
}
