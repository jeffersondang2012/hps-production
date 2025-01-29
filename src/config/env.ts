export const env = {
  // ... các config khác
  zalo: {
    oaId: process.env.ZALO_OA_ID,
    accessToken: process.env.ZALO_ACCESS_TOKEN,
    secretKey: process.env.ZALO_SECRET_KEY
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN
  }
}; 