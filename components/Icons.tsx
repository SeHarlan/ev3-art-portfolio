import Image from "next/image";
import { useWindowsContext, WINDOWS } from "../context/WindowsProvider";
import { groupsFor, iconFor } from "../data/groups";
import clsx from "clsx";
import { FC } from "react";

const Icons: FC = () => {
  const { handleOpen, groupBy, ready } = useWindowsContext()

  // Welcome, then the active grouping's folders, then Find and Settings.
  const windowKeys = [WINDOWS.HOME, ...groupsFor(groupBy).map(group => group.name), WINDOWS.FIND, WINDOWS.SETTINGS]

  return (
    // Invisible until the saved grouping is read, so the wrong grouping never shows,
    // while the icons still load from the server HTML and hold their space.
    <div className={clsx("flex z-[2] flex-col flex-wrap content-start h-[90svh] gap-5 relative top-10 left-10 items-center w-fit", !ready && "invisible")}>
      {windowKeys.map((windowKey) => {
          const handleClick = () => handleOpen(windowKey);
          return (
            <div
              key={windowKey}
              className="p95-chrome custom-cursor text-white flex flex-col items-center w-24 text-center break-words"
              onDoubleClick={handleClick}
              onTouchEnd={handleClick}
            >
              <Image
                width={56}
                height={56}
                src={iconFor(windowKey)}
                alt={`${windowKey} Icon`}
                className="w-14 h-14 object-contain mb-1 flex-shrink-0"
              />
              {windowKey}
            </div>
          );
        })}
    </div>
  );
}

export default Icons
