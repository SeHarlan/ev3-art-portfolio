import clsx from "clsx"
import { FC } from "react"

/** The one loading state, shown over a work until it can be seen or played. Restyle it here and every window follows. */
const Loading: FC<{ className?: string }> = ({ className }) => (
  <div className={clsx("absolute inset-0 flex items-center justify-center pointer-events-none", className)}>
    <p className="animate-pulse text-white">loading...</p>
  </div>
)

export default Loading
