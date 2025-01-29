import { FC, useMemo } from 'react';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Expense, ExpenseType } from '@/types/database.types';
import { formatCurrency, formatDate } from '@/utils/format';

interface ExpenseReportProps {
  data: Expense[];
  startDate?: Date;
  endDate?: Date;
}

const expenseTypeLabels: Record<ExpenseType, string> = {
  LABOR: 'Nhân công',
  ELECTRICITY: 'Điện',
  MAINTENANCE: 'Bảo trì',
  OTHER: 'Khác'
};

export const ExpenseReport: FC<ExpenseReportProps> = ({
  data,
  startDate,
  endDate
}) => {
  const summaryByType = useMemo(() => {
    return data.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseType, number>);
  }, [data]);

  const totalAmount = Object.values(summaryByType).reduce((sum, amount) => sum + amount, 0);

  const handleExport = () => {
    // Tạo nội dung CSV
    const headers = ['Ngày', 'Loại chi phí', 'Số tiền', 'Mô tả', 'Trạng thái'];
    const rows = data.map(expense => [
      formatDate(expense.date),
      expenseTypeLabels[expense.type],
      expense.amount.toString(),
      expense.description,
      expense.status
    ]);

    // Thêm dòng tổng kết
    rows.push(['', '', '', '', '']);
    rows.push(['Tổng chi phí theo loại:', '', '', '', '']);
    Object.entries(summaryByType).forEach(([type, amount]) => {
      rows.push([
        '',
        expenseTypeLabels[type as ExpenseType],
        amount.toString(),
        '',
        ''
      ]);
    });
    rows.push(['', '', '', '', '']);
    rows.push(['Tổng cộng:', '', totalAmount.toString(), '', '']);

    // Chuyển đổi sang CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Tạo file và tải xuống
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bao-cao-chi-phi${startDate ? `-tu-${formatDate(startDate)}` : ''}${endDate ? `-den-${formatDate(endDate)}` : ''}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Báo cáo chi phí</h3>
        <Button onClick={handleExport}>
          <Icon name="DocumentArrowDownIcon" className="w-5 h-5 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Tổng chi phí theo loại:</h4>
          <div className="space-y-2">
            {Object.entries(summaryByType).map(([type, amount]) => (
              <div key={type} className="flex justify-between">
                <span>{expenseTypeLabels[type as ExpenseType]}</span>
                <span>{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-medium">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 