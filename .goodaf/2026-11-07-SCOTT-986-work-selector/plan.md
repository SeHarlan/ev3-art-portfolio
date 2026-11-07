# Plan: SCOTT-986 In-window work selector for R3MIX and 3xGP

Tier: Standard · visual (UI-only change across two windows plus a new shared component; no risk area)
Branch: goodaf/SCOTT-986-work-selector · Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-986-work-selector
Tags: visual: the whole diff (WorkSelector, both windows' view switching, thumbnails)

## Approach

Add one shared `WorkSelector` component, an Explorer "Large Icons" view, and make it the default content view of `R3MIX.tsx` and `STEV3.tsx` (the 3xGP window). Both windows already switch between sketch and About with an `activeContent` index and absolute overlays (`R3MIX.tsx:139-163`, `STEV3.tsx:134-190`); extend that to three views — selector, sketch, about — with the selector as the initial one. Drop the `MenuDropdown` render and its `menuOpen` state from both windows; `components/MenuDropdown.tsx` itself stays, untouched (the user asked to keep it for reuse). Style with the existing Win95 tokens and classes from SCOTT-973 (`--p95-*` vars, `--p95-dither`, `classic-button`, `classic-inset`, `p95-chrome`, Tailwind `windowsSelect`/`windowsSelectText`), so all three palettes work without new tokens.

## Files

- `components/WorkSelector.tsx` (new): the Large Icons grid plus an Open button.
- `components/windows/R3MIX.tsx`, `components/windows/STEV3.tsx`: three-view switching, selector as default, works list with thumbs, no dropdown.
- `public/images/thumbs/*.jpg` (new, 10 files): one thumbnail per work.
- `styles/globals.css`: only if the item's selected/focus look needs rules Tailwind can't express (dither overlay, dotted focus rect).

## Steps

1. **Thumbnails.** Download each work's source image (the `imageUrl` in its sketch file under `components/p5/RMX/*/` and `components/p5/Strakts/*/`) into a fresh folder in the session scratchpad, never the repo. With `sips`, scale the shortest side to 96 and center-crop to 96×96, JPEG, into `public/images/thumbs/<id>.jpg` with ids `rmx-dithered-sky`, `rmx-degen-dollar`, `rmx-seeing-beyond`, `rmx-7-years`, `rmx-frame35`, `rmx-the-monitor`, `rmx-bloom`, `3xgp-1`, `3xgp-2`, `3xgp-3` (3xgp numbers match `STEV3-n1..n3`). The Monitor's URL (`RMX-the-monitor.jsx:28`, ordinals.com) serves `text/html`, not an image: find the image it wraps in that HTML; if there is none, capture a still of the running sketch with "c" pressed (the original piece) in the browser and crop that. Files: `public/images/thumbs/`. Checks: 3.
2. **WorkSelector.** Props: `works: { id: string; title: string; thumb: string }[]`, `selectedId?: string` (the open work, which starts selected; else the first), `onOpen(id)`. Fills its parent (`absolute inset-0`, white field `--p95-field-bg`, scrolls when items overflow), with a `p95-chrome` bar at the bottom holding a right-aligned `classic-button` "Open". Items are a wrapping grid of fixed-width cells (~112px): 96×96 thumbnail, title centered below and wrapping. Win95 icon selection: selected item's thumbnail gets a 50% navy dither overlay (`--p95-dither` with `--p95-dither-ink: var(--p95-select-bg)`), its title gets `bg-windowsSelect text-windowsSelectText`, and when the grid has focus the title gets a 1px dotted focus rect. Single click/tap selects; double-click opens; the grid is one focusable element (`tabIndex=0`, `role="listbox"`, items `role="option"` with `aria-selected`) where arrow keys move the selection (Up/Down by the current column count, from the container width) and Enter opens; Open opens the selected item. Files: `components/WorkSelector.tsx`, maybe `styles/globals.css`. Checks: 1, 2.
3. **Windows.** In both windows: replace `contentOptions`/`activeContent` index with a view state `"selector" | "sketch" | "about"`, initial `"selector"`. The active work starts unset, so no sketch mounts (and no source image loads) until the first Open; `content`'s `useMemo` returns null for unset. `onOpen(id)` sets the active work and the view to `"sketch"`; opening the already-active work only switches view, so it doesn't restart. Once mounted, the sketch stays mounted while hidden, as it does behind About today. Menu: keep Refresh; "Choose R3MIX" / "Choose Prelude" set view `"selector"`; About sets view `"about"` (not a toggle). About's "Go back" goes to `"sketch"` when a work is open, else `"selector"`. Move each window's `menuOptions` labels into the `works` list with their thumb paths; keep the existing remix ids and switch cases. Remove the `MenuDropdown` import, render and `menuOpen` state. Files: `components/windows/R3MIX.tsx`, `components/windows/STEV3.tsx`. Checks: 1, 2.

## Acceptance checks

| # | Done-when (the ticket's line, in a few words) | Command | Expected result | Verified by |
|---|---|---|---|---|
| 1 | Selector is the default full content view, Win95 Large Icons, no dropdown | Browser check: dev URL; open R3MIX, then 3xGP, from the desktop, in each of the three palettes (Settings). Then `grep -rn "MenuDropdown" components/windows` | Each window opens on the selector filling the content area: R3MIX shows 7 items, 3xGP 3, each thumbnail with its title below, first or open work selected with navy title and dithered thumbnail; no sketch running behind. The grep prints nothing | browser check + the command itself |
| 2 | Opening a work runs it; menu bar returns to the selector from the work and from About | Browser check: in R3MIX open a work with the Open button, another by double-click, another with arrow keys + Enter; then Choose R3MIX → selector, About → Choose R3MIX → selector, Open on the same work → it resumes without restarting; repeat once in 3xGP with Choose Prelude; once at mobile width (tap to select, tap Open) | Each opened work shows its running sketch; the menu items reach the selector from both the sketch and About views; no console errors | browser check |
| 3 | Thumbnails are small committed files | `ls -l public/images/thumbs && sips -g pixelWidth -g pixelHeight public/images/thumbs/*.jpg && grep -n "images/thumbs" components/windows/R3MIX.tsx components/windows/STEV3.tsx` | 10 JPEGs, each 96×96 and well under 50 KB; every work in both windows points at `/images/thumbs/…`, none at an arweave/ordinals/cargo URL | the command itself |

## Hard rules

- Full check: `npx tsc --noEmit` and `yarn build`; lint: none in this repo (`next lint` starts interactive setup).
- Never edit `components/p5/**`; never edit `components/MenuDropdown.tsx` or delete it.
- Downloaded source images stay in the scratchpad (a fresh empty folder), never in the repo; only the 96×96 outputs are committed. Downloading them needs the user's yes, asked at start; Progress records the answer.
- Dependencies: the repo uses yarn (`yarn.lock`), outside goodaf's no-ask install exception; Progress records whether the user approved `yarn install --frozen-lockfile` in this worktree.
- Out of scope: `STEV3.tsx:36` checks `WINDOWS.R3MIX` instead of `WINDOWS.GP`; leave it.

## Progress

- 2026-11-07 plan written
- 2026-11-07 user approved downloading the 10 source images and `yarn install --frozen-lockfile` in this worktree
- 2026-11-07 setup: node_modules already present and yarn.lock matches main, so no install run
- 2026-11-07 step 1: 10 thumbnails in public/images/thumbs (96×96 JPEG, 3.0–8.1 KB); check 3 ls/sips half passes (grep half lands with step 3)
- 2026-11-07 step 2: components/WorkSelector.tsx + two globals.css rules (selected-thumb dither, label focus rect); `npx tsc --noEmit` exit 0; checks 1–2 need the windows, run after step 3
- 2026-11-07 step 3: R3MIX and 3xGP on selector/sketch/about views, no MenuDropdown; checks 1, 2, 3 pass. Check 1: both windows open on the selector (7 and 3 items, first selected, navy dithered thumb and title, no canvas mounted) in Standard, Classic and 1-Bit; `grep -rn "MenuDropdown" components/windows` prints nothing (exit 1). Check 2: R3MIX opened DEGEN DOLLAR by Open, 7 years by double-click, The Monitor by click + ArrowRight + Enter; Choose R3MIX reached the selector from a sketch and from About; Open on the open work kept the same canvases (no restart); ArrowDown/Up moved by a row; 3xGP opened icarus by double-click and Choose Prelude returned; at 375px a tap selected Seeing Beyond and a tap on Open ran it. Only console error is a hydration warning from `Window.tsx`'s icon `style` under HomeWindow, a file this diff doesn't touch. Check 3: grep shows all 10 works at `/images/thumbs/…`. `npx tsc --noEmit` exit 0, `yarn build` exit 0
- 2026-11-07 simplify: 4 edits (column count only on Up/Down, `.p95-field`, shared `Button` for Open, mask dither); all checks pass (tsc 0, build 0, MenuDropdown grep empty, 10 thumbs referenced, selector re-checked in browser: dither, arrows, Open)

## Decisions

- Normal: no Cancel button: the selector is a tab, not a modal, so Choose/About in the menu bar do Cancel's job. Reverse: add a Cancel `classic-button` beside Open that sets view `"sketch"` when a work is open.
- Normal: no sketch mounts before the first Open, so opening the window doesn't download a full-size source image. Reverse: initialize the active work to the first item.
- Normal: About becomes a direct view switch instead of the current sketch/about toggle, since there are now three views. Reverse: restore the `(prev + 1) % n` toggle.
- Normal: thumbnails 96×96 center-cropped JPEG, square like a Win95 icon cell. Reverse: regenerate with `sips -Z 96` (fit, no crop) and `object-contain`.
- Normal: The Monitor's ordinals.com URL gives curl a Cloudflare "Just a moment..." challenge page (no image inside), but the browser fetches the real 512×512 WebP. Made its thumbnail from that source image in the browser pane (scaled and center-cropped to 96×96 on a canvas, JPEG 0.85, SHA-256 checked after transfer) instead of a still of the running sketch. Reverse: replace `rmx-the-monitor.jpg` with a cropped screenshot of the sketch after pressing "c".
- Normal: the selected-thumb dither is `.p95-icon-dither`: `--p95-select-bg` fill masked by the shared `--p95-dither` (simplify; first version spelled the gradient out), because `--p95-dither` resolves its ink at `:root` and an element-level `--p95-dither-ink` override doesn't reach it. Reverse: spell out the conic-gradient in `--p95-select-bg` as the background.
- Normal (simplify): the selector root uses the existing `.p95-field` class, and Open is the shared `Button` with Settings' dialog-button sizing (`[--p95-dots:4px] min-w-[75px] h-[23px] px-2`). Reverse: back to inline field colors and a raw `classic-button`.
- Normal (simplify, skipped): moving the containing block into Window.tsx (add `relative` to the inner wrapper so `inset-0` sits inside the bevel for every window, and drop `classic-inset` from the selector). It would also move every window's About panel, outside this task's files. Reverse: make that Window.tsx change as its own task.
- Normal (simplify, skipped): unmounting the sketch while the selector shows so its p5 loop stops. That would make reopening the same work restart it, against the plan's resume behavior; the sketch keeps running hidden, as it already does behind About. Reverse: render `content` only when `view !== "selector"`.
- Normal: the whole selector uses `p95-chrome` (W95FA UI 11px), since Large Icons labels are Explorer UI text, not window content. Reverse: drop `p95-chrome` from the outer div and put it on the button bar only.
- Normal: Up/Down column count is read from the laid-out items (how many share the first row's top), which follows the wrap exactly instead of dividing the container width. Reverse: `Math.floor(grid.clientWidth / 112)`.
- Normal: the selector's root carries `classic-inset`, because `absolute inset-0` lands on the window's sunken well (its positioned box) and covered the well's 2px bevel; the root now redraws it. Reverse: drop `classic-inset` from the root div.
- Normal: the selector mounts only while shown, so each return to it starts with the open work selected. Reverse: render it always and hide it with a class.
- Normal: Refresh keeps its current behavior (remounts the active sketch) and doesn't change the view. Reverse: also set view `"sketch"` in its handler.

## Parked asks
