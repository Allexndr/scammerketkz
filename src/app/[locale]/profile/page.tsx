'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { Copy, Plus, Trash2, Key, Shield, AlertTriangle } from 'lucide-react'

interface ApiKey {
    key: string;
    name: string;
    lastUsed?: string;
    isActive: boolean;
}

export default function ProfilePage() {
    const { user, isLoggedIn } = useUser()
    const router = useRouter()
    const [keys, setKeys] = useState<ApiKey[]>([])
    const [loading, setLoading] = useState(false)

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            // give context time to load
            // router.push('/?view=login') 
        }
    }, [isLoggedIn])

    // Load keys (simulated for now, needs endpoint)
    // In real app we fetch from /api/profile/me
    useEffect(() => {
        if (user && user.apiKeys) {
            setKeys(user.apiKeys)
        }
    }, [user])

    const generateKey = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/profile/generate_key', { method: 'POST' })
            const data = await res.json()
            if (data.key) {
                // Refresh page or update state
                setKeys(data.keys)
                alert('Ключ создан! Сохраните его: ' + data.key)
            }
        } catch (e) {
            alert('Ошибка сервера')
        } finally {
            setLoading(false)
        }
    }

    if (!user) return <div className="min-h-screen pt-32 text-center">Загрузка профиля...</div>

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 bg-[#F9F9F7]">
            <div className="container mx-auto max-w-4xl">

                {/* Header Card */}
                <div className="bg-white rounded-3xl p-8 mb-8 border border-[#E0E0D8] shadow-sm flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-[#111111] text-white flex items-center justify-center text-3xl font-bold">
                        {user.image ? <img src={user.image} className="w-full h-full rounded-full" /> : user.name?.[0]}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-[#111111]">{user.name}</h1>
                        <p className="text-gray-500">{user.email || user.phone}</p>
                        <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                                Ранг: {user.rank}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                                {user.points} Очков
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* API Settings */}
                    <div className="bg-white rounded-3xl p-8 border border-[#E0E0D8] shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-100 p-2.5 rounded-xl"><Key className="w-6 h-6 text-blue-600" /></div>
                            <h2 className="text-xl font-bold text-[#111111]">API Ключи</h2>
                        </div>

                        <p className="text-sm text-gray-500 mb-6">
                            Используйте эти ключи для интеграции проверки номеров в свои приложения.
                            Лимит: 100 запросов/день бесплатно.
                        </p>

                        <div className="space-y-4 mb-6">
                            {keys.map((k, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="overflow-hidden">
                                        <div className="font-mono text-xs text-gray-400 mb-1">{k.name}</div>
                                        <div className="font-mono text-sm font-bold text-[#111111] truncate max-w-[200px]">
                                            {k.key}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(k.key)}
                                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            ))}
                            {keys.length === 0 && (
                                <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                                    Нет активных ключей
                                </div>
                            )}
                        </div>

                        <button
                            onClick={generateKey}
                            disabled={loading}
                            className="w-full py-3 bg-[#111111] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
                        >
                            {loading ? 'Генерация...' : <><Plus size={18} /> Создать новый ключ</>}
                        </button>
                    </div>

                    {/* Recent Reports / Activity */}
                    <div className="bg-white rounded-3xl p-8 border border-[#E0E0D8] shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-red-100 p-2.5 rounded-xl"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
                            <h2 className="text-xl font-bold text-[#111111]">Отчеты</h2>
                        </div>

                        {user.reportsCount > 0 ? (
                            <div className="space-y-4">
                                {/* Can fetch real reports later via API */}
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-sm">+7 (777) ...</span>
                                        <span className="text-xs text-gray-400">Сегодня</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Подозрение на мошенничество. Звонили из банка...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Shield className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-400">Вы пока не отправляли жалоб</p>
                            </div>
                        )}

                    </div>
                </div>

                {/* Developer / Admin Zone */}
                <div className="mt-12 p-6 border-t border-dashed border-gray-300">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Admin Zone</h3>
                    <div className="flex gap-4">
                        <button
                            onClick={async () => {
                                if (!confirm('Запустить парсинг баз? Это может занять время.')) return;
                                try {
                                    const res = await fetch('/api/admin/parse', { method: 'POST' })
                                    const data = await res.json()
                                    alert(data.message + '\n' + data.logs.slice(0, 5).join('\n') + '...')
                                } catch (e) { alert('Error') }
                            }}
                            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg font-mono"
                        >
                            Sync Blacklists (Parser)
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
