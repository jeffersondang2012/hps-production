import { Timestamp, FieldValue } from 'firebase/firestore';
import { NotificationChannel } from './notification.types';

export type UserRole = 'ADMIN' | 'SHAREHOLDER' | 'STAFF';
export type TransactionType = 'IN' | 'OUT';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID';
export type PaymentMethod = 'CASH' | 'TRANSFER' | 'BARTER';
export type PartnerType = 'CUSTOMER' | 'SUPPLIER';
export type ProductType = 'CRUSHED_SAND' | 'FILLING_SAND';
export type ExpenseType = 'LABOR' | 'ELECTRICITY' | 'MAINTENANCE' | 'OTHER';
export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  productionLineAccess?: string[];
  permissions: string[];
  isActive: boolean;
  lastLogin: Timestamp | null;
}

export interface BaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProductionLine extends BaseDocument {
  name: string;
  status: 'active' | 'inactive';
  capacity: number;
}

export interface PriceHistory {
  price: number;
  date: Timestamp;
  note?: string;
}

export interface Product extends BaseDocument {
  name: string;
  type: ProductType;
  unit: string;
  currentPrice: number;
  priceHistory: PriceHistory[];
  description?: string;
  isTrading: boolean; // true for trading products (FILLING_SAND), false for production products (CRUSHED_SAND)
  minStock?: number; // Only for trading products
}

export interface Partner extends BaseDocument {
  name: string;
  type: 'SUPPLIER' | 'CUSTOMER' | 'BOTH';
  phone: string;
  address: string;
  isActive: boolean;
  debtLimit: number; // Hạn mức công nợ
  currentDebt: number; // Số dư công nợ hiện tại
  isOverDebtLimit?: boolean; // Flag để đánh dấu vượt hạn mức
  createdBy: string;
  notificationChannels: {
    zalo?: string | null;
    telegram?: string | null;
  };
  zaloId?: string;
  telegramChatId?: string;
  zaloPhone?: string; // Số điện thoại đăng ký Zalo
  notificationPreference?: 'TELEGRAM' | 'NONE';
}

export interface Transaction extends BaseDocument {
  partnerId: string;
  type: TransactionType;
  amount: number;
  description?: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDate?: Timestamp;
  dueDate?: Timestamp;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export interface Expense extends BaseDocument {
  type: ExpenseType;
  amount: number;
  description: string;
  status: ExpenseStatus;
  approvedBy?: string;
  approvedAt?: Timestamp;
  rejectedBy?: string;
  rejectedAt?: Timestamp;
  rejectionReason?: string;
  attachments?: string[]; // URLs to uploaded files
  productionLineId?: string;
}

export interface Report extends BaseDocument {
  type: 'PRODUCTION' | 'FINANCIAL' | 'INVENTORY';
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: Timestamp;
  endDate: Timestamp;
  data: Record<string, any>;
  generatedBy: string;
}

export interface Payment extends BaseDocument {
  partnerId: string;
  transactionIds: string[];
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  note?: string;
}

export interface DebtSummary {
  partnerId: string;
  partnerName: string;
  partnerType: PartnerType;
  debtAmount: number;
  debtLimit: number;
  lastTransactionDate: Timestamp;
  isOverLimit: boolean;
}

export interface DebtDetail extends DebtSummary {
  transactions: Transaction[];
}

export interface NotificationLog extends BaseDocument {
  partnerId: string;
  transactionId: string;
  channel: 'ZALO' | 'TELEGRAM';
  message: string;
  status: 'SUCCESS' | 'FAILED';
  error?: string;
} 