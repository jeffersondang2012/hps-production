import { UserRole } from '@/types/database.types';

// Định nghĩa các permission
export const PERMISSIONS = {
  // Quản lý dây chuyền sản xuất
  PRODUCTION_VIEW: 'production.view',
  PRODUCTION_MANAGE: 'production.manage',
  
  // Quản lý chi phí
  EXPENSE_VIEW: 'expense.view',
  EXPENSE_MANAGE: 'expense.manage',
  EXPENSE_APPROVE: 'expense.approve',
  
  // Quản lý giao dịch
  TRANSACTION_VIEW: 'transaction.view',
  TRANSACTION_MANAGE: 'transaction.manage',
  
  // Quản lý sản phẩm
  PRODUCT_VIEW: 'product.view',
  PRODUCT_MANAGE: 'product.manage',
  
  // Quản lý đối tác
  PARTNER_VIEW: 'partner.view',
  PARTNER_MANAGE: 'partner.manage',
  
  // Quản lý công nợ
  DEBT_VIEW: 'debt.view',
  DEBT_MANAGE: 'debt.manage',
  
  // Báo cáo
  REPORT_VIEW: 'report.view',
  REPORT_MANAGE: 'report.manage',
  
  // Quản lý người dùng
  USER_VIEW: 'user.view',
  USER_MANAGE: 'user.manage',
  
  // Audit
  AUDIT_VIEW: 'audit.view',
  AUDIT_MANAGE: 'audit.manage'
} as const;

// Định nghĩa permissions cho từng role
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: Object.values(PERMISSIONS),
  
  SHAREHOLDER: [
    PERMISSIONS.PRODUCTION_VIEW,
    PERMISSIONS.PRODUCTION_MANAGE,
    PERMISSIONS.EXPENSE_VIEW,
    PERMISSIONS.EXPENSE_MANAGE,
    PERMISSIONS.TRANSACTION_VIEW,
    PERMISSIONS.TRANSACTION_MANAGE,
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.PARTNER_VIEW,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.AUDIT_VIEW
  ],
  
  STAFF: [
    PERMISSIONS.PRODUCTION_VIEW,
    PERMISSIONS.EXPENSE_VIEW,
    PERMISSIONS.TRANSACTION_VIEW,
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.PARTNER_VIEW,
    PERMISSIONS.REPORT_VIEW
  ]
}; 