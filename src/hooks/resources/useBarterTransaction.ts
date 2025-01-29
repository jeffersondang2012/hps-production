import { useState } from 'react';
import { useAsync } from '../common/useAsync';
import { transactionService } from '@/services/core/transaction.service';
import { useAuth } from '../auth/useAuth';
import { Transaction } from '@/types/database.types';

interface BarterProduct {
  productId: string;
  quantity: number;
  price: number;
}

interface BarterTransactionInput {
  partnerId: string;
  vehicleNumber: string;
  outProduct: BarterProduct;
  inProduct: BarterProduct;
}

interface BarterTransactionData extends BarterTransactionInput {
  createdBy: string;
}

interface BarterTransactionResult {
  outTransaction: Transaction;
  inTransaction: Transaction;
}

export const useBarterTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const createBarter = useAsync(
    async (data: BarterTransactionInput): Promise<BarterTransactionResult> => {
      if (!user) throw new Error('Người dùng chưa đăng nhập');
      
      try {
        setIsLoading(true);
        setError(null);
        const barterData: BarterTransactionData = {
          ...data,
          createdBy: user.id
        };
        const result = await transactionService.createBarter(barterData);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    {
      successMessage: 'Tạo giao dịch đổi hàng thành công',
      errorMessage: 'Lỗi khi tạo giao dịch đổi hàng',
      showNotification: true
    }
  );

  return {
    createBarter: createBarter.execute,
    isLoading,
    error
  };
}; 