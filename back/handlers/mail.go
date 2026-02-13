package handlers

import (
	"os"
	"quickstart/env"

	"github.com/wneessen/go-mail"
)

type MailHandler struct {
	client *mail.Client
}

func NewMailHandler(client *mail.Client) *MailHandler {
	mailHandler := MailHandler{
		client: client,
	}
	return &mailHandler
}

func (mh *MailHandler) SendMail(to string, subject string, body string) (err error) {
	message := mail.NewMsg()

	if err := message.From(os.Getenv(env.MailAddress)); err != nil {
		return err
	}
	if err := message.To(to); err != nil {
		return err
	}

	message.Subject(subject)
	message.SetBodyString(mail.TypeTextPlain, body)

	if err := mh.client.DialAndSend(message); err != nil {
		return err
	}

	return nil
}
