import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Scam from '@/lib/models/Scam'
import User from '@/lib/models/User'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { id } = params
    const body = await request.json()
    const { type } = body

    if (!['like', 'dislike'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      )
    }

    const scam = await Scam.findById(id)
    if (!scam) {
      return NextResponse.json(
        { error: 'Scam not found' },
        { status: 404 }
      )
    }

    // Simple increment for MVP/Vibe Coding
    // Ideally we check if user voted
    if (type === 'like') {
      scam.likes += 1
    } else {
      scam.dislikes += 1
    }

    // Auto-verify logic (TK: >70% likes)
    const totalVotes = scam.likes + scam.dislikes
    if (totalVotes > 0) {
      const positiveRate = scam.likes / totalVotes
      scam.isVerified = positiveRate >= 0.7 && totalVotes >= 3 // Min 3 votes
    }

    await scam.save()

    return NextResponse.json({
      message: 'Vote recorded',
      likes: scam.likes,
      dislikes: scam.dislikes,
      isVerified: scam.isVerified
    })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: 'Failed to vote' },
      { status: 500 }
    )
  }
}
