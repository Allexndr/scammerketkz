import { Suspense } from 'react'
import LeaderboardTable from '@/components/LeaderboardTable'

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏆 Рейтинг пользователей
          </h1>
          <p className="text-gray-600">
            Топ активных участников борьбы с мошенничеством
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-600">ℹ️</div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Как заработать очки?</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• +10 очков за внесение отчета о мошеннике</li>
                <li>• +5 очков за голосование за/против отчета</li>
                <li>• Бонусные очки за верифицированные отчеты</li>
              </ul>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="text-center py-8">Загрузка рейтинга...</div>}>
          <LeaderboardTable />
        </Suspense>
      </div>
    </div>
  )
}


