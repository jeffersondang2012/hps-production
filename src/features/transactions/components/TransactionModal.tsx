import { FC, useEffect } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Transaction, TransactionType, Partner, PartnerType } from '@/types/database.types';
import { usePartners } from '@/hooks/resources/usePartners';
import { useProducts } from '@/hooks/resources/useProducts';
import { Select } from '@/components/atoms/Select';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Table } from '@/components/molecules/Table';
import { useForm, useFieldArray } from 'react-hook-form';
import { formatCurrency } from '@/utils/format';
import { useProductionLines } from '@/hooks/resources/useProductionLines';
import { Icon } from '@/components/atoms/Icon';
import { notificationService } from '@/services/core/notification.service';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt' | 'createdBy'>) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: Transaction;
}

interface UnitMapping {
  ROCK: 'm³';
  SAND: 'm³';
  OIL: 'lít';
}

const UNIT_MAPPING: UnitMapping = {
  ROCK: 'm³',
  SAND: 'm³', 
  OIL: 'lít'
};

interface TransactionForm {
  partnerId: string;
  productionLineId: string;
  category: string;
  vehicleNumber: string;
  description: string;
  productName: string;
  unit: 'm³' | 'lít';
  quantity: number;
  price: number;
}

export const TransactionModal: FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  type,
  onSubmit,
  isSubmitting,
  initialData
}) => {
  const { productionLines } = useProductionLines();
  const { partners } = usePartners();
  const { register, handleSubmit, watch, reset } = useForm<TransactionForm>();

  // Thêm watch để theo dõi loại giao dịch
  const transactionCategory = watch('category');

  // Reset form khi mở modal với dữ liệu mới
  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        partnerId: initialData.partnerId,
        productionLineId: initialData.productionLineId,
        category: initialData.items[0]?.category || 'PRODUCTION',
        vehicleNumber: initialData.vehicleNumber,
        description: initialData.description,
        productName: initialData.items[0]?.name || '',
        unit: initialData.items[0]?.type === 'OIL' ? 'lít' : 'm³',
        quantity: initialData.items[0]?.quantity || 0,
        price: initialData.items[0]?.price || 0
      });
    } else if (isOpen) {
      reset({
        partnerId: '',
        productionLineId: '',
        category: 'PRODUCTION',
        vehicleNumber: '',
        description: '',
        productName: '',
        unit: 'm³',
        quantity: 0,
        price: 0
      });
    }
  }, [isOpen, initialData]);

  // Lọc đối tác theo loại giao dịch
  const filteredPartners = partners.filter(partner => {
    if (type === 'IN') {
      return partner.type === 'SUPPLIER' || partner.type === 'BOTH';
    }
    return partner.type === 'CUSTOMER' || partner.type === 'BOTH';
  });

  const quantity = watch('quantity') || 0;
  const price = watch('price') || 0;
  const total = quantity * price;

  const handleFormSubmit = async (data: TransactionForm) => {
    try {
      // Tạo giao dịch
      const transaction = await onSubmit({
        partnerId: data.partnerId,
        productionLineId: data.productionLineId,
        vehicleNumber: data.vehicleNumber,
        description: data.description,
        type: type,
        items: [{
          name: data.productName,
          type: data.unit === 'lít' ? 'OIL' : 'ROCK',
          category: data.category,
          quantity: Number(data.quantity),
          price: Number(data.price),
          total: Number(data.quantity) * Number(data.price)
        }],
        paymentStatus: 'PENDING',
        status: 'COMPLETED'
      });

      // Gửi thông báo
      const partner = await partnerService.getById(data.partnerId);
      if (partner?.notificationPreference !== 'NONE') {
        const notificationPayload = {
          partnerId: data.partnerId,
          transactionType: type,
          vehicleNumber: data.vehicleNumber,
          productName: data.productName,
          quantity: data.quantity,
          unit: data.unit,
          total: data.quantity * data.price,
          createdAt: new Date()
        };

        if (partner.notificationPreference === 'ZALO' || partner.notificationPreference === 'BOTH') {
          await notificationService.sendZaloNotification(notificationPayload);
        }

        if (partner.notificationPreference === 'TELEGRAM' || partner.notificationPreference === 'BOTH') {
          await notificationService.sendTelegramNotification(notificationPayload);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${initialData ? 'Cập nhật' : type === 'IN' ? 'Nhập hàng' : 'Xuất hàng'}`}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Đối tác"
            {...register('partnerId', { required: 'Vui lòng chọn đối tác' })}
          >
            <option value="">Chọn đối tác</option>
            {filteredPartners.map(partner => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </Select>

          <Select
            label="Phân loại"
            {...register('category')}
          >
            <option value="PRODUCTION">Sản xuất</option>
            <option value="TRADING">Thương mại</option>
          </Select>
        </div>

        {/* Chỉ hiện dây chuyền khi là sản xuất */}
        {transactionCategory === 'PRODUCTION' && (
          <Select
            label="Dây chuyền sản xuất"
            {...register('productionLineId', { required: 'Vui lòng chọn dây chuyền' })}
          >
            <option value="">Chọn dây chuyền</option>
            {productionLines.map(line => (
              <option key={line.id} value={line.id}>
                {line.name}
              </option>
            ))}
          </Select>
        )}

        <Input
          label="Số xe"
          placeholder="Nhập biển số xe"
          {...register('vehicleNumber', { required: 'Vui lòng nhập biển số xe' })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Tên sản phẩm"
            {...register('productName', { required: 'Vui lòng nhập tên sản phẩm' })}
          />

          <Select
            label="Đơn vị tính"
            {...register('unit')}
          >
            <option value="m³">m³</option>
            <option value="lít">lít</option>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            type="number"
            label="Số lượng"
            min={0}
            step={0.1}
            {...register('quantity', { required: 'Vui lòng nhập số lượng' })}
          />

          <Input
            type="number"
            label="Đơn giá"
            min={0}
            {...register('price', { required: 'Vui lòng nhập đơn giá' })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thành tiền
            </label>
            <div className="h-10 px-3 border border-gray-300 rounded-md bg-gray-50 flex items-center">
              {formatCurrency(total)}
            </div>
          </div>
        </div>

        <Input
          label="Ghi chú"
          {...register('description')}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            {initialData ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}; 