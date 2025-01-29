import { DebtSummary, DebtDetail } from '@/types/database.types';
import { debtService } from '@/services/core/debt.service';
import { useAsync } from '../common/useAsync';
import { useState, useCallback } from 'react';
import { useNotificationStore } from '@/stores/useNotificationStore';

interface UseDebtsOptions {
  isOverLimit?: boolean;
  partnerType?: DebtSummary['partnerType'];
}

export const useDebts = (options: UseDebtsOptions = {}) => {
  const [summaries, setSummaries] = useState<DebtSummary[]>([]);
  const [selectedDebt, setSelectedDebt] = useState<DebtDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationStore();

  const fetchSummaries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await debtService.getDebtSummaries();
      setSummaries(result);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải danh sách công nợ');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  const fetchDebtDetail = useAsync(
    async (partnerId: string) => {
      const result = await debtService.getDebtDetail(partnerId);
      setSelectedDebt(result);
      return result;
    },
    {
      errorMessage: 'Lỗi khi tải chi tiết công nợ',
      showNotification: true
    }
  );

  // Filter data based on options
  const filteredSummaries = summaries.filter(summary => {
    if (options.isOverLimit !== undefined && summary.isOverLimit !== options.isOverLimit) return false;
    if (options.partnerType && summary.partnerType !== options.partnerType) return false;
    return true;
  });

  return {
    summaries: filteredSummaries,
    selectedDebt,
    isLoading,
    error,
    fetchSummaries,
    fetchDebtDetail: fetchDebtDetail.execute,
    clearSelectedDebt: () => setSelectedDebt(null)
  };
};

// Hook for single debt detail
export const useDebtDetail = (partnerId: string) => {
  const [debtDetail, setDebtDetail] = useState<DebtDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationStore();

  const fetchDebtDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await debtService.getDebtDetail(partnerId);
      setDebtDetail(result);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải chi tiết công nợ');
    } finally {
      setIsLoading(false);
    }
  }, [partnerId, showError]);

  return {
    debtDetail,
    isLoading,
    error,
    refetch: fetchDebtDetail
  };
}; 