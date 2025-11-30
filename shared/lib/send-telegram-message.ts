// shared/lib/send-telegram-message.ts
export async function sendTelegramMessage(message: string) {
    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
            console.warn('Telegram bot token or chat ID not configured');
            return null;
        }

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Telegram API error:', error);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        return null;
    }
}