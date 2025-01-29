import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon, IconName } from '../atoms/Icon';
import { usePermissions } from '@/hooks/auth/usePermissions';

interface MenuItem {
  name: string;
  path: string;
  icon: IconName;
  permission?: string;
}

const menuItems: MenuItem[] = [
  { name: 'Sản xuất', path: '/production', icon: 'HomeIcon', permission: 'production.view' },
  { name: 'Giao dịch', path: '/transactions', icon: 'ArrowsRightLeftIcon', permission: 'transaction.view' },
  { name: 'Chi phí', path: '/expenses', icon: 'BanknotesIcon', permission: 'expense.view' },
  { name: 'Đối tác', path: '/partners', icon: 'UsersIcon', permission: 'partner.view' },
  { name: 'Sản phẩm', path: '/products', icon: 'CubeIcon', permission: 'product.view' },
  { name: 'Công nợ', path: '/debts', icon: 'ReceiptPercentIcon', permission: 'debt.view' },
  { name: 'Báo cáo', path: '/reports', icon: 'ChartBarIcon', permission: 'report.view' },
];

export interface SidebarProps {
  className?: string;
}

export const Sidebar: FC<SidebarProps> = ({ className = '' }) => {
  const { hasPermission } = usePermissions();

  return (
    <aside className={`py-6 ${className}`}>
      {/* Logo */}
      <div className="px-6 mb-8">
        <img src="/logo.png" alt="Logo" className="h-8" />
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-3">
        {menuItems.map((item) => {
          if (item.permission && !hasPermission(item.permission)) return null;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-3 py-2 text-sm font-medium rounded-md
                ${isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon 
                name={item.icon} 
                className={`mr-3 h-5 w-5 flex-shrink-0`}
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}; 