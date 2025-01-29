import { FC } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Table } from '@/components/molecules/Table';
import { Partner, Transaction } from '@/types/database.types';
import { formatCurrency } from '@/utils/format';

interface PartnerDetailProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner | null;
  transactions: Transaction[];
  isLoadingTransactions: boolean;
}

export const PartnerDetail: FC<PartnerDetailProps> = ({
  isOpen,
  onClose,
  partner,
  transactions,
  isLoadingTransactions
}) => {
  if (!partner) return null;

  const totalDebt = transactions.reduce((acc, transaction) => {
    if (transaction.paymentStatus === 'PAID') return acc;
    const amount = transaction.price * transaction.quantity;
    return transaction.type === 'IN' ? acc + amount : acc - amount;
  }, 0);

  const isOverDebtLimit = partner.currentDebt > partner.debtLimit;

  const columns = [
    {
      header: 'Ngày',
      accessorKey: 'createdAt',
      cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString('vi-VN')
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
      cell: ({ row }: { row: { original: Transaction } }) => formatCurrency(row.original.price * row.original.quantity)
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết đối tác"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Tên đối tác</p>
            <p className="font-medium">{partner.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Loại</p>
            <p className="font-medium">
              {partner.type === 'SUPPLIER' ? 'Nhà cung cấp' : 'Khách hàng'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Số điện thoại</p>
            <p className="font-medium">{partner.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Địa chỉ</p>
            <p className="font-medium">{partner.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Hạn mức công nợ</p>
            <p className="font-medium">{formatCurrency(partner.debtLimit)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Công nợ hiện tại</p>
            <p className={`${isOverDebtLimit ? 'text-red-500' : 'text-green-500'}`}>
              {formatCurrency(partner.currentDebt)}
              {isOverDebtLimit && (
                <span className="ml-2 text-sm text-red-500">
                  (Vượt hạn mức {formatCurrency(partner.currentDebt - partner.debtLimit)})
                </span>
              )}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Lịch sử giao dịch</h3>
          <Table
            data={transactions}
            columns={columns}
            isLoading={isLoadingTransactions}
          />
        </div>
      </div>
    </Modal>
  );
}; 