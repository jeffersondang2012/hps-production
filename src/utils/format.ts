import { format as dateFnsFormat } from 'date-fns';
import { vi } from 'date-fns/locale';

// Format tiền tệ
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Format số điện thoại
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
};

// Format ngày tháng
export const formatDate = (date: Date | string, pattern = 'dd/MM/yyyy'): string => {
  return dateFnsFormat(new Date(date), pattern, { locale: vi });
};

// Format số lượng
export const formatQuantity = (value: number, unit: string): string => {
  return `${new Intl.NumberFormat('vi-VN').format(value)} ${unit}`;
};

// Format phần trăm
export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
}; 