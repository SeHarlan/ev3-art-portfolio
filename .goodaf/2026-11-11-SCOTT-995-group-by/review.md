# Review: SCOTT-995 add a "group by" option in settings

Tier: Feature (no risk modifier) · Tags: visual: desktop folder icons, folder and Find windows, Start menu cascades, Settings Group by row, the three SVG icons
Reviewed: 2026-11-11 · main at 88b0cd8 · reviewed e217a6b · final 7ffe9ff
Panel: general; no Codex pass: visual or device diff
Oracle check: no oracles
Rounds: 2 (round 2's re-review said F4 is only partly fixed, and two rounds is the limit; both hand-backs matched their commits)
Counts: 3 fixed, 0 asks, 3 tracked, 0 dropped

## Acceptance checks

- 1 Group by control; rearranges right away; survives reload: pass — browser at 800×600: Settings → Media changed the desktop to code, video, image, audio with no reload and closed the open "2023" folder (gone from the taskbar); reload kept `ev3-p95-group-by` = `media`, Media pressed, desktop still Media; Experience changed the desktop and Start to Interactive, Generative, Fixed with no reload.
- 2 Year folders 2026→2022 plus top-level icons: pass — `rm -rf node_modules/.cache/test-build && npx tsc -p tsconfig.test.json && node node_modules/.cache/test-build/components/groups.test.js` → exit 0, 5/5 pass; browser with localStorage cleared: Introduction, 2026, 2025, 2024, 2023, 2022, Find, Settings, no work icons.
- 3 Media folders, overlap: pass — same test → exit 0; browser: desktop shows code, video, image, audio (T3RRA and DUET overlap pinned by the test).
- 4 Experience folders: pass — same test → exit 0; browser: Interactive, Generative, Fixed.
- 5 Folder window lists group, opens work: pass — browser double-click on 2023: window "2023" with the folder title-bar and taskbar icon lists DUET, it's just noise, Maurer Expanse, "Progress", A Single Path, T3RRA with their icons; double-click DUET opened it on top and the folder stayed open. The 375×812 tap was not re-run (see Not verified).
- 6 Start cascades: pass — browser at 800×600 and 1280×600: hover 2025 → CEASEFIRE, remember.exe, s34s0ns, Exaltation of Isaac beside it, on screen; clicking remember.exe opened it and closed the menu. At 375×812, 2023's submenu fits inside the screen (right edge 356px). Introduction, Find and Settings are plain top-level entries.
- 7 Find: opens from desktop and Start; filters; Randomize: pass after fixes F3 and F4 — same test → exit 0; browser: Find opened from Start with the field focused, 19 works when empty, `audio` and `AUDIO` → DUET, A Flower Blooms in Autumn, Tune Out; `maur` → Maurer Expanse; `2026` → techtonic, on being human, Sk3tch; `xyz` → empty with Open disabled; cleared → 19. Randomize with real mouse clicks at 1024×768 on e217a6b/271e799: the opened work covered the button and the next click opened nothing (F3, F4); after 7ffe9ff the fixer's 144 real clicks at 1024×768 and 1440×900 each opened a work.
- 8 Folder, Find and Control Panel icons look like Win95's: pass (by eye; your E2E has the final say) — browser: the three icons render crisp on the desktop at 56px and in title bars and the taskbar at 16px.
- Full check on 7ffe9ff: `yarn test` → exit 0, 32 pass, 0 fail; `npx tsc --noEmit` → exit 0; `yarn build` → exit 0 (run in a scratch copy so the dev server's `.next` stayed intact); lint: none in this repo.

## Asks

none

## Tracked follow-ups

- T1. [Find Randomize semantics] Randomize never picks the previous pick again, so after the first click it draws from the other 18 works; the spec says "from all 19", which the build reads as "not limited by the search field". From F1.
  Answer: —
- T2. [Find Randomize layout] After an In the Beginning (ITB) pick, ITB covers the right ~27px of Randomize, so only the button's left part takes clicks; the comment at `components/windows/Find.tsx:31` wrongly says no opened work can cover it. From F5.
  Answer: —
- T3. [Find Randomize layout] The F4 test in `components/windows/windows.test.tsx` compares Find's left edge with the leftmost work's, not the button's right edge, so it wouldn't catch Find moving to x 59 with the whole button under ITB. From F6.
  Answer: —

## Worth checking by hand

Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-995-group-by · dev server: http://localhost:3995
- Open Find and click Randomize 5+ times in a row without touching anything else → a new work opens each time. Find now opens at the screen's left edge with Randomize first in its row ([Randomize] Named: [field]); a review fix moved it there so opened works don't cover the button.
- On a phone, tap a desktop folder → its folder window opens (the tap path wasn't re-run in review).

## Findings

- F1. [tracked T1] `components/windows/Find.tsx:20` Randomize excludes the previous pick, against "chosen at random from all 19". Found by: general. Verifier: track — the plan's Decisions records the no-repeat on purpose, every work can still come up, and the spec line reads plainly as "not limited by the query".
- F2. [fixed f2f6a6a] `components/groups.test.tsx:41,46` the "every art window has tags" test re-checked `ART_KEYS`'s own definition, so an untagged new work would drop out of every folder, Find and Randomize with no failure. Found by: general. Verifier: admit — a test that can't fail.
- F3. [fixed 271e799] `components/Window.tsx:177` (outside diff, shows in Find) after Randomize opens a work, Find goes inactive and its content gets `pointer-events-none`, so with a real mouse every other Randomize click only brought Find forward. Found by: general. Verifier: admit — reproduced with real clicks: 6 clicks, 3 works.
- F4. [fixed 7ffe9ff] `components/windows/Find.tsx:9` at Find's default (160, 80) the first work Randomize opened covered the button, so the next real click hit the work and opened nothing (1024×768: "Progress" opened, then its iframe sat under the button and click 2 opened nothing). Found by: acceptance rerun. Verifier: none (acceptance rerun). Re-review: partly fixed, ITB still covers the button's right part (F5).
- F5. [tracked T2] `components/windows/Find.tsx:31-35` ITB (x 60, full height) still covers the right ~27px of Randomize after an ITB pick; the code comment says no work can cover it. Found by: round-2 re-review. Verifier: track — the button's center and left part still take clicks, no done-when line breaks, and plan.md Decisions records the trade-off.
- F6. [tracked T3] `components/windows/windows.test.tsx:125-138` the F4 test checks Find's left edge, not the button's right edge. Found by: round-2 re-review. Verifier: track — it can fail (it did before the fix) and isn't a weakened check; tightening it means changing the layout too.

## Bug notes

none

## Follow-ups

none
