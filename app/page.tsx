import { Suspense } from 'react'
import SearchForm from '@/components/SearchForm'
import TopCompanies from '@/components/TopCompanies'
import StatsOverview from '@/components/StatsOverview'
import Disclaimer from '@/components/Disclaimer'

function HomeContent() {
  return (
    <>
      {/* Header */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ScammerKetKz
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Платформа против мошенничества в Казахстане
        </p>
        <div className="mt-4 flex justify-center">
          <div className="bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm text-blue-800">
            🛡️ Защищаем вместе • Проверено сообществом • Бесплатно
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <Disclaimer />

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          🔍 Проверить номер телефона
        </h2>
        <SearchForm />
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">📊 Статистика платформы</h2>
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-pulse">
                <div className="h-8 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        }>
          <StatsOverview />
        </Suspense>
      </div>

      {/* Top Companies */}
      <div className="mb-8">
        <Suspense fallback={
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        }>
          <TopCompanies />
        </Suspense>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">🚀 Быстрые действия</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/report"
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            📝 Сообщить о мошеннике
          </a>
          <a
            href="/scams"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            📋 Все сообщения
          </a>
          <a
            href="/leaderboard"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1"
          >
            🏆 Рейтинг пользователей
          </a>
        </div>
      </div>
    </>
  )
}

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ScammerKetKz
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Платформа против мошенничества в Казахстане
          </p>
          <div className="mt-4 flex justify-center">
            <div className="bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm text-blue-800">
              🛡️ Защищаем вместе • Проверено сообществом • Бесплатно
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <Disclaimer />

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            🔍 Проверить номер телефона
          </h2>
          <SearchForm />
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">📊 Статистика платформы</h2>
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="h-8 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          }>
            <StatsOverview />
          </Suspense>
        </div>

        {/* Top Companies */}
        <div className="mb-8">
          <Suspense fallback={
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <TopCompanies />
          </Suspense>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">🚀 Быстрые действия</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/report"
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              📝 Сообщить о мошеннике
            </a>
            <a
              href="/scams"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              📋 Все сообщения
            </a>
            <a
              href="/leaderboard"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1"
            >
              🏆 Рейтинг пользователей
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
