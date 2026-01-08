'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Rank = 'Новичок' | 'Охотник' | 'Эксперт' | 'Легенда'

interface User {
    name: string
    phone: string
    points: number
    rank: Rank
    reportsCount: number
    reports: Array<{
        id: string
        phone: string
        date: string
        pointsEarned: number
        status: 'pending' | 'verified'
    }>
}

interface UserContextType {
    user: User | null
    isLoggedIn: boolean
    login: (phone: string, name?: string) => void
    logout: () => void
    addReportPoints: (details: { hasCompany: boolean, hasDescription: boolean }) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const RANKS = [
    { name: 'Новичок', min: 0 },
    { name: 'Охотник', min: 50 },
    { name: 'Эксперт', min: 200 },
    { name: 'Легенда', min: 1000 }
] as const

const getRank = (points: number): Rank => {
    return [...RANKS].reverse().find(r => points >= r.min)?.name as Rank || 'Новичок'
}

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        // Restore session
        const saved = localStorage.getItem('scam_user')
        if (saved) {
            setUser(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        if (user) {
            localStorage.setItem('scam_user', JSON.stringify(user))
        } else {
            localStorage.removeItem('scam_user')
        }
    }, [user])

    const login = (phone: string, name?: string) => {
        // Check if this is the Admin user
        if (phone === 'Admin' || phone === 'admin' || phone === '+77777777777') {
            setUser({
                name: 'Админ',
                phone: '+7 (777) 777-77-77',
                points: 250, // 10 reports × 25 points each
                rank: 'Легенда',
                reportsCount: 10,
                reports: [
                    { id: '10', phone: '+77053341201', date: '2025-12-20', pointsEarned: 25, status: 'verified' },
                    { id: '9', phone: '+77052015923', date: '2025-12-19', pointsEarned: 25, status: 'verified' },
                    { id: '8', phone: '+77710007722', date: '2025-12-18', pointsEarned: 25, status: 'verified' },
                    { id: '7', phone: '+77719310492', date: '2025-12-17', pointsEarned: 25, status: 'verified' },
                    { id: '6', phone: '+77476800210', date: '2025-12-16', pointsEarned: 25, status: 'verified' },
                    { id: '5', phone: '+77772585777', date: '2025-12-15', pointsEarned: 25, status: 'verified' },
                    { id: '4', phone: '+77172554440', date: '2025-12-14', pointsEarned: 25, status: 'verified' },
                    { id: '3', phone: '+77772950777', date: '2025-12-13', pointsEarned: 25, status: 'verified' },
                    { id: '2', phone: '+77772597777', date: '2025-12-12', pointsEarned: 25, status: 'verified' },
                    { id: '1', phone: '+77273645155', date: '2025-12-11', pointsEarned: 25, status: 'verified' },
                ]
            })
        } else {
            // Regular user
            setUser({
                name: name || 'Анонимный Борец',
                phone,
                points: 0,
                rank: 'Новичок',
                reportsCount: 0,
                reports: []
            })
        }
    }

    const logout = () => {
        setUser(null)
    }

    const addReportPoints = ({ hasCompany, hasDescription }: { hasCompany: boolean, hasDescription: boolean }) => {
        if (!user) return

        let earned = 10 // Base
        if (hasCompany) earned += 15
        if (hasDescription) earned += 5

        const newPoints = user.points + earned
        const newRank = getRank(newPoints)

        const newReport = {
            id: Date.now().toString(),
            phone: '+7 (xxx) xxx-xx-xx', // In real app, pass actual phone
            date: new Date().toISOString(),
            pointsEarned: earned,
            status: 'pending' as const
        }

        setUser({
            ...user,
            points: newPoints,
            rank: newRank,
            reportsCount: user.reportsCount + 1,
            reports: [newReport, ...user.reports]
        })
    }

    return (
        <UserContext.Provider value={{ user, isLoggedIn: !!user, login, logout, addReportPoints }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) throw new Error('useUser must be used within UserProvider')
    return context
}
