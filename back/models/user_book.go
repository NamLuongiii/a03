package models

import (
	"time"

	"gorm.io/gorm"
)

type UserBook struct {
	AccountID int       `json:"account_id" gorm:"primary_key;index:idx_user_books_account_id"`
	BookID    string    `json:"book_id" gorm:"primary_key"`
	Status    string    `json:"status" gorm:"type:varchar(20)"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`

	Book *Book `json:"book" gorm:"foreignKey:BookID"`
}

type UserBookRepositoryInterface interface {
	Create(userBook *UserBook) error
	DeleteByID(userID int, bookID string) error
	GetBooksByUser(userID int, limit int) ([]UserBook, error)
	FindByID(userID int, bookID string) (*UserBook, error)
}

type UserBookRepository struct {
	db *gorm.DB
}

func NewUserBookRepository(db *gorm.DB) UserBookRepositoryInterface {
	return &UserBookRepository{db: db}
}

func (r *UserBookRepository) Create(userBook *UserBook) error {
	if err := r.db.Create(userBook).Error; err != nil {
		return err
	}

	return nil
}

func (r *UserBookRepository) DeleteByID(userID int, bookID string) error {
	r.db.Where("account_id = ? AND book_id = ?", userID, bookID).Delete(&UserBook{})
	return nil
}

func (r *UserBookRepository) GetBooksByUser(userID int, limit int) ([]UserBook, error) {
	var userBooks []UserBook

	// Lấy dữ liệu từ bảng UserBook và "kéo" luôn thông tin Book đi kèm
	err := r.db.Where("account_id = ?", userID).
		Preload("Book"). // GORM tự động lấy thông tin sách dựa trên BookID
		Limit(limit).
		Order("created_at DESC").
		Find(&userBooks).Error

	return userBooks, err
}

func (r *UserBookRepository) FindByID(userID int, bookID string) (*UserBook, error) {
	var userBook UserBook
	err := r.db.Where("account_id = ? AND book_id = ?", userID, bookID).First(&userBook).Error

	return &userBook, err
}
