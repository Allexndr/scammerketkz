import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'

    // Calculate date filter
    let dateFilter = {}
    if (filter === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      dateFilter = { createdAt: { $gte: weekAgo } }
    } else if (filter === 'month') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      dateFilter = { createdAt: { $gte: monthAgo } }
    }

    // Fetch users with ranking
    const users = await User.find(dateFilter)
      .select('username points status scamsReported scamsVerified')
      .sort({ points: -1 })
      .limit(100)
      .lean()

    // Add rank
    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: index + 1,
      id: user._id.toString(),
    }))

    return NextResponse.json(rankedUsers)
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
