import { useWindowsContext } from "@/context/WindowsProvider"
import { selectorWorks, windowFromId } from "@/data/groups"
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

  return (
    <Window windowKey={name} initSize={initSize} initPosition={initPos}>
      <WorkSelector works={selectorWorks(keys)} onOpen={id => handleOpen(windowFromId(id))} />
    </Window>
  )
}

export default FolderWindow
