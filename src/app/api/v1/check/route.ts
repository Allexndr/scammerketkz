import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Scam from '@/lib/models/Scam'
import blacklist from '@/lib/blacklist.json'

// Force dynamic because we check DB
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        await connectDB()

        // 1. Auth Check
        const authHeader = req.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized', message: 'Missing API Key' }, { status: 401 })
        }

        const apiKey = authHeader.split(' ')[1]

        // Find user with this active API key
        const user = await User.findOne({
            'apiKeys': {
                $elemMatch: { key: apiKey, isActive: true }
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized', message: 'Invalid API Key' }, { status: 401 })
        }

        // Check Limits
        const keyData = user.apiKeys.find((k: any) => k.key === apiKey)
        if (keyData) {
            // limit -1 means infinite
            if (keyData.limit !== -1 && (keyData.usage || 0) >= keyData.limit) {
                return NextResponse.json({
                    error: 'Payment Required',
                    message: 'API Request Limit Reached (100/100). Upgrade plan at /business'
                }, { status: 403 })
            }
        }

        // Update usage stat (fire and forget)
        await User.updateOne(
            { _id: user._id, 'apiKeys.key': apiKey },
            {
                $set: { 'apiKeys.$.lastUsed': new Date() },
                $inc: { 'apiKeys.$.usage': 1 }
            }
        )

        // 2. Parse Input
        const body = await req.json()
        const { phone } = body

        if (!phone) {
            return NextResponse.json({ error: 'Bad Request', message: 'Phone number required' }, { status: 400 })
        }

        // Normalize phone (simple version)
        const cleanPhone = phone.replace(/\D/g, '')

        // 3. Check Blacklist (Official/Static)
        const blacklistMatch = blacklist.find(item => item.phone.replace(/\D/g, '').includes(cleanPhone))

        if (blacklistMatch) {
            return NextResponse.json({
                phone: phone,
                risk_score: 100,
                verdict: 'blacklist',
                source: blacklistMatch.source,
                details: {
                    name: blacklistMatch.name,
                    type: blacklistMatch.type,
                    status: blacklistMatch.status
                }
            })
        }

        // 4. Check Community Database (MongoDB)
        const scam = await Scam.findOne({
            phoneNumber: { $regex: cleanPhone }
        })

        if (scam) {
            const totalVotes = scam.likes + scam.dislikes
            const risk = totalVotes > 0 ? Math.round((scam.likes / totalVotes) * 100) : 50

            return NextResponse.json({
                phone: phone,
                risk_score: risk,
                verdict: risk > 70 ? 'high_risk' : 'suspicious',
                source: 'community_reports',
                details: {
                    reports_count: scam.likes,
                    company: scam.company,
                    last_updated: scam.updatedAt
                }
            })
        }

        // 5. Clean Result
        return NextResponse.json({
            phone: phone,
            risk_score: 0,
            verdict: 'clean',
            source: 'scammerket_db',
            message: 'No reports found'
        })

    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
