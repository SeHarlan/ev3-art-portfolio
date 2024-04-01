import { WINDOWS } from "@/context/WindowsProvider"
import Window, { WindowMenuItem } from "../Window"
import { FC } from "react"
import Link from "next/link"

const NodeMonkeyWindow: FC = () => {
  const initSize = {
    h: 800,
    w: 800,
  }
  const initPos = {
    x: 160,
    y: 280
  }

  const link = "https://marketplace.nodemonkey.io/"

  const visit = () => {
    window?.open(link, "_blank")
  }

  const menu: WindowMenuItem[] = [
    {
      label: "Visit Site",
      function: visit
    },
  ]

  return null;

  return (
    <Window windowKey={""} initSize={initSize} initPosition={initPos} menu={menu} wrapperClassName="bg-amber-50">
      <div className="p-2 h-full">
        <Link className="text-lg font-bold underline" href={link} target="_blank">NodeMonkey Staking and Renting Site</Link>
        <br />
        <p>For this website I created the Front End and connected it to an existing Back End for the more complex rental and staking features.</p>
        <p>I also helped develope a two part login system, where a user signs a message/transaction, which is then sent to the backend in order to verify their wallet.</p>
        <br />
        <p>Once logging in, NFT owners can stake their NodeMonkey NFTs and set prices and availability for renting. Potential renters can request a time frame and are given available options.</p>
        <br />
        <div className="classic-inset h-full">
          <iframe src={link} className="w-full h-full" />
          <div className="h-2" />
        </div>
      </div>
    </Window>
  )
}

export default NodeMonkeyWindow