import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Scam from '@/lib/models/Scam'
import blacklist from '@/lib/blacklist.json'
// import User from '@/lib/models/User'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        await connectDB()

        // In real world, check if admin
        // const session = await getServerSession(authOptions)
        // if (session?.user?.email !== 'admin@scammerket.kz') return 403...

        const results = []

        // 1. Process local blacklist (simulating parsing from file/web)
        for (const item of blacklist) {
            const exists = await Scam.findOne({ phoneNumber: item.phone })

            if (!exists) {
                await Scam.create({
                    phoneNumber: item.phone,
                    company: item.name,
                    scamType: item.type === 'Финпирамида' ? 'pyramid' : 'other',
                    description: `Официально внесен в черный список. Источник: ${item.source}. Статус: ${item.status}`,
                    likes: 100, // Высокий рейтинг подтверждения
                    dislikes: 0,
                    region: 'KZ',
                    gender: 'unknown',
                    tags: ['official_blacklist', 'parsed']
                })
                results.push(`Added ${item.name} (${item.phone})`)
            } else {
                results.push(`Skipped ${item.name} (exists)`)
            }
        }

        return NextResponse.json({
            success: true,
            message: `Parsing complete. Processed ${blacklist.length} items.`,
            logs: results
        })

    } catch (error) {
        console.error('Parse Error:', error)
        return NextResponse.json({ error: 'Parse failed' }, { status: 500 })
    }
}
