import clsx from "clsx"
import { ChangeEvent, FC, KeyboardEvent, useEffect, useRef, useState } from "react"

interface SeedDropdownProps {
  seedOpen: boolean
  setSeedOpen: (open: boolean) => void
  onUseSeed: (seed: string) => void
  /** A text area for long seeds: Enter uses the seed, Shift+Enter adds a line. */
  multiline?: boolean
  /** Fills the field each time the dropdown opens. */
  initialSeed?: string
}

const SeedDropdown: FC<SeedDropdownProps> = ({ onUseSeed, seedOpen, setSeedOpen, multiline = false, initialSeed }) => {
  const [seed, setSeed] = useState("")
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const useSeed = () => {
    onUseSeed(seed)
    setSeedOpen(false)
  }
  const clearSeed = () => {
    setSeed("")
    onUseSeed("")
    setSeedOpen(false)
  }

  useEffect(() => {
    if (seedOpen && initialSeed !== undefined) setSeed(initialSeed)
  }, [seedOpen, initialSeed])

  useEffect(() => {
    if (seedOpen) {
      inputRef.current?.focus()
    }
    return() => inputRef.current?.blur()
  })

  const fieldProps = {
    value: seed,
    placeholder: "Seed",
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSeed(e.target.value),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" && !(multiline && e.shiftKey)) {
        e.preventDefault()
        useSeed()
      } else if (e.key === "Escape") {
        setSeedOpen(false)
      }
    },
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
      onKeyDown={(e) => {
        // Memories have spaces, so only the single-line field blocks them.
        if (e.key === " " && !multiline) {
          e.preventDefault()
        }
      }}
      onKeyUp={(e) => {
        // The dropdown sits inside its menu button, which a space keyup would click, closing it.
        if (e.key === " ") {
          e.preventDefault()
        }
      }}
      className={clsx(
      seedOpen ? "flex flex-col items-start " : "hidden",
        "p95-chrome bg-windowsGray text-windowsText classic-border p-2 shadow-md absolute top-full left-0 cursor-default z-30",
        "w-[20rem] max-w-[calc(100vw-1rem)] pointer-events-auto"
    )}>
      <div className="classic-inset p95-field w-full">
        {multiline
          ? <textarea {...fieldProps} ref={el => { inputRef.current = el }} rows={8} className="px-1 outline-none w-full resize-none block" />
          : <input {...fieldProps} ref={el => { inputRef.current = el }} type="text" className="px-1 outline-none w-full" />}
      </div>

      <div className="flex justify-end gap-2 w-full mt-1 p-0.5">
        <button className="classic-button px-2" onClick={clearSeed}>
          <span>clear</span>
        </button>
        <button className="classic-button px-2" onClick={useSeed}>
          <span>use</span>
        </button>
      </div>
    </div>
  )
}

export default SeedDropdown
