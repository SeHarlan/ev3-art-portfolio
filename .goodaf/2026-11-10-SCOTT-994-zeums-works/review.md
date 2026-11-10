# Review: SCOTT-994 Add missing zeums works as desktop windows

Tier: Feature (no risk modifier)
Reviewed: 2026-11-10 · main at 25fb48e · reviewed 3968797 · final 3968797 · follow-up 1 reviewed 5da8f94, final 5da8f94 · follow-up 2 reviewed 8edf389, final 8edf389
Panel: general; no Codex pass: visual or device diff
Oracle check: no oracles
Rounds: 0 (no admitted finding); follow-up 1: 0 (no admitted finding); follow-up 2: 0 (no admitted finding)
Counts: 0 fixed, 0 asks, 4 tracked, 0 dropped

## Acceptance checks

- 1 10 desktop icons open their windows: pass — follow-up 2 rerun with the same script and result (21 icons, 0 overlaps, 0 off-screen, 0 broken, 13/13 open at both sizes; exit 1 only from the `small-logo.png` LCP note). Follow-up 1, headless Chromium (`node "/Users/scottharlan/Library/Application Support/Claude/side-session-notes/local_a26f5357-72d9-41ee-93f6-85a5b8e10ca4/SCOTT-994-icons/check1.cjs" http://localhost:3994`) at 1280×800 and 375×812 → 21 icons, 0 overlaps, 0 off-screen, 0 broken images; the 12 redrawn icons and "some days" each open their window. The script exits 1 only because its console filter caught the existing LCP note on `small-logo.png`; no aspect-ratio warning. First review: all 10 open, titled with the zeums title
- 2 Galleries list every item with thumbs; Choose returns; singles open on their work: pass — follow-up 2 (B4 renamed Choose <title> to Select Piece), headless Chromium (`checks.cjs` in the scratchpad): 21/4/14/23/6 items with every thumb loaded, the second item opens, Select Piece returns to the selector in all 5; CEASEFIRE, Isaac, Flower and "Progress" open on their work with menu Refresh/About. First review: Playwright → remember.exe 21/21 thumbs loaded, s34s0ns 4/4, A Single Path 14/14, T3RRA 23/23, Tune Out 6/6; first item of each opens (iframe, image, image, video, video) and a T3RRA image opens from Blob; Choose <title> returns to the selector in all 5; CEASEFIRE, Exaltation of Isaac, A Flower Blooms in Autumn and "Progress" open on their work with no selector and no Choose item
- 3 Full-size media from the `ev3-portfolio` Blob store; store renamed: pass — the four step 6 commands → `50`, `50`, `0` (exit 1), and the store read shows `"name": "ev3-portfolio"`
- 4 HTML pieces load only from the site and respond to their controls: pass — `grep -noE 'https?://' public/pieces/*/index.html` → nothing (exit 1); Playwright on Nineteen and tripping (Solana) and Congolese jail (Tezos): iframe focused on open, c, f, r, left/right and up/down each change `useClear`, `useFeedback`, `useReverse`, `seedChannelIndex` and `chunk`, g toggles `disableGlitch`, s downloads `remember-.png`; "Progress": iframe focused, 5 clicks raise colored pixels 12,500 → 72,650, n resets to 15,275; the only requests off localhost are the host page's Google Fonts and Vercel analytics script
- 5 A video stops when minimized or its view is replaced: pass — follow-up 2: Tune Out's video paused after Minimize, Select Piece and About; some days' video paused on About. First review: Playwright on Tune Out: playing, then `paused === true` on every `<video>` after Minimize, after Choose Tune Out and after About; Go back returns to the video
- 6 Seed text area; a piece's seed reproduces it: pass — follow-up 2, a lighter rerun after B5 moved Seed in remember.exe's menu: Grandma Dale's Seed opens pre-filled `Grandma Dale`; `hello world` + Enter loads `?hash=hello%20world` with `$fx.hash` `helloworldhelloworld`. First review: Playwright: Grandma Dale's Seed opens visible, 8 rows, focused, pre-filled `Grandma Dale`, and `$fx.hash === processHash("Grandma Dale")`; Walking around the harbor's Seed pre-fills its full 137-character memory; cleared, typed by hand and Enter → dropdown closes, `$fx.hash === processHash(memory)`, iframe focused; Shift+Enter gives `"hello\nworld"` with the dropdown still open; `hello world` + Enter → hash `helloworldhelloworld`, different from the memory's
- 7 Start menu lists 21 windows and scrolls: pass — Playwright at 1280×600 → 21 entries including "some days", list 458px fits; at 1280×400 it caps at 344px (scrollHeight 458) with its top at y=20
- 8 Each new window has a 1–3 sentence About with Go back: pass — follow-up 2 rerun on all 9: 1–3 sentences, Go back to the selector in galleries and the work in singles. First review: Playwright on all 9 → 1 to 3 sentences each; Go back returns to the selector in galleries with no work open and to the work in singles
- 9 All 21 remember items open the one engine with their own exact seed: pass — `node "/Users/scottharlan/Library/Application Support/Claude/side-session-notes/local_181eaa98-878d-4bec-8b93-8fe639621c5e/SCOTT-994-check9/check-seeds.mjs"` → `21/21 match` (exit 0); `ls public/pieces` → `progress remember`
- Full check: pass — follow-up 2: `npx tsc --noEmit` exit 0; `yarn test` exit 0 (21 pass, 0 fail); `yarn build` exit 0. Checks 3 (`50`, `50`, `0`, `"name": "ev3-portfolio"`), 4's grep (nothing, exit 1) and 9 (`21/21 match`) rerun and pass; browser checks 1, 2, 5, 6 (lighter) and 8 rerun and pass; 4's browser part and 7 not rerun (no piece or Start menu code changed). Follow-up 1: `npx tsc --noEmit` exit 0; `yarn test` exit 0 (16 pass, 0 fail, SCOTT-989's suites included after the merge); `yarn build` exit 0. Checks 3 (`50`, `50`, `0`, `"name": "ev3-portfolio"`), 4's grep (nothing, exit 1) and 9 (`21/21 match`) rerun and pass; browser checks 2 and 5–8 not rerun, since follow-up 1 changed only icons

## Asks

none

## Tracked follow-ups

- T1. [iframe focus handling] A piece that finishes loading after you've switched to another window pulls keyboard focus into its hidden iframe, so your keys go to the engine behind; guard the on-load focus on the window being active. From F1.
  Answer: —
- T2. [icon test coverage] The fan-out icon test checks only that each icon is a PNG with clear space around its cards, so cards cropped square or drawn from the wrong thumbs would still pass; the icons as shipped are right. From F2.
  Answer: —
- T3. [loading test coverage] The B3 test checks only that "loading..." is shown when a work opens, not that it clears once an image loads or a video can play, so losing those handlers would leave it up forever and still pass; testing that needs a DOM test library (a new dev dependency). The clearing was checked in a headless browser. From F3.
  Answer: —
- T4. [unused prop] `components/Loading.tsx` takes a `className` no caller passes; dropping it (and its `clsx` import) leaves everything working. From F4.
  Answer: —

## Worth checking by hand

Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-994-zeums-works · dev server: http://localhost:3994 (restarted; reload any open tab)
- Look over the desktop icons → CEASEFIRE, Exaltation of Isaac, "Progress" and A Flower Blooms in Autumn show at their own shape, uncropped; the 5 galleries, 3xGP, R3MIX and on being human show a fan of three cards at their own shapes. On being human's old pixel-person svg stays in `public/svg/`, unused
- Press s in any remember.exe piece → the PNG saves as `remember-.png`, not `remember-<title>.png` as on the originals (the shared engine has no baked title)
- Open a few T3RRA and A Single Path images → several are 20–40 MB PNGs from Blob; "loading..." pulses over them until they finish (T3RRA-13 took about 2 minutes here)
- Open a video window (CEASEFIRE, Tune Out, some days) → it now downloads the whole video on open so it can report ready to play, which costs more Blob transfer per open than before
- Open some days → it plays the zeums video; its Blob file name carries a random suffix the upload CLI added (left in place rather than deleted)
- Look at a window's menu and content edge → menus read Select Piece, Seed, Refresh, About (Purchase/Mint last); every content box has one sunken bevel, including over videos and About pages

## Findings

- F1. [tracked T1] hooks/usePieceFocus.tsx:17 `focusPiece` runs on iframe load without checking `isActive`, so a load that ends after a window switch focuses the iframe of a window that's behind. Found by: general. Verifier: track — real, but only when you switch windows during a local load of milliseconds to a few hundred ms; worst case a stray toggle or PNG download, no data loss or crash.
- F2. [tracked T2] components/icons.test.tsx:81 the B1.2–4 test asserts only the fan-out icon's path and that over 10% of its pixels are transparent, so square-cropped cards or the wrong source thumbs would pass; the shipped icons meet B1 (cards at mixed true aspects in selector order). Found by: general. Verifier: track — a real coverage gap, not a defect: the test was seen red, nothing was weakened, and no done-when line asks for an automated check of the fan's look.
- F3. [tracked T3] components/windows/windows.test.tsx:45 the B3 test only server-renders, so it asserts the overlay shows but never that it clears; removing `onCanPlay`/`onPlaying`/`onLoad`/`onError` or the cached-image ref in `components/MediaWindow.tsx` would leave "loading..." up forever and still pass. Found by: general. Verifier: track — a real coverage gap, not a defect: the test was seen red before the fix, the clearing was checked in a headless browser, and covering it needs a DOM test library, a dependency choice.
- F4. [tracked T4] components/Loading.tsx:5 the `className` prop and `clsx` import have no caller; the one use is `<Loading />` in MediaWindow. Found by: general. Verifier: track — nothing breaks; a simplicity choice under "nothing more", not a must-fix.

## Bug notes

- B1. 2026-11-10 "Icon redo, for follow-up after review" (the user's comment on SCOTT-994, 2026-11-10): "1. Every desktop icon made from a thumbnail keeps its source's aspect ratio, with no square crop: CEASEFIRE, Exaltation of Isaac, "Progress", A Flower Blooms in Autumn. 2. Galleries drop the 2×2 grid collage for a fan-out of up to three thumbnails, each in its true aspect ratio: remember.exe, s34s0ns, A Single Path, T3RRA, Tune Out. 3. 3xGP and R3MIX get the same fan-out, from their existing selector thumbs (`public/images/thumbs/3xgp-1…3.jpg`, `rmx-*.jpg`). 4. "on being human" swaps its pixel-person icon (`/svg/obh-icon.svg`, added by SCOTT-989 on main) for the same fan-out, made from its thumbs (`public/images/thumbs/obh-a…e.jpg`). This branch doesn't have SCOTT-989's work yet, so main has to be merged into it first. Scope: the 9 new windows, 3xGP, R3MIX and "on being human". Every other existing icon stays as it is."
  Done: 2026-11-10, 5da8f94, repro `components/icons.test.tsx` "B1.1" and "B1.2–4"
- B2. 2026-11-10 "make sure there's an inset border in any of these content windows"
  Done: 2026-11-10, 18ed344, repro `components/windows/windows.test.tsx` "B2"
- B3. 2026-11-10 "add loading state pulsing "loading..." for now, make it reusable so we can change them all from one spot later. use this while images and videos are loading till they are ready to play/be seen fully"
  Done: 2026-11-10, eb71cda, repro `components/windows/windows.test.tsx` "B3"
- B4. 2026-11-10 "change "Choose <x>" to "Select Piece" for all selector components."
  Done: 2026-11-10, b952927, repro `components/windows/windows.test.tsx` "B4"
- B5. 2026-11-10 "change the order of menu options to be consistent, if a menu option doesn't apply skip it: "Select Piece", Seed, Refresh, About, Purchase"
  Done: 2026-11-10, 695a897, repro `components/windows/windows.test.tsx` "B5"
- B6. 2026-11-10 "replace the interactive html in Some days with the Video from zeums"
  Done: 2026-11-10, 8edf389, repro `components/windows/windows.test.tsx` "B6"

## Follow-ups

- 2026-11-10 follow-up 1: base 41b5475 (main merged in first), head 5da8f94; did B1; review: general (no Codex pass: visual or device diff), 0 fixed, 0 new asks, 1 tracked (T2), 0 dropped
- 2026-11-10 follow-up 2: base 0f7c151, head 8edf389; did B2, B3, B4, B5, B6; review: general (no Codex pass: visual or device diff), 0 fixed, 0 new asks, 2 tracked (T3, T4), 0 dropped
