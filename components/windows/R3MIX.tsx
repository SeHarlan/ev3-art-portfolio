import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic";
import SeedDropdown from "../SeedDropdown";
import clsx from "clsx";
import Link from "next/link";
const RMX_dithered_sky = dynamic(() => import('../p5/RMX-dithered-sky'), { ssr: false });

const contentOptions = ["sketch", "about"]

const R3MIX_Window: FC = () => {
  const [seed, setSeed] = useState("")
  const [seedOpen, setSeedOpen] = useState(false)
  const seedOpenRef = useRef(seedOpen)
  const [activeContent, setActiveContent] = useState(0)
  const [sketchCounter, setSketchCounter] = useState(1)

  const { activeWindow } = useWindowsContext()
  const isActiveRef = useRef(false)

  useEffect(() => {
    isActiveRef.current = activeWindow === WINDOWS.R3MIX
  }, [activeWindow])

  useEffect(() => {
    seedOpenRef.current = seedOpen
  }, [seedOpen])

  const handleDropDown = () => {
    setSeedOpen(prev => !prev)
  }
  
  const initSize = {
    h: 800,
    w: 800,
  }
  const initPos = {
    x: 120,
    y: 30
  }


  const visit = () => {
    typeof window !== "undefined" && window.open("https://www.tensor.trade/trade/its_just_noise", "_blank")
  }

  const useSeed = (s: string) => {
    setSeed(s)
    setActiveContent(0)
  }

  const menu: WindowMenuItem[] = [
    {
      label: "Refresh",
      function: () => {
        setSketchCounter(prev => prev + 1) //just needs to reset state for the component
      },
    },
    // {
    //   label: "Seed",
    //   function: handleDropDown,
    //   component: <SeedDropdown onUseSeed={useSeed} seedOpen={seedOpen} setSeedOpen={setSeedOpen} />,
    // },
    {
      label: "About",
      function: () => setActiveContent(prev => (prev + 1) % contentOptions.length)
    },
    // {
    //   label: "Trade",
    //   function: visit
    // },
  ]


  return (
    <Window windowKey={WINDOWS.R3MIX} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      {/* {content} */}
      <div className={clsx("w-full h-full duration-200", activeContent === 0 ? "opacity-100" : "opacity-0")}>
        <RMX_dithered_sky className={sketchCounter} menuOpen={seedOpenRef} seed={seed} isActive={isActiveRef} />
      </div>

      <div className={clsx("p-4 absolute top-0 left-0 h-full w-full overflow-auto", activeContent === 1 ? "block" : "hidden")}>
        <p>R3MIX re-envisions previously minted art of various artists as continually moving and evolving glitch art.</p>
        <br />
        <p>Press "c" to clear the glitch effects and view the original piece</p>        
        <br />
        <p>Current R3MIX pieces:</p>
        <ul className="list-disc list-inside">
          <li>"dithered sky #11" by <Link href="https://twitter.com/Rez_inProgress" target="_blank" className="underline">Rez</Link></li>
        </ul>
          
        <br />
        <button className="classic-button px-2" onClick={() => setActiveContent(0)}>
          Go back
        </button>
      </div>
    </Window>
  )
}

export default R3MIX_Window