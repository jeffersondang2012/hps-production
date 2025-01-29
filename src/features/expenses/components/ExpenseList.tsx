import { FC } from 'react';
import { Table } from '@/components/molecules/Table';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Expense, ExpenseType, ExpenseStatus } from '@/types/database.types';
import { formatCurrency, formatDate } from '@/utils/format';

interface ExpenseListProps {
  data: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  canApprove?: boolean;
}

const expenseTypeLabels: Record<ExpenseType, string> = {
  LABOR: 'Nhân công',
  ELECTRICITY: 'Điện',
  MAINTENANCE: 'Bảo trì',
  OTHER: 'Khác'
};

export const ExpenseList: FC<ExpenseListProps> = ({
  data,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  canApprove = false
}) => {
  return (
    <Table
      columns={[
        {
          header: 'Ngày',
          accessor: 'date',
          cell: (value: Date) => formatDate(value)
        },
        {
          header: 'Loại chi phí',
          accessor: 'type',
          cell: (value: ExpenseType) => expenseTypeLabels[value]
        },
        {
          header: 'Số tiền',
          accessor: 'amount',
          cell: (value: number) => formatCurrency(value)
        },
        {
          header: 'Trạng thái',
          accessor: 'status',
          cell: (value: ExpenseStatus) => {
            const statusStyles: Record<ExpenseStatus, string> = {
              PENDING: 'bg-yellow-100 text-yellow-800',
              APPROVED: 'bg-green-100 text-green-800',
              REJECTED: 'bg-red-100 text-red-800'
            };

            const statusLabels: Record<ExpenseStatus, string> = {
              PENDING: 'Chờ duyệt',
              APPROVED: 'Đã duyệt',
              REJECTED: 'Từ chối'
            };

            return (
              <span className={`px-2 py-1 rounded-full text-sm ${statusStyles[value]}`}>
                {statusLabels[value]}
              </span>
            );
          }
        },
        {
          header: 'Mô tả',
          accessor: 'description'
        },
        {
          header: 'Thao tác',
          accessor: 'id',
          cell: (value: string, row: Expense) => (
            <div className="flex space-x-2">
              {canApprove && row.status === 'PENDING' && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => onApprove(row.id)}
                    title="Duyệt"
                  >
                    <Icon name="CheckIcon" className="w-4 h-4 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onReject(row.id)}
                    title="Từ chối"
                  >
                    <Icon name="XMarkIcon" className="w-4 h-4 text-red-500" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                onClick={() => onEdit(row)}
                title="Chỉnh sửa"
              >
                <Icon name="PencilIcon" className="w-4 h-4 text-blue-500" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => onDelete(row.id)}
                title="Xóa"
              >
                <Icon name="TrashIcon" className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          )
        }
      ]}
      data={data}
    />
  );
}; 