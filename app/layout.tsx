import type { Metadata } from 'next'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import './globals.css'
// import AdBanner from '@/components/AdBanner'
// import AdSidebar from '@/components/AdSidebar'
// import AdScripts from '@/components/AdScripts'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ScammerKetKz - Противодействие мошенничеству в Казахстане',
  description: 'Краудсорсинг-платформа для борьбы с мошенничеством. Проверяйте номера, вносите отчеты, помогайте другим.',
  keywords: 'мошенничество, Казахстан, антискам, проверка номеров, фишинг, ScammerKetKz',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {/* <AdScripts /> */}
        <Navigation />

        {/* Top Banner Ad Placeholder */}
        <div className="bg-gray-50 border-b border-gray-200 py-3 hidden md:block">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-300" style={{ width: '728px', height: '90px' }}>
                Реклама Google AdSense 728x90
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Top Ad Placeholder */}
        <div className="bg-gray-50 border-b border-gray-200 py-2 md:hidden">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-300" style={{ width: '320px', height: '50px' }}>
              Реклама Google AdSense 320x50
            </div>
          </div>
        </div>

        {/* Main Content with Side Ads Placeholders */}
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Sidebar Ad Placeholder - Desktop Only */}
              <div className="hidden xl:block xl:col-span-2">
                <div className="sticky top-8 space-y-4">
                  <div className="bg-gradient-to-b from-blue-50 to-green-50 rounded-lg shadow-sm flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-300" style={{ width: '300px', height: '600px' }}>
                    Боковая реклама
                    <br />
                    Yandex RTB
                    <br />
                    300x600
                  </div>
                  <div className="bg-gradient-to-b from-yellow-50 to-orange-50 rounded-lg shadow-sm flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-300" style={{ width: '300px', height: '300px' }}>
                    Квадратная реклама
                    <br />
                    300x300
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-span-12 xl:col-span-8">
                {children}
              </div>

              {/* Right Sidebar Ad Placeholder - Desktop Only */}
              <div className="hidden xl:block xl:col-span-2">
                <div className="sticky top-8 space-y-4">
                  <div className="bg-gradient-to-b from-green-50 to-blue-50 rounded-lg shadow-sm flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-300" style={{ width: '300px', height: '600px' }}>
                    Боковая реклама
                    <br />
                    Google AdSense
                    <br />
                    300x600
                  </div>
                  <div className="bg-gradient-to-b from-orange-50 to-yellow-50 rounded-lg shadow-sm flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-300" style={{ width: '300px', height: '300px' }}>
                    Нативная реклама
                    <br />
                    300x300
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">ScammerKetKz</h3>
                <p className="text-gray-300">
                  Краудсорсинг-платформа против мошенничества в Казахстане.
                  Вместе мы сможем сделать интернет безопаснее.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Ссылки</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-300 hover:text-white">Главная</Link></li>
                  <li><Link href="/privacy" className="text-gray-300 hover:text-white">Политика конфиденциальности</Link></li>
                  <li><a href="https://t.me/antiscamkz" className="text-gray-300 hover:text-white">Telegram бот</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Контакты</h3>
                <p className="text-gray-300">
                  По вопросам: support@antiscamkz.kz
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  ⚠️ Мы не модерируем контент. Верификация через голосование пользователей.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 AntiScamKZ. Все права защищены. Данные предоставлены пользователями.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
