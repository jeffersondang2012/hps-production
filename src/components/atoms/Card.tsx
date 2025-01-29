import { clsx } from 'clsx';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={clsx('bg-white rounded-lg shadow', className)}>
      {children}
    </div>
  );
}; 