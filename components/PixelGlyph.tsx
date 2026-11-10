import { FC, memo } from "react";

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
  // Win95's cascading-menu arrow.
  cascade: ["k...", "kk..", "kkk.", "kkkk", "kkk.", "kk..", "k..."],
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

interface Rect { x: number; y: number; w: number; ink: string }

// Runs of one color in a row merge into one rect. Built once: the data is
// static and the fills are CSS vars, so themes need no recompute.
const toRects = (rows: readonly string[]) => {
  const rects: Rect[] = []
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]
      let end = x + 1
      while (end < row.length && row[end] === ch) end++
      if (PIXEL_INK[ch]) rects.push({ x, y, w: end - x, ink: PIXEL_INK[ch] })
      x = end
    }
  })
  return { w: rows[0].length, h: rows.length, rects }
}

const BUILT = Object.fromEntries(
  Object.entries(GLYPHS).map(([name, rows]) => [name, toRects(rows)])
) as Record<GlyphName, ReturnType<typeof toRects>>

const PixelGlyph: FC<{ name: GlyphName; className?: string }> = ({ name, className }) => {
  const { w, h, rects } = BUILT[name]
  return (
    <svg
      className={className}
      style={{ width: `calc(${w} * var(--u))`, height: `calc(${h} * var(--u))`, flex: "none" }}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rects.map(r => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} style={{ fill: `var(${r.ink})` }} />
      ))}
    </svg>
  )
}

// Props are string literals, so window drags and resizes skip re-rendering it.
export default memo(PixelGlyph)
