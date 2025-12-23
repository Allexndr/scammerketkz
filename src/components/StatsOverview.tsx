'use client'

import { useEffect, useState } from 'react'
import { Users, FileText, CheckCircle, ThumbsUp } from 'lucide-react'

interface StatsData {
  totalScams: number
  totalVerified: number
  verificationRate: number
  totalVotes: number
}

export default function StatsOverview() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/analytics/top-companies')
        if (response.ok) {
          const data = await response.json()
          setStats(data.totalStats)
        } else {
          // Пока нет данных, показываем пустые значения
          setStats({
            totalScams: 0,
            totalVerified: 0,
            verificationRate: 0,
            totalVotes: 0
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats({
          totalScams: 0,
          totalVerified: 0,
          verificationRate: 0,
          totalVotes: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      icon: FileText,
      label: 'Всего сообщений',
      value: stats.totalScams,
      color: 'text-blue-600'
    },
    {
      icon: CheckCircle,
      label: 'Верифицировано',
      value: `${stats.verificationRate}%`,
      color: 'text-green-600'
    },
    {
      icon: ThumbsUp,
      label: 'Всего голосов',
      value: stats.totalVotes,
      color: 'text-purple-600'
    },
    {
      icon: Users,
      label: 'Активных пользователей',
      value: '~' + Math.floor(stats.totalScams / 3), // Rough estimate
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${stat.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">{stat.value}</div>
              <div className="text-sm text-gray-600 truncate">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
