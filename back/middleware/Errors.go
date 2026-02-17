package middleware

import (
	"errors"
	"net/http"
	"quickstart/types"

	"github.com/gin-gonic/gin"
)

type AppError struct {
	message string
	code    int
}

func (e *AppError) Error() string {
	return e.message
}

func NewBadRequestError(message string) error {
	return &AppError{message: message, code: http.StatusBadRequest}
}

func NewServerInternalError(message string) error {
	return &AppError{message: message, code: http.StatusInternalServerError}
}

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next() // Step1: Process the request first.

		// Step2: Check if any errors were added to the context
		if len(c.Errors) > 0 {
			// Step3: Use the last error
			err := c.Errors.Last().Err

			// check error is AppError
			var appErr *AppError
			ok := errors.As(err, &appErr)
			if ok {
				c.JSON(appErr.code, types.CommonResponse{
					Success: false,
					Message: appErr.message,
				})
			} else {
				c.JSON(http.StatusInternalServerError, types.CommonResponse{
					Success: false,
					Message: err.Error(),
				})
			}

			c.Abort()
			return
		}
	}
}
