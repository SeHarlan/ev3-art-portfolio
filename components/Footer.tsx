import { ICONS, useWindowsContext } from "../context/WindowsProvider";
import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import Button from "./Button";
import StartMenu from "./StartMenu";
import useWindowSize from "@/hooks/useWindowSize";
import Links from "./Links";


const Footer: FC = () => {
  const [time, setTime] = useState(new Date())
  const { orderState, minimizedState, openState } = useWindowsContext()
  const [orderList, setOrderList] = orderState
  const [minimizedMap, setMinimizedMap] = minimizedState
  const [openMap, setOpenMap] = openState

  const { isMdScreen } = useWindowSize()

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const sorted = [...orderList].filter(key => {
    return openMap[key] 
  }).sort()
  return (
    <div className="flex justify-between w-full bg-gray-300 p-1 classic-border z-10">
      <div className={clsx("flex gap-1 relative")}>
        <StartMenu />
        <div className="classic-divider classic-bump h-full mr-2" />

        {!isMdScreen
          ? sorted.map(windowKey => {
          const orderIndex = orderList.findIndex(item => item === windowKey);
          const active = orderIndex === orderList.length-1 && !minimizedMap[windowKey];

          const handleClick = () => {
            const newOrder = [...orderList]

            if (active) {
              setMinimizedMap(prev => ({
                ...prev,
                [windowKey]: true
              }))
              newOrder.splice(orderIndex, 1)
              newOrder.unshift(windowKey)
            } else {
              setMinimizedMap(prev => ({
                ...prev,
                [windowKey]: false
              }))
              newOrder.splice(orderIndex, 1)
              newOrder.push(windowKey)
            }
            setOrderList(newOrder)
          }
          return (
            <Button
              key={windowKey}
              className={clsx("px-2 w-36 py-1 text-start flex items-center gap-2", { active })}
              onClick={handleClick}
            >
              <img src={ICONS[windowKey]} alt="" className="w-5" />
              {windowKey}
            </Button>
          )
          })
          : null
      }
      </div>

      <div className="relative flex">
        <div className="classic-divider h-full w-[1px] mr-1" />
        <div className="px-4 classic-button active flex items-center justify-end gap-1">
          <Links className="flex gap-1 items-center"/>
          <p className="ml-2">
            {time.toLocaleString(undefined, {"hour": "numeric", minute: "2-digit"})}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer