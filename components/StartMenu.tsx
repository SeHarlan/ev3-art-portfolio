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
          <Menu.Button as={Button}
            className={clsx("px-3 py-1 flex gap-2 items-center", { active: open })}
          >
            <img src="/images/small-logo.png" alt="" className="w-5"/>
            <p className="-mb-0.5">Start</p>
          </Menu.Button>
        
          <Menu.Items className="absolute bottom-[100%] left-0 z-10 bg-windowsGray classic-border p-1 flex">
            <div className="bg-windowsDarkGray w-8 h-full min-h-[10rem] flex items-center justify-center">
              <p className="text-windowsGray flex-shrink-0 w-[10rem] pl-3 -rotate-90">Scott Harlan</p>
            </div>
            <div>
              {Object.values(WINDOWS).map(windowKey => {
                const handleClick = () => handleOpen(windowKey);
                const label = windowKey
                return (
                  <Menu.Item
                    key={windowKey}
                  >
                    <div
                      className="px-2 py-1 w-28 select-none hover:bg-windowsHeader hover:text-white"
                      onClick={handleClick}
                    >
                      <span className="underline">{label[0]}</span>{label.slice(1)}
                    </div>
                  </Menu.Item>
                )
              })}
            </div>
          </Menu.Items>
        </>
      )}
    </Menu>
  )
}

export default StartMenu