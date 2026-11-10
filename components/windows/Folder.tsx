import { useWindowsContext } from "@/context/WindowsProvider"
import { Group, selectorWorks, windowFromId } from "@/data/groups"
import Window from "../Window"
import WorkSelector from "../WorkSelector"
import { FC } from "react"

const initSize = { w: 520, h: 360 }
const initPos = { x: 120, y: 60 }

/** An Explorer folder window, keyed and titled by the group's name, listing its works;
 *  opening one leaves the folder open. */
const FolderWindow: FC<{ group: Group }> = ({ group }) => {
  const { handleOpen } = useWindowsContext()

  return (
    <Window windowKey={group.name} initSize={initSize} initPosition={initPos}>
      <WorkSelector works={selectorWorks(group.keys)} onOpen={id => handleOpen(windowFromId(id))} />
    </Window>
  )
}

export default FolderWindow
