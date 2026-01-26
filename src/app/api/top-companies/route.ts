import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Scam from '@/lib/models/Scam'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const db = await connectDB().catch(() => null)
        const dbConnected = db && (db as any).connection?.readyState === 1

        if (!dbConnected) {
            return NextResponse.json([])
        }

        // Aggregate top companies from DB
        const topCompanies = await Scam.aggregate([
            {
                $group: {
                    _id: "$company",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ])

        const companiesWithRisk = topCompanies.map(c => {
            let risk = 'Низкий'
            if (c.count >= 10) risk = 'Критический'
            else if (c.count >= 5) risk = 'Высокий'
            else if (c.count >= 2) risk = 'Средний'

            return {
                company: c._id,
                count: c.count,
                risk: risk
            }
        })

        return NextResponse.json(companiesWithRisk)
    } catch (error) {
        console.error('Error fetching top companies:', error)
        return NextResponse.json({ error: 'Failed to fetch top companies' }, { status: 500 })
    }
}
