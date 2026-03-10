package env

import "os"

type Env string

const (
	JWTSecret       Env = "JWT_SECRET"
	MailAddress     Env = "MAIL_ADDRESS"
	MailPassword    Env = "MAIL_PASSWORD"
	MailHost        Env = "MAIL_HOST"
	OTPSecret       Env = "OTP_SECRET"
	DOSpaceKey      Env = "DIGITAL_OCEAN_ACCESS_SECRET"
	DOSpaceSecret   Env = "DIGITAL_OCEAN_SECRET_KEY"
	DOSpaceRegion   Env = "DIGITAL_OCEAN_REGION"
	DOSpaceBucket   Env = "DIGITAL_OCEAN_BUCKET"
	DOSpaceEndpoint Env = "DIGITAL_OCEAN_ENDPOINT"
)

func SetupEnv() {
	// Here you would typically load environment variables from a file or the system
	// For example, using os.Setenv or a library like godotenv

	err1 := os.Setenv(string(JWTSecret), "uaiu aaoo reee hhug") // Example secret
	err2 := os.Setenv(string(MailAddress), "docluonbook@gmail.com")
	err3 := os.Setenv(string(MailPassword), "bicl ebko ohiu jmpg")
	err4 := os.Setenv(string(MailHost), "smtp.gmail.com")
	err5 := os.Setenv(string(OTPSecret), "aauu hhuee jkke xsss")
	err6 := os.Setenv(string(DOSpaceKey), "e1df912173ff017eb2109f671f40a08d")
	err7 := os.Setenv(string(DOSpaceSecret), "b0120aa2588a4ca0c1aeeeaea1d0a3e7bd0ab39ef2062a8d788c1f8ef7eed8c2")
	err8 := os.Setenv(string(DOSpaceRegion), "auto")
	err9 := os.Setenv(string(DOSpaceBucket), "docluonwebsite")
	err10 := os.Setenv(string(DOSpaceEndpoint), "https://6f7015a019db018548848cd16bbd9f69.r2.cloudflarestorage.com")
	if err1 != nil ||
		err2 != nil ||
		err3 != nil ||
		err4 != nil ||
		err5 != nil ||
		err6 != nil ||
		err7 != nil ||
		err8 != nil ||
		err9 != nil ||
		err10 != nil {
		panic(err7)
	}
}

func GetEnv(key Env) string {
	return os.Getenv(string(key))
}
