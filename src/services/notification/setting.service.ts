import { BaseService } from '../base/base.service';
import { NotificationSetting } from '@/types/notification.types';

class NotificationSettingService extends BaseService<NotificationSetting> {
  constructor() {
    super('notification_settings');
  }

  async getByPartner(partnerId: string): Promise<NotificationSetting | null> {
    const results = await this.getAll({
      where: [['partnerId', '==', partnerId]],
      limit: 1
    });
    return results[0] || null;
  }
}

export const settingService = new NotificationSettingService(); 