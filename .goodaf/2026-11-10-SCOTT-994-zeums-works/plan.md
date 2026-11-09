# Plan: SCOTT-994 Add missing zeums works as desktop windows

Tier: Feature (no risk modifier)
Branch: goodaf/SCOTT-994-zeums-works · Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-994-zeums-works
Tags: visual: all new windows, icons, desktop icon wrap, Start menu scroll, seed text area

## Approach

Media lives in Blob and the windows only reference URLs, so slice 1 gathers every source, uploads full-size images and videos, makes thumbnails and icons, vendors the HTML, and writes one typed data module. Slice 2 adds one shared `MediaWindow`, the R3MIX/3xGP selector → work → About pattern with `WorkSelector` (`components/windows/R3MIX.tsx`), rendering `<img>`, `<video>` or `<iframe>` per item. It drives the 8 non-seeded windows from the data module, and slice 2 also registers windows in `WINDOWS`/`ICONS` (`context/WindowsProvider.tsx`) and renders them in `pages/index.tsx`. Slice 3 builds remember.exe as its own window: the same selector plus an iframe of the single vendored engine at `?hash=<seed>`, with the existing `SeedDropdown` given a multi-line option. Full-size media uses plain `<img>`/`<video>`, so `next.config.js` needs no `remotePatterns`. Icons and thumbs are local files under `public/images/`.

## Files

- `data/zeums.ts` (new): per window: key, title, About text, size/position, items `{ id, title, kind: "image" | "video" | "html", src, thumb, seed? }`.
- `public/pieces/progress/index.html`, `public/pieces/progress/p5.min.js` (new): "Progress" as published, script src rewritten to the local p5 1.7.0.
- `public/pieces/remember/index.html`, `public/pieces/remember/p5.min.js` (new): the remember.exe engine (p5 1.11.9) with an empty baked seed.
- `public/images/thumbs/<slug>-*.jpg` (new): one selector thumbnail per gallery item.
- `public/images/<slug>-icon.png` (new, 9): desktop icons.
- `components/MediaWindow.tsx` (new): shared window for the 8 non-seeded entries.
- `components/windows/Remember.tsx` (new): remember.exe window.
- `components/SeedDropdown.tsx`: optional `multiline` and `initialSeed` props.
- `context/WindowsProvider.tsx`: 9 `WINDOWS` keys and `ICONS`; `filterOutFromMenu` no longer hides "some days".
- `components/Icons.tsx`: icon area wraps into extra columns without overflowing.
- `components/StartMenu.tsx`: item list scrolls when taller than the screen.
- `pages/index.tsx`: render the 9 new windows.

## Slices (Feature)

1. All assets in place: Blob store renamed and media uploaded, thumbs, icons, vendored HTML, `data/zeums.ts`. Steps 1–6. Ends green and committed.
2. The 8 non-seeded windows on the desktop and in the Start menu, "some days" unhidden, icon wrap, Start menu scroll. Steps 7–9. Ends green and committed.
3. remember.exe window with the seed text area. Steps 10–11. Ends green and committed.

## Steps

1. **Setup and credentials.** In the worktree: `vercel link --yes --project ev3-art-portfolio --scope team_Q7InePSJS7UvqsW4MfS3iwMQ`, then `vercel env pull .env.local` for `BLOB_READ_WRITE_TOKEN` (both `.vercel/` and `.env*.local` are gitignored; never print the token). The spec's approval covers using it for this task's uploads and the store rename. Files: none committed. Checks: —
2. **Gather sources** into a fresh scratchpad folder, never the repo. Run the scripts from a different folder, and run any Python with `-I`.
   - Single entries come from `https://www.zeums.art/api/public/user/ev3`, under `user.createdTimelineEntries[].media.mediaUrl/imageUrl`: CEASEFIRE, Exaltation of Isaac, A Flower Blooms in Autumn, and "Progress" (html).
   - Galleries come from `https://www.zeums.art/api/public/gallery/EV3/<title>`: s34s0ns, A Single Path, T3RRA and Tune Out. Skip rows with no `media.category`.
   - Zeums-hosted items (s34s0ns, Tune Out) live at `https://p1v6uvkvzbjkuo1l.public.blob.vercel-storage.com/66848cd1fc164fd53d57c0fb/uploaded-video/<cdnId>`, with the matching `uploaded-thumbnail/` folder. The image folder for s34s0ns isn't confirmed: read the `<img>` src on https://www.zeums.art/EV3/s34s0ns in the browser pane.
   - IPFS: use `https://ipfs.filebase.io/ipfs/<cid>`, since ipfs.io and dweb.link refuse. The remember.exe Solana CIDs are in the zeums remember.exe gallery JSON (12 html items). The Tezos ones come from `https://api.tzkt.io/v1/tokens?contract=KT1DzZG3RqHmVLaa17541QkD3q7M9Ejz8ktX`: tokens 0–6, 9 and 10. Skip 7 and 8, which were burned. Their `artifactUri` is a folder (`index.html` + `p5.min.js`), and `displayUri` is the preview image.
   - Mint order: Tezos from TzKT `firstTime`. Solana from the oldest signature's `blockTime` via `getSignaturesForAddress` on `https://api.mainnet-beta.solana.com` for each mint. The 12 mints are the `/artwork/<mint>` links on the mallow Solana collection page.

   Files: none. Checks: —
