package functions

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"math/big"
	"quickstart/env"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	// Implementation for hashing password
	bytes, e := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), e
}

func VerifyPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func Create6DigitRandomNumber() (string, error) {
	maxN := big.NewInt(1000000)
	n, e := rand.Int(rand.Reader, maxN)

	if e != nil {
		return "", e
	}
	return fmt.Sprintf("%06d", n.Int64()), nil
}

func Sha256OTP(otp string) string {
	sum := sha256.Sum256([]byte(otp + env.GetEnv(env.OTPSecret)))
	return hex.EncodeToString(sum[:])
}

func VerifyOTP(otp string, hash string) bool {
	_h := Sha256OTP(otp)
	return _h == hash
}
