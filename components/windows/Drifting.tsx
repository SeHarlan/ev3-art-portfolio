import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic";
import SeedDropdown from "../SeedDropdown";
import clsx from "clsx";
const Drifting = dynamic(() => import('../p5/Drifting'), { ssr: false });

const contentOptions = ["sketch", "about"]

const DriftingWindow: FC = () => {
  const [seed, setSeed] = useState("")
  const [seedOpen, setSeedOpen] = useState(false)
  const seedOpenRef = useRef(seedOpen)
  const [activeContent, setActiveContent] = useState(0)
  const [sketchCounter, setSketchCounter] = useState(1)

  const { activeWindow } = useWindowsContext()
  const isActiveRef = useRef(false)

  useEffect(() => {
    isActiveRef.current = activeWindow === WINDOWS.DRIFTING
  }, [activeWindow])

  useEffect(() => {
    seedOpenRef.current = seedOpen
  }, [seedOpen])

  const handleDropDown = () => {
    setSeedOpen(prev => !prev)
  }

  const initSize = {
    h: 900,
    w: 600,
  }
  const initPos = {
    x: 200,
    y: 10
  }

  const menu: WindowMenuItem[] = [
    {
      label: "Refresh",
      function: () => {
        setSketchCounter(prev => prev + 1) //just needs to reset state for the component
      },
    },
    {
      label: "About",
      function: () => setActiveContent(prev => (prev + 1) % contentOptions.length)
    },
  ]

  return (
    <Window windowKey={WINDOWS.DRIFTING} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      {/* {content} */}
      <div className={clsx("w-full h-full duration-200", activeContent === 0 ? "opacity-100" : "opacity-0")}>
        <Drifting className={sketchCounter} menuOpen={seedOpenRef} seed={seed} isActive={isActiveRef} />
      </div>

      <div className={clsx("p-4 absolute top-0 left-0", activeContent === 1 ? "block" : "hidden")}>
        <p>================================</p>
        <p>ive spent my whole life running from depression</p>
        <br/>
        <p>for a long time the fog enveloped me</p>
        <p>blinding me from love and beauty</p>
        <p>leaving me stuck and hopeless</p>
        <p>dulling my drive</p>
        <p>my memory</p>
        <p>my emotions</p>
        <br />
        <p>over the years i gained tools and habits that pushed me out</p>
        <p>with time i gained stability and a sense of normalcy</p>
        <p>i was able to achieve</p>
        <p>to appreciate</p>
        <p>to love</p>
        <br />
        <p>but there are days when the fog catches up</p>
        <p>threatens me</p>
        <p>pulling me back in</p>
        <br />
        <p>my antidote is you</p>
        <p>its my friends and loved ones</p>
        <p>the people ive touched and been touched by</p>
        <br />
        <p>the fog is thick</p>
        <p>the journey is long</p>
        <p>but no one is really alone</p>
   
        <p>================================</p>
        <br/>
        <p>Press "R" to record a twelve second video</p>
        <p>Press "S" to save a still image</p>
        <br/>

        <button className="classic-button px-2" onClick={() => setActiveContent(0)}>
          Go back
        </button>
      </div>
    </Window>
  )
}

export default DriftingWindow