import { FC } from "react"
import { SVGProps } from "../../types/global"
import clsx from "clsx";

const InstagramIcon: FC<SVGProps> = ({
  sizeClass = "h-4 w-4",
  colorClass = "stroke-current fill-none",
  className
})=> (
  <svg
    className={clsx(sizeClass, colorClass, className)}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
    <circle cx="12" cy="12" r="4.25" />
    <circle cx="17.5" cy="6.5" r="0.75" className="fill-current" />
  </svg>
)

export default InstagramIcon;
