package models

import (
	"errors"
	"quickstart/functions"
	"quickstart/types"

	"gorm.io/gorm"
)

type Account struct {
	ID        int     `json:"id" gorm:"primaryKey;autoIncrement:true"`
	Name      string  `json:"name" gorm:"not null"`
	Email     string  `json:"email" gorm:"unique"`
	HPassword string  `json:"-" gorm:"column:h_password;not null"`
	Profile   Profile `json:"profile" gorm:"foreignKey:AccountID"`
}

type AccountRepositoryInterface interface {
	Create(dto *types.SignUpDto) error
	FindByEmailAndPassword(email string, password string) (*Account, error)
	FindByID(id int) (*Account, error)
	FindByEmail(email string) (*Account, error)
	UpdatePassword(email string, password string) error
}

type AccountRepository struct {
	db *gorm.DB
}

func NewAccountRepository(db *gorm.DB) AccountRepositoryInterface {
	return &AccountRepository{db: db}
}

func (r *AccountRepository) Create(dto *types.SignUpDto) error {
	hp, e := functions.HashPassword(dto.Password)

	if e != nil {
		return e
	}

	account := &Account{
		Name:      dto.Name,
		Email:     dto.Email,
		HPassword: hp,
	}
	return r.db.Create(account).Error
}

func (r *AccountRepository) FindByEmailAndPassword(email string, password string) (*Account, error) {
	var account Account
	err := r.db.Where("email = ?", email).First(&account).Error
	if err != nil {
		return nil, err
	}

	if functions.VerifyPassword(password, account.HPassword) {
		return &account, nil
	}
	return nil, errors.New("invalid password")
}

func (r *AccountRepository) FindByID(id int) (*Account, error) {
	var account Account
	err := r.db.First(&account, id).Error
	return &account, err
}

func (r *AccountRepository) FindByEmail(email string) (*Account, error) {
	var account Account
	err := r.db.Where("email = ?", email).First(&account).Error
	return &account, err
}

func (r *AccountRepository) UpdatePassword(email string, password string) error {
	hp, e := functions.HashPassword(password)
	if e != nil {
		return e
	}

	a, e := r.FindByEmail(email)
	if e != nil {
		return e
	}

	a.HPassword = hp
	return r.db.Save(a).Error
}
