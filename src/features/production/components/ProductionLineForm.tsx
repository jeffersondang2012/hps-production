import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { ProductionLine } from '@/types/database.types';

// Schema cho form input
const formSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên dây chuyền'),
  capacity: z.string().min(1, 'Vui lòng nhập công suất'),
  status: z.enum(['active', 'inactive']).default('active')
});

type FormInput = z.infer<typeof formSchema>;

// Schema cho data sau khi transform
export const schema = z.object({
  name: z.string(),
  capacity: z.number().min(0, 'Công suất không hợp lệ'),
  status: z.enum(['active', 'inactive'])
});

export type FormData = z.infer<typeof schema>;

interface ProductionLineFormProps {
  initialData?: ProductionLine;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

export const ProductionLineForm: FC<ProductionLineFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      capacity: initialData?.capacity?.toString() ?? '',
      status: initialData?.status ?? 'active'
    }
  });

  const handleFormSubmit = (data: FormInput) => {
    const parsedData = {
      name: data.name,
      capacity: Number(data.capacity),
      status: data.status
    };

    const validatedData = schema.parse(parsedData);
    return onSubmit(validatedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Tên dây chuyền"
        {...register('name')}
        error={errors.name?.message}
      />
      
      <Input
        label="Công suất"
        type="number"
        {...register('capacity')}
        error={errors.capacity?.message}
      />

      <Select
        label="Trạng thái"
        {...register('status')}
        error={errors.status?.message}
      >
        <option value="active">Hoạt động</option>
        <option value="inactive">Không hoạt động</option>
      </Select>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang xử lý...' : (initialData ? 'Cập nhật' : 'Thêm mới')}
        </Button>
      </div>
    </form>
  );
}; 