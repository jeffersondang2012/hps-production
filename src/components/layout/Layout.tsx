import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../organisms/Sidebar';
import { Header } from '../organisms/Header';

export const Layout: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Cố định bên trái */}
      <Sidebar className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg" />

      {/* Main content */}
      <div className="pl-64">
        {/* Header - Cố định phía trên */}
        <Header className="fixed top-0 right-0 left-64 h-16 bg-white shadow-sm z-10" />
        
        {/* Main content area - Có padding để tránh đè lên header */}
        <main className="pt-16 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}; 