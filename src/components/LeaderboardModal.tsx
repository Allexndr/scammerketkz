'use client'

import { X, Trophy, Award, Star } from 'lucide-react'

const mockUsers = [
    { id: '1', username: 'AlexHunter', points: 1500, status: 'Легенда 👑' },
    { id: '2', username: 'ScamBuster', points: 800, status: 'Эксперт ⭐' },
    { id: '3', username: 'SafetyFirst', points: 300, status: 'Охотник 🎯' },
    { id: '4', username: 'User123', points: 150, status: 'Новичок 🌱' },
    { id: '5', username: 'AntiScam', points: 120, status: 'Новичок 🌱' },
]

export default function LeaderboardModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#F9F9F7] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E0E0D8] max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#F9F9F7]/95 backdrop-blur-md border-b border-[#E0E0D8] p-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-[#A6845B]" />
                        Рейтинг охотников
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-[#F0F0EB] rounded-lg">
                        <X className="w-6 h-6 text-[#444444]" />
                    </button>
                </div>

                <div className="p-0">
                    {mockUsers.map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border-b border-[#E0E0D8] last:border-0 hover:bg-[#F0F0EB] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 flex items-center justify-center font-bold text-[#A6845B]">
                                    {index + 1}
                                </div>
                                <div>
                                    <div className="font-bold text-[#111111]">{user.username}</div>
                                    <div className="text-xs text-[#888888]">{user.status}</div>
                                </div>
                            </div>
                            <div className="font-mono font-bold text-[#111111]">
                                {user.points} pts
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
