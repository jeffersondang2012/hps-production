import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

const ZALO_API_URL = 'https://openapi.zalo.me/v2.0/oa/message';

interface ZaloMessage {
  partnerId: string;
  transactionType: 'IN' | 'OUT';
  vehicleNumber: string;
  productName: string;
  quantity: number;
  unit: string;
  total: number;
  createdAt: Date;
}

export const sendZaloMessage = functions.firestore
  .document('transactions/{transactionId}')
  .onCreate(async (snap, context) => {
    try {
      const transaction = snap.data();
      const partnerId = transaction.partnerId;

      // Lấy thông tin đối tác
      const partnerSnap = await admin.firestore()
        .collection('partners')
        .doc(partnerId)
        .get();
      
      const partner = partnerSnap.data();
      if (!partner?.zaloPhone || partner.notificationPreference !== 'ZALO') {
        return null;
      }

      // Format tin nhắn
      const message = formatZaloMessage({
        partnerId,
        transactionType: transaction.type,
        vehicleNumber: transaction.vehicleNumber,
        productName: transaction.items[0].name,
        quantity: transaction.items[0].quantity,
        unit: transaction.items[0].unit,
        total: transaction.items[0].total,
        createdAt: transaction.createdAt.toDate()
      });

      // Gửi tin nhắn qua Zalo API
      const response = await axios.post(
        ZALO_API_URL,
        {
          phone: partner.zaloPhone,
          message: message,
          // Thêm các tham số xác thực cần thiết
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Lưu lịch sử gửi tin nhắn
      await admin.firestore()
        .collection('notification_logs')
        .add({
          partnerId,
          transactionId: snap.id,
          channel: 'ZALO',
          message,
          status: response.data.success ? 'SUCCESS' : 'FAILED',
          error: response.data.error,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

      return response.data;
    } catch (error) {
      console.error('Error sending Zalo message:', error);
      throw error;
    }
  });

function formatZaloMessage(data: ZaloMessage): string {
  const type = data.transactionType === 'IN' ? 'Nhập hàng' : 'Xuất hàng';
  const date = new Date(data.createdAt).toLocaleString('vi-VN');
  
  return `
HPS - Thông báo ${type}

📅 Ngày: ${date}
🚛 Số xe: ${data.vehicleNumber}
📦 Sản phẩm: ${data.productName}
📊 Số lượng: ${data.quantity} ${data.unit}
💰 Thành tiền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.total)}

Vui lòng kiểm tra thông tin và phản hồi nếu có sai sót.
Xin cảm ơn!
  `.trim();
} 