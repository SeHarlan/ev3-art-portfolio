# Review: SCOTT-987 Serve portfolio images from Vercel Blob with image optimization

Tier: Standard · visual (changes how every image and video work displays)
Reviewed: 2026-11-11 · main at 9ea02ac · reviewed 2af9480 · final 21e23d6
Panel: general; no Codex pass: visual or device diff
Oracle check: no oracles
Rounds: 1 (round 1 fixed F2 and the re-review found nothing new; hand-back matched)
Counts: 1 fixed, 0 asks, 1 tracked, 0 dropped

## Acceptance checks

- 1 Image work loads optimized AVIF/WebP via `/_next/image`; Full Res shows the original PNG: pass — `rm -rf node_modules/.cache/test-build && npx tsc -p tsconfig.test.json && node node_modules/.cache/test-build/components/windows/windows.test.js` → exit 0, 12/12 pass (13/13 after the F2 fix). Browser check on `yarn build && yarn start` (port 3987): s34s0ns → dr34m 0f w1nt3r requests `/_next/image?url=https%3A%2F%2Fk4xw43ajr4eh6re3…winter-ps.png&w=2048&q=90`; Full Res swaps it to the raw Blob PNG and the menu reads Optimized. The local optimizer answered 500 for winter-ps.png after 7s (Next's upstream fetch timeout; the 4.7MB original alone takes 5.9s by curl here), while Path Ten (`singlepath/WJQ7…png`) through the same endpoint answers 200 `image/avif`, 78,638 bytes in 0.03s. Whether Vercel's optimizer serves the large PNGs shows only on a preview deploy.
- 2 Video work plays a smaller re-encoded copy; Full Res plays the original: pass — `curl -sI` on each `src`/`display` pair → all 9 `display` URLs 200 and smaller (e.g. CEASEFIRE 46,819,335 → 20,873,471; Exaltation of Isaac 93,653,093 → 47,399,946). Browser check: CEASEFIRE's `<video>` plays `ceasefire/display/CI_vF…mp4` (readyState 4); Full Res swaps it to `ceasefire/CI_vF…mp4` and the menu reads Optimized. 6 of 15 video works have no `display` (plan Decisions) and play their originals.
- 3 Icons through `next/image`; `e1/e2/e4.png` gone: pass — `grep -rnE '<img [^>]*(ICONS|small-logo)' components pages; ls public/e1.png public/e2.png public/e4.png` → grep exit 1 with no output; ls reports all three missing.
- Full check: pass — `yarn test` → exit 0 (all 5 suites pass); `yarn build` → exit 0, before and after the fix. Lint: none in this repo.

## Asks

none

## Tracked follow-ups

- T1. [Full Res on videos without display] Six video works with no `display` (Ararat, Babylon, Gomorrah, Hebron, some days, Tune Out CH6) still show Full Res; choosing it reloads the same original and flips the label to Optimized. Either hide the item for them (`kind === "image" || item.display`, and update the "some days" menu test) or give them display copies (bitrate-capped re-encode, or upload CH6's copy). From F1.
  Answer: 2026-11-11 "hide the full res button when a higher res version doesn't exist" → in

## Worth checking by hand

Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-987-media-optimization · dev server: http://localhost:3987 (production build of 21e23d6)
- On a Vercel preview deploy, open a 20–40MB image work (e.g. A Single Path → Path Sixteen, or a SEASONS piece) → it loads from `/_next/image` as AVIF or WebP; locally the optimizer times out on large PNGs, so only the preview shows this.

## Findings

- F1. [tracked T1] components/MediaWindow.tsx:110 Full Res shows on the six videos with no `display` and switches nothing: the same original remounts and the label reads Optimized. Found by: general. Verifier: track — real, but plan step 2 and the spec's "each … video work" call for the item on every video, plan Decisions record these play their originals, and no done-when breaks; hiding it or adding copies is the user's call.
- F2. [fixed 21e23d6] components/Window.tsx:121 title-bar icon requested at 20px while shown at 16px (`w-4 h-4`), against done-when 3's "at their display size" and plan step 3. Found by: general. Verifier: admit — simplify commit 09b7b72 changed 16 to 20 with no Decisions entry; the srcset went from w=16/32 to w=32/48.

## Bug notes

none

## Follow-ups

none
