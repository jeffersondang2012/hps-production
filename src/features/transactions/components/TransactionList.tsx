import { FC } from 'react';
import { Table } from '@/components/molecules/Table';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Transaction } from '@/types/database.types';
import { formatCurrency, formatDate } from '@/utils/format';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
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

export const TransactionList: FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete
}) => {
  return (
    <Table
      data={transactions}
      columns={[
        {
          header: 'Ngày',
          accessor: 'createdAt',
          cell: (value) => formatDate(value.toDate())
        },
        {
          header: 'Loại',
          accessor: 'type',
          cell: (value) => value === 'IN' ? 'Nhập hàng' : 'Xuất hàng'
        },
        {
          header: 'Đối tác',
          accessor: 'partner',
          cell: (_, row) => row.partner?.name || ''
        },
        {
          header: 'Dây chuyền',
          accessor: 'productionLine',
          cell: (_, row) => row.productionLine?.name || ''
        },
        {
          header: 'Số xe',
          accessor: 'vehicleNumber'
        },
        {
          header: 'Sản phẩm',
          accessor: 'items',
          cell: (items) => (
            <div className="space-y-1">
              {items.map((item, index) => (
                <div key={index} className="text-sm">
                  {item.name} - {item.category === 'PRODUCTION' ? 'Sản xuất' : 'Thương mại'}
                </div>
              ))}
            </div>
          )
        },
        {
          header: 'Số lượng',
          accessor: 'items',
          cell: (items) => (
            <div className="space-y-1">
              {items.map((item, index) => (
                <div key={index} className="text-sm">
                  {item.quantity} {UNIT_MAPPING[item.type]}
                </div>
              ))}
            </div>
          )
        },
        {
          header: 'Đơn giá',
          accessor: 'items',
          cell: (items) => (
            <div className="space-y-1">
              {items.map((item, index) => (
                <div key={index} className="text-sm">
                  {formatCurrency(item.price)}
                </div>
              ))}
            </div>
          )
        },
        {
          header: 'Thành tiền',
          accessor: 'items',
          cell: (items) => (
            <div className="space-y-1">
              {items.map((item, index) => (
                <div key={index} className="text-sm">
                  {formatCurrency(item.total)}
                </div>
              ))}
            </div>
          )
        },
        {
          header: 'Trạng thái',
          accessor: 'paymentStatus',
          cell: (value) => {
            const styles = {
              PENDING: 'bg-yellow-100 text-yellow-800',
              PARTIAL: 'bg-blue-100 text-blue-800',
              PAID: 'bg-green-100 text-green-800'
            };
            const labels = {
              PENDING: 'Chưa thanh toán',
              PARTIAL: 'Thanh toán một phần',
              PAID: 'Đã thanh toán'
            };
            return (
              <span className={`px-2 py-1 rounded-full text-xs ${styles[value]}`}>
                {labels[value]}
              </span>
            );
          }
        },
        {
          header: 'Thao tác',
          accessor: 'id',
          cell: (_, row) => (
            <div className="flex space-x-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  onClick={() => onEdit(row)}
                  title="Chỉnh sửa"
                >
                  <Icon name="PencilIcon" className="w-4 h-4 text-blue-500" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  onClick={() => onDelete(row.id)}
                  title="Xóa"
                >
                  <Icon name="TrashIcon" className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          )
        }
      ]}
    />
  );
}; 