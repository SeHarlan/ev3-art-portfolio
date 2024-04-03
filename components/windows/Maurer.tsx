import { WINDOWS } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC } from "react"
import Link from "next/link"
import dynamic from "next/dynamic";
const Maurer = dynamic(() => import('../p5/Maurer'), { ssr: false });

const MaurerWindow: FC = () => {
  const initSize = {
    h: 800,
    w: 1100,
  }
  const initPos = {
    x: 200,
    y: 80
  }


  const visitVoid = () => {
    window?.open("https://exchange.art/editions/73TRBEAjF6LSTwwmyPwyNeMTruNyej99iqh339s1PWdy", "_blank")
  }
  const visitInk = () => { 
    window?.open("https://exchange.art/editions/DZizSX75MZRqNtAnk3heJC2U726x3cq7W2VCvb7raJFb", "_blank")
  }
  const visitNeon = () => {
    window?.open("https://exchange.art/editions/5YduTApZp1EQYe25xKgf3J2XoqdCQxddHP5wb6RNcVyn", "_blank")
  }

  const menu: WindowMenuItem[] = [
    {
      label: "Trade (Void)",
      function: visitVoid
    },
    {
      label: "Trade (Ink)",
      function: visitInk
    },
    {
      label: "Trade (Neon)",
      function: visitNeon
    },
  ]

  return (
    <Window windowKey={WINDOWS.MAURER} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      <Maurer className="" />
    </Window>
  )
}

export default MaurerWindow