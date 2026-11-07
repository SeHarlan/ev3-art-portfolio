import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider"
import { Theme, useThemeContext } from "@/context/ThemeProvider"
import Window from "../Window"
import { FC, useEffect, useRef, useState } from "react"

// Sk3tch's app bundle, vendored as a static file (public/sk3tch/app.js) and
// loaded at runtime, so webpack never re-bundles it. Only what this window uses.
const APP_URL = "/sk3tch/app.js"

interface Sk3tchEngine {
  start(): void;
  stop(): void;
  destroy(): void;
}

interface PaintUiHandle {
  destroy(): void;
  setTheme(theme: Theme): void;
  setKeysEnabled(enabled: boolean): void;
}

interface Sk3tchApp {
  createEngine(config: { canvas: HTMLCanvasElement }): Sk3tchEngine;
  mountPaintUi(engine: Sk3tchEngine, container: HTMLElement, opts: {
    frame: "host";
    newSeed: boolean;
    theme: Theme;
    onTitle(title: string): void;
  }): PaintUiHandle;
}

const Sk3tchWindow: FC = () => {
  const { activeWindow, minimizedState } = useWindowsContext()
  const [minimizedMap] = minimizedState
  const { theme } = useThemeContext()

  const isMin = Boolean(minimizedMap[WINDOWS.SK3TCH])
  // A minimized window stays last in the order, so it'd still count as active.
  const keysEnabled = activeWindow === WINDOWS.SK3TCH && !isMin

  const [title, setTitle] = useState(WINDOWS.SK3TCH)
  const [error, setError] = useState<string | null>(null)
  // The mounted engine and shell; the effects below keep them in step.
  const [app, setApp] = useState<{ engine: Sk3tchEngine, ui: PaintUiHandle } | null>(null)

  const boxRef = useRef<HTMLDivElement | null>(null)

  // Boot order from the bundle: createEngine (not started), mountPaintUi, then
  // the isMin effect starts it.
  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    let cancelled = false
    let engine: Sk3tchEngine | null = null
    let ui: PaintUiHandle | null = null
    let canvas: HTMLCanvasElement | null = null

    import(/* webpackIgnore: true */ APP_URL)
      .then((sk3tch: Sk3tchApp) => {
        if (cancelled) return
        canvas = document.createElement("canvas")
        try {
          engine = sk3tch.createEngine({ canvas })
        } catch (err) {
          console.error("Sk3tch: engine creation failed", err)
          setError("Sk3tch needs WebGL2, which this browser doesn't have.")
          return
        }
        ui = sk3tch.mountPaintUi(engine, box, {
          frame: "host",
          newSeed: true,
          theme,
          onTitle: setTitle,
        })
        setApp({ engine, ui })
      })
      .catch(err => {
        if (cancelled) return
        console.error("Sk3tch: failed to load", err)
        setError("Sk3tch didn't load. Reopen the window to try again.")
      })

    return () => {
      cancelled = true
      ui?.destroy()
      engine?.destroy()
      canvas?.remove()
    }
  }, [])

  useEffect(() => {
    app?.ui.setTheme(theme)
  }, [app, theme])

  useEffect(() => {
    app?.ui.setKeysEnabled(keysEnabled)
  }, [app, keysEnabled])

  useEffect(() => {
    if (isMin) app?.engine.stop()
    else app?.engine.start()
  }, [app, isMin])

  const initSize = {
    h: 700,
    w: 800,
  }
  const initPos = {
    x: 220,
    y: 40
  }

  return (
    <Window windowKey={WINDOWS.SK3TCH} title={title} bare initSize={initSize} initPosition={initPos}>
      <div ref={boxRef} data-sk3tch-host className="absolute inset-0">
        {error ? <p className="p95-chrome text-windowsText p-3">{error}</p> : null}
      </div>
    </Window>
  )
}

export default Sk3tchWindow
