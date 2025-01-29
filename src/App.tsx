import { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { Layout } from '@/components/layout/Layout';
import { ProductionPage } from '@/features/production/ProductionPage';
import { TransactionsPage } from '@/features/transactions/TransactionsPage';
import { ExpensesPage } from '@/features/expenses/ExpensesPage';
import { PartnersPage } from '@/features/partners/PartnersPage';
import { ReportsPage } from '@/features/reports/ReportsPage';
import { UnauthorizedPage } from '@/features/auth/UnauthorizedPage';
import { RequireRole } from '@/components/auth/RequireRole';
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage';
import { UserRole } from '@/types/auth.types';
import { NotificationList } from '@/components/molecules/NotificationList';

export const App: FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationList />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/production" replace />} />
            <Route path="production" element={
              <RequireRole allowedRoles={['ADMIN', 'SHAREHOLDER'] as UserRole[]}>
                <ProductionPage />
              </RequireRole>
            } />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="expenses" element={
              <RequireRole allowedRoles={['ADMIN', 'SHAREHOLDER'] as UserRole[]}>
                <ExpensesPage />
              </RequireRole>
            } />
            <Route path="partners" element={<PartnersPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}; 