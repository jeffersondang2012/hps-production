# HPS - Hệ thống Quản lý Sản xuất

Hệ thống quản lý sản xuất và kinh doanh cát xây dựng, được phát triển bằng React, TypeScript và Firebase.

## Tính năng chính

- 🏭 Quản lý dây chuyền sản xuất
- 📦 Quản lý kho và giao dịch
- 💰 Quản lý chi phí và công nợ
- 📊 Báo cáo và thống kê
- 👥 Quản lý đối tác
- 👤 Phân quyền người dùng
- 🔔 Hệ thống thông báo đa kênh

## Yêu cầu hệ thống

- Node.js 16.x trở lên
- npm hoặc yarn
- Firebase project

## Cài đặt

1. Clone repository:
```bash
git clone https://github.com/your-username/hps.git
cd hps
```

2. Cài đặt dependencies:
```bash
npm install
# hoặc
yarn install
```

3. Tạo file môi trường:
```bash
cp .env.example .env.local
```

4. Cập nhật các biến môi trường trong `.env.local` với thông tin từ Firebase project của bạn.

5. Khởi chạy development server:
```bash
npm run dev
# hoặc
yarn dev
```

## Cấu trúc project

```
src/
├── components/          # Shared UI components
│   ├── atoms/          # Basic UI elements
│   ├── molecules/      # Composite components
│   └── organisms/      # Complex components
├── features/           # Feature modules
│   ├── auth/          # Authentication
│   ├── production/    # Production management
│   ├── expenses/      # Expense management
│   └── ...
├── hooks/             # Custom React hooks
├── services/          # Business logic & API calls
├── stores/            # State management
├── types/             # TypeScript definitions
└── utils/             # Utility functions
```

## Công nghệ sử dụng

- **Frontend:**
  - React
  - TypeScript
  - TailwindCSS
  - React Router
  - React Hook Form
  - Headless UI

- **Backend:**
  - Firebase Authentication
  - Cloud Firestore
  - Cloud Storage
  - Cloud Functions

- **Development:**
  - Vite
  - ESLint
  - Prettier
  - Husky

## Scripts

- `npm run dev`: Khởi chạy development server
- `npm run build`: Build production
- `npm run preview`: Preview production build
- `npm run lint`: Kiểm tra linting
- `npm run format`: Format code
- `npm test`: Chạy tests

## Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## License

[MIT License](LICENSE)

## Liên hệ

- Email: support@hps.com
- Website: https://hps.com 