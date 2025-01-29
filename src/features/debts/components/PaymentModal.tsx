import { FC } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { PaymentForm } from './PaymentForm';
import { Transaction } from '@/types/database.types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerId: string;
  transactions: Transaction[];
  onSubmit: Parameters<typeof PaymentForm>[0]['onSubmit'];
  isSubmitting: boolean;
}

export const PaymentModal: FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  partnerId,
  transactions,
  onSubmit,
  isSubmitting
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo thanh toán"
    >
      <PaymentForm
        partnerId={partnerId}
        transactions={transactions}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}; 