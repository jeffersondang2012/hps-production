import { Table } from '@/components/molecules/Table';
import { formatCurrency } from '@/utils/format';
import { Chart } from '@/components/molecules/Chart';

interface InventoryReportProps {
  data: any;
}

export const InventoryReport = ({ data }: InventoryReportProps) => {
  const columns = [
    {
      header: 'Sản phẩm',
      accessor: 'productName',
    },
    {
      header: 'Loại',
      accessor: 'type',
      cell: (value: string) => ({
        'RAW': 'Nguyên liệu',
        'MANUFACTURED': 'Thành phẩm',
        'TRADING': 'Hàng kinh doanh'
      }[value]),
    },
    {
      header: 'Tồn đầu kỳ',
      accessor: 'openingStock',
      cell: (value: number, row: any) => `${value} ${row.unit}`,
    },
    {
      header: 'Nhập trong kỳ',
      accessor: 'import',
      cell: (value: number, row: any) => `${value} ${row.unit}`,
    },
    {
      header: 'Xuất trong kỳ',
      accessor: 'export',
      cell: (value: number, row: any) => `${value} ${row.unit}`,
    },
    {
      header: 'Tồn cuối kỳ',
      accessor: 'closingStock',
      cell: (value: number, row: any) => `${value} ${row.unit}`,
    },
    {
      header: 'Giá trị tồn',
      accessor: 'value',
      cell: (value: number) => formatCurrency(value),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-500">Tổng giá trị tồn kho</h4>
          <p className="text-xl font-bold mt-1">{formatCurrency(data?.totalValue)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-500">Số lượng mặt hàng</h4>
          <p className="text-xl font-bold mt-1">{data?.totalProducts}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm text-gray-500">Vòng quay tồn kho</h4>
          <p className="text-xl font-bold mt-1">{data?.turnoverRate?.toFixed(1)} vòng/tháng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-medium mb-4">Giá trị tồn kho theo loại</h4>
          <Chart
            type="bar"
            data={{
              labels: ['Nguyên liệu', 'Thành phẩm', 'Hàng kinh doanh'],
              datasets: [{
                data: [
                  data?.rawMaterialValue || 0,
                  data?.manufacturedValue || 0,
                  data?.tradingValue || 0
                ],
                backgroundColor: ['#60A5FA', '#34D399', '#F87171']
              }]
            }}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-medium mb-4">Xu hướng tồn kho</h4>
          <Chart
            type="line"
            data={data?.trendData}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={data?.details || []}
      />
    </div>
  );
}; 