import { FC, useState, useCallback, useMemo, useRef } from 'react';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { useExpenses, useModal, useProductionLines } from '@/hooks';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseModal } from './components/ExpenseModal';
import { Expense, ExpenseType, ExpenseStatus } from '@/types/database.types';
import { SearchInput } from '@/components/molecules/SearchInput';
import { Select } from '@/components/atoms/Select';

interface FilterValues {
  type?: ExpenseType;
  status?: ExpenseStatus;
  search?: string;
  productionLineId?: string;
}

export const ExpensesPage: FC = () => {
  const filterRef = useRef<FilterValues>({});
  const [filters, setFilters] = useState<FilterValues>({});
  const { productionLines } = useProductionLines();
  const { expenses, isLoading, error, createExpense, updateExpense, deleteExpense, approveExpense, rejectExpense } = useExpenses(filterRef.current.productionLineId);
  const { isOpen, open, close } = useModal();
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>();

  const handleAdd = useCallback(() => {
    setSelectedExpense(undefined);
    open();
  }, [open]);

  const handleEdit = useCallback((expense: Expense) => {
    setSelectedExpense(expense);
    open();
  }, [open]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chi phí này?')) {
      await deleteExpense(id);
    }
  }, [deleteExpense]);

  const handleApprove = useCallback(async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn phê duyệt chi phí này?')) {
      await approveExpense(id);
    }
  }, [approveExpense]);

  const handleReject = useCallback(async (id: string) => {
    const reason = window.prompt('Vui lòng nhập lý do từ chối:');
    if (reason) {
      await rejectExpense(id);
    }
  }, [rejectExpense]);

  const handleFilterChange = useCallback((key: keyof FilterValues, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      filterRef.current = newFilters;
      return newFilters;
    });
  }, []);

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    return expenses.filter(expense => {
      if (filters.type && expense.type !== filters.type) return false;
      if (filters.status && expense.status !== filters.status) return false;
      if (filters.search && !expense.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [expenses, filters]);

  const handleSubmit = async (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedExpense) {
        await updateExpense(selectedExpense.id, data);
      } else {
        await createExpense({
          ...data,
          productionLineId: filters.productionLineId
        });
      }
      close();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTypeChange = (value: string) => {
    handleFilterChange('type', value as ExpenseType || undefined);
  };

  const handleStatusChange = (value: string) => {
    handleFilterChange('status', value as ExpenseStatus || undefined);
  };

  const handleProductionLineChange = (value: string) => {
    handleFilterChange('productionLineId', value || undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Quản lý Chi phí</h1>
        <Button variant="primary" onClick={handleAdd}>Thêm chi phí</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-medium text-gray-900">Tổng chi phí tháng</h3>
          <p className="mt-2 text-3xl font-bold">
            {expenses?.reduce((sum, exp) => sum + exp.amount, 0)?.toLocaleString()} đ
          </p>
          <p className="mt-1 text-sm text-gray-500">So với tháng trước: +8.5%</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900">Chi phí chờ duyệt</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-500">
            {expenses?.filter(e => e.status === 'PENDING').length || 0}
          </p>
          <p className="mt-1 text-sm text-gray-500">Cần được phê duyệt</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900">Chi phí đã duyệt</h3>
          <p className="mt-2 text-3xl font-bold text-green-500">
            {expenses?.filter(e => e.status === 'APPROVED').length || 0}
          </p>
          <p className="mt-1 text-sm text-gray-500">Trong tháng này</p>
        </Card>
      </div>

      {/* Filters and List */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Select
            label="Dây chuyền sản xuất"
            value={filters.productionLineId || ''}
            onChange={(e) => handleProductionLineChange(e.target.value)}
            options={[
              { value: '', label: 'Tất cả dây chuyền' },
              ...(productionLines?.map(line => ({
                value: line.id,
                label: line.name
              })) || [])
            ]}
            className="w-full"
          />
          <SearchInput
            placeholder="Tìm kiếm chi phí..."
            onSearch={(value) => handleFilterChange('search', value)}
            className="w-full"
          />
          <Select
            label="Loại chi phí"
            value={filters.type || ''}
            onChange={(e) => handleTypeChange(e.target.value)}
            options={[
              { value: '', label: 'Tất cả loại' },
              { value: 'MATERIAL', label: 'Nguyên vật liệu' },
              { value: 'LABOR', label: 'Nhân công' },
              { value: 'OVERHEAD', label: 'Chi phí chung' }
            ]}
            className="w-full"
          />
          <Select
            label="Trạng thái"
            value={filters.status || ''}
            onChange={(e) => handleStatusChange(e.target.value)}
            options={[
              { value: '', label: 'Tất cả trạng thái' },
              { value: 'PENDING', label: 'Chờ duyệt' },
              { value: 'APPROVED', label: 'Đã duyệt' },
              { value: 'REJECTED', label: 'Từ chối' }
            ]}
            className="w-full"
          />
        </div>

        {/* Expense List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">Đã có lỗi xảy ra khi tải dữ liệu</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 mb-2">Không có dữ liệu</p>
            <Button variant="outline" onClick={handleAdd}>Thêm chi phí mới</Button>
          </div>
        ) : (
          <ExpenseList
            data={filteredExpenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </Card>

      {/* Recent Activities */}
      <Card>
        <h2 className="text-lg font-medium mb-4">Hoạt động gần đây</h2>
        <div className="space-y-4">
          {expenses?.slice(0, 5).map(expense => (
            <div key={expense.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{expense.description}</p>
                <p className="text-sm text-gray-500">
                  {expense.createdAt?.toDate().toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{expense.amount.toLocaleString()} đ</p>
                <p className={`text-sm ${expense.status === 'APPROVED' ? 'text-green-500' : expense.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {expense.status === 'APPROVED' ? 'Đã duyệt' : expense.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <ExpenseModal
        isOpen={isOpen}
        onClose={close}
        initialData={selectedExpense}
        onSubmit={handleSubmit}
        productionLineId={filters.productionLineId}
      />
    </div>
  );
}; 