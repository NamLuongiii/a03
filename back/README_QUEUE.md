# Queue System Documentation (Asynq)

## Overview

This project uses **Asynq** - a production-ready, Redis-backed distributed task queue for Go. It provides automatic retries, delayed tasks, priority queues, and monitoring capabilities.

## Architecture

```
┌─────────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Your API      │─────▶│    Redis     │◀─────│  Worker Server  │
│  (Producer)     │      │   (Queue)    │      │   (Consumer)    │
└─────────────────┘      └──────────────┘      └─────────────────┘
```

## Project Structure

```
queue/
├── tasks.go      # Task type definitions and payload structs
├── client.go     # Queue client for enqueueing tasks
├── server.go     # Worker server for processing tasks
└── handlers.go   # Task handler implementations
```

## Quick Start

### 1. Initialize Queue Client (Already done in main.go)

The queue client and server are automatically initialized when the application starts.

### 2. Enqueue Tasks from Your Handlers

```go
import "quickstart/queue"

// In your handler
func (h *YourHandler) SomeMethod(c *gin.Context) {
    // Get queue client (you'll need to pass it to your handler)
    queueClient := c.MustGet("queueClient").(*queue.Client)

    // Create and enqueue a task
    task, err := queue.NewEmailTask(
        "user@example.com",
        "Welcome!",
        "Thanks for signing up",
    )
    if err != nil {
        // handle error
        return
    }

    info, err := queueClient.Enqueue(task)
    if err != nil {
        // handle error
        return
    }

    log.Printf("Task enqueued: %s", info.ID)
}
```

### 3. Available Task Types

#### Email Delivery
```go
task, err := queue.NewEmailTask(to, subject, body)
queueClient.Enqueue(task)
```

#### Book Processing
```go
task, err := queue.NewBookProcessTask(bookID, categoryID, "sync")
queueClient.Enqueue(task)
```

#### Image Resize
```go
task, err := queue.NewImageResizeTask(imageURL, width, height)
queueClient.Enqueue(task)
```

## Advanced Usage

### Delayed Tasks
```go
// Process after 5 minutes
queueClient.EnqueueWithDelay(task, 5*time.Minute)
```

### Scheduled Tasks
```go
// Process at specific time
processAt := time.Date(2026, 4, 1, 9, 0, 0, 0, time.UTC)
queueClient.EnqueueAt(task, processAt)
```

### Priority Queues
```go
// High priority (critical queue)
queueClient.Enqueue(task, asynq.Queue("critical"))

// Normal priority (default queue)
queueClient.Enqueue(task, asynq.Queue("default"))

// Low priority (low queue)
queueClient.Enqueue(task, asynq.Queue("low"))
```

### Custom Retry Count
```go
// Retry up to 5 times
queueClient.EnqueueWithRetry(task, 5)
```

### Task Options
```go
import "github.com/hibiken/asynq"

queueClient.Enqueue(task,
    asynq.MaxRetry(5),
    asynq.Queue("critical"),
    asynq.ProcessIn(10*time.Minute),
    asynq.Timeout(5*time.Minute),
)
```

## Queue Configuration

Queues are configured in `main.go` with priority weights:

```go
Queues: map[string]int{
    "critical": 6,  // 60% of workers
    "default":  3,  // 30% of workers
    "low":      1,  // 10% of workers
}
```

## Worker Concurrency

Default: 10 concurrent workers. Change in `main.go`:

```go
Concurrency: 10,  // Number of concurrent workers
```

## Creating Custom Task Handlers

### 1. Add task type in `queue/tasks.go`
```go
const TypeYourTask = "your:task"

type YourTaskPayload struct {
    Field1 string `json:"field1"`
    Field2 int    `json:"field2"`
}

func NewYourTask(field1 string, field2 int) (*asynq.Task, error) {
    payload, err := json.Marshal(YourTaskPayload{
        Field1: field1,
        Field2: field2,
    })
    if err != nil {
        return nil, err
    }
    return asynq.NewTask(TypeYourTask, payload), nil
}
```

