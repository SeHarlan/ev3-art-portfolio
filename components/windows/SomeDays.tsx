import { WINDOWS } from "@/context/WindowsProvider"
import { ZeumsWindow } from "@/data/zeums"
import { FC } from "react"
import MediaWindow from "../MediaWindow"

// "some days" as published on zeums: the video recorded from its GLSL sketch, served from the Blob store.
const SOMEDAYS: ZeumsWindow = {
  title: "some days",
  about: [
    "A poem about running from a dark melancholy: some days pulling free of the fog, some days caught in it, and choosing each time to begin the trek again.",
    "The video was recorded from a GLSL algorithm EV3 wrote for it.",
  ],
  size: { w: 600, h: 900 },
  position: { x: 200, y: 10 },
  items: [
    {
      id: "some-days",
      title: "some days",
      kind: "video",
      src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/somedays/B6A1z61cRcakU6qUzGaO5NIrBl5Jlg1QBWcQA0OkLDM-wBgxfRHQNPCrrE8aatr6tVjaeBkylf.mp4",
      thumb: "/images/thumbs/somedays-some-days.jpg",
    },
  ],
}

const SomeDaysWindow: FC = () => <MediaWindow windowKey={WINDOWS.SOMEDAYS} data={SOMEDAYS} />

export default SomeDaysWindow
