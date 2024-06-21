import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic";
import clsx from "clsx";
import Link from "next/link";
import MenuDropdown from "../MenuDropdown";
const STEV3_2 = dynamic(
  () => import("../p5/Strakts/STEV3-2/STEV3-2"),
  { ssr: false }
) as any;

const contentOptions = ["sketch", "about"]

const STEV3_Window: FC = () => {
  const [seed, setSeed] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeContent, setActiveContent] = useState(0)
  const [sketchCounter, setSketchCounter] = useState(1)
  const [activeRemix, setActiveRemix] = useState("2")

  const { activeWindow } = useWindowsContext()
  const isActiveRef = useRef(false)

  useEffect(() => {
    isActiveRef.current = activeWindow === WINDOWS.R3MIX
  }, [activeWindow])

  const initSize = {
    h: 893,
    w: 553,
  }
  const initPos = {
    x: 160,
    y: 30
  }


  const menu: WindowMenuItem[] = [
    {
      label: "Refresh",
      function: () => {
        setSketchCounter(prev => prev + 1) //just needs to reset state for the component
      },
    },
    // {
    //   label: "About",
    //   function: () => setActiveContent(prev => (prev + 1) % contentOptions.length)
    // },
    // {
    //   label: "Choose R3MIX",
    //   function: () => setMenuOpen(true)
    // },

  ]

  const menuOptions = [
    {
      label: "st2",
      onClick: () => setActiveRemix("2"),
    },
  ];

  const content = useMemo(() => { 
    switch (activeRemix) {
      case "2":
        return (
          <STEV3_2
            key="STEV3-2"
            className={sketchCounter}
            menuOpen={false}
            seed={seed}
            isActive={isActiveRef}
          />
        );
    }
  }, [activeRemix, sketchCounter, seed, isActiveRef])


  return (
    <Window windowKey={WINDOWS.STEV3} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      <MenuDropdown options={menuOptions} isOpen={menuOpen} setIsOpen={setMenuOpen} className="absolute top-0 left-0" />

      <div className={clsx("w-full h-full duration-200", activeContent === 0 ? "opacity-100" : "opacity-0")}>
        {content}
      </div>

      <div className={clsx("p-4 absolute top-0 left-0 h-full w-full overflow-auto", activeContent === 1 ? "block" : "hidden")}>
        
          
        <br />
        <button className="classic-button px-2" onClick={() => setActiveContent(0)}>
          Go back
        </button>
      </div>
    </Window>
  )
}

export default STEV3_Window