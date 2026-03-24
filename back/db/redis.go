package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

// InitRedis initializes Redis connection
func InitRedis() error {
	// Get Redis host from environment variable
	// Dev: localhost:6379
	// Production (Docker): redis:6379
	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = "localhost:6379" // Default for dev
	}

	RedisClient = redis.NewClient(&redis.Options{
		Addr:         redisHost,
		Password:     os.Getenv("REDIS_PASSWORD"), // No password by default
		DB:           0,                           // Use default DB
		DialTimeout:  5 * time.Second,
		ReadTimeout:  3 * time.Second,
		WriteTimeout: 3 * time.Second,
		PoolSize:     10,
	})

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := RedisClient.Ping(ctx).Err(); err != nil {
		return fmt.Errorf("failed to connect to Redis: %w", err)
	}

	log.Println("Redis connected successfully at", redisHost)
	return nil
}

// CloseRedis closes Redis connection
func CloseRedis() error {
	if RedisClient != nil {
		return RedisClient.Close()
	}
	return nil
}
