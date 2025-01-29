import { FC, useMemo } from 'react';
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Expense, ExpenseType } from '@/types/database.types';
import { formatCurrency } from '@/utils/format';

interface ExpenseChartsProps {
  data: Expense[];
}

interface PieChartData {
  type: string;
  amount: number;
  color: string;
}

interface LineChartData {
  date: string;
  LABOR: number;
  ELECTRICITY: number;
  MAINTENANCE: number;
  OTHER: number;
}

const COLORS = {
  LABOR: '#0088FE',
  ELECTRICITY: '#00C49F',
  MAINTENANCE: '#FFBB28',
  OTHER: '#FF8042'
};

const expenseTypeLabels: Record<ExpenseType, string> = {
  LABOR: 'Nhân công',
  ELECTRICITY: 'Điện',
  MAINTENANCE: 'Bảo trì',
  OTHER: 'Khác'
};

export const ExpenseCharts: FC<ExpenseChartsProps> = ({ data }) => {
  const pieData = useMemo(() => {
    const groupedByType = data.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseType, number>);

    return Object.entries(groupedByType).map(([type, amount]) => ({
      type: expenseTypeLabels[type as ExpenseType],
      amount,
      color: COLORS[type as ExpenseType]
    }));
  }, [data]);

  const lineData = useMemo(() => {
    const groupedByDate = data.reduce((acc, expense) => {
      const date = new Date(expense.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          LABOR: 0,
          ELECTRICITY: 0,
          MAINTENANCE: 0,
          OTHER: 0
        };
      }
      acc[date][expense.type] += expense.amount;
      return acc;
    }, {} as Record<string, LineChartData>);

    return Object.values(groupedByDate).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [data]);

  const totalAmount = data.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Phân bố chi phí theo loại</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="amount"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ type, amount }: PieChartData) => 
                  `${type}: ${((amount / totalAmount) * 100).toFixed(1)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Xu hướng chi phí theo thời gian</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value: number) => formatCurrency(value)} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              {Object.entries(expenseTypeLabels).map(([type, label]) => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  name={label}
                  stroke={COLORS[type as ExpenseType]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 