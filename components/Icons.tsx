import Image from "next/image";
import { ICONS, useWindowsContext, WINDOWS } from "../context/WindowsProvider";
import { FC } from "react";

const Icons: FC = () => {
  const { handleOpen } = useWindowsContext()
  return (
    <div className="flex z-[2] flex-col gap-5 relative top-10 left-10 items-center w-24">
      {Object.values(WINDOWS).map(windowKey => {
        const handleClick = () => handleOpen(windowKey);
        return (
          <div
            key={windowKey}
            className="custom-cursor select-none text-white flex flex-col items-center w-fit"
            onDoubleClick={handleClick}
          >
            <Image width={56} height={56} src={ICONS[windowKey]} alt={`${windowKey} Icon`} className="w-14 mb-1" />
            {windowKey}
          </div>
        )
      })}
    </div>
  )
}

export default Icons