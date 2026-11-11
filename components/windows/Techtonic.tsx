import { WINDOWS } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC } from "react"

const SITE = "https://techtonic.ev3.art/"

const TechtonicWindow: FC = () => {
  const initSize = {
    h: 800,
    w: 1300,
  }
  const initPos = {
    x: 180,
    y: 40
  }

  const visit = () => {
    typeof window !== "undefined" && window.open(SITE, "_blank")
  }

  const menu: WindowMenuItem[] = [
    {
      label: "Visit",
      function: visit
    },
  ]

  return (
    <Window windowKey={WINDOWS.TECHTONIC} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-black">
      <div className="w-full h-full flex items-center justify-center">
        <a href={SITE} target="_blank" rel="noreferrer" className="classic-button px-4 py-1">
          <span>Visit techtonic</span>
        </a>
      </div>
    </Window>
  )
}

export default TechtonicWindow
