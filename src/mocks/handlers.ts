import { http, HttpResponse } from 'msw';
import { User, ProductionLine, Transaction, Expense } from '@/types/database.types';
import { Timestamp } from 'firebase/firestore';

// Mock data
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  displayName: 'Test User',
  role: 'ADMIN',
  permissions: ['*'],
  isActive: true,
  lastLogin: null
};

const mockProductionLines: ProductionLine[] = [
  {
    id: '1',
    name: 'Dây chuyền 1',
    status: 'active',
    capacity: 100,
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date())
  }
];

// API handlers
export const handlers = [
  // Auth handlers
  http.post('/api/auth/login', () => {
    return HttpResponse.json({ user: mockUser });
  }),

  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // Production line handlers
  http.get('/api/production-lines', () => {
    return HttpResponse.json(mockProductionLines);
  }),

  http.post('/api/production-lines', async ({ request }) => {
    const data = await request.json() as Omit<ProductionLine, 'id' | 'createdAt' | 'updatedAt'>;
    const response: ProductionLine = {
      id: '2',
      ...data,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date())
    };
    return HttpResponse.json(response, { status: 201 });
  }),

  // Transaction handlers
  http.get('/api/transactions', () => {
    return HttpResponse.json([]);
  }),

  http.post('/api/transactions', async ({ request }) => {
    const data = await request.json() as Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
    const response: Transaction = {
      id: '1',
      ...data,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date())
    };
    return HttpResponse.json(response, { status: 201 });
  }),

  // Expense handlers
  http.get('/api/expenses', () => {
    return HttpResponse.json([]);
  }),

  http.post('/api/expenses', async ({ request }) => {
    const data = await request.json() as Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;
    const response: Expense = {
      id: '1',
      ...data,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date())
    };
    return HttpResponse.json(response, { status: 201 });
  })
]; 