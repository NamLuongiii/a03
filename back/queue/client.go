package queue

import (
	"fmt"
	"time"

	"github.com/hibiken/asynq"
)

type Client struct {
	client *asynq.Client
}

func NewClient(redisAddr, redisPassword string) *Client {
	client := asynq.NewClient(asynq.RedisClientOpt{
		Addr:     redisAddr,
		Password: redisPassword,
	})
	return &Client{client: client}
}

func (c *Client) Close() error {
	return c.client.Close()
}

// Enqueue adds a task to the queue immediately
func (c *Client) Enqueue(task *asynq.Task, opts ...asynq.Option) (*asynq.TaskInfo, error) {
	info, err := c.client.Enqueue(task, opts...)
	if err != nil {
		return nil, fmt.Errorf("failed to enqueue task: %w", err)
	}
	return info, nil
}

// EnqueueWithDelay adds a task to the queue with a delay
func (c *Client) EnqueueWithDelay(task *asynq.Task, delay time.Duration, opts ...asynq.Option) (*asynq.TaskInfo, error) {
	opts = append(opts, asynq.ProcessIn(delay))
	return c.Enqueue(task, opts...)
}

// EnqueueAt schedules a task to be processed at a specific time
func (c *Client) EnqueueAt(task *asynq.Task, processAt time.Time, opts ...asynq.Option) (*asynq.TaskInfo, error) {
	opts = append(opts, asynq.ProcessAt(processAt))
	return c.Enqueue(task, opts...)
}

// EnqueueWithPriority adds a task with a specific priority
// Priority levels: higher number = higher priority
func (c *Client) EnqueueWithPriority(task *asynq.Task, priority int, opts ...asynq.Option) (*asynq.TaskInfo, error) {
	opts = append(opts, asynq.Queue(fmt.Sprintf("priority_%d", priority)))
	return c.Enqueue(task, opts...)
}

// EnqueueWithRetry adds a task with custom retry count
func (c *Client) EnqueueWithRetry(task *asynq.Task, maxRetry int, opts ...asynq.Option) (*asynq.TaskInfo, error) {
	opts = append(opts, asynq.MaxRetry(maxRetry))
	return c.Enqueue(task, opts...)
}
