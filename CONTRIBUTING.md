# Hướng dẫn đóng góp

Cảm ơn bạn đã quan tâm đến việc đóng góp cho HPS! Dưới đây là một số hướng dẫn để giúp quá trình đóng góp của bạn hiệu quả hơn.

## Code Style

### TypeScript
- Sử dụng TypeScript cho tất cả các file
- Định nghĩa type/interface đầy đủ
- Không sử dụng `any` type
- Sử dụng type inference khi có thể
- Đặt tên biến/function rõ ràng và có ý nghĩa

### React
- Sử dụng functional components và hooks
- Tách logic phức tạp thành custom hooks
- Sử dụng React.memo() cho components hay re-render
- Tránh inline styles, sử dụng Tailwind classes
- Props interface phải được định nghĩa rõ ràng

### Formatting
- Sử dụng Prettier với config mặc định
- Indent: 2 spaces
- Max line length: 100
- Semicolons: required
- Quotes: single

## Git Workflow

1. Fork repository

2. Clone fork của bạn:
```bash
git clone https://github.com/your-username/hps.git
```

3. Tạo branch mới:
```bash
git checkout -b feature/amazing-feature
# hoặc
git checkout -b fix/bug-description
```

4. Commit changes:
- Commit message phải rõ ràng và tuân theo format:
```
type(scope): description

[optional body]

[optional footer]
```
- Types: feat, fix, docs, style, refactor, test, chore
- Scope: component name, feature name, etc.
- Description: ngắn gọn, rõ ràng

5. Push changes:
```bash
git push origin feature/amazing-feature
```

6. Tạo Pull Request

## Pull Request Guidelines

- PR title phải rõ ràng và mô tả được thay đổi
- Mô tả chi tiết các thay đổi trong PR description
- Link đến related issues nếu có
- Đảm bảo tất cả tests pass
- Đảm bảo không có linting errors
- Đảm bảo code đã được format
- Review và respond to comments

## Testing

- Viết unit tests cho tất cả business logic
- Viết integration tests cho các flows chính
- Test coverage tối thiểu 80%
- Sử dụng React Testing Library cho component tests
- Mock external dependencies

## Documentation

- Comment code phức tạp
- Update README.md nếu cần
- Thêm JSDoc cho public APIs
- Viết documentation cho features mới
- Update changelog

## Security

- Không commit sensitive data
- Validate tất cả user input
- Sanitize data trước khi render
- Follow security best practices
- Report security vulnerabilities

## Performance

- Lazy load components khi có thể
- Optimize images và assets
- Minimize bundle size
- Avoid unnecessary re-renders
- Profile và fix performance issues

## Questions?

Nếu bạn có bất kỳ câu hỏi nào, vui lòng:
- Tạo issue mới
- Liên hệ team qua email: dev@hps.com
- Join Discord server: https://discord.gg/hps 