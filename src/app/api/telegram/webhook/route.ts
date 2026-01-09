
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Scam from '@/lib/models/Scam'
import crypto from 'crypto'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`

async function sendMessage(chatId: number, text: string, parseMode: string = 'HTML') {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: parseMode
        })
    })
}

// ... imports
export const maxDuration = 10; // Allow function to run up to 10s (Vercel limit for free)

export async function POST(req: NextRequest) {
    console.log('🤖 Telegram Webhook received request')

    if (!BOT_TOKEN) {
        console.error('❌ BOT_TOKEN is missing')
        return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 })
    }

    try {
        const update = await req.json()
        console.log('📦 Update:', JSON.stringify(update).substring(0, 100))
        // ...

        // Handle only messages
        if (!update.message || !update.message.text) {
            return NextResponse.json({ ok: true })
        }

        const msg = update.message
        const chatId = msg.chat.id
        const text = msg.text.trim()
        const from = msg.from

        await connectDB()

        // 1. Auto-register or get User
        let user = await User.findOne({ telegramId: from.id })
        if (!user) {
            user = await User.create({
                telegramId: from.id,
                name: from.first_name + (from.last_name ? ' ' + from.last_name : ''),
                role: 'user',
                points: 0,
                rank: 'Новичок',
                reportsCount: 0
            })
            await sendMessage(chatId, `🎉 <b>Добро пожаловать, ${user.name}!</b>\nВы успешно зарегистрированы в ScammerKetKz.\nТеперь вы можете проверять номера и получать очки рейтинга.`)
        }

        // 2. Commands Handling
        if (text === '/start') {
            await sendMessage(chatId,
                `🛡 <b>ScammerKetKz Bot</b>\n\n` +
                `Я — ваша защита от нежелательных звонков. Единая база данных с сайтом.\n\n` +
                `🔍 <b>Как проверить номер?</b>\n` +
                `Просто отправьте мне номер телефона или имя компании.\n\n` +
                `📊 <b>Команды:</b>\n` +
                `/stats - Статистика базы\n` +
                `/me - Мой профиль\n` +
                `/report - Сообщить о нарушении (ссылка на сайт)`
            )
            return NextResponse.json({ ok: true })
        }

        if (text === '/stats') {
            const stats = {
                scams: await Scam.countDocuments(),
                users: await User.countDocuments()
            }
            await sendMessage(chatId,
                `📊 <b>Статистика платформы:</b>\n\n` +
                `📁 Всего записей: <b>${stats.scams}</b>\n` +
                `👥 Пользователей: <b>${stats.users}</b>\n` +
                `✅ Верифицировано: <b>${await Scam.countDocuments({ isVerified: true })}</b>`
            )
            return NextResponse.json({ ok: true })
        }

        if (text === '/me') {
            await sendMessage(chatId,
                `👤 <b>Ваш профиль:</b>\n\n` +
                `🏷 Имя: ${user.name}\n` +
                `🏆 Ранг: <b>${user.rank}</b>\n` +
                `💎 Очки: <b>${user.points}</b>\n` +
                `📄 Отчетов: ${user.reportsCount}`
            )
            return NextResponse.json({ ok: true })
        }

        if (text === '/report') {
            await sendMessage(chatId, `📝 Чтобы добавить отчет, пожалуйста, воспользуйтесь нашим сайтом (это удобнее!):\n\n<a href="https://scammerket-j52f43cbr-alexanders-projects-4dc0852f.vercel.app/?view=report">Перейти к форме отчета</a>`)
            return NextResponse.json({ ok: true })
        }

        // 3. Search Logic (Default)
        // Check if it looks like a global search query
        const searchQuery = text
        let searchCriteria = {}

        // Is it phone?
        const isPhone = text.replace(/\D/g, '').length >= 10

        if (isPhone) {
            const normalizedPhone = text.replace(/\D/g, '')
            const phoneHash = crypto.createHash('sha256').update(normalizedPhone).digest('hex')
            searchCriteria = { phoneHash }
        } else {
            searchCriteria = {
                company: { $regex: searchQuery, $options: 'i' }
            }
        }

        const results = await Scam.find(searchCriteria).limit(5)

        if (results.length === 0) {
            await sendMessage(chatId, `✅ <b>Чисто!</b>\nПо запросу "${text}" ничего не найдено в базе.\n\nНо будьте бдительны! Если вас пытаются обмануть — отправьте /report.`)
        } else {
            let response = `⚠️ <b>Осторожно! Найдено совпадений: ${results.length}</b>\n\n`
            results.forEach((scam, index) => {
                response += `🔴 <b>${index + 1}. ${scam.company || 'Неизвестная компания'}</b>\n`
                response += `📞 ${scam.phoneNumber}\n`
                response += `💬 ${scam.description.substring(0, 100)}${scam.description.length > 100 ? '...' : ''}\n`
                response += `👎 Жалоб: ${scam.dislikes + scam.likes} (Рейтинг: ${scam.likes > scam.dislikes ? 'Доверие' : 'Недоверие'})\n\n`
            })
            await sendMessage(chatId, response)
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Telegram Webhook Error:', error)
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
