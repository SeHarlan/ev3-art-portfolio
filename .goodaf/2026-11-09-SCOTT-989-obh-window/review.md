# Review: SCOTT-989 on being human window: live pieces with selector

Tier: Standard (visual)
Reviewed: 2026-11-09 · main at 27fdb51 · reviewed 8756021 · final 8756021
Panel: general; no Codex pass: visual or device diff
Oracle check: no oracles
Rounds: 0 (no admitted findings)
Counts: 0 fixed, 0 asks, 1 tracked, 0 dropped

## Acceptance checks

- 1 Selector of 5, opening runs the piece, other windows' keys unaffected: pass — browser check on `http://localhost:3089` (worktree dev server), opened from the Start menu → selector shows five 96×96 thumbs and titles A–E; each piece's iframe (`/obh/<letter>.html`) has a canvas whose pixels change over 1.5s (A, B, D, E 1080x1920; C 1920x1080, letterboxed landscape), with the action bar at the bottom; with Sk3tch open, `s` and `f` pressed in the OBH piece reached only the iframe's window (parent keydown log empty), and `s` and `f` pressed in Sk3tch reached only the parent (iframe log unchanged)
- 2 Images from Blob, none from Irys: pass — `grep -o "gateway.irys.xyz/[A-Za-z0-9]*" public/obh/*.html | sort -u` → one id per file, its `jsonUri` (A's `6g25BeJGuAhVHshMWaMJvpgZU1i6r5nSenVz36rspe7T`); browser: each piece's iframe Resource Timing lists exactly `k4xw43ajr4eh6re3.public.blob.vercel-storage.com/obh/<letter>-thumb.png` (img, 200) and `/obh/<letter>-imagein` (fetch, 200), no gateway.irys.xyz request
- 3 Purchase opens the piece's marketplace page; Choose piece and About work: pass — browser: on piece D, Purchase called `window.open("https://opensea.io/assets/ethereum/0x4759A45c80eB04571902df74200F0D8d6c83F070/4", "_blank", "noopener")` (captured with a stub, no tab opened); Choose piece returned to the selector with D selected; About showed the series text and its Go back returned to the running piece; `curl -sIL -o /dev/null -w "%{http_code}" https://opensea.io/assets/ethereum/0x4759A45c80eB04571902df74200F0D8d6c83F070/4` → 200
- Full check: pass — `npx tsc --noEmit` → exit 0; `yarn test` → 1 pass, 0 fail; `yarn build` → exit 0

## Asks

none

## Tracked follow-ups

- T1. [3xGP key handling (pre-existing)] 3xGP's sketches check the active window against R3MIX instead of 3xGP (`components/windows/STEV3.tsx:40`), so their keys (such as `c` to clear glitch) only work while R3MIX is the active window; a one-line fix, already on main. From F1.
  Answer: 2026-11-09 "t1 - lets actually expand this into its own ticket, be default windows should only accept key inputs when they are the active window, inactive windows should stop listening/refuse input" → leave: filed as its own ticket SCOTT-991 (Backlog)

## Worth checking by hand

Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-989-obh-window · dev server: http://localhost:3089
- With another window in front, click once on the OBH piece, then again → the first click only brings OBH forward; the second reaches the piece (brush, keys)

## Findings

- F1. [tracked T1] components/windows/STEV3.tsx:40 `isActiveRef` compares against `WINDOWS.R3MIX` while the window is `WINDOWS.GP`, so 3xGP's sketch keys run only when R3MIX is active. Found by: general. Verifier: track — real but pre-existing; STEV3.tsx isn't in main...HEAD, OBH doesn't copy the ref, and no done-when line depends on it.

## Bug notes

- B1. 2026-11-09 "I want to change the image download priority, so that the thumbnail image only loads if the engine fails and the image buffers used in the engine get priority download. Look at Sk3tch baked nfts for an example of how I want it done"
  Reference: `~/Scottys art/sk3tch/server/src/vendor/bake/index.js:763-800` (`buildSketchBakedHtml`): `<link rel="preload" as="fetch" crossorigin>` for each engine buffer in `<head>`, and the fallback `<img id="fallback" fetchpriority="low">`. Note: Sk3tch still loads its fallback at low priority rather than only on failure; the user's words ask for only-on-failure. Check whether the OBH engine reads `<letter>-thumb.png` itself as a base frame before deferring it.

## Follow-ups

none
