import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Scam from '@/lib/models/Scam'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const WEB_APP_URL = 'https://scammerket.vercel.app' // Hardcoded for stability, or use process.env.NEXT_PUBLIC_URL

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
                // Upsert user
                await User.findOneAndUpdate(
                    { telegramId: user.id.toString() },
                    {
                        $set: {
                            name: [user.first_name, user.last_name].filter(Boolean).join(' '),
                            // Don't overwrite role or points if exists
                        },
                        $setOnInsert: {
                            role: 'user',
                            points: 0,
                            reportsCount: 0
                        }
                    },
                    { upsert: true, new: true }
                )

                await sendMessage(chatId, "👋 Добро пожаловать в ScammerKetKz!\n\nЭто полноценная платформа для проверки мошенников и AI-анализа.\n\nНажмите кнопку ниже, чтобы открыть приложение:", {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "📱 Открыть ScammerKet App", web_app: { url: WEB_APP_URL } }],
                            [{ text: "🌐 Перейти на сайт", url: WEB_APP_URL }]
                        ]
                    }
                })
                return NextResponse.json({ ok: true })
            }

            // 2. Fallback for text messages
            await sendMessage(chatId, "Используйте кнопку ниже, чтобы открыть полное приложение.", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📱 Открыть App", web_app: { url: WEB_APP_URL } }]
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
