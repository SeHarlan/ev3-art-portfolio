import { WINDOWS } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC } from "react"
import Link from "next/link"
import dynamic from "next/dynamic";
const Maurer = dynamic(() => import('../p5/Maurer'), { ssr: false });

const MBBWindow: FC = () => {
  const initSize = {
    h: 800,
    w: 1100,
  }
  const initPos = {
    x: 200,
    y: 80
  }

  const link = "https://rarity.monkeybaby.business/"

  const visit = () => { 
    window?.open(link, "_blank")
  }

  const menu: WindowMenuItem[] = [
    {
      label: "Visit Site",
      function: visit
    },
  ]

  return (
    <Window windowKey={WINDOWS.MBB} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      
        <Maurer className="" />
  
    </Window>
  )
}

export default MBBWindow