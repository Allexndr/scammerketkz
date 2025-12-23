import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Scam from '@/lib/models/Scam'
import User from '@/lib/models/User'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const body = await request.json()
    const { voteType } = body // 'like' or 'dislike'

    if (!['like', 'dislike'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      )
    }

    // For demo purposes, create or find a default user
    let user = await User.findOne({ email: 'demo@scammerketkz.kz' })
    if (!user) {
      user = new User({
        email: 'demo@scammerketkz.kz',
        name: 'Demo User',
        points: 0,
        rank: 'Новичок'
      })
      await user.save()
    }

    const { id } = await params
    const scam = await Scam.findById(id)

    if (!scam) {
      return NextResponse.json(
        { error: 'Scam not found' },
        { status: 404 }
      )
    }

    // Check if user already voted
    if (scam.voters.includes(user._id)) {
      return NextResponse.json(
        { error: 'You have already voted on this report' },
        { status: 409 }
      )
    }

    // Update vote counts
    if (voteType === 'like') {
      scam.likes += 1
    } else {
      scam.dislikes += 1
    }

    scam.voters.push(user._id)

    // Award points for voting (+5 points)
    user.points += 5

    await Promise.all([scam.save(), user.save()])

    return NextResponse.json({
      message: 'Vote recorded successfully',
      likes: scam.likes,
      dislikes: scam.dislikes,
      isVerified: scam.isVerified
    })
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    )
  }
}


