import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { Transaction, TransactionType, PaymentMethod, PaymentStatus } from '@/types/database.types';

interface TransactionFormProps {
  productionLineId: string;
  type: TransactionType;
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt' | 'createdBy'>) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: Transaction;
}

const schema = z.object({
  productId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
  quantity: z.number().min(0.1, 'Số lượng phải lớn hơn 0'),
  price: z.number().min(0, 'Đơn giá không hợp lệ'),
  partnerId: z.string().min(1, 'Vui lòng chọn đối tác'),
  vehicleNumber: z.string().min(1, 'Vui lòng nhập biển số xe'),
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'BARTER']),
  paymentStatus: z.enum(['PENDING', 'PARTIAL', 'PAID']),
  barterDetails: z.object({
    productId: z.string(),
    quantity: z.number().min(0),
    price: z.number().min(0)
  }).optional()
});

type FormData = z.infer<typeof schema>;

export const TransactionForm: FC<TransactionFormProps> = ({
  productionLineId,
  type,
  onSubmit,
  isSubmitting,
  initialData
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      paymentMethod: 'CASH',
      paymentStatus: 'PENDING'
    }
  });

  const paymentMethod = watch('paymentMethod');

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      type,
      productionLineId
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Sản phẩm"
          {...register('productId')}
          error={errors.productId?.message}
        >
          <option value="">Chọn sản phẩm</option>
          {/* TODO: Add product options */}
        </Select>

        <Select
          label="Đối tác"
          {...register('partnerId')}
          error={errors.partnerId?.message}
        >
          <option value="">Chọn đối tác</option>
          {/* TODO: Add partner options */}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="Số lượng"
          step="0.1"
          {...register('quantity', { valueAsNumber: true })}
          error={errors.quantity?.message}
        />

        <Input
          type="number"
          label="Đơn giá"
          {...register('price', { valueAsNumber: true })}
          error={errors.price?.message}
        />
      </div>

      <Input
        label="Biển số xe"
        {...register('vehicleNumber')}
        error={errors.vehicleNumber?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Phương thức thanh toán"
          {...register('paymentMethod')}
          error={errors.paymentMethod?.message}
        >
          <option value="CASH">Tiền mặt</option>
          <option value="TRANSFER">Chuyển khoản</option>
          <option value="BARTER">Đối trừ hàng</option>
        </Select>

        <Select
          label="Trạng thái thanh toán"
          {...register('paymentStatus')}
          error={errors.paymentStatus?.message}
        >
          <option value="PENDING">Chưa thanh toán</option>
          <option value="PARTIAL">Thanh toán một phần</option>
          <option value="PAID">Đã thanh toán</option>
        </Select>
      </div>

      {paymentMethod === 'BARTER' && (
        <div className="space-y-4 p-4 border rounded-md">
          <h4 className="font-medium">Thông tin đối trừ</h4>
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Sản phẩm đối trừ"
              {...register('barterDetails.productId')}
              error={errors.barterDetails?.productId?.message}
            >
              <option value="">Chọn sản phẩm</option>
              {/* TODO: Add product options */}
            </Select>

            <Input
              type="number"
              label="Số lượng"
              step="0.1"
              {...register('barterDetails.quantity', { valueAsNumber: true })}
              error={errors.barterDetails?.quantity?.message}
            />

            <Input
              type="number"
              label="Đơn giá"
              {...register('barterDetails.price', { valueAsNumber: true })}
              error={errors.barterDetails?.price?.message}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {initialData ? 'Cập nhật' : type === 'IMPORT' ? 'Nhập hàng' : 'Xuất hàng'}
        </Button>
      </div>
    </form>
  );
}; 