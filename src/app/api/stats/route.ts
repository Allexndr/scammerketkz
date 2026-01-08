import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Scam from '@/lib/models/Scam'
import User from '@/lib/models/User'
import { MOCK_SCAMS } from '@/lib/mockScams'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const db = await connectDB().catch(() => null)
        const dbConnected = db && (db as any).connection?.readyState === 1

        if (!dbConnected) {
            // Fallback to mock data if DB not connected (dev mode without DB)
            return NextResponse.json({
                totalScams: MOCK_SCAMS.length,
                totalUsers: 0,
                totalCompanies: new Set(MOCK_SCAMS.map(s => s.company)).size,
                verifiedScams: MOCK_SCAMS.filter(s => s.isVerified).length
            })
        }

        // Fetch real data
        const totalScams = await Scam.countDocuments()
        const totalUsers = await User.countDocuments()

        // Accurate distinct count might be slow on large datasets, but fine for now
        const companies = await Scam.distinct('company')
        const totalCompanies = companies.length

        const verifiedScams = await Scam.countDocuments({ isVerified: true })

        return NextResponse.json({
            totalScams,
            totalUsers,
            totalCompanies,
            verifiedScams
        })
    } catch (error) {
        console.error('Error fetching stats:', error)
        return NextResponse.json({
            totalScams: 0,
            totalUsers: 0,
            totalCompanies: 0,
            verifiedScams: 0
        }, { status: 500 })
    }
}
