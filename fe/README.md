# Hotel Booking Frontend

Một ứng dụng đặt phòng khách sạn hiện đại được xây dựng với Next.js, TypeScript, và Tailwind CSS.

## 🚀 Tính năng

-   **Đa ngôn ngữ**: Hỗ trợ tiếng Anh và tiếng Việt
-   **Dark Mode**: Chế độ sáng/tối tự động
-   **Responsive Design**: Tương thích với mọi thiết bị
-   **AI Chatbot**: Trợ lý AI thông minh
-   **Admin Dashboard**: Trang quản trị đầy đủ
-   **Authentication**: Đăng nhập/đăng ký bảo mật
-   **Real-time Search**: Tìm kiếm phòng real-time
-   **Modern UI**: Giao diện đẹp mắt với shadcn/ui

## 🛠️ Công nghệ sử dụng

-   **Framework**: Next.js 15 với App Router
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **UI Components**: shadcn/ui
-   **State Management**: Zustand
-   **HTTP Client**: Axios
-   **Internationalization**: next-intl
-   **Theme**: next-themes
-   **Icons**: Lucide React

## 📦 Cài đặt

1. **Chuyển đến thư mục frontend**

    ```bash
    cd d:/DoAnTTTN/BookingHotel/fe
    ```

2. **Cài đặt dependencies**

    ```bash
    npm install
    ```

3. **Chạy development server**

    ```bash
    npm run dev
    ```

    Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## 🏗️ Cấu trúc dự án

```
fe/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── auth/          # Authentication pages
│   │   │   ├── admin/         # Admin dashboard
│   │   │   ├── rooms/         # Rooms pages
│   │   │   └── page.tsx       # Home page
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   └── features/         # Feature components
│   ├── lib/                  # Utilities
│   │   ├── api/              # API client
│   │   └── utils.ts          # Helper functions
│   ├── store/                # State management
│   ├── types/                # TypeScript types
│   ├── hooks/                # Custom hooks
│   └── i18n.ts               # Internationalization config
├── messages/                 # Translation files
│   ├── en.json              # English translations
│   └── vi.json              # Vietnamese translations
├── public/                   # Static assets
└── middleware.ts             # Next.js middleware
```

## 🚀 Khởi chạy dự án

```bash
# Khởi động backend (từ thư mục be)
cd ../be
dotnet run

# Khởi động frontend (từ thư mục fe)
cd ../fe
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000
Backend API tại: http://localhost:5000
