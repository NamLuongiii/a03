package env

import "os"

type Env string

const (
	JWTSecret    Env = "JWT_SECRET"
	MailAddress      = "MAIL_ADDRESS"
	MailPassword     = "MAIL_PASSWORD"
	MailHost         = "MAIL_HOST"
	OTPSecret        = "OTP_SECRET"
)

func SetupEnv() {
	// Here you would typically load environment variables from a file or the system
	// For example, using os.Setenv or a library like godotenv

	err1 := os.Setenv(string(JWTSecret), "123456789abcdef") // Example secret
	if err1 != nil {
		panic(err1)
	}
	err2 := os.Setenv(string(MailAddress), "luongkhacnam222@gmail.com")
	if err2 != nil {
		panic(err2)
	}
	err3 := os.Setenv(string(MailPassword), "bicl ebko ohiu jmpg")
	if err3 != nil {
		panic(err3)
	}
	err4 := os.Setenv(string(MailHost), "smtp.gmail.com")
	if err4 != nil {
		panic(err4)
	}
	err5 := os.Setenv(string(OTPSecret), "123456")
	if err5 != nil {
		panic(err5)
	}
}

func GetEnv(key Env) string {
	return os.Getenv(string(key))
}
