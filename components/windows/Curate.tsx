import { WINDOWS } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC } from "react"
import Link from "next/link"

const CurateWindow: FC = () => {
  const initSize = {
    h: 800,
    w: 1300,
  }
  const initPos = {
    x: 100,
    y: 60
  }

  const link = "https://curate-landing.vercel.app/"

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
    <Window windowKey={WINDOWS.CURATE} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      <div className="p-2 h-full">
        <Link className="text-lg font-bold underline" href={link} target="_blank">Curate (Concept Landing Page)</Link>
        <br />
        <p>This is a landing page I designed for a conceptual, art focused social media platform.</p>
        <p>I used p5js to create a few different generative art pieces that formed the backdrops and attention grabbers for these landing pages</p>
        <br />
        <p>In addition to this main fully fleshed out concept, I also made a few others that were less complete:</p>
        <div className="flex gap-3">
          <Link className="underline" href="https://curate-landing.vercel.app/abstract" target="_blank">Abstract</Link>
          <Link className="underline" href="https://curate-landing.vercel.app/glitch" target="_blank">Glitch</Link>
          <Link className="underline" href="https://curate-landing.vercel.app/abril" target="_blank">Traditional</Link>
        </div>
        <br />
        <div className="classic-inset h-full">
          <iframe src={link} className="w-full h-full" />
          <div className="h-2" />
        </div>
      </div>
    </Window>
  )
}

export default CurateWindow