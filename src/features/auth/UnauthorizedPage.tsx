import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';

export const UnauthorizedPage: FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="max-w-md w-full p-8 text-center">
        <Icon 
          name="ExclamationTriangleIcon"
          className="w-16 h-16 text-yellow-500 mx-auto" 
        />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Không có quyền truy cập
        </h1>
        <p className="mt-2 text-gray-600">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên.
        </p>
        <div className="mt-6">
          <Link to="/">
            <Button>Quay lại trang chủ</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}; 