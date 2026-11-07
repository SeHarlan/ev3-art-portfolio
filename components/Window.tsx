import useDragResize, { Position, Size } from "../hooks/useDragResize";
import clsx from "clsx";
import { FC, MouseEventHandler, ReactNode, useEffect, useRef, useState } from "react";
import { ICONS, WINDOWS, useWindowsContext } from "../context/WindowsProvider";
import Button from "./Button";
import PixelGlyph from "./PixelGlyph";

import useWindowSize from "@/hooks/useWindowSize";

export interface WindowMenuItem {
  label: string;
  function: () => void;
  component?: ReactNode;
}
interface WindowProps {
  children: ReactNode;
  initPosition?: Position;
  initSize?: Size
  windowKey: string;
  /** Shown in the title bar instead of windowKey. */
  title?: string;
  /** Title bar only: no menu row, inset or status row. The content box fills
   *  the rest of the window, with the size grip overlaid at its bottom-right. */
  bare?: boolean;
  inset?: boolean;
  menu?: WindowMenuItem[];
  wrapperClassName?: string;
}
const Window: FC<WindowProps> = ({ children, initPosition, windowKey, title, bare = false, initSize, inset = true, menu, wrapperClassName = "bg-windowsGray" }) => {
  const { dragRef, position, isDragging, resizeRef, containerRef, size, handleMaximize, isMax } = useDragResize(initPosition, initSize, windowKey)
  const {orderState, minimizedState, openState, activeWindow} = useWindowsContext()
  const [orderList, setOrderList] = orderState
  const [minimizedMap, setMinimizedMap] = minimizedState
  const [openMap, setOpenMap] = openState

  const { isMdScreen } = useWindowSize()
  
  const [isHidden, setIsHidden] = useState(false)

  const menuRef = useRef<HTMLDivElement | null>(null)

  const invertIcon = [WINDOWS.MAURER].includes(windowKey)

  
  const offsetHeight = menuRef.current && dragRef.current && resizeRef.current
  ? menuRef.current.offsetHeight + dragRef.current.offsetHeight + resizeRef.current.offsetHeight
  : 78 // estimate
  
  const isMin = minimizedMap[windowKey]
  const orderIndex = orderList.findIndex(item => item === windowKey);
  const isActive = activeWindow === windowKey

  const changeOrder = () => {
    const newOrder = [...orderList]
    newOrder.splice(orderIndex, 1)
    newOrder.push(windowKey)
    setOrderList(newOrder)
  }

  const handleMinimize: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setMinimizedMap(prev => ({
      ...prev,
      [windowKey]: true
    }))
  }

  const handleClose: MouseEventHandler<HTMLButtonElement> = (e) => { 
    e.stopPropagation()
    e.preventDefault()
    setOpenMap(prev => ({
      ...prev,
      [windowKey]: false
    }))
  }
  useEffect(() => {
    let id: NodeJS.Timeout
    if (isMin) id = setTimeout(() => setIsHidden(true), 400) //needs to be longer that the transition duration so it's only hidden after animating
    else setIsHidden(false)

    return () => clearTimeout(id)
  }, [isMin])

  return (
    <div
      hidden={isHidden}
      ref={containerRef}
      style={{
        width: size.w,
        height: size.h,
        top: position.y,
        left: position.x,
        zIndex: orderIndex + 5
      }}
      onMouseDown={changeOrder}
      className={clsx(
        "absolute flex flex-col",
        "bg-windowsGray classic-border",
        "select-none",
        isMin ? "animate-exit" : "animate-enter"
      )}
    >
      <div
        className={clsx(
          "p95-chrome h-[22px] pl-1 pr-0.5 gap-[5px] cursor-grab active:cursor-grabbing flex justify-between items-center flex-none",
          isActive ? "bg-windowsHeader text-windowsTitleText" : "bg-windowsDarkGray text-windowsHilight"
        )}
        ref={dragRef}
      >
        <div className="flex items-center gap-[5px] min-w-0">
          <img src={ICONS[windowKey]} alt="" className="w-4 h-4 object-contain flex-none" style={{filter: invertIcon ? "invert(1)" : ""}} />
          <p className="translate-y-px whitespace-nowrap min-w-0 overflow-x-clip">{title ?? windowKey}</p>
        </div>
        <div className="flex items-center">
          <Button className="w-[18px] h-4 flex justify-center items-center"
            onClick={handleMinimize}
            aria-label="Minimize"
          >
            <PixelGlyph name="minimize" />
          </Button>
          <Button className="w-[18px] h-4 flex justify-center items-center"
            onClick={handleMaximize}
            disabled={isMdScreen}
            aria-label="Maximize"
          >
            <PixelGlyph name="maximize" />
          </Button>
          
          <Button className="w-[18px] h-4 flex justify-center items-center ml-0.5"
            onClick={handleClose}
            aria-label="Close"
          >
            <PixelGlyph name="close" />
          </Button>
        </div>
      </div>

      {bare ? (
        <div className="flex-1 min-h-0 relative">
          <div className={clsx(
            "overflow-hidden h-full",
            !isActive && "pointer-events-none",
            wrapperClassName
          )}>
            {children}
          </div>
          <div
            className="absolute right-px bottom-px flex"
            ref={resizeRef}
          >
            <PixelGlyph name="grip" className="cursor-grab active:cursor-grabbing" />
          </div>
        </div>
      ) : (
        <>
        <div className="p95-chrome flex flex-wrap pt-[3px] pb-0.5 text-windowsTextDisabled" ref={menuRef}>
          {menu
            ? menu.map(item => {
              return (
                <button key={item.label} className="p95-menu-item text-windowsText relative flex items-center h-[18px] px-1.5" onClick={item.function}>
                  <span className="underline">{item.label[0]}</span>
                  {item.label.slice(1)}
                  {item.component}
                </button>
              )
            })
          : <>
              <p className="flex items-center h-[18px] px-1.5"><span className="underline">V</span>iew</p>
              <p className="flex items-center h-[18px] px-1.5"><span className="underline">E</span>dit</p>
              <p className="flex items-center h-[18px] px-1.5"><span className="underline">H</span>elp</p>
            </>
          }
        </div>

        <div
          className={clsx(inset && "classic-inset",
            "bg-white relative"
          )} 
        style={{ height: `calc(100% - ${offsetHeight}px)` }}>
          <div className={clsx(
            "overflow-auto h-full",
            !isActive && "pointer-events-none",
            wrapperClassName
          )}>
            {children}
          </div>
        </div>

        <div className="p95-chrome flex gap-1 items-end">
          <div className="w-1/2 h-4 classic-inset"></div>
          <div className="w-1/2 h-4 classic-inset"></div>
          <div
            className="flex flex-none mr-px mb-px"
            ref={resizeRef}
          >
            <PixelGlyph name="grip" className="cursor-grab active:cursor-grabbing" />
          </div>
        </div>
        </>
      )}
    </div>
  )
}

export default Window