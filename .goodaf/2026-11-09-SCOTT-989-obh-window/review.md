# Review: SCOTT-989 on being human window: live pieces with selector

Tier: Standard (visual)
Reviewed: 2026-11-09 · main at 27fdb51 · reviewed 8756021 · final 2aa1e37 (follow-up 1)
Panel: general; no Codex pass: visual or device diff (follow-up 1: same)
Oracle check: no oracles
Rounds: 0 (no admitted findings)
Counts: 0 fixed, 1 ask, 1 tracked, 0 dropped

## Acceptance checks

- 1 Selector of 5, opening runs the piece, other windows' keys unaffected: pass — browser check on `http://localhost:3089` (worktree dev server), opened from the Start menu → selector shows five 96×96 thumbs and titles A–E; each piece's iframe (`/obh/<letter>.html`) has a canvas whose pixels change over 1.5s (A, B, D, E 1080x1920; C 1920x1080, letterboxed landscape), with the action bar at the bottom; with Sk3tch open, `s` and `f` pressed in the OBH piece reached only the iframe's window (parent keydown log empty), and `s` and `f` pressed in Sk3tch reached only the parent (iframe log unchanged)
- 2 Images from Blob, none from Irys: pass — `grep -o "gateway.irys.xyz/[A-Za-z0-9]*" public/obh/*.html | sort -u` → one id per file, its `jsonUri` (A's `6g25BeJGuAhVHshMWaMJvpgZU1i6r5nSenVz36rspe7T`); browser: each piece's iframe Resource Timing lists exactly `k4xw43ajr4eh6re3.public.blob.vercel-storage.com/obh/<letter>-thumb.png` (img, 200) and `/obh/<letter>-imagein` (fetch, 200), no gateway.irys.xyz request
- 3 Purchase opens the piece's marketplace page; Choose piece and About work: pass — browser: on piece D, Purchase called `window.open("https://opensea.io/assets/ethereum/0x4759A45c80eB04571902df74200F0D8d6c83F070/4", "_blank", "noopener")` (captured with a stub, no tab opened); Choose piece returned to the selector with D selected; About showed the series text and its Go back returned to the running piece; `curl -sIL -o /dev/null -w "%{http_code}" https://opensea.io/assets/ethereum/0x4759A45c80eB04571902df74200F0D8d6c83F070/4` → 200
- Full check: pass — `npx tsc --noEmit` → exit 0; `yarn test` → 1 pass, 0 fail; `yarn build` → exit 0
- Follow-up 1 rerun (2aa1e37): 1 pass — opened from the Start menu, selector of five, piece C runs in the window (canvas 1920x1080, fallback removed); 2 pass — the grep lists one `jsonUri` id per file, and each page's Resource Timing (A–E) lists exactly `<letter>-imagein` and `<letter>-thumb.png`, once each, both `initiatorType: link`, from the Blob host, no gateway.irys.xyz request, no preload console warning; 3 not rerun (menu code unchanged since 8756021); full check pass — `yarn test` → 2 pass, 0 fail; `npx tsc --noEmit` → exit 0; `yarn build` → exit 0

## Asks

- A1. [parked: spec meaning] B1 asked for the thumbnail to load only if the engine fails, but the thumbnail is the engine's own base image (it loads it as its first frame before anything else), so it can't be held back; the follow-up instead preloads both engine images at page start, so the second one (the imagein) no longer waits for the thumbnail, and leaves the still-image fallback as is (it shares the engine's download, no extra bytes). Should it stay that way? Left as is, each piece downloads the same two files as before, now in parallel, and the still shows until the first frame. From B1 and plan.md. Recommend: leave — deferring the thumbnail would block the engine; the only other lever, a low priority on the fallback, would slow the engine's first frame.
  Answer: —

## Tracked follow-ups

- T1. [3xGP key handling (pre-existing)] 3xGP's sketches check the active window against R3MIX instead of 3xGP (`components/windows/STEV3.tsx:40`), so their keys (such as `c` to clear glitch) only work while R3MIX is the active window; a one-line fix, already on main. From F1.
  Answer: 2026-11-09 "t1 - lets actually expand this into its own ticket, be default windows should only accept key inputs when they are the active window, inactive windows should stop listening/refuse input" → leave: filed as its own ticket SCOTT-991 (Backlog)

## Worth checking by hand

Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-989-obh-window · dev server: http://localhost:3089
- With another window in front, click once on the OBH piece, then again → the first click only brings OBH forward; the second reaches the piece (brush, keys)
- Open a piece with DevTools' Network panel open and Disable cache ticked → `<letter>-imagein` and `<letter>-thumb.png` start together at page load (initiator: link), each requested once

## Findings

- Follow-up 1: no findings (general reviewer, e599830..2aa1e37).
- F1. [tracked T1] components/windows/STEV3.tsx:40 `isActiveRef` compares against `WINDOWS.R3MIX` while the window is `WINDOWS.GP`, so 3xGP's sketch keys run only when R3MIX is active. Found by: general. Verifier: track — real but pre-existing; STEV3.tsx isn't in main...HEAD, OBH doesn't copy the ref, and no done-when line depends on it.

## Bug notes

- B1. 2026-11-09 "I want to change the image download priority, so that the thumbnail image only loads if the engine fails and the image buffers used in the engine get priority download. Look at Sk3tch baked nfts for an example of how I want it done"
  Reference: `~/Scottys art/sk3tch/server/src/vendor/bake/index.js:763-800` (`buildSketchBakedHtml`): `<link rel="preload" as="fetch" crossorigin>` for each engine buffer in `<head>`, and the fallback `<img id="fallback" fetchpriority="low">`. Note: Sk3tch still loads its fallback at low priority rather than only on failure; the user's words ask for only-on-failure. Check whether the OBH engine reads `<letter>-thumb.png` itself as a base frame before deferring it.
  Done: 2026-11-10, 2aa1e37, repro "B1: each OBH page's <head> preloads its engine buffers, the imagein as fetch and the thumb as image, both crossorigin" (failed on `a: preload for its imageInUrl in <head>` before the fix). The thumbnail is the engine's base frame, so it can't wait for a failure; see A1.
- B2. 2026-11-10 "when I first loaded a piece it took loaded the image in chunks and took a while to load the code, but worse is that when I went to choose another piece it loaded the thumbnail but never loaded the code. After refreshing the code loads right away for all of them except for C when I had the window expanded, when its a small window it loads."
  Reference: reported after follow-up 1 (2aa1e37) added the `<head>` preloads; check whether they're involved before anything else. C is the only landscape piece (1920x1080), so "fails only when the window is expanded" points at canvas or WebGL size or context limits; a second piece opened after the first points at the old iframe's engine or WebGL context not being released when `key={id}` swaps the iframe.
- B3. 2026-11-10 "I want an simple person/user icon as the icon for OBH."
- B4. 2026-11-10 "the titles should include the letter like this "A: there must be something""
- B5. 2026-11-10 "the purchase link should always go to the manifold collection page, not opensea"
  Reference: contract `0x4759A45c80eB04571902df74200F0D8d6c83F070` (Manifold Creator ERC-721); "always" means the same collection URL whichever piece is open, and replaces the Normal decision on the OpenSea per-token page.
- B6. 2026-11-10 "make the about page inset"
- B7. 2026-11-10 "for the about copy. replace the current text with the following:" "A series of personal photographs glitched to enshrine the emotions and moments they hold.

  A: there must be something
  B: there is nothing else
  C: was it all a dream
  D: the abyss gazes back
  E: something was found"

## Follow-ups

- 2026-11-10 follow-up 1: base e599830, head 2aa1e37; did B1; review: general, no Codex pass: visual or device diff, 0 fixed, 1 new ask (A1), 0 tracked, 0 dropped
