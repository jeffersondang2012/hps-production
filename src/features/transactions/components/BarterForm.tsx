import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { Product, Partner } from '@/types/database.types';
import { formatCurrency } from '@/utils/format';

interface BarterFormProps {
  products: Product[];
  partners: Partner[];
  onSubmit: (data: {
    partnerId: string;
    vehicleNumber: string;
    outProduct: {
      productId: string;
      quantity: number;
      price: number;
    };
    inProduct: {
      productId: string;
      quantity: number;
      price: number;
    };
    createdBy?: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

const schema = z.object({
  partnerId: z.string().min(1, 'Vui lòng chọn đối tác'),
  vehicleNumber: z.string().min(1, 'Vui lòng nhập biển số xe'),
  outProduct: z.object({
    productId: z.string().min(1, 'Vui lòng chọn sản phẩm xuất'),
    quantity: z.number().min(0.1, 'Số lượng phải lớn hơn 0'),
    price: z.number().min(1000, 'Đơn giá phải lớn hơn 1,000đ')
  }),
  inProduct: z.object({
    productId: z.string().min(1, 'Vui lòng chọn sản phẩm nhập'),
    quantity: z.number().min(0.1, 'Số lượng phải lớn hơn 0'),
    price: z.number().min(1000, 'Đơn giá phải lớn hơn 1,000đ')
  })
});

type FormValues = {
  partnerId: string;
  vehicleNumber: string;
  outProduct: {
    productId: string;
    quantity: number;
    price: number;
  };
  inProduct: {
    productId: string;
    quantity: number;
    price: number;
  };
};

export const BarterForm: FC<BarterFormProps> = ({
  products,
  partners,
  onSubmit,
  isSubmitting = false
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      partnerId: '',
      vehicleNumber: '',
      outProduct: {
        productId: '',
        quantity: 0,
        price: 0
      },
      inProduct: {
        productId: '',
        quantity: 0,
        price: 0
      }
    }
  });

  const outProduct = watch('outProduct');
  const inProduct = watch('inProduct');

  const outTotal = (outProduct.quantity || 0) * (outProduct.price || 0);
  const inTotal = (inProduct.quantity || 0) * (inProduct.price || 0);
  const difference = outTotal - inTotal;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Đối tác"
          {...register('partnerId')}
          error={errors.partnerId?.message}
        >
          <option value="">Chọn đối tác</option>
          {partners.map(partner => (
            <option key={partner.id} value={partner.id}>
              {partner.name}
            </option>
          ))}
        </Select>

        <Input
          label="Biển số xe"
          {...register('vehicleNumber')}
          error={errors.vehicleNumber?.message}
        />
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium">Thông tin xuất hàng</h4>
        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Sản phẩm"
            {...register('outProduct.productId')}
            error={errors.outProduct?.productId?.message}
          >
            <option value="">Chọn sản phẩm</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </Select>

          <Input
            type="number"
            label="Số lượng"
            {...register('outProduct.quantity', { valueAsNumber: true })}
            error={errors.outProduct?.quantity?.message}
          />

          <Input
            type="number"
            label="Đơn giá"
            {...register('outProduct.price', { valueAsNumber: true })}
            error={errors.outProduct?.price?.message}
          />
        </div>
        <p className="text-right text-sm">
          Thành tiền: <span className="font-medium">{formatCurrency(outTotal)}</span>
        </p>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium">Thông tin nhập hàng</h4>
        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Sản phẩm"
            {...register('inProduct.productId')}
            error={errors.inProduct?.productId?.message}
          >
            <option value="">Chọn sản phẩm</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </Select>

          <Input
            type="number"
            label="Số lượng"
            {...register('inProduct.quantity', { valueAsNumber: true })}
            error={errors.inProduct?.quantity?.message}
          />

          <Input
            type="number"
            label="Đơn giá"
            {...register('inProduct.price', { valueAsNumber: true })}
            error={errors.inProduct?.price?.message}
          />
        </div>
        <p className="text-right text-sm">
          Thành tiền: <span className="font-medium">{formatCurrency(inTotal)}</span>
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm text-gray-600">
          Chênh lệch: <span className={`font-medium ${difference > 0 ? 'text-red-500' : difference < 0 ? 'text-green-500' : ''}`}>
            {formatCurrency(Math.abs(difference))}
            {difference !== 0 && (difference > 0 ? ' (Nợ)' : ' (Có)')}
          </span>
        </p>
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        Tạo giao dịch
      </Button>
    </form>
  );
}; 