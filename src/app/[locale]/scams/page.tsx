'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'

export default function ScamsPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-black mb-4 text-gradient">База отзывов</h1>
                    <p className="text-gray-600">Все подтвержденные сообщения о нарушениях</p>
                </div>

                <div className="card-glass mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Поиск по номеру или компании..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#F7E7CE] bg-white/50 outline-none focus:border-[#D2B48C]"
                        />
                    </div>
                </div>

                <div className="grid gap-4">
                    {/* Empty State for now */}
                    <div className="text-center py-12 bg-white/50 rounded-3xl border border-[#F7E7CE]">
                        <p className="text-gray-500">База загружается...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
