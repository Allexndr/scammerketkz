import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Comment from '@/lib/models/Comment'
import Scam from '@/lib/models/Scam'
// import { v4 as uuidv4 } from 'uuid'

export const dynamic = 'force-dynamic'

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB()
        const comments = await Comment.find({ scamId: params.id })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean()

        return NextResponse.json(comments)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB()
        const body = await req.json()
        const { userId, userName, text } = body

        if (!userId || !text) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        const newComment = await Comment.create({
            scamId: params.id,
            userId, // Assuming valid ObjectId or string passed from client context
            userName: userName || 'Аноним',
            text
        })

        // Link back to Scam
        await Scam.findByIdAndUpdate(params.id, {
            $push: { comments: newComment._id }
        })

        return NextResponse.json(newComment)
    } catch (error) {
        console.error('Comment Error:', error)
        return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
    }
}
