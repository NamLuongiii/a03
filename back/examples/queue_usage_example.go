package examples

import (
	"log"
	"quickstart/queue"
	"time"

	"github.com/hibiken/asynq"
)

// Example: How to enqueue tasks from your handlers

func ExampleEnqueueEmailTask(queueClient *queue.Client) {
	// Create an email task
	task, err := queue.NewEmailTask(
		"user@example.com",
		"Welcome to our platform",
		"Thank you for signing up!",
	)
	if err != nil {
		log.Printf("Failed to create email task: %v", err)
		return
	}

	// Enqueue immediately
	info, err := queueClient.Enqueue(task)
	if err != nil {
		log.Printf("Failed to enqueue task: %v", err)
		return
	}

	log.Printf("Enqueued task: id=%s queue=%s", info.ID, info.Queue)
}

func ExampleEnqueueEmailTaskWithDelay(queueClient *queue.Client) {
	// Create an email task
	task, err := queue.NewEmailTask(
		"user@example.com",
		"Reminder",
		"Don't forget to complete your profile!",
	)
	if err != nil {
		log.Printf("Failed to create email task: %v", err)
		return
	}

	// Enqueue with 5 minute delay
	info, err := queueClient.EnqueueWithDelay(task, 5*time.Minute)
	if err != nil {
		log.Printf("Failed to enqueue task: %v", err)
		return
	}

	log.Printf("Enqueued delayed task: id=%s queue=%s", info.ID, info.Queue)
}

func ExampleEnqueueBookProcessTask(queueClient *queue.Client) {
	// Create a book processing task
	task, err := queue.NewBookProcessTask("book-123", "category-456", "sync")
	if err != nil {
		log.Printf("Failed to create book task: %v", err)
		return
	}

	// Enqueue with high priority and max 5 retries
	info, err := queueClient.EnqueueWithRetry(task, 5, asynq.Queue("critical"))
	if err != nil {
		log.Printf("Failed to enqueue task: %v", err)
		return
	}

	log.Printf("Enqueued book task: id=%s queue=%s", info.ID, info.Queue)
}

func ExampleEnqueueImageResizeTask(queueClient *queue.Client) {
	// Create an image resize task
	task, err := queue.NewImageResizeTask("https://example.com/image.jpg", 800, 600)
	if err != nil {
		log.Printf("Failed to create image task: %v", err)
		return
	}

	// Enqueue with low priority
	info, err := queueClient.Enqueue(task, asynq.Queue("low"))
	if err != nil {
		log.Printf("Failed to enqueue task: %v", err)
		return
	}

	log.Printf("Enqueued image task: id=%s queue=%s", info.ID, info.Queue)
}

func ExampleScheduledTask(queueClient *queue.Client) {
	// Create a task to be processed at a specific time
	task, err := queue.NewEmailTask(
		"user@example.com",
		"Weekly Newsletter",
		"Here's your weekly digest...",
	)
	if err != nil {
		log.Printf("Failed to create task: %v", err)
		return
	}

	// Schedule for next Monday at 9 AM
	nextMonday := time.Now().AddDate(0, 0, 7)
	nextMonday = time.Date(nextMonday.Year(), nextMonday.Month(), nextMonday.Day(), 9, 0, 0, 0, nextMonday.Location())

	info, err := queueClient.EnqueueAt(task, nextMonday)
	if err != nil {
		log.Printf("Failed to schedule task: %v", err)
		return
	}

	log.Printf("Scheduled task: id=%s queue=%s processAt=%s", info.ID, info.Queue, info.NextProcessAt)
}
