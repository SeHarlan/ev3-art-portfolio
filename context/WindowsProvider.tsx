import { useRouter } from "next/router";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { WINDOWS } from "../data/windows";
import { DEFAULT_GROUP_BY, GroupBy, groupsFor, isGroupBy } from "../data/groups";

export { WINDOWS, ICONS } from "../data/windows";

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
  groupBy: GroupBy;
  setGroupBy: (groupBy: GroupBy) => void;
  /** False until the saved grouping is read, so nothing renders in the wrong grouping. */
  ready: boolean;
}

const initContext: InitContext = {
  orderState: [[], ()=> null],
  minimizedState: [{}, () => null],
  openState: [{}, () => null],
  handleOpen: () => null,
  groupBy: DEFAULT_GROUP_BY,
  setGroupBy: () => null,
  ready: false
}

export const GROUP_BY_STORAGE_KEY = "ev3-p95-group-by"

export const WindowsContext = createContext(initContext)

export const useWindowsContext = () => useContext(WindowsContext)

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
  FIND: string;
  SETTINGS: string;
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

  const [groupBy, setGroupByState] = useState<GroupBy>(DEFAULT_GROUP_BY)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(GROUP_BY_STORAGE_KEY)
      if (isGroupBy(saved)) setGroupByState(saved)
    } catch (e) {}
    setReady(true)
  }, [])

  // Saves the choice and closes the old grouping's folder windows that the new one doesn't have.
  const setGroupBy = (next: GroupBy) => {
    try {
      localStorage.setItem(GROUP_BY_STORAGE_KEY, next)
    } catch (e) {}
    const nextNames = groupsFor(next).map(group => group.name)
    const stale = groupsFor(groupBy).map(group => group.name).filter(name => !nextNames.includes(name))
    setOpenMap(prev => {
      const map = { ...prev }
      stale.forEach(name => { map[name] = false })
      return map
    })
    setGroupByState(next)
  }

  return (
    <WindowsContext.Provider
      value={{
        orderState,
        minimizedState,
        openState,
        handleOpen,
        activeWindow,
        groupBy,
        setGroupBy,
        ready
      }}
    >
      {children}
    </WindowsContext.Provider>
  )
}