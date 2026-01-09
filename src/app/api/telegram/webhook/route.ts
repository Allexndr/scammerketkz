import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Scam from '@/lib/models/Scam'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const WEB_APP_URL = 'https://scammerket.vercel.app'

export const dynamic = 'force-dynamic' // Ensure this runs dynamically

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Handle Telegram updates
        if (body.message) {
            const chatId = body.message.chat.id
            const text = body.message.text
            const user = body.message.from

            await connectDB()

            // 1. /start command -> Show Web App Button
            if (text === '/start') {
                // Upsert user to capture basic info
                await User.findOneAndUpdate(
                    { telegramId: user.id.toString() },
                    {
                        $set: {
                            name: [user.first_name, user.last_name].filter(Boolean).join(' '),
                        },
                        $setOnInsert: {
                            role: 'user',
                            points: 0,
                            reportsCount: 0
                        }
                    },
                    { upsert: true, new: true }
                )

                // Sending a photo with the welcome message makes it look "richer"
                // Using a placeholder image for now, or just text. Let's stick to text for speed.
                await sendMessage(chatId, `<b>👋 Добро пожаловать, ${user.first_name}!</b>\n\n🛡️ <b>ScammerKetKz</b> — это единая база мошенников Казахстана с AI-анализом.\n\n👇 <b>Нажмите большую кнопку ниже, чтобы начать проверку:</b>`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "🚀 Запустить ScammerKet", web_app: { url: WEB_APP_URL } }],
                            [{ text: "🌐 Наш официальный сайт", url: WEB_APP_URL }]
                        ]
                    }
                })
                return NextResponse.json({ ok: true })
            }

            // 2. Any other text
            await sendMessage(chatId, "⚠️ Бот работает только через <b>Web App</b>.\nНажмите кнопку <b>«Запустить»</b> ниже или в меню слева.", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📱 Открыть приложение", web_app: { url: WEB_APP_URL } }]
                    ]
                }
            })
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Webhook Error:', error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }
}

async function sendMessage(chatId: number, text: string, extra: any = {}) {
    if (!BOT_TOKEN) return

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            ...extra
        })
    })
}
