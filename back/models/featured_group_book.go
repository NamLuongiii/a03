package models

import "gorm.io/gorm"

type FeaturedGroupBook struct {
	GroupID int `json:"group_id" gorm:"not null;primaryKey;uniqueIndex:idx_featured_group_books_group_book"`
	BookID  int `json:"book_id" gorm:"not null;primaryKey;index:idx_featured_group_books_book_id;uniqueIndex:idx_featured_group_books_group_book"`

	// Relationships
	Group *FeaturedBookGroup `json:"group,omitempty" gorm:"foreignKey:GroupID"`
	Book  *Book              `json:"book,omitempty" gorm:"foreignKey:BookID"`
}

type FeaturedGroupBookRepositoryInterface interface {
	GetByGroupIDAndBookID(groupID, bookID int) (*FeaturedGroupBook, error)
}

type FeaturedGroupBookRepository struct {
	db *gorm.DB
}

func NewFeaturedGroupBookRepository(db *gorm.DB) FeaturedGroupBookRepositoryInterface {
	return &FeaturedGroupBookRepository{db: db}
}

func (r *FeaturedGroupBookRepository) GetByGroupIDAndBookID(groupID, bookID int) (*FeaturedGroupBook, error) {
	var featuredGroupBook FeaturedGroupBook
	err := r.db.Where("group_id = ? AND book_id = ?", groupID, bookID).First(&featuredGroupBook).Error
	return &featuredGroupBook, err
}
