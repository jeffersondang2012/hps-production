export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const update = await req.json();
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

    return Response.json({ ok: true });

  } catch (error) {
    console.error('Telegram webhook error:', error);
    return Response.json({ ok: false, error: error.message });
  }
} 