'use client'

import { useState } from 'react'

interface AdSpaceProps {
    type?: 'banner' | 'box' | 'native'; // Тип баннера
    className?: string;
}

export default function AdSpace({ type = 'banner', className = '' }: AdSpaceProps) {
    const [isVisible, setIsVisible] = useState(true)

    // Если реклама закрыта или не загрузилась
    if (!isVisible) return null;

    return (
        <div className={`flex flex-col items-center justify-center my-6 ${className}`}>
            <div className="text-[10px] text-gray-300 uppercase tracking-widest mb-1 w-full text-center">
                Реклама
            </div>

            {/* Контейнер для рекламной сети (Google/Yandex) */}
            <div className={`
                relative overflow-hidden bg-gray-50 border border-dashed border-gray-200 rounded-lg 
                flex items-center justify-center text-gray-400 text-sm font-medium
                hover:bg-gray-100 transition-colors cursor-pointer group
                ${type === 'banner' ? 'w-full max-w-[728px] h-[90px]' : ''}
                ${type === 'box' ? 'w-[300px] h-[250px]' : ''}
                ${type === 'native' ? 'w-full p-4 min-h-[100px] border-solid border-gray-100 bg-white shadow-sm' : ''}
            `}>
                {/* Имитация контента (удалить при подключении реальной рекламы) */}
                <span className="group-hover:hidden">Место для рекламы ({type})</span>
                <span className="hidden group-hover:inline text-[#111111]">Арендовать это место</span>

                {/* Здесь будет код: <ins class="adsbygoogle" ... /> */}
            </div>
        </div>
    )
}
