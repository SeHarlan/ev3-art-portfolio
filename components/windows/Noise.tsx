import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic";
import SeedDropdown from "../SeedDropdown";
import clsx from "clsx";
const Noise = dynamic(() => import('../p5/Noise'), { ssr: false });

const contentOptions = ["sketch", "about"]

const NoiseWindow: FC = () => {
  const [seed, setSeed] = useState("")
  const [seedOpen, setSeedOpen] = useState(false)
  const seedOpenRef = useRef(seedOpen)
  const [activeContent, setActiveContent] = useState(0)
  const [sketchCounter, setSketchCounter] = useState(1)

  const { activeWindow } = useWindowsContext()
  const isActiveRef = useRef(false)

  useEffect(() => {
    isActiveRef.current = activeWindow === WINDOWS.NOISE
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
    x: 120,
    y: 20
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
    {
      label: "Trade",
      function: visit
    },
  ]


  return (
    <Window windowKey={WINDOWS.NOISE} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      {/* {content} */}
      <div className={clsx("w-full h-full duration-200", activeContent === 0 ? "opacity-100" : "opacity-0")}>
        <Noise className={sketchCounter} menuOpen={seedOpenRef} seed={seed} isActive={isActiveRef} />
      </div>

      <div className={clsx("p-4 absolute top-0 left-0 h-full w-full overflow-auto", activeContent === 1 ? "block" : "hidden")}>
        <p>“it's just noise” started as a personal challenge to make a long-form algorithm in under 100 lines of code.</p>
        <br />
        <p>This constraint meant that I had to rely on basic building blocks, mainly multiple layers of Perlin noise (known as domain warping) with some simple trigonometric functions for extra variation.</p>
        <p>As I got serious about fine-tuning and adding additional functionality like “banner mode” it ended up at around 200 lines of code, so not quite my original goal, but I'm gonna say it still qualifies as code minimalism ¯\_(ツ)_/¯ </p>
        <br />
        <p>Please enjoy and remember, it's just noise.</p>
        <ul className="list-disc list-inside">
          <li>Press "s" to download the current output</li>
          <li>Press "b" to re-generate in a banner aspect ratio</li>
          <li>Press "n" to generate brand new noise</li>
        </ul>
        <br />
        <button className="classic-button px-2" onClick={() => setActiveContent(0)}>
          Go back
        </button>
      </div>
    </Window>
  )
}

export default NoiseWindow