package queue

import (
	"context"
	"log"

	"github.com/hibiken/asynq"
)

type Server struct {
	server *asynq.Server
	mux    *asynq.ServeMux
}

type ServerConfig struct {
	RedisAddr     string
	RedisPassword string
	Concurrency   int // Number of concurrent workers
	Queues        map[string]int
}

func NewServer(cfg ServerConfig) *Server {
	// Default queues if not provided
	if cfg.Queues == nil {
		cfg.Queues = map[string]int{
			"critical": 6, // 60% of workers
			"default":  3, // 30% of workers
			"low":      1, // 10% of workers
		}
	}

	// Default concurrency
	if cfg.Concurrency == 0 {
		cfg.Concurrency = 10
	}

	server := asynq.NewServer(
		asynq.RedisClientOpt{
			Addr:     cfg.RedisAddr,
			Password: cfg.RedisPassword,
		},
		asynq.Config{
			Concurrency: cfg.Concurrency,
			Queues:      cfg.Queues,
			// Error handler
			ErrorHandler: asynq.ErrorHandlerFunc(func(ctx context.Context, task *asynq.Task, err error) {
				log.Printf("Task %s failed: %v", task.Type(), err)
			}),
			// Retry delay function (exponential backoff)
			RetryDelayFunc: asynq.DefaultRetryDelayFunc,
		},
	)

	return &Server{
		server: server,
		mux:    asynq.NewServeMux(),
	}
}

// RegisterHandler registers a task handler
func (s *Server) RegisterHandler(pattern string, handler TaskHandler) {
	s.mux.HandleFunc(pattern, handler.ProcessTask)
}

// RegisterHandlerFunc registers a handler function directly
func (s *Server) RegisterHandlerFunc(pattern string, handlerFunc func(context.Context, *asynq.Task) error) {
	s.mux.HandleFunc(pattern, handlerFunc)
}

// Start starts the worker server
func (s *Server) Start() error {
	log.Println("Starting Asynq worker server...")
	return s.server.Start(s.mux)
}

// Stop gracefully stops the worker server
func (s *Server) Stop() {
	log.Println("Stopping Asynq worker server...")
	s.server.Stop()
	log.Println("Asynq worker server stopped")
}

// Shutdown gracefully shuts down the server
func (s *Server) Shutdown() {
	log.Println("Shutting down Asynq worker server...")
	s.server.Shutdown()
	log.Println("Asynq worker server shut down")
}
