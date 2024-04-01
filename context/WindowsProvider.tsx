import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

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
  HOME: "Home",
  COLLECTOR: "Collector",
  MBB: "MBB",
  CURATE: "Curate",
  // NODE_MONKEY: "Node Monkey",
}

export const ICONS = {
  [WINDOWS.HOME]: "/images/small-logo.png",
  [WINDOWS.COLLECTOR]: "/images/collector-logo.png",
  [WINDOWS.MBB]: "/images/MBB-icon.png",
  [WINDOWS.CURATE]: "/images/Curate-icon.png",
  // [WINDOWS.NODE_MONKEY]: "/images/NodeMonkey-icon.png",
}

const defaultMin = Object.values(WINDOWS).reduce((acc: {[key:string]: boolean}, curr) => {
  acc[curr] = false
  return acc
}, {})

const defaultOpen = { ...defaultMin }
defaultOpen[WINDOWS.HOME] = true
const defaultOrder = Object.entries(defaultOpen).filter(([key, open]) => open).map(([key, open]) => key)

export default function WindowsProvider({ children }: { children: ReactNode }) {
  const orderState = useState(defaultOrder)
  const minimizedState = useState(defaultMin)
  const openState = useState(defaultOpen)

  const [orderList, setOrderList] = orderState
  const [minimizedMap, setMinimizedMap] = minimizedState
  const [openMap, setOpenMap] = openState

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
        handleOpen
      }}
    >
      {children}
    </WindowsContext.Provider>
  )
}