3. **Storage cost guard, then rename and upload.**
   - Sum the bytes of everything to upload. Read the team's plan and current Blob usage (Vercel MCP or `vercel api`). If store total plus uploads would go past the plan's included Blob storage, stop and ask before uploading (Blocking: spending money).
   - Rename: `vercel api /v1/storage/stores/store_K4XW43AjR4eh6RE3?teamId=team_Q7InePSJS7UvqsW4MfS3iwMQ --method PATCH` with body `{"name":"ev3-portfolio"}`. If the API refuses, record it in Parked asks for the user to rename in the dashboard and go on.
   - Upload every full-size image and video with `vercel blob put <file> --rw-token "$BLOB_READ_WRITE_TOKEN"` (check `vercel blob put --help` for the pathname flag) under `zeums/<slug>/<file>`. Keep the URL each call returns.
   - Never delete or overwrite the store's 10 existing files.

   Files: none. Checks: 3
4. **Thumbnails and icons.**
   - Thumbnails: longest side 96px, aspect kept, JPEG, matching the existing `public/images/thumbs/` files (`sips -Z 96`). Make them from each item's own preview image: the zeums `imageUrl`/`uploaded-thumbnail`, the Tezos `displayUri`, or the image itself.
   - Icons: one 56×56 PNG per window. Use a thumbnail for single works and a 2×2 collage or a representational image for galleries (Elevated taste call; log each).

   Files: `public/images/thumbs/`, `public/images/*-icon.png`. Checks: 1, 2
5. **Vendor HTML.**
   - "Progress": save the arweave file as `public/pieces/progress/index.html`. Change only its p5 `<script src>` to `./p5.min.js`, which is p5 1.7.0 minified from `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js`.
   - remember.exe: take one Solana file, set `rememberTitle` to an empty template string, and point its p5 `<script src>` at `./p5.min.js`, which is the 1.11.9 copy from a Tezos folder.
   - Before committing, re-run the 21-file engine diff (strip the `rememberTitle` literal and p5 script tags, compare whitespace-free) and record the result in Progress. Expected: all equal except one missing `;` in "Stuck at an Italian winery".
   - Grep both pieces for any remaining `http` URL.

   Files: `public/pieces/**`. Checks: 4
6. **Data module.**
   - `data/zeums.ts` holds each window's items in zeums gallery order. remember.exe is the exception: Solana pieces first, then Tezos, each in mint order.
   - Each item's `src` is its Blob URL or its `/pieces/...` path. Each remember item's `seed` is its baked `rememberTitle` text, trimmed. Titles use the zeums/mallow titles.
   - About text is 1–3 sentences condensed from the zeums description. CEASEFIRE names Celestial Body; 3xGP-style credit lines stay out.

   - Check 3 commands, for acceptance check 3 (no pipes inside the table):
     - `grep -o 'https://k4xw43ajr4eh6re3\.public\.blob\.vercel-storage\.com/[^"]*' data/zeums.ts | sort -u | wc -l`. The store's host is its ID, lowercased, without `store_`. Confirm it against the first upload's returned URL, and fix this command if it differs.
     - `grep -o 'vercel-storage\.com/[^"]*' data/zeums.ts | sort -u | wc -l`
     - `grep -c -e arweave -e ipfs -e zeums.art -e p1v6uvkvzbjkuo1l data/zeums.ts`
     - `vercel api "/v1/storage/stores/store_K4XW43AjR4eh6RE3?teamId=team_Q7InePSJS7UvqsW4MfS3iwMQ"`
   - Write `check-seeds.mjs` in the scratchpad for acceptance check 9.

   Files: `data/zeums.ts`. Checks: 3, 9
