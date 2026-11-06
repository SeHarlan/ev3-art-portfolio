import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Sk3tch's palette keys: gray is Standard, win95 is Classic, bw is 1-Bit.
export const THEMES = ["gray", "win95", "bw"] as const
export type Theme = typeof THEMES[number]

export const THEME_STORAGE_KEY = "ev3-p95-theme"
export const DEFAULT_THEME: Theme = "gray"
export const THEME_ATTRIBUTE = "data-p95-theme"

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => null
})

export const useThemeContext = () => useContext(ThemeContext)

const isTheme = (value: string | null): value is Theme => THEMES.includes(value as Theme)

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME)

  // _document's inline script has already applied any saved palette.
  useEffect(() => {
    const current = document.documentElement.getAttribute(THEME_ATTRIBUTE)
    if (isTheme(current)) setThemeState(current)
  }, [])

  const setTheme = (next: Theme) => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch (e) {}
    setThemeState(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
