import { FC, ReactNode } from 'react';
import { Tab } from '@headlessui/react';
import { clsx } from 'clsx';

interface TabsProps {
  defaultValue?: string;
  children: ReactNode;
  className?: string;
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const Tabs: FC<TabsProps> = ({ children, className }) => {
  return (
    <Tab.Group className={clsx('w-full', className)}>
      {children}
    </Tab.Group>
  );
};

export const TabsList: FC<TabsListProps> = ({ children, className }) => {
  return (
    <Tab.List className={clsx('flex space-x-1 border-b', className)}>
      {children}
    </Tab.List>
  );
};

export const TabsTrigger: FC<TabsTriggerProps> = ({ children, className }) => {
  return (
    <Tab className={({ selected }) => 
      clsx(
        'px-4 py-2 text-sm font-medium outline-none',
        'border-b-2 -mb-[2px]',
        selected 
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        className
      )
    }>
      {children}
    </Tab>
  );
};

export const TabsContent: FC<TabsContentProps> = ({ children, className }) => {
  return (
    <Tab.Panel className={clsx('py-4', className)}>
      {children}
    </Tab.Panel>
  );
}; 