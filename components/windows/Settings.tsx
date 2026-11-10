import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import { GroupBy } from "@/data/groups"
import { Theme, useThemeContext } from "@/context/ThemeProvider"
import Window from "../Window"
import Button from "../Button"
import clsx from "clsx"
import { FC } from "react"

const PALETTES: { theme: Theme, label: string }[] = [
  { theme: "gray", label: "Standard" },
  { theme: "win95", label: "Classic" },
  { theme: "bw", label: "1-Bit" },
]

const GROUP_BY_OPTIONS: { groupBy: GroupBy, label: string }[] = [
  { groupBy: "year", label: "Year" },
  { groupBy: "media", label: "Media" },
  { groupBy: "experience", label: "Experience" },
]

const SettingsWindow: FC = () => {
  const { theme, setTheme } = useThemeContext()
  const { groupBy, setGroupBy } = useWindowsContext()

  const initSize = {
    h: 230,
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
              <Button
                key={palette.theme}
                className={clsx("[--p95-dots:4px] min-w-[75px] h-[23px] px-2", { active: selected })}
                aria-pressed={selected}
                onClick={() => setTheme(palette.theme)}
              >
                <span>{palette.label}</span>
              </Button>
            )
          })}
        </div>
        <p>Group by</p>
        <div className="flex gap-1.5" role="group" aria-label="Group by">
          {GROUP_BY_OPTIONS.map(option => {
            const selected = groupBy === option.groupBy
            return (
              <Button
                key={option.groupBy}
                className={clsx("[--p95-dots:4px] min-w-[75px] h-[23px] px-2", { active: selected })}
                aria-pressed={selected}
                onClick={() => setGroupBy(option.groupBy)}
              >
                <span>{option.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </Window>
  )
}

export default SettingsWindow
