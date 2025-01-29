import { Table } from '@/components/molecules/Table';
import { formatCurrency, formatDate } from '@/utils/format';

interface RevenueReportProps {
  data: any;
}

export const RevenueReport = ({ data }: RevenueReportProps) => {
  const columns = [
    {
      header: 'Ngày',
      accessor: 'date',
      cell: (value: Date) => formatDate(value),
    },
    {
      header: 'Dây chuyền',
      accessor: 'productionLineName',
    },
    {
      header: 'Sản phẩm',
      accessor: 'productName',
    },
    {
      header: 'Số lượng',
      accessor: 'quantity',
      cell: (value: number, row: any) => `${value} ${row.unit}`,
    },
    {
      header: 'Đơn giá TB',
      accessor: 'averagePrice',
      cell: (value: number) => formatCurrency(value),
    },
    {
      header: 'Doanh thu',
      accessor: 'revenue',
      cell: (value: number) => formatCurrency(value),
    },
    {
      header: 'Chi phí',
      accessor: 'cost',
      cell: (value: number) => formatCurrency(value),
    },
    {
      header: 'Lợi nhuận',
      accessor: 'profit',
      cell: (value: number) => (
        <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
          {formatCurrency(value)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-500">Tổng doanh thu</h4>
          <p className="text-xl font-bold mt-1">{formatCurrency(data?.totalRevenue)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-500">Tổng chi phí</h4>
          <p className="text-xl font-bold mt-1">{formatCurrency(data?.totalCost)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-500">Lợi nhuận</h4>
          <p className="text-xl font-bold mt-1 text-green-600">
            {formatCurrency(data?.totalProfit)}
          </p>
        </div>
      </div>

      <Table
        columns={columns}
        data={data?.details || []}
      />
    </div>
  );
}; 