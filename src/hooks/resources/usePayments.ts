import { Payment } from '@/types/database.types';
import { paymentService } from '@/services/core/payment.service';
import { useAsync } from '../common/useAsync';
import { useState, useCallback } from 'react';
import { useNotificationStore } from '@/stores/useNotificationStore';

interface UsePaymentsOptions {
  partnerId?: string;
  status?: Payment['status'];
}

export const usePayments = (options: UsePaymentsOptions = {}) => {
  const [payments, setPayments] = useState<(Payment & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showSuccess, showError } = useNotificationStore();

  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      let result;
      if (options.partnerId) {
        result = await paymentService.getByPartner(options.partnerId);
      } else {
        result = await paymentService.getAll();
      }
      setPayments(result);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải danh sách thanh toán');
    } finally {
      setIsLoading(false);
    }
  }, [options.partnerId, showError]);

  const createPayment = useAsync(
    async (data: Omit<Payment, 'id'>) => {
      const result = await paymentService.create(data);
      await fetchPayments();
      return result;
    },
    {
      successMessage: 'Tạo thanh toán thành công',
      errorMessage: 'Lỗi khi tạo thanh toán',
      showNotification: true
    }
  );

  const updatePayment = useAsync(
    async (id: string, data: Partial<Payment>) => {
      await paymentService.update(id, data);
      await fetchPayments();
    },
    {
      successMessage: 'Cập nhật thanh toán thành công',
      errorMessage: 'Lỗi khi cập nhật thanh toán',
      showNotification: true
    }
  );

  const deletePayment = useAsync(
    async (id: string) => {
      await paymentService.delete(id);
      await fetchPayments();
    },
    {
      successMessage: 'Xóa thanh toán thành công',
      errorMessage: 'Lỗi khi xóa thanh toán',
      showNotification: true
    }
  );

  // Filter data based on options
  const filteredPayments = payments.filter(payment => {
    if (options.status && payment.status !== options.status) return false;
    return true;
  });

  return {
    payments: filteredPayments,
    isLoading,
    error,
    createPayment: createPayment.execute,
    updatePayment: updatePayment.execute,
    deletePayment: deletePayment.execute,
    refetch: fetchPayments
  };
};

// Hook for single payment
export const usePayment = (id: string) => {
  const [payment, setPayment] = useState<(Payment & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showSuccess, showError } = useNotificationStore();

  const fetchPayment = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const payments = await paymentService.getAll();
      const found = payments.find(p => p.id === id);
      setPayment(found || null);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải thông tin thanh toán');
    } finally {
      setIsLoading(false);
    }
  }, [id, showError]);

  const updatePayment = useAsync(
    async (data: Partial<Payment>) => {
      await paymentService.update(id, data);
      await fetchPayment();
    },
    {
      successMessage: 'Cập nhật thanh toán thành công',
      errorMessage: 'Lỗi khi cập nhật thanh toán',
      showNotification: true
    }
  );

  const deletePayment = useAsync(
    async () => {
      await paymentService.delete(id);
    },
    {
      successMessage: 'Xóa thanh toán thành công',
      errorMessage: 'Lỗi khi xóa thanh toán',
      showNotification: true
    }
  );

  return {
    payment,
    isLoading,
    error,
    updatePayment: updatePayment.execute,
    deletePayment: deletePayment.execute,
    refetch: fetchPayment
  };
}; 