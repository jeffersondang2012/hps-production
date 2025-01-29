import { FC, useState } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Table } from '@/components/molecules/Table';
import { Button } from '@/components/atoms/Button';
import { DebtDetail as IDebtDetail } from '@/services/core/debt.service';
import { formatCurrency, formatDate } from '@/utils/format';
import { PaymentModal } from './PaymentModal';
import { usePayments } from '@/hooks/resources/usePayments';
import { Timestamp } from 'firebase/firestore';

interface DebtDetailProps {
  isOpen: boolean;
  onClose: () => void;
  data: IDebtDetail | null;
}

export const DebtDetail: FC<DebtDetailProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { createPayment, isLoading: isSubmitting } = usePayments(data?.partnerId);

  if (!data) return null;

  const handleCreatePayment = async (formData: {
    amount: number;
    method: 'CASH' | 'TRANSFER' | 'BARTER';
    date: Date;
    note?: string;
    transactionIds: string[];
  }) => {
    await createPayment({
      ...formData,
      partnerId: data.partnerId,
      date: Timestamp.fromDate(formData.date),
      createdBy: 'admin'
    });
    setIsPaymentModalOpen(false);
  };

  const columns = [
    {
      header: 'Ngày',
      accessorKey: 'createdAt',
      cell: ({ value }: { value: string }) => formatDate(value)
    },
    {
      header: 'Loại',
      accessorKey: 'type',
      cell: ({ value }: { value: 'IN' | 'OUT' }) => value === 'IN' ? 'Nhập' : 'Xuất'
    },
    {
      header: 'Số lượng',
      accessorKey: 'quantity',
      cell: ({ value }: { value: number }) => value.toLocaleString('vi-VN')
    },
    {
      header: 'Đơn giá',
      accessorKey: 'price',
      cell: ({ value }: { value: number }) => formatCurrency(value)
    },
    {
      header: 'Thành tiền',
      id: 'total',
      cell: ({ row }: { row: { original: { price: number; quantity: number } } }) => 
        formatCurrency(row.original.price * row.original.quantity)
    },
    {
      header: 'Phương thức',
      accessorKey: 'paymentMethod',
      cell: ({ value }: { value: string }) => ({
        CASH: 'Tiền mặt',
        TRANSFER: 'Chuyển khoản',
        BARTER: 'Hàng đổi hàng'
      }[value])
    },
    {
      header: 'Trạng thái',
      accessorKey: 'paymentStatus',
      cell: ({ value }: { value: string }) => ({
        PENDING: 'Chưa thanh toán',
        PARTIAL: 'Thanh toán một phần',
        PAID: 'Đã thanh toán'
      }[value])
    }
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Chi tiết công nợ"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tên đối tác</p>
              <p className="font-medium">{data.partnerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Loại</p>
              <p className="font-medium">
                {data.partnerType === 'SUPPLIER' ? 'Nhà cung cấp' : 'Khách hàng'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Công nợ hiện tại</p>
              <p className={`font-medium ${data.debtAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {formatCurrency(Math.abs(data.debtAmount))}
                {data.debtAmount !== 0 && (data.debtAmount > 0 ? ' (Nợ)' : ' (Có)')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hạn mức công nợ</p>
              <p className="font-medium">{formatCurrency(data.debtLimit)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Trạng thái</p>
              <p className={`font-medium ${data.isOverLimit ? 'text-red-500' : 'text-green-500'}`}>
                {data.isOverLimit ? 'Vượt hạn mức' : 'Trong hạn mức'}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Lịch sử giao dịch</h3>
            <Button
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={!data.transactions.some(t => t.paymentStatus !== 'PAID')}
            >
              Tạo thanh toán
            </Button>
          </div>

          <Table
            data={data.transactions}
            columns={columns}
          />
        </div>
      </Modal>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        partnerId={data.partnerId}
        transactions={data.transactions}
        onSubmit={handleCreatePayment}
        isSubmitting={isSubmitting}
      />
    </>
  );
}; 