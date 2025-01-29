import { Expense } from '@/types/database.types';
import { expenseService } from '@/services/core/expense.service';
import { useAsync } from '../common/useAsync';
import { useState, useCallback } from 'react';
import { useNotificationStore } from '@/stores/useNotificationStore';

export const useExpenses = (productionLineId?: string) => {
  const [expenses, setExpenses] = useState<(Expense & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showSuccess, showError } = useNotificationStore();

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await expenseService.getAll({
        where: productionLineId ? [['productionLineId', '==', productionLineId]] : undefined
      });
      setExpenses(result);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải danh sách chi phí');
    } finally {
      setIsLoading(false);
    }
  }, [productionLineId, showError]);

  const createExpense = useAsync(
    async (data: Omit<Expense, 'id'>) => {
      const id = await expenseService.create(data);
      await fetchExpenses();
      return id;
    },
    {
      successMessage: 'Tạo chi phí thành công',
      errorMessage: 'Lỗi khi tạo chi phí',
      showNotification: true
    }
  );

  const updateExpense = useAsync(
    async (id: string, data: Partial<Expense>) => {
      await expenseService.update(id, data);
      await fetchExpenses();
    },
    {
      successMessage: 'Cập nhật chi phí thành công',
      errorMessage: 'Lỗi khi cập nhật chi phí',
      showNotification: true
    }
  );

  const deleteExpense = useAsync(
    async (id: string) => {
      await expenseService.delete(id);
      await fetchExpenses();
    },
    {
      successMessage: 'Xóa chi phí thành công',
      errorMessage: 'Lỗi khi xóa chi phí',
      showNotification: true
    }
  );

  const approveExpense = useAsync(
    async (id: string) => {
      await expenseService.update(id, { status: 'APPROVED' });
      await fetchExpenses();
    },
    {
      successMessage: 'Phê duyệt chi phí thành công',
      errorMessage: 'Lỗi khi phê duyệt chi phí',
      showNotification: true
    }
  );

  const rejectExpense = useAsync(
    async (id: string) => {
      await expenseService.update(id, { status: 'REJECTED' });
      await fetchExpenses();
    },
    {
      successMessage: 'Từ chối chi phí thành công',
      errorMessage: 'Lỗi khi từ chối chi phí',
      showNotification: true
    }
  );

  return {
    expenses,
    isLoading,
    error,
    createExpense: createExpense.execute,
    updateExpense: updateExpense.execute,
    deleteExpense: deleteExpense.execute,
    approveExpense: approveExpense.execute,
    rejectExpense: rejectExpense.execute,
    refetch: fetchExpenses
  };
}; 