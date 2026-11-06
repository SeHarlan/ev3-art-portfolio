import { Html, Head, Main, NextScript } from 'next/document'
import { THEME_STORAGE_KEY, THEMES } from '@/context/ThemeProvider'

// Runs before first paint, so a saved palette never flashes the default.
const themeScript = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(${JSON.stringify(THEMES)}.indexOf(t)>=0)document.documentElement.setAttribute('data-p95-theme',t)}catch(e){}`

export default function Document() {
  return (
    <Html lang="en" data-p95-theme="gray">
      <Head >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400..700&family=VT323&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
