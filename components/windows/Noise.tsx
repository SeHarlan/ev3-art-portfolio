import { WINDOWS } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC } from "react"
import dynamic from "next/dynamic";
const Noise = dynamic(() => import('../p5/Noise'), { ssr: false });

const NoiseWindow: FC = () => {
  const initSize = {
    h: 800,
    w: 1300,
  }
  const initPos = {
    x: 100,
    y: 60
  }

  const link = "noise tensor"

  const visit = () => {
    window?.open("https://www.tensor.trade/trade/its_just_noise", "_blank")
  }

  const menu: WindowMenuItem[] = [
    {
      label: "Trade",
      function: visit
    },
  ]

  return (
    <Window windowKey={WINDOWS.NOISE} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      <Noise className=""/>
    </Window>
  )
}

export default NoiseWindow