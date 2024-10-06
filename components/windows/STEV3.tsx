import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic";
import clsx from "clsx";
import Link from "next/link";
import MenuDropdown from "../MenuDropdown";

const STEV3_3 = dynamic(() => import("../p5/Strakts/STEV3-n3/STEV3-n3"), {
  ssr: false,
}) as any;

const STEV3_2 = dynamic(() => import("../p5/Strakts/STEV3-n2/STEV3-n2"), {
  ssr: false,
}) as any;

const STEV3_1 = dynamic(() => import("../p5/Strakts/STEV3-n1/STEV3-n1"), {
  ssr: false,
}) as any;


const contentOptions = ["sketch", "about"]

const STEV3_Window: FC = () => {
  const [seed, setSeed] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeContent, setActiveContent] = useState(0)
  const [sketchCounter, setSketchCounter] = useState(1)
  const [activeRemix, setActiveRemix] = useState("1")

  const { activeWindow } = useWindowsContext()
  const isActiveRef = useRef(false)

  useEffect(() => {
    isActiveRef.current = activeWindow === WINDOWS.R3MIX
  }, [activeWindow])


   const initSize = {
     h: 890 * 1.4,
     w: 560 * 1.4,
   };
  const initPos = {
    x: 160,
    y: 0
  }


  const menu: WindowMenuItem[] = [
    {
      label: "Refresh",
      function: () => {
        setSketchCounter((prev) => prev + 1); //just needs to reset state for the component
      },
    },
    {
      label: "Choose Prelude",
      function: () => setMenuOpen(true)
    },
    {
      label: "About",
      function: () => setActiveContent(prev => (prev + 1) % contentOptions.length)
    },

  ];

  const menuOptions = [
    {
      label: "that which blooms in the desert",
      onClick: () => setActiveRemix("1"),
    },
    {
      label: "floating on taken by the tempest",
      onClick: () => setActiveRemix("2"),
    },
    {
      label: "icarus never did fall",
      onClick: () => setActiveRemix("3"),
    },
  ];

  const content = useMemo(() => { 
    switch (activeRemix) {
      case "3":
        return (
          <STEV3_3
            key="STEV3-3"
            className={sketchCounter}
            menuOpen={false}
            seed={seed}
            isActive={isActiveRef}
          />
        );
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
      case "1":
        return (
          <STEV3_1
            key="STEV3-1"
            className={sketchCounter}
            menuOpen={false}
            seed={seed}
            isActive={isActiveRef}
          />
        );
    }
  }, [activeRemix, sketchCounter, seed, isActiveRef])


  return (
    <Window
      windowKey={WINDOWS.GP}
      initSize={initSize}
      initPosition={initPos}
      menu={menu}
      wrapperClassName="bg-amber-50"
    >
      <MenuDropdown
        options={menuOptions}
        isOpen={menuOpen}
        setIsOpen={setMenuOpen}
        className="absolute top-0 left-0"
      />

      <div
        className={clsx(
          "w-full h-full duration-200",
          activeContent === 0 ? "opacity-100" : "opacity-0"
        )}
      >
        {content}
      </div>

      <div
        className={clsx(
          "p-4 absolute top-0 left-0 h-full w-full overflow-auto",
          activeContent === 1 ? "block" : "hidden"
        )}
      >
        <p className="font-bold">Three Glitch Preludes</p>
        <br />
        <p>“that which blooms in the desert”</p>
        <p>“floating on taken by the tempest”</p>
        <p>“icarus never did fall”</p>
        <br />
        <p>
          Original digital art by{" "}
          <Link
            href="https://x.com/strakts"
            target="_blank"
            className="underline"
          >
            Strakts
          </Link>
          , modified with code by EV3
        </p>
        <br />
        <p>
          The concept for the base images originates from a deliberate isolation
          of abstract, gestural forms. The glitch algorithms then interpret
          their flow and character, sometimes honoring them, sometimes
          deliberately distorting them.
        </p>
        <br />
        <p>
          Each piece begins with a preview of three motifs shown in succession,
          before entering a random flow state where tension rises and falls at
          unpredictable intervals.
        </p>
        <br />
        <p>
          The pieces remain in constant flux, glitched in real-time with
          randomized and interacting parameters. No two viewings are ever
          exactly the same. 
        </p>
        <br />
        <button
          className="classic-button px-2"
          onClick={() => setActiveContent(0)}
        >
          Go back
        </button>
      </div>
    </Window>
  );
}

export default STEV3_Window;