import express from 'express';
import { env } from '@/config/env';
import { partnerService } from '@/services/core/partner.service';

const router = express.Router();

router.post('/telegram-webhook', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received message:', message); // Log để debug
    
    if (message?.text?.startsWith('/start')) {
      const partnerId = message.text.split(' ')[1];
      const chatId = message.chat.id;

      if (partnerId) {
        await partnerService.update(partnerId, {
          telegramChatId: chatId.toString(),
          notificationPreference: 'TELEGRAM'
        });

        // Gửi tin nhắn xác nhận
        await fetch(`https://api.telegram.org/bot${env.telegram.botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: 'Kết nối thành công! Bạn sẽ nhận được thông báo về các giao dịch qua bot này.',
            parse_mode: 'HTML'
          })
        });
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 