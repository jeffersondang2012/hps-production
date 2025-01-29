import { Partner } from '@/types/database.types';
import { partnerService } from '@/services/core/partner.service';
import { useAsync } from '../common/useAsync';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/auth/useAuth';

interface UsePartnersOptions {
  type?: Partner['type'];
  isActive?: boolean;
  hasCreditLimit?: boolean;
  isOverCreditLimit?: boolean;
}

export const usePartners = (options: UsePartnersOptions = {}) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationStore();
  const { user } = useAuth();

  const fetchPartners = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await partnerService.getAll();
      setPartners(result);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải danh sách đối tác');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const createPartner = useAsync(
    async (data: Omit<Partner, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
      if (!user?.id) throw new Error('Unauthorized');

      const now = Timestamp.now();
      const partnerData = {
        ...data,
        createdBy: user?.id,
        createdAt: now,
        updatedAt: now,
        isActive: true,
        currentDebt: 0,
        notificationChannels: {
          zalo: null,
          telegram: null
        }
      };

      const result = await partnerService.create(partnerData);
      await fetchPartners();
      return result;
    },
    {
      successMessage: 'Tạo đối tác thành công',
      errorMessage: 'Lỗi khi tạo đối tác',
      showNotification: true
    }
  );

  const updatePartner = useAsync(
    async (id: string, data: Partial<Partner>) => {
      await partnerService.update(id, {
        ...data,
        updatedAt: Timestamp.now()
      });
      await fetchPartners();
    },
    {
      successMessage: 'Cập nhật đối tác thành công',
      errorMessage: 'Lỗi khi cập nhật đối tác',
      showNotification: true
    }
  );

  const deletePartner = useAsync(
    async (id: string) => {
      await partnerService.delete(id);
      await fetchPartners();
    },
    {
      successMessage: 'Xóa đối tác thành công',
      errorMessage: 'Lỗi khi xóa đối tác',
      showNotification: true
    }
  );

  // Filter partners locally
  const filteredPartners = useMemo(() => {
    return partners.filter(partner => {
      if (options.type && partner.type !== options.type) return false;
      if (options.isActive !== undefined && partner.isActive !== options.isActive) return false;
      if (options.hasCreditLimit !== undefined) {
        const hasLimit = partner.debtLimit !== undefined && partner.debtLimit > 0;
        if (hasLimit !== options.hasCreditLimit) return false;
      }
      if (options.isOverCreditLimit !== undefined) {
        const isOver = partner.debtLimit !== undefined && partner.debtLimit > 0;
        if (isOver !== options.isOverCreditLimit) return false;
      }
      return true;
    });
  }, [partners, options.type, options.isActive, options.hasCreditLimit, options.isOverCreditLimit]);

  return {
    partners: filteredPartners,
    isLoading,
    error,
    createPartner: createPartner.execute,
    updatePartner: updatePartner.execute,
    deletePartner: deletePartner.execute,
    refetch: fetchPartners
  };
};

// Hook for single partner
export const usePartner = (id: string) => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationStore();

  const fetchPartner = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await partnerService.getById(id);
      setPartner(result);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải thông tin đối tác');
    } finally {
      setIsLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    fetchPartner();
  }, [fetchPartner]);

  const updatePartner = useAsync(
    async (data: Partial<Partner>) => {
      await partnerService.update(id, {
        ...data,
        updatedAt: Timestamp.now()
      });
      await fetchPartner();
    },
    {
      successMessage: 'Cập nhật đối tác thành công',
      errorMessage: 'Lỗi khi cập nhật đối tác',
      showNotification: true
    }
  );

  const deletePartner = useAsync(
    async () => {
      await partnerService.delete(id);
    },
    {
      successMessage: 'Xóa đối tác thành công',
      errorMessage: 'Lỗi khi xóa đối tác',
      showNotification: true
    }
  );

  const updateCreditLimit = useAsync(
    async (newLimit: number) => {
      await partnerService.update(id, {
        creditLimit: newLimit,
        updatedAt: Timestamp.now()
      } as Partial<Partner>);
      await fetchPartner();
    },
    {
      successMessage: 'Cập nhật hạn mức tín dụng thành công',
      errorMessage: 'Lỗi khi cập nhật hạn mức tín dụng',
      showNotification: true
    }
  );

  return {
    partner,
    isLoading,
    error,
    updatePartner: updatePartner.execute,
    deletePartner: deletePartner.execute,
    updateCreditLimit: updateCreditLimit.execute,
    refetch: fetchPartner
  };
}; 