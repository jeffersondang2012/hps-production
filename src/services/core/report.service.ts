import { BaseService } from '../base/base.service';
import { Transaction, Expense, Report } from '@/types/database.types';
import { transactionService } from './transaction.service';
import { expenseService } from './expense.service';
import { calculateTotalRevenue, calculateTotalExpense } from '@/utils/calculation';

interface ReportData {
  revenue: number;
  expense: number;
  profit: number;
  transactionCount: number;
  expenseByType: Record<Expense['type'], number>;
}

class ReportService extends BaseService<Report> {
  constructor() {
    super('reports');
  }

  // Tạo báo cáo theo dây chuyền và khoảng thời gian
  async generateReport(productionLineId: string, startDate: Date, endDate: Date): Promise<ReportData> {
    // Lấy dữ liệu giao dịch
    const transactions = await transactionService.getByProductionLine(
      productionLineId,
      startDate,
      endDate
    );

    // Lấy dữ liệu chi phí
    const expenses = await expenseService.getByProductionLine(
      productionLineId,
      startDate,
      endDate
    );

    // Tính toán các chỉ số
    const revenue = calculateTotalRevenue(transactions);
    const expense = calculateTotalExpense(expenses);

    // Phân loại chi phí theo type
    const expenseByType = expenses.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + curr.amount;
      return acc;
    }, {} as Record<Expense['type'], number>);

    return {
      revenue,
      expense,
      profit: revenue - expense,
      transactionCount: transactions.length,
      expenseByType
    };
  }

  // Xuất báo cáo ra file Excel
  async exportToExcel(reportData: ReportData) {
    // TODO: Implement export logic
    throw new Error('Not implemented');
  }
}

export const reportService = new ReportService(); 