# Review: SCOTT-995 add a "group by" option in settings

Tier: Feature (no risk modifier) · Tags: visual: desktop folder icons, folder and Find windows, Start menu cascades, Settings Group by row, the three SVG icons
Reviewed: 2026-11-11 · main at 88b0cd8 · reviewed e217a6b · final 7ffe9ff · follow-up 1 d6015e4..a35adc4
Panel: general; no Codex pass: visual or device diff (follow-up 1: general; no Codex pass: visual or device diff)
Oracle check: no oracles
Rounds: 2 (round 2's re-review said F4 is only partly fixed, and two rounds is the limit; both hand-backs matched their commits); follow-up 1: 0 (no finding admitted)
Counts: 3 fixed, 0 asks, 4 tracked, 0 dropped

## Acceptance checks

- 1 Group by control; rearranges right away; survives reload: pass — browser at 800×600: Settings → Media changed the desktop to code, video, image, audio with no reload and closed the open "2023" folder (gone from the taskbar); reload kept `ev3-p95-group-by` = `media`, Media pressed, desktop still Media; Experience changed the desktop and Start to Interactive, Generative, Fixed with no reload. The Settings window is now named My Computer (B3).
- 2 Year folders 2026→2022 plus top-level icons: pass — `rm -rf node_modules/.cache/test-build && npx tsc -p tsconfig.test.json && node node_modules/.cache/test-build/components/groups.test.js` → exit 0, 7/7 pass (incl. B4, B5); follow-up 1 browser at 1280×800 with localStorage cleared: My Computer, Find, Welcome, 2026, 2025, 2024, 2023, 2022, no work icons (B3–B5 renamed and reordered the top-level icons).
- 3 Media folders, overlap: pass — same test → exit 0; follow-up 1 browser: desktop shows My Computer, Find, Welcome, then code, video, image, audio.
- 4 Experience folders: pass — same test → exit 0; browser: Interactive, Generative, Fixed.
- 5 Folder window lists group, opens work: pass — browser double-click on 2023: window "2023" with the folder title-bar and taskbar icon lists DUET, it's just noise, Maurer Expanse, "Progress", A Single Path, T3RRA with their icons; double-click DUET opened it on top and the folder stayed open. Follow-up 1: the code and video folders show every work's thumb filling its 96px slot from a 192px (or larger) image, Sk3tch included, no broken images. The 375×812 tap was not re-run (see Not verified).
- 6 Start cascades: pass — browser at 800×600 and 1280×600: hover 2025 → CEASEFIRE, remember.exe, s34s0ns, Exaltation of Isaac beside it, on screen; clicking remember.exe opened it and closed the menu. At 375×812, 2023's submenu fits inside the screen (right edge 356px). Follow-up 1 browser at 1280×800: Start reads My Computer, Find, Welcome, a divider, then 2026…2022; clicking My Computer opened it.
- 7 Find: opens from desktop and Start; filters; Randomize: pass after fixes F3 and F4 — same test → exit 0; browser: Find opened from Start with the field focused, 19 works when empty, `audio` and `AUDIO` → DUET, A Flower Blooms in Autumn, Tune Out; `maur` → Maurer Expanse; `2026` → techtonic, on being human, Sk3tch; `xyz` → empty with Open disabled; cleared → 19. Randomize with real mouse clicks at 1024×768 on e217a6b/271e799: the opened work covered the button and the next click opened nothing (F3, F4); after 7ffe9ff the fixer's 144 real clicks at 1024×768 and 1440×900 each opened a work. Follow-up 1 didn't change Find; its list shows all 19 thumbs at 96px.
- 8 Folder, Find and Control Panel icons look like Win95's: pass (by eye; your E2E has the final say) — follow-up 1: the folder (B1) and My Computer (B3, replacing Control Panel) icons are traced cell for cell from your attached designs, the Find icon moved 1 cell left (B2); all three render crisp on the desktop at 56px and in title bars and the taskbar at 16px.
- Full check on a35adc4: `yarn test` → exit 0, 38 pass, 0 fail; `npx tsc --noEmit` → exit 0; `yarn build` → exit 0 (run on a `git archive` copy so the dev server's `.next` stayed intact); lint: none in this repo.

## Asks

none

## Tracked follow-ups

- T1. [Find Randomize semantics] Randomize never picks the previous pick again, so after the first click it draws from the other 18 works; the spec says "from all 19", which the build reads as "not limited by the search field". From F1.
  Answer: —
- T2. [Find Randomize layout] After an In the Beginning (ITB) pick, ITB covers the right ~27px of Randomize, so only the button's left part takes clicks; the comment at `components/windows/Find.tsx:31` wrongly says no opened work can cover it. From F5.
  Answer: —
- T3. [Find Randomize layout] The F4 test in `components/windows/windows.test.tsx` compares Find's left edge with the leftmost work's, not the button's right edge, so it wouldn't catch Find moving to x 59 with the whole button under ITB. From F6.
  Answer: —
- T4. [Start menu test coverage] The B5 test pins `TOP_LEVEL` and `desktopKeys` but not what `StartMenu.tsx` renders, so Start going back to its old order wouldn't fail it, though its title says it covers Start. From F7.
  Answer: —

## Worth checking by hand

Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-995-group-by · dev server: http://localhost:3995
- Look at the desktop folders and My Computer on a non-Retina screen → the traced 32×32 designs draw each cell at 1.75 CSS px there, so the folder's dither can look uneven; on Retina it's even. The Find icon stays on the 16×16 grid, so it looks chunkier beside them.
- Open a folder or Find → techtonic and Maurer Expanse still show the EV3 logos and Sk3tch its pixel palette: B6 remade the other 16 icons and left these three as they were (see Elevated decisions). "Progress" now shows a fresh render of its piece, so its colors differ from its own selector thumb.
- Open Find and click Randomize 5+ times in a row without touching anything else → a new work opens each time. Find opens at the screen's left edge with Randomize first in its row ([Randomize] Named: [field]); a review fix moved it there so opened works don't cover the button.
- On a phone, tap a desktop folder → its folder window opens (the tap path wasn't re-run in review).

## Findings

- F1. [tracked T1] `components/windows/Find.tsx:20` Randomize excludes the previous pick, against "chosen at random from all 19". Found by: general. Verifier: track — the plan's Decisions records the no-repeat on purpose, every work can still come up, and the spec line reads plainly as "not limited by the query".
- F2. [fixed f2f6a6a] `components/groups.test.tsx:41,46` the "every art window has tags" test re-checked `ART_KEYS`'s own definition, so an untagged new work would drop out of every folder, Find and Randomize with no failure. Found by: general. Verifier: admit — a test that can't fail.
- F3. [fixed 271e799] `components/Window.tsx:177` (outside diff, shows in Find) after Randomize opens a work, Find goes inactive and its content gets `pointer-events-none`, so with a real mouse every other Randomize click only brought Find forward. Found by: general. Verifier: admit — reproduced with real clicks: 6 clicks, 3 works.
- F4. [fixed 7ffe9ff] `components/windows/Find.tsx:9` at Find's default (160, 80) the first work Randomize opened covered the button, so the next real click hit the work and opened nothing (1024×768: "Progress" opened, then its iframe sat under the button and click 2 opened nothing). Found by: acceptance rerun. Verifier: none (acceptance rerun). Re-review: partly fixed, ITB still covers the button's right part (F5).
- F5. [tracked T2] `components/windows/Find.tsx:31-35` ITB (x 60, full height) still covers the right ~27px of Randomize after an ITB pick; the code comment says no work can cover it. Found by: round-2 re-review. Verifier: track — the button's center and left part still take clicks, no done-when line breaks, and plan.md Decisions records the trade-off.
- F6. [tracked T3] `components/windows/windows.test.tsx:125-138` the F4 test checks Find's left edge, not the button's right edge. Found by: round-2 re-review. Verifier: track — it can fail (it did before the fix) and isn't a weakened check; tightening it means changing the layout too.
- F7. [tracked T4] `components/groups.test.tsx:67-71` the B5 test checks the `TOP_LEVEL` and `desktopKeys` data, not the Start menu's render at `components/StartMenu.tsx:71-72`, though its title names Start. Found by: general (follow-up 1). Verifier: track — the shipped order is right and was checked in the browser; a coverage gap with no defect behind it, and the test still fails if the data changes.

## Bug notes

- B1. 2026-11-11 "Use this attached dithered design for the folders, the ones you made are way too bright." Attached design: `refs/folder-dithered.png` in this task folder (540×500 screenshot of a pixel-art folder, yellow/gray dither).
  Done: 2026-11-11, 0be9625, repro icons.test.tsx "B1: the folder icon is the yellow/gray dithered design, with no solid yellow runs"
- B2. 2026-11-11 "The find icon is off center, it should be shifted to the left a little."
  Done: 2026-11-11, f84ad7b, repro icons.test.tsx "B2: the Find icon's art sits one cell left of where it was, centered on the 16-wide grid"
- B3. 2026-11-11 "Ive also attached a computer icon, I want this for the settings window, which I want renamed to My Computer." Attached icon: `refs/my-computer.png` in this task folder (540×500 screenshot of a pixel-art computer).
  Done: 2026-11-11, 9399d0a, repro icons.test.tsx "B3: the Settings window is named My Computer, under the same SETTINGS key, with the computer icon"
- B4. 2026-11-11 "rename the introduction window to "Welcome""
  Done: 2026-11-11, b6337a8, repro groups.test.tsx "B4: the Introduction window is named Welcome, under the same HOME key"
- B5. 2026-11-11 "move the three top level windows to be first in the desktop list and the start window in this order: "My Computer", "Find", "Welcome""
  Done: 2026-11-11, 0bd9dee, repro groups.test.tsx "B5: My Computer, Find and Welcome come first on the desktop and in Start, then the folders"
- B6. 2026-11-11 "the icons in the folders are too small, I'm guessing its because they were made super small for the desktop. They were all too blurry anyways, Lets remake them all better quality and sized for the window selector size, and delete the old ones."
  Done: 2026-11-11, a35adc4, repro icons.test.tsx "B6: every work's raster icon is 192px on its longest side, 2× the selector's 96px slot"

## Follow-ups

- 2026-11-11 follow-up 1: base d6015e4, head a35adc4; did B1, B2, B3, B4, B5, B6; review: general, no Codex pass: visual or device diff, 0 fixed, 0 new asks, 1 tracked (T4), 0 dropped
