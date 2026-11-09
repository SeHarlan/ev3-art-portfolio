# Review: SCOTT-989 on being human window: live pieces with selector

Tier: Standard (visual)
Reviewed: 2026-11-09 · main at 27fdb51 · reviewed 8756021 · final 3034a08 (follow-up 4)
Panel: general; no Codex pass: visual or device diff (follow-ups 1–4: same)
Oracle check: no oracles
Rounds: 0 (no admitted findings); follow-up 2: 1 (F3 fixed; the re-review found it fixed and nothing new); follow-up 3: 0 (no findings); follow-up 4: 0 (no findings)
Counts: 1 fixed, 1 ask, 2 tracked, 0 dropped

## Acceptance checks

- 1 Selector of 5, opening runs the piece, other windows' keys unaffected: pass — browser check on `http://localhost:3089` (worktree dev server), opened from the Start menu → selector shows five 96×96 thumbs and titles A–E; each piece's iframe (`/obh/<letter>.html`) has a canvas whose pixels change over 1.5s (A, B, D, E 1080x1920; C 1920x1080, letterboxed landscape), with the action bar at the bottom; with Sk3tch open, `s` and `f` pressed in the OBH piece reached only the iframe's window (parent keydown log empty), and `s` and `f` pressed in Sk3tch reached only the parent (iframe log unchanged)
- 2 Images from Blob, none from Irys: pass — `grep -o "gateway.irys.xyz/[A-Za-z0-9]*" public/obh/*.html | sort -u` → one id per file, its `jsonUri` (A's `6g25BeJGuAhVHshMWaMJvpgZU1i6r5nSenVz36rspe7T`); browser: each piece's iframe Resource Timing lists exactly `k4xw43ajr4eh6re3.public.blob.vercel-storage.com/obh/<letter>-thumb.png` (img, 200) and `/obh/<letter>-imagein` (fetch, 200), no gateway.irys.xyz request
- 3 Purchase opens the piece's marketplace page; Choose piece and About work: pass — browser: on piece D, Purchase called `window.open("https://opensea.io/assets/ethereum/0x4759A45c80eB04571902df74200F0D8d6c83F070/4", "_blank", "noopener")` (captured with a stub, no tab opened); Choose piece returned to the selector with D selected; About showed the series text and its Go back returned to the running piece; `curl -sIL -o /dev/null -w "%{http_code}" https://opensea.io/assets/ethereum/0x4759A45c80eB04571902df74200F0D8d6c83F070/4` → 200
- Full check: pass — `npx tsc --noEmit` → exit 0; `yarn test` → 1 pass, 0 fail; `yarn build` → exit 0
- Follow-up 1 rerun (2aa1e37): 1 pass — opened from the Start menu, selector of five, piece C runs in the window (canvas 1920x1080, fallback removed); 2 pass — the grep lists one `jsonUri` id per file, and each page's Resource Timing (A–E) lists exactly `<letter>-imagein` and `<letter>-thumb.png`, once each, both `initiatorType: link`, from the Blob host, no gateway.irys.xyz request, no preload console warning; 3 not rerun (menu code unchanged since 8756021); full check pass — `yarn test` → 2 pass, 0 fail; `npx tsc --noEmit` → exit 0; `yarn build` → exit 0
- Follow-up 2 rerun (ecd3809): 1 pass — opened from the desktop icon (the new person icon), selector of five titled "A: there must be something" … "E: something was found"; switching pieces through Choose piece 12 times (C four times) and C three times with the window maximized, every piece removed its still and ran, no console error; 2 pass — the grep lists one `jsonUri` id per file; each page's Resource Timing lists `<letter>-thumb.png` (link) and `<letter>-imagein` (fetch, twice: the `<head>` fetch and the engine's, which reuses it), all from the Blob host, no gateway.irys.xyz request; 3 pass, as changed by B5 — Purchase called `window.open("https://manifold.xyz/@ev3/contract/124346608", "_blank", "noopener")` from the selector, before any piece was opened (captured with a stub); the URL returns 200 to `curl -sL`; Choose piece returned to the selector with D selected; About showed the new copy, inset, with 16px padding, and Go back returned to the piece (or the selector with none open); full check pass — `yarn test` → 9 pass, 0 fail; `npx tsc --noEmit` → exit 0; `yarn build` → exit 0
- Follow-up 3 rerun (15503a5): 1 pass — opened from the desktop icon; the selector shows the five thumbs at their own shape (A, B, D, E 54×96, C 96×54) in 96×96 boxes; opening A, B, C, D, E, then C again through Choose piece, each iframe removed its still and ran (A, B, D, E canvas 1080x1920, C 1920x1080), none marked failed; C's canvas pixels changed over 1.5s; with Sk3tch open, `s` and `f` pressed in Sk3tch reached only the page (iframe log empty), and pressed in the piece reached only the iframe (page log unchanged); 2 pass — the grep lists one `jsonUri` id per file; each page's Resource Timing lists `<letter>-thumb.png` (link) and `<letter>-imagein` (fetch) from the Blob host, no gateway.irys.xyz request; 3 pass — Purchase called `window.open("https://manifold.xyz/@ev3/contract/124346608", "_blank", "noopener")` (captured with a stub), which returns 200 to `curl -sL`; Choose piece returned to the selector with C selected; About showed the copy and Go back returned to the piece; full check pass — `yarn test` → 13 pass, 0 fail; `npx tsc --noEmit` → exit 0; `yarn build` → exit 0
- Follow-up 4 rerun (3034a08): 1 pass — opened from the Start menu, selector of five; piece C ran (canvas 1920x1080, pixels changed over 1.5s, still removed, not marked failed); the Sk3tch key part not rerun (B11 changed only the pages' Loading CSS); 2 pass — the grep lists one `jsonUri` id per file; C's iframe requested only `c-thumb.png` and `c-imagein` from the Blob host, no gateway.irys.xyz request; 3 pass — Purchase called `window.open("https://manifold.xyz/@ev3/contract/124346608", "_blank", "noopener")` (captured with a stub); About showed the copy and Go back returned to the piece; Choose piece returned to the selector with C selected; full check pass — `yarn test` → 14 pass, 0 fail; `npx tsc --noEmit` → exit 0; `yarn build` → exit 0

## Asks

- A1. [parked: spec meaning] B1 asked for the thumbnail to load only if the engine fails, but the thumbnail is the engine's own base image (it loads it as its first frame before anything else), so it can't be held back; the follow-up instead preloads both engine images at page start, so the second one (the imagein) no longer waits for the thumbnail, and leaves the still-image fallback as is (it shares the engine's download, no extra bytes). Should it stay that way? Left as is, each piece downloads the same two files as before, now in parallel, and the still shows until the first frame. From B1 and plan.md. Recommend: leave — deferring the thumbnail would block the engine; the only other lever, a low priority on the fallback, would slow the engine's first frame. Follow-up 2 (B2): the imagein is now started by a `fetch()` in `<head>` instead of a preload, since the preload broke the engine once cached; the thumbnail is still preloaded.
  Answer: —

## Tracked follow-ups

- T1. [3xGP key handling (pre-existing)] 3xGP's sketches check the active window against R3MIX instead of 3xGP (`components/windows/STEV3.tsx:40`), so their keys (such as `c` to clear glitch) only work while R3MIX is the active window; a one-line fix, already on main. From F1.
  Answer: 2026-11-09 "t1 - lets actually expand this into its own ticket, be default windows should only accept key inputs when they are the active window, inactive windows should stop listening/refuse input" → leave: filed as its own ticket SCOTT-991 (Backlog)
- T2. [OBH test coverage (window wiring)] The B5 test pins `PURCHASE_URL`'s value but nothing tests that the menu's Purchase uses it (`components/windows/OnBeingHuman.tsx:41`); the window itself can't be rendered by the node tests, whose build doesn't resolve its `@/` imports. From F2.
  Answer: —

## Worth checking by hand

Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-989-obh-window · dev server: http://localhost:3089
- Open a piece with DevTools' Network panel open, Disable cache ticked and throttling on (Fast 4G) → "Loading..." blinks in the center at half its old size, in the action bar's green, until the piece starts moving

## Findings

- Follow-up 4: no findings (general reviewer, 5aaa5fb..3034a08).
- Follow-up 3: no findings (general reviewer, 1905739..15503a5).
- Follow-up 1: no findings (general reviewer, e599830..2aa1e37).
- F2. [tracked T2] components/windows/obh.test.tsx:28-33 The B5 test checks only the exported constant, so deleting or rewiring the menu's Purchase item would still pass. Found by: general (follow-up 2). Verifier: track — accurate, but nothing is wrong today, the test failed before B5, and the menu wiring is covered by check 3's browser run; closing it needs the window rendered in the test build.
- F3. [fixed ecd3809] components/windows/obh.tsx:26 B6's `classic-inset` overrode the About view's `p-4` (`.classic-inset` sets its own padding later in styles/globals.css), dropping the text's padding from 16px to 2px. Found by: general (follow-up 2, as unverified), browser check. Verifier: admit — introduced by B6 and not asked for; `!p-4`, as `components/Footer.tsx:79` does. Re-review: fixed, no new findings.
- F1. [tracked T1] components/windows/STEV3.tsx:40 `isActiveRef` compares against `WINDOWS.R3MIX` while the window is `WINDOWS.GP`, so 3xGP's sketch keys run only when R3MIX is active. Found by: general. Verifier: track — real but pre-existing; STEV3.tsx isn't in main...HEAD, OBH doesn't copy the ref, and no done-when line depends on it.

## Bug notes

- B1. 2026-11-09 "I want to change the image download priority, so that the thumbnail image only loads if the engine fails and the image buffers used in the engine get priority download. Look at Sk3tch baked nfts for an example of how I want it done"
  Reference: `~/Scottys art/sk3tch/server/src/vendor/bake/index.js:763-800` (`buildSketchBakedHtml`): `<link rel="preload" as="fetch" crossorigin>` for each engine buffer in `<head>`, and the fallback `<img id="fallback" fetchpriority="low">`. Note: Sk3tch still loads its fallback at low priority rather than only on failure; the user's words ask for only-on-failure. Check whether the OBH engine reads `<letter>-thumb.png` itself as a base frame before deferring it.
  Done: 2026-11-10, 2aa1e37, repro "B1: each OBH page's <head> preloads its engine buffers, the imagein as fetch and the thumb as image, both crossorigin" (failed on `a: preload for its imageInUrl in <head>` before the fix). The thumbnail is the engine's base frame, so it can't wait for a failure; see A1.
- B2. 2026-11-10 "when I first loaded a piece it took loaded the image in chunks and took a while to load the code, but worse is that when I went to choose another piece it loaded the thumbnail but never loaded the code. After refreshing the code loads right away for all of them except for C when I had the window expanded, when its a small window it loads."
  Reference: reported after follow-up 1 (2aa1e37) added the `<head>` preloads; check whether they're involved before anything else. C is the only landscape piece (1920x1080), so "fails only when the window is expanded" points at canvas or WebGL size or context limits; a second piece opened after the first points at the old iframe's engine or WebGL context not being released when `key={id}` swaps the iframe.
  Done: 2026-11-10, 54b3f1e, repro "B2: no OBH page preloads its imagein as fetch, which makes the engine's own fetch fail once the response is cached" (failed on `a: no as="fetch" preload in <head>` before the fix). Cause: follow-up 1's `as="fetch"` preload; once the imagein is cached, the engine's fetch matched to it throws "Failed to fetch" and the engine never starts, leaving the still up. The window size didn't matter: C and A failed at the same small size, and C runs maximized now. The imagein download now starts with a `fetch()` in each page's `<head>`.
- B3. 2026-11-10 "I want an simple person/user icon as the icon for OBH."
  Done: 2026-11-10, fc2a96a, repro "B3: OBH's icon is its own person icon in public/svg"
- B4. 2026-11-10 "the titles should include the letter like this "A: there must be something""
  Done: 2026-11-10, 4896c2b, repro "B4: each piece's title starts with its letter"
- B5. 2026-11-10 "the purchase link should always go to the manifold collection page, not opensea"
  Reference: contract `0x4759A45c80eB04571902df74200F0D8d6c83F070` (Manifold Creator ERC-721); "always" means the same collection URL whichever piece is open, and replaces the Normal decision on the OpenSea per-token page.
  Done: 2026-11-10, 4fc72e5, repro "B5: Purchase opens the Manifold collection page, the same for every piece". The page is `https://manifold.xyz/@ev3/contract/124346608`; Purchase is now in the menu before a piece is opened too.
- B6. 2026-11-10 "make the about page inset"
  Done: 2026-11-10, 177926c (padding restored in ecd3809, F3), repro "B6: the About view is drawn inset, with the sunken bevel over the window's well"
- B7. 2026-11-10 "for the about copy. replace the current text with the following:" "A series of personal photographs glitched to enshrine the emotions and moments they hold.

  A: there must be something
  B: there is nothing else
  C: was it all a dream
  D: the abyss gazes back
  E: something was found"
  Done: 2026-11-10, 1d5fb1b, repro "B7: the About copy is the series line, then the five lettered titles". The bold "on being human" heading stays above it.
- B8. 2026-11-10 "I don't like the thumbnail loading in chunks, lets hide it and replace it with "Loading..." flashing in the W95FA font in the center of the page till the code is ready to play"
  Reference: the chunked image is the page's fallback `<img id="fallback">` (the thumbnail PNG), which the engine removes on its first frame (`onFirstFrame: () => J8?.remove()`); the engine still needs the thumbnail as its base frame (A1), so hide the `<img>`, don't stop the download. Check the font's name and how the portfolio loads W95FA, and whether the iframe page can use it.
  Done: 2026-11-10, 725340a, repro "B8: each OBH page hides its still behind a flashing W95FA Loading... until the engine's first frame, and shows the still again only if the engine fails" (failed on `a: a W95FA @font-face in <head>` before the fix). The still is hidden, not stopped (the engine still needs it); "Loading..." blinks in W95FA (a copy at `public/obh/w95fa.woff2`) until the engine's first frame; if the engine logs a start failure, the still shows instead.
- B9. 2026-11-10 "disable the system menu button."
  Reference: read as the piece's own action-bar "System" button (☰, shortcut `Q`, "Open the external system menu" in the engine's menu), which does nothing here because the vendored pages pass no `onAppMenu`; disable both the button and its `Q` shortcut without editing engine bytes if possible.
  Done: 2026-11-10, 0b3a568, repro "B9: each OBH page draws the action bar's System button disabled, unclickable, as the engine's tt-disabled does" (failed on `a: #tt-btn-system disabled in <head>` before the fix). Dimmed and unclickable by CSS, the engine's own disabled look; `Q` already did nothing here, so it's left alone.
- B10. 2026-11-10 "redo the window select thumbnails so they maintain their original aspect ratios"
  Reference: `public/images/thumbs/obh-{a..e}.jpg` are 96×96 center crops (step 1, `sips`) of the thumbnail PNGs, which are 1080×1920 portrait except C, 1920×1080 landscape; redo them uncropped at their own aspect within the selector's 96px box (`WorkSelector`'s `<img>` is a fixed `w-24 h-24`, shared with 3xGP and R3MIX, whose thumbs are square).
  Done: 2026-11-10, 15503a5, repro "B10: the selector thumbs keep their pieces' aspect, 54×96 portrait and C 96×54 landscape" (failed on the deep-equal, `w: 96` for `w: 54`) and "B10 (SCOTT-989): a thumb shows at its own shape, centered in the 96×96 icon box, not stretched square" (failed on `the img isn't forced to 96×96`). The selection dither covers only the image.
