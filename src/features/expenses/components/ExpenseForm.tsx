import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { Expense, ExpenseType, ExpenseStatus } from '@/types/database.types';

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isSubmitting?: boolean;
  productionLineId?: string;
}

export const ExpenseForm: FC<ExpenseFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  productionLineId
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      type: initialData?.type || 'MATERIAL',
      amount: initialData?.amount || '',
      description: initialData?.description || '',
      productionLineId: productionLineId || initialData?.productionLineId || '',
      status: initialData?.status || 'PENDING'
    }
  });

  const onSubmitForm = handleSubmit(async (data) => {
    await onSubmit({
      type: data.type as ExpenseType,
      amount: Number(data.amount),
      description: data.description,
      productionLineId: productionLineId || data.productionLineId,
      status: (data.status || 'PENDING') as ExpenseStatus
    });
  });

  return (
    <form onSubmit={onSubmitForm} className="space-y-4">
      <Select
        label="Loại chi phí"
        {...register('type', { required: 'Vui lòng chọn loại chi phí' })}
        error={errors.type?.message}
        options={[
          { value: 'MATERIAL', label: 'Nguyên vật liệu' },
          { value: 'LABOR', label: 'Nhân công' },
          { value: 'OVERHEAD', label: 'Chi phí chung' }
        ]}
      />

      <Input
        type="number"
        label="Số tiền"
        {...register('amount', {
          required: 'Vui lòng nhập số tiền',
          min: { value: 0, message: 'Số tiền phải lớn hơn 0' }
        })}
        error={errors.amount?.message}
      />

      <Input
        label="Mô tả"
        {...register('description', { required: 'Vui lòng nhập mô tả' })}
        error={errors.description?.message}
      />

      <input type="hidden" {...register('productionLineId')} />
      <input type="hidden" {...register('status')} />

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </div>
    </form>
  );
}; 