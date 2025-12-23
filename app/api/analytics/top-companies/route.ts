import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Scam from '@/lib/models/Scam'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB()

    // Return mock data if no real database connection
    if (!db || !(db as any).connection?.readyState || (db as any).connection?.readyState !== 1) {
      return NextResponse.json({
        topCompanies: [
          { company: 'Kaspi Bank', totalReports: 25, verifiedReports: 20, avgLikes: 8.5, avgDislikes: 2.1, verificationRate: 80 },
          { company: 'Halyk Bank', totalReports: 18, verifiedReports: 14, avgLikes: 7.2, avgDislikes: 1.8, verificationRate: 77.8 },
          { company: 'Freedom Finance', totalReports: 12, verifiedReports: 9, avgLikes: 6.8, avgDislikes: 1.5, verificationRate: 75 }
        ],
        totalStats: {
          totalScams: 150,
          totalVerified: 120,
          verificationRate: 80,
          totalVotes: 500
        }
      })
    }

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

    // Return mock data during build time or when database is not available
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json({
        topCompanies: [
          { company: 'Kaspi Bank', totalReports: 25, verifiedReports: 20, avgLikes: 8.5, avgDislikes: 2.1, verificationRate: 80 },
          { company: 'Halyk Bank', totalReports: 18, verifiedReports: 14, avgLikes: 7.2, avgDislikes: 1.8, verificationRate: 77.8 },
          { company: 'Freedom Finance', totalReports: 12, verifiedReports: 9, avgLikes: 6.8, avgDislikes: 1.5, verificationRate: 75 }
        ],
        totalStats: {
          totalScams: 150,
          totalVerified: 120,
          verificationRate: 80,
          totalVotes: 500
        }
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}


