import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Scam from '@/lib/models/Scam'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get top 10 companies by number of reports
    const topCompanies = await Scam.aggregate([
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 },
          verifiedCount: {
            $sum: { $cond: ['$isVerified', 1, 0] }
          },
          avgLikes: { $avg: '$likes' },
          avgDislikes: { $avg: '$dislikes' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          company: '$_id',
          totalReports: '$count',
          verifiedReports: '$verifiedCount',
          avgLikes: { $round: ['$avgLikes', 1] },
          avgDislikes: { $round: ['$avgDislikes', 1] },
          verificationRate: {
            $round: [{ $multiply: [{ $divide: ['$verifiedCount', '$count'] }, 100] }, 1]
          }
        }
      }
    ])

    // Get total stats
    const totalStats = await Scam.aggregate([
      {
        $group: {
          _id: null,
          totalScams: { $sum: 1 },
          totalVerified: { $sum: { $cond: ['$isVerified', 1, 0] } },
          totalLikes: { $sum: '$likes' },
          totalDislikes: { $sum: '$dislikes' }
        }
      },
      {
        $project: {
          totalScams: 1,
          totalVerified: 1,
          verificationRate: {
            $round: [{ $multiply: [{ $divide: ['$totalVerified', '$totalScams'] }, 100] }, 1]
          },
          totalVotes: { $add: ['$totalLikes', '$totalDislikes'] }
        }
      }
    ])

    return NextResponse.json({
      topCompanies,
      totalStats: totalStats[0] || {
        totalScams: 0,
        totalVerified: 0,
        verificationRate: 0,
        totalVotes: 0
      }
    })
  } catch (error) {
    console.error('Error fetching top companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}


