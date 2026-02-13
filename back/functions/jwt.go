package functions

import (
	"quickstart/env"

	"github.com/golang-jwt/jwt/v5"
)

type JWT struct{}

var JWTObject = JWT{}

func (o *JWT) Create(claim *jwt.MapClaims) (string, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, *claim)
	return t.SignedString([]byte(env.GetEnv(env.JWTSecret)))
}

func (o *JWT) CreateWithSecret(claim *jwt.MapClaims, secret string) (string, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, *claim)
	return t.SignedString([]byte(secret))
}
