import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Scam from '@/lib/models/Scam'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const WEB_APP_URL = 'https://scammerket.vercel.app'

export const dynamic = 'force-dynamic'

// --- TEXTS ---
const TXT = {
    start: {
        ru: "👋 <b>Добро пожаловать в ScammerKet!</b>\n\nЯ помогу проверить номер телефона или сообщение на мошенничество.\n\nКак вам удобнее пользоваться?",
        kz: "👋 <b>ScammerKet-ке қош келдіңіз!</b>\n\nМен сізге телефон нөмірін немесе хабарламаны алаяқтыққа тексеруге көмектесемін.\n\nСізге қалай ыңғайлы?"
    },
    menu: {
        ru: "<b>💬 Текстовый режим</b>\n\nОтправьте мне <b>номер телефона</b> (например: +77771234567) или выберите действие в меню ниже:",
        kz: "<b>💬 Мәтіндік режим</b>\n\nМаған <b>телефон нөмірін</b> жіберіңіз (мысалы: +77771234567) немесе төмендегі мәзірден әрекетті таңдаңыз:"
    },
    profile: (name: string, reports: number, points: number) => `👤 <b>Профиль / Профиль</b>\n\nИмя: ${name}\n📊 Репортов: ${reports}\n💎 Очков: ${points}\n\nВаш вклад делает Казахстан безопаснее!`,
    check_instruction: "🔍 <b>Проверка / Тексеру</b>\n\nПросто отправьте номер телефона в чат.\nЛюбой формат: +7701..., 8701..., 701...\n\nЖай ғана телефон нөмірін чатқа жіберіңіз.",
    unknown: "⚠️ Я не понял команду.\nОтправьте номер телефона для проверки или используйте меню.",
    clean: (phone: string) => `✅ <b>Чисто / Таза</b>\nНомер: ${phone}\n\nВ нашей базе жалоб нет. Но будьте бдительны!`,
    scam: (phone: string, company: string, type: string) => `🚫 <b>ВНИМАНИЕ / НАЗАР АУДАРЫҢЫЗ!</b>\n\nНомер: ${phone}\nОрганизация: <b>${company}</b>\nТип: ${type}\n\n⚠️ Есть жалобы от пользователей!`,
    btns: {
        webapp: "📱 Web App (Визуально)",
        textmode: "💬 Чат-бот (Текст)",
        check: "🔍 Проверить номер",
        profile: "👤 Мой профиль",
        report: "📝 Сообщить о спаме",
        ai: "🤖 AI Проверка текста"
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        await connectDB()

        // 1. Handle Callback Query (Button Clicks)
        if (body.callback_query) {
            const chatId = body.callback_query.message.chat.id
            const data = body.callback_query.data

            if (data === 'mode_text') {
                await sendMainMenu(chatId)
            }
            // Answer callback to verify interaction
            await answerCallback(body.callback_query.id)
            return NextResponse.json({ ok: true })
        }

        // 2. Handle Message
        if (body.message) {
            const chatId = body.message.chat.id
            const text = body.message.text
            const user = body.message.from

            // --- /start ---
            if (text === '/start') {
                // Upsert User
                await User.findOneAndUpdate(
                    { telegramId: user.id.toString() },
                    {
                        $set: {
                            name: [user.first_name, user.last_name].filter(Boolean).join(' '),
                            username: user.username
                        },
                        $setOnInsert: { role: 'user', points: 0, reportsCount: 0 }
                    },
                    { upsert: true, new: true }
                )

                await sendMessage(chatId, `${TXT.start.ru}\n\n${TXT.start.kz}`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: TXT.btns.webapp, web_app: { url: WEB_APP_URL } }],
                            [{ text: TXT.btns.textmode, callback_data: 'mode_text' }]
                        ]
                    }
                })
                return NextResponse.json({ ok: true })
            }

            // --- Main Menu Commands ---
            if (text === TXT.btns.profile) {
                const dbUser = await User.findOne({ telegramId: user.id.toString() })
                await sendMessage(chatId, TXT.profile(dbUser?.name || 'User', dbUser?.reportsCount || 0, dbUser?.points || 0))
                return NextResponse.json({ ok: true })
            }

            if (text === TXT.btns.check) {
                await sendMessage(chatId, TXT.check_instruction)
                return NextResponse.json({ ok: true })
            }

            if (text === TXT.btns.report) {
                await sendMessage(chatId, "📝 Чтобы сообщить о мошеннике, лучше использовать <b>Web App</b> для точности.\n\nНо вы можете просто переслать сообщение мошенника сюда, и наш AI (скоро) его проанализирует.", {
                    reply_markup: {
                        inline_keyboard: [[{ text: "📱 Открыть форму репорта", web_app: { url: WEB_APP_URL + '?view=report' } }]]
                    }
                })
                return NextResponse.json({ ok: true })
            }

            // --- Phone Number Check (Auto-detect) ---
            // Regex for KZ/RU phones: matches +7, 8, 7 starting numbers
            const cleanText = text?.replace(/\D/g, '') || ''
            if (cleanText.length >= 10 && (cleanText.startsWith('7') || cleanText.startsWith('8'))) {
                // Normalize to 7...
                const normalized = '7' + cleanText.slice(-10)
                // Also try to find strictly by input or +input
                const scam = await Scam.findOne({
                    $or: [
                        { phoneNumber: text },
                        { phoneNumber: `+${cleanText}` },
                        { phoneNumber: cleanText } // raw
                    ]
                })

                if (scam) {
                    await sendMessage(chatId, TXT.scam(scam.phoneNumber, scam.company, scam.scamType))
                } else {
                    await sendMessage(chatId, TXT.clean(cleanText))
                }
                return NextResponse.json({ ok: true })
            }

            // Unknown command -> Show Menu again if text mode was active, otherwise default hint
            // Just send simple hint
            await sendMessage(chatId, TXT.unknown)
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Webhook Error:', error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }
}

// Helpers
async function sendMessage(chatId: number, text: string, extra: any = {}) {
    if (!BOT_TOKEN) return
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId, text, parse_mode: 'HTML', ...extra
            })
        })
    } catch (e) { console.error(e) }
}

async function sendMainMenu(chatId: number) {
    await sendMessage(chatId, TXT.menu.ru + '\n\n' + TXT.menu.kz, {
        reply_markup: {
            keyboard: [
                [{ text: TXT.btns.check }, { text: TXT.btns.profile }],
                [{ text: TXT.btns.report }, { text: TXT.btns.ai }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
    })
}

async function answerCallback(queryId: string) {
    if (!BOT_TOKEN) return
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: queryId })
    })
}
