package types

type Message string

const (
	MessageInvalidCredentials Message = "Invalid credentials"
	MessageUserCreated        Message = "User created successfully"
	MessageUserExists         Message = "User already exists"
	ActionFailed              Message = "Action failed"
	StatusSuccess             Message = "Success"
	MessageInvalidToken       Message = "Invalid token"
	MessageInvalidData        Message = "Invalid data"
	MessageRoomCreated        Message = "Room created successfully"
	MessageRoomNotFound       Message = "Room not found"
	MessageRoomDeleted        Message = "Room deleted successfully"
	UpgradeWSFailed           Message = "Upgrade websocket failed"
	ReadMessageWSFailed       Message = "Read message websocket failed"
	ParseMessageWSFailed      Message = "Parse message websocket failed"
	MessageTokenExpired       Message = "Token expired"
	MessageTokenWrong         Message = "Token wrong"
	MessageUserNotFound       Message = "User not found"
	MessageSentToken          Message = "Token sent successfully, please check your email"
	MessagePasswordChanged    Message = "Password changed successfully"
)

type CookieNames string

const (
	CookieAccessToken  CookieNames = "access_token"
	CookieRefreshToken CookieNames = "refresh_token"
)

type RequestContextKey string

const (
	ContextKeyEmail         RequestContextKey = "email"
	ContextKeyTokenClaims   RequestContextKey = "token_claims"
	ContextKeyValidatedBody RequestContextKey = "validated_body"
)
