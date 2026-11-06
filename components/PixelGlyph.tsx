import { FC } from "react";

// Sk3tch's window-chrome glyphs (sk3tch ui/model/icons.ts PIXEL_GLYPHS), drawn
// as pixel rows. Each character is one pixel; `.` is transparent and every
// other character is a --p95-icon-* color, so themes and states recolor them.
const PIXEL_INK: Record<string, string> = {
  k: "--p95-icon-ink",
  g: "--p95-icon-shadow",
  w: "--p95-icon-light",
}

const GLYPHS = {
  minimize: ["........", "........", "........", "........", "........", ".kkkkkk.", ".kkkkkk."],
  maximize: ["kkkkkkkkk", "kkkkkkkkk", "k.......k", "k.......k", "k.......k", "k.......k", "k.......k", "kkkkkkkkk"],
  close: ["kk....kk", ".kk..kk.", "..kkkk..", "...kk...", "..kkkk..", ".kk..kk.", "kk....kk"],
  // Win95's size grip: three embossed diagonal ridges.
  grip: [
    ".................w",
    "................wg",
    "...............wgg",
    "..............wgg.",
    ".............wgg.w",
    "............wgg.wg",
    "...........wgg.wgg",
    "..........wgg.wgg.",
    ".........wgg.wgg.w",
    "........wgg.wgg.wg",
    ".......wgg.wgg.wgg",
    "......wgg.wgg.wgg.",
    ".....wgg.wgg.wgg.w",
    "....wgg.wgg.wgg.wg",
    "...wgg.wgg.wgg.wgg",
    "..wgg.wgg.wgg.wgg.",
    ".wgg.wgg.wgg.wgg.w",
    "wgg.wgg.wgg.wgg.wg",
  ],
}

export type GlyphName = keyof typeof GLYPHS

const PixelGlyph: FC<{ name: GlyphName; className?: string }> = ({ name, className }) => {
  const rows = GLYPHS[name]
  const w = Math.max(...rows.map(row => row.length))
  const h = rows.length

  // Runs of one color in a row merge into one rect.
  const rects: JSX.Element[] = []
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]
      let end = x + 1
      while (end < row.length && row[end] === ch) end++
      const ink = PIXEL_INK[ch]
      if (ink) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={end - x} height={1} style={{ fill: `var(${ink})` }} />)
      x = end
    }
  })

  return (
    <svg
      className={className}
      style={{ width: `calc(${w} * var(--u))`, height: `calc(${h} * var(--u))`, flex: "none" }}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rects}
    </svg>
  )
}

export default PixelGlyph
