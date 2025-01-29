import { env } from '@/config/env';
import { partnerService } from '@/services/core/partner.service';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    // Xử lý lệnh /start
    if (message?.text?.startsWith('/start')) {
      const partnerId = message.text.split(' ')[1]; // Lấy partnerId từ command
      const chatId = message.chat.id;

      if (partnerId) {
        // Cập nhật thông tin partner với chat_id
        await partnerService.update(partnerId, {
          telegramChatId: chatId.toString(),
          notificationPreference: 'TELEGRAM'
        });

        // Gửi tin nhắn xác nhận
        await fetch(`https://api.telegram.org/bot${env.telegram.botToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: 'Kết nối thành công! Bạn sẽ nhận được thông báo về các giao dịch qua bot này.',
            parse_mode: 'HTML'
          })
        });
      }
    }

    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 