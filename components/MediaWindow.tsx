import { ZeumsItem, ZeumsWindow } from "@/data/zeums"
import clsx from "clsx"
import { FC, useEffect, useRef, useState } from "react"
import usePieceFocus from "@/hooks/usePieceFocus"
import Window, { WindowMenuItem } from "./Window"
import WorkSelector from "./WorkSelector"

type View = "selector" | "work" | "about"

interface MediaWindowProps {
  /** The window's key in WINDOWS, which is also its title. */
  windowKey: string;
  data: ZeumsWindow;
}

/** One zeums entry: a selector of its items (galleries only), the open item, and About. */
const MediaWindow: FC<MediaWindowProps> = ({ windowKey, data }) => {
  const { items } = data
  const isGallery = items.length > 1

  const [view, setView] = useState<View>(isGallery ? "selector" : "work")
  const [activeId, setActiveId] = useState<string | undefined>(isGallery ? undefined : items[0]?.id)
  const [refreshCount, setRefreshCount] = useState(0)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { iframeRef, focusPiece, isMin } = usePieceFocus(windowKey, view === "work")

  const item = items.find(i => i.id === activeId)

  useEffect(() => {
    if (view !== "work" || isMin) videoRef.current?.pause()
  }, [view, isMin, activeId])

  const openWork = (id: string) => {
    setActiveId(id)
    setView("work")
  }

  const menu: WindowMenuItem[] = [
    { label: "Refresh", function: () => setRefreshCount(n => n + 1) },
    { label: "About", function: () => setView("about") },
    ...(isGallery ? [{ label: `Choose ${data.title}`, function: () => setView("selector") }] : []),
  ]

  const renderItem = (item: ZeumsItem) => {
    const key = `${item.id}-${refreshCount}`
    switch (item.kind) {
      case "image":
        return <img key={key} src={item.src} alt={item.title} className="w-full h-full object-contain" />
      case "video":
        return (
          <video
            key={key}
            ref={videoRef}
            src={item.src}
            poster={item.thumb}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
          />
        )
      case "html":
        return (
          <iframe
            key={key}
            ref={iframeRef}
            src={item.src}
            title={item.title}
            onLoad={focusPiece}
            className="w-full h-full border-0 block"
          />
        )
    }
  }

  return (
    <Window windowKey={windowKey} initSize={data.size} initPosition={data.position} menu={menu} wrapperClassName="bg-windowsPaper">
      <div className={clsx("absolute inset-0 bg-black flex items-center justify-center", view !== "work" && "invisible")}>
        {item && renderItem(item)}
      </div>

      {view === "selector" && <WorkSelector works={items} selectedId={activeId} onOpen={openWork} />}

      <div className={clsx("p-4 absolute top-0 left-0 h-full w-full overflow-auto bg-windowsPaper", view === "about" ? "block" : "hidden")}>
        {data.about.map(p => <p key={p} className="mb-4">{p}</p>)}
        <button className="classic-button px-2" onClick={() => setView(item ? "work" : "selector")}>
          <span>Go back</span>
        </button>
      </div>
    </Window>
  )
}

export default MediaWindow
