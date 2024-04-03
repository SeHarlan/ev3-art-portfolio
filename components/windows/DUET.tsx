import { WINDOWS } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC } from "react"
import dynamic from "next/dynamic";
const Duet = dynamic(() => import('../p5/DUET'), { ssr: false });

const DuetWindow: FC = () => {
  const initSize = {
    h: 800,
    w: 1300,
  }
  const initPos = {
    x: 100,
    y: 60
  }

  const visit = () => {
    window?.open("https://collector.sh/EV3/Long-Form_Generative", "_blank")
  }

  const menu: WindowMenuItem[] = [
    {
      label: "Collect",
      function: visit
    },
  ]

  return (
    <Window windowKey={WINDOWS.DUET} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      <Duet className=""/>
    </Window>
  )
}

export default DuetWindow