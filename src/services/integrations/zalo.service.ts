import { ApiService } from '../base/api.service';

interface ZaloConfig {
  appId: string;
  secretKey: string;
  apiBaseUrl: string;
}

class ZaloService extends ApiService {
  constructor(config: ZaloConfig) {
    super(config.apiBaseUrl);
    this.appId = config.appId;
    this.secretKey = config.secretKey;
  }

  private appId: string;
  private secretKey: string;

  async sendMessage(userId: string, text: string): Promise<void> {
    await this.post('/message', {
      recipient: {
        user_id: userId
      },
      message: {
        text
      }
    }, {
      'X-API-Key': this.secretKey,
      'X-APP-ID': this.appId
    });
  }

  async sendImage(userId: string, imageUrl: string, caption?: string): Promise<void> {
    await this.post('/message', {
      recipient: {
        user_id: userId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'media',
            elements: [{
              media_type: 'image',
              url: imageUrl,
              description: caption
            }]
          }
        }
      }
    }, {
      'X-API-Key': this.secretKey,
      'X-APP-ID': this.appId
    });
  }

  async sendFile(userId: string, fileUrl: string, caption?: string): Promise<void> {
    await this.post('/message', {
      recipient: {
        user_id: userId
      },
      message: {
        attachment: {
          type: 'file',
          payload: {
            url: fileUrl,
            description: caption
          }
        }
      }
    }, {
      'X-API-Key': this.secretKey,
      'X-APP-ID': this.appId
    });
  }
}

// Khởi tạo service với config từ environment
export const zaloService = new ZaloService({
  appId: process.env.ZALO_APP_ID || '',
  secretKey: process.env.ZALO_SECRET_KEY || '',
  apiBaseUrl: 'https://openapi.zalo.me/v2.0/oa'
}); 