import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Scam from '@/lib/models/Scam'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Aggregate users with their stats
    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: 'scams',
          localField: '_id',
          foreignField: 'reportedBy',
          as: 'reports'
        }
      },
      {
        $addFields: {
          reportsCount: { $size: '$reports' },
          votesCount: { $size: '$votes' }
        }
      },
      {
        $sort: { points: -1, reportsCount: -1, votesCount: -1 }
      },
      {
        $limit: 50
      },
      {
        $project: {
          _id: 1,
          name: 1,
          points: 1,
          rank: 1,
          reportsCount: 1,
          votesCount: 1,
          createdAt: 1
        }
      }
    ])

    return NextResponse.json({
      users: leaderboard,
      total: leaderboard.length
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

