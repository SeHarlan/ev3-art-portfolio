import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic";
import SeedDropdown from "../SeedDropdown";
import clsx from "clsx";
const InTheBeginning = dynamic(() => import('../p5/in-the-beginning'), { ssr: false });

const contentOptions = ["sketch", "about"]

const ITBWindow: FC = () => {
  const [seed, setSeed] = useState("")
  const [seedOpen, setSeedOpen] = useState(false)
  const seedOpenRef = useRef(seedOpen)
  const [activeContent, setActiveContent] = useState(0)
  const [sketchCounter, setSketchCounter] = useState(1)

  const { activeWindow } = useWindowsContext()
  const isActiveRef = useRef(false)

  useEffect(() => {
    isActiveRef.current = activeWindow === WINDOWS.ITB
  }, [activeWindow])

  useEffect(() => {
    seedOpenRef.current = seedOpen
  }, [seedOpen])

  const handleDropDown = () => {
    setSeedOpen(prev => !prev)
  }
  
  const initSize = {
    h: 900,
    w: 1600,
  }
  const initPos = {
    x: 60,
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
    {
      label: "Seed",
      function: handleDropDown,
      component: <SeedDropdown onUseSeed={useSeed} seedOpen={seedOpen} setSeedOpen={setSeedOpen} />,
    },
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
    <Window windowKey={WINDOWS.ITB} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      {/* {content} */}
      <div className={clsx("w-full h-full duration-200", activeContent === 0 ? "opacity-100" : "opacity-0")}>
        <InTheBeginning className={sketchCounter} menuOpen={seedOpenRef} seed={seed} isActive={isActiveRef} />
      </div>

      <div className={clsx("p-4 absolute top-0 left-0 h-full w-full overflow-auto", activeContent === 1 ? "block" : "hidden")}>
        {/* <p>in the beginning was God</p>
        <p>in the beginning were the Laws of Nature</p>
        <p>from nothing came chaos</p>
        <p>from chaos came beauty</p>
        <p>into beauty we were born</p> */}


{/* 
        <br/> */}
        <ul className="list-disc list-inside">
          <li>drag the mouse to introduce new organic material</li>
          <li>Hold "e" and drag the mouse to erase organic material</li>
          <li>Press "k" to enter kill mode</li>
        </ul>
        <br />
        <button className="classic-button px-2" onClick={() => setActiveContent(0)}>
          Go back
        </button>
      </div>
    </Window>
  )
}

export default ITBWindow