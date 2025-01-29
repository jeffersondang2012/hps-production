import { FC } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { ProductForm } from './ProductForm';
import { Product } from '@/types/database.types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id' | 'priceHistory' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: Product;
}

export const ProductModal: FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
    >
      <ProductForm
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        initialData={initialData}
      />
    </Modal>
  );
}; 