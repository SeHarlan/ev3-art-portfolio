import { useWindowsContext } from "@/context/WindowsProvider"
import { useEffect, useRef } from "react"

/**
 * Keyboard focus for a window's HTML piece: the iframe takes focus when it loads
 * (pass `focusPiece` to its onLoad) and whenever its window becomes active on the work view.
 */
const usePieceFocus = (windowKey: string, onWork: boolean) => {
  const { activeWindow, minimizedState } = useWindowsContext()
  const [minimizedMap] = minimizedState
  const isMin = Boolean(minimizedMap[windowKey])
  // A minimized window stays last in the order, so it'd still count as active.
  const isActive = activeWindow === windowKey && !isMin

  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const focusPiece = () => {
    // A focused element scrolls into view, and body scrolls even with overflow hidden.
    iframeRef.current?.focus({ preventScroll: true })
    iframeRef.current?.contentWindow?.focus()
  }

  useEffect(() => {
    if (isActive && onWork) focusPiece()
  }, [isActive, onWork])

  return { iframeRef, focusPiece, isMin }
}

export default usePieceFocus
