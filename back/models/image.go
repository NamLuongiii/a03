package models

import "gorm.io/gorm"

type Image struct {
	ID int    `json:"id" gorm:"primaryKey;autoIncrement:true"`
	XS string `json:"xs" gorm:"type:varchar(500)"`
	SM string `json:"sm" gorm:"type:varchar(500)"`
	MD string `json:"md" gorm:"type:varchar(500)"`
}

type ImageRepositoryInterface interface {
	GetByID(id int) (*Image, error)
	Create(image *Image) error
}

type ImageRepository struct {
	db *gorm.DB
}

func NewImageRepository(db *gorm.DB) ImageRepositoryInterface {
	return &ImageRepository{db: db}
}

func (r *ImageRepository) GetByID(id int) (*Image, error) {
	var image Image
	err := r.db.First(&image, id).Error
	return &image, err
}

func (r *ImageRepository) Create(image *Image) error {
	return r.db.Create(image).Error
}