- B11. 2026-11-10 "make the loading text smaller and in the OBH engine UI green color"
  Reference: B8's "Loading..." is the `#art:has(#fallback)::after` rule in each `public/obh/<letter>.html` `<head>` (white, 32px); W95FA's native pixel size is 16px, so smaller keeps it crisp at 16px. The engine's UI green is `#00ff80` (menu.css; the action bar labels use `#00ff8099`, 60% alpha). Update B8's test in `components/windows/obhPages.test.tsx` to match.
  Done: 2026-11-10, 3034a08, repro "B11: each OBH page's Loading... is 16px, W95FA's native size, in the engine UI's green #00ff80" (failed on `a: Loading... in the engine UI's green` before the fix). B8's test is unchanged; the new test pins the color and size.
- B12. 2026-11-10 "thats not the same green as the engine UI, its too bright"
  Reference: B11 used `#00ff80`, which the engine uses only on pressed or active action-bar buttons (`.tt-action-bar-btn:active`, `.tt-active`); the bar's resting text ("TOOLS" and the button labels) is `#00ff8099` (`.tt-action-bar-btn`, `.tt-action-bar-label:before/:after`), 60% alpha, about `#00994d` on black. Match that resting color in each page's Loading rule and update the B11 test.

## Follow-ups

- 2026-11-10 follow-up 1: base e599830, head 2aa1e37; did B1; review: general, no Codex pass: visual or device diff, 0 fixed, 1 new ask (A1), 0 tracked, 0 dropped
- 2026-11-10 follow-up 2: base fb0c58e, head ecd3809; did B2, B3, B4, B5, B6, B7; review: general, no Codex pass: visual or device diff, 1 fixed (F3), 0 new asks, 1 tracked (T2), 0 dropped
- 2026-11-10 follow-up 3: base 1905739, head 15503a5; did B8, B9, B10; review: general, no Codex pass: visual or device diff, 0 fixed, 0 new asks, 0 tracked, 0 dropped
- 2026-11-10 follow-up 4: base 5aaa5fb, head 3034a08; did B11; review: general, no Codex pass: visual or device diff, 0 fixed, 0 new asks, 0 tracked, 0 dropped
