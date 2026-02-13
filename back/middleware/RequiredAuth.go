package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"quickstart/env"
	"quickstart/types"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequiredAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from the header
		tokenString := c.GetHeader("Authorization")
		fmt.Println("Secret", env.GetEnv(env.JWTSecret))
		parseAndValidateToken := func(tokenString string) (*types.AuthClaims, error) {
			t, e := jwt.ParseWithClaims(tokenString, &types.AuthClaims{}, func(token *jwt.Token) (interface{}, error) {
				return []byte(env.GetEnv(env.JWTSecret)), nil
			})

			if e != nil {
				return nil, e
			}

			claims, ok := t.Claims.(*types.AuthClaims)
			if !ok || !t.Valid {
				return nil, errors.New("invalid token")
			}

			return claims, nil
		}

		claims, e := parseAndValidateToken(tokenString)

		if e != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, types.CommonResponse{
				Success: false,
				Message: e.Error(),
			})
			return
		}

		// Set email in context for further handlers to use
		c.Set(types.ContextKeyTokenClaims, claims)

		c.Next()
	}
}
