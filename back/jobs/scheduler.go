package jobs

import (
	"log"
	"quickstart/models"

	"github.com/robfig/cron/v3"
)

var cronScheduler *cron.Cron

// StartScheduler initializes and starts all cron jobs
func StartScheduler(bookRepo models.BookRepositoryInterface) {
	cronScheduler = cron.New(cron.WithSeconds())

	// Update book view job - runs every hour
	// cronjob 1h: 0 0 * * * *
	// cronjob 30s: */30 * * * * *
	_, err := cronScheduler.AddFunc("0 0 * * * *", func() {
		UpdateBookViewJob(bookRepo)
	})
	if err != nil {
		log.Fatalf("Failed to schedule UpdateBookViewJob: %v", err)
	}

	cronScheduler.Start()
	log.Println("Cron scheduler started successfully")
	log.Println("- UpdateBookViewJob: Every hour at minute 0")
}

// StopScheduler stops the cron scheduler
func StopScheduler() {
	if cronScheduler != nil {
		cronScheduler.Stop()
		log.Println("Cron scheduler stopped")
	}
}
