# Review: SCOTT-986 In-window work selector for R3MIX and 3xGP

Tier: Standard · visual (UI-only change across two windows plus a new shared component; no risk area)
Reviewed: 2026-11-07 · main at 8d9251a · reviewed 22217b1 · final 22217b1 · follow-up 1 final 74816ae
Panel: general; no Codex pass: visual or device diff
Oracle check: no oracles
Rounds: 0 (no admitted findings)
Counts: 0 fixed, 0 asks, 2 tracked, 1 dropped

## Acceptance checks

- 1 Selector is the default full content view, Win95 Large Icons, no dropdown: pass — browser check in a background tab on http://localhost:3986: R3MIX opened on the selector with 7 items, 3xGP with 3, first item selected (navy title, dithered thumb), 0 canvases mounted, no `[role=menu]`; Standard, Classic and 1-Bit palettes rendered. `grep -rn "MenuDropdown" components/windows` → exit 1, no output
- 2 Opening a work runs it; menu bar returns to the selector from the work and from About: pass — browser check: DEGEN DOLLAR by click + Open, 7 years by double-click, The Monitor by click + ArrowRight + Enter all ran; Choose R3MIX reached the selector from a sketch and from About; Open on the open work kept the same 6 canvas elements (no restart); 3xGP: icarus by double-click ran, Choose Prelude returned from the sketch and from About; at 375px a tap selected Seeing Beyond and a tap on Open ran it. Only console error: a hydration warning from `Window.tsx`/`Home.tsx`, files this diff doesn't touch
- 3 Thumbnails are small committed files: pass — `ls -l public/images/thumbs && sips -g pixelWidth -g pixelHeight public/images/thumbs/*.jpg && grep -n "images/thumbs" components/windows/R3MIX.tsx components/windows/STEV3.tsx` → exit 0; 10 JPEGs, all 96×96, 3018–8117 bytes; all 10 works point at `/images/thumbs/…`
- Follow-up 1 (B1, B2) rerun: 1 pass — browser: R3MIX 7 items and 3xGP 3, File name bar 0px under the last row, field shows the selection, Standard/Classic/1-Bit colors from tokens; 2 pass — Open after End in R3MIX at 375×420 ran In Bloom, double-click ran icarus in 3xGP, Choose R3MIX from About and Choose Prelude from a sketch returned to the selector with the open work in the field; `grep -rn "MenuDropdown" components/windows` → exit 1, no output; 3 pass — same command → exit 0, 10 JPEGs 96×96, all 10 works at `/images/thumbs/…`
- Full check: `npx tsc --noEmit` → exit 0; `yarn build` → exit 0. Follow-up 1: `npx tsc --noEmit` → exit 0; `yarn test` → exit 0 (1 pass); `yarn build` → exit 0, "Compiled successfully"

## Asks

none

## Tracked follow-ups

- T1. [selector keyboard focus] Focus the selector grid when it appears (window open, or Choose R3MIX / Choose Prelude), so arrow keys and Enter work and the dotted focus box shows without a click first. From F1.
  Answer: —
- T2. [test coverage of layout] The B2 repro test checks only markup order, so it would still pass if the File name bar moved back outside the scroll wrapper; assert the nesting, or rename the test so it doesn't claim placement. From F3.
  Answer: —

## Worth checking by hand

Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-986-work-selector · dev server: http://localhost:3986
- Open R3MIX and press the arrow keys before clicking anything → nothing moves until you click an item or Tab into the grid (T1)
- Try the selector on a real phone, including a double-tap on a thumbnail → a tap selects, Open runs the work, and no dashed hover box is left behind; double-tap behavior wasn't checked on a touch device
- Make the browser window short enough that the thumbnails scroll → the File name bar stays pinned at the bottom; with room to spare it sits right under the last row

## Findings

- F1. [tracked T1] components/WorkSelector.tsx:60-67 The grid isn't focused when the selector mounts, so arrow keys, Enter and the dotted focus rect need a click or Tab first. Found by: general. Verifier: track — real, but no done-when line breaks and the spec and plan don't say where focus starts; focusing on mount has trade-offs (pulls focus from the menu bar, can scroll on mobile).
- F2. [dropped] components/WorkSelector.tsx:44-45 Home and End jump to the first and last item, beyond the spec's arrow keys. Found by: general. Verifier: drop — no wrong output, no done-when line affected, matches Explorer and the spec's Win95-fidelity goal.
- F3. [tracked T2] components/WorkSelector.test.tsx:14-19 The B2 repro test checks label → field → Open order in static markup, which holds whether the bar is inside the scroll wrapper or back at the window bottom, so it can't catch a placement regression. Found by: general (follow-up 1). Verifier: track — real, but the test still fails on a missing bar or wrong title, placement is layout that static markup can't show and the browser check covers it, and no done-when line names bar placement.

## Bug notes

- B1. 2026-11-07 "I want some hover state, like maybe we use a dashed border when a mouse is hovering over an option."
  Done: 2026-11-07, a89464e, repro browser assertion (hovered item's outline-style: none before, dashed after)
- B2. 2026-11-07 "I want the open button to be closer so its obvious what needs to happen if they only click once, I'm not sure the best way to make this look good though" → answered "1a": a Win95 Open-dialog bar that sits directly under the last row of thumbnails (sticking to the bottom only once items overflow), with a sunken "File name:" field showing the selected title and Open beside it.
  Done: 2026-11-07, 74816ae, repro "B2: the Open bar sits under the grid, with a File name field showing the selected title beside Open" (components/WorkSelector.test.tsx)

## Follow-ups

- 2026-11-07 follow-up 1: base 2b35d51, head 74816ae; did B1, B2; review: general; no Codex pass: visual or device diff, 0 fixed, 0 new asks, 1 tracked, 0 dropped
