# Review: SCOTT-973 Sk3tch Win95 design + palette switcher

Tier: Standard (visual diff)
Reviewed: 2026-11-06 · main at 69acd7e · reviewed 13ff0a2 · final 856a044
Panel: general; no Codex pass: visual or device diff
Oracle check: no oracles
Rounds: 1 (round 1 fixed F1 and F3, the fixer declined F2, and the re-review found no new defects; hand-back matched: 2 commits, clean tree)
Counts: 2 fixed, 1 asks, 1 tracked, 0 dropped

## Acceptance checks

- 1 Chrome uses Sk3tch font, bevels, colors; distinct hover and pressed: pass — browser check at http://localhost:3973: W95FA UI chrome font, 22px title bar with pixel glyphs, Settings toggles show sunken + dither when pressed; stylesheet holds `.classic-button` hover/focus dotted `::after` (hover gated by `@media (hover: hover)`), `:active` sunken bevel with `translate: var(--u) var(--u)` on children, disabled emboss, `.p95-menu-item` select highlight (seen on the Start menu in 1-Bit). No side-by-side against Sk3tch's dev server.
- 2 Settings switches palettes instantly; first visit Standard; reload keeps choice, no flash: pass — after `localStorage.clear()` the attribute is `gray` with Standard pressed; tray button, Start menu and desktop icon each open Settings; Classic and 1-Bit recolor on click with no reload; reload keeps `bw`; served HTML has `<html data-p95-theme="gray">` and the `ev3-p95-theme` script at offset 2135, before `<body` at 6701. No network throttling in the pane.
- 3 DUET/Maurer panels follow palette; canvases unchanged: fail — DUET canvas `toDataURL` hashes identical across gray, win95 and bw; DUET and Maurer panel buttons recolor (gray rgb(216,216,216)/black, win95 rgb(192,192,192)/black, bw black/white). Against main, the fixer measured DUET at 1024×768: canvas 912×584 on main, 912×602 on HEAD (F2, A1). Maurer's canvas animates, so its hashes can't be compared.
- Full check: pass — `npx tsc --noEmit` → exit 0; `yarn build` → exit 0 (at 13ff0a2; the fixer reran both at 856a044 → exit 0).

## Asks

- A1. [must-fix] The DUET and Maurer canvases come out 18px taller than on main at the same window size, because Sk3tch's chrome (22px title bar, 11px menu font, 18px grip) is shorter, and the sketches size their canvas to the content area. Is that acceptable? If left, DUET's "DU"/"ET" text is about 2px larger and sits 6–12px lower than before; the art's drawing code and palette independence are untouched, and the canvas still follows the window when resized or maximized, as before. From F2. Recommend: leave — the only change that restores main's size is undoing Sk3tch's chrome sizing for every window (components/p5/** is off limits), and taller default windows don't help because window sizes are clamped to the screen (hooks/useDragResize.tsx checkResizeBounds); record it in plan.md Decisions as accepted.
  Answer: 2026-11-06 "A1 in - The canvas sizes changing is no problem" → leave

## Tracked follow-ups

- T1. [touch press feedback] Menu-bar and dropdown items get no selection highlight when tapped on touch screens; port Sk3tch's `@media (hover: none) { .p95-menu-item:active { … } }` rule (paint.css:952-957). From F4.
  Answer: 2026-11-06 "T1 in" → in

## Worth checking by hand

Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-973-sk3tch-win95-palettes · dev server: http://localhost:3973
- In 1-Bit, open two windows and click between them → the unfocused window's title-bar logo is dark on dark gray, and Maurer's focused title icon is white on white (left as is, see plan.md's Elevated decision on F1).
- On a phone, tap a menu-bar item in DUET or R3MIX → no highlight on tap (T1).

## Findings

- F1. [fixed 1befbfb] components/StartMenu.tsx:20 In 1-Bit, the Start logo and the small-logo bitmaps on taskbar items were dark on the black face and invisible. Found by: acceptance rerun. Verifier: admit — the bw face is black and `--p95-bitmap-filter` was used only for the sketch close buttons; on main these sat on gray.
- F2. [ask A1] components/Window.tsx:101 The shorter Sk3tch chrome makes the DUET and Maurer content areas, and so their canvases, 18px taller than on main at the same window size, moving DUET's canvas text. Found by: general. Verifier: admit — breaks "canvases render exactly as before"; acceptance check 3 against main was never run. Fixer: declined — restoring main's canvas size means undoing the plan's chrome sizes (steps 2 and 5); measured main 912×584 vs HEAD 912×602.
- F3. [fixed 856a044] components/Footer.tsx:79 The tray's `px-4` was overridden by unlayered `.classic-inset { padding: 2u }`, leaving 2px instead of 16px. Found by: general. Verifier: admit — the diff swapped in `classic-inset` and kept `px-4`, so 16px was meant to stay.
- F4. [tracked T1] styles/globals.css:337 Menu-bar and dropdown items show no selection highlight on tap on touch screens; Sk3tch's `(hover: none) :active` rule wasn't ported. Found by: general. Verifier: track — no done-when line broken; on main the dropdown closed on tap, so the lost feedback was about one frame.

## Bug notes

- B1. 2026-11-06 "the title bar and nav menu buttons seem squished and cut off in some areas. Double check we are using the correct measurements, heights and font sizes."

## Follow-ups

none
