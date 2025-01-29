import { ProductionLine } from '@/types/database.types';
import { productionLineService } from '@/services/core/production-line.service';
import { useAsync } from '../common/useAsync';
import { useState, useCallback, useEffect } from 'react';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { Timestamp } from 'firebase/firestore';

interface UseProductionLinesOptions {
  status?: ProductionLine['status'];
  minCapacity?: number;
  maxCapacity?: number;
}

export const useProductionLines = (options: UseProductionLinesOptions = {}) => {
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationStore();

  const fetchProductionLines = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await productionLineService.getAll({
        where: [
          ...(options.status ? [['status', '==', options.status]] as [string, any, any][] : []),
          ...(options.minCapacity ? [['capacity', '>=', options.minCapacity]] as [string, any, any][] : []),
          ...(options.maxCapacity ? [['capacity', '<=', options.maxCapacity]] as [string, any, any][] : [])
        ]
      });
      setProductionLines(result);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải danh sách dây chuyền sản xuất');
    } finally {
      setIsLoading(false);
    }
  }, [options.status, options.minCapacity, options.maxCapacity, showError]);

  useEffect(() => {
    fetchProductionLines();
  }, [fetchProductionLines]);

  const createProductionLine = useAsync(
    async (data: Omit<ProductionLine, 'id'>) => {
      const result = await productionLineService.create({
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      await fetchProductionLines();
      return result;
    },
    {
      successMessage: 'Tạo dây chuyền sản xuất thành công',
      errorMessage: 'Lỗi khi tạo dây chuyền sản xuất',
      showNotification: true
    }
  );

  const updateProductionLine = useAsync(
    async (id: string, data: Partial<ProductionLine>) => {
      await productionLineService.update(id, data);
      await fetchProductionLines();
    },
    {
      successMessage: 'Cập nhật dây chuyền sản xuất thành công',
      errorMessage: 'Lỗi khi cập nhật dây chuyền sản xuất',
      showNotification: true
    }
  );

  const deleteProductionLine = useAsync(
    async (id: string) => {
      await productionLineService.delete(id);
      await fetchProductionLines();
    },
    {
      successMessage: 'Xóa dây chuyền sản xuất thành công',
      errorMessage: 'Lỗi khi xóa dây chuyền sản xuất',
      showNotification: true
    }
  );

  return {
    productionLines,
    isLoading,
    error,
    createProductionLine: createProductionLine.execute,
    updateProductionLine: updateProductionLine.execute,
    deleteProductionLine: deleteProductionLine.execute,
    refetch: fetchProductionLines
  };
};

// Hook for single production line
export const useProductionLine = (id: string) => {
  const [productionLine, setProductionLine] = useState<ProductionLine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationStore();

  const fetchProductionLine = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await productionLineService.getById(id);
      setProductionLine(result);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải thông tin dây chuyền sản xuất');
    } finally {
      setIsLoading(false);
    }
  }, [id, showError]);

  const updateProductionLine = useAsync(
    async (data: Partial<ProductionLine>) => {
      await productionLineService.update(id, data);
      await fetchProductionLine();
    },
    {
      successMessage: 'Cập nhật dây chuyền sản xuất thành công',
      errorMessage: 'Lỗi khi cập nhật dây chuyền sản xuất',
      showNotification: true
    }
  );

  const deleteProductionLine = useAsync(
    async () => {
      await productionLineService.delete(id);
    },
    {
      successMessage: 'Xóa dây chuyền sản xuất thành công',
      errorMessage: 'Lỗi khi xóa dây chuyền sản xuất',
      showNotification: true
    }
  );

  return {
    productionLine,
    isLoading,
    error,
    updateProductionLine: updateProductionLine.execute,
    deleteProductionLine: deleteProductionLine.execute,
    refetch: fetchProductionLine
  };
}; 