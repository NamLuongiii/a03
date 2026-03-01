package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"quickstart/dto"
	"quickstart/env"
	"quickstart/functions"
	"quickstart/models"
	"quickstart/types"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type AuthHandler struct {
	accountRepo models.AccountRepositoryInterface
	mailHandler *MailHandler
	OTPRepo     models.OTPRepositoryInterface
}

func NewAuthHandler(mailHandler *MailHandler, accountRepo models.AccountRepositoryInterface, OTPRepo models.OTPRepositoryInterface) *AuthHandler {
	return &AuthHandler{mailHandler: mailHandler, accountRepo: accountRepo, OTPRepo: OTPRepo}
}

// SignUp godoc
//
//	@Summary	create a user
//	@Tags		auth
//	@Router		/auth/signup [post]
//	@Param		user	body		types.SignUpDto								true	"user info"
//	@Success	200		{object}	types.CommonResponse{data=models.Account}	"Thành công"
func (h *AuthHandler) SignUp(c *gin.Context) {
	var body types.SignUpDto

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, types.CommonResponse{
			Success: false,
			Message: string(types.MessageInvalidCredentials),
		})
		return
	}

	err := h.accountRepo.Create(&body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.CommonResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
	})
}

// Login godoc
//
//	@Summary	Login user by name
//	@Tags		auth
//	@Router		/auth/login [post]
//	@Param		login	body		types.LoginRequest					true	"Login credentials"
//	@Success	200		{object}	types.CommonResponse{data=string}	"Thành công"
func (h *AuthHandler) Login(c *gin.Context) {

	handler := func() (string, error) {
		var req types.LoginRequest

		e := c.ShouldBindJSON(&req)
		if e != nil {
			return "", e
		}

		// find an account by email
		a, e := h.accountRepo.FindByEmailAndPassword(req.Email, req.Password)
		if e != nil {
			return "", e
		}

		t, e := functions.JWTObject.Create(&jwt.MapClaims{
			"ID":    a.ID,
			"Email": a.Email,
		})
		if e != nil {
			return "", e
		}

		return t, nil

	}

	t, e := handler()

	if e != nil {
		c.JSON(http.StatusInternalServerError, types.CommonResponse{
			Success: false,
			Message: e.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    t,
	})

}

// Me godoc
//
//	@Summary	Get current user info
//	@Tags		auth
//	@Router		/auth/me [get]
//	@Security	BearerAuth
//	@Success	200	{object}	types.CommonResponse{data=models.Account}	"Thành công"
func (h *AuthHandler) Me(c *gin.Context) {
	claims := c.MustGet(types.ContextKeyTokenClaims).(*types.AuthClaims)

	a, e := h.accountRepo.FindByID(claims.ID)
	if e != nil {
		c.JSON(http.StatusInternalServerError, types.CommonResponse{
			Success: false,
			Message: e.Error(),
		})
		return
	}

	if a == nil {
		c.JSON(http.StatusNotFound, types.CommonResponse{
			Success: false,
			Message: string(types.MessageUserNotFound),
		})
		return
	}

	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    a,
	})
}

func (h *AuthHandler) RequestChangePassword(c *gin.Context) {
	exe := func() error {
		var body dto.RequestChangePassword
		e := c.ShouldBindJSON(&body)
		if e != nil {
			return e
		}

		a, e := h.accountRepo.FindByEmail(body.Email)
		if e != nil {
			return errors.New("no account with this email")
		}

		OTP, e := functions.Create6DigitRandomNumber()
		if e != nil {
			return e
		}

		hash := functions.Sha256OTP(OTP)

		fmt.Println(123, a.ID)
		e = h.OTPRepo.Create(a.ID, hash)
		if e != nil {
			return e
		}

		return h.mailHandler.SendMail(a.Email, "Your OTP to change password", OTP)
	}

	e := exe()
	if e != nil {
		c.JSON(http.StatusInternalServerError, types.CommonResponse{
			Success: false,
			Message: e.Error(),
		})
	} else {
		c.JSON(http.StatusOK, types.CommonResponse{
			Success: true,
			Message: "Sent OTP",
		})
	}
}

func (h *AuthHandler) VerifyOTP(c *gin.Context) {

	exe := func() (string, error) {
		var body dto.VerifyOTP
		e := c.ShouldBindJSON(&body)
		if e != nil {
			return "", e
		}

		a, e := h.accountRepo.FindByEmail(body.Email)
		if e != nil {
			return "", errors.New("no account with this email")
		}

		otp, e := h.OTPRepo.FindByAccount(a.ID)
		if e != nil {
			return "", errors.New("no account with this email")
		}

		key, e := functions.JWTObject.CreateWithSecret(&jwt.MapClaims{
			"ID":    a.ID,
			"Email": a.Email,
		}, env.GetEnv(env.OTPSecret))
		if e != nil {
			return "", e
		}

		return key, h.OTPRepo.Verify(body.OTP, otp)
	}
	key, e := exe()
	if e != nil {
		c.JSON(http.StatusInternalServerError, types.CommonResponse{
			Success: false,
			Message: e.Error(),
		})
	} else {
		c.JSON(http.StatusOK, types.CommonResponse{
			Success: true,
			Data:    key,
		})
	}

}

func (h *AuthHandler) ResetPassword(c *gin.Context) {
	exe := func() error {
		var body dto.ResetPassword
		e := c.ShouldBindJSON(&body)
		if e != nil {
			return e
		}

		t, e := jwt.ParseWithClaims(body.Token, &dto.ResetOTPClaim{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(env.GetEnv(env.OTPSecret)), nil
		})
		if e != nil {
			return e
		}
		claims, ok := t.Claims.(*dto.ResetOTPClaim)
		if !ok || !t.Valid {
			return errors.New("invalid token")
		}

		if claims.Email != body.Email {
			return errors.New("invalid email")
		}

		return h.accountRepo.UpdatePassword(claims.Email, body.NewPassword)
	}

	e := exe()
	if e != nil {
		c.JSON(http.StatusInternalServerError, types.CommonResponse{
			Success: false,
			Message: e.Error(),
		})
	} else {
		c.JSON(http.StatusOK, types.CommonResponse{
			Success: true,
			Message: "Reset Password Success",
		})
	}
}
