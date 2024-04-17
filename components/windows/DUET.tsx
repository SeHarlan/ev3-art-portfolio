import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic";
import clsx from "clsx";
import SeedDropdown from "../SeedDropdown";
const Duet = dynamic(() => import('../p5/DUET'), { ssr: false });

const contentOptions = ["sketch", "about"]

const DuetWindow: FC = () => {
  const [seed, setSeed] = useState("")
  const [seedOpen, setSeedOpen] = useState(false)
  const seedOpenRef = useRef(seedOpen)
  const [activeContent, setActiveContent] = useState(0)

  const { activeWindow } = useWindowsContext()
  const isActiveRef = useRef(false)

  useEffect(() => {
    isActiveRef.current = activeWindow === WINDOWS.DUET
  }, [activeWindow])

  useEffect(() => {
    seedOpenRef.current = seedOpen
  }, [seedOpen])

  const handleDropDown = () => {
    setSeedOpen(prev => !prev)
  }

  const initSize = {
    h: 800,
    w: 1300,
  }
  const initPos = {
    x: 100,
    y: 60
  }

  const visit = () => {
    typeof window !== "undefined" && window.open("https://collector.sh/EV3/Long-Form_Generative", "_blank")
  }

  const useSeed = (s:string) => {
    setSeed(s)
    setActiveContent(0)
  }


  const menu: WindowMenuItem[] = [
    {
      label: "Refresh",
      function: () => {
        setActiveContent(100)
        setTimeout(() => setActiveContent(0), 10)
      },
    },
    {
      label: "Seed",
      function: handleDropDown,
      component: <SeedDropdown onUseSeed={useSeed} seedOpen={seedOpen} setSeedOpen={setSeedOpen} />,
    },
    {
      label: "About",
      function: () => setActiveContent(prev => (prev+1)%contentOptions.length)
    },
    {
      label: "Collect",
      function: visit,
    },
  ]

  const content = useMemo(() => {
    switch (activeContent) { 
      case 0: // Sketch
        return <Duet className="" menuOpen={seedOpenRef} seed={seed} isActive={isActiveRef} />
      case 1: // About
        return <div className="p-4">
          <p>DUET is an audio-visual art algorithm.</p>
          <br/>
          <p>Each visual element corresponds to a musical one. Line length determines note value, rhythms correlate with line opacity, and each color palette belongs to a specific musical scale.</p>
          <br />
          <p>The arrangement of lines is an exploration and mutation of Epicycloid patterns. Because the lines' placement and distance come from mathematic formulas, more often than not, it leads to repeating patterns in the notes. </p>
          <br />
          <p>The line/note patterns combine with rhythms to form endless motifs and melodies generated in real time.</p>
          <br />
          <p>Tap the "Click Me" button to begin the DUET.</p>
          <ul className="list-disc list-inside">
            <li>"m" or swipe up/down from the bottom to toggle the menu</li>
            <li>Space bar or double tap to play/pause</li>
            <li>"e" to play the extended version</li>
            <li>"f" to fast forward</li>
            <li>"s" to save a screenshot</li>
            <li>"r" to replay</li>
            <li>"n" to generate a new DUET</li>
          </ul>
          <br />
          <button className="classic-button px-2" onClick={() => setActiveContent(0)}>
            Go back
          </button>
        </div>
    }
  }, [activeContent, seed])

  return (
    <Window windowKey={WINDOWS.DUET} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      {content}
    </Window>
  )
}

export default DuetWindow