import { useWindowsContext, WINDOWS } from "@/context/WindowsProvider";
import { FC } from "react";
import { Menu } from '@headlessui/react'
import Button from "./Button";
import clsx from "clsx";

const StartMenu: FC = () => {
  const { handleOpen } = useWindowsContext()

  return (
    <Menu>
      {({ open }) => (
        <>
          <Menu.Button
            as={Button}
            className={clsx("px-3 py-1 flex gap-2 items-center", {
              active: open,
            })}
          >
            <img src="/images/static-icon.png" alt="" className="w-5" />
            <p className="-mb-0.5">Start</p>
          </Menu.Button>

          <Menu.Items className="p95-chrome absolute bottom-[100%] left-0 z-10 bg-windowsGray text-windowsText classic-border p-1 flex">
            <div className="bg-windowsDarkGray w-8 h-full min-h-[14rem] flex items-center justify-center">
              <p className="text-windowsHilight flex-shrink-0 w-[14rem] pl-3 -rotate-90">
                EV3
              </p>
            </div>
            {/* Scrolls once the list is taller than the screen above the taskbar. */}
            <div className="max-h-[calc(100svh-3.5rem)] overflow-y-auto">
              {Object.values(WINDOWS)
                .map((windowKey) => {
                  const handleClick = () => handleOpen(windowKey);
                  const label = windowKey;
                  return (
                    <Menu.Item key={windowKey}>
                      <div
                        className="ev3-menu-item px-2 py-1 w-36 select-none"
                        onClick={handleClick}
                      >
                        <span className="underline">{label[0]}</span>
                        {label.slice(1)}
                      </div>
                    </Menu.Item>
                  );
                })}
            </div>
          </Menu.Items>
        </>
      )}
    </Menu>
  );
}

export default StartMenu