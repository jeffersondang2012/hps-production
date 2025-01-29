import { BaseService } from '../base/base.service';
import { Expense } from '@/types/database.types';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export class ExpenseService extends BaseService<Expense> {
  constructor() {
    super('expenses');
  }

  async getByProductionLine(productionLineId: string, startDate?: Date, endDate?: Date): Promise<Expense[]> {
    const where: [string, any, any][] = [['productionLineId', '==', productionLineId]];
    
    if (startDate) {
      where.push(['date', '>=', Timestamp.fromDate(startDate)]);
    }
    
    if (endDate) {
      where.push(['date', '<=', Timestamp.fromDate(endDate)]);
    }

    return this.getAll({
      where,
      orderBy: [['date', 'desc']]
    });
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    return this.getAll({
      where: [
        ['date', '>=', Timestamp.fromDate(startDate)],
        ['date', '<=', Timestamp.fromDate(endDate)]
      ],
      orderBy: [['date', 'desc']]
    });
  }

  async getByType(type: string): Promise<Expense[]> {
    return this.getAll({
      where: [['type', '==', type]],
      orderBy: [['date', 'desc']]
    });
  }
}

export const expenseService = new ExpenseService(); 