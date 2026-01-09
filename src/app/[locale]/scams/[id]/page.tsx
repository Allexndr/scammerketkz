'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ThumbsUp, ThumbsDown, User, Shield, AlertTriangle, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import AdSpace from '@/components/AdSpace'
import CommentsSection from '@/components/CommentsSection'

export const dynamic = 'force-dynamic'

interface ScamDetails {
    _id: string
    phoneNumber: string
    company: string
    scamType: string
    region: string
    description: string
    likes: number
    dislikes: number
    isVerified: boolean
    createdAt: string
    reportedBy: { name: string; rank: string }
    comments: any[]
    gender?: string
}

export default function ScamDetailsPage() {
    const { id } = useParams()
    const [scam, setScam] = useState<ScamDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (id) fetchScamDetails()
    }, [id])

    const fetchScamDetails = async () => {
        try {
            const res = await fetch(`/api/scams/${id}`)
            if (!res.ok) throw new Error('Failed to load')
            const data = await res.json()
            setScam(data)
        } catch (err) {
            setError('Отчет не найден или удален')
        } finally {
            setLoading(false)
        }
    }

    const handleVote = async (type: 'like' | 'dislike') => {
        try {
            const res = await fetch(`/api/scams/${id}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            })
            if (res.ok) {
                const data = await res.json()
                setScam(prev => prev ? {
                    ...prev,
                    likes: data.likes,
                    dislikes: data.dislikes,
                    isVerified: data.isVerified
                } : null)
            }
        } catch (err) {
            console.error('Vote failed', err)
        }
    }

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Загрузка...</div>

    if (error || !scam) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Ошибка'}</h1>
            <Link href="/scams" className="text-blue-600 hover:underline">Вернуться к списку</Link>
        </div>
    )

    const verificationRate = scam.likes + scam.dislikes > 0
        ? Math.round((scam.likes / (scam.likes + scam.dislikes)) * 100)
        : 0

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/scams" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft size={20} className="mr-2" />
                    Назад к списку
                </Link>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{scam.company}</h1>
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-mono bg-gray-200 px-3 py-1 rounded text-gray-800">
                                        {scam.phoneNumber}
                                    </span>
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {scam.scamType}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <div className={`px-4 py-2 rounded-lg text-lg font-bold mb-2 ${verificationRate >= 70 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {verificationRate}% Индекс риска
                                </div>
                                <div className="text-sm text-gray-500">
                                    {scam.likes} подтверждений / {scam.dislikes} опровержений
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 md:p-8">
                        <div className="prose max-w-none text-gray-700 text-lg leading-relaxed mb-8">
                            {scam.description}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
                            <div>
                                <strong className="block text-gray-900 mb-1">Регион</strong>
                                {scam.region}
                            </div>
                            <div>
                                <strong className="block text-gray-900 mb-1">Пол звонившего</strong>
                                {scam.gender === 'male' ? 'Мужской' : scam.gender === 'female' ? 'Женский' : 'Неизвестно'}
                            </div>
                            <div>
                                <strong className="block text-gray-900 mb-1">Добавлено</strong>
                                {format(new Date(scam.createdAt), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-gray-100">
                            <button
                                onClick={() => handleVote('like')}
                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium border border-red-200"
                            >
                                <ThumbsUp size={20} />
                                Подозрительный ({scam.likes})
                            </button>
                            <button
                                onClick={() => handleVote('dislike')}
                                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium border border-green-200"
                            >
                                <ThumbsDown size={20} />
                                Это ошибка ({scam.dislikes})
                            </button>
                        </div>
                    </div>

                    {/* Footer / User Info */}
                    <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <User size={16} />
                            Автор: <span className="font-medium text-gray-900">{scam.reportedBy?.name || 'Аноним'}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-blue-600">{scam.reportedBy?.rank || 'Новичок'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                            <Shield size={14} className="text-green-500" />
                            <span>ID: {scam._id.slice(-6)}</span>
                        </div>
                    </div>
                </div>

                <AdSpace type="native" className="my-8" />

                {/* Comments Section */}
                <div className="mt-8">
                    <CommentsSection scamId={scam._id} />
                </div>
            </div>
        </div>
    )
}
