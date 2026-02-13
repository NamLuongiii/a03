package models

import (
	"errors"
	"quickstart/functions"
	"time"

	"gorm.io/gorm"
)

type OTP struct {
	ID            int    `json:"id" gorm:"primaryKey;autoIncrement:true"`
	Hash          string `json:"hash" gorm:"not null"`
	ExpAt         int64  `json:"exp_at" gorm:"not null"`
	AttemptNumber int    `json:"attempt_number" gorm:"not null;default:0"`
	AccountID     int    `json:"account_id" gorm:"not null"`
}

type OTPRepositoryInterface interface {
	Create(accountID int, hash string) error
	FindByAccount(accountID int) (*OTP, error)
	Verify(input string, otp *OTP) error
	SetAttemptNumber(otp *OTP) error
}

type OTPRepository struct {
	Db *gorm.DB
}

func NewOTPRepository(db *gorm.DB) OTPRepositoryInterface {
	return &OTPRepository{Db: db}
}

func (repo *OTPRepository) Create(accountID int, hash string) error {
	otp, e := repo.FindByAccount(accountID)
	if e != nil && !errors.Is(e, gorm.ErrRecordNotFound) {
		return e
	}

	otp.Hash = hash
	otp.AttemptNumber = 0
	otp.ExpAt = time.Now().Add(5 * time.Minute).Unix()
	otp.AccountID = accountID
	return repo.Db.Save(otp).Error
}

func (repo *OTPRepository) FindByAccount(accountID int) (*OTP, error) {
	var otp OTP
	return &otp, repo.Db.First(&otp, "account_id = ?", accountID).Error
}

func (repo *OTPRepository) Verify(input string, otp *OTP) error {
	isEqual := functions.VerifyOTP(input, otp.Hash)
	if !isEqual {
		return errors.New("otp is invalid")
	}

	if time.Now().Unix() > otp.ExpAt {
		return errors.New("otp is expired")
	}

	if otp.AttemptNumber > 3 {
		return errors.New("otp is expired")
	}

	return nil
}

func (repo *OTPRepository) SetAttemptNumber(otp *OTP) error {
	otp.AttemptNumber++
	return repo.Db.Save(&otp).Error
}
