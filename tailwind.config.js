/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sk3tch's Win95 palette tokens (styles/globals.css), so every theme
        // recolors these.
        windowsBG: "var(--p95-desktop)",
        windowsHeader: "var(--p95-title-bg)",
        windowsGray: "var(--p95-face)",
        windowsDarkGray: "var(--p95-shadow)",
        windowsHilight: "var(--p95-hilight)",
        windowsSelect: "var(--p95-select-bg)",
        windowsSelectText: "var(--p95-select-fg)",
        windowsTitleText: "var(--p95-title-fg)",
        windowsText: "var(--p95-text)",
        windowsTextDisabled: "var(--p95-text-disabled)",
        // Page behind window content (about text, Home): tan in Classic.
        windowsPaper: "var(--p95-paper)"
      },
      height: { screen: 'calc(var(--vh) * 100)' },
      maxHeight: { screen: 'calc(var(--vh) * 100)' },
      minHeight: { screen: 'calc(var(--vh) * 100)' },
      // height: { screen: '100svh' },
      // maxHeight: { screen: '100svh' },
      // minHeight: { screen: '100svh' },
      
      keyframes: {
        enter: {
          "0%": { transform: "translate(-7rem, 10rem) scale(0.75)", opacity: 0 },
          "100%": { transform: "translate(0rem, 0rem) scale(1)", opacity: 1 },
        },
        exit: {
          "0%": { transform: "translate(0rem, 0rem) scale(1)", opacity: 1 },
          "100%": { transform: "translate(-7rem, 10rem) scale(0.75)", opacity: 0 },
        }
      },
      animation: {
        enter: "enter 0.2s forwards",
        exit: "exit 0.2s forwards"
      }
    }
  },
  plugins: [
    require('@headlessui/tailwindcss')
  ]
}
