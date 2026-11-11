import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import { ART_KEYS, matchesSearch, selectorWorks, windowFromId } from "@/data/groups"
import Window from "../Window"
import WorkSelector from "../WorkSelector"
import Button from "../Button"
import { FC, useId, useRef, useState } from "react"

const initSize = { w: 560, h: 420 }
const initPos = { x: 0, y: 80 }

/** Win95's Find: every work, filtered by name or any tag, plus Randomize. */
const FindWindow: FC = () => {
  const { handleOpen } = useWindowsContext()
  const [query, setQuery] = useState("")
  const lastPick = useRef<string>()
  const inputId = useId()

  // From all the works, whatever the query, never the previous pick.
  const randomize = () => {
    const pool = ART_KEYS.filter(key => key !== lastPick.current)
    const pick = pool[Math.floor(Math.random() * pool.length)]
    lastPick.current = pick
    handleOpen(pick)
  }

  const works = selectorWorks(ART_KEYS.filter(key => matchesSearch(key, query)))

  return (
    <Window windowKey={WINDOWS.FIND} initSize={initSize} initPosition={initPos}>
      <div className="p95-chrome absolute inset-0 flex flex-col bg-windowsGray text-windowsText">
        {/* Randomize at the window's left, at x 0: every work opens at x 60 or more, so the work it opens can't cover it. */}
        <div className="flex items-center gap-2 p-1.5">
          <Button className="[--p95-dots:4px] pointer-events-auto flex-none min-w-[75px] h-[23px] px-2" onClick={randomize}>
            <span>Randomize</span>
          </Button>
          <label htmlFor={inputId} className="flex-none">
            <span className="underline">S</span>earch:
          </label>
          <div className="classic-inset p95-field flex-1 min-w-0 h-[21px]">
            <input
              id={inputId}
              type="text"
              autoFocus
              autoComplete="off"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="px-1 outline-none w-full h-full"
            />
          </div>
        </div>
        {/* Keyed by the query, so the selection resets as the list changes. */}
        <div className="relative flex-1 min-h-0">
          <WorkSelector key={query} works={works} onOpen={id => handleOpen(windowFromId(id))} />
        </div>
      </div>
    </Window>
  )
}

export default FindWindow
