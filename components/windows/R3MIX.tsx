import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic";
import clsx from "clsx";
import Link from "next/link";
import WorkSelector, { Work } from "../WorkSelector";
const RMX_dithered_sky = dynamic(
  () => import("../p5/RMX/RMX-dithered-sky/RMX-dithered-sky"),
  { ssr: false }
) as any;
const RMX_degen_dollar = dynamic(
  () => import("../p5/RMX/RMX-DEGEN-DOLLAR/RMX-DEGEN-DOLLAR"),
  { ssr: false }
) as any;
const RMX_seeing_beyond = dynamic(
  () => import("../p5/RMX/RMX-Seeing-beyond/RMX-Seeing-beyond"),
  { ssr: false }
) as any;
const RMX_7_years = dynamic(() => import("../p5/RMX/RMX-7Years/RMX-7Years"), {
  ssr: false,
}) as any;
const RMX_FRAME35 = dynamic(() => import("../p5/RMX/RMX-Frame35/RMX-Frame35"), {
  ssr: false,
}) as any;
const RMX_The_Monitor = dynamic(
  () => import("../p5/RMX/RMX-the-monitor/RMX-the-monitor"),
  { ssr: false }
) as any;
const RMX_Bloom = dynamic(() => import("../p5/RMX/RMX-bloom/RMX-bloom"), {
  ssr: false,
}) as any;

type View = "selector" | "sketch" | "about"

const works: Work[] = [
  { id: "dithered_sky", title: "dithered sky 11", thumb: "/images/thumbs/rmx-dithered-sky.jpg" },
  { id: "degen_dollar", title: "DEGEN DOLLAR", thumb: "/images/thumbs/rmx-degen-dollar.jpg" },
  { id: "seeing-beyond", title: "Seeing Beyond this Moment", thumb: "/images/thumbs/rmx-seeing-beyond.jpg" },
  { id: "7_years", title: "7 years", thumb: "/images/thumbs/rmx-7-years.jpg" },
  { id: "frame35", title: "Frame #35", thumb: "/images/thumbs/rmx-frame35.jpg" },
  { id: "the-monitor", title: "The Monitor", thumb: "/images/thumbs/rmx-the-monitor.jpg" },
  { id: "bloom", title: "In Bloom", thumb: "/images/thumbs/rmx-bloom.jpg" },
]

const R3MIX_Window: FC = () => {
  const [seed, setSeed] = useState("")
  const [view, setView] = useState<View>("selector")
  const [sketchCounter, setSketchCounter] = useState(1)
  const [activeRemix, setActiveRemix] = useState<string>()

  const { activeWindow } = useWindowsContext()
  const isActiveRef = useRef(false)

  useEffect(() => {
    isActiveRef.current = activeWindow === WINDOWS.R3MIX
  }, [activeWindow])

  const initSize = {
    h: 800,
    w: 800,
  }
  const initPos = {
    x: 130,
    y: 30
  }


  const visit = () => {
    typeof window !== "undefined" && window.open("https://www.tensor.trade/trade/its_just_noise", "_blank")
  }

  const useSeed = (s: string) => {
    setSeed(s)
    setView("sketch")
  }

  const openWork = (id: string) => {
    setActiveRemix(id)
    setView("sketch")
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
      function: () => setView("about")
    },
    {
      label: "Select Piece",
      function: () => setView("selector")
    },

  ]

  const content = useMemo(() => { 
    switch (activeRemix) {
      case "dithered_sky":
        return <RMX_dithered_sky key="dithered-sky" className={sketchCounter} menuOpen={false} seed={seed} isActive={isActiveRef} />;
      case "degen_dollar":
        return <RMX_degen_dollar key="degen-dollar" className={sketchCounter} menuOpen={false} seed={seed} isActive={isActiveRef} />;
      case "seeing-beyond":
        return <RMX_seeing_beyond key="seeing-beyond" className={sketchCounter} menuOpen={false} seed={seed} isActive={isActiveRef} />;
      case "7_years":
        return <RMX_7_years key="7-years" className={sketchCounter} menuOpen={false} seed={seed} isActive={isActiveRef} />;
      case "frame35":
        return <RMX_FRAME35 key="frame35" className={sketchCounter} menuOpen={false} seed={seed} isActive={isActiveRef} />;
      case "the-monitor":
        return <RMX_The_Monitor key="the-monitor" className={sketchCounter} menuOpen={false} seed={seed} isActive={isActiveRef} />;
      case "bloom":
        return <RMX_Bloom key="bloom" className={sketchCounter} menuOpen={false} seed={seed} isActive={isActiveRef} />;
      default:
        return null;
    }
  }, [activeRemix, sketchCounter, seed, isActiveRef])


  return (
    <Window windowKey={WINDOWS.R3MIX} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-windowsPaper">
      <div className={clsx("w-full h-full duration-200", view === "sketch" ? "opacity-100" : "opacity-0")}>
        {content}
      </div>

      {view === "selector" && <WorkSelector works={works} selectedId={activeRemix} onOpen={openWork} />}

      <div className={clsx("p-4 absolute top-0 left-0 h-full w-full overflow-auto", view === "about" ? "block" : "hidden")}>
        <p>R3MIX is a series of glitch studies. Existing still art reimagined with constantly evolving movement.</p>
        <br />
        <p>Press "c" to clear the glitch effects and view the original piece</p>        
        <br />
        <p>Current R3MIX pieces:</p>
        <ul className="list-disc list-inside">
          <li>"dithered sky #11" by <Link href="https://x.com/Rez_inProgress" target="_blank" className="underline">Rez</Link></li>
          <li>"DEGEN DOLLAR" by <Link href="https://x.com/solanapoet" target="_blank" className="underline">degen poet</Link></li>
          <li>"Seeing Beyond this Moment" by <Link href="https://x.com/culturehacker" target="_blank" className="underline">culturehacker</Link></li>
          <li>"7 Years of Abundance" by <Link href="https://x.com/michaelmicasso" target="_blank" className="underline">MEK</Link></li>
          <li>"Frame #35" by <Link href="https://x.com/IDerech" target="_blank" className="underline">Derech</Link></li>
          <li>"The Monitor" by <Link href="https://x.com/EmpressTrash" target="_blank" className="underline">EmpressTrash</Link></li>
          <li>"In Bloom" by <Link href="https://x.com/strakts" target="_blank" className="underline">Strakts</Link></li>
        </ul>
          
        <br />
        <button className="classic-button px-2" onClick={() => setView(activeRemix ? "sketch" : "selector")}>
          <span>Go back</span>
        </button>
      </div>
    </Window>
  )
}

export default R3MIX_Window