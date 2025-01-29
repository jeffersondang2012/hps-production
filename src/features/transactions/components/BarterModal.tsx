import { FC } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { BarterForm } from './BarterForm';
import { Product, Partner } from '@/types/database.types';

interface BarterModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  partners: Partner[];
  onSubmit: Parameters<typeof BarterForm>[0]['onSubmit'];
  isSubmitting: boolean;
}

export const BarterModal: FC<BarterModalProps> = ({
  isOpen,
  onClose,
  products,
  partners,
  onSubmit,
  isSubmitting
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo giao dịch đổi hàng"
    >
      <BarterForm
        products={products}
        partners={partners}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}; 