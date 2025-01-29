import { FC, useState, useCallback } from 'react';
import { Timestamp } from 'firebase/firestore';
import { Product } from '@/types/database.types';
import { useProducts } from '@/hooks/resources/useProducts';
import { Button } from '@/components/atoms/Button';
import { ProductList } from './components/ProductList';
import { ProductModal } from './components/ProductModal';
import { PriceHistoryModal } from './components/PriceHistoryModal';

export const ProductsPage: FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPriceHistoryModalOpen, setIsPriceHistoryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { products, isLoading, error, createProduct, updateProduct, deleteProduct } = useProducts();

  const handleCreate = useCallback(async (data: Omit<Product, 'id' | 'priceHistory' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      const newProduct: Omit<Product, 'id'> = {
        ...data,
        priceHistory: [{
          price: data.currentPrice,
          date: Timestamp.now(),
          note: 'Giá khởi tạo'
        }],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      await createProduct(newProduct);
      setIsProductModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [createProduct]);

  const handleUpdate = useCallback(async (id: string, data: Omit<Product, 'id' | 'priceHistory' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      const product = products.find(p => p.id === id);
      if (!product) return;

      const priceHistory = [...product.priceHistory];
      if (data.currentPrice !== product.currentPrice) {
        priceHistory.unshift({
          price: data.currentPrice,
          date: Timestamp.now(),
          note: 'Cập nhật giá'
        });
      }

      const updatedProduct: Partial<Product> = {
        ...data,
        priceHistory,
        updatedAt: Timestamp.now()
      };
      await updateProduct(id, updatedProduct);
      setIsProductModalOpen(false);
      setSelectedProduct(undefined);
    } finally {
      setIsSubmitting(false);
    }
  }, [products, updateProduct]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      await deleteProduct(id);
    }
  }, [deleteProduct]);

  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  }, []);

  const handleViewPriceHistory = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsPriceHistoryModalOpen(true);
  }, []);

  const handleCloseProductModal = useCallback(() => {
    setIsProductModalOpen(false);
    setSelectedProduct(undefined);
  }, []);

  const handleClosePriceHistoryModal = useCallback(() => {
    setIsPriceHistoryModalOpen(false);
    setSelectedProduct(undefined);
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Đã xảy ra lỗi: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <Button
          variant="primary"
          onClick={() => setIsProductModalOpen(true)}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <ProductList
        data={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewPriceHistory={handleViewPriceHistory}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        onSubmit={selectedProduct ? 
          (data) => handleUpdate(selectedProduct.id, data) : 
          handleCreate
        }
        isSubmitting={isSubmitting}
        initialData={selectedProduct}
      />

      {selectedProduct && (
        <PriceHistoryModal
          isOpen={isPriceHistoryModalOpen}
          onClose={handleClosePriceHistoryModal}
          product={selectedProduct}
        />
      )}
    </div>
  );
}; 