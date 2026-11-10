import { FC } from "react"

/** A Win95 push button centered over a ready video; it starts the video. */
const PlayButton: FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <button className="classic-button pointer-events-auto flex items-center gap-2 px-4 py-1" onClick={onClick}>
      <svg width="8" height="10" viewBox="0 0 8 10" aria-hidden="true" fill="currentColor" shapeRendering="crispEdges">
        <path d="M0 0L8 5L0 10Z" />
      </svg>
      <span>Play</span>
    </button>
  </div>
)

export default PlayButton
