import { BaseService } from '../base/base.service';
import { NotificationTemplate, SystemNotificationType } from '@/types/notification.types';

class NotificationTemplateService extends BaseService<NotificationTemplate> {
  constructor() {
    super('notification_templates');
  }

  async getByType(type: SystemNotificationType): Promise<NotificationTemplate | null> {
    const results = await this.getAll({
      where: [['type', '==', type]],
      limit: 1
    });
    return results[0] || null;
  }
}

export const templateService = new NotificationTemplateService(); 