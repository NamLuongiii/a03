package models

import (
	"errors"
	"quickstart/types"
	"time"

	"github.com/gosimple/slug"
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
	GetAll(page int, size int, search string) (types.PaginationData, error)
	Create(author *Author) error
	GetOrCreate(name string) (*Author, error)
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

func (r *AuthorRepository) GetAll(page int, size int, search string) (types.PaginationData, error) {
	var authors []Author
	query := r.db.Model(&Author{}).
		Where("name LIKE ?", "%"+search+"%").
		Order("name ASC")
	if page != 0 && size != 0 {
		query = query.Offset((page - 1) * size).Limit(size)
	}
	err := query.Find(&authors).Error
	if err != nil {
		return types.PaginationData{}, err
	}
	total := query.RowsAffected
	return types.PaginationData{
		Items: authors,
		Total: total,
		Page:  page,
		Size:  size,
	}, nil
}

func (r *AuthorRepository) Create(author *Author) error {
	return r.db.Create(author).Error
}

func (r *AuthorRepository) GetOrCreate(name string) (*Author, error) {
	id := slug.Make(name)
	if len(id) < 4 {
		return nil, errors.New("Author name must be at least 4 characters long")
	}
	author := Author{ID: id, Name: name}
	err := r.db.Where("id = ?", id).FirstOrCreate(&author).Error
	return &author, err
}
