import { partnerService } from '@/services/core/partner.service';

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { message } = await req.json();
    console.log('Received message:', message);
    
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
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
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

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 