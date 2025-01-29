import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AuditLog } from '@/types/auth.types';
import { auditService } from '@/services/core/audit.service';
import { useAuthStore } from '@/stores/useAuthStore';

interface AuditLogTableProps {
  userId?: string | null;
  action?: string | null;
  target?: string | null;
  startDate?: Date | null | undefined;
  endDate?: Date | null | undefined;
}

export const AuditLogTable = ({
  userId,
  action,
  target,
  startDate,
  endDate
}: AuditLogTableProps) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedLogs: AuditLog[] = [];

        if (userId) {
          fetchedLogs = await auditService.getByUser(userId);
        } else if (action) {
          fetchedLogs = await auditService.getByAction(action as any);
        } else if (target) {
          fetchedLogs = await auditService.getByTarget(target);
        } else if (startDate && endDate) {
          fetchedLogs = await auditService.getByDateRange(startDate, endDate);
        } else {
          // Mặc định lấy logs của user hiện tại
          if (user) {
            fetchedLogs = await auditService.getByUser(user.id);
          }
        }

        setLogs(fetchedLogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [userId, action, target, startDate, endDate, user]);

  if (loading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Lỗi: {error}
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="text-center text-gray-500 py-4">
        Không có dữ liệu
      </div>
    );
  }

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, 'HH:mm:ss dd/MM/yyyy', { locale: vi });
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'USER_LOGIN':
        return 'Đăng nhập';
      case 'USER_LOGOUT':
        return 'Đăng xuất';
      case 'USER_CREATE':
        return 'Tạo tài khoản';
      case 'USER_UPDATE':
        return 'Cập nhật tài khoản';
      case 'USER_DELETE':
        return 'Xóa tài khoản';
      case 'PERMISSION_UPDATE':
        return 'Cập nhật quyền';
      case 'PASSWORD_RESET_REQUEST':
        return 'Yêu cầu đặt lại mật khẩu';
      case 'PRODUCTION_CREATE':
        return 'Tạo dây chuyền sản xuất';
      case 'PRODUCTION_UPDATE':
        return 'Cập nhật dây chuyền sản xuất';
      case 'PRODUCTION_DELETE':
        return 'Xóa dây chuyền sản xuất';
      case 'TRANSACTION_CREATE':
        return 'Tạo giao dịch';
      case 'TRANSACTION_UPDATE':
        return 'Cập nhật giao dịch';
      case 'TRANSACTION_DELETE':
        return 'Xóa giao dịch';
      case 'EXPENSE_CREATE':
        return 'Tạo chi phí';
      case 'EXPENSE_UPDATE':
        return 'Cập nhật chi phí';
      case 'EXPENSE_DELETE':
        return 'Xóa chi phí';
      case 'EXPENSE_APPROVE':
        return 'Duyệt chi phí';
      case 'EXPENSE_REJECT':
        return 'Từ chối chi phí';
      default:
        return action;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thời gian
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Người dùng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành động
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Đối tượng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chi tiết
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatTimestamp(log.timestamp)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.userEmail}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getActionText(log.action)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.target}
              </td>
              <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                {log.details && (
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 