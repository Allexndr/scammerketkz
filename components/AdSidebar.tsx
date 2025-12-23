import { useEffect } from 'react'

interface AdSidebarProps {
  position: 'left' | 'right'
}

export default function AdSidebar({ position }: AdSidebarProps) {
  useEffect(() => {
    // Google AdSense
    if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error('AdSense error:', err)
      }
    }
  }, [])

  const getAdSlot = (position: string) => {
    return position === 'left' ? '3344556677' : '7788990011'
  }

  const adSlot = getAdSlot(position)

  return (
    <div className="ad-sidebar space-y-4">
      {/* Google AdSense 300x600 */}
      {process.env.NODE_ENV === 'production' ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '300px', height: '600px' }}
            data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="false"
          />
        </div>
      ) : (
        <div className="bg-gradient-to-b from-blue-50 to-green-50 rounded-lg shadow-sm flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-300" style={{ width: '300px', height: '600px' }}>
          Боковая реклама
          <br />
          {position}
          <br />
          300x600
        </div>
      )}

      {/* Yandex RTB 300x300 */}
      {process.env.NODE_ENV === 'production' ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div
            id={`yandex_rtb_${position}_square`}
            className="yandex-ad"
            style={{ width: '300px', height: '300px' }}
          />
        </div>
      ) : (
        <div className="bg-gradient-to-b from-yellow-50 to-orange-50 rounded-lg shadow-sm flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-300" style={{ width: '300px', height: '300px' }}>
          Квадратная реклама
          <br />
          {position}
          <br />
          300x300
        </div>
      )}

      {/* Native Ad Placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="text-xs text-gray-500 mb-2">Рекомендуемое</div>
        <div className="text-sm font-medium text-gray-900 mb-1">Антивирусная защита</div>
        <div className="text-xs text-gray-600 mb-3">Надежная защита от мошенников и вирусов</div>
        <button className="w-full bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700 transition-colors">
          Узнать больше
        </button>
      </div>
    </div>
  )
}


