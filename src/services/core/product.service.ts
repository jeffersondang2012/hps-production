import { Product } from '@/types/database.types';
import { BaseService } from '../base/base.service';
import { Timestamp } from 'firebase/firestore';

class ProductService extends BaseService<Product> {
  constructor() {
    super('products');
  }

  async updatePrice(id: string, price: number): Promise<void> {
    const now = Timestamp.now();
    await this.update(id, {
      currentPrice: price,
      priceHistory: [
        {
          price,
          date: now
        }
      ]
    });
  }

  async getByType(type: Product['type']): Promise<(Product & { id: string })[]> {
    return this.getAll({
      where: [['type', '==', type]]
    });
  }

  async getActive(): Promise<(Product & { id: string })[]> {
    return this.getAll({
      where: [['isTrading', '==', true]]
    });
  }
}

export const productService = new ProductService();