package dto

import (
	"quickstart/models"

	"github.com/golang-jwt/jwt/v5"
)

type RequestChangePassword struct {
	Email string `json:"email"`
}

type VerifyOTP struct {
	OTP   string `json:"otp"`
	Email string `json:"email"`
}

type ResetPassword struct {
	Email       string `json:"email"`
	Token       string `json:"token"`
	NewPassword string `json:"new_password"`
}

type ResetOTPClaim struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
	jwt.RegisteredClaims
}

type CommentDto struct {
	Text  string `json:"text"`
	Title string `json:"title"`
}

type RatingDto struct {
	Rating int `json:"rating"`
}

type AuthorDetailResponse struct {
	Author *models.Author `json:"author"`
	Books  []models.Book  `json:"books"`
}
