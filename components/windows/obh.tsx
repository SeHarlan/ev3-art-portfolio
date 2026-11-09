import clsx from "clsx"
import { FC } from "react"
import { Work } from "../WorkSelector"

const CONTRACT = "0x4759A45c80eB04571902df74200F0D8d6c83F070"

// Each piece is the baked page its ETH token's animation_url points to, vendored in public/obh/.
export const works: (Work & { token: number })[] = [
  { id: "a", title: "A: there must be something", thumb: "/images/thumbs/obh-a.jpg", token: 1 },
  { id: "b", title: "B: there is nothing else", thumb: "/images/thumbs/obh-b.jpg", token: 2 },
  { id: "c", title: "C: was it all a dream", thumb: "/images/thumbs/obh-c.jpg", token: 3 },
  { id: "d", title: "D: the abyss gazes back", thumb: "/images/thumbs/obh-d.jpg", token: 4 },
  { id: "e", title: "E: something was found", thumb: "/images/thumbs/obh-e.jpg", token: 5 },
]

export const purchaseUrl = (token: number) =>
  `https://opensea.io/assets/ethereum/${CONTRACT}/${token}`

interface AboutProps {
  visible: boolean;
  onBack: () => void;
}

export const About: FC<AboutProps> = ({ visible, onBack }) => (
  <div
    className={clsx(
      "p-4 absolute top-0 left-0 h-full w-full overflow-auto bg-amber-50",
      visible ? "block" : "hidden"
    )}
  >
    <p className="font-bold">on being human</p>
    <br />
    {works.map(w => (
      <p key={w.id}>“{w.title}”</p>
    ))}
    <br />
    <p>
      Photographic, generative glitch art by EV3. An original photo
      modified by the Epoch One engine.
    </p>
    <br />
    <p>
      Each piece shows its still first, then starts moving.
    </p>
    <br />
    <button
      className="classic-button px-2"
      onClick={onBack}
    >
      <span>Go back</span>
    </button>
  </div>
)
