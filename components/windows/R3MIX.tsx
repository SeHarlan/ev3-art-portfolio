import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic";
import clsx from "clsx";
import Link from "next/link";
import MenuDropdown from "../MenuDropdown";
const RMX_dithered_sky = dynamic(() => import('../p5/RMX/RMX-dithered-sky/RMX-dithered-sky'), { ssr: false });
const RMX_degen_dollar = dynamic(() => import('../p5/RMX/RMX-DEGEN-DOLLAR/RMX-DEGEN-DOLLAR'), { ssr: false });
const RMX_seeing_beyond = dynamic(() => import('../p5/RMX/RMX-Seeing-beyond/RMX-Seeing-beyond'), { ssr: false });
// const RMX_7_years = dynamic(() => import('../p5/RMX/RMX-7years/RMX-7years'), { ssr: false });
const RMX_FRAME35 = dynamic(() => import('../p5/RMX/RMX-Frame35/RMX-Frame35'), { ssr: false });
const RMX_The_Monitor = dynamic(() => import('../p5/RMX/RMX-The-Monitor/RMX-the-monitor'), { ssr: false });
const RMX_Bloom = dynamic(() => import('../p5/RMX/RMX-Bloom/RMX-bloom'), { ssr: false });

const contentOptions = ["sketch", "about"]

const R3MIX_Window: FC = () => {
  const [seed, setSeed] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeContent, setActiveContent] = useState(0)
  const [sketchCounter, setSketchCounter] = useState(1)
  const [activeRemix, setActiveRemix] = useState("dithered_sky")

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
      label: "About",
      function: () => setActiveContent(prev => (prev + 1) % contentOptions.length)
    },
    {
      label: "Choose R3MIX",
      function: () => setMenuOpen(true)
    },

  ]

  const menuOptions = [
    {
      label: "dithered sky 11",
      onClick: () => setActiveRemix("dithered_sky"),
    },
    {
      label: "DEGEN DOLLAR",
      onClick: () => setActiveRemix("degen_dollar"),
    },
    {
      label: "Seeing Beyond this Moment",
      onClick: () => setActiveRemix("seeing-beyond"),
    },
    {
      label: "7 years",
      onClick: () => setActiveRemix("7_years"),
    },
    {
      label: "Frame #35",
      onClick: () => setActiveRemix("frame35"),
    },
    {
      label: "The Monitor",
      onClick: () => setActiveRemix("the-monitor"),
    },
    {
      label: "In Bloom",
      onClick: () => setActiveRemix("bloom"),
    },
  ];

  const content = useMemo(() => { 
    switch (activeRemix) {
      case "dithered_sky":
        return <RMX_dithered_sky key="dithered-sky" className={sketchCounter} menuOpen={false} seed={seed} isActive={isActiveRef} />;
      case "degen_dollar":
        return <RMX_degen_dollar key="degen-dollar" className={sketchCounter} menuOpen={false} seed={seed} isActive={isActiveRef} />;
      case "seeing-beyond":
        return <RMX_seeing_beyond key="seeing-beyond" className={sketchCounter} menuOpen={false} seed={seed} isActive={isActiveRef} />;
      // case "7_years":
      //   return <RMX_7_years key="7-years" className={sketchCounter} menuOpen={false} seed={seed} isActive={isActiveRef} />;
      case "frame35":
        return <RMX_FRAME35 key="frame35" className={sketchCounter} menuOpen={false} seed={seed} isActive={isActiveRef} />;
      case "the-monitor":
        return <RMX_The_Monitor key="the-monitor" className={sketchCounter} menuOpen={false} seed={seed} isActive={isActiveRef} />;
      case "bloom":
        return <RMX_Bloom key="bloom" className={sketchCounter} menuOpen={false} seed={seed} isActive={isActiveRef} />;
    }
  }, [activeRemix, sketchCounter, seed, isActiveRef])


  return (
    <Window windowKey={WINDOWS.R3MIX} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      <MenuDropdown options={menuOptions} isOpen={menuOpen} setIsOpen={setMenuOpen} className="absolute top-0 left-0" />

      <div className={clsx("w-full h-full duration-200", activeContent === 0 ? "opacity-100" : "opacity-0")}>
        {content}
      </div>

      <div className={clsx("p-4 absolute top-0 left-0 h-full w-full overflow-auto", activeContent === 1 ? "block" : "hidden")}>
        <p>R3MIX is a series of studies. Existing works reimagined as constantly evolving glitch art.</p>
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
        <button className="classic-button px-2" onClick={() => setActiveContent(0)}>
          Go back
        </button>
      </div>
    </Window>
  )
}

export default R3MIX_Window