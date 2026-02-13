# Project Setup

Fullstack application với React frontend và Golang backend.

---

## 🎨 Frontend

### Tech Stack:
- **Runtime**: Node.js 24.14.0
- **Framework**: Vite + React
- **UI**: Headless UI, Styled Components
- **State**: TanStack Query
- **Routing**: TanStack Router
- **HTTP**: Axios

### Development:
```bash
cd front
npm i
npm run dev
```

### Production Build:
```bash
cd front
npm i
npm run build
```

---

## ⚙️ Backend

### Tech Stack:
- **Language**: Golang 1.25.5+
- **Framework**: Gin
- **Database**: SQLite
- **Docs**: Swagger
- **Deploy**: Docker

### Development:
```bash
cd back
go run main.go
```
Server: `http://localhost:8080`
Database: `back/app.db` (auto-created)

### Production:
```bash
cd docker
./deploy.sh       # Linux/Mac
deploy.bat        # Windows
```

### Swagger:
```bash
cd back
swag init         # Generate docs
swag fmt          # Format annotations
```

---

## 📚 Documentation

- **Backend Docker Setup**: [docker/README.md](docker/README.md)
- **Swagger API Docs**: `http://localhost:8080/swagger/index.html` (when running)
