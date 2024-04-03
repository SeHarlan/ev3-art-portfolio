import { FC } from "react"
import { SVGProps } from "../../types/global"
import clsx from "clsx";

const TwitterIcon: FC<SVGProps> = ({
  sizeClass = "h-4 w-4",
  colorClass = "fill-current stroke-current",
  className
})=> (
  <svg
    className={clsx(sizeClass, colorClass, className)}
    viewBox="0 0 1200 1227"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
  </svg>
)

export default TwitterIcon;