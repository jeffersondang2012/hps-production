import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';

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
      const encodedId = update.message.text.split(' ')[1];
      
      try {
        // Giải mã partnerId
        const partnerId = atob(encodedId);
        
        // Kiểm tra xem partner có tồn tại không
        const partnerRef = doc(db, 'partners', partnerId);
        const partnerSnap = await getDoc(partnerRef);
        
        if (partnerSnap.exists()) {
          // Kiểm tra xem partner đã được kết nối chưa
          const partnerData = partnerSnap.data();
          if (partnerData.telegramChatId) {
            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: 'Đối tác này đã được kết nối với một tài khoản Telegram khác.'
              })
            });
            return res.json({ ok: true });
          }

          // Cập nhật partner
          await updateDoc(partnerRef, {
            telegramChatId: chatId.toString(),
            notificationPreference: 'TELEGRAM'
          });

          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: 'Kết nối thành công! Bạn sẽ nhận được thông báo về các giao dịch qua bot này.'
            })
          });
        } else {
          throw new Error('Invalid partner ID');
        }
      } catch (error) {
        // Gửi tin nhắn lỗi
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: 'Link kết nối không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.'
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