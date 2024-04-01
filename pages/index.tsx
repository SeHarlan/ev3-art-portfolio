import { WINDOWS, useWindowsContext } from '@/context/WindowsProvider'
import Footer from '../components/Footer'
import Icons from '../components/Icons'
import HomeWindow from '../components/windows/Home'
import Head from 'next/head'
import MBBWindow from '@/components/windows/MBB'
import CurateWindow from '@/components/windows/Curate'
import CollectorWindow from '@/components/windows/Collector'

export default function Home() {
  const { openState } = useWindowsContext()
  const [openMap] = openState
  return (
    <>
      <Head>
        <title>Art by EV3</title>
        <meta name="description" content="EV3's Art Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="og:title" content="Art by EV3" />
        <meta name="og:description" content="EV3's Art Portfolio" />
        <meta property="og:image" content="/images/big-banner-bg.png" />
        <meta property='twitter:image' content="/images/big-banner-bg.png" />
        <meta name="og:url" content="https://ev3-art.com" />
        <meta property="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='h-screen grid grid-rows-[1fr_auto]'>
        <div className='absolute z-[1] w-full h-full flex items-center justify-center p-2 select-none'>
          <img src="/images/big-banner.png" width={1500} height={500} alt="" className='rotate-90 md:rotate-0'/>
        </div>
        <div id="window-container" className='relative bg-windowsBG' >
          <Icons />
          {openMap[WINDOWS.HOME] ? <HomeWindow /> : null}
          {openMap[WINDOWS.COLLECTOR] ? <CollectorWindow/> : null}
          {openMap[WINDOWS.MBB] ? <MBBWindow /> : null}
          {openMap[WINDOWS.CURATE] ? <CurateWindow /> : null }
          {/* {openMap[WINDOWS.NODE_MONKEY] ? <NodeMonkeyWindow /> : null} */}
        </div>
        <Footer />
      </main>
    </>
  )
}
