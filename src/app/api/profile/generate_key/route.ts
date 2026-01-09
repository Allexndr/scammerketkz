import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await User.findOne({ email: session.user.email })
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        // Security Audit: Rate Limit Key Gen
        const lastKey = user.apiKeys?.[user.apiKeys.length - 1]
        if (lastKey && (new Date().getTime() - new Date(lastKey.createdAt).getTime() < 60000)) {
            return NextResponse.json({ error: 'Please wait 1 minute before generating a new key.' }, { status: 429 })
        }

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
