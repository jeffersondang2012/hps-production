import { FC, useMemo } from 'react';
import { Card } from '@/components/atoms/Card';
import { Chart } from '@/components/molecules/Chart';
import { Table } from '@/components/molecules/Table';
import { formatCurrency, formatDate } from '@/utils/format';
import { useReport } from '@/hooks/resources/useReports';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { ExpenseType } from '@/types/database.types';
import { useProductionLines } from '@/hooks/resources/useProductionLines';

interface ExpenseReportProps {
  dateRange: [Date, Date];
}

export const ExpenseReport: FC<ExpenseReportProps> = ({ dateRange }) => {
  const { productionLines } = useProductionLines();
  const { generateReport, exportReport, isLoading } = useReport(productionLines[0]?.id);

  const handleExport = async () => {
    try {
      await exportReport(dateRange);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const expenseTypeLabels: Record<ExpenseType, string> = {
    LABOR: 'Nhân công',
    ELECTRICITY: 'Điện',
    MAINTENANCE: 'Bảo trì',
    OTHER: 'Khác'
  };

  const summaryData = useMemo(() => [
    {
      label: 'Tổng chi phí',
      value: formatCurrency(876500000),
      change: 8.2,
      trend: 'up' as const,
      icon: 'ReceiptPercentIcon'
    },
    {
      label: 'Chi phí nhân công',
      value: formatCurrency(456000000),
      change: 5.5,
      trend: 'up' as const,
      icon: 'UserGroupIcon'
    },
    {
      label: 'Chi phí điện',
      value: formatCurrency(234500000),
      change: -2.1,
      trend: 'down' as const,
      icon: 'BoltIcon'
    }
  ], []);

  const chartData = useMemo(() => ({
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        label: 'Nhân công',
        data: [45, 48, 42, 46, 43, 45, 44].map(x => x * 1000000),
        backgroundColor: '#60A5FA'
      },
      {
        label: 'Điện',
        data: [22, 25, 23, 24, 21, 20, 22].map(x => x * 1000000),
        backgroundColor: '#F59E0B'
      },
      {
        label: 'Bảo trì',
        data: [15, 12, 14, 13, 16, 15, 13].map(x => x * 1000000),
        backgroundColor: '#10B981'
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
          <h3 className="font-semibold mb-4">Biểu đồ chi phí theo loại</h3>
          <div className="h-80">
            <Chart 
              type="bar"
              data={chartData}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="font-semibold mb-4">Chi tiết chi phí</h3>
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
                header: 'Ghi chú',
                accessor: 'note'
              }
            ]}
            data={[
              {
                date: new Date(),
                type: 'LABOR',
                amount: 45000000,
                note: 'Lương tháng 3/2024'
              },
              {
                date: new Date(),
                type: 'ELECTRICITY',
                amount: 22000000,
                note: 'Tiền điện tháng 3/2024'
              }
            ]}
          />
        </div>
      </Card>
    </div>
  );
}; 