import { ZeumsItem, ZeumsWindow } from "@/data/zeums"
import clsx from "clsx"
import Image from "next/image"
import { FC, Ref, useEffect, useRef, useState } from "react"
import usePieceFocus from "@/hooks/usePieceFocus"
import Loading from "./Loading"
import PlayButton from "./PlayButton"
import Window, { WindowMenuItem } from "./Window"
import WorkSelector from "./WorkSelector"

type View = "selector" | "work" | "about"

interface WorkMediaProps {
  /** An image or video item. */
  item: ZeumsItem;
  /** Show the original Blob file instead of the optimized copy. */
  fullRes: boolean;
  ready: boolean;
  onReady: () => void;
  onPlaying: () => void;
  videoRef: Ref<HTMLVideoElement>;
}

/**
 * An open image or video work. By default an image goes through the image optimizer and a video
 * plays its display copy; Full Res shows the original file. Transparent and unclickable until ready.
 */
export const WorkMedia: FC<WorkMediaProps> = ({ item, fullRes, ready, onReady, onPlaying, videoRef }) => {
  const hidden = !ready && "opacity-0 pointer-events-none"

  if (item.kind === "image") {
    const image = { src: item.src, alt: item.title, onLoad: onReady, onError: onReady }
    return fullRes ? (
      <img
        {...image}
        // A cached image can finish before React attaches onLoad (next/image handles this itself).
        ref={el => { if (el?.complete && el.naturalWidth) onReady() }}
        className={clsx("w-full h-full object-contain", hidden)}
      />
    ) : (
      <Image {...image} fill sizes="100vw" quality={90} className={clsx("object-contain", hidden)} />
    )
  }

  return (
    <video
      ref={videoRef}
      src={fullRes ? item.src : item.display ?? item.src}
      poster={item.thumb}
      controls
      playsInline
      preload="auto"
      // Ready once the browser expects to play to the end without stopping to buffer.
      onCanPlayThrough={onReady}
      // A browser that stays idle short of playable data (one that won't preload) is as ready as
      // it gets. Chrome also suspends briefly when reusing cached data, hence the wait.
      onSuspend={e => {
        const video = e.currentTarget
        setTimeout(() => {
          if (video.readyState < video.HAVE_FUTURE_DATA && video.networkState === video.NETWORK_IDLE) onReady()
        }, 1000)
      }}
      onError={onReady}
      onPlaying={onPlaying}
      tabIndex={ready ? undefined : -1}
      className={clsx("w-full h-full object-contain", hidden)}
    />
  )
}

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
  const [mountCount, setMountCount] = useState(0)
  // Whether the open image or video shows its original file; each newly opened item starts optimized.
  const [fullRes, setFullRes] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { iframeRef, focusPiece, isMin } = usePieceFocus(windowKey, view === "work")

  const item = items.find(i => i.id === activeId)

  useEffect(() => {
    if (view !== "work" || isMin) videoRef.current?.pause()
  }, [view, isMin, activeId])

  const openWork = (id: string) => {
    // Opening another item mounts it fresh, optimized; reopening the open one keeps its mount.
    if (id !== activeId) {
      setMountCount(n => n + 1)
      setFullRes(false)
    }
    setActiveId(id)
    setView("work")
  }

  // Full Res only where a higher-res version exists: every image, and a video with a display copy.
  const hasFullRes = item?.kind === "image" || (item?.kind === "video" && !!item.display)

  const menu: WindowMenuItem[] = [
    ...(isGallery ? [{ label: "Select Piece", function: () => setView("selector") }] : []),
    { label: "Refresh", function: () => setMountCount(n => n + 1) },
    ...(hasFullRes
      ? [{ label: fullRes ? "Optimized" : "Full Res", function: () => { setFullRes(f => !f); setView("work") } }]
      : []),
    { label: "About", function: () => setView("about") },
  ]

  // The open item's mount key, new on each open of another item, on Refresh, which restarts a
  // video and reloads an iframe, and on switching Full Res.
  const itemKey = item && `${item.id}-${mountCount}${fullRes ? "-full" : ""}`
  // The mount key whose image or video is ready; until it matches the open one, the work is
  // transparent and Loading shows.
  const [readyKey, setReadyKey] = useState<string>()
  const markReady = () => setReadyKey(itemKey)
  const ready = readyKey === itemKey
  // The mount key whose video has started playing; Play shows over a ready video until then.
  const [startedKey, setStartedKey] = useState<string>()

  return (
    <Window windowKey={windowKey} initSize={data.size} initPosition={data.position} menu={menu} wrapperClassName="bg-windowsPaper">
      <div className={clsx("absolute inset-0 bg-black flex items-center justify-center", view !== "work" && "invisible")}>
        {item && (item.kind === "html" ? (
          <iframe
            key={itemKey}
            ref={iframeRef}
            src={item.src}
            title={item.title}
            onLoad={focusPiece}
            className="w-full h-full border-0 block"
          />
        ) : (
          <WorkMedia
            key={itemKey}
            item={item}
            fullRes={fullRes}
            ready={ready}
            onReady={markReady}
            onPlaying={() => setStartedKey(itemKey)}
            videoRef={videoRef}
          />
        ))}
        {item && item.kind !== "html" && !ready && <Loading />}
        {item?.kind === "video" && ready && startedKey !== itemKey && <PlayButton onClick={() => videoRef.current?.play()} />}
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
