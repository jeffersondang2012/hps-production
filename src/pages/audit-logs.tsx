import { useState } from 'react';
import { AuditLogTable } from '@/components/audit/AuditLogTable';
import { useAuthStore } from '@/stores/useAuthStore';
import { PERMISSIONS } from '@/constants/permissions';
import { UnauthorizedPage } from '@/components/auth/UnauthorizedPage';
import { DatePicker } from '@/components/common/DatePicker';

export default function AuditLogsPage() {
  const { user, hasPermission } = useAuthStore();
  const [userId, setUserId] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [target, setTarget] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Kiểm tra quyền xem audit log
  if (!user || !hasPermission(PERMISSIONS.AUDIT_VIEW)) {
    return <UnauthorizedPage />;
  }

  const handleFilter = () => {
    // Reset các filter khác khi chọn một filter
    if (userId) {
      setAction('');
      setTarget('');
      setStartDate(null);
      setEndDate(null);
    } else if (action) {
      setUserId('');
      setTarget('');
      setStartDate(null);
      setEndDate(null);
    } else if (target) {
      setUserId('');
      setAction('');
      setStartDate(null);
      setEndDate(null);
    } else if (startDate && endDate) {
      setUserId('');
      setAction('');
      setTarget('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Nhật ký hoạt động</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Người dùng
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              handleFilter();
            }}
            placeholder="Nhập ID người dùng"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hành động
          </label>
          <input
            type="text"
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              handleFilter();
            }}
            placeholder="Nhập loại hành động"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đối tượng
          </label>
          <input
            type="text"
            value={target}
            onChange={(e) => {
              setTarget(e.target.value);
              handleFilter();
            }}
            placeholder="Nhập đối tượng"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Từ ngày
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => {
              setStartDate(date);
              handleFilter();
            }}
            placeholderText="Chọn ngày bắt đầu"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đến ngày
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => {
              setEndDate(date);
              handleFilter();
            }}
            placeholderText="Chọn ngày kết thúc"
            minDate={startDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <AuditLogTable
        userId={userId || null}
        action={action || null}
        target={target || null}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
} 