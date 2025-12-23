import Script from 'next/script'

export default function AdScripts() {
  return (
    <>
      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Yandex Metrika */}
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
      >
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(YOUR_YANDEX_COUNTER_ID, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
          });
        `}
      </Script>

      {/* Yandex RTB */}
      <Script
        src="https://yandex.ru/ads/system/context.js"
        strategy="afterInteractive"
      />

      {/* Ad blocking detection */}
      <Script
        id="ad-block-detect"
        strategy="afterInteractive"
      >
        {`
          window.addEventListener('load', function() {
            setTimeout(function() {
              var ad = document.querySelector('.adsbygoogle');
              if (ad && ad.innerHTML.replace(/\s/g, '').length === 0) {
                // Ad blocker detected
                console.log('Ad blocker detected');
              }
            }, 2000);
          });
        `}
      </Script>
    </>
  )
}
