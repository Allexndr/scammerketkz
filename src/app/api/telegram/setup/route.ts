import { NextRequest, NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const VERSEL_URL = 'https://scammerket.vercel.app' // Must be https

export async function GET(req: NextRequest) {
    if (!BOT_TOKEN) {
        return NextResponse.json({ error: 'No BOT_TOKEN found' })
    }

    const webhookUrl = `${VERSEL_URL}/api/telegram/webhook`

    try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${webhookUrl}`)
        const data = await res.json()

        return NextResponse.json({
            status: 'Setup attempted',
            telegram_response: data,
            webhook_url: webhookUrl
        })
    } catch (e) {
        return NextResponse.json({ error: 'Failed to set webhook', details: e })
    }
}
