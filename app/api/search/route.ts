import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Scam from '@/lib/models/Scam'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') // 'phone' or 'company'

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    let searchCriteria = {}

    if (type === 'phone') {
      // Hash the phone number for search
      const phoneHash = crypto.createHash('sha256').update(query.replace(/\D/g, '')).digest('hex')
      searchCriteria = { phoneHash }
    } else if (type === 'company') {
      searchCriteria = { company: { $regex: query, $options: 'i' } }
    } else {
      // General search
      const phoneHash = crypto.createHash('sha256').update(query.replace(/\D/g, '')).digest('hex')
      searchCriteria = {
        $or: [
          { phoneHash },
          { company: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      }
    }

    const scams = await Scam.find(searchCriteria)
      .populate('reportedBy', 'name rank')
      .sort({ createdAt: -1 })
      .limit(50)

    // Transform data for privacy (show only last 4 digits of phone)
    const transformedScams = scams.map(scam => ({
      _id: scam._id,
      phoneNumber: scam.phoneNumber.replace(/(\d{0,7})\d{4}(\d*)/, '$1****$2'),
      gender: scam.gender,
      company: scam.company,
      scamType: scam.scamType,
      region: scam.region,
      description: scam.description,
      likes: scam.likes,
      dislikes: scam.dislikes,
      isVerified: scam.isVerified,
      verificationRate: scam.likes + scam.dislikes > 0
        ? Math.round((scam.likes / (scam.likes + scam.dislikes)) * 100)
        : 0,
      reportedBy: scam.reportedBy,
      createdAt: scam.createdAt,
      commentCount: scam.comments.length
    }))

    return NextResponse.json({
      results: transformedScams,
      total: transformedScams.length
    })
  } catch (error) {
    console.error('Error searching scams:', error)
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    )
  }
}


