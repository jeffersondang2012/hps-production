import { BaseService, INotificationProvider } from '../base/base.service';
import { NotificationTemplate, SystemNotificationType, NotificationChannel } from '@/types/notification.types';
import { templateService as templateServiceInstance } from './template.service';
import { settingService as settingServiceInstance } from './setting.service';
import { logService as logServiceInstance } from './log.service';
import { Timestamp } from 'firebase/firestore';

class NotificationService implements INotificationProvider {
  private templateService: typeof templateServiceInstance;
  private settingService: typeof settingServiceInstance;
  private logService: typeof logServiceInstance;

  constructor(
    templateService = templateServiceInstance,
    settingService = settingServiceInstance,
    logService = logServiceInstance
  ) {
    this.templateService = templateService;
    this.settingService = settingService;
    this.logService = logService;
  }

  async send(recipientId: string, type: SystemNotificationType, data: any): Promise<void> {
    try {
      // Lấy cấu hình thông báo của người nhận
      const settings = await this.settingService.getByPartner(recipientId);
      if (!settings || !settings.enabledTypes.includes(type)) {
        return;
      }

      // Lấy template thông báo
      const template = await this.templateService.getByType(type);
      if (!template) {
        throw new Error(`Template not found for type: ${type}`);
      }

      // Tạo log thông báo cho mỗi kênh được bật
      const now = Timestamp.now();
      await Promise.all(settings.channels.map(async (channel: NotificationChannel) => {
        const log = await this.logService.create({
          partnerId: recipientId,
          type,
          templateId: template.id,
          content: JSON.stringify(data),
          status: 'PENDING',
          channel,
          createdAt: now
        });

        // TODO: Gửi thông báo qua kênh tương ứng
        // Đây là nơi để tích hợp với các service gửi thông báo cụ thể (email, telegram, zalo...)
        await this.logService.updateStatus(log.id, 'SENT');
      }));
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();

export {
  templateServiceInstance as templateService,
  settingServiceInstance as settingService,
  logServiceInstance as logService
}; 