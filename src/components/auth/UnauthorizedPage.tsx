import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Không có quyền truy cập
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Bạn không có quyền truy cập trang này
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Quay lại
            </button>
          </div>
          <div>
            <button
              onClick={() => navigate('/')}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 