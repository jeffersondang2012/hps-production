import { FC, useMemo } from 'react';
import { Card } from '@/components/atoms/Card';
import { Chart } from '@/components/molecules/Chart';
import { Table } from '@/components/molecules/Table';
import { formatCurrency, formatPercent } from '@/utils/format';
import { useProductionLines } from '@/hooks/resources/useProductionLines';
import { useReport } from '@/hooks/resources/useReports';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';

interface FinancialReportProps {
  dateRange: [Date, Date];
}

export const FinancialReport: FC<FinancialReportProps> = ({ dateRange }) => {
  const { productionLines } = useProductionLines();
  const { generateReport, exportReport, isLoading } = useReport(productionLines[0]?.id);

  const handleExport = async () => {
    try {
      await exportReport(dateRange);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const summaryData = useMemo(() => [
    {
      label: 'Doanh thu',
      value: formatCurrency(1234500000),
      change: 12.5,
      trend: 'up' as const,
      icon: 'BanknotesIcon'
    },
    {
      label: 'Chi phí',
      value: formatCurrency(876500000),
      change: 8.2,
      trend: 'up' as const,
      icon: 'ReceiptPercentIcon'
    },
    {
      label: 'Lợi nhuận',
      value: formatCurrency(358000000),
      change: 15.3,
      trend: 'up' as const,
      icon: 'ChartBarIcon'
    }
  ], []);

  const chartData = useMemo(() => ({
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [120, 135, 142, 138, 145, 132, 128].map(x => x * 1000000),
        borderColor: '#60A5FA',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        fill: true
      },
      {
        label: 'Chi phí',
        data: [80, 95, 88, 92, 87, 85, 82].map(x => x * 1000000),
        borderColor: '#F87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        fill: true
      }
    ]
  }), []);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <h3 className="font-semibold mb-4">Biểu đồ doanh thu và chi phí</h3>
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
                header: 'Doanh thu',
                accessor: 'revenue',
                cell: (value: number) => formatCurrency(value)
              },
              {
                header: 'Chi phí',
                accessor: 'cost',
                cell: (value: number) => formatCurrency(value)
              },
              {
                header: 'Lợi nhuận',
                accessor: 'profit',
                cell: (value: number) => formatCurrency(value)
              },
              {
                header: 'Tỷ suất LN',
                accessor: 'profitMargin',
                cell: (value: number) => formatPercent(value * 100)
              }
            ]}
            data={productionLines.map(line => ({
              name: line.name,
              revenue: 350000000,
              cost: 250000000,
              profit: 100000000,
              profitMargin: 0.286
            }))}
          />
        </div>
      </Card>
    </div>
  );
}; 