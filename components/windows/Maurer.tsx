import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC, ReactNode, use, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic";
import SeedDropdown from "../SeedDropdown";
import clsx from "clsx";
const Maurer = dynamic(() => import('../p5/Maurer'), { ssr: false });

const contentOptions = ["sketch", "about"]

const MaurerWindow: FC = () => {
  const [seed, setSeed] = useState("")
  const [seedOpen, setSeedOpen] = useState(false)
  const seedOpenRef = useRef(seedOpen)
  const [activeContent, setActiveContent] = useState(0)
  const [sketchCounter, setSketchCounter] = useState(1)

  const { activeWindow } = useWindowsContext()
  const isActiveRef = useRef(false)


  useEffect(() => {
    isActiveRef.current = activeWindow === WINDOWS.MAURER
  }, [activeWindow])


  useEffect(() => {
    seedOpenRef.current = seedOpen
  }, [seedOpen])

  const handleDropDown = () => {
    setSeedOpen(prev => !prev)
  }

  const initSize = {
    h: 800,
    w: 1100,
  }
  const initPos = {
    x: 200,
    y: 80
  }


  const visitVoid = () => {
    typeof window !== "undefined" && window.open("https://exchange.art/editions/73TRBEAjF6LSTwwmyPwyNeMTruNyej99iqh339s1PWdy", "_blank")
  }
  const visitInk = () => { 
    typeof window !== "undefined" && window.open("https://exchange.art/editions/DZizSX75MZRqNtAnk3heJC2U726x3cq7W2VCvb7raJFb", "_blank")
  }
  const visitNeon = () => {
    typeof window !== "undefined" && window.open("https://exchange.art/editions/5YduTApZp1EQYe25xKgf3J2XoqdCQxddHP5wb6RNcVyn", "_blank")
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
    {
      label: "Trade (Void)",
      function: visitVoid
    },
    {
      label: "Trade (Ink)",
      function: visitInk
    },
    {
      label: "Trade (Neon)",
      function: visitNeon
    },
  ]

  // const content = useMemo(() => {
  //   switch (activeContent) {
  //     case 0: // Sketch
  //       return <Maurer className="" menuOpen={seedOpenRef} seed={seed} isActive={isActiveRef} />
  //     case 1: // About
  //       return <div className="p-4">
  //         <p>The Maurer Expanse is an infinite space filled with every possible iteration of a Maurer Rose.</p>
  //         <br />
  //         <p>This interactive, generative art is meant to encourage exploration and appreciation of the vast variety and beauty that can emerge from a simple algorithm.</p>
  //         <br />
  //         <p>Every time you view the piece, you are dropped into a new location with different parameters. Once there, you can control the coordinates and parameters to view any other part of the Maurer Expanse.</p>
  //         <br />
  //         <p>There are three versions, each with a distinct color palette and increasing rarity/decreasing supply. Void, Ink, and Neon</p>
  //         <br />
  //         <p>Press "m" or swipe in from the top right to view a navigation menu.</p>
  //         <br />
  //         <button className="classic-button px-2" onClick={() => setActiveContent(0)}>
  //           Go back
  //         </button>
  //       </div>
  //   }
  // }, [activeContent, seed])
  return (
    <Window windowKey={WINDOWS.MAURER} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      {/* {content} */}
      <div className={clsx("w-full h-full duration-200", activeContent === 0 ? "opacity-100" : "opacity-0")}>
        <Maurer className={sketchCounter} menuOpen={seedOpenRef} seed={seed} isActive={isActiveRef} />
      </div>

      <div className={clsx("p-4 absolute top-0 left-0", activeContent === 1 ? "block" : "hidden")}>
        <p>The Maurer Expanse is an infinite space filled with every possible iteration of a Maurer Rose.</p>
        <br />
        <p>This interactive, generative art is meant to encourage exploration and appreciation of the vast variety and beauty that can emerge from a simple algorithm.</p>
        <br />
        <p>Every time you view the piece, you are dropped into a new location with different parameters. Once there, you can control the coordinates and parameters to view any other part of the Maurer Expanse.</p>
        <br />
        <p>There are three versions, each with a distinct color palette and increasing rarity/decreasing supply. Void, Ink, and Neon</p>
        <br />
        <p>Press "m" or swipe in from the top right to view a navigation menu.</p>
        <br />
        <button className="classic-button px-2" onClick={() => setActiveContent(0)}>
          Go back
        </button>
      </div>
      
    </Window>
  )
}

export default MaurerWindow