import WindowsProvider from '@/context/WindowsProvider'
import useVHOverride from '@/hooks/useVHOverride'
import '@/styles/globals.css'
import '@/styles/Maurer.css'
import '@/styles/Noise.css'
import '@/styles/Duet.css'
import '@/styles/drifting.css'
import type { AppProps } from 'next/app'

import { Analytics } from "@vercel/analytics/react"

export default function App({ Component, pageProps }: AppProps) {
  useVHOverride()
  return (
    <WindowsProvider>
      <Component {...pageProps} />
      <Analytics />
    </WindowsProvider>
  )
}
