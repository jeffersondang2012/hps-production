import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { Product, ProductType } from '@/types/database.types';

interface ProductFormProps {
  onSubmit: (data: Omit<Product, 'id' | 'priceHistory' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: Product;
}

const schema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên sản phẩm'),
  type: z.enum(['CRUSHED_SAND', 'FILLING_SAND']),
  unit: z.string().min(1, 'Vui lòng nhập đơn vị tính'),
  currentPrice: z.number().min(0, 'Giá không hợp lệ'),
  description: z.string().optional(),
  isTrading: z.boolean(),
  minStock: z.number().min(0, 'Số lượng tồn kho tối thiểu không hợp lệ').optional()
});

type FormData = z.infer<typeof schema>;

const productTypeLabels: Record<ProductType, string> = {
  CRUSHED_SAND: 'Cát nghiền',
  FILLING_SAND: 'Cát san lấp'
};

export const ProductForm: FC<ProductFormProps> = ({
  onSubmit,
  isSubmitting,
  initialData
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      isTrading: false
    }
  });

  const isTrading = watch('isTrading');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Tên sản phẩm"
        {...register('name')}
        error={errors.name?.message}
      />

      <Select
        label="Loại sản phẩm"
        {...register('type')}
        error={errors.type?.message}
      >
        {Object.entries(productTypeLabels).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </Select>

      <Input
        label="Đơn vị tính"
        {...register('unit')}
        error={errors.unit?.message}
      />

      <Input
        type="number"
        label="Giá hiện tại"
        {...register('currentPrice', { valueAsNumber: true })}
        error={errors.currentPrice?.message}
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register('isTrading')}
          id="isTrading"
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isTrading" className="text-sm text-gray-700">
          Sản phẩm thương mại
        </label>
      </div>

      {isTrading && (
        <Input
          type="number"
          label="Tồn kho tối thiểu"
          {...register('minStock', { valueAsNumber: true })}
          error={errors.minStock?.message}
        />
      )}

      <Input
        label="Mô tả"
        {...register('description')}
        error={errors.description?.message}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {initialData ? 'Cập nhật' : 'Thêm sản phẩm'}
        </Button>
      </div>
    </form>
  );
}; 