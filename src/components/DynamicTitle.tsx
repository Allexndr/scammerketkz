'use client'

import { useEffect } from 'react'

const titles = [
    "Мошенник уходи! 🛡️", // Russian
    "Алаяқ кет! 🛡️", // Kazakh
    "Scammer Go Away! 🛡️", // English
]

export default function DynamicTitle() {
    useEffect(() => {
        let index = 0

        const interval = setInterval(() => {
            document.title = titles[index]
            index = (index + 1) % titles.length
        }, 5000)

        // Set initial title
        document.title = titles[0]

        return () => clearInterval(interval)
    }, [])

    return null
}
