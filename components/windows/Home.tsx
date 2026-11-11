import { FC, useState, useEffect, useRef } from "react"
import { WINDOWS, useWindowsContext } from "../../context/WindowsProvider"
import { ART_KEYS } from "../../data/groups"
import Window, { WindowMenuItem } from "../Window"
import Links from "../Links"

const TECHTONIC_SITE = "https://techtonic.ev3.art/"

const CHAR_DELAY = 8
const BREAK_DELAY = 60

const randomArtKey = () => ART_KEYS[Math.floor(Math.random() * ART_KEYS.length)]

type Segment =
  | { type: "text", text: string }
  | { type: "window", text: string, windowKey: string | (() => string) }
  | { type: "href", text: string, href: string }

type Line =
  | { type: "p" | "li", segments: Segment[] }
  | { type: "element", element: JSX.Element }

const text = (text: string): Segment => ({ type: "text", text })

const contentList: Line[] = [
  { type: "p", segments: [text("I am EV3.")] },
  { type: "p", segments: [text("I explore art with code.")] },
  { type: "p", segments: [text("I have recently finished two large projects:")] },
  { type: "li", segments: [
    { type: "window", text: "Sk3tch", windowKey: WINDOWS.SK3TCH },
    text(", an interactive glitch drawing program. Showcased as an interactive installation in London, 2026 for the “mallow x Caravana: A Group Show” exhibit."),
  ] },
  { type: "li", segments: [
    { type: "href", text: "Techtonic", href: TECHTONIC_SITE },
    text(", a long-form generative art project that combines pixel and glitch elements with organic movements, ebbing and flowing over time."),
  ] },
  { type: "p", segments: [
    text("To explore my full portfolio double click on any of the folders, or "),
    { type: "window", text: "click here", windowKey: randomArtKey },
    text(" for a random piece."),
  ] },
  { type: "p", segments: [
    text("Click "),
    { type: "window", text: "My Computer", windowKey: WINDOWS.SETTINGS },
    text(" to sort the works into different groupings and change other elements of the site."),
  ] },
  { type: "p", segments: [text("Enjoy,")] },
  { type: "p", segments: [text("EV3")] },
  { type: "element", element: <Links className="p-2 flex gap-2 w-full justify-center" /> },
]

// Each line types as one run of characters; an element counts as one.
const lineLength = (line: Line) =>
  line.type === "element" ? 1 : line.segments.reduce((sum, segment) => sum + segment.text.length, 0)

const lineEnds = contentList.reduce<number[]>((ends, line) => [...ends, (ends[ends.length - 1] ?? 0) + lineLength(line)], [])
const totalLength = lineEnds[lineEnds.length - 1]

const renderSegment = (segment: Segment, shown: number, key: number) => {
  const visible = segment.text.slice(0, shown)
  switch (segment.type) {
    case "window": return <WindowLink key={key} windowKey={segment.windowKey} label={visible} />
    case "href": return <a key={key} href={segment.href} target="_blank" rel="noreferrer" className="underline">{visible}</a>
    default: return <span key={key}>{visible}</span>
  }
}

/** The lines as far as `typed` characters, consecutive list items grouped into one list. */
const renderContent = (typed: number) => {
  const blocks: JSX.Element[] = []
  let items: JSX.Element[] = []
  const flushList = () => {
    if (!items.length) return
    blocks.push(<ul key={`list-${blocks.length}`} className="list-disc list-outside pl-5 mb-3">{items}</ul>)
    items = []
  }

  contentList.forEach((line, index) => {
    const start = index ? lineEnds[index - 1] : 0
    let remaining = Math.min(typed - start, lineLength(line))
    if (remaining <= 0) return

    if (line.type === "element") {
      flushList()
      blocks.push(<div key={index}>{line.element}</div>)
      return
    }

    const segments: JSX.Element[] = []
    line.segments.forEach((segment, segmentIndex) => {
      if (remaining <= 0) return
      const shown = Math.min(remaining, segment.text.length)
      segments.push(renderSegment(segment, shown, segmentIndex))
      remaining -= shown
    })

    if (line.type === "li") items.push(<li key={index}>{segments}</li>)
    else {
      flushList()
      blocks.push(<p key={index} className="mb-3">{segments}</p>)
    }
  })
  flushList()
  return blocks
}

const HomeWindow: FC = () => {
  const [typed, setTyped] = useState(0)
  const [isSkipping, setIsSkipping] = useState(false)
  const myDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typed >= totalLength) return
    // Pause only after a line ends, never between segments of one line.
    const delay = lineEnds.includes(typed) ? BREAK_DELAY : CHAR_DELAY
    const timerId = setTimeout(() => setTyped(prev => prev + 1), delay)
    return () => clearTimeout(timerId)
  }, [typed])

  useEffect(() => {
    if (!myDivRef.current || isSkipping) return;
    // Scroll to the bottom of the div while typing
    myDivRef.current.scrollTop = myDivRef.current.scrollHeight;
  }, [typed, isSkipping]);

  const menu: WindowMenuItem[] = [
    {
      label: "Skip",
      function: () => {
        setIsSkipping(true)
        setTyped(totalLength)
      }
    },
    {
      label: "Reset",
      function: () => {
        setIsSkipping(false)
        setTyped(0)
      }
    }
  ]

  const initSize = {
    h: 420,
    w: 420,
  }
  const initPos = {
    x: 150,
    y: 100
  }

  return (
    <Window windowKey={WINDOWS.HOME} initSize={initSize} initPosition={initPos} menu={menu}>
      <div className="bg-windowsPaper h-full overflow-x-hidden p-3" ref={myDivRef}>
        {renderContent(typed)}
      </div>
    </Window>
  )
}

export default HomeWindow

const WindowLink: FC<{ windowKey: string | (() => string), label: string }> = ({ windowKey, label }) => {
  const { handleOpen } = useWindowsContext()

  const open = () => handleOpen(typeof windowKey === "function" ? windowKey() : windowKey);
  return (
    <button onClick={open} className="underline">
      {label}
    </button>
  )
}
