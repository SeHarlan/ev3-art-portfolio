import { WINDOWS } from "@/context/WindowsProvider"
import usePieceFocus from "@/hooks/usePieceFocus"
import { ZEUMS, rememberSrc } from "@/data/zeums"
import clsx from "clsx"
import { FC, useState } from "react"
import SeedDropdown from "../SeedDropdown"
import Window, { WindowMenuItem } from "../Window"
import WorkSelector from "../WorkSelector"

type View = "selector" | "work" | "about"

const data = ZEUMS.REMEMBER
const windowKey = WINDOWS.REMEMBER

/** remember.exe: 21 memories, one engine. Each item, and the Seed menu, loads the engine with a seed. */
const RememberWindow: FC = () => {
  const [view, setView] = useState<View>("selector")
  const [activeId, setActiveId] = useState<string | undefined>()
  // undefined until a piece or seed is opened; "" is the engine's random seed.
  const [seed, setSeed] = useState<string | undefined>()
  const [seedOpen, setSeedOpen] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)

  const { iframeRef, focusPiece } = usePieceFocus(windowKey, view === "work")

  const openWork = (id: string) => {
    setActiveId(id)
    setSeed(data.items.find(i => i.id === id)?.seed ?? "")
    setView("work")
  }

  const useSeed = (s: string) => {
    // A typed seed is no longer a listed piece, even if it matches one.
    setActiveId(undefined)
    setSeed(s)
    // Reload even when the seed is unchanged, so the piece restarts and takes focus on load.
    setRefreshCount(n => n + 1)
    setView("work")
  }

  const menu: WindowMenuItem[] = [
    { label: "Select Piece", function: () => setView("selector") },
    {
      label: "Seed",
      function: () => setSeedOpen(open => !open),
      component: <SeedDropdown multiline initialSeed={seed ?? ""} onUseSeed={useSeed} seedOpen={seedOpen} setSeedOpen={setSeedOpen} />,
    },
    { label: "Refresh", function: () => setRefreshCount(n => n + 1) },
    { label: "About", function: () => setView("about") },
  ]

  return (
    <Window windowKey={windowKey} initSize={data.size} initPosition={data.position} menu={menu} wrapperClassName="bg-windowsPaper">
      <div className={clsx("absolute inset-0 bg-black", view !== "work" && "invisible")}>
        {seed !== undefined && (
          <iframe
            key={`${seed}-${refreshCount}`}
            ref={iframeRef}
            src={rememberSrc(seed)}
            title={data.items.find(i => i.id === activeId)?.title ?? data.title}
            onLoad={focusPiece}
            className="w-full h-full border-0 block"
          />
        )}
      </div>

      {view === "selector" && <WorkSelector works={data.items} selectedId={activeId} onOpen={openWork} />}

      <div className={clsx("p-4 absolute top-0 left-0 h-full w-full overflow-auto bg-windowsPaper", view === "about" ? "block" : "hidden")}>
        {data.about.map(p => <p key={p} className="mb-4">{p}</p>)}
        <button className="classic-button px-2" onClick={() => setView(seed !== undefined ? "work" : "selector")}>
          <span>Go back</span>
        </button>
      </div>
    </Window>
  )
}

export default RememberWindow
