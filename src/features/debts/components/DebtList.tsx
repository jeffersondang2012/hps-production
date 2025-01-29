import { FC } from 'react';
import { Table } from '@/components/molecules/Table';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { DebtSummary } from '@/services/core/debt.service';
import { formatCurrency } from '@/utils/format';
import { formatDate } from '@/utils/format';

interface DebtListProps {
  data: DebtSummary[];
  onViewDetail: (debt: DebtSummary) => void;
}

export const DebtList: FC<DebtListProps> = ({ data, onViewDetail }) => {
  const columns = [
    {
      header: 'Tên đối tác',
      accessorKey: 'partnerName'
    },
    {
      header: 'Loại',
      accessorKey: 'partnerType',
      cell: ({ value }: { value: string }) => ({
        'SUPPLIER': 'Nhà cung cấp',
        'CUSTOMER': 'Khách hàng'
      }[value])
    },
    {
      header: 'Công nợ',
      accessorKey: 'debtAmount',
      cell: ({ row }: { row: { original: DebtSummary } }) => {
        const { debtAmount } = row.original;
        return (
          <span className={debtAmount > 0 ? 'text-red-500' : 'text-green-500'}>
            {formatCurrency(Math.abs(debtAmount))}
            {debtAmount !== 0 && (debtAmount > 0 ? ' (Nợ)' : ' (Có)')}
          </span>
        );
      }
    },
    {
      header: 'Hạn mức',
      accessorKey: 'debtLimit',
      cell: ({ value }: { value: number }) => formatCurrency(value)
    },
    {
      header: 'Trạng thái',
      accessorKey: 'isOverLimit',
      cell: ({ value, row }: { value: boolean; row: { original: DebtSummary } }) => {
        const { debtAmount, debtLimit } = row.original;
        if (debtAmount === 0) return 'Không có công nợ';
        return value ? (
          <span className="text-red-500">Vượt hạn mức</span>
        ) : (
          <span className="text-green-500">Trong hạn mức</span>
        );
      }
    },
    {
      header: 'Giao dịch gần nhất',
      accessorKey: 'lastTransactionDate',
      cell: ({ value }: { value: string }) => formatDate(value)
    },
    {
      header: 'Thao tác',
      id: 'actions',
      cell: ({ row }: { row: { original: DebtSummary } }) => (
        <Button
          variant="ghost"
          onClick={() => onViewDetail(row.original)}
          title="Xem chi tiết"
        >
          <Icon name="EyeIcon" className="w-4 h-4" />
        </Button>
      )
    }
  ];

  return (
    <Table
      data={data}
      columns={columns}
    />
  );
}; 