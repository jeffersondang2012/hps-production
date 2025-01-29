import { FC, useState } from 'react';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { useProductionLines, useModal } from '@/hooks';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { ProductionLineList } from './components/ProductionLineList';
import { ProductionLineModal } from './components/ProductionLineModal';
import { ProductionLine } from '@/types/database.types';
import { schema } from './components/ProductionLineForm';
import { z } from 'zod';

type ProductionLineInput = z.infer<typeof schema>;

export const ProductionPage: FC = () => {
  const { productionLines, isLoading, error, createProductionLine, updateProductionLine, deleteProductionLine } = useProductionLines();
  const { isOpen, open, close } = useModal();
  const [selectedLine, setSelectedLine] = useState<ProductionLine | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError } = useNotificationStore();

  const handleAdd = () => {
    setSelectedLine(undefined);
    open();
  };

  const handleEdit = (line: ProductionLine) => {
    setSelectedLine(line);
    open();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dây chuyền này?')) {
      await deleteProductionLine(id);
    }
  };

  const handleSubmit = async (data: ProductionLineInput) => {
    try {
      setIsSubmitting(true);
      
      if (selectedLine) {
        await updateProductionLine(selectedLine.id, data);
      } else {
        // Không cần thêm createdAt và updatedAt vì base.service sẽ tự thêm
        await createProductionLine(data);
      }
      close();
    } catch (error) {
      console.error('Error:', error);
      showError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xử lý yêu cầu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Đã xảy ra lỗi: {error.message}</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Dây chuyền Sản xuất</h1>
        <Button onClick={handleAdd}>Thêm dây chuyền</Button>
      </div>

      <Card>
        <ProductionLineList
          data={productionLines}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <ProductionLineModal
        isOpen={isOpen}
        onClose={close}
        initialData={selectedLine}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}; 