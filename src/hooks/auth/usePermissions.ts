import { useAuth } from '@/contexts/AuthContext';
import { User, UserRole } from '@/types/auth.types';

interface UsePermissionsReturn {
  hasRole: (roles: UserRole[]) => boolean;
  hasProductionLineAccess: (productionLineId: string) => boolean;
  hasPermission: (permission: string) => boolean;
  canManageProduction: boolean;
  canManageExpenses: boolean;
  canManagePartners: boolean;
  canManageProducts: boolean;
  canManagePayments: boolean;
  canManageTransactions: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();

  const hasRole = (roles: UserRole[]): boolean => {
    return user?.role ? roles.includes(user.role) : false;
  };

  const hasProductionLineAccess = (productionLineId: string): boolean => {
    if (!user?.productionLineAccess) return false;
    if (hasRole(['ADMIN'])) return true;
    return user.productionLineAccess.includes(productionLineId);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.permissions) return false;
    if (hasRole(['ADMIN'])) return true;
    return user.permissions.includes(permission);
  };

  const isAdmin = hasRole(['ADMIN']);
  const isManager = hasRole(['ADMIN', 'SHAREHOLDER']);
  const isStaff = hasRole(['ADMIN', 'SHAREHOLDER', 'STAFF']);

  return {
    hasRole,
    hasProductionLineAccess,
    hasPermission,
    canManageProduction: isManager,
    canManageExpenses: isManager,
    canManagePartners: isManager,
    canManageProducts: isManager,
    canManagePayments: isManager,
    canManageTransactions: isStaff,
    canViewReports: isStaff,
    canManageUsers: isAdmin,
    canManageSettings: isAdmin
  };
}; 