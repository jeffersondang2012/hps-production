import { Transaction } from '@/types/database.types';
import { transactionService } from '@/services/core/transaction.service';
import { useAsync } from '../common/useAsync';
import { useState, useCallback } from 'react';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { partnerService } from '@/services/core/partner.service';
import { productionLineService } from '@/services/core/production-line.service';

interface UseTransactionsOptions {
  partnerId?: string;
  type?: Transaction['type'];
  paymentStatus?: Transaction['paymentStatus'];
  dateRange?: [Date, Date];
}

export const useTransactions = (options: UseTransactionsOptions = {}) => {
  const [transactions, setTransactions] = useState<(Transaction & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showSuccess, showError } = useNotificationStore();

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      let result;
      if (options.partnerId) {
        result = await transactionService.getByPartner(options.partnerId);
      } else {
        result = await transactionService.getAll();
      }
      
      // Lấy thêm thông tin đối tác và dây chuyền
      const transactionsWithDetails = await Promise.all(
        result.map(async transaction => {
          const [partner, productionLine] = await Promise.all([
            partnerService.getById(transaction.partnerId),
            productionLineService.getById(transaction.productionLineId)
          ]);
          return {
            ...transaction,
            partner,
            productionLine
          };
        })
      );
      
      setTransactions(transactionsWithDetails);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải danh sách giao dịch');
    } finally {
      setIsLoading(false);
    }
  }, [options.partnerId, showError]);

  const createTransaction = useAsync(
    async (data: Omit<Transaction, 'id' | 'createdAt' | 'createdBy'>) => {
      const result = await transactionService.create(data);
      await fetchTransactions();
      return result;
    },
    {
      successMessage: 'Tạo giao dịch thành công',
      errorMessage: 'Lỗi khi tạo giao dịch',
      showNotification: true
    }
  );

  const updateTransaction = useAsync(
    async (id: string, data: Partial<Transaction>) => {
      await transactionService.update(id, data);
      await fetchTransactions();
    },
    {
      successMessage: 'Cập nhật giao dịch thành công',
      errorMessage: 'Lỗi khi cập nhật giao dịch',
      showNotification: true
    }
  );

  const deleteTransaction = useAsync(
    async (id: string) => {
      await transactionService.delete(id);
      await fetchTransactions();
    },
    {
      successMessage: 'Xóa giao dịch thành công',
      errorMessage: 'Lỗi khi xóa giao dịch',
      showNotification: true
    }
  );

  // Filter data based on options
  const filteredTransactions = transactions.filter(transaction => {
    if (options.type && transaction.type !== options.type) return false;
    if (options.paymentStatus && transaction.paymentStatus !== options.paymentStatus) return false;
    if (options.dateRange) {
      const [start, end] = options.dateRange;
      const date = transaction.createdAt.toDate();
      if (date < start || date > end) return false;
    }
    return true;
  });

  return {
    transactions: filteredTransactions,
    isLoading,
    error,
    createTransaction: createTransaction.execute,
    updateTransaction: updateTransaction.execute,
    deleteTransaction: deleteTransaction.execute,
    fetchTransactions
  };
};

// Hook for single transaction
export const useTransaction = (id: string) => {
  const [transaction, setTransaction] = useState<(Transaction & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showSuccess, showError } = useNotificationStore();

  const fetchTransaction = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const transactions = await transactionService.getAll();
      const found = transactions.find(t => t.id === id);
      setTransaction(found || null);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải thông tin giao dịch');
    } finally {
      setIsLoading(false);
    }
  }, [id, showError]);

  const updateTransaction = useAsync(
    async (data: Partial<Transaction>) => {
      await transactionService.update(id, data);
      await fetchTransaction();
    },
    {
      successMessage: 'Cập nhật giao dịch thành công',
      errorMessage: 'Lỗi khi cập nhật giao dịch',
      showNotification: true
    }
  );

  const deleteTransaction = useAsync(
    async () => {
      await transactionService.delete(id);
    },
    {
      successMessage: 'Xóa giao dịch thành công',
      errorMessage: 'Lỗi khi xóa giao dịch',
      showNotification: true
    }
  );

  return {
    transaction,
    isLoading,
    error,
    updateTransaction: updateTransaction.execute,
    deleteTransaction: deleteTransaction.execute,
    refetch: fetchTransaction
  };
}; 