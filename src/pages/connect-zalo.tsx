import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { partnerService } from '@/services/core/partner.service';
import { env } from '@/config/env';

export const ConnectZaloPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const partnerId = searchParams.get('state'); // Truyền partnerId qua state parameter

    if (code && partnerId) {
      // Exchange code lấy Zalo user ID
      const getZaloUserId = async () => {
        try {
          const response = await fetch('https://oauth.zaloapp.com/v4/access_token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'secret_key': env.zalo.secretKey
            },
            body: new URLSearchParams({
              code,
              app_id: env.zalo.oaId,
              grant_type: 'authorization_code'
            })
          });

          const data = await response.json();
          
          if (data.access_token) {
            // Lấy thông tin user
            const userResponse = await fetch('https://graph.zalo.me/v2.0/me', {
              headers: {
                'access_token': data.access_token
              }
            });
            const userData = await userResponse.json();

            // Cập nhật Zalo ID cho đối tác
            await partnerService.update(partnerId, {
              zaloId: userData.id
            });

            // Redirect về trang đối tác
            navigate('/partners');
          }
        } catch (error) {
          console.error('Error connecting Zalo:', error);
        }
      };

      getZaloUserId();
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-4">Đang kết nối Zalo...</h1>
        <p>Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
}; 