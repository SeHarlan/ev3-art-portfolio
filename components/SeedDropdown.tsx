import clsx from "clsx"
import { FC, useEffect, useRef, useState } from "react"

interface SeedDropdownProps { 
  seedOpen: boolean
  setSeedOpen: (open: boolean) => void
  onUseSeed: (seed: string) => void
}

const SeedDropdown: FC<SeedDropdownProps> = ({ onUseSeed, seedOpen, setSeedOpen }) => { 
  const [seed, setSeed] = useState("")
  const inputRef = useRef<HTMLInputElement | null>(null)
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
    if (seedOpen) {
      inputRef.current?.focus()
    }
    return() => inputRef.current?.blur()
  })
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
      onKeyDown={(e) => { 
        if (e.key === " ") {
          e.preventDefault()
        }
      }}    
      className={clsx(
      seedOpen ? "flex flex-col items-start " : "hidden",
        "bg-windowsGray classic-border p-2 shadow-md absolute top-full left-0 cursor-default z-30",
        "w-[20rem] max-w-[calc(100vw-1rem)] pointer-events-auto"
    )}>
      <div className="classic-inset bg-white w-full text-black">
        <input
          type="text"
          ref={inputRef}
          className={clsx("bg-none px-1 text-black outline-none w-full")}
          onKeyDown={(e) => { 
            if (e.key === "Enter") {
              useSeed()
            } else if (e.key === "Escape") { 
              setSeedOpen(false)
            } 
          }}
          onChange={(e) => {
           
            setSeed(e.target.value)
            
          }}
          value={seed}
          placeholder="Seed"
        />
      </div>
    
      <div className="flex justify-end gap-2 w-full mt-1 p-0.5">
        <button className="classic-button px-2" onClick={clearSeed}>
          clear
        </button>
        <button className="classic-button px-2" onClick={useSeed}>
          use
        </button>
      </div>
    </div>
  )
}

export default SeedDropdown