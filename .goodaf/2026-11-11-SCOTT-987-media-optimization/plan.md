# Plan: SCOTT-987 Serve portfolio images from Vercel Blob with image optimization

Tier: Standard · visual (changes how every image and video work displays)
Branch: goodaf/SCOTT-987-media-optimization · Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-987-media-optimization
Tags: visual: `MediaWindow.tsx` rendering, icon call sites, re-encoded videos

## Approach

Every full-size work is already a Blob URL in `data/zeums.ts` (plus `components/windows/SomeDays.tsx`); `src` stays the original and is what Full Res shows. Images render through `next/image` (`fill`, `object-contain`, `quality={90}`) with the Blob host allowed in `next.config.js`; Full Res renders the same `src` as a plain `<img>`. Videos gain a `display` URL for a re-encoded copy uploaded beside the original; the default view plays `display ?? src`, Full Res plays `src`. Icons at `Footer.tsx:68`, `Window.tsx:120` and `StartMenu.tsx:20` switch from `<img>` to `next/image` like `Icons.tsx` already does. Measured: the Blob images are 4000–4096px PNGs (20–40MB, a few 0.4–4.6MB); the videos are H.264 with moov at the front already, 4096² @ ~30Mbps (11s), 3840×2160 @ 25Mbps, 2400×3840 @ 19Mbps, 1920×1080 @ ~4.5Mbps, 1024×1406, 562×842.

## Files

- `next.config.js`: `images` with `remotePatterns: [new URL('https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/**')]`, `formats: ['image/avif', 'image/webp']`, `qualities: [75, 90]`.
- `data/zeums.ts`: `ZeumsItem.display?: string` (video only: re-encoded copy); fill it for each video that got one.
- `components/windows/SomeDays.tsx`: `display` for its video.
- `components/MediaWindow.tsx`: `next/image` for images, `display` for videos, Full Res menu item and state.
- `components/Footer.tsx`, `components/Window.tsx`, `components/StartMenu.tsx`: icons through `next/image` with `width`/`height` at display size.
- `components/windows/windows.test.tsx`: update F7's image lookup (it matches `src="${work.src}"`, which becomes a `/_next/image?url=…` src); add tests below.
- `public/e1.png`, `public/e2.png`, `public/e4.png`: delete (`git rm`).

## Steps

