import { useEffect } from 'react'

interface AdBannerProps {
  position: 'top' | 'bottom' | 'content'
  size: '728x90' | '320x50' | '300x250'
}

export default function AdBanner({ position, size }: AdBannerProps) {
  useEffect(() => {
    // Google AdSense
    if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error('AdSense error:', err)
      }
    }

    // Yandex Metrika
    if (typeof window !== 'undefined' && window.ym) {
      // Yandex advertising tracking
    }
  }, [])

  const getAdSlot = (position: string, size: string) => {
    const slots = {
      'top-728x90': '1234567890',
      'bottom-728x90': '0987654321',
      'content-300x250': '1122334455',
      'mobile-320x50': '5566778899'
    }
    return slots[`${position}-${size}` as keyof typeof slots] || '1234567890'
  }

  const getSize = (size: string) => {
    switch (size) {
      case '728x90': return { width: 728, height: 90 }
      case '320x50': return { width: 320, height: 50 }
      case '300x250': return { width: 300, height: 250 }
      default: return { width: 728, height: 90 }
    }
  }

  const adSize = getSize(size)
  const adSlot = getAdSlot(position, size)

  return (
    <div className="ad-container flex justify-center items-center bg-gray-50 border border-gray-200 rounded-md overflow-hidden">
      {process.env.NODE_ENV === 'production' ? (
        <>
          {/* Google AdSense */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: `${adSize.width}px`, height: `${adSize.height}px` }}
            data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="false"
          />

          {/* Yandex RTB */}
          <div
            id={`yandex_rtb_${position}`}
            className="yandex-ad"
            style={{ width: `${adSize.width}px`, height: `${adSize.height}px` }}
          />
        </>
      ) : (
        // Development placeholder
        <div
          className="bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-300"
          style={{ width: `${adSize.width}px`, height: `${adSize.height}px` }}
        >
          Реклама {size}
          <br />
          {position}
        </div>
      )}
    </div>
  )
}
