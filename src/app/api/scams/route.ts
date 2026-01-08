import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Scam from '@/lib/models/Scam'
import User from '@/lib/models/User'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const db = await connectDB()

    // Return mock response if no real database connection
    if (!db || !(db as any).connection?.readyState || (db as any).connection?.readyState !== 1) {
      return NextResponse.json({
        _id: 'mock-id',
        phoneNumberHash: 'mock-hash',
        gender: 'unknown',
        company: 'Test Company',
        scamType: 'other',
        region: 'Test Region',
        description: 'Test description',
        likes: 0,
        dislikes: 0,
        reportedBy: 'mock-user',
        status: 'Низкая угроза',
        createdAt: new Date(),
        updatedAt: new Date()
      }, { status: 201 })
    }

    const body = await request.json()
    const {
      phoneNumber,
      gender = 'unknown',
      company,
      scamType = 'other',
      region = 'other',
      description
    } = body

    // Validate required fields
    if (!phoneNumber || !company || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Check if this phone number already exists
    const phoneHash = crypto.createHash('sha256').update(phoneNumber.replace(/\D/g, '')).digest('hex')
    const existingScam = await Scam.findOne({ phoneHash })

    if (existingScam) {
      return NextResponse.json(
        { error: 'This phone number has already been reported' },
        { status: 409 }
      )
    }

    // Create new scam report
    const scam = new Scam({
      phoneNumber: phoneNumber.replace(/\D/g, ''), // Store clean number
      phoneHash,
      gender,
      company: company.trim(),
      scamType,
      region,
      description: description.trim(),
      reportedBy: user._id
    })

    await scam.save()

    // Update user points (+10 for reporting)
    user.points += 10
    await user.save()

    return NextResponse.json({
      message: 'Scam report submitted successfully',
      scamId: scam._id
    })
  } catch (error) {
    console.error('Error creating scam report:', error)
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') === 'asc' ? 1 : -1

    const skip = (page - 1) * limit

    const scams = await Scam.find()
      .populate('reportedBy', 'name rank')
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)

    const total = await Scam.countDocuments()

    // Transform for privacy
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
      scams: transformedScams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching scams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scams' },
      { status: 500 }
    )
  }
}