### 2. Add handler in `queue/handlers.go`
```go
type YourTaskHandler struct {
    // dependencies
}

func NewYourTaskHandler() *YourTaskHandler {
    return &YourTaskHandler{}
}

func (h *YourTaskHandler) ProcessTask(ctx context.Context, t *asynq.Task) error {
    payload, err := UnmarshalPayload[YourTaskPayload](t)
    if err != nil {
        return err
    }

    // Process your task
    log.Printf("Processing: %s", payload.Field1)

    return nil
}
```

### 3. Register in `main.go`
```go
server.RegisterHandler(queue.TypeYourTask, queue.NewYourTaskHandler())
```

## Monitoring

### Option 1: Asynqmon Web UI

#### Install Asynqmon:
```bash
go install github.com/hibiken/asynqmon/cmd/asynqmon@latest
```

#### Start Asynqmon:

**Basic (port 8080):**
```bash
asynqmon --redis-addr=localhost:6379
```

**Custom port (recommended - port 8081):**
```bash
asynqmon --redis-addr=localhost:6379 --port=8081
```

**With Redis password:**
```bash
asynqmon --redis-addr=localhost:6379 --redis-password=yourpass --port=8081
```

**Background mode:**
```bash
nohup asynqmon --redis-addr=localhost:6379 --port=8081 > /tmp/asynqmon.log 2>&1 &
```

**Read-only mode:**
```bash
asynqmon --redis-addr=localhost:6379 --port=8081 --read-only
```

Then visit: **http://localhost:8081**

#### Stop Asynqmon:

**Find and kill process:**
```bash
# Find PID
ps aux | grep asynqmon

# Kill process
kill <PID>
```

**Kill all asynqmon:**
```bash
pkill asynqmon
```

**Kill by port:**
```bash
lsof -ti:8081 | xargs kill
```

#### Check Status:
```bash
# Check if running
ps aux | grep asynqmon

# Check port
lsof -i:8081

# Test connection
curl http://localhost:8081
```

#### Using Management Script:

We provide a convenient script to manage Asynqmon:

```bash
# Make executable (first time only)
chmod +x scripts/asynqmon.sh

# Start
./scripts/asynqmon.sh start

# Stop
./scripts/asynqmon.sh stop

# Restart
./scripts/asynqmon.sh restart

# Check status
./scripts/asynqmon.sh status

# View logs
./scripts/asynqmon.sh log
```

**With custom environment:**
```bash
REDIS_HOST=localhost:6379 ASYNQ_PORT=9000 ./scripts/asynqmon.sh start
```

### Option 2: Redis CLI

```bash
redis-cli

# View all queues
KEYS asynq:*

# View pending tasks
LRANGE asynq:queues:default 0 -1

# View task details
HGETALL asynq:task:{task-id}

# View active tasks
ZRANGE asynq:active 0 -1

# View scheduled tasks
ZRANGE asynq:scheduled 0 -1

# View dead tasks
ZRANGE asynq:dead 0 -1
```

## Error Handling

Tasks are automatically retried with exponential backoff:
- Retry 1: ~15 seconds
- Retry 2: ~1 minute
- Retry 3: ~4 minutes
- Retry 4: ~15 minutes
- ...

After max retries, tasks go to the **dead letter queue** for manual inspection.

## Best Practices

1. **Keep tasks idempotent** - Tasks may be retried
2. **Use appropriate queues** - Critical tasks in "critical" queue
3. **Set timeouts** - Prevent tasks from running forever
4. **Log errors** - Helps debugging failed tasks
5. **Monitor queues** - Use Asynqmon to track task status
6. **Handle dependencies** - Pass only IDs, not full objects

## Environment Variables

```env
REDIS_HOST=localhost:6379
REDIS_PASSWORD=
```

## Examples

See `examples/queue_usage_example.go` for complete examples.

## Troubleshooting

### Tasks not processing
- Check Redis connection
- Verify worker server is running (check logs)
- Check task handler is registered

### Tasks failing repeatedly
- Check handler logs for errors
- Verify payload structure matches
- Check task timeout settings

### High memory usage
- Reduce concurrency
- Optimize handler code
- Check for memory leaks in handlers

## Resources

- [Asynq GitHub](https://github.com/hibiken/asynq)
- [Asynq Documentation](https://github.com/hibiken/asynq/wiki)
- [Asynqmon](https://github.com/hibiken/asynqmon)
