import { FC } from 'react';
import { Card } from '@/components/atoms/Card';
import { useDebts } from '@/hooks/resources/useDebts';
import { DebtList } from './components/DebtList';
import { DebtDetail } from './components/DebtDetail';

export const DebtsPage: FC = () => {
  const {
    summaries,
    selectedDebt,
    isLoading,
    error,
    fetchDebtDetail,
    clearSelectedDebt
  } = useDebts();

  if (isLoading) {
    return <div className="p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Đã xảy ra lỗi: {error.message}</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Công nợ</h1>
      </div>

      <Card>
        <DebtList
          data={summaries}
          onViewDetail={(debt) => fetchDebtDetail(debt.partnerId)}
        />
      </Card>

      <DebtDetail
        isOpen={!!selectedDebt}
        onClose={clearSelectedDebt}
        data={selectedDebt}
      />
    </div>
  );
}; 