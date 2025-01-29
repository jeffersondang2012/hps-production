import { Timestamp } from 'firebase/firestore';
import { PartnerType } from './database.types';

// Các kênh gửi thông báo
export type NotificationChannel = 'ZALO' | 'TELEGRAM' | 'EMAIL';

// Loại thông báo hiển thị trên UI
export type UINotificationType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

// Loại thông báo hệ thống
export type SystemNotificationType = 
  | 'TRANSACTION_CREATED'
  | 'TRANSACTION_UPDATED' 
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_SENT'
  | 'DEBT_REMINDER'
  | 'DEBT_OVERDUE';

// Interface cho template thông báo
export interface NotificationTemplate {
  id: string;
  type: SystemNotificationType;
  title: string;
  content: string;
  variables: string[]; // Các biến trong template, ví dụ: {{amount}}, {{date}}
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Interface cho cấu hình thông báo của đối tác
export interface NotificationSetting {
  id: string;
  partnerId: string;
  partnerType: PartnerType;
  channels: NotificationChannel[];
  enabledTypes: SystemNotificationType[];
  contacts: {
    zalo?: string;
    telegram?: string;
    email?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Interface cho log thông báo
export interface NotificationLog {
  id: string;
  type: SystemNotificationType;
  channel: NotificationChannel;
  partnerId: string;
  templateId: string;
  content: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  error?: string;
  sentAt?: Timestamp;
  createdAt: Timestamp;
}

// Interface cho thông báo xác nhận
export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

// Interface cho thông báo UI
export interface UINotification {
  id: string;
  type: UINotificationType;
  title: string;
  message: string;
  duration?: number;
  isClosable?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

// Interface cho state quản lý thông báo
export interface NotificationState {
  notifications: UINotification[];
  show: (notification: Omit<UINotification, 'id'>) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
  remove: (id: string) => void;
  clear: () => void;
} 