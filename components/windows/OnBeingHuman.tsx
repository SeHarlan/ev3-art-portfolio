import { WINDOWS } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC, useState } from "react"
import clsx from "clsx"
import WorkSelector from "../WorkSelector"
import { About, PURCHASE_URL, works } from "./obh"

type View = "selector" | "piece" | "about"

const OnBeingHumanWindow: FC = () => {
  const [view, setView] = useState<View>("selector")
  const [activeId, setActiveId] = useState<string>()

  const initSize = {
    h: 890 * 1.4,
    w: 560 * 1.4,
  }
  const initPos = {
    x: 200,
    y: 0
  }

  const active = works.find(w => w.id === activeId)

  const openWork = (id: string) => {
    setActiveId(id)
    setView("piece")
  }

  const menu: WindowMenuItem[] = [
    {
      label: "Select Piece",
      function: () => setView("selector")
    },
    {
      label: "About",
      function: () => setView("about")
    },
    {
      label: "Purchase",
      function: () => window.open(PURCHASE_URL, "_blank", "noopener")
    },
  ]

  return (
    <Window
      windowKey={WINDOWS.OBH}
      initSize={initSize}
      initPosition={initPos}
      menu={menu}
      inset={view !== "selector"}
      wrapperClassName="bg-black"
    >
      <div
        className={clsx(
          "w-full h-full",
          view === "piece" ? "block" : "hidden"
        )}
      >
        {active && (
          <iframe
            key={active.id}
            src={`/obh/${active.id}.html`}
            title={active.title}
            className="w-full h-full block border-0"
          />
        )}
      </div>

      {view === "selector" && (
        <WorkSelector works={works} selectedId={activeId} onOpen={openWork} />
      )}

      <About
        visible={view === "about"}
        onBack={() => setView(active ? "piece" : "selector")}
      />
    </Window>
  )
}

export default OnBeingHumanWindow
