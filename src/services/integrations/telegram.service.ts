import { ApiService } from '../base/api.service';

interface TelegramConfig {
  botToken: string;
  apiBaseUrl: string;
}

class TelegramService extends ApiService {
  constructor(config: TelegramConfig) {
    super(config.apiBaseUrl);
    this.botToken = config.botToken;
  }

  private botToken: string;

  async sendMessage(chatId: string, text: string): Promise<void> {
    await this.post('/sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'HTML'
    });
  }

  async sendPhoto(chatId: string, photoUrl: string, caption?: string): Promise<void> {
    await this.post('/sendPhoto', {
      chat_id: chatId,
      photo: photoUrl,
      caption,
      parse_mode: 'HTML'
    });
  }

  async sendDocument(chatId: string, documentUrl: string, caption?: string): Promise<void> {
    await this.post('/sendDocument', {
      chat_id: chatId,
      document: documentUrl,
      caption,
      parse_mode: 'HTML'
    });
  }
}

// Khởi tạo service với config từ environment
export const telegramService = new TelegramService({
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  apiBaseUrl: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`
}); 