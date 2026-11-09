import { WINDOWS } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC, useState } from "react"
import clsx from "clsx"
import WorkSelector, { Work } from "../WorkSelector"

type View = "selector" | "piece" | "about"

const CONTRACT = "0x4759A45c80eB04571902df74200F0D8d6c83F070"

// Each piece is the baked page its ETH token's animation_url points to, vendored in public/obh/.
const works: (Work & { token: number })[] = [
  { id: "a", title: "there must be something", thumb: "/images/thumbs/obh-a.jpg", token: 1 },
  { id: "b", title: "there is nothing else", thumb: "/images/thumbs/obh-b.jpg", token: 2 },
  { id: "c", title: "was it all a dream", thumb: "/images/thumbs/obh-c.jpg", token: 3 },
  { id: "d", title: "the abyss gazes back", thumb: "/images/thumbs/obh-d.jpg", token: 4 },
  { id: "e", title: "something was found", thumb: "/images/thumbs/obh-e.jpg", token: 5 },
]

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
      label: "Choose piece",
      function: () => setView("selector")
    },
    {
      label: "About",
      function: () => setView("about")
    },
    ...(active
      ? [{
          label: "Purchase",
          function: () => {
            window.open(`https://opensea.io/assets/ethereum/${CONTRACT}/${active.token}`, "_blank", "noopener")
          }
        }]
      : []),
  ]

  return (
    <Window
      windowKey={WINDOWS.OBH}
      initSize={initSize}
      initPosition={initPos}
      menu={menu}
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

      <div
        className={clsx(
          "p-4 absolute top-0 left-0 h-full w-full overflow-auto bg-amber-50",
          view === "about" ? "block" : "hidden"
        )}
      >
        <p className="font-bold">on being human</p>
        <br />
        {works.map(w => (
          <p key={w.id}>“{w.title}”</p>
        ))}
        <br />
        <p>
          Photographic, generative glitch art by EV3. An original photo
          modified by the Epoch One engine.
        </p>
        <br />
        <p>
          Each piece shows its still first, then starts moving.
        </p>
        <br />
        <button
          className="classic-button px-2"
          onClick={() => setView(active ? "piece" : "selector")}
        >
          <span>Go back</span>
        </button>
      </div>
    </Window>
  )
}

export default OnBeingHumanWindow
