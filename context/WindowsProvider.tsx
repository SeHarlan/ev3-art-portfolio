import { useRouter } from "next/router";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";

interface InitContext {
  orderState: [
    string[],
    Dispatch<SetStateAction<string[]>>
  ];
  minimizedState: [
    { [key: string]: boolean; },
    Dispatch<SetStateAction<{ [key: string]: boolean; }>>
  ];
  openState: [
    { [key: string]: boolean; },
    Dispatch<SetStateAction<{ [key: string]: boolean; }>>
  ];
  handleOpen: (windowKey: string) => void;
  activeWindow?: string;
}

const initContext: InitContext = {
  orderState: [[], ()=> null],
  minimizedState: [{}, () => null],
  openState: [{}, () => null],
  handleOpen: () => null
}

export const WindowsContext = createContext(initContext)

export const useWindowsContext = () => useContext(WindowsContext)

export const WINDOWS = {
  HOME: "Introduction",
  NOISE: "it's just noise",
  DUET: "DUET",
  MAURER: "Maurer Expanse",
  DRIFTING: "Drifting"
}

type WINDOWS = {
  HOME: string;
  NOISE: string;
  DUET: string;
  MAURER: string;
  DRIFTING: string;
}

export const ICONS = {
  [WINDOWS.HOME]: "/images/small-logo.png",
  [WINDOWS.DUET]: "/images/DUET-icon.png",
  [WINDOWS.MAURER]: "/images/small-alt-logo.png",
  [WINDOWS.NOISE]: "/images/its_just_noise-icon.png",
  [WINDOWS.DRIFTING]: "/images/drifting-icon.png",
}

const defaultMin = Object.values(WINDOWS).reduce((acc: {[key:string]: boolean}, curr) => {
  acc[curr] = false
  return acc
}, {})

const defaultOpen = { ...defaultMin }
defaultOpen[WINDOWS.HOME] = true
const defaultOrder = Object.entries(defaultOpen).filter(([key, open]) => open).map(([key, open]) => key)

export default function WindowsProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const orderState = useState(defaultOrder)
  const minimizedState = useState(defaultMin)
  const openState = useState(defaultOpen)

  const [orderList, setOrderList] = orderState
  const [minimizedMap, setMinimizedMap] = minimizedState
  const [openMap, setOpenMap] = openState

  const activeWindow = orderList[orderList.length - 1]

  const openWindow = (router.query.window as string)?.toUpperCase() as keyof WINDOWS;


  useEffect(() => {
    if (openWindow && Object.keys(WINDOWS).includes(openWindow)) {
      const windowKey = WINDOWS[openWindow] as string;
      const defaultOpen = { ...defaultMin }
      defaultOpen[windowKey] = true
      const defaultOrder = Object.entries(defaultOpen).filter(([key, open]) => open).map(([key, open]) => key)

      setOpenMap(defaultOpen)
      setOrderList(defaultOrder)
    }
  }, [openWindow])

  const handleOpen = (windowKey: string) => { 
    const newOrder = [...orderList]
    const orderIndex = orderList.findIndex(item => item === windowKey);

    setMinimizedMap(prev => ({
      ...prev,
      [windowKey]: false
    }))
    setOpenMap(prev => ({
      ...prev,
      [windowKey]: true
    }))

    if (orderIndex >= 0) newOrder.splice(orderIndex, 1)
    newOrder.push(windowKey)
    setOrderList(newOrder)
  }

  return (
    <WindowsContext.Provider
      value={{
        orderState,
        minimizedState,
        openState,
        handleOpen,
        activeWindow
      }}
    >
      {children}
    </WindowsContext.Provider>
  )
}