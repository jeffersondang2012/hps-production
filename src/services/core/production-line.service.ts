import { BaseService } from '../base/base.service';
import { ProductionLine } from '@/types/database.types';

class ProductionLineService extends BaseService<ProductionLine> {
  constructor() {
    super('production_lines');
  }

  // Lấy danh sách dây chuyền đang hoạt động
  async getActive(): Promise<ProductionLine[]> {
    return this.getAll({
      where: [['status', '==', 'active']],
      orderBy: [['name', 'asc']]
    });
  }

  // Cập nhật trạng thái hoạt động
  async updateStatus(id: string, status: ProductionLine['status']): Promise<void> {
    const line = await this.getById(id);
    if (!line) throw new Error('Dây chuyền không tồn tại');

    await this.update(id, { status });
  }

  // Cập nhật công suất
  async updateCapacity(id: string, capacity: number): Promise<void> {
    if (capacity < 0) {
      throw new Error('Công suất không hợp lệ');
    }

    const line = await this.getById(id);
    if (!line) throw new Error('Dây chuyền không tồn tại');

    await this.update(id, { capacity });
  }
}

export const productionLineService = new ProductionLineService(); 