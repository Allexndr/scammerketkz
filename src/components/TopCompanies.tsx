'use client'

import { useEffect, useState } from 'react'
import { Trophy, TrendingUp } from 'lucide-react'

interface CompanyData {
  company: string
  totalReports: number
  verifiedReports: number
  avgLikes: number
  avgDislikes: number
  verificationRate: number
}

export default function TopCompanies() {
  const [companies, setCompanies] = useState<CompanyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTopCompanies() {
      try {
        const response = await fetch('/api/analytics/top-companies')
        const data = await response.json()
        setCompanies(data.topCompanies || [])
      } catch (error) {
        console.error('Error fetching top companies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopCompanies()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3 justify-center">
          <Trophy className="text-yellow-500 w-8 h-8" />
          Топ компаний-мошенников
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          Загрузка...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3 justify-center">
        <Trophy className="text-yellow-500 w-8 h-8" />
        Топ компаний-мошенников
      </h2>

      {companies.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Пока нет данных</h3>
          <p className="text-gray-600 mb-6">
            Будьте первым, кто сообщит о мошеннической компании!
          </p>
          <a
            href="/report"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            Сообщить о первой компании
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map((company, index) => (
            <div
              key={company.company}
              className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                  index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                  'bg-gradient-to-r from-blue-400 to-blue-500'
                }`}>
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 truncate text-lg">{company.company}</h3>
                  <div className="text-sm text-gray-600">
                    {company.totalReports} сообщений
                  </div>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <TrendingUp size={16} />
                  <span className="font-semibold text-lg">{company.verificationRate}%</span>
                  <span className="text-xs">верифицировано</span>
                </div>
                <div className="text-xs text-gray-500">
                  👍 {company.avgLikes.toFixed(1)} | 👎 {company.avgDislikes.toFixed(1)}
                </div>
              </div>

              {/* Mobile stats */}
              <div className="text-right sm:hidden">
                <div className="text-green-600 font-semibold">
                  {company.verificationRate}%
                </div>
                <div className="text-xs text-gray-500">
                  вериф.
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        </div>
        Рейтинг основан на количестве сообщений и степени верификации пользователями
      </div>
    </div>
  )
}
