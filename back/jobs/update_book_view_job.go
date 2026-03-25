package jobs

import (
	"context"
	"log"
	"quickstart/db"
	"quickstart/models"
	"strconv"
	"strings"
	"time"
)

// UpdateBookViewJob updates book view counts from Redis to database
func UpdateBookViewJob(bookRepo models.BookRepositoryInterface) {
	log.Println("Running UpdateBookViewJob...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Get all book view keys from Redis
	keys, err := db.RedisClient.Keys(ctx, "viewNums:book:*").Result()
	if err != nil {
		log.Printf("Error getting Redis keys: %v", err)
		return
	}

	if len(keys) == 0 {
		log.Println("No book views to update")
		return
	}

	updatedCount := 0
	for _, key := range keys {
		// Get view count from Redis
		viewCount, err := db.RedisClient.Get(ctx, key).Result()
		if err != nil {
			log.Printf("Error getting value for key %s: %v", key, err)
			continue
		}

		bookID := strings.TrimPrefix(key, "viewNums:book:")
		if bookID == key { // Phòng trường hợp key không khớp pattern
			log.Printf("Key không đúng định dạng: %s", key)
			continue
		}

		// 2. Chuyển đổi số lượt view (viewCount) từ string sang int
		views, err := strconv.Atoi(viewCount)
		if err != nil {
			// Lưu ý: bookID ở đây đã là string nên dùng %s
			log.Printf("Error converting view count for book %s: %v", bookID, err)
			continue
		}

		// Get book from database
		book, err := bookRepo.GetByIDSimple(bookID)
		if err != nil {
			log.Printf("Error getting book %s: %v", bookID, err)
			continue
		}

		// Update view count
		book.ViewNums += views

		// Save to database
		if err := bookRepo.Update(&book); err != nil {
			log.Printf("Error updating book %s: %v", bookID, err)
			continue
		}

		// Delete Redis key after successful update
		if err := db.RedisClient.Del(ctx, key).Err(); err != nil {
			log.Printf("Error deleting Redis key %s: %v", key, err)
			continue
		}

		log.Printf("Updated book %s: +%d views (total: %d)", bookID, views, book.ViewNums)
		updatedCount++
	}

	log.Printf("UpdateBookViewJob completed: %d books updated", updatedCount)
}
