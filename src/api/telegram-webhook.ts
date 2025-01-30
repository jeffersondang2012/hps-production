import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Allow GET for webhook verification
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const update = await req.body;
    console.log('Received Telegram update:', update);

    // Xử lý lệnh /start
    if (update.message?.text?.startsWith('/start')) {
      const chatId = update.message.chat.id;
      
      // Gửi tin nhắn chào
      const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: 'Xin chào! Tôi là bot của HPS Production. Tôi sẽ gửi thông báo về các giao dịch cho bạn.'
        })
      });

      const result = await response.json();
      console.log('Telegram API response:', result);
    }

    return res.json({ ok: true });

  } catch (error) {
    console.error('Telegram webhook error:', error);
    return res.status(500).json({ ok: false, error: error.message });
  }
} 