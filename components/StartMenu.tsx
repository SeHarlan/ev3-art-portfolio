import { useWindowsContext } from "@/context/WindowsProvider";
import { Group, groupsFor, TOP_LEVEL } from "@/data/groups";
import { FC, useLayoutEffect, useRef, useState } from "react";
import { Menu } from '@headlessui/react'
import Button from "./Button";
import PixelGlyph from "./PixelGlyph";
import clsx from "clsx";
import Image from "next/image";

const ITEM = "ev3-menu-item px-2 py-1 select-none"
const PANEL = "p95-chrome absolute z-10 bg-windowsGray text-windowsText classic-border p-1"

const Label: FC<{ label: string }> = ({ label }) => (
  <span>
    <span className="underline">{label[0]}</span>
    {label.slice(1)}
  </span>
)

/** A group's works, beside its entry. Kept on screen: shifted up off the taskbar
 *  and left off the right edge, and capped at the height above the taskbar. */
const Cascade: FC<{ group: Group }> = ({ group }) => {
  const { handleOpen } = useWindowsContext()
  const panelRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState<{ x: number, y: number, maxHeight?: number }>({ x: 0, y: 0 })

  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const bottom = document.getElementById("window-container")?.getBoundingClientRect().bottom ?? window.innerHeight
    const rect = panel.getBoundingClientRect()
    const height = Math.min(rect.height, bottom)
    setFit({
      x: Math.min(0, window.innerWidth - rect.right),
      y: Math.max(-rect.top, Math.min(0, bottom - (rect.top + height))),
      maxHeight: bottom,
    })
  }, [])

  return (
    <div
      ref={panelRef}
      className={clsx(PANEL, "left-full top-0 w-44 overflow-y-auto")}
      style={{ transform: `translate(${fit.x}px, ${fit.y}px)`, maxHeight: fit.maxHeight }}
    >
      {group.keys.map(key => (
        <Menu.Item key={key}>
          <div className={clsx(ITEM, "break-words")} onClick={() => handleOpen(key)}>
            <Label label={key} />
          </div>
        </Menu.Item>
      ))}
    </div>
  )
}

// Rendered inside Menu.Items, which unmounts on close, so the open cascade resets with the menu.
const StartMenuList: FC = () => {
  const { handleOpen, groupBy } = useWindowsContext()
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  const item = (windowKey: string) => (
    <Menu.Item key={windowKey}>
      <div className={clsx(ITEM, "w-36")} onMouseEnter={() => setOpenGroup(null)} onClick={() => handleOpen(windowKey)}>
        <Label label={windowKey} />
      </div>
    </Menu.Item>
  )

  return (
    <div>
      {TOP_LEVEL.map(item)}
      <div className="classic-divider-h mx-0.5 my-1" />
      {/* Group entries are plain elements, not Menu.Items: a Menu.Item click closes the whole menu. */}
      {groupsFor(groupBy).map(group => {
        const open = openGroup === group.name
        const show = () => setOpenGroup(group.name)
        return (
          <div key={group.name} className="relative">
            <div
              className={clsx(ITEM, "w-36 flex items-center justify-between gap-2")}
              aria-haspopup="menu"
              aria-expanded={open}
              onMouseEnter={show}
              onClick={show}
            >
              <Label label={group.name} />
              <PixelGlyph name="cascade" />
            </div>
            {open && <Cascade group={group} />}
          </div>
        )
      })}
    </div>
  )
}

const StartMenu: FC = () => {
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
            <Image src="/images/static-icon.png" width={20} height={20} alt="" className="w-5 h-5" />
            <p className="-mb-0.5">Start</p>
          </Menu.Button>

          <Menu.Items className={clsx(PANEL, "bottom-[100%] left-0 flex")}>
            <div className="bg-windowsDarkGray w-8 h-full min-h-[14rem] flex items-center justify-center">
              <p className="text-windowsHilight flex-shrink-0 w-[14rem] pl-3 -rotate-90">
                EV3
              </p>
            </div>
            <StartMenuList />
          </Menu.Items>
        </>
      )}
    </Menu>
  );
}

export default StartMenu
