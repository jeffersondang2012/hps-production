import { FC, useState } from 'react';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { RevenueChart } from './components/RevenueChart';
import { ExpenseChart } from './components/ExpenseChart';
import { useReports } from '@/hooks';
import { formatCurrency } from '@/utils/format';
import { Tab } from '@headlessui/react';
import { clsx } from 'clsx';
import { ProductionReport } from './components/ProductionReport';
import { FinancialReport } from './components/FinancialReport';
import { ExpenseReport } from './components/ExpenseReport';

const tabs = [
  { key: 'production', label: 'Sản xuất' },
  { key: 'financial', label: 'Tài chính' },
  { key: 'expense', label: 'Chi phí' }
] as const;

export const ReportsPage: FC = () => {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date()
  ]);
  const [productionLine, setProductionLine] = useState<string>('all');
  const { reports, isLoading, error } = useReports({
    dateRange,
    productionLineId: productionLine === 'all' ? undefined : productionLine
  });

  if (isLoading) {
    return <div className="p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Đã xảy ra lỗi: {error.message}</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Báo cáo</h1>
        <div className="flex items-center space-x-4">
          <Select
            value={productionLine}
            onChange={(e) => setProductionLine(e.target.value)}
            className="w-48"
          >
            <option value="all">Tất cả dây chuyền</option>
            {/* TODO: Add production line options */}
          </Select>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </div>

      <Card>
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {tabs.map((tab) => (
              <Tab
                key={tab.key}
                className={({ selected }) =>
                  clsx(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow text-blue-700'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                {tab.label}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <ProductionReport dateRange={dateRange} />
            </Tab.Panel>
            <Tab.Panel>
              <FinancialReport dateRange={dateRange} />
            </Tab.Panel>
            <Tab.Panel>
              <ExpenseReport dateRange={dateRange} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Card>
    </div>
  );
}; 