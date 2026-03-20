package types

import "github.com/golang-jwt/jwt/v5"

type CommonResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type SignUpDto struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthClaims struct {
	Email string `json:"Email"`
	ID    int    `json:"ID"`
	Role  string `json:"Role"`
	jwt.RegisteredClaims
}

type ProfileDto struct {
	Name      string `json:"name"`
	BirthYear int    `json:"birth_year"`
}

type ActivityDto struct {
	LessonName  string `json:"lesson_name"`
	EarnedStars int    `json:"earned_stars"`
	Result      string `json:"result"`
}

type PaginationParams struct {
	Size     int
	Page     int
	Category string
	Search   string
	Author   string
}

type PaginationData struct {
	Size  int         `json:"size"`
	Page  int         `json:"page"`
	Total int64       `json:"total"`
	Items interface{} `json:"items"`
}
