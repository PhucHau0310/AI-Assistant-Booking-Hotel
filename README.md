# BookingHotel - Hệ Thống Đặt Phòng Khách Sạn

> Ứng dụng web fullstack cho phép người dùng tìm kiếm, đặt phòng khách sạn với giao diện hiện đại và API mạnh mẽ.

## 🚀 Công Nghệ Sử Dụng

### Backend (.NET 9)

-   **Framework**: ASP.NET Core Web API
-   **Database**: SQL Server + Entity Framework Core
-   **Authentication**: JWT Bearer Token
-   **Security**: BCrypt password hashing
-   **Documentation**: Swagger/OpenAPI

### Frontend (Next.js 15)

-   **Framework**: Next.js với TypeScript
-   **UI Components**: Radix UI + Tailwind CSS
-   **State Management**: TanStack Query (React Query)
-   **Animations**: Lottie React
-   **HTTP Client**: Axios

### AI Automation

-   **Chatbot**: n8n workflow integration
-   **AI Assistant**: Trợ lý booking thông minh
-   **Auto Response**: Hỗ trợ khách hàng 24/7

## 📋 Tính Năng Chính

-   🔐 **Xác thực người dùng** (Đăng ký/Đăng nhập)
-   🏨 **Quản lý địa điểm** và khách sạn
-   🛏️ **Tìm kiếm và đặt phòng**
-   💬 **Hệ thống bình luận** và đánh giá
-   👤 **Quản lý hồ sơ người dùng**
-   🤖 **AI Chatbot trợ lý booking** (n8n workflow)
-   📱 **Giao diện responsive**
-   ☁️ **Đã deploy production**

## 🏗️ Kiến Trúc Hệ Thống

```
📦 BookingHotel/
├── 🔧 be/                 # Backend API (.NET 9)
│   ├── Controllers/       # API Controllers
│   ├── Services/          # Business Logic
│   ├── Repositories/      # Data Access Layer
│   ├── Models/           # Entity Models
│   └── DTOs/             # Data Transfer Objects
├── 🎨 fe/                # Frontend (Next.js 15)
│   └── src/
│       ├── app/          # App Router
│       ├── components/   # UI Components
│       └── hooks/        # Custom Hooks
├── 📊 diagram/           # System Diagrams
└── 🤖 n8n workflow      # AI Chatbot Integration
```

## 🚀 Khởi Chạy Dự Án

### Với Docker (Khuyến nghị)

```bash
cd be
./start-docker.bat    # Windows
# hoặc
./start-docker.sh     # Linux/Mac
```

### Chạy Manual

#### Backend

```bash
cd be
dotnet restore
dotnet run
```

#### Frontend

```bash
cd fe
npm install
npm run dev
```

## 🌐 API Endpoints

-   `POST /api/auth/login` - Đăng nhập
-   `GET /api/locations` - Danh sách địa điểm
-   `GET /api/rooms` - Tìm kiếm phòng
-   `POST /api/bookings` - Đặt phòng
-   `GET /api/comments` - Bình luận

> 📚 Xem chi tiết tại [Swagger UI](https://booking-api.hau.io.vn/index.html)

## 🚀 Deployment

### Production URLs

-   **Frontend**: [Deployed Frontend URL](https://booking-hotel.hau.io.vn)
-   **Backend API**: [Deployed API URL](https://booking-api.hau.io.vn/index.html)
-   **n8n Chatbot**: Tích hợp trong ứng dụng

### Status

✅ **Backend API** - Đã deploy thành công
✅ **Frontend** - Đã deploy thành công
✅ **n8n Workflow** - Chatbot hoạt động ổn định

## 🔧 Cấu Hình

Tạo file `.env` trong thư mục `be/`:

```env
CONNECTION_STRING=your_database_connection
JWT_KEY=your_secret_key
JWT_ISSUER=your_issuer
JWT_AUDIENCE=your_audience
```

⭐ **Phát triển bởi**: PhucHau0310
