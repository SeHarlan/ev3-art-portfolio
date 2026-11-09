import clsx from "clsx"
import { FC } from "react"
import { Work } from "../WorkSelector"

// Each piece is the baked page its ETH token's animation_url points to, vendored in public/obh/.
export const works: Work[] = [
  { id: "a", title: "A: there must be something", thumb: "/images/thumbs/obh-a.jpg" },
  { id: "b", title: "B: there is nothing else", thumb: "/images/thumbs/obh-b.jpg" },
  { id: "c", title: "C: was it all a dream", thumb: "/images/thumbs/obh-c.jpg" },
  { id: "d", title: "D: the abyss gazes back", thumb: "/images/thumbs/obh-d.jpg" },
  { id: "e", title: "E: something was found", thumb: "/images/thumbs/obh-e.jpg" },
]

// The Manifold page of the collection (contract 0x4759A45c80eB04571902df74200F0D8d6c83F070).
export const PURCHASE_URL = "https://manifold.xyz/@ev3/contract/124346608"

interface AboutProps {
  visible: boolean;
  onBack: () => void;
}

export const About: FC<AboutProps> = ({ visible, onBack }) => (
  // classic-inset redraws the sunken well this covers, as the selector does.
  <div
    className={clsx(
      "classic-inset p-4 absolute top-0 left-0 h-full w-full overflow-auto bg-amber-50",
      visible ? "block" : "hidden"
    )}
  >
    <p className="font-bold">on being human</p>
    <br />
    <p>A series of personal photographs glitched to enshrine the emotions and moments they hold.</p>
    <br />
    {works.map(w => (
      <p key={w.id}>{w.title}</p>
    ))}
    <br />
    <button
      className="classic-button px-2"
      onClick={onBack}
    >
      <span>Go back</span>
    </button>
  </div>
)
