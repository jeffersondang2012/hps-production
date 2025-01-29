import { FC, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { useAuth } from '@/contexts/AuthContext';
import { Icon } from '@/components/atoms/Icon';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setLoading(true);
      await login(data.email, data.password);
      navigate(from);
    } catch (err) {
      if (err instanceof Error) {
        switch (err.message) {
          case 'auth/user-not-found':
            setError('Tài khoản không tồn tại');
            break;
          case 'auth/wrong-password':
            setError('Mật khẩu không đúng');
            break;
          default:
            setError('Đăng nhập thất bại. Vui lòng thử lại.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <Icon name="ExclamationCircleIcon" className="w-5 h-5 inline mr-2" />
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Mật khẩu"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Chưa có tài khoản? Đăng ký ngay
            </Link>
            <Link
              to="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}; 