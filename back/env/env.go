package env

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Env string

const (
	JWTSecret     Env = "JWT_SECRET"
	MailAddress   Env = "MAIL_ADDRESS"
	MailPassword  Env = "MAIL_PASSWORD"
	MailHost      Env = "MAIL_HOST"
	OTPSecret     Env = "OTP_SECRET"
	R1Key         Env = "DIGITAL_OCEAN_ACCESS_SECRET"
	R1Keypassword Env = "DIGITAL_OCEAN_SECRET_KEY"
	R1Region      Env = "DIGITAL_OCEAN_REGION"
	R1Bucket      Env = "DIGITAL_OCEAN_BUCKET"
	R1Endpoint    Env = "DIGITAL_OCEAN_ENDPOINT"
)

// SetupEnv validates all required environment variables are set
func SetupEnv() {
	// Load .env file if exists (for local development)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	required := []Env{
		JWTSecret,
		MailAddress,
		MailPassword,
		MailHost,
		OTPSecret,
		R1Key,
		R1Keypassword,
		R1Region,
		R1Bucket,
		R1Endpoint,
	}

	missing := []string{}
	for _, key := range required {
		if os.Getenv(string(key)) == "" {
			missing = append(missing, string(key))
		}
	}

	if len(missing) > 0 {
		log.Fatalf("Missing required environment variables: %v", missing)
	}

	log.Println("All environment variables loaded successfully")
}

func GetEnv(key Env) string {
	return os.Getenv(string(key))
}
