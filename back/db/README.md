# Database Migrations

## Cấu trúc

```
db/
├── migrate.go          # Migration runner
├── migrations/         # SQL migration files (nếu cần)
└── README.md          # Tài liệu này
```

## Cách sử dụng

### 1. Thay đổi thông thường (thêm field, index)

**Chỉ cần update model**, AutoMigrate sẽ tự động xử lý:

```go
type Account struct {
    // ... existing fields
    NewField string `gorm:"type:varchar(100)"` // ← Thêm field mới
}
```

Restart server → Migration tự động chạy

### 2. Thay đổi phức tạp (đổi tên, xóa column, thay đổi type)

**Thêm vào `runManualMigrations()` trong `db/migrate.go`:**

```go
func runManualMigrations(db *gorm.DB) error {
    // Ví dụ 1: Xóa column cũ
    if db.Migrator().HasColumn(&models.Account{}, "old_column") {
        log.Println("Migration: Dropping 'old_column'")
        db.Migrator().DropColumn(&models.Account{}, "old_column")
    }

    // Ví dụ 2: Đổi tên column (SQLite không hỗ trợ RENAME, phải tạo mới)
    if db.Migrator().HasColumn(&models.Book{}, "old_name") {
        db.Exec("ALTER TABLE books ADD COLUMN new_name VARCHAR(255)")
        db.Exec("UPDATE books SET new_name = old_name")
        db.Migrator().DropColumn(&models.Book{}, "old_name")
    }

    // Ví dụ 3: Thay đổi kiểu dữ liệu
    db.Exec("ALTER TABLE accounts MODIFY COLUMN age INT")

    return nil
}
```

### 3. Migration với SQL files (Optional, cho production)

Tạo file trong `migrations/`:

```sql
-- migrations/001_rename_password.sql
ALTER TABLE accounts DROP COLUMN password;
```

Thêm vào `runManualMigrations()`:

```go
// Đọc và execute SQL file
sqlBytes, _ := os.ReadFile("db/migrations/001_rename_password.sql")
db.Exec(string(sqlBytes))
```

## Best Practices

### Development
- ✅ Xóa `app.db` và chạy lại khi schema thay đổi nhiều
- ✅ Dùng AutoMigrate cho thay đổi nhỏ

### Production
- ✅ **LUÔN backup database** trước khi migrate
- ✅ Test migration trên staging trước
- ✅ Viết manual migration cho breaking changes
- ✅ Version control migration code
- ✅ Có rollback plan

## Các Migration hiện tại

1. **Drop old password column** - Xóa column `password` cũ, giữ `h_password`

## Troubleshooting

**Lỗi: "constraint failed"**
- Kiểm tra manual migration có chạy đúng không
- Xem log khi start server: "Running migrations..."

**Lỗi: "column already exists"**
- AutoMigrate đã tạo column rồi, bỏ qua lỗi này

**Reset database (dev only)**
```bash
rm app.db
# Restart server → Tạo lại từ đầu
```
