import clsx from "clsx";
import { SVGProps } from "../../types/global";
import { FC } from "react";

const Corner: FC<SVGProps> = ({
  sizeClass = "h-4 w-4",
  colorClass = "fill-current stroke-current",
  className
}) => (
  <svg
    className={clsx(sizeClass, colorClass, className)}
    viewBox="0 0 209 209" version="1.1" xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd" clipRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="1.5"
  >
    <path d="M10.417,197.917l187.5,-187.5" fill="none" strokeWidth="18.75px" />
    <path d="M177.083,197.917l20.834,-20.834" fill="none" strokeWidth="18.75px" />
    <path d="M93.75,197.917l104.167,-104.167" fill="none" strokeWidth="18.75px" />
  </svg>
);

export default Corner;