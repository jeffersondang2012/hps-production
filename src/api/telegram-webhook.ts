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
      console.log('Encoded ID:', encodedId);
      
      try {
        // Thêm log để debug
        console.log('Original command:', update.message.text);
        console.log('Encoded ID:', encodedId);
        
        const partnerId = atob(encodedId);
        console.log('Decoded ID:', partnerId);
        
        const partnerRef = doc(db, 'partners', partnerId);
        const partnerSnap = await getDoc(partnerRef);
        console.log('Partner exists:', partnerSnap.exists());
        
        if (partnerSnap.exists()) {
          // Cho phép kết nối lại, bỏ check telegramChatId
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
        console.error('Error in /start command:', error);
        // Gửi tin nhắn lỗi chi tiết hơn
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `Lỗi khi xử lý: ${error.message}`
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