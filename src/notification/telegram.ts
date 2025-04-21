import axios from "axios";

// Get environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Telegram API URL
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

export class TelegramNotifier {
  constructor(private readonly chatId?: string) {
    if (!chatId) {
      throw new Error("Telegram chat ID is not set");
    }
  }

  async sendMessage(message: string) {
    const response = await axios.post(TELEGRAM_API, {
      chat_id: this.chatId,
      text: message,
    });

    if (response.status !== 200) {
      throw new Error("Failed to send message to Telegram");
    }
  }
}

const notifier = new TelegramNotifier(TELEGRAM_CHAT_ID);

export default notifier;
