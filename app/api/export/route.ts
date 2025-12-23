import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Scam from '@/lib/models/Scam'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB()

    // Return mock response if no real database connection
    if (!db || !(db as any).connection?.readyState || (db as any).connection?.readyState !== 1) {
      return NextResponse.json([])
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'
    const type = searchParams.get('type') || 'all' // 'all', 'verified', 'company'
    const company = searchParams.get('company')

    let query = {}
    if (type === 'verified') {
      query = { isVerified: true }
    } else if (type === 'company' && company) {
      query = { company: { $regex: company, $options: 'i' } }
    }

    const scams = await Scam.find(query)
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 })

    // Transform data for export (with full phone numbers for authorized use)
    const exportData = scams.map(scam => ({
      id: scam._id,
      phoneNumber: scam.phoneNumber,
      gender: scam.gender,
      company: scam.company,
      scamType: scam.scamType,
      region: scam.region,
      description: scam.description,
      likes: scam.likes,
      dislikes: scam.dislikes,
      isVerified: scam.isVerified,
      reportedBy: scam.reportedBy?.name || 'Anonymous',
      createdAt: scam.createdAt,
      totalVotes: scam.likes + scam.dislikes
    }))

    if (format === 'csv') {
      const csvHeaders = [
        'ID',
        'Номер телефона',
        'Пол',
        'Компания',
        'Тип мошенничества',
        'Регион',
        'Описание',
        'Лайки',
        'Дизлайки',
        'Верифицировано',
        'Сообщил',
        'Дата создания',
        'Всего голосов'
      ]

      const csvRows = exportData.map(row => [
        row.id,
        row.phoneNumber,
        row.gender === 'male' ? 'Мужской' : row.gender === 'female' ? 'Женский' : 'Неизвестно',
        row.company,
        row.scamType === 'phishing' ? 'Фишинг' :
        row.scamType === 'fake_sale' ? 'Фейковая продажа' :
        row.scamType === 'crypto' ? 'Крипто-мошенничество' : 'Другое',
        row.region,
        `"${row.description.replace(/"/g, '""')}"`,
        row.likes,
        row.dislikes,
        row.isVerified ? 'Да' : 'Нет',
        row.reportedBy,
        row.createdAt.toISOString(),
        row.totalVotes
      ])

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => String(field)).join(','))
        .join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="scams_export.csv"'
        }
      })
    }

    if (format === 'json') {
      return NextResponse.json({
        disclaimer: 'Эти данные предоставлены пользователями платформы AntiScamKZ. Мы не несем ответственности за их достоверность.',
        exportedAt: new Date().toISOString(),
        totalRecords: exportData.length,
        data: exportData
      })
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 })
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}


