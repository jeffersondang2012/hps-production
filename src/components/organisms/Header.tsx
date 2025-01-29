import { FC } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { useAuth } from '@/hooks/auth/useAuth';

export interface HeaderProps {
  className?: string;
}

export const Header: FC<HeaderProps> = ({ className = '' }) => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className={`px-6 flex items-center justify-between ${className}`}>
      {/* Left side */}
      <div className="flex items-center">
        <h1 className="text-3xl font-bold text-red-500 ">
          HPS VỮNG BƯỚC TIẾN VÀO KỶ NGUYÊN VƯƠN MÌNH CỦA DÂN TỘC
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" className="relative">
          <Icon name="BellIcon" className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        {/* User menu */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{user?.displayName}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <Icon name="ArrowRightOnRectangleIcon" className="w-6 h-6 text-gray-600" />
          </Button>
        </div>
      </div>
    </header>
  );
}; 