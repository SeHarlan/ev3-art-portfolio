# Plan: SCOTT-984 Sk3tch as a native portfolio window

Tier: Standard · visual (Sk3tch window chrome and layout)
Branch: goodaf/SCOTT-984-sk3tch-window · Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-984-sk3tch-window
Tags: visual: the bare Window, the Sk3tch window and the content font swap (all checked in the browser)

## Approach

Vendor sk3tch's app bundle as a static file and load it at runtime: `import(/* webpackIgnore: true */ "/sk3tch/app.js")` inside `useEffect`, so webpack and SWC never re-process a finished bundle and nothing runs on the server. `Window` gets `bare` and `title` props: `bare` keeps the title bar, drops the menu row, inset and status row, makes the content box `flex-1 min-h-0 relative`, and overlays the grip (with `resizeRef`) absolutely at the bottom-right, over Sk3tch's hidden grip slot. `Sk3tch.tsx` boots in the order `app.js`'s header gives: `createEngine({ canvas })` (not started), `mountPaintUi(engine, box, { frame: 'host', newSeed: true, theme, onTitle })`, `engine.start()`; cleanup is `ui.destroy()` then `engine.destroy()`. Later effects drive `setTheme`, `setKeysEnabled` and `stop()`/`start()` off refs. The font and class fixes are CSS-only.

