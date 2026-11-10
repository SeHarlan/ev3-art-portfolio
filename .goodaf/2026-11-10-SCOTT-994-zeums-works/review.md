# Review: SCOTT-994 Add missing zeums works as desktop windows

Tier: Feature (no risk modifier)
Reviewed: 2026-11-10 · main at 25fb48e · reviewed 3968797 · final 3968797
Panel: general; no Codex pass: visual or device diff
Oracle check: no oracles
Rounds: 0 (no admitted finding)
Counts: 0 fixed, 0 asks, 1 tracked, 0 dropped

## Acceptance checks

- 1 10 desktop icons open their windows: pass — Playwright at 1280×800 and 375×812, double-click each of the 9 new icons and "some days" → all 10 open a window titled with the zeums title; 21 icons, 0 overlaps, 0 off-screen at both sizes
- 2 Galleries list every item with thumbs; Choose returns; singles open on their work: pass — Playwright → remember.exe 21/21 thumbs loaded, s34s0ns 4/4, A Single Path 14/14, T3RRA 23/23, Tune Out 6/6; first item of each opens (iframe, image, image, video, video) and a T3RRA image opens from Blob; Choose <title> returns to the selector in all 5; CEASEFIRE, Exaltation of Isaac, A Flower Blooms in Autumn and "Progress" open on their work with no selector and no Choose item
- 3 Full-size media from the `ev3-portfolio` Blob store; store renamed: pass — the four step 6 commands → `50`, `50`, `0` (exit 1), and the store read shows `"name": "ev3-portfolio"`
- 4 HTML pieces load only from the site and respond to their controls: pass — `grep -noE 'https?://' public/pieces/*/index.html` → nothing (exit 1); Playwright on Nineteen and tripping (Solana) and Congolese jail (Tezos): iframe focused on open, c, f, r, left/right and up/down each change `useClear`, `useFeedback`, `useReverse`, `seedChannelIndex` and `chunk`, g toggles `disableGlitch`, s downloads `remember-.png`; "Progress": iframe focused, 5 clicks raise colored pixels 12,500 → 72,650, n resets to 15,275; the only requests off localhost are the host page's Google Fonts and Vercel analytics script
- 5 A video stops when minimized or its view is replaced: pass — Playwright on Tune Out: playing, then `paused === true` on every `<video>` after Minimize, after Choose Tune Out and after About; Go back returns to the video
- 6 Seed text area; a piece's seed reproduces it: pass — Playwright: Grandma Dale's Seed opens visible, 8 rows, focused, pre-filled `Grandma Dale`, and `$fx.hash === processHash("Grandma Dale")`; Walking around the harbor's Seed pre-fills its full 137-character memory; cleared, typed by hand and Enter → dropdown closes, `$fx.hash === processHash(memory)`, iframe focused; Shift+Enter gives `"hello\nworld"` with the dropdown still open; `hello world` + Enter → hash `helloworldhelloworld`, different from the memory's
- 7 Start menu lists 21 windows and scrolls: pass — Playwright at 1280×600 → 21 entries including "some days", list 458px fits; at 1280×400 it caps at 344px (scrollHeight 458) with its top at y=20
- 8 Each new window has a 1–3 sentence About with Go back: pass — Playwright on all 9 → 1 to 3 sentences each; Go back returns to the selector in galleries with no work open and to the work in singles
- 9 All 21 remember items open the one engine with their own exact seed: pass — `node "/Users/scottharlan/Library/Application Support/Claude/side-session-notes/local_181eaa98-878d-4bec-8b93-8fe639621c5e/SCOTT-994-check9/check-seeds.mjs"` → `21/21 match` (exit 0); `ls public/pieces` → `progress remember`
- Full check: pass — `npx tsc --noEmit` exit 0; `yarn test` exit 0 (1 pass, 0 fail); `yarn build` exit 0

## Asks

none

## Tracked follow-ups

- T1. [iframe focus handling] A piece that finishes loading after you've switched to another window pulls keyboard focus into its hidden iframe, so your keys go to the engine behind; guard the on-load focus on the window being active. From F1.
  Answer: —

## Worth checking by hand

Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-994-zeums-works · dev server: http://localhost:3994
- Press s in any remember.exe piece → the PNG saves as `remember-.png`, not `remember-<title>.png` as on the originals (the shared engine has no baked title)
- Open a few T3RRA and A Single Path images → several are 20–40 MB PNGs from Blob, so they take a moment to appear on a slow connection

## Findings

- F1. [tracked T1] hooks/usePieceFocus.tsx:17 `focusPiece` runs on iframe load without checking `isActive`, so a load that ends after a window switch focuses the iframe of a window that's behind. Found by: general. Verifier: track — real, but only when you switch windows during a local load of milliseconds to a few hundred ms; worst case a stray toggle or PNG download, no data loss or crash.

## Bug notes

none

## Follow-ups

none