1. Config and images: add the `images` block; in `MediaWindow` render image works with `next/image` (`fill`, `sizes="100vw"`, `quality={90}`), keeping `key`, the ready `ref` check, `onLoad`/`onError` and the opacity/pointer-events classes. Under the node test render, if `next/image` throws for the remote host or the missing config, give the test build the same image config (e.g. `process.env.__NEXT_IMAGE_OPTS`) rather than changing production code for tests. Files: `next.config.js`, `components/MediaWindow.tsx`, `components/windows/windows.test.tsx`. Checks: 1
2. Full Res: a menu item after Refresh, before About, only when the open item is an image or video. Label "Full Res" while showing the optimized copy, "Optimized" while showing the original. Include the mode in the mount key (`itemKey`) so the swap remounts and Loading shows until ready. Opening another item resets to optimized. Full Res image is a plain `<img src={item.src}>`; Full Res video uses `src={item.src}`. Files: `components/MediaWindow.tsx`, `components/windows/windows.test.tsx`. Checks: 1, 2
3. Icons and dead files: `next/image` at `Footer.tsx:68` (20px), `Window.tsx:120` (16px, keep the invert filter), `StartMenu.tsx:20` (20px); `git rm public/e1.png public/e2.png public/e4.png`. Files: those three components, `public/`. Checks: 3
4. Re-encode videos with `/opt/homebrew/bin/ffmpeg` from each Blob original into `$(git rev-parse --git-dir)/goodaf-video/` (never committed): `-c:v libx264 -preset slow -crf 18 -profile:v high -pix_fmt yuv420p -movflags +faststart -c:a copy`, scaling only when the longest side exceeds 2160 (longest side to 2160, even dimensions, aspect kept). Keep a copy only when it's smaller than its original; a video with no smaller copy gets no `display` and plays its original (log each as Elevated). Checks: 2
5. Upload (Blocking: the user's credentials): put each kept copy at `<original's folder>/display/<original's filename>` in the same Blob store, with `vercel blob put --access public` under the user's existing Vercel CLI login, as the user chose (2026-11-11): first show them the list of files and target pathnames in chat and wait for their yes, then upload. Then set `display` on each video item. Never delete or overwrite an original. Files: `data/zeums.ts`, `components/windows/SomeDays.tsx`. Checks: 2

## Acceptance checks

| # | Done-when (the ticket's line, in a few words) | Command | Expected result | Verified by |
|---|---|---|---|---|
| 1 | Image work loads optimized AVIF/WebP via `/_next/image`; Full Res shows the original PNG | `rm -rf node_modules/.cache/test-build && npx tsc -p tsconfig.test.json && node node_modules/.cache/test-build/components/windows/windows.test.js`; then a browser check on `yarn build && yarn start`: open s34s0ns, open a work, watch the network panel, then Menu → Full Res | Tests pass; the work's request is `/_next/image?url=https%3A%2F%2Fk4xw43ajr4eh6re3…&w=…&q=90` answering `image/avif` (or webp), and after Full Res the request is the Blob `.png` itself | new test in `windows.test.tsx`: an image work's `<img>` src starts `/_next/image?url=` with the Blob URL encoded and `q=90`, and with Full Res the src is the raw Blob URL / browser check |
| 2 | Video work plays a re-encoded copy smaller than its original; Full Res plays the original | `for each video item with display: curl -sI` both URLs and compare `content-length`; then a browser check: open CEASEFIRE, check the `<video>` src, then Menu → Full Res | Every `display` is a 200 and smaller than its `src`; the video plays the `display` URL, then the original after Full Res | new test in `windows.test.tsx`: a video item with `display` renders that URL as `<video src>`, and Full Res renders `src` / the curl comparison / browser check |
| 3 | Taskbar, title, start-menu icons via `next/image`; `e1/e2/e4.png` gone | `grep -rnE '<img [^>]*(ICONS|small-logo)' components pages; ls public/e1.png public/e2.png public/e4.png` | grep prints nothing; ls reports all three missing | the command itself |

## Hard rules

- Full check: `yarn test` and `yarn build`; lint: none in this repo: `next lint` stops to ask for ESLint setup.
- Dependencies: `yarn.lock`, identical to main's. The user approved `yarn install --frozen-lockfile` in this worktree (2026-11-11), while `yarn.lock` matches main's; any other install still needs their yes.
- Leave video loading behavior from SCOTT-994 as is: `preload="auto"`, `onCanPlayThrough`, `onSuspend`, `onPlaying`, Play button and readiness classes. The only change there is the mount key gaining the Full Res mode.
- Originals in Blob are never deleted, moved or overwritten.
- Thumbnails (`/images/thumbs/…`, `WorkSelector.tsx:91`, video `poster`) stay as they are.

## Progress

- 2026-11-11 plan written
- 2026-11-11 step 1: Blob host in next.config images; image works render through next/image (fill, q90); test render gets the app image config via ImageConfigContext; checks 1 (tests) pass
- 2026-11-11 step 2: Full Res menu item (after Refresh, image/video only, label flips to Optimized), mode in the mount key, reset on opening another item; `display` field on ZeumsItem; tests for Full Res image/video src and menu placement; checks 1, 2 (tests) pass
- 2026-11-11 step 3: taskbar (20px), title-bar (16px, invert kept) and start-menu (20px) icons through next/image; public/e1.png, e2.png, e4.png removed; checks 3 pass (grep prints nothing, ls reports all three missing); yarn test and yarn build pass
- 2026-11-11 browser check 1 on `yarn build && yarn start` (port 3987): A Single Path → Path Ten loads `/_next/image?url=…WJQ7…png&w=2048&q=90` (curl with Accept avif: 200 `image/avif`, 2048×2048, 78KB); Full Res swaps to the raw Blob PNG (4000px) and the menu label reads Optimized. `seasons/spring-ps.png` gave 500 from the local optimizer: Next's 7s upstream fetch timed out on this machine's slow link (3.1MB took 15s by curl); Vercel's optimizer is the real check
- 2026-11-11 step 4: 15 videos re-encoded (CRF 18, longest side ≤2160); 10 smaller copies kept, 5 larger ones dropped (Elevated below); copies in `<git-dir>/goodaf-video/display/`; check 2 pending the upload, step 5
- 2026-11-11 step 5: user approved 1a (link and upload, CH6 left out); worktree linked to `ev3-art-portfolio` (`.vercel/`, ignored), 9 copies uploaded with `vercel env run -- vercel blob put --access public --pathname <folder>/display/<file>` (no suffix, no overwrite), `display` set on those 9 in `data/zeums.ts` from the CLI's printed URLs; check 2 pass (each `display` 200 and smaller than its `src`, 9 items); browser check on `yarn build && yarn start`: CEASEFIRE's `<video>` src is the display URL, Full Res swaps it to the original and the label reads Optimized; `yarn test` and `yarn build` pass
- 2026-11-11 simplify: 7 edits (shared image props in WorkMedia; cached-image ref only on the plain `<img>`, since next/image handles it; `renderItem` inlined; remotePattern as a plain object so the test spreads the config as is; test helpers `singleWork`/`srcOf` reused and the q90 test merged into the Full Res one; title-bar icon requested at 20px like the taskbar's; spacing). Skipped: `useCallback` for `markReady`, WebP-only formats, a shared test render helper, deriving `display` from `src`. All checks pass (tests, build, check 2 on 9 items, check 3)
- 2026-11-11 follow-up 1 T1: Full Res only on images and videos with a `display` copy; menu test now asserts some days (no `display`) has none; checks 1 (tests) pass; `yarn test` and `yarn build` pass

## Decisions

- Normal: image `sizes`: `"100vw"`, since windows can be maximized and quality comes first; AVIF/WebP at q90 still cuts 20–40MB PNGs by a wide margin. Reverse: pass a narrower `sizes` from the window's size.
- Normal: Full Res is per window, resets when another item opens, and is not persisted. Reverse: lift the state into the windows context.
- Normal: `display` is optional and video-only; images need no second URL because `next/image` derives the optimized copy from `src`. Reverse: add `display` for images if write-time copies replace runtime optimization.
- Elevated: the spec's "banner" has no live call site: the only `big-banner.png` `<img>` is commented out (`pages/index.tsx:101-103`), and `big-banner-bg.png` is used only as an absolute OG/meta URL (`pages/index.tsx:40,43`), which stays raw. Options: convert the commented code, or leave it. Chose to leave both, since neither is rendered as an `<img>`. Reverse: convert the block if it's un-commented.
- Elevated: Vercel's docs give 8192px max source dimensions and 10MB max output, but no source file-size limit; whether the optimizer handles a 40MB PNG shows only on a preview deploy (the user's check). Options: runtime `next/image` (chosen with the user), or write-time display copies. If the preview shows `/_next/image` failing for the large PNGs, the fallback is write-time copies (`vercel blob put-image`, credentials again). Reverse: set `unoptimized` on the failing items.
- Normal: image and video rendering moved into an exported `WorkMedia` component in `MediaWindow.tsx`, so the static test render can drive Full Res without a DOM. Reverse: inline it back into `renderItem` and drop the WorkMedia tests.
- Normal: choosing Full Res/Optimized from Select Piece or About also switches the window back to the work, so the swap is visible. Reverse: drop `setView("work")` from the menu item.
- Normal: the encode script downloaded originals to the session scratchpad, then the display copies moved to `<git-dir>/goodaf-video/display/` as the plan says; this session's worktree guard refuses commands that reach `.git` paths through a variable or script. Reverse: none needed.
- Elevated: four T3RRA videos, Ararat (`terra/31K8R…`), Babylon (`terra/Mo-adtl…`), Gomorrah (`terra/3SX-Iq…`) and Hebron (`terra/zPjSh…`), 4096² at ~30Mbps and 40–41MB each, came out 64–72MB at 2160² with CRF 18 (the GAN grain takes more bits than the originals were given). Choice: per step 4, no `display`; they play their originals. Reverse: re-encode with a bitrate cap (e.g. `-maxrate 15M -bufsize 30M`) or a higher CRF, upload, set `display`.
- Elevated: some days (`somedays/B6A1z…`, 562×842 at 11.9Mbps, 67.9MB) came out 68.3MB with CRF 18 at the same size. Choice: no `display`; it plays its original. Reverse: as above, with a cap near 6Mbps.
- Elevated: Done-when 2 ("plays a re-encoded copy smaller than its original") therefore holds for 10 of the 15 video works. Eden (41.3→16.9MB), CEASEFIRE (46.8→20.9MB) and Exaltation of Isaac (93.7→47.4MB) gain the most; A Flower Blooms (54.8→48.8MB) and Tune Out CH1–5 (6–17%) gain little, and CH6 only a few KB. Reverse: re-encode the other five with a cap, or drop the marginal copies.
- Elevated: Tune Out CH6's copy (28,594,285 vs 28,595,945 bytes) was not uploaded, at the user's answer 1a; CH6 plays its original, so Done-when 2 holds for 9 of 15. Reverse: upload `tuneout/display/CH6 - The Mystic.mp4` and set its `display`.
- Normal: the Blob token came through `vercel env run` (the project's env in the command's memory), since `vercel blob` doesn't read a linked project's `BLOB_READ_WRITE_TOKEN` itself; no env file written. Reverse: none needed.

## Parked asks


## Follow-up 1

Base: 53de6ee
- T1: Full Res shows only when a higher-res version exists: on every image, and on a video only when it has a `display` copy (the user: "hide the full res button when a higher res version doesn't exist"); update the menu test so "some days" (no `display`) has no Full Res.
