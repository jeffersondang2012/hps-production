import { BaseService } from '../base/base.service';
import { Partner } from '@/types/database.types';

class PartnerService extends BaseService<Partner> {
  constructor() {
    super('partners');
  }

  async getByType(type: Partner['type']): Promise<Partner[]> {
    return this.getAll({
      where: [['type', '==', type]],
      orderBy: [['name', 'asc']]
    });
  }

  async updateDebtLimit(id: string, newLimit: number): Promise<void> {
    const partner = await this.getById(id);
    if (!partner) throw new Error('Đối tác không tồn tại');

    await this.update(id, {
      debtLimit: newLimit
    });
  }

  async updateNotificationChannels(id: string, channels: Partner['notificationChannels']): Promise<void> {
    await this.update(id, {
      notificationChannels: channels
    });
  }
}

export const partnerService = new PartnerService();