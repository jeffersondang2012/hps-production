import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
      const partnerId = update.message.text.split(' ')[1]; // Lấy partnerId từ command, ví dụ: /start ABC123

      if (partnerId) {
        // Cập nhật partner với chat ID
        const partnerRef = doc(db, 'partners', partnerId);
        await updateDoc(partnerRef, {
          telegramChatId: chatId.toString(),
          notificationPreference: 'TELEGRAM'
        });

        // Gửi tin nhắn xác nhận
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: 'Kết nối thành công! Bạn sẽ nhận được thông báo về các giao dịch qua bot này.'
          })
        });
      } else {
        // Nếu không có partnerId, gửi tin nhắn hướng dẫn
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: 'Vui lòng sử dụng link kết nối từ trang web để bắt đầu nhận thông báo.'
          })
        });
      }
    }

    return res.json({ ok: true });

  } catch (error) {
    console.error('Telegram webhook error:', error);
    return res.status(500).json({ ok: false, error: error.message });
  }
} 