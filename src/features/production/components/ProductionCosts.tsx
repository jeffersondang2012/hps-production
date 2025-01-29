import { FC } from 'react';
import { Card } from '@/components/atoms/Card';
import { Table } from '@/components/molecules/Table';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { Chart } from '@/components/molecules/Chart';
import { formatCurrency, formatDate } from '@/utils/format';
import { ProductionLine } from '@/types/database.types';

interface ProductionCostsProps {
  productionLine: ProductionLine;
}

export const ProductionCosts: FC<ProductionCostsProps> = ({ productionLine }) => {
  const columns = [
    {
      header: 'Ngày',
      accessor: 'date',
      cell: (value: Date) => formatDate(value)
    },
    {
      header: 'Loại chi phí',
      accessor: 'type',
      cell: (value: string) => ({
        'LABOR': 'Nhân công',
        'ELECTRICITY': 'Điện',
        'MAINTENANCE': 'Bảo trì',
        'OTHER': 'Khác'
      }[value])
    },
    {
      header: 'Chi phí',
      accessor: 'amount',
      cell: (value: number) => formatCurrency(value)
    },
    {
      header: 'Chi phí/tấn',
      accessor: 'unitCost',
      cell: (value: number) => formatCurrency(value)
    }
  ];

  const chartData = {
    labels: ['Nhân công', 'Điện', 'Bảo trì', 'Khác'],
    datasets: [{
      data: [35, 25, 20, 20],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#6B7280'
      ]
    }]
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold">Phân tích Chi phí</h3>
          <DateRangePicker
            value={[new Date(), new Date()]}
            onChange={() => {}}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-medium mb-4">Cơ cấu chi phí</h4>
            <div className="h-64">
              <Chart
                type="pie"
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 content-start">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Chi phí hôm nay</p>
              <p className="text-xl font-semibold mt-1">{formatCurrency(12500000)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Chi phí/tấn</p>
              <p className="text-xl font-semibold mt-1">{formatCurrency(125000)}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">Chi phí tuần</p>
              <p className="text-xl font-semibold mt-1">{formatCurrency(85000000)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">Chi phí tháng</p>
              <p className="text-xl font-semibold mt-1">{formatCurrency(324500000)}</p>
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          data={[
            {
              date: new Date(),
              type: 'LABOR',
              amount: 5000000,
              unitCost: 50000
            },
            // ... more data
          ]}
        />
      </div>
    </Card>
  );
}; 