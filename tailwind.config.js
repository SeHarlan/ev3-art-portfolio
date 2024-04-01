/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        windowsBG: "#018583",
        windowsHeader: "#100084",
        windowsGray: "#C4C4C4",
        windowsDarkGray: "#7D8583"
      },
      height: { screen: 'calc(var(--vh) * 100)' },
      maxHeight: { screen: 'calc(var(--vh) * 100)' },
      minHeight: { screen: 'calc(var(--vh) * 100)' },
      
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
