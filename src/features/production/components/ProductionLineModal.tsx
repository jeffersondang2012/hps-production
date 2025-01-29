import { FC } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { ProductionLineForm } from './ProductionLineForm';
import { ProductionLine } from '@/types/database.types';

interface ProductionLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProductionLine;
  onSubmit: (data: Omit<ProductionLine, 'id'>) => Promise<void>;
  isSubmitting?: boolean;
}

export const ProductionLineModal: FC<ProductionLineModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isSubmitting
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Chỉnh sửa dây chuyền sản xuất' : 'Thêm dây chuyền sản xuất mới'}
    >
      <ProductionLineForm
        initialData={initialData}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}; 