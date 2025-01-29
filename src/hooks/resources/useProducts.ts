import { Product, BaseDocument } from '@/types/database.types';
import { productService } from '@/services/core/product.service';
import { useAsync } from '../common/useAsync';
import { useState, useCallback } from 'react';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { Timestamp } from 'firebase/firestore';

interface UseProductsOptions {
  type?: Product['type'];
  isTrading?: boolean;
  minStock?: number;
  maxStock?: number;
}

type ProductInput = Omit<Product, keyof BaseDocument>;

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationStore();

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await productService.getAll({
        where: [
          ...(options.type ? [['type', '==', options.type]] as [string, any, any][] : []),
          ...(options.isTrading !== undefined ? [['isTrading', '==', options.isTrading]] as [string, any, any][] : [])
        ]
      });
      setProducts(result);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setIsLoading(false);
    }
  }, [options.type, options.isTrading, showError]);

  const createProduct = useAsync(
    async (data: ProductInput) => {
      const now = Timestamp.now();
      const result = await productService.create({
        ...data,
        createdAt: now,
        updatedAt: now,
        priceHistory: [{
          price: data.currentPrice,
          date: now,
          note: 'Giá khởi tạo'
        }]
      } as Product);
      await fetchProducts();
      return result;
    },
    {
      successMessage: 'Tạo sản phẩm thành công',
      errorMessage: 'Lỗi khi tạo sản phẩm',
      showNotification: true
    }
  );

  const updateProduct = useAsync(
    async (id: string, data: Partial<ProductInput>) => {
      await productService.update(id, {
        ...data,
        updatedAt: Timestamp.now()
      } as Partial<Product>);
      await fetchProducts();
    },
    {
      successMessage: 'Cập nhật sản phẩm thành công',
      errorMessage: 'Lỗi khi cập nhật sản phẩm',
      showNotification: true
    }
  );

  const deleteProduct = useAsync(
    async (id: string) => {
      await productService.delete(id);
      await fetchProducts();
    },
    {
      successMessage: 'Xóa sản phẩm thành công',
      errorMessage: 'Lỗi khi xóa sản phẩm',
      showNotification: true
    }
  );

  const updatePrice = useAsync(
    async (id: string, newPrice: number, note?: string) => {
      const product = products.find(p => p.id === id);
      if (!product) throw new Error('Không tìm thấy sản phẩm');

      const now = Timestamp.now();
      await productService.update(id, {
        currentPrice: newPrice,
        priceHistory: [
          ...product.priceHistory,
          {
            price: newPrice,
            date: now,
            note
          }
        ],
        updatedAt: now
      } as Partial<Product>);
      await fetchProducts();
    },
    {
      successMessage: 'Cập nhật giá sản phẩm thành công',
      errorMessage: 'Lỗi khi cập nhật giá sản phẩm',
      showNotification: true
    }
  );

  // Filter data based on options
  const filteredProducts = products.filter(product => {
    if (options.minStock !== undefined && product.minStock !== undefined) {
      if (product.minStock < options.minStock) return false;
    }
    if (options.maxStock !== undefined && product.minStock !== undefined) {
      if (product.minStock > options.maxStock) return false;
    }
    return true;
  });

  return {
    products: filteredProducts,
    isLoading,
    error,
    createProduct: createProduct.execute,
    updateProduct: updateProduct.execute,
    deleteProduct: deleteProduct.execute,
    updatePrice: updatePrice.execute,
    refetch: fetchProducts
  };
};

// Hook for single product
export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationStore();

  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await productService.getById(id);
      setProduct(result);
    } catch (err) {
      setError(err as Error);
      showError('Lỗi khi tải thông tin sản phẩm');
    } finally {
      setIsLoading(false);
    }
  }, [id, showError]);

  const updateProduct = useAsync(
    async (data: Partial<ProductInput>) => {
      await productService.update(id, {
        ...data,
        updatedAt: Timestamp.now()
      } as Partial<Product>);
      await fetchProduct();
    },
    {
      successMessage: 'Cập nhật sản phẩm thành công',
      errorMessage: 'Lỗi khi cập nhật sản phẩm',
      showNotification: true
    }
  );

  const deleteProduct = useAsync(
    async () => {
      await productService.delete(id);
    },
    {
      successMessage: 'Xóa sản phẩm thành công',
      errorMessage: 'Lỗi khi xóa sản phẩm',
      showNotification: true
    }
  );

  const updatePrice = useAsync(
    async (newPrice: number, note?: string) => {
      if (!product) throw new Error('Không tìm thấy sản phẩm');

      const now = Timestamp.now();
      await productService.update(id, {
        currentPrice: newPrice,
        priceHistory: [
          ...product.priceHistory,
          {
            price: newPrice,
            date: now,
            note
          }
        ],
        updatedAt: now
      } as Partial<Product>);
      await fetchProduct();
    },
    {
      successMessage: 'Cập nhật giá sản phẩm thành công',
      errorMessage: 'Lỗi khi cập nhật giá sản phẩm',
      showNotification: true
    }
  );

  return {
    product,
    isLoading,
    error,
    updateProduct: updateProduct.execute,
    deleteProduct: deleteProduct.execute,
    updatePrice: updatePrice.execute,
    refetch: fetchProduct
  };
}; 