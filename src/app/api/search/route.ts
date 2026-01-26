import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Scam from '@/lib/models/Scam'
import crypto from 'crypto'
import { sanitizeSearchQuery, sanitizePhone, sanitizeCompanyName, checkRateLimit, escapeRegex } from '@/lib/security'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Rate limiting: 30 requests per minute
    const rateCheck = checkRateLimit(`search-${clientIp}`, 30, 60000)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Remaining': '0'
          }
        }
      )
    }

    const { searchParams } = new URL(request.url)
    const rawQuery = searchParams.get('q')
    const rawType = searchParams.get('type')

    // Validate inputs
    if (!rawQuery || typeof rawQuery !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Sanitize inputs to prevent injection
    const query = sanitizeSearchQuery(rawQuery)
    const type = rawType === 'company' ? 'company' : 'phone' // Whitelist approach

    // Prevent empty queries after sanitization
    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Query too short or invalid' },
        { status: 400 }
      )
    }

    let results: any[] = []

    // Try to connect to database
    const db = await connectDB().catch(() => null)
    const dbConnected = db && (db as any).connection?.readyState === 1

    if (dbConnected) {
      try {
        let searchCriteria: any = {}

        if (type === 'phone') {
          // Sanitize phone before hashing
          const sanitizedPhone = sanitizePhone(query)
          const normalizedPhone = sanitizedPhone.replace(/\D/g, '')

          // Prevent DoS with extremely long inputs
          if (normalizedPhone.length > 20) {
            return NextResponse.json(
              { error: 'Invalid phone number' },
              { status: 400 }
            )
          }

          const phoneHash = crypto.createHash('sha256').update(normalizedPhone).digest('hex')
          searchCriteria = { phoneHash }
        } else if (type === 'company') {
          // Sanitize company name
          const sanitizedCompany = sanitizeCompanyName(query)

          // Escape regex special characters to prevent ReDoS
          const escapedQuery = escapeRegex(sanitizedCompany)

          searchCriteria = {
            company: {
              $regex: escapedQuery,
              $options: 'i'
            }
          }
        }

        // Limit results to prevent DoS
        const dbScams = await Scam.find(searchCriteria)
          .limit(20)
          .select('_id phoneNumber company description isVerified likes dislikes status createdAt')
          .lean() // Use lean() for better performance and security
          .exec()

        results = dbScams.map((s: any) => ({
          _id: s._id?.toString(),
          phoneNumber: String(s.phoneNumber || ''),
          company: sanitizeCompanyName(s.company || ''),
          description: String(s.description || '').substring(0, 500),
          isVerified: Boolean(s.isVerified),
          likes: Math.max(0, parseInt(s.likes || 0)),
          dislikes: Math.max(0, parseInt(s.dislikes || 0)),
          status: String(s.status || 'Pending'),
          createdAt: s.createdAt
        }))
      } catch (dbError) {
        console.error('Database query error:', dbError)
        // Don't expose internal errors to client
        // Continue with mock data only
      }
    }

    // Combine results
    const finalResults = results

    return NextResponse.json({
      results: finalResults.slice(0, 20), // Hard limit
      total: finalResults.length,
      rateLimitRemaining: rateCheck.remaining
    }, {
      headers: {
        'X-RateLimit-Remaining': String(rateCheck.remaining),
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    })
  } catch (error) {
    console.error('Error searching:', error)

    // Never expose internal error details
    return NextResponse.json(
      { error: 'An error occurred while searching' },
      { status: 500 }
    )
  }
}


