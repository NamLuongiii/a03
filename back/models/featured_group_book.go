package models

import "gorm.io/gorm"

type FeaturedGroupBook struct {
	GroupID string `json:"group_id" gorm:"type:varchar(255);not null;primaryKey;uniqueIndex:idx_featured_group_books_group_book"`
	BookID  string `json:"book_id" gorm:"type:varchar(255);not null;primaryKey;index:idx_featured_group_books_book_id;uniqueIndex:idx_featured_group_books_group_book"`

	// Relationships
	Group *FeaturedBookGroup `json:"group,omitempty" gorm:"foreignKey:GroupID"`
	Book  *Book              `json:"book,omitempty" gorm:"foreignKey:BookID"`
}

type FeaturedGroupBookRepositoryInterface interface {
	GetByGroupIDAndBookID(groupID, bookID string) (*FeaturedGroupBook, error)
}

type FeaturedGroupBookRepository struct {
	db *gorm.DB
}

func NewFeaturedGroupBookRepository(db *gorm.DB) FeaturedGroupBookRepositoryInterface {
	return &FeaturedGroupBookRepository{db: db}
}

func (r *FeaturedGroupBookRepository) GetByGroupIDAndBookID(groupID, bookID string) (*FeaturedGroupBook, error) {
	var featuredGroupBook FeaturedGroupBook
	err := r.db.Where("group_id = ? AND book_id = ?", groupID, bookID).First(&featuredGroupBook).Error
	return &featuredGroupBook, err
}
