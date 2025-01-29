import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { partnerService } from '@/services/core/partner.service';
import { env } from '@/config/env';

export const ConnectTelegramPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const partnerId = searchParams.get('partnerId');
    const chatId = searchParams.get('chat_id');

    if (partnerId && chatId) {
      const updatePartner = async () => {
        try {
          await partnerService.update(partnerId, {
            telegramChatId: chatId,
            notificationPreference: 'TELEGRAM'
          });
          navigate('/partners');
        } catch (err) {
          setError('Lỗi khi cập nhật thông tin. Vui lòng thử lại.');
        }
      };

      updatePartner();
    }
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-4">Đang kết nối Telegram...</h1>
        <p>Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
}; 