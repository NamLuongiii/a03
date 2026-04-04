package queue

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/hibiken/asynq"
)

// Task types
const (
	TypeEmailDelivery = "email:deliver"
	TypeBookProcess   = "book:process"
	TypeImageResize   = "image:resize"
)

// Payloads
type EmailPayload struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
}

type BookProcessPayload struct {
	BookID string `json:"book_id"`
}

type ImageResizePayload struct {
	ImageURL string `json:"image_url"`
	Width    int    `json:"width"`
	Height   int    `json:"height"`
}

// Task creators
func NewEmailTask(to, subject, body string) (*asynq.Task, error) {
	payload, err := json.Marshal(EmailPayload{
		To:      to,
		Subject: subject,
		Body:    body,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to marshal email payload: %w", err)
	}
	return asynq.NewTask(TypeEmailDelivery, payload), nil
}

func NewBookProcessTask(bookID string) (*asynq.Task, error) {
	payload, err := json.Marshal(BookProcessPayload{
		BookID: bookID,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to marshal book process payload: %w", err)
	}
	return asynq.NewTask(TypeBookProcess, payload), nil
}

func NewImageResizeTask(imageURL string, width, height int) (*asynq.Task, error) {
	payload, err := json.Marshal(ImageResizePayload{
		ImageURL: imageURL,
		Width:    width,
		Height:   height,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to marshal image resize payload: %w", err)
	}
	return asynq.NewTask(TypeImageResize, payload), nil
}

// Helper to unmarshal task payload
func UnmarshalPayload[T any](t *asynq.Task) (*T, error) {
	var payload T
	if err := json.Unmarshal(t.Payload(), &payload); err != nil {
		return nil, fmt.Errorf("failed to unmarshal payload: %w", err)
	}
	return &payload, nil
}

// Task handler interface
type TaskHandler interface {
	ProcessTask(ctx context.Context, task *asynq.Task) error
}
