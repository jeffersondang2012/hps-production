import { FC } from 'react';
import * as HeroIcons from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export type IconName = keyof typeof HeroIcons;

export interface IconProps {
  name: IconName;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

export const Icon: FC<IconProps> = ({ name, className = '', size = 'md' }) => {
  const IconComponent = HeroIcons[name];
  return (
    <IconComponent 
      className={clsx(sizeClasses[size], className)} 
      aria-hidden="true" 
    />
  );
}; 