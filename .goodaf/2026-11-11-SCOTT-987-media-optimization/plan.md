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

## Decisions

- Normal: image `sizes`: `"100vw"`, since windows can be maximized and quality comes first; AVIF/WebP at q90 still cuts 20–40MB PNGs by a wide margin. Reverse: pass a narrower `sizes` from the window's size.
- Normal: Full Res is per window, resets when another item opens, and is not persisted. Reverse: lift the state into the windows context.
- Normal: `display` is optional and video-only; images need no second URL because `next/image` derives the optimized copy from `src`. Reverse: add `display` for images if write-time copies replace runtime optimization.
- Elevated: the spec's "banner" has no live call site: the only `big-banner.png` `<img>` is commented out (`pages/index.tsx:101-103`), and `big-banner-bg.png` is used only as an absolute OG/meta URL (`pages/index.tsx:40,43`), which stays raw. Options: convert the commented code, or leave it. Chose to leave both, since neither is rendered as an `<img>`. Reverse: convert the block if it's un-commented.
- Elevated: Vercel's docs give 8192px max source dimensions and 10MB max output, but no source file-size limit; whether the optimizer handles a 40MB PNG shows only on a preview deploy (the user's check). Options: runtime `next/image` (chosen with the user), or write-time display copies. If the preview shows `/_next/image` failing for the large PNGs, the fallback is write-time copies (`vercel blob put-image`, credentials again). Reverse: set `unoptimized` on the failing items.
- Normal: image and video rendering moved into an exported `WorkMedia` component in `MediaWindow.tsx`, so the static test render can drive Full Res without a DOM. Reverse: inline it back into `renderItem` and drop the WorkMedia tests.
- Normal: choosing Full Res/Optimized from Select Piece or About also switches the window back to the work, so the swap is visible. Reverse: drop `setView("work")` from the menu item.

## Parked asks

