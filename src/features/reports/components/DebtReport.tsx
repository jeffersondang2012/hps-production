import { Table } from '@/components/molecules/Table';
import { formatCurrency, formatDate } from '@/utils/format';

interface DebtReportProps {
  data: any;
}

export const DebtReport = ({ data }: DebtReportProps) => {
  const columns = [
    {
      header: 'Đối tác',
      accessor: 'partnerName',
    },
    {
      header: 'Loại',
      accessor: 'type',
      cell: (value: string) => ({
        'SUPPLIER': 'Nhà cung cấp',
        'CUSTOMER': 'Khách hàng',
        'BOTH': 'Cả hai'
      }[value]),
    },
    {
      header: 'Dư nợ đầu kỳ',
      accessor: 'openingDebt',
      cell: (value: number) => (
        <span className={value >= 0 ? 'text-red-600' : 'text-green-600'}>
          {formatCurrency(Math.abs(value))}
        </span>
      ),
    },
    {
      header: 'Phát sinh tăng',
      accessor: 'increase',
      cell: (value: number) => formatCurrency(value),
    },
    {
      header: 'Phát sinh giảm',
      accessor: 'decrease',
      cell: (value: number) => formatCurrency(value),
    },
    {
      header: 'Dư nợ cuối kỳ',
      accessor: 'closingDebt',
      cell: (value: number) => (
        <span className={value >= 0 ? 'text-red-600' : 'text-green-600'}>
          {formatCurrency(Math.abs(value))}
        </span>
      ),
    },
    {
      header: 'Hạn mức',
      accessor: 'debtLimit',
      cell: (value: number) => formatCurrency(value),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-500">Tổng phải thu</h4>
          <p className="text-xl font-bold mt-1 text-red-600">
            {formatCurrency(data?.totalReceivable)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-500">Tổng phải trả</h4>
          <p className="text-xl font-bold mt-1 text-green-600">
            {formatCurrency(data?.totalPayable)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-500">Số đối tác nợ</h4>
          <p className="text-xl font-bold mt-1">{data?.totalDebtors}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-500">Quá hạn mức</h4>
          <p className="text-xl font-bold mt-1 text-red-600">{data?.overLimitCount}</p>
        </div>
      </div>

      <Table
        columns={columns}
        data={data?.details || []}
      />
    </div>
  );
}; 