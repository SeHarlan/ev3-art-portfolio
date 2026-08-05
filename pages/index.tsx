import { WINDOWS, useWindowsContext } from '@/context/WindowsProvider'
import Footer from '../components/Footer'
import Icons from '../components/Icons'
import HomeWindow from '../components/windows/Home'
import Head from 'next/head'
import MaurerWindow from '@/components/windows/Maurer'
import NoiseWindow from '@/components/windows/Noise'
import DuetWindow from '@/components/windows/DUET'
import SomeDaysWindow from '@/components/windows/SomeDays'
import R3MIX_Window from '@/components/windows/R3MIX'
import ITBWindow from '@/components/windows/InTheBeginning'
import STEV3_Window from '@/components/windows/STEV3'
import TechtonicWindow from '@/components/windows/Techtonic'
import OnBeingHumanWindow from '@/components/windows/OnBeingHuman'

export default function Home() {
  const { openState } = useWindowsContext()
  const [openMap] = openState
  return (
    <>
      <Head>
        <title>EV3</title>
        <meta name="description" content="EV3's Art Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="canonical" href="https://ev3.art/" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="EV3" />
        <meta property="og:title" content="EV3" />
        <meta property="og:description" content="EV3's Art Portfolio" />
        <meta property="og:image" content="https://ev3.art/images/big-banner-bg.png" />
        <meta property="og:url" content="https://ev3.art/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://ev3.art/images/big-banner-bg.png" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://ev3.art/#ev3",
                  name: "EV3",
                  url: "https://ev3.art",
                  jobTitle: "Generative artist",
                  sameAs: ["https://x.com/EV3_art", "https://www.instagram.com/ev3_art/"],
                  workExample: [
                    { "@id": "https://epoch1.ev3.art/#techtonic" },
                    { "@id": "https://epoch1.ev3.art/#on-being-human" },
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://ev3.art/#website",
                  name: "EV3",
                  url: "https://ev3.art/",
                  description:
                    "Art portfolio of EV3 — generative and interactive works including Epoch One (techtonic, on being human), 3xGP, DUET, ITB, and R3MIX.",
                  publisher: { "@id": "https://ev3.art/#ev3" },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://epoch1.ev3.art/#website",
                  name: "Epoch One",
                  url: "https://epoch1.ev3.art/",
                  description:
                    "The generative WebGL art engine behind “techtonic” and “on being human”, created by EV3.",
                  publisher: { "@id": "https://ev3.art/#ev3" },
                },
                {
                  "@type": "Collection",
                  "@id": "https://epoch1.ev3.art/#techtonic",
                  name: "techtonic",
                  url: "https://epoch1.ev3.art/?tab=techtonic",
                  creator: { "@id": "https://ev3.art/#ev3" },
                },
                {
                  "@type": "Collection",
                  "@id": "https://epoch1.ev3.art/#on-being-human",
                  name: "on being human",
                  url: "https://epoch1.ev3.art/?tab=obh",
                  creator: { "@id": "https://ev3.art/#ev3" },
                },
              ],
            }),
          }}
        />
      </Head>
      <main className='h-screen grid grid-rows-[1fr_auto]'>
        {/* <div className='absolute z-[1] w-full h-full flex items-center justify-center p-2 select-none'>
          <img src="/images/big-banner.png" width={1500} height={500} alt="" className='rotate-90 md:rotate-0'/>
        </div> */}
        <div id="window-container" className='relative bg-windowsBG' >
          <Icons />
          {openMap[WINDOWS.HOME] ? <HomeWindow /> : null}
          {openMap[WINDOWS.NOISE] ? <NoiseWindow /> : null }
          {openMap[WINDOWS.DUET] ? <DuetWindow/> : null}
          {openMap[WINDOWS.MAURER] ? <MaurerWindow /> : null}
          {openMap[WINDOWS.SOMEDAYS] ? <SomeDaysWindow /> : null}
          {openMap[WINDOWS.R3MIX] ? <R3MIX_Window /> : null}
          {openMap[WINDOWS.ITB] ? <ITBWindow /> : null}
          {openMap[WINDOWS.GP] ? <STEV3_Window /> : null}
          {openMap[WINDOWS.TECHTONIC] ? <TechtonicWindow /> : null}
          {openMap[WINDOWS.OBH] ? <OnBeingHumanWindow /> : null}

          <div className="absolute bottom-3 right-4 z-[2] flex gap-4 text-white text-sm select-none">
            <a
              href="https://epoch1.ev3.art/?tab=techtonic"
              target="_blank"
              rel="noreferrer"
              title="techtonic — Epoch One"
              className="underline"
            >
              techtonic
            </a>
            <a
              href="https://epoch1.ev3.art/?tab=obh"
              target="_blank"
              rel="noreferrer"
              title="on being human — Epoch One"
              className="underline"
            >
              on being human
            </a>
          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}
