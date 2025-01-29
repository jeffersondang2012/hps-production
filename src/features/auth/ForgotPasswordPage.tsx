import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { useAuth } from '@/contexts/AuthContext';

const schema = z.object({
  email: z.string().email('Email không hợp lệ')
});

type FormData = z.infer<typeof schema>;

export const ForgotPasswordPage: FC = () => {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(data.email);
      setMessage('Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn');
    } catch (err) {
      setError('Không thể gửi email đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Quên mật khẩu
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <Icon name="ExclamationCircleIcon" className="w-5 h-5 inline mr-2" />
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
            <Icon name="CheckCircleIcon" className="w-5 h-5 inline mr-2" />
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Button>
          </div>

          <div className="text-sm text-center">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}; 