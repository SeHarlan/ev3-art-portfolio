import clsx from "clsx";
import { SVGProps } from "../../types/global";
import { FC } from "react";

const EmailIcon: FC<SVGProps> = ({
  sizeClass = "h-5 w-5",
  colorClass = "fill-current stroke-current",
  className
}) => (
  <svg
    className={clsx(sizeClass, colorClass, className)}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path xmlns="http://www.w3.org/2000/svg" d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" strokeLinecap="round" strokeLinejoin="round" />
    <rect xmlns="http://www.w3.org/2000/svg" x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round" />
  </svg>
);


export default EmailIcon;