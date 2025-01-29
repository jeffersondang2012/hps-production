import { Timestamp } from 'firebase/firestore';

export type UserRole = 'ADMIN' | 'SHAREHOLDER' | 'STAFF';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  productionLineAccess?: string[]; // Dành cho SHAREHOLDER
  permissions: string[];
  isActive: boolean;
  lastLogin: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Permissions
  hasPermission: (permission: string) => boolean;
  hasAccess: (productionLineId: string) => boolean;
}

export interface UserClaims {
  role: UserRole;
  productionLineAccess?: string[];
}

// Audit log types
export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: AuditAction;
  target: string;
  details: Record<string, any>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  ipAddress?: string;
}

export type AuditAction = 
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'PERMISSION_UPDATE'
  | 'PASSWORD_RESET_REQUEST'
  | 'PRODUCTION_CREATE'
  | 'PRODUCTION_UPDATE'
  | 'PRODUCTION_DELETE'
  | 'TRANSACTION_CREATE'
  | 'TRANSACTION_UPDATE'
  | 'TRANSACTION_DELETE'
  | 'EXPENSE_CREATE'
  | 'EXPENSE_UPDATE'
  | 'EXPENSE_DELETE'
  | 'EXPENSE_APPROVE'
  | 'EXPENSE_REJECT'; 