7. **MediaWindow.**
   - Props: one window's data. Galleries (more than one item) open on `WorkSelector`, and singles open on their work.
   - Views are `"selector" | "work" | "about"`. Menu: Refresh (remount the current work by key), About, and "Choose <title>" on galleries only.
   - Images: `<img>`, `object-contain`, centered on black.
   - Videos: `<video controls playsInline preload="metadata" poster={thumb}>`, with no autoplay. An effect pauses the video when the view leaves `"work"`, the item changes, or the window is minimized (`minimizedState`).
   - HTML: `<iframe>` filling the content box. Call `iframe.focus()` on load and when the window becomes active.
   - While a window drag or resize is in progress (`isDragging` / resizing in `useDragResize`), iframes get `pointer-events: none`, so mousemove isn't swallowed.

   Files: `components/MediaWindow.tsx`, possibly `components/Window.tsx` / `hooks/useDragResize.tsx` for the drag flag. Checks: 2, 5
8. **Register windows.**
   - Add `WINDOWS` keys CEASEFIRE, REMEMBER, SEASONS, ISAAC, PROGRESS, SINGLEPATH, TERRA, FLOWER and TUNEOUT. Their values are the zeums titles (`"remember.exe"`, `"s34s0ns"`, `'"Progress"'`, …). Insert them after SK3TCH, newest first; that ordering is Normal.
   - Add each key to the `WINDOWS` type and to `ICONS`.
   - Make `filterOutFromMenu` return true for every window, or remove it and its two call sites.
   - In `pages/index.tsx`, render the 8 MediaWindows from `data/zeums.ts`. REMEMBER is a placeholder until slice 3.

   Files: `context/WindowsProvider.tsx`, `pages/index.tsx`. Checks: 1, 7
9. **Desktop wrap and Start menu scroll.**
   - Icons: the column container keeps `h-[90svh]` and `flex-wrap` but drops the fixed `w-24`, so extra columns lay out side by side. Each icon cell gets a fixed width so long titles wrap inside it.
   - StartMenu item list: `max-h-[calc(100svh-<taskbar height>)] overflow-y-auto`.

   Files: `components/Icons.tsx`, `components/StartMenu.tsx`. Checks: 1, 7
10. **SeedDropdown options.**
    - `multiline?: boolean` renders a `<textarea>` about 8 rows high, at the same width class, instead of the input. Enter uses the seed and Shift+Enter inserts a newline.
    - `initialSeed?: string` fills the field each time the dropdown opens.
    - Existing callers pass neither, so they're unchanged.

    Files: `components/SeedDropdown.tsx`. Checks: 6
11. **Remember window.**
    - Selector of 21. Opening an item sets iframe `src` to `/pieces/remember/index.html?hash=${encodeURIComponent(seed)}`. An empty seed omits `?hash=`, and the engine falls back to a random seed.
    - Menu: Refresh, Seed (multiline, `initialSeed` = current seed), About, Choose remember.exe.
    - Using a seed switches to the work view with that seed.
    - Same focus and drag rules as MediaWindow.

    Files: `components/windows/Remember.tsx`, `pages/index.tsx`. Checks: 2, 4, 6

## Acceptance checks

