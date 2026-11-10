import { ICONS, WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import { windowId } from "@/data/groups"
import Window from "../Window"
import WorkSelector from "../WorkSelector"
import { FC } from "react"

interface FolderWindowProps {
  /** The group's name, which is also the window's key and title. */
  name: string;
  /** The group's window names, in WINDOWS order. */
  keys: string[];
}

const initSize = { w: 520, h: 360 }
const initPos = { x: 120, y: 60 }

/** An Explorer folder window listing a group's works; opening one leaves the folder open. */
const FolderWindow: FC<FolderWindowProps> = ({ name, keys }) => {
  const { handleOpen } = useWindowsContext()

  // Ids are WINDOWS enum keys, since window names carry spaces and quotes.
  const works = keys.map(key => ({ id: windowId(key) ?? key, title: key, thumb: ICONS[key] }))
  const openWork = (id: string) => handleOpen(WINDOWS[id as keyof typeof WINDOWS] ?? id)

  return (
    <Window windowKey={name} initSize={initSize} initPosition={initPos}>
      <WorkSelector works={works} onOpen={openWork} />
    </Window>
  )
}

export default FolderWindow
