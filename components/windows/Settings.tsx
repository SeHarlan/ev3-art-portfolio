import { WINDOWS } from "@/context/WindowsProvider"
import { Theme, useThemeContext } from "@/context/ThemeProvider"
import Window from "../Window"
import clsx from "clsx"
import { FC } from "react"

const PALETTES: { theme: Theme, label: string }[] = [
  { theme: "gray", label: "Standard" },
  { theme: "win95", label: "Classic" },
  { theme: "bw", label: "1-Bit" },
]

const SettingsWindow: FC = () => {
  const { theme, setTheme } = useThemeContext()

  const initSize = {
    h: 170,
    w: 300,
  }
  const initPos = {
    x: 260,
    y: 140
  }

  return (
    <Window windowKey={WINDOWS.SETTINGS} initSize={initSize} initPosition={initPos} wrapperClassName="bg-windowsGray">
      <div className="p95-chrome text-windowsText p-3 flex flex-col gap-2">
        <p>Color palette</p>
        <div className="flex gap-1.5" role="group" aria-label="Color palette">
          {PALETTES.map(palette => {
            const selected = theme === palette.theme
            return (
              <button
                key={palette.theme}
                className={clsx("classic-button [--p95-dots:4px] min-w-[75px] h-[23px] px-2", { active: selected })}
                aria-pressed={selected}
                onClick={() => setTheme(palette.theme)}
              >
                <span>{palette.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </Window>
  )
}

export default SettingsWindow