Sk3tch's sheet (`paint.css`, injected once into `<head>` by `ensurePaintStyles`, never removed) loads after `globals.css` and sets `--p95-font: 'W95FA'` on `.p95-root`. In the portfolio `'W95FA'` is the body face with no `size-adjust`, so Sk3tch's chrome needs the size-adjusted `'W95FA UI'` face (byte-identical to sk3tch's `assets/ui-font.woff2`). Its unscoped `.p95-menu-item` rules (padding `0 6px`, flex, gap) would override the portfolio's `px-2 py-1` items, so the portfolio's class is renamed.

## Files

- `public/sk3tch/app.js` (new): sk3tch `packages/sketch-engine/dist/app.js`, built at sk3tch `bf7757f5`, plus a one-line header comment.
- `public/svg/sk3tch-icon.svg` (new): copy of sk3tch `public/favicon.svg` (the `app` glyph).
- `components/Window.tsx`: `bare` and `title` props; rename `p95-menu-item` to `ev3-menu-item`.
- `components/windows/Sk3tch.tsx` (new): the window.
- `context/WindowsProvider.tsx`: `WINDOWS.SK3TCH = "Sk3tch"`, the `WINDOWS` type, `ICONS` entry.
- `pages/index.tsx`: render `Sk3tchWindow` when open.
- `components/StartMenu.tsx`, `components/MenuDropdown.tsx`: class rename.
- `styles/globals.css`: class rename; the `'W95FA'` face points at `w95fa-ui.woff2`; the Sk3tch font override rule.
- `styles/fonts/w95fa.woff2`: deleted.

## Steps

1. Measure before changing anything (check 4's baseline): run this worktree's dev server, open DUET and it's just noise, and record the `getBoundingClientRect()` of each window's first `ul.list-disc` and its first paragraph, plus one Start menu item's and one MenuDropdown item's computed padding. Write the numbers into Progress. Files: —. Checks: 3, 4.
2. Vendor: copy `/Users/scottharlan/Scottys art/sk3tch/packages/sketch-engine/dist/app.js` (already built from sk3tch root at `bf7757f5`, tree clean, 216979 bytes) to `public/sk3tch/app.js` with the header `// Sk3tch app bundle: sk3tch packages/sketch-engine dist/app.js at bf7757f5. Don't edit; rebuild there (bun run --cwd packages/sketch-engine build) and copy.` Copy the icon. If the dist file is gone or its size differs, rebuild there with that command first. Files: `public/sk3tch/app.js`, `public/svg/sk3tch-icon.svg`. Checks: 1.
3. `Window`: `title?: string` (shown instead of `windowKey` in the title bar when set) and `bare?: boolean`. Leave the non-bare path's markup and `offsetHeight` math as is. Files: `components/Window.tsx`. Checks: 1.
4. `Sk3tch.tsx` and registration. Local minimal interfaces for the module (`createEngine`, `mountPaintUi`, and the `Engine`/`PaintUiHandle` methods used); the dynamic import returns `any`, cast once. The content box gets `data-sk3tch-host`. A `cancelled` flag guards the async mount (React strict mode runs the effect twice in dev). Effects: `theme` → `ui.setTheme`; `activeWindow === WINDOWS.SK3TCH` → `ui.setKeysEnabled` (also right after mount); `minimizedMap[WINDOWS.SK3TCH]` → `engine.stop()` / `engine.start()`. `initSize` 800x700, `initPosition` about x 220, y 40. If `createEngine` throws (no WebGL2), show one line of text in the box instead. Files: `components/windows/Sk3tch.tsx`, `context/WindowsProvider.tsx`, `pages/index.tsx`. Checks: 1, 2.
5. CSS: rename `p95-menu-item` → `ev3-menu-item` in `globals.css` (selectors and the comment), `Window.tsx`, `StartMenu.tsx`, `MenuDropdown.tsx`. Add `[data-sk3tch-host] .p95-root { --p95-font: 'W95FA UI'; }` (more specific than paint.css's `.p95-root`, so load order doesn't matter). Point the `'W95FA'` @font-face at `./fonts/w95fa-ui.woff2` `format('woff2')` with no `size-adjust`, delete `styles/fonts/w95fa.woff2`, and update the UI-font comment. Files: `styles/globals.css`, `components/StartMenu.tsx`, `components/MenuDropdown.tsx`, `components/Window.tsx`, `styles/fonts/w95fa.woff2`. Checks: 1, 3, 4.

## Acceptance checks

| # | Done-when (the ticket's line, in a few words) | Command | Expected result | Verified by |
|---|---|---|---|---|
| 1 | Icon opens Sk3tch window: title, live UI, Win95 text size, palettes, drag/resize/max/min/close, engine stop/start | Browser check on this worktree's dev server, 1280x800: double-click the Sk3tch icon. Read the title bar text; measure the content box and `[data-sk3tch-host] .p95-root` rects; read a Sk3tch menu item's computed `font-family` and `font-size`. Switch Standard / Classic / 1-Bit in Settings and read `.p95-root`'s `data-p95-theme`. Drag the title bar; drag the grip larger and smaller (once below about 545x456 of content); maximize; minimize, then count `requestAnimationFrame` calls over 1s (wrap `window.requestAnimationFrame` with a counter via `page.evaluate`, with Sk3tch the only window open), restore and count again; close and reopen. Repeat the open at 375x812 | Title matches `^[0-9a-f]{8} · Sk3tch$`; `.p95-root` has `data-p95-frame="host"` and its rect equals the content box; icon is the palette glyph; menu text is `W95FA UI` at 11px; theme attribute follows each palette (`gray`, `win95`, `bw`); the window moves, resizes with Sk3tch refilling it (compact layout below the cutoff), maximizes; rAF count ~0 while minimized, >30 after restore; reopen shows a different seed in the title and one `.p95-root` only; at 375px the window is maximized and Sk3tch is in compact layout with no console errors | browser check |
| 2 | Sk3tch keys only while active | Browser check: with Sk3tch active, press a Sk3tch tool key whose effect shows in the DOM (e.g. the toolbox's pressed tool changes); then click Settings to bring it to front and press another tool key | The first key changes the pressed tool; the second changes nothing; clicking back on Sk3tch makes keys work again | browser check |
| 3 | Start menu and dropdown items unchanged after Sk3tch opens | `grep -rn "p95-menu-item" components pages styles` and a browser check: open Sk3tch, then open the Start menu and a window's MenuDropdown, and read the computed padding and hover background of an item | grep prints nothing (exit 1); padding equals the step 1 baseline (Start `4px 8px`, dropdown `0 8px`), and hover shows the select highlight | the command plus browser check |
| 4 | Content text in Sk3tch's font at the same size; stock file gone | `test ! -e styles/fonts/w95fa.woff2 && grep -c "w95fa.woff2'" styles/globals.css`, and a browser check: reload, open DUET and it's just noise, measure the same elements as step 1, and zoom a screenshot of a `list-disc` marker | test succeeds and grep prints 0; every rect equals the step 1 baseline to the pixel; the bullet is Sk3tch's dashed glyph | the command plus browser check |

## Hard rules

- Full check: `npx tsc --noEmit` and `yarn build`; lint: none in this repo (`next lint` starts interactive setup).
- Don't edit anything in the sk3tch repo; only read its built `dist/app.js` (gitignored there).
- Never hand-edit `public/sk3tch/app.js` beyond its header line.
- If check 4's rects differ from the baseline, don't adjust sizes or add `size-adjust`: park it as a report ask with the numbers (the user asked that content text keep its sizes).
- Dependencies: the repo uses yarn (`yarn.lock`), outside goodaf's no-ask install exception; Progress records whether the user approved `yarn install --frozen-lockfile` in this worktree.
- `goodaf/SCOTT-986-work-selector` also edits `styles/globals.css` (13 lines) and the R3MIX/STEV3 windows; keep this diff's `globals.css` edits to the lines named in step 5 so the later merge stays small.

## Progress

- 2026-11-07 plan written
- 2026-11-07 sk3tch app bundle built at sk3tch root `bf7757f5` (tree clean): `packages/sketch-engine/dist/app.js`, 216979 bytes
- 2026-11-07 user approved `yarn install --frozen-lockfile` in this worktree; run, exit 0 (yarn.lock unchanged from main)
- 2026-11-07 step 1: baseline on `next dev -p 3984`, Playwright 1280x800, fresh load, double-click DUET then it's just noise (1.5s settle each), click About in both, rects `x,y,w,h` (same in two runs). it's just noise: ul `140,277,1120,72`, first li `140,277,1120,24`, first p `140,85,1120,24`, p text range `645.008x15`, li text range `252.578x15`. DUET: ul `120,365,1140,168`, first li `120,365,1140,24`, first p `120,125,1140,24`, p text range `232.867x15`, li text range `358.438x15`. Both p: `W95FA 16px`, line-height 24px. Start menu item: padding `4px 8px`, hover/active bg `rgb(26, 26, 26)` text white (Standard). R3MIX Choose dropdown item: padding `0px 8px`, height 18, hover bg `rgb(26, 26, 26)` text white. Console errors already on main: hydration `style` mismatch on Home's title-bar img, `<button>` inside `<button>` in SeedDropdown. Checks 3, 4 baselines recorded

## Decisions

- Normal: bundle location: `public/sk3tch/app.js`, loaded with a `webpackIgnore` dynamic import, not imported through webpack, so a finished 217 kB bundle isn't re-transpiled. Reverse: move it under the source tree and import it normally.
- Normal: types: local minimal interfaces in `Sk3tch.tsx` instead of vendoring sk3tch's whole `dist/**/*.d.ts` tree (`app.d.ts` only re-exports from it). Reverse: copy the tree and declare the module.
- Normal: no sync script; the header comment says how to update. Reverse: add a script.
- Normal: Sk3tch's font through a `[data-sk3tch-host] .p95-root` override to `'W95FA UI'`, not `paintFontFaceRule`, which would add a second `'W95FA'` face over the body font. Reverse: drop the rule.
- Normal: shell options: `mode` default (`'app'`, Export menu), `newSeed: true`, no admin. Reverse: change the options object.
- Normal: `initSize` 800x700, in line with R3MIX and DUET, so the regular layout fits. Reverse: change the numbers.
- Normal: class rename to `ev3-menu-item` rather than scoping, since the injected sheet can't be scoped from the host. Reverse: rename back.

## Parked asks
