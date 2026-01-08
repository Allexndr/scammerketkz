'use client'

import { useState } from 'react'
import { CheckCircle2, AlertTriangle, X } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import { TOP_COMPANIES } from '@/lib/mockScams'

export default function ReportModal({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = useState({
        phone: '',
        company: '',
        isOtherCompany: false,
        otherCompany: '',
        description: '',
        fraudType: 'phishing'
    })

    const { addReportPoints, isLoggedIn } = useUser()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const finalCompany = formData.isOtherCompany ? formData.otherCompany : formData.company

        if (isLoggedIn) {
            addReportPoints({
                hasCompany: !!finalCompany,
                hasDescription: formData.description.length > 20
            })
            alert(`Отчет отправлен! Вам начислены очки за сообщение о ${finalCompany || 'мошеннике'}.`)
        } else {
            alert('Отчет отправлен! Войдите в аккаунт, чтобы получать очки и повышать рейтинг.')
        }

        onClose()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#F9F9F7] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E0E0D8] max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#F9F9F7]/95 backdrop-blur-md border-b border-[#E0E0D8] p-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-[#A6845B]" />
                        Сообщить о мошеннике
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-[#F0F0EB] rounded-lg">
                        <X className="w-6 h-6 text-[#444444]" />
                    </button>
                </div>

                <div className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-[#444444] mb-2">Номер телефона мошенника</label>
                            <input
                                type="tel"
                                required
                                className="input-paper"
                                placeholder="+7 (7xx) xxx-xx-xx"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-[#444444] mb-2">Кем представились?</label>
                                {!formData.isOtherCompany ? (
                                    <select
                                        className="input-paper"
                                        value={formData.company}
                                        onChange={e => {
                                            if (e.target.value === 'OTHER') {
                                                setFormData({ ...formData, isOtherCompany: true, company: '' })
                                            } else {
                                                setFormData({ ...formData, company: e.target.value })
                                            }
                                        }}
                                    >
                                        <option value="">Выберите из списка</option>
                                        {TOP_COMPANIES.map(comp => (
                                            <option key={comp} value={comp}>{comp}</option>
                                        ))}
                                        <option value="OTHER">--- Другое (вписать вручную) ---</option>
                                    </select>
                                ) : (
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            className="input-paper pr-10"
                                            placeholder="Введите название организации"
                                            value={formData.otherCompany}
                                            onChange={e => setFormData({ ...formData, otherCompany: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isOtherCompany: false, otherCompany: '' })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#A6845B] hover:underline"
                                        >
                                            Список
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#444444] mb-2">Тип мошенничества</label>
                                <select
                                    className="input-paper"
                                    value={formData.fraudType}
                                    onChange={e => setFormData({ ...formData, fraudType: e.target.value })}
                                >
                                    <option value="phishing">Фишинг / Вишинг</option>
                                    <option value="crypto">Криптовалютные махинации</option>
                                    <option value="fake_shop">Поддельный интернет-магазин</option>
                                    <option value="rental">Аренда недвижимости</option>
                                    <option value="prize">Ложный выигрыш</option>
                                    <option value="other">Другое</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#444444] mb-2">Подробное описание схемы</label>
                            <textarea
                                rows={4}
                                required
                                className="input-paper resize-none"
                                placeholder="Опишите, что именно говорил мошенник, какие данные запрашивал..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                            <p className="mt-2 text-[10px] text-[#888] uppercase tracking-wider">
                                Рекомендуется минимум 20 символов для получения бонусных очков
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full py-4 text-lg"
                        >
                            Отправить отчет
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
