# Plan: SCOTT-973 Sk3tch Win95 design + palette switcher

Tier: Standard (visual diff)
Branch: goodaf/SCOTT-973-sk3tch-win95-palettes · Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-973-sk3tch-win95-palettes
Tags: visual: all chrome styling (globals.css, tailwind tokens, components/*.tsx chrome, Duet/Maurer panel CSS)

## Approach

Port Sk3tch's design system from `/Users/scottharlan/Scottys art/sk3tch/packages/sketch-engine/src/engine/ui/paint/paint.css`. Bring over the tokens (Classic as the base, with `gray` and `bw` overrides), `--u`, the bevel recipes (raised, sunken, window, dither, etched separator), `.p95-btn` hover/focus dotted rect, title bar and title buttons, menu items and dropdowns, disabled text and the status panes. Put the tokens on `:root`, switched by `data-p95-theme` on `<html>`. Rewrite this repo's existing `.classic-*` utility classes in `styles/globals.css` to Sk3tch's recipes on those vars, so most components restyle without markup changes. Remap the Tailwind color names to `var(--p95-*)`. Touch components only where a token is missing or a hardcoded Tailwind color is chrome. A small ThemeProvider holds the palette, persists it to localStorage and is driven by a new Settings window. Leave out everything Sk3tch's paint.css marks as Paint-specific (toolbox, size box, color box, canvas frame and workspace, strip, full view, rec, mint/QR).

## Files

- `styles/globals.css`: tokens + 3 palettes on `:root`, second `@font-face`, rewritten `.classic-*` classes, scrollbars, menu-item/disabled helpers.
- `styles/fonts/w95fa-ui.woff2`, `styles/fonts/OFL.txt`: copied from `sk3tch/packages/sketch-engine/assets/ui-font.woff2` and `OFL.txt`.
- `tailwind.config.js`: colors become `var(--p95-*)`.
- `pages/_document.tsx`: `<Html data-p95-theme="gray">` plus an inline pre-paint script.
- `context/ThemeProvider.tsx` (new), `pages/_app.tsx`: palette state, persistence.
- `components/PixelGlyph.tsx` (new): Sk3tch pixel-row glyphs as inline SVG (port of `paint/icons-dom.ts:12-29` + rows from `model/icons.ts:401-449`).
- `components/Window.tsx`, `Footer.tsx`, `StartMenu.tsx`, `MenuDropdown.tsx`, `SeedDropdown.tsx`, `Icons.tsx`, `Button.tsx`: token and markup tweaks.
- `components/windows/Settings.tsx` (new), `context/WindowsProvider.tsx`, `pages/index.tsx`, `public/svg/settings-icon.svg` (new): the Settings window.
- `styles/Duet.css`, `styles/Maurer.css`: panel colors and bevels onto the same vars.

## Steps

1. **Tokens and theme switch.** Copy the three palettes verbatim from paint.css:7-132 (`--p95-*`, skip `--tt-primary-rgb` and the geometry tokens) onto `:root`, with `:root[data-p95-theme='gray']` and `:root[data-p95-theme='bw']` overrides. In `_document.tsx`, add `data-p95-theme="gray"` on `<Html>` and an inline `<script>` in `<Head>`. The script reads `localStorage['ev3-p95-theme']`, sets the attribute only when the value is `win95|gray|bw`, and is wrapped in try/catch. `ThemeProvider` exposes `{theme, setTheme}`: it reads the attribute on mount, and `setTheme` writes the attribute + localStorage. Wrap the app in `_app.tsx`. Files: `styles/globals.css`, `pages/_document.tsx`, `context/ThemeProvider.tsx`, `pages/_app.tsx`. Checks: 2.
2. **Font.** Add `@font-face { font-family: 'W95FA UI'; src: url('./fonts/w95fa-ui.woff2') format('woff2'); size-adjust: 145.4545%; }` with OFL.txt beside the file. Add a `.p95-chrome` class (`font-family: 'W95FA UI', Tahoma, sans-serif; font-size: calc(11 * var(--u)); line-height: 1.2; -webkit-font-smoothing: none;`). Apply it to the chrome roots: the Window frame's title bar, menu bar and status bar (not the content area), the Footer, the StartMenu panel, the dropdown panels and the desktop icon labels. Leave the existing `'W95FA'` face and `body` rule unchanged. Files: `styles/globals.css`, the chrome components. Checks: 1, 3.
3. **Bevels and buttons.** Rewrite in globals.css:
   - `.classic-button` → Sk3tch `.p95-raised` + `.p95-btn` hover/focus: dotted `::after` at inset `var(--p95-dots, 2u)`, `:hover` only inside `@media (hover: hover)`, plus `:focus-visible`.
   - `:active:not(:disabled)` → sunken bevel + label shift `translate(1px,1px)` on the content.
   - `.active` → sunken + dither (Sk3tch's `aria-pressed` look; it covers taskbar items, the Start-open state and status wells).
   - `:disabled` / `.disabled` → `color: var(--p95-text-disabled); text-shadow: 1px 1px 0 var(--p95-hilight)`, no hover rect.
   - `.classic-border` → `.p95-window` bevel.
   - `.classic-inset` → `.p95-sunken`.
   - `.classic-divider` / `.classic-bump` → Sk3tch etched separator colors.
   - `.classic-corner` → token color.
   Set `color: var(--p95-text)` on `.classic-button`. Delete the unused `.window-handle` and `.inset-height`. Files: `styles/globals.css`, `components/Button.tsx` (only if the label shift needs a wrapper span). Checks: 1.
4. **Tailwind tokens and chrome colors.** Map `windowsBG→var(--p95-desktop)`, `windowsGray→var(--p95-face)`, `windowsHeader→var(--p95-title-bg)`, `windowsDarkGray→var(--p95-shadow)`. Add `windowsSelect→var(--p95-select-bg)`, `windowsSelectText→var(--p95-select-fg)`, `windowsTitleText→var(--p95-title-fg)`, `windowsText→var(--p95-text)`, `windowsTextDisabled→var(--p95-text-disabled)`.
   - Menu/Start/dropdown item hover: `hover:bg-windowsSelect hover:text-windowsSelectText`, also on `focus-visible`, and as `ui-active:` on the headlessui items if they're `Menu.Item`.
   - Taskbar `bg-gray-300` → `bg-windowsGray`.
   - Title text `text-white` → `text-windowsTitleText`; menu-bar `text-black` and grey placeholders → `text-windowsText` / `text-windowsTextDisabled`.
   - The StartMenu sidebar uses `bg-windowsDarkGray text-windowsGray`, which still reads in all three palettes.
   - Leave content backgrounds (`bg-amber-50`, `bg-black`, `bg-white` content inset) and in-content text as they are.
   - Desktop label and Epoch link `text-white` stay, since every palette's desktop is mid/dark.
   - Files: `tailwind.config.js`, `Window.tsx`, `Footer.tsx`, `StartMenu.tsx`, `MenuDropdown.tsx`, `SeedDropdown.tsx`, `pages/index.tsx` (only if needed). Checks: 1, 2.
5. **Title bar, status bar, input, scrollbars.**
   - Title bar: replace the min/max/close PNGs in `Window.tsx` with `PixelGlyph` (ink `currentColor` from `--p95-text`; disabled uses `--p95-text-disabled`). Size the buttons 18×16 u with the close gap 2u, and use the title-btn `:active` 1px shift. Sizes in `Window.tsx`: title bar 22u.
   - Status bar: replace the `Corner` SVG with the grip glyph. Keep `public/images/*.png` files.
   - Input: the SeedDropdown input gets a `--p95-text` color and a dotted focus-visible outline.
   - Scrollbars: WebKit thumb/buttons raised on tokens, track dithered; Firefox `scrollbar-color: var(--p95-face) var(--p95-light)` (fix the malformed rules).
   - Files: `components/PixelGlyph.tsx`, `Window.tsx`, `SeedDropdown.tsx`, `styles/globals.css`. Checks: 1.
6. **Settings window.**
   - Window registration: add `SETTINGS: "Settings"` to `WINDOWS` and its `type`, an `ICONS` entry `/svg/settings-icon.svg` (16×16 pixel-art monitor drawn in fixed Win95 colors, like Sk3tch's app icon), and a conditional render in `pages/index.tsx`.
   - Contents of `components/windows/Settings.tsx`: built on `Window` (follow `Techtonic.tsx`'s shape, small default size, content bg `bg-windowsGray`). It shows a "Color palette" label and three `classic-button` toggles in order Standard, Classic, 1-Bit, each with `aria-pressed`; the current palette gets `.active`. Clicking a toggle calls `setTheme`.
   - Openers: a tray button in `Footer.tsx`, before `<Links>`, with a small glyph and `aria-label="Settings"`, opens the window via `handleOpen(WINDOWS.SETTINGS)`. The Start menu and the desktop icon come free from `WINDOWS`.
   - Files: `context/WindowsProvider.tsx`, `pages/index.tsx`, `components/windows/Settings.tsx`, `components/Footer.tsx`, `public/svg/settings-icon.svg`. Checks: 2.
7. **DUET and Maurer panels.** In `styles/Duet.css` and `styles/Maurer.css`, point `--windowGray/--windowGrayDark/--windowHeader/--windowBorder*/--windowInset` and their scoped `.classic-button`, scrollbar, input and code-block colors at the `--p95-*` vars, and add hover/active matching step 3. `color: black` on buttons → `var(--p95-text)`. Change no JS in `components/p5/**`. Anything the JS styles inline stays as is: log it. Don't touch `#DuetSketch`'s `background-color` or any canvas rule. Files: `styles/Duet.css`, `styles/Maurer.css`. Checks: 3.

## Acceptance checks

| # | Done-when (the ticket's line, in a few words) | Command | Expected result | Verified by |
|---|---|---|---|---|
| 1 | Chrome uses Sk3tch font, bevels, colors; distinct hover and pressed | Browser check: dev URL. Open Introduction and R3MIX, the Start menu, the R3MIX menu dropdown and the SeedDropdown (DUET window); hover and press a taskbar button, a title-bar button, "Go back" and a menu item. Compare against Sk3tch's paint UI (`cd "/Users/scottharlan/Scottys art/sk3tch"` dev server, sketch page) | Same font size and crispness, same bevels and title-bar glyphs; hover shows the dotted rect (buttons) or the select highlight (menu items); pressed shows the sunken bevel with a 1px label shift; disabled maximize is greyed | browser check |
| 2 | Settings switches palettes instantly; first visit Standard; reload keeps choice, no flash | Browser check: dev URL in a fresh profile (or after `localStorage.clear()`). Confirm Standard; open Settings from the tray, Start menu and desktop icon; pick Classic, then 1-Bit; reload with the network throttled | Standard first; every chrome element recolors on click with no reload; after reload the chosen palette shows from first paint; `document.documentElement.getAttribute('data-p95-theme')` matches | browser check |
| 3 | DUET/Maurer panels follow palette; canvases unchanged | Browser check: open DUET and Maurer in all three palettes; screenshot the canvases before (on `main`) and after | Instruction panels and buttons recolor with the palette; the canvases, including DUET's canvas text size and font, are identical to `main` | browser check |

## Hard rules

- Full check: `npx tsc --noEmit` and `yarn build`; lint: none in this repo (`next lint` starts interactive setup).
- Never edit `components/p5/**`. Never write theme values to `document.documentElement.style`: the RMX sketches set inline vars there.
- The `'W95FA'` @font-face and the `body` font rule stay as they are (the DUET canvas uses `textFont('W95FA')`).
- `OFL.txt` ships next to the copied font.
- `styles/drifting.css` stays as it is. Check that the `classic-*` block in `components/p5/SomeDays.jsx:503-505` is still commented out; if it's live, scope the new global rules so they don't change it.
- `user-select: none` only on chrome roots, never on `body`.

## Progress

- 2026-11-06 plan written
- 2026-11-06 step 1: Sk3tch palettes on :root, data-p95-theme pre-paint script, ThemeProvider; tsc passes, theme attribute checked in browser (saved bw applies, invalid value falls back to gray); check 2 rerun after step 6
- 2026-11-06 step 2: 'W95FA UI' face (Sk3tch file + OFL.txt) and .p95-chrome on title/menu/status bars, taskbar, Start menu, dropdowns, desktop labels; tsc passes, font seen in browser; checks 1, 3 rerun at the end
- 2026-11-06 step 3: classic-button/border/inset/divider/bump/corner rewritten to Sk3tch bevels on tokens (hover/focus dotted rect, pressed sunken + 1px label shift, toggled dither, disabled emboss); window-handle and inset-height removed; tsc passes, hover rect seen in browser
- 2026-11-06 step 4: Tailwind window colors on --p95-* vars plus select/title/text tokens; menu bar, Start menu and dropdown items get the select highlight on hover/focus; taskbar on windowsGray; tsc passes; gray and bw checked in browser (Start menu hover, taskbar, title bar)
- 2026-11-06 step 5: PixelGlyph (Sk3tch minimize/maximize/close/grip) replaces title PNGs and the Corner SVG, title bar 22u with 18x16 buttons; .p95-field text input; WebKit scrollbars raised/dithered with arrow glyphs, Firefox scrollbar-color behind @supports; tsc passes; title bar, seed field and a 16px styled scrollbar seen in browser
- 2026-11-06 step 6: Settings window (Standard/Classic/1-Bit toggles, aria-pressed + .active), WINDOWS/ICONS entry, pixel monitor icon, tray button; tsc passes; check 2 passes: after localStorage.clear() the attribute is gray and Standard is pressed; tray, Start menu and desktop icon each open it; Classic and 1-Bit recolor on click; reload keeps bw, from the inline <head> script that runs before <body> (network throttling not available in the pane, so first paint was judged from script order)
- 2026-11-06 step 7: Duet.css/Maurer.css --window* vars, panel text, header, buttons, fields, radio and tab rect on --p95-* vars; scoped bevel/hover overrides dropped for globals.css's; bare-text labels shift by padding via :not(:has(> *)); close X inverted in 1-Bit; tsc passes; check 3: in all three palettes the DUET and Maurer panels, headers, buttons and fields take the palette's colors (computed styles), and each canvas's toDataURL hash is identical across palettes; the diff touches no canvas rule, #DuetSketch background, 'W95FA' face, components/p5 or drifting.css
- 2026-11-06 simplify: 9 edits (shared --p95-bevel-*/--p95-dither tokens used by globals.css and both panel files; .p95-menu-item class replaces three copies of the select-highlight utilities; PixelGlyph rects built once and memoized; Button takes ButtonHTMLAttributes and Settings uses it; _document reuses ThemeProvider's exported attribute/default; --p95-field-bg and --p95-bitmap-filter tokens; --p95-dots fallback so the Settings toggles' 4u rect applies; dead Corner component and .classic-corner removed; unused --window* vars dropped); all checks pass: tsc 0, yarn build 0 with no warnings, browser recheck of checks 1-3 (bevels, dither, menu highlight, 4px dialog rect, panels and field per palette, canvas hash identical across palettes, saved palette restored on reload)

