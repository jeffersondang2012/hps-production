import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { Transaction, PaymentMethod } from '@/types/database.types';
import { formatCurrency } from '@/utils/format';

interface PaymentFormProps {
  partnerId: string;
  transactions: Transaction[];
  onSubmit: (data: {
    amount: number;
    method: PaymentMethod;
    date: Date;
    note?: string;
    transactionIds: string[];
  }) => Promise<void>;
  isSubmitting: boolean;
}

const schema = z.object({
  amount: z.number().min(1, 'Số tiền phải lớn hơn 0'),
  method: z.enum(['CASH', 'TRANSFER', 'BARTER'] as const),
  date: z.date(),
  note: z.string().optional(),
  transactionIds: z.array(z.string()).min(1, 'Chọn ít nhất một giao dịch')
});

export const PaymentForm: FC<PaymentFormProps> = ({
  partnerId,
  transactions,
  onSubmit,
  isSubmitting
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      method: 'CASH' as const,
      date: new Date(),
      transactionIds: []
    }
  });

  const unpaidTransactions = transactions.filter(
    t => t.paymentStatus !== 'PAID'
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Giao dịch cần thanh toán
        </label>
        <div className="space-y-2">
          {unpaidTransactions.map(transaction => {
            const amount = transaction.price * transaction.quantity;
            return (
              <div key={transaction.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('transactionIds')}
                  value={transaction.id}
                  className="rounded border-gray-300"
                />
                <span>
                  {transaction.type === 'IN' ? 'Nhập' : 'Xuất'} - {formatCurrency(amount)}
                  {transaction.paymentStatus === 'PARTIAL' && ' (Thanh toán một phần)'}
                </span>
              </div>
            );
          })}
        </div>
        {errors.transactionIds && (
          <p className="mt-1 text-sm text-red-600">{errors.transactionIds.message}</p>
        )}
      </div>

      <Input
        type="number"
        label="Số tiền thanh toán"
        {...register('amount', { valueAsNumber: true })}
        error={errors.amount?.message}
      />

      <Select
        label="Phương thức thanh toán"
        {...register('method')}
        error={errors.method?.message}
      >
        <option value="CASH">Tiền mặt</option>
        <option value="TRANSFER">Chuyển khoản</option>
        <option value="BARTER">Hàng đổi hàng</option>
      </Select>

      <Input
        type="date"
        label="Ngày thanh toán"
        {...register('date', { valueAsDate: true })}
        error={errors.date?.message}
      />

      <Input
        label="Ghi chú"
        {...register('note')}
        error={errors.note?.message}
      />

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        Tạo thanh toán
      </Button>
    </form>
  );
}; 