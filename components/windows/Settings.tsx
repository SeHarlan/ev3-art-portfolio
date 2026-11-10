import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import { GroupBy } from "@/data/groups"
import { Theme, useThemeContext } from "@/context/ThemeProvider"
import Window from "../Window"
import Button from "../Button"
import clsx from "clsx"
import { FC } from "react"

const PALETTES: { value: Theme, label: string }[] = [
  { value: "gray", label: "Standard" },
  { value: "win95", label: "Classic" },
  { value: "bw", label: "1-Bit" },
]

const GROUP_BY_OPTIONS: { value: GroupBy, label: string }[] = [
  { value: "year", label: "Year" },
  { value: "media", label: "Media" },
  { value: "experience", label: "Experience" },
]

/** A label over a row of Win95 toggle buttons, one pressed. */
const OptionRow = <T extends string>({ label, options, value, onChange }: {
  label: string,
  options: { value: T, label: string }[],
  value: T,
  onChange: (value: T) => void,
}) => (
  <>
    <p>{label}</p>
    <div className="flex gap-1.5" role="group" aria-label={label}>
      {options.map(option => {
        const selected = value === option.value
        return (
          <Button
            key={option.value}
            className={clsx("[--p95-dots:4px] min-w-[75px] h-[23px] px-2", { active: selected })}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
          >
            <span>{option.label}</span>
          </Button>
        )
      })}
    </div>
  </>
)

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
        <OptionRow label="Color palette" options={PALETTES} value={theme} onChange={setTheme} />
        <OptionRow label="Group by" options={GROUP_BY_OPTIONS} value={groupBy} onChange={setGroupBy} />
      </div>
    </Window>
  )
}

export default SettingsWindow