## Decisions

- Elevated: Sk3tch's font sizing (`size-adjust: 145.4545%` at 11px) on the existing `'W95FA'` face would grow all rem text 1.45× and change DUET's canvas text. Options: put size-adjust on the existing face; add a second face for the UI only. Chose the second face `'W95FA UI'` (Sk3tch's file) on chrome roots at 11u, keeping window content and art on the old face; it renders at the same pixel grid as Sk3tch without touching art or content. Reverse: point `.p95-chrome` at `'W95FA'` and drop the new face.
- Normal: theme attribute: `data-p95-theme` on `<html>` with Sk3tch's key names `win95|gray|bw`, localStorage key `ev3-p95-theme`, matching Sk3tch's own attribute so its CSS ports verbatim. Reverse: rename in globals.css, `_document.tsx` and ThemeProvider.
- Normal: Tailwind colors as plain `var(--p95-*)` (no `<alpha-value>`), since no opacity modifiers are used on them. Reverse: switch to rgb-channel vars.
- Normal: inactive title bar uses `--p95-shadow` (Win95's inactive-title grey); Sk3tch has no inactive token. Reverse: change the `windowsDarkGray` mapping.
- Normal: settings icon is a new pixel-art SVG in `public/svg/`, in fixed colors like Sk3tch's app icon. Reverse: delete it and point `ICONS` at an existing PNG.
- Normal: palette toggles are `classic-button`s with `aria-pressed`, following Sk3tch's pressed-toggle pattern, since Sk3tch has no radio control. Reverse: swap them for a list.
- Normal: the tray and the window status panes were `classic-button active disabled` (dithered, and `disabled` now greys text). They became `classic-inset`, Sk3tch's sunken status pane (.p95-pane .p95-sunken), so the clock isn't greyed. Reverse: put `classic-button active` back on them in Footer.tsx and Window.tsx.
- Normal: the 1px label shift moves a button's child elements (Sk3tch's `> *` translate), so bare-text labels got a `<span>`: taskbar items, SeedDropdown clear/use, every window's Go back, the techtonic/on being human Visit links. Reverse: unwrap the spans; bare text then doesn't shift.
- Normal: added a `windowsHilight` token (--p95-hilight) for inactive title text and the Start menu sidebar text. The plan's `text-windowsGray` / title-fg there is #000 on #404040 in 1-Bit. Reverse: drop the token and use text-windowsGray / text-windowsTitleText.
- Normal: tray Twitter/email icons use fill-current/stroke-current (Links.tsx) instead of black, so they follow the tray text in 1-Bit and stay black in the Home window's content. Reverse: restore fill-black / stroke-black.
- Normal: the window menu bar items lost the gap-3 spacing for Sk3tch's 6u item padding (px-1.5) so the select highlight has room. Reverse: restore `gap-3 px-1` and drop px-1.5.
- Normal: glyph ink is the --p95-icon-* vars (Sk3tch's PIXEL_INK), not currentColor: the grip needs two inks (light, shadow). Disabled title buttons set --p95-icon-ink to the disabled gray as paint.css does. Reverse: render glyphs with fill currentColor.
- Normal: the text field (.p95-field) is --p95-icon-light behind --p95-text: white/black in Standard and Classic, black/white in 1-Bit. Sk3tch has no field token, and a white field with --p95-text would be white on white in 1-Bit. Reverse: set the well back to bg-white text-black.
- Normal: Firefox's scrollbar-color sits in @supports not selector(::-webkit-scrollbar): Chrome 121+ drops ::-webkit-scrollbar styling wherever scrollbar-color applies, and it inherits. Scrollbar arrows are data-URI SVGs of Sk3tch's arrow glyphs, black with a white set for 1-Bit, since pseudo-element backgrounds can't take a CSS var color. Reverse: drop the arrow vars and @supports wrapper.
- Normal: Maurer.css's scoped ::-webkit-scrollbar rules were removed rather than recolored, so globals.css's token scrollbars apply inside the panel. Reverse: restore the block from main with var colors.
- Normal: the sketches' bare-text buttons (no JSX edits allowed) shift their label by 1px of padding when pressed (`:active:not(:has(> *))`), matching globals.css's translate for element labels. Maurer's old 2px padding shift lost to `#buttonContainer button`'s padding on main, so its bottom buttons didn't shift before. Reverse: delete the two :has rules.
- Normal: DUET/Maurer close buttons keep `/images/close.png` (sketch JSX is off limits); a 1-Bit-only `filter: invert(1)` keeps the black X visible on the black face. Reverse: delete the two `:root[data-p95-theme='bw'] & #closeButton img` rules.
- Elevated: simplify deleted `public/svg/corner.tsx` (Corner). Situation: the grip glyph replaced its only use in Window.tsx, leaving it unimported. Options: keep it as dead code; delete it. Chose delete; git keeps it. Reverse: `git checkout main -- public/svg/corner.tsx`.
- Normal: simplify skipped four review suggestions: deleting the unused Sk3tch palette tokens (the plan copies the palettes verbatim), replacing --u with px (Sk3tch's idiom), auto-wrapping Button children in a span (it breaks the flex layouts of the taskbar and title buttons), and giving .classic-border a text color (window content would inherit white text in 1-Bit). Reverse: apply any of them.
- Elevated: review fix F1 left title-bar icons alone in 1-Bit. Situation: the fix inverts the small-logo bitmaps on Start and taskbar buttons, but the title-bar icon (Window.tsx:107) sits on --p95-title-bg (white in bw) when focused and --p95-shadow (#404040) when not, so inverting it there would turn the focused icon white on white; as is, the unfocused small-logo is dark on #404040 and Maurer's focused title icon (already inverted by `invertIcon`) is white on white. Options: leave it; invert title-bar icons in bw only when unfocused and drop `invertIcon` when focused. Chose leave it, since it hangs on the inactive-title color decision. Reverse: n/a; to fix it, add a bw title-bar rule or a conditional at Window.tsx:107.
- Normal: review A1 (user answered leave): the DUET and Maurer canvases come out taller than on main at the same window size because Sk3tch's chrome is shorter; accepted, since the art's drawing code is untouched and window sizes are clamped to the screen. Reverse: n/a; restoring main's size means undoing Sk3tch's chrome sizing.

## Parked asks

## Follow-up 1

Base: 1e66238
- T1: port Sk3tch's touch press feedback (paint.css:950-957, `@media (hover: none) .p95-menu-item:active`) into globals.css beside the menu-item highlight.
- B1: title text and menu-bar items are clipped and squished; match Sk3tch's geometry: title text inherits line-height 1.2 (paint.css:245-251), menu bar 23u with 3u/2u padding and 18u items padded 0 6u (paint.css:278-297), dropdown panel 3u padding with 18u items padded 0 8u (paint.css:350-385). Repro: a browser assertion script in this folder.
