import { FC } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { useForm } from 'react-hook-form';
import { Expense } from '@/types/database.types';
import { useProductionLines } from '@/hooks/resources/useProductionLines';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Expense;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
}

interface ExpenseFormData {
  productionLineId: string;
  type: 'LABOR' | 'ELECTRICITY' | 'MAINTENANCE' | 'OTHER';
  amount: number;
  description: string;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
  paidAmount?: number;
  // Điện
  meterStart?: number;
  meterEnd?: number;
  rate?: number;
  // Bảo trì
  maintenanceType?: 'REGULAR' | 'REPAIR' | 'REPLACEMENT';
  partName?: string;
  partsCost?: number;
  laborCost?: number;
}

export const ExpenseModal: FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit
}) => {
  const { productionLines } = useProductionLines();
  const { register, watch, handleSubmit } = useForm<ExpenseFormData>({
    defaultValues: initialData
  });
  const expenseType = watch('type');

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? "Cập nhật chi phí" : "Thêm chi phí mới"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Dây chuyền sản xuất"
          required
          {...register('productionLineId')}
        >
          <option value="">Chọn dây chuyền</option>
          {productionLines.map(line => (
            <option key={line.id} value={line.id}>{line.name}</option>
          ))}
        </Select>

        <Select
          label="Loại chi phí"
          required
          {...register('type')}
        >
          <option value="LABOR">Nhân công</option>
          <option value="ELECTRICITY">Điện</option>
          <option value="MAINTENANCE">Bảo trì</option>
          <option value="OTHER">Khác</option>
        </Select>

        {expenseType === 'LABOR' && (
          <>
            <Input
              type="number" 
              label="Số tiền"
              required
              {...register('amount')}
            />
            <Input
              label="Mô tả"
              placeholder="VD: Tiền công nhân A tháng 3"
              {...register('description')}
            />
          </>
        )}

        {expenseType === 'ELECTRICITY' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Chỉ số đầu"
                required
                {...register('meterStart')}
              />
              <Input
                type="number"
                label="Chỉ số cuối"
                required
                {...register('meterEnd')} 
              />
            </div>
            <Input
              type="number"
              label="Đơn giá"
              required
              {...register('rate')}
            />
            <Input
              type="number"
              label="Tổng tiền"
              required
              {...register('amount')}
            />
            <Input
              label="Mô tả"
              placeholder="VD: Tiền điện tháng 3/2024"
              {...register('description')}
            />
          </>
        )}

        {expenseType === 'MAINTENANCE' && (
          <>
            <Select
              label="Loại bảo trì"
              required
              {...register('maintenanceType')}
            >
              <option value="REGULAR">Định kỳ</option>
              <option value="REPAIR">Sửa chữa</option>
              <option value="REPLACEMENT">Thay thế</option>
            </Select>
            <Input
              label="Thiết bị/Bộ phận"
              required
              {...register('partName')}
            />
            <Input
              type="number"
              label="Chi phí phụ tùng"
              {...register('partsCost')}
            />
            <Input
              type="number"
              label="Chi phí nhân công"
              {...register('laborCost')}
            />
            <Input
              type="number"
              label="Tổng chi phí"
              required
              {...register('amount')}
            />
            <Input
              label="Mô tả chi tiết"
              {...register('description')}
            />
          </>
        )}

        <Select
          label="Trạng thái thanh toán"
          {...register('paymentStatus')}
        >
          <option value="UNPAID">Chưa thanh toán</option>
          <option value="PARTIALLY_PAID">Thanh toán một phần</option>
          <option value="PAID">Đã thanh toán</option>
        </Select>

        {watch('paymentStatus') !== 'UNPAID' && (
          <Input
            type="number"
            label="Số tiền đã thanh toán"
            {...register('paidAmount')}
          />
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button type="submit">Lưu</Button>
        </div>
      </form>
    </Modal>
  );
}; 