| # | Done-when (the ticket's line, in a few words) | Command | Expected result | Verified by |
|---|---|---|---|---|
| 1 | 10 desktop icons open their windows | Browser check: dev URL at desktop width, then 375px. Double-click each of the 9 new icons and "some days" | Each opens its window titled with the zeums title, and no icons overflow or overlap | browser check |
| 2 | Galleries list every item with thumbs; Choose returns; singles open on their work | Browser check: open each of the 5 galleries and count items (remember.exe 21, s34s0ns 4, A Single Path 14, T3RRA 23, Tune Out 6). Open one item of each kind, then Choose <title>. Open CEASEFIRE, Exaltation, Flower and "Progress" | Counts match, every cell has a thumbnail, opened items render, Choose shows the selector, and singles show their work with no selector | browser check |
| 3 | Full-size media served from the `ev3-portfolio` Blob store; store renamed | The four commands listed in step 6 under "Check 3 commands" | The first prints 50 (4+14+23+6+3 media; thumbs are local). The second prints 50 (no other Blob host). The third prints 0. The store read shows `"name":"ev3-portfolio"`, or the rename is parked for the user | the commands themselves |
| 4 | HTML pieces load only from the site and respond to their controls | `grep -noE 'https?://' public/pieces/*/index.html` (HTML only: vendored p5 keeps its own URL strings untouched), plus a browser check: open "Progress" (click adds color, "n" restarts) and two remember pieces (one Solana, one Tezos), and press c, f, g, r, s, left/right and up/down while watching DevTools Network | The grep prints nothing. Every control changes the render, and `s` saves a PNG. Network shows no request to zeums, IPFS, arweave or any CDN | the command + browser check |
| 5 | A video stops when its window is minimized or its view is replaced | Browser check: play a Tune Out video, then minimize; play again, then Choose Tune Out; play again, then About; play CEASEFIRE and open another window over it | After minimize, Choose and About, `document.querySelectorAll('video')` all report `paused === true`. Covering with another window doesn't pause (not required) | browser check |
| 6 | Seed text area; a piece's seed reproduces it | Browser check: open "Grandma Dale", open Seed and see the multi-line area pre-filled with `Grandma Dale`. Open Walking around the harbor's Seed and see the full memory. Clear the field, type the full memory text by hand, and Use. Then enter `hello world` | The iframe's `$fx.hash` equals processHash(baked text), computed from the downloaded original, for the typed memory. The render matches the piece's selector thumbnail with "c" toggled. `hello world` gives a different render. Shift+Enter adds a line and Enter submits | browser check |
| 7 | Start menu lists 21 windows and scrolls | Browser check: at 1280×600 open Start | 21 entries including "some days"; the list scrolls and its top entry stays reachable | browser check |
| 8 | Each new window has a 1–3 sentence About with Go back | Browser check: in each of the 9 new windows, choose About, count its sentences, then click Go back | 1–3 sentences each. Go back returns to the work, or to the selector in a gallery with no work opened yet | browser check |
| 9 | All 21 remember items open the one engine with their own exact seed | `node <scratchpad>/check-seeds.mjs` (written in step 6). It reads the 21 `seed` strings from `data/zeums.ts` and each downloaded original's baked `rememberTitle`, applies the engine's `processHash` to both, and checks that the item src builder targets `/pieces/remember/index.html` | Prints `21/21 match`, and `ls public/pieces` shows only `progress` and `remember` | the command itself |

## Hard rules

- Full check: `npx tsc --noEmit`, `yarn test` and `yarn build`. Lint: none in this repo (`next lint` starts interactive setup).
- Dependencies: the repo uses yarn (`yarn.lock`), which is outside goodaf's no-ask install exception. Run `yarn install --frozen-lockfile` in this worktree only if Progress records the user's yes. No new packages: uploads go through the `vercel` CLI, not `@vercel/blob`.
- Downloaded sources stay in a fresh scratchpad folder. Only thumbs, icons and the vendored HTML/p5 files are committed. Full-size media is never committed.
- Never edit `components/p5/**`. Don't change existing windows other than the "some days" unhide.
- Never delete or overwrite existing Blob files, and never print `BLOB_READ_WRITE_TOKEN`.

## Progress

- 2026-11-10 plan written
- 2026-11-10 plan check: 6 must-fix fixed, 4 notes adopted, 0 dismissed
- 2026-11-10 user approved `yarn install --frozen-lockfile` in this worktree

## Decisions

- Normal: remember.exe gets its own window file and doesn't reuse MediaWindow, since it alone has seeds and a Seed menu; MediaWindow stays free of seed options. Reverse: fold `seed` support into MediaWindow.
- Normal: the vendored remember engine has an empty `rememberTitle`, so an empty seed gives the engine's own random fallback. Reverse: bake in a default seed.
- Normal: HTML pieces stay mounted behind the selector and About, as R3MIX sketches do; videos also stay mounted but are paused. Reverse: render the work only while `view === "work"`.
- Normal: data in one `data/zeums.ts` module rather than per-window files, since all 9 share a shape. Reverse: inline each window's data in its own component file.
- Normal: a remember item's `seed` is the evaluated `rememberTitle` string, trimmed. The engine's `processHash` strips all whitespace before hashing, so trimming can't change the hash; check 9 proves this for all 21. Reverse: store the untrimmed string.
- Normal: the new deep-link keys (`?window=<key>`) are CEASEFIRE, REMEMBER, SEASONS, ISAAC, PROGRESS, SINGLEPATH, TERRA, FLOWER and TUNEOUT. Reverse: rename the `WINDOWS` keys; nothing links to them yet.
- Normal: Blob paths are `zeums/<slug>/<original filename>`. Reverse: re-upload under another prefix and update `data/zeums.ts`.
- Normal: new `WINDOWS` entries sit after SK3TCH, newest first, so the existing desktop order doesn't move. Reverse: reorder the object.

## Parked asks
