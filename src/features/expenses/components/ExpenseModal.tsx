import { FC } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { ExpenseForm } from './ExpenseForm';
import { Expense } from '@/types/database.types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Expense;
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isSubmitting?: boolean;
  productionLineId?: string;
}

export const ExpenseModal: FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isSubmitting,
  productionLineId
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Chỉnh sửa chi phí' : 'Thêm chi phí mới'}
    >
      <ExpenseForm
        initialData={initialData}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        productionLineId={productionLineId}
      />
    </Modal>
  );
}; 