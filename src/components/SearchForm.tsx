'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface SearchResult {
  _id: string
  phoneNumber: string
  gender: string
  company: string
  scamType: string
  region: string
  description: string
  likes: number
  dislikes: number
  isVerified: boolean
  verificationRate: number
  reportedBy: { name: string; rank: string }
  createdAt: string
  commentCount: number
}

export default function SearchForm() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data.results || [])
      setSearched(true)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите номер телефона или название компании..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Search size={20} />
          {loading ? 'Поиск...' : 'Найти'}
        </button>
      </form>

      {searched && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {loading ? 'Ищем...' : 'Ничего не найдено'}
            </div>
          ) : (
            results.map((result) => (
              <div key={result._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold text-lg">{result.phoneNumber}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      result.isVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.isVerified ? 'Верифицировано' : 'Не проверено'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-2 text-sm">
                      <span className="text-green-600">👍 {result.likes}</span>
                      <span className="text-red-600">👎 {result.dislikes}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.verificationRate}% подтверждений
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 text-sm">
                  <div><strong>Компания:</strong> {result.company}</div>
                  <div><strong>Тип:</strong> {result.scamType === 'phishing' ? 'Фишинг' :
                    result.scamType === 'fake_sale' ? 'Фейковая продажа' :
                    result.scamType === 'crypto' ? 'Крипто' : 'Другое'}</div>
                  <div><strong>Регион:</strong> {result.region}</div>
                  <div><strong>Сообщил:</strong> {result.reportedBy?.name || 'Anonymous'}</div>
                </div>

                <p className="text-gray-700 mb-2">{result.description}</p>

                <div className="text-xs text-gray-500">
                  {new Date(result.createdAt).toLocaleDateString('ru-RU')}
                  {result.commentCount > 0 && ` • ${result.commentCount} комментариев`}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
