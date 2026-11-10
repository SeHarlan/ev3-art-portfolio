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
  GP: "3xGP",
  DUET: "DUET",
  NOISE: "it's just noise",
  ITB: "ITB",
  R3MIX: "R3MIX",
  MAURER: "Maurer Expanse",
  SOMEDAYS: "some days",
  TECHTONIC: "techtonic",
  OBH: "on being human",
  SK3TCH: "Sk3tch",
  CEASEFIRE: "CEASEFIRE",
  REMEMBER: "remember.exe",
  SEASONS: "s34s0ns",
  ISAAC: "Exaltation of Isaac",
  PROGRESS: '"Progress"',
  SINGLEPATH: "A Single Path",
  TERRA: "T3RRA",
  FLOWER: "A Flower Blooms in Autumn",
  TUNEOUT: "Tune Out",
  SETTINGS: "Settings",
}

type WINDOWS = {
  HOME: string;
  NOISE: string;
  DUET: string;
  MAURER: string;
  SOMEDAYS: string;
  R3MIX: string;
  ITB: string;
  GP: string;
  TECHTONIC: string;
  OBH: string;
  SK3TCH: string;
  CEASEFIRE: string;
  REMEMBER: string;
  SEASONS: string;
  ISAAC: string;
  PROGRESS: string;
  SINGLEPATH: string;
  TERRA: string;
  FLOWER: string;
  TUNEOUT: string;
  SETTINGS: string;
}

export const ICONS = {
  [WINDOWS.HOME]: "/images/static-icon.png",
  [WINDOWS.GP]: "/images/3xgp-icon.png",
  [WINDOWS.DUET]: "/images/DUET-icon.png",
  [WINDOWS.MAURER]: "/images/small-alt-logo.png",
  [WINDOWS.NOISE]: "/images/its_just_noise-icon.png",
  [WINDOWS.SOMEDAYS]: "/images/drifting-icon.png",
  [WINDOWS.R3MIX]: "/images/r3mix-icon.png",
  [WINDOWS.ITB]: "/images/ITB-icon.png",
  [WINDOWS.TECHTONIC]: "/images/small-logo.png",
  [WINDOWS.OBH]: "/images/obh-icon.png",
  [WINDOWS.SK3TCH]: "/svg/sk3tch-icon.svg",
  [WINDOWS.CEASEFIRE]: "/images/ceasefire-icon.png",
  [WINDOWS.REMEMBER]: "/images/remember-icon.png",
  [WINDOWS.SEASONS]: "/images/seasons-icon.png",
  [WINDOWS.ISAAC]: "/images/isaac-icon.png",
  [WINDOWS.PROGRESS]: "/images/progress-icon.png",
  [WINDOWS.SINGLEPATH]: "/images/singlepath-icon.png",
  [WINDOWS.TERRA]: "/images/terra-icon.png",
  [WINDOWS.FLOWER]: "/images/flower-icon.png",
  [WINDOWS.TUNEOUT]: "/images/tuneout-icon.png",
  [WINDOWS.SETTINGS]: "/svg/settings-icon.svg",
};

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