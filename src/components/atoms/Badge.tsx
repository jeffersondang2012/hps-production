import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Badge = ({ variant = 'info', children, className }: BadgeProps) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'error',
          'bg-blue-100 text-blue-800': variant === 'info',
        },
        className
      )}
    >
      {children}
    </span>
  );
}; 