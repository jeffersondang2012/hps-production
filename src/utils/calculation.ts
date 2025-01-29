import { Transaction, Expense } from '@/types/database.types';

// Tính tổng doanh thu
export const calculateTotalRevenue = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'EXPORT')
    .reduce((total, t) => total + (t.quantity * t.price), 0);
};

// Tính tổng chi phí
export const calculateTotalExpense = (expenses: Expense[]): number => {
  return expenses.reduce((total, e) => total + e.amount, 0);
};

// Tính lợi nhuận
export const calculateProfit = (revenue: number, expense: number): number => {
  return revenue - expense;
};

// Tính chi phí trên một đơn vị sản phẩm
export const calculateUnitCost = (totalCost: number, totalQuantity: number): number => {
  return totalQuantity > 0 ? totalCost / totalQuantity : 0;
};

// Tính vòng quay tồn kho
export const calculateInventoryTurnover = (
  costOfGoodsSold: number,
  averageInventory: number
): number => {
  return averageInventory > 0 ? costOfGoodsSold / averageInventory : 0;
};

// Tính tỷ suất lợi nhuận
export const calculateProfitMargin = (profit: number, revenue: number): number => {
  return revenue > 0 ? (profit / revenue) * 100 : 0;
}; 