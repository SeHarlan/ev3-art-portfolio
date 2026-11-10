import Image from "next/image";
import { ICONS, useWindowsContext, WINDOWS } from "../context/WindowsProvider";
import { FOLDER_ICON, groupsFor } from "../data/groups";
import { FC } from "react";

const Icons: FC = () => {
  const { handleOpen, groupBy, ready } = useWindowsContext()
  if (!ready) return null

  // Introduction, then the active grouping's folders, then Find and Settings.
  const entries = [
    { windowKey: WINDOWS.HOME, icon: ICONS[WINDOWS.HOME] },
    ...groupsFor(groupBy).map(group => ({ windowKey: group.name, icon: FOLDER_ICON })),
    { windowKey: WINDOWS.FIND, icon: ICONS[WINDOWS.FIND] },
    { windowKey: WINDOWS.SETTINGS, icon: ICONS[WINDOWS.SETTINGS] },
  ]

  return (
    <div className="flex z-[2] flex-col flex-wrap content-start h-[90svh] gap-5 relative top-10 left-10 items-center w-fit">
      {entries.map(({ windowKey, icon }) => {
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
                src={icon}
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
