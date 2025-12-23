'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Phone, Building, MapPin, MessageSquare, CheckCircle } from 'lucide-react'

interface FormData {
  phoneNumber: string
  gender: 'male' | 'female' | 'unknown'
  company: string
  scamType: 'phishing' | 'fake_sale' | 'crypto' | 'other'
  region: string
  description: string
}

const regions = [
  'Алматы', 'Астана', 'Шымкент', 'Актобе', 'Атырау', 'Караганда',
  'Костанай', 'Кызылорда', 'Павлодар', 'Петропавск', 'Тараз', 'Уральск', 'Усть-Каменогорск', 'other'
]

export default function ReportForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: '',
    gender: 'unknown',
    company: '',
    scamType: 'other',
    region: 'other',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptedDisclaimer) {
      setError('Необходимо принять условия')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/scams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setError(data.error || 'Ошибка при отправке отчета')
      }
    } catch (error) {
      setError('Ошибка сети. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Отчет отправлен!
        </h2>
        <p className="text-gray-600 mb-4">
          Спасибо за помощь в борьбе с мошенничеством. Ваш вклад будет проверен другими пользователями.
        </p>
        <p className="text-sm text-gray-500">
          Перенаправление на главную страницу...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Номер телефона мошенника *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            placeholder="+7 (777) 123-45-67"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Пол мошенника
        </label>
        <select
          value={formData.gender}
          onChange={(e) => handleChange('gender', e.target.value as FormData['gender'])}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="unknown">Неизвестно</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Компания, от которой представился *
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="Например: Kaspi Bank, Halyk Bank, Сбербанк"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Тип мошенничества
        </label>
        <select
          value={formData.scamType}
          onChange={(e) => handleChange('scamType', e.target.value as FormData['scamType'])}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="other">Другое</option>
          <option value="phishing">Фишинг (запрос SMS/карточных данных)</option>
          <option value="fake_sale">Фейковая продажа/услуга</option>
          <option value="crypto">Криптовалютное мошенничество</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Регион
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <select
            value={formData.region}
            onChange={(e) => handleChange('region', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'other' ? 'Другой' : region}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Описание ситуации *
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Опишите, что произошло. Как представился мошенник? Что просил сделать? Любые детали помогут другим пользователям."
            rows={4}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="disclaimer"
            checked={acceptedDisclaimer}
            onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="disclaimer" className="text-sm text-blue-800">
            <strong>Я понимаю и принимаю:</strong> Эта информация будет проверена другими пользователями через голосование.
            Мы не модерируем контент и не несем ответственности за его достоверность.
            Решение использовать эту информацию принимаю самостоятельно.
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !acceptedDisclaimer}
        className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        {loading ? 'Отправка...' : 'Отправить отчет'}
      </button>
    </form>
  )
}
