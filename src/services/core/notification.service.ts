import { env } from '@/config/env';
import { partnerService } from './partner.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

interface NotificationPayload {
  partnerId: string;
  transactionType: 'IN' | 'OUT';
  vehicleNumber: string;
  productName: string;
  quantity: number;
  unit: string;
  total: number;
  createdAt: Date;
  transactionId: string;
}

class NotificationService {
  async sendTelegramNotification(payload: NotificationPayload) {
    try {
      const partner = await partnerService.getById(payload.partnerId);
      if (!partner?.telegramChatId) {
        console.warn('Partner does not have Telegram chat ID:', payload.partnerId);
        return;
      }

      const message = this.formatMessage(payload);
      const response = await fetch(`https://api.telegram.org/bot${env.telegram.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: partner.telegramChatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      const result = await response.json();
      if (!result.ok) {
        throw new Error(`Telegram API Error: ${result.description}`);
      }

      // Lưu lịch sử gửi tin nhắn
      await firebase.firestore()
        .collection('notification_logs')
        .add({
          partnerId: payload.partnerId,
          transactionId: payload.transactionId,
          channel: 'TELEGRAM',
          message,
          status: 'SUCCESS',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

      return true;
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      
      // Lưu lịch sử lỗi
      await firebase.firestore()
        .collection('notification_logs')
        .add({
          partnerId: payload.partnerId,
          transactionId: payload.transactionId,
          channel: 'TELEGRAM',
          status: 'FAILED',
          error: error.message,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

      throw error;
    }
  }

  private formatMessage(payload: NotificationPayload): string {
    const type = payload.transactionType === 'IN' ? 'Nhập hàng' : 'Xuất hàng';
    const date = new Date(payload.createdAt).toLocaleString('vi-VN');
    
    return `
<b>HPS - Thông báo ${type}</b>

📅 Ngày: ${date}
🚛 Số xe: ${payload.vehicleNumber}
📦 Sản phẩm: ${payload.productName}
📊 Số lượng: ${payload.quantity} ${payload.unit}
💰 Thành tiền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload.total)}

Vui lòng kiểm tra thông tin và phản hồi nếu có sai sót.
Xin cảm ơn!
    `.trim();
  }
}

export const notificationService = new NotificationService(); 