'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchForm from '@/components/SearchForm'
import TopCompanies from '@/components/TopCompanies'
import StatsOverview from '@/components/StatsOverview'
import Disclaimer from '@/components/Disclaimer'
import ReportModal from '@/components/ReportModal'
import LeaderboardModal from '@/components/LeaderboardModal'
import LegalConsentModal from '@/components/LegalConsentModal'
import LoginModal from '@/components/LoginModal'
import ProfileModal from '@/components/ProfileModal'
import SearchResultsModal from '@/components/SearchResultsModal'
import { Shield, TrendingUp, Users, Zap, CheckCircle2, BarChart3, Award, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function HomeContent() {
    const searchParams = useSearchParams()
    const view = searchParams.get('view')
    const router = useRouter()

    const closeModal = () => {
        router.push('/', { scroll: false })
    }

    const openModal = (viewName: string) => {
        router.push(`/?view=${viewName}`, { scroll: false })
    }

    return (
        <div className="min-h-screen pt-28 pb-20 px-4">
            {/* MODALS */}
            {view === 'report' && <ReportModal onClose={closeModal} />}
            {view === 'leaderboard' && <LeaderboardModal onClose={closeModal} />}
            {view === 'login' && <LoginModal onClose={closeModal} />}
            {view === 'profile' && <ProfileModal onClose={closeModal} />}
            {view === 'search' && <SearchResultsModal onClose={closeModal} />}
            <LegalConsentModal />

            <div className="container mx-auto max-w-6xl">

                {/* HERO SECTION */}
                <div className="text-center mb-16 sm:mb-24 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0E0D8] text-[#444444] text-xs font-bold uppercase tracking-wider mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#8A9A5B]"></span>
                        Национальная платформа
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-[#111111] leading-tight">
                        Единый реестр <br className="hidden sm:block" />
                        <span className="text-[#A6845B]">мошеннических номеров</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-[#666666] max-w-2xl mx-auto mb-10 leading-relaxed">
                        Проверьте номер телефона перед переводом. <br className="hidden sm:block" />
                        База формируется и верифицируется гражданами Казахстана.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {/* Features badges */}
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#444444] bg-white border border-[#E0E0D8] px-4 py-2 rounded-lg">
                            <Shield className="w-4 h-4 text-[#A6845B]" />
                            Анонимно
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#444444] bg-white border border-[#E0E0D8] px-4 py-2 rounded-lg">
                            <Users className="w-4 h-4 text-[#A6845B]" />
                            Народный контроль
                        </div>
                    </div>

                    <div className="max-w-xl mx-auto relative z-10">
                        <SearchForm />
                    </div>
                </div>

                {/* DISCLAIMER */}
                <div className="mb-20">
                    <Disclaimer />
                </div>

                {/* STATS */}
                <div className="mb-20 border-t border-[#E0E0D8] pt-12">
                    <Suspense fallback={<div className="h-32 bg-[#F0F0EB] animate-pulse rounded-xl"></div>}>
                        <StatsOverview />
                    </Suspense>
                </div>

                {/* GRID */}
                <div className="grid lg:grid-cols-2 gap-8 mb-20">
                    <div className="bg-white border border-[#E0E0D8] rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#111111] p-2 rounded-lg"><BarChart3 className="w-5 h-5 text-white" /></div>
                            <h2 className="text-xl font-bold text-[#111111]">Частые сценарии</h2>
                        </div>
                        <TopCompanies />
                    </div>

                    <div className="grid gap-4">
                        <button
                            onClick={() => openModal('report')}
                            className="group relative overflow-hidden bg-[#111111] rounded-2xl p-8 text-white transition-all hover:-translate-y-1 text-left w-full"
                        >
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <div className="bg-[#333] w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-6 h-6 text-[#A6845B]" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Сообщить о нарушении</h3>
                                    <p className="text-gray-400 text-sm max-w-xs">
                                        Добавьте номер в базу, чтобы предупредить других граждан.
                                    </p>
                                </div>
                                <ArrowRight className="w-6 h-6 text-[#A6845B] transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>

                        <div className="grid grid-cols-2 gap-4 h-full">
                            <button
                                // onClick={() => openModal('scams')}
                                className="bg-white border border-[#E0E0D8] rounded-2xl p-6 hover:border-[#A6845B] transition-colors group text-left"
                            >
                                <div className="bg-[#F0F0EB] w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#A6845B] transition-colors">
                                    <TrendingUp className="w-5 h-5 text-[#111111] group-hover:text-white" />
                                </div>
                                <h3 className="font-bold text-[#111111]">База</h3>
                                <p className="text-xs text-[#666666] mt-1">Все записи</p>
                            </button>

                            <button
                                onClick={() => openModal('leaderboard')}
                                className="bg-white border border-[#E0E0D8] rounded-2xl p-6 hover:border-[#A6845B] transition-colors group text-left"
                            >
                                <div className="bg-[#F0F0EB] w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#A6845B] transition-colors">
                                    <Award className="w-5 h-5 text-[#111111] group-hover:text-white" />
                                </div>
                                <h3 className="font-bold text-[#111111]">Рейтинг</h3>
                                <p className="text-xs text-[#666666] mt-1">Активисты</p>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default function HomePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F9F9F7]"></div>}>
            <HomeContent />
        </Suspense>
    )
}
