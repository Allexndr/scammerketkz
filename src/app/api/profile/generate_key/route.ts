import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()

        // Generate a random key like sk_live_...
        const randomPart = crypto.randomBytes(24).toString('hex')
        const apiKey = `sk_live_${randomPart}`

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                $push: {
                    apiKeys: {
                        key: apiKey,
                        name: 'API Key ' + new Date().toLocaleDateString(),
                        createdAt: new Date(),
                        isActive: true
                    }
                }
            },
            { new: true }
        )

        return NextResponse.json({ key: apiKey, keys: updatedUser.apiKeys })

    } catch (error) {
        console.error('Key Generation Error:', error)
        return NextResponse.json({ error: 'Failed to generate key' }, { status: 500 })
    }
}
