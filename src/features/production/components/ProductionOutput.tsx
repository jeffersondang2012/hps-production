import { FC } from 'react';
import { Card } from '@/components/atoms/Card';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { Chart } from '@/components/molecules/Chart';
import { Table } from '@/components/molecules/Table';
import { formatDate, formatQuantity } from '@/utils/format';
import { ProductionLine } from '@/types/database.types';

interface ProductionOutputProps {
  productionLine: ProductionLine;
}

export const ProductionOutput: FC<ProductionOutputProps> = ({ productionLine }) => {
  const columns = [
    {
      header: 'Ngày',
      accessor: 'date',
      cell: (value: Date) => formatDate(value)
    },
    {
      header: 'Sản lượng thực tế',
      accessor: 'actualOutput',
      cell: (value: number) => formatQuantity(value, 'tấn')
    },
    {
      header: 'Công suất thiết kế',
      accessor: 'plannedOutput',
      cell: (value: number) => formatQuantity(value, 'tấn')
    },
    {
      header: 'Hiệu suất',
      accessor: 'efficiency',
      cell: (value: number) => (
        <span className={`${value >= 90 ? 'text-green-600' : 'text-red-600'}`}>
          {value}%
        </span>
      )
    }
  ];

  const chartData = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        label: 'Sản lượng thực tế',
        data: [120, 130, 125, 135, 128, 110, 100],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
      {
        label: 'Công suất thiết kế',
        data: Array(7).fill(productionLine.dailyCapacity),
        borderColor: '#9CA3AF',
        borderDash: [5, 5],
      }
    ]
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold">Theo dõi sản lượng</h3>
          <DateRangePicker
            value={[new Date(), new Date()]}
            onChange={() => {}}
          />
        </div>

        <div className="h-80 mb-6">
          <Chart
            type="line"
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Sản lượng (tấn)'
                  }
                }
              }
            }}
          />
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Sản lượng hôm nay</p>
            <p className="text-xl font-semibold mt-1">125 tấn</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Hiệu suất</p>
            <p className="text-xl font-semibold mt-1">92%</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600">Sản lượng tuần</p>
            <p className="text-xl font-semibold mt-1">848 tấn</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600">Sản lượng tháng</p>
            <p className="text-xl font-semibold mt-1">3,245 tấn</p>
          </div>
        </div>

        <Table
          columns={columns}
          data={[
            {
              date: new Date(),
              actualOutput: 125,
              plannedOutput: 135,
              efficiency: 92
            },
            // ... more data
          ]}
        />
      </div>
    </Card>
  );
}; 