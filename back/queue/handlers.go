package queue

import (
	"context"
	"fmt"
	"log"

	"github.com/hibiken/asynq"
)

// EmailHandler handles email delivery tasks
type EmailHandler struct {
	// Add your mail service here
}

func NewEmailHandler() *EmailHandler {
	return &EmailHandler{}
}

func (h *EmailHandler) ProcessTask(ctx context.Context, t *asynq.Task) error {
	payload, err := UnmarshalPayload[EmailPayload](t)
	if err != nil {
		return fmt.Errorf("email handler: %w", err)
	}

	log.Printf("Sending email to %s: %s", payload.To, payload.Subject)

	// TODO: Implement actual email sending logic
	// Example: h.mailService.Send(payload.To, payload.Subject, payload.Body)

	return nil
}

// BookProcessHandler handles book processing tasks
type BookProcessHandler struct {
	// Add your book repository/service here
}

func NewBookProcessHandler() *BookProcessHandler {
	return &BookProcessHandler{}
}

func (h *BookProcessHandler) ProcessTask(ctx context.Context, t *asynq.Task) error {
	payload, err := UnmarshalPayload[BookProcessPayload](t)
	if err != nil {
		return fmt.Errorf("book process handler: %w", err)
	}

	log.Printf("Processing book %s", payload.BookID)

	return nil
}

// ImageResizeHandler handles image resize tasks
type ImageResizeHandler struct {
	// Add your image processor here
}

func NewImageResizeHandler() *ImageResizeHandler {
	return &ImageResizeHandler{}
}

func (h *ImageResizeHandler) ProcessTask(ctx context.Context, t *asynq.Task) error {
	payload, err := UnmarshalPayload[ImageResizePayload](t)
	if err != nil {
		return fmt.Errorf("image resize handler: %w", err)
	}

	log.Printf("Resizing image %s to %dx%d", payload.ImageURL, payload.Width, payload.Height)

	// TODO: Implement actual image resize logic
	// Example: h.imageProcessor.Resize(payload.ImageURL, payload.Width, payload.Height)

	return nil
}
