import { BaseService } from '../base/base.service';
import { NotificationLog } from '@/types/notification.types';
import { Timestamp } from 'firebase/firestore';

class NotificationLogService extends BaseService<NotificationLog> {
  constructor() {
    super('notification_logs');
  }

  async updateStatus(
    id: string,
    status: 'SENT' | 'FAILED',
    error?: string
  ): Promise<void> {
    const update: Partial<NotificationLog> = {
      status,
      sentAt: status === 'SENT' ? Timestamp.now() : undefined
    };
    if (error) update.error = error;
    await this.update(id, update);
  }

  async getByPartner(partnerId: string): Promise<NotificationLog[]> {
    return this.getAll({
      where: [['partnerId', '==', partnerId]],
      orderBy: [['createdAt', 'desc']]
    });
  }

  async getByStatus(status: NotificationLog['status']): Promise<NotificationLog[]> {
    return this.getAll({
      where: [['status', '==', status]],
      orderBy: [['createdAt', 'desc']]
    });
  }
}

export const logService = new NotificationLogService(); 