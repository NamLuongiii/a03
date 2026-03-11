# Stage 1: Build
FROM golang:1.23-alpine AS builder
WORKDIR /app
# Copy go.mod và go.sum trước để tối ưu cache
COPY go.mod go.sum ./
RUN go mod download
# Copy toàn bộ code của thư mục back
COPY . .
RUN go build -o main .

# Stage 2: Run
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
# Container sẽ tìm file .env ở đây
CMD ["./main"]