import { FC, useMemo } from 'react';
import { Card } from '@/components/atoms/Card';
import { Chart } from '@/components/molecules/Chart';
import { Table } from '@/components/molecules/Table';
import { formatQuantity, formatPercent } from '@/utils/format';
import { useProductionLines } from '@/hooks/resources/useProductionLines';
import { useReport } from '@/hooks/resources/useReports';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';

interface ProductionReportProps {
  dateRange: [Date, Date];
}

export const ProductionReport: FC<ProductionReportProps> = ({ dateRange }) => {
  const { productionLines } = useProductionLines();
  const { generateReport, exportReport, isLoading } = useReport(productionLines[0]?.id);

  const summaryData = useMemo(() => [
    {
      label: 'Tổng sản lượng',
      value: '1,234 tấn',
      change: 8.3,
      trend: 'up' as const,
      icon: 'CubeIcon'
    },
    {
      label: 'Hiệu suất TB',
      value: '92%',
      change: -2.1,
      trend: 'down' as const,
      icon: 'ChartBarIcon'
    }
  ], []);

  const chartData = useMemo(() => ({
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        label: 'Sản lượng thực tế',
        data: [120, 135, 142, 138, 145, 132, 128],
        borderColor: '#60A5FA',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        fill: true
      },
      {
        label: 'Kế hoạch',
        data: [130, 130, 130, 130, 130, 130, 130],
        borderColor: '#F87171',
        borderDash: [5, 5],
        fill: false
      }
    ]
  }), []);

  const handleExport = async () => {
    try {
      await exportReport(dateRange);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          variant="outline"
          onClick={handleExport}
          disabled={isLoading}
        >
          <Icon name="ArrowDownTrayIcon" className="w-5 h-5 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {summaryData.map((item, index) => (
          <Card key={index}>
            <div className="p-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{item.label}</p>
                <Icon 
                  name={item.icon as any} 
                  className="w-5 h-5 text-gray-400" 
                />
              </div>
              <p className="text-2xl font-semibold mt-2">{item.value}</p>
              <div className={`flex items-center mt-2 text-sm ${
                item.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <Icon 
                  name={item.trend === 'up' ? 'ArrowUpIcon' : 'ArrowDownIcon'}
                  className="w-4 h-4 mr-1"
                />
                <span>{Math.abs(item.change)}% so với tuần trước</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="p-6">
          <h3 className="font-semibold mb-4">Biểu đồ sản lượng</h3>
          <div className="h-80">
            <Chart 
              type="line"
              data={chartData}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="font-semibold mb-4">Chi tiết theo dây chuyền</h3>
          <Table
            columns={[
              {
                header: 'Dây chuyền',
                accessor: 'name'
              },
              {
                header: 'Sản lượng',
                accessor: 'output',
                cell: (value: number) => formatQuantity(value, 'tấn')
              },
              {
                header: 'Hiệu suất',
                accessor: 'efficiency',
                cell: (value: number) => formatPercent(value)
              },
              {
                header: 'Thời gian dừng',
                accessor: 'downtime',
                cell: (value: number) => `${value} giờ`
              }
            ]}
            data={productionLines.map(line => ({
              name: line.name,
              output: 123,
              efficiency: 0.92,
              downtime: 4
            }))}
          />
        </div>
      </Card>
    </div>
  );
};