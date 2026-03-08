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
	err6 := os.Setenv(string(DOSpaceKey), "DO8016CVW2HN7AGJPR6E")
	err7 := os.Setenv(string(DOSpaceSecret), "me5/MtMF3fXt1rXPhTdZSbLEDwdTBnhGerUUBezsb0U")
	err8 := os.Setenv(string(DOSpaceRegion), "sgp1")
	err9 := os.Setenv(string(DOSpaceBucket), "docluonwebsite")
	err10 := os.Setenv(string(DOSpaceEndpoint), "https://sgp1.digitaloceanspaces.com")
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
