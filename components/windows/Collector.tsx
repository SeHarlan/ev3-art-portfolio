import { WINDOWS } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC } from "react"
import Link from "next/link"

const CollectorWindow: FC = () => {
  const initSize = {
    h: 1000,
    w: 1300,
  }
  const initPos = {
    x: 360,
    y: 80
  }

  const link = "https://collector.sh/"

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
    <Window windowKey={WINDOWS.COLLECTOR} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      <div className="p-2 h-full">
        <Link className="text-lg font-bold underline" href={link} target="_blank">Collector</Link>
        <br />
        <p>As co-founder and lead engineer, Collector has been the most challenging and most rewarding project I've ever done.</p>
        <br />
        <p>One new and exciting experience for me was helping come up with the design and user experience of this digital art gallery platform. On the technical side of things I've learned a lot. Among many other things, how to build operational infrastructure, coding scripts that run daily to sync our database with blockchain metadata and optimizing Solana blockchain transactions.</p>
        <br />
        <p>The biggest feature of Collector is the ability to display any and all of your art collected on a blockchain in customizable pages.</p>
        <p>In order to get such a large number of high-quality images displayed on one page I had to implement a multi tiered system of cached images with a CDN and backups from blockchain metadata. I combined this with a nuanced lazy loading system to make sure that both the DOM/Display and download bandwidth were balanced and optimized for a smooth viewing experience.</p>
        <br />
        <div className="classic-inset h-full">
          <iframe src={link} className="w-full h-full" />
          <div className="h-2" />
        </div>
      </div>
    </Window>
  )
}

export default CollectorWindow