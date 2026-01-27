import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Scam from '@/lib/models/Scam'
import User from '@/lib/models/User' // Ensure User is registered
import Comment from '@/lib/models/Comment' // Ensure Comment is registered

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB()

        // Force model registration (prevent tree-shaking)
        const _models = { User, Comment }

        const { id } = await params

        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json(
                { error: 'Invalid ID format' },
                { status: 400 }
            )
        }

        const scam = await Scam.findById(id)
            .populate('reportedBy', 'name rank')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'name rank' },
                options: { sort: { createdAt: -1 } }
            })

        if (!scam) {
            return NextResponse.json(
                { error: 'Scam report not found' },
                { status: 404 }
            )
        }

        // Transform for response
        const transformedScam = {
            _id: scam._id,
            phoneNumber: scam.phoneNumber.replace(/(\d{0,7})\d{4}(\d*)/, '$1****$2'), // Masked
            fullPhoneNumber: scam.phoneNumber, // Only if authorized? For now publicly available based on TK "users verify"
            gender: scam.gender,
            company: scam.company,
            scamType: scam.scamType,
            region: scam.region,
            description: scam.description,
            likes: scam.likes,
            dislikes: scam.dislikes,
            isVerified: scam.isVerified,
            reportedBy: scam.reportedBy,
            createdAt: scam.createdAt,
            comments: scam.comments
        }

        return NextResponse.json(transformedScam)
    } catch (error) {
        console.error('Error fetching scam details:', error)
        return NextResponse.json(
            { error: 'Failed to fetch scam details', details: String(error) },
            { status: 500 }
        )
    }
}
