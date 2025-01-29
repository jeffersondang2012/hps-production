import { FC, useState, useCallback } from 'react';
import { useExpenses } from '@/hooks/resources/useExpenses';
import { usePagination } from '@/hooks/common/usePagination';
import { ExpenseList } from '../components/ExpenseList';
import { ExpenseModal } from '../components/ExpenseModal';
import { ExpenseCharts } from '../components/ExpenseCharts';
import { ExpenseReport } from '../components/ExpenseReport';
import { Pagination } from '@/components/molecules/Pagination';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Expense, ExpenseType, ExpenseStatus } from '@/types/database.types';
import { Icon } from '@/components/atoms/Icon';

interface ExpensesPageProps {
  productionLineId: string;
  canApprove?: boolean;
}

export const ExpensesPage: FC<ExpensesPageProps> = ({
  productionLineId,
  canApprove = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ExpenseType | ''>('');
  const [filterStatus, setFilterStatus] = useState<ExpenseStatus | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const {
    expenses,
    isLoading,
    createExpense,
    updateExpense,
    deleteExpense,
    approveExpense,
    rejectExpense
  } = useExpenses(productionLineId);

  const handleOpenModal = useCallback((expense?: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedExpense(undefined);
    setIsModalOpen(false);
  }, []);

  const handleSubmit = useCallback(async (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedExpense) {
      await updateExpense(selectedExpense.id, data);
    } else {
      await createExpense(data);
    }
    handleCloseModal();
  }, [selectedExpense, updateExpense, createExpense, handleCloseModal]);

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || expense.type === filterType;
    const matchesStatus = !filterStatus || expense.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const {
    currentPage,
    totalPages,
    pageSize,
    paginatedData,
    setCurrentPage,
    setPageSize
  } = usePagination(filteredExpenses);

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý chi phí</h1>
        <Button onClick={() => handleOpenModal()}>
          <Icon name="PlusIcon" className="w-5 h-5 mr-2" />
          Thêm chi phí
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Input
          placeholder="Tìm kiếm theo mô tả..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Select
          value={filterType}
          onChange={e => setFilterType(e.target.value as ExpenseType | '')}
        >
          <option value="">Tất cả loại chi phí</option>
          <option value="LABOR">Nhân công</option>
          <option value="ELECTRICITY">Điện</option>
          <option value="MAINTENANCE">Bảo trì</option>
          <option value="OTHER">Khác</option>
        </Select>
        <Input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          placeholder="Từ ngày"
        />
        <Input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          placeholder="Đến ngày"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ExpenseCharts data={filteredExpenses} />
        </div>
        <div>
          <ExpenseReport
            data={filteredExpenses}
            startDate={startDate ? new Date(startDate) : undefined}
            endDate={endDate ? new Date(endDate) : undefined}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="mb-4">
            <span className="font-medium">Tổng chi phí: </span>
            <span className="text-lg text-blue-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
            </span>
          </div>

          <ExpenseList
            data={paginatedData}
            onEdit={handleOpenModal}
            onDelete={deleteExpense}
            onApprove={approveExpense}
            onReject={rejectExpense}
            canApprove={canApprove}
          />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedExpense}
        onSubmit={handleSubmit}
      />
    </div>
  );
}; 