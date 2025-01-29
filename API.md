# API Documentation

## Core Services

### Authentication Service

```typescript
interface AuthService {
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  updateProfile(data: Partial<User>): Promise<void>;
}
```

### Production Service

```typescript
interface ProductionService {
  getAll(): Promise<ProductionLine[]>;
  getById(id: string): Promise<ProductionLine>;
  create(data: Omit<ProductionLine, 'id'>): Promise<ProductionLine>;
  update(id: string, data: Partial<ProductionLine>): Promise<void>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: 'active' | 'inactive'): Promise<void>;
}
```

### Transaction Service

```typescript
interface TransactionService {
  getAll(options?: QueryOptions): Promise<Transaction[]>;
  getById(id: string): Promise<Transaction>;
  create(data: Omit<Transaction, 'id'>): Promise<Transaction>;
  update(id: string, data: Partial<Transaction>): Promise<void>;
  delete(id: string): Promise<void>;
  createBarter(data: BarterTransactionInput): Promise<BarterTransactionResult>;
}
```

### Expense Service

```typescript
interface ExpenseService {
  getAll(options?: QueryOptions): Promise<Expense[]>;
  getById(id: string): Promise<Expense>;
  create(data: Omit<Expense, 'id'>): Promise<Expense>;
  update(id: string, data: Partial<Expense>): Promise<void>;
  delete(id: string): Promise<void>;
  approve(id: string, approver: string): Promise<void>;
  reject(id: string, rejector: string, reason: string): Promise<void>;
}
```

## Notification Services

### Notification Service

```typescript
interface NotificationService {
  send(recipientId: string, type: NotificationType, data: any): Promise<void>;
  getTemplates(): Promise<NotificationTemplate[]>;
  getSettings(partnerId: string): Promise<NotificationSetting>;
  updateSettings(partnerId: string, settings: Partial<NotificationSetting>): Promise<void>;
}
```

### External Integration Services

```typescript
interface TelegramService {
  sendMessage(chatId: string, text: string): Promise<void>;
  sendPhoto(chatId: string, photoUrl: string, caption?: string): Promise<void>;
  sendDocument(chatId: string, documentUrl: string, caption?: string): Promise<void>;
}

interface ZaloService {
  sendMessage(userId: string, text: string): Promise<void>;
  sendImage(userId: string, imageUrl: string, caption?: string): Promise<void>;
  sendFile(userId: string, fileUrl: string, caption?: string): Promise<void>;
}
```

## Report Services

### Report Service

```typescript
interface ReportService {
  generateReport(options: ReportOptions): Promise<Report>;
  getProductionReport(dateRange: DateRange): Promise<ProductionReport>;
  getFinancialReport(dateRange: DateRange): Promise<FinancialReport>;
  getInventoryReport(date: Date): Promise<InventoryReport>;
  exportToExcel(report: Report): Promise<string>; // Returns download URL
}
```

## Common Types

### Query Options

```typescript
interface QueryOptions {
  where?: [string, any, any][]; // [field, operator, value]
  orderBy?: [string, 'asc' | 'desc'][];
  limit?: number;
  startAfter?: any;
}
```

### Base Document

```typescript
interface BaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Error Handling

Tất cả các service methods có thể throw các errors sau:

```typescript
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
  }
}

// Common error codes
type ErrorCode =
  | 'INVALID_INPUT'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'ALREADY_EXISTS'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR';
```

## Usage Examples

### Authentication

```typescript
// Sign in
const user = await authService.signIn('user@example.com', 'password');

// Update profile
await authService.updateProfile({
  displayName: 'New Name',
  role: 'STAFF'
});
```

### Transactions

```typescript
// Create transaction
const transaction = await transactionService.create({
  partnerId: 'partner-id',
  type: 'IN',
  amount: 1000000,
  items: [
    {
      productId: 'product-id',
      quantity: 100,
      price: 10000
    }
  ]
});

// Create barter transaction
const barter = await transactionService.createBarter({
  partnerId: 'partner-id',
  vehicleNumber: 'ABC-123',
  outProduct: {
    productId: 'product-1',
    quantity: 100,
    price: 10000
  },
  inProduct: {
    productId: 'product-2',
    quantity: 50,
    price: 20000
  }
});
```

### Notifications

```typescript
// Send notification
await notificationService.send(
  'partner-id',
  'TRANSACTION_CREATED',
  {
    transactionId: 'transaction-id',
    amount: 1000000
  }
);

// Update notification settings
await notificationService.updateSettings('partner-id', {
  channels: ['ZALO', 'EMAIL'],
  enabledTypes: ['TRANSACTION_CREATED', 'PAYMENT_RECEIVED']
});
``` 