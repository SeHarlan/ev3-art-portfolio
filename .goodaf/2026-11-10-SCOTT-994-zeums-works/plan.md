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
- 2026-11-10 step 1: vercel link + env pull (`.vercel/`, `.env.local` both ignored); `yarn install --frozen-lockfile` exit 0
- 2026-11-10 step 2: gathered all sources into the scratchpad: 50 media (CEASEFIRE 1 vid, s34s0ns 4 img, Isaac 1 vid, A Single Path 14 img, T3RRA 18 img + 5 vid, Flower 1 vid, Tune Out 6 vid), 22 HTML (Progress, 12 Solana, 9 Tezos folders with p5) and every preview; 153 files checked complete (PNG IEND, JPEG EOI, MP4 decoded to the last second). Solana mint order from oldest `blockTime` of the 12 mints read off mallow; Tezos order from TzKT `firstTime` (0–6, 9, 10)
- 2026-11-10 step 3: cost guard: 50 files, 1,158,987,199 bytes (largest Isaac at 93.7 MB, none over Blob's 512 MB cache limit); team is on Pro, where Blob storage is usage-based from the monthly credit ($0.023/GB-month, ≈ $0.03/month for these). Rename refused: `PATCH /v1/storage/stores/store_K4XW43AjR4eh6RE3` → 404, and `vercel api list` shows only GET for stores, so it's parked. Uploaded all 50 with `vercel blob put --pathname zeums/<slug>/<file>` (no overwrite, no random suffix); store read now: 60 files, 1,190,803,291 bytes = the 10 existing + 50 new, host `k4xw43ajr4eh6re3` as planned. Range request on every Blob URL in `data/zeums.ts`: 50/50 → 206 (36 image/*, 14 video/*)
- 2026-11-10 step 4: 72 selector thumbnails in `public/images/thumbs/<slug>-<title>.jpg` (longest side 96, `sips -Z 96`, from each item's own preview); 9 icons `public/images/<slug>-icon.png` at 56×56
- 2026-11-10 step 5: vendored `public/pieces/progress` (arweave original, p5 src → `./p5.min.js` = cdnjs p5 1.7.0 min) and `public/pieces/remember` (engine from "Nineteen and tripping", `rememberTitle` = empty template string, p5 1.11.9 from Tezos token 0's folder). 21-file engine diff (rememberTitle literal, p5 script tags and the Tezos `<!-- p5 -->` comment stripped, whitespace-free): 20 equal, "Stuck at an Italian winery" differs only by a missing `;` after `initPreview = false`. `grep -noE 'https?://' public/pieces/*/index.html` prints nothing (exit 1); check 4 command part passes
- 2026-11-10 step 6: `data/zeums.ts` holds 9 windows, 72 items, in zeums gallery order (remember.exe: 12 Solana then 9 Tezos, by mint time), with trimmed baked seeds. Check 3: 50 / 50 / 0 pass; store name still `ev3-obh-pieces` (rename parked). Check 9: `node /private/tmp/claude-501/-Users-scottharlan-Scottys-art-ev3-art-portfolio-95/337af282-bb45-4ed2-a567-5f212b67b9d6/scratchpad/check-seeds.mjs` (run from the worktree; reads `src/manifest.json` and `src/dl/remember/` beside it; a durable copy with the 21 originals is at `/Users/scottharlan/Library/Application Support/Claude/side-session-notes/local_181eaa98-878d-4bec-8b93-8fe639621c5e/SCOTT-994-check9/check-seeds.mjs`, same result) → `21/21 match` (exit 0) and `ls public/pieces` → `progress remember`. Full check: `npx tsc --noEmit` exit 0, `yarn test` exit 0 (1 pass), `yarn build` exit 0. checks 3 (commands), 4 (command part) and 9 pass
- 2026-11-10 slice 1 done
- 2026-11-10 step 7: `components/MediaWindow.tsx` (selector/work/about, Refresh by key, video pause on view/item/minimize, iframe focus on load and activation); `useDragResize` exposes `isResizing` and `Window` sets `pointer-events-none` on content while dragging or resizing; `npx tsc --noEmit` exit 0. Checks 2 and 5 are browser checks on a registered window, run after step 8
- 2026-11-10 step 8: 9 `WINDOWS` keys after SK3TCH with `ICONS`; `filterOutFromMenu` and its two call sites removed, so "some days" is on the desktop and in Start; `pages/index.tsx` renders a MediaWindow per `ZEUMS` key (REMEMBER included as the slice-3 placeholder). Browser (1280×800, then 375×812 in Playwright): all 10 icons open a window titled with the zeums title. Checks 2 (counts 21/4/14/23/6, every thumb loads, singles open on their work with no Choose, T3RRA image and video and an A Single Path image render, Choose returns to the selector), 5 (Tune Out and T3RRA video paused after minimize, Choose and About), 8 (About 1–3 sentences in all 9, Go back to the work or the selector) pass; check 1 passes with step 9; `npx tsc --noEmit` exit 0
- 2026-11-10 step 7 fix: browser check at 1280×600 found the body scrolled 164px after opening windows (body scrolls programmatically despite `overflow: hidden`); iframe focus now passes `preventScroll`. Rechecked in Playwright: `document.body.scrollTop` stays 0 after opening T3RRA, Tune Out, CEASEFIRE and "Progress", the "Progress" iframe takes focus on open, and dragging its title bar sets the content to `pointer-events: none` until mouseup
- 2026-11-10 step 9: icon column container `w-fit content-start` with fixed `w-24` cells; Start item list `max-h-[calc(100svh-3.5rem)] overflow-y-auto`. Check 1: 21 icons in 3 columns, no overlap or overflow at 1280×800 and 375×812. Check 7: Start lists 21 incl. "some days"; at 1280×600 the 458px list fits with no scroll needed, at 1280×400 it caps at 344px, scrolls to the last entry and its top entry sits at y=20. Full check: `npx tsc --noEmit` exit 0, `yarn test` exit 0 (1 pass), `yarn build` exit 0. checks 1, 2, 5, 7, 8 pass
- 2026-11-10 slice 2 done
- 2026-11-10 Blob move (user's request): copied the 50 `zeums/<slug>/…` blobs to `<slug>/…` with `vercel blob copy` (50/50 returned URLs equal the old ones minus `zeums/`), pointed `data/zeums.ts` at them (range request 50/50 → 206; Content-Length equal old vs new for all 50), then deleted the 50 `zeums/` paths. `vercel blob list`: 10 `obh/` + ceasefire 1, flower 1, isaac 1, seasons 4, singlepath 14, terra 23, tuneout 6; no `zeums/`. Check 3: 50 / 50 / 0 and `"name": "ev3-portfolio"`, now passing in full. Full check: `npx tsc --noEmit` exit 0, `yarn test` exit 0, `yarn build` exit 0
- 2026-11-10 step 10: `SeedDropdown` takes `multiline` (8-row `<textarea>`, same `w-[20rem]`; Enter uses, Shift+Enter adds a line; spaces no longer blocked in this mode only) and `initialSeed` (fills the field on each open); the 5 existing callers pass neither. `npx tsc --noEmit` exit 0. Check 6 is a browser check on the Remember window, run after step 11
- 2026-11-10 step 11: `components/windows/Remember.tsx` (selector of 21 → engine iframe at `rememberSrc(seed)`, menu Refresh / Seed (multiline, `initialSeed` = current seed) / About / Choose remember.exe; same focus and drag rules as MediaWindow); `pages/index.tsx` renders it for REMEMBER and MediaWindow for the other 8. Browser (Playwright, 1280×800) found two bugs, fixed: a space keyup inside the text area clicked the Seed menu button around it and closed the dropdown (`SeedDropdown` now prevents the space keyup default), and using a seed equal to the current one didn't reload, so the iframe never took focus (Use now always reloads). Check 6: Grandma Dale's Seed opens pre-filled `Grandma Dale` (8 rows, focused) and its `$fx.hash` equals `processHash` of it; Walking around the harbor's Seed shows the full memory; cleared and typed by hand, Enter loads `?hash=<memory>` with `$fx.hash` = `processHash(memory)` and the iframe focused; its `?preview=true` render matches the selector thumbnail; `hello world` gives hash `helloworldhelloworld`, a different render; Shift+Enter gave `"hello\nworld"` with the dropdown open, Enter submits. Check 4 (remember part): in Nineteen and tripping (Solana) and Her eyes (Tezos), c, f, g, r, left/right and up/down each change their engine state, `s` downloads a PNG, and no request leaves localhost except the host page's own Google Fonts and Vercel analytics. Check 2 (remember): 21 items, 21 thumbs loaded, Choose returns. Check 9: `21/21 match` (exit 0), `ls public/pieces` → `progress remember`. `npx tsc --noEmit` exit 0, `yarn test` exit 0; checks 2, 4, 6, 9 pass
- 2026-11-10 simplify: 2 edits (shared `hooks/usePieceFocus.tsx` for MediaWindow and Remember; one `fieldProps` object for SeedDropdown's two fields). Skipped: folding Remember into MediaWindow (Decisions keep it separate), rendering menu components beside rather than inside the menu `<button>` in `Window.tsx` (changes every existing seed window), deriving the `WINDOWS`/`ICONS` entries from `ZEUMS` (departs from the file's pattern), pausing p5 loops in hidden iframes (Decisions keep pieces mounted). Rerun: `npx tsc --noEmit` exit 0, `yarn test` exit 0 (1 pass), `yarn build` exit 0; check 3: 50 / 50 / 0 and `"name": "ev3-portfolio"`; check 4 grep prints nothing (exit 1); check 9 `21/21 match` (exit 0), `ls public/pieces` → `progress remember`; browser: "Progress" iframe focused on open, Tune Out video paused after About, Her eyes hash matches its seed with the iframe focused, Seed pre-filled, a typed two-line seed (Shift+Enter) loads with its hash. All checks pass
- 2026-11-10 check 8 on `Remember.tsx`: About opens; Go back returns to the selector before any piece is opened, and to the work after opening Grandma Dale (iframe visible, hash unchanged, focused)
- 2026-11-10 slice 3 done
- 2026-11-10 follow-up 1: merged main (SCOTT-989) into the branch with no conflicts, as B1 requires; `npx tsc --noEmit` exit 0, `yarn test` exit 0 (14 pass)
- 2026-11-10 follow-up 1 B1: 12 icons regenerated by `icons.mjs` (ffmpeg; durable copy in the side-session notes folder `local_a26f5357-72d9-41ee-93f6-85a5b8e10ca4/SCOTT-994-icons/`): CEASEFIRE 35×56, Isaac 56×32, "Progress" 56×37, Flower 41×56; fan-outs 56×56 RGBA for remember.exe, s34s0ns, A Single Path, T3RRA, Tune Out, 3xGP, R3MIX and on being human (`ICONS[WINDOWS.OBH]` → `/images/obh-icon.png`). Repro test `components/icons.test.tsx` (added to `yarn test`), seen red before the fix: "CEASEFIRE icon is 56×56, its source 60×96" and "remember.exe icon has 0% transparent pixels"; green after. It checks each fan-out is a PNG with clear space around its cards, not the fan's look; a 4× contact sheet on the desktop color (`sheet.mjs` in the scratchpad) showed each fan's cards at their true aspects in selector order and the singles uncropped. SCOTT-989's B3 test in `components/windows/obh.test.tsx` now asserts the PNG. Check 1 (headless Chromium, `check1.cjs` in the same notes folder): 21 icons, 0 overlaps, 0 off-screen, 0 broken images, and the 12 changed icons plus "some days" each open their window at 1280×800 and 375×812; the only image console message is the existing LCP note on `small-logo.png`. `npx tsc --noEmit` exit 0, `yarn test` exit 0 (16 pass); checks 1 pass
- 2026-11-10 follow-up 2 B2: `Window`'s content wrapper is `relative`, so absolutely placed content (a MediaWindow or remember.exe work, the selector, every About) fills the box inside the inset's padding instead of covering the bevel. WorkSelector and OBH's About drop the `classic-inset` they drew to make up for it (it now doubled the bevel); SCOTT-989's B6 and F3 tests in `obh.test.tsx` retargeted to match. Repro test `components/windows/windows.test.tsx` "B2" (new, added to `yarn test` with a test-only `@/` alias, `components/testAlias.ts`), seen red before the fix: "wrapper classes: overflow-auto h-full pointer-events-none bg-windowsPaper"; green after. Browser (headless, 1280×900, 4× crops of the content box's top-left corner): CEASEFIRE's video covered the bevel before and shows it after; the Tune Out and on being human selectors show one bevel, not two. `yarn test` exit 0 apart from the B3–B6 repros still red; checks none rerun yet
- 2026-11-10 follow-up 2 B4: the selector menu item reads "Select Piece" in MediaWindow (5 galleries), remember.exe, R3MIX, 3xGP (was "Choose Prelude") and on being human; no "Choose" text is left in `components/`, `data/` or `pages/`. Repro test `windows.test.tsx` "B4", seen red before: "Tune Out (gallery): Refresh, About, Choose Tune Out"; green after. Other tests pass; B3, B5, B6 repros still red

## Decisions

- Normal: remember.exe gets its own window file and doesn't reuse MediaWindow, since it alone has seeds and a Seed menu; MediaWindow stays free of seed options. Reverse: fold `seed` support into MediaWindow.
- Normal: the vendored remember engine has an empty `rememberTitle`, so an empty seed gives the engine's own random fallback. Reverse: bake in a default seed.
- Normal: HTML pieces stay mounted behind the selector and About, as R3MIX sketches do; videos also stay mounted but are paused. Reverse: render the work only while `view === "work"`.
- Normal: data in one `data/zeums.ts` module rather than per-window files, since all 9 share a shape. Reverse: inline each window's data in its own component file.
- Normal: a remember item's `seed` is the evaluated `rememberTitle` string, trimmed. The engine's `processHash` strips all whitespace before hashing, so trimming can't change the hash; check 9 proves this for all 21. Reverse: store the untrimmed string.
- Normal: the new deep-link keys (`?window=<key>`) are CEASEFIRE, REMEMBER, SEASONS, ISAAC, PROGRESS, SINGLEPATH, TERRA, FLOWER and TUNEOUT. Reverse: rename the `WINDOWS` keys; nothing links to them yet.
- Normal (user's call, 2026-11-10): Blob paths are `<slug>/<original filename>`, each collection a top-level folder beside `obh/`; the first upload's `zeums/` parent was dropped. Reverse: `vercel blob copy` under another prefix, update `data/zeums.ts`, then delete the old paths.
- Normal: new `WINDOWS` entries sit after SK3TCH, newest first, so the existing desktop order doesn't move. Reverse: reorder the object.
- Elevated (taste): icons. Singles (Isaac, "Progress", Flower) use their own preview image cropped square; CEASEFIRE uses its video frame at 0.5 s cropped on the figure, since its preview image is nearly black at 56px; galleries (remember.exe, s34s0ns, A Single Path, T3RRA, Tune Out) use a 2×2 collage of their first four items. Reverse: regenerate `public/images/<slug>-icon.png` from another source (scratchpad `scripts/icons.py`).
- Normal: the s34s0ns image folder is `uploaded-image/`, confirmed by a range request returning `206 image/png` rather than in the browser pane. Reverse: none needed.
- Normal: Exaltation of Isaac's video was fetched from `turbo-gateway.com`, since arweave.net returns 404 for that transaction; same transaction ID, 93.7 MB, decodes fully. Reverse: none needed.
- Elevated: storage cost guard. The plan's test ("past the plan's included Blob storage") has no literal answer on Pro: Blob storage is usage-based from the monthly credit, with no fixed included size. I uploaded because the spec approved these uploads and they add about 1.16 GB, roughly $0.03/month at $0.023/GB-month. Note for later: several T3RRA and A Single Path PNGs are 20–40 MB each at full size, which drives Blob data transfer per view. Reverse: `vercel blob del` the 50 `zeums/` paths (listed in `data/zeums.ts`).
- Normal: About texts are condensed from each zeums description, 1–3 sentences; remember.exe's names its keys and the Seed menu; Isaac's corrects zeums' "Primivera" to "Primavera Digitale". Reverse: edit `about` in `data/zeums.ts`.
- Normal: window sizes are 960×600 for the video singles and Tune Out, 800×800 for remember.exe, A Single Path and T3RRA, 800×700 for s34s0ns and 700×700 for "Progress"; positions are staggered by 25/15 px. Reverse: edit `size`/`position` in `data/zeums.ts`.
- Normal: `data/zeums.ts` exports `REMEMBER_ENGINE` and `rememberSrc(seed)`, which omits `?hash=` for an empty seed. Every remember item's `src` is `REMEMBER_ENGINE`, so slice 3 builds the URL from it. Item ids are slugs of titles; thumbnails are `/images/thumbs/<slug>-<title slug>.jpg`. Reverse: inline the builder in `Remember.tsx`.
- Normal: Isaac's Blob filename gets `.mp4` (its zeums URL has no `ext`). Reverse: re-upload under another name.
- Normal: until slice 3, remember.exe opens through MediaWindow (`pages/index.tsx` maps every `ZEUMS` key), so its icon works now; its items load the engine with no `?hash=`, a random seed. Slice 3 swaps in `Remember.tsx`. Reverse: skip REMEMBER in the map.
- Normal: the drag/resize guard lives in the shared `Window` (`pointer-events-none` on content while `isDragging` or the new `isResizing`), so every window gets it, not only MediaWindow. Reverse: pass the flag to MediaWindow only.
- Normal: MediaWindow pauses its one `<video>` via a ref; Refresh remounts the item by key (`<id>-<count>`), which restarts a video and reloads an iframe. Reverse: key on id only.
- Normal: video `poster` is the item's 96px thumb, as planned; it shows upscaled and soft until play. Reverse: drop `poster` so browsers show the first frame from `preload="metadata"`.
- Normal: using a seed in remember.exe clears the selected item (a typed seed is no longer a listed piece, even if it matches one), so the selector reopens on the first item, and always reloads the engine. Reverse: keep `activeId` in `useSeed` and drop the `refreshCount` bump.
- Normal: `s` in the vendored engine saves `remember-.png`, since the engine names captures from its baked `initRememberTitle`, which is empty in the shared copy (the originals save `remember-<first 29 chars>.png`). Left as published: the spec allows rewriting only script URLs. Reverse: set `initRememberTitle` from the `?hash=` value in `public/pieces/remember/index.html`.
- Normal (follow-up 1): main was merged into the branch before noting the follow-up base, so the follow-up review covers only B1's work, not SCOTT-989's already-reviewed code. Reverse: none needed; main must reach this branch for B1.4 anyway.
- Elevated (taste, follow-up 1 B1): fan-out icons. Up to three selector thumbs in each window's own selector order (gallery order in `data/zeums.ts`, the `works` arrays in `R3MIX.tsx` and `STEV3.tsx`, obh A–C), each scaled to fit 34px at its true aspect with a 1px white border; drawn at 4× and scaled to a transparent 56×56: third card right at +14°, second left at −14°, first centered and upright on top. Singles fit in 56px at their source's aspect: Isaac, "Progress" and Flower from their full-size preview images, CEASEFIRE from its video frame at 0.5 s, uncropped, since its preview is nearly black at icon size. Reverse: edit and rerun `icons.mjs`, or `git checkout <base> -- public/images/*-icon.png`.
- Normal (follow-up 1 B1): B1 sets aside the hard rule against changing existing windows for 3xGP, R3MIX and on being human, for their icons only. `public/svg/obh-icon.svg` stays in the repo, unused, since it's SCOTT-989's file and B1 didn't ask to delete it. Reverse: point `ICONS[WINDOWS.OBH]` back at the svg.
- Normal (follow-up 1 B1): SCOTT-989's B3 test pinned OBH's icon to the svg; B1 replaces that requirement, so the test now asserts `/images/obh-icon.png` and keeps its file-exists check. Reverse: revert that test with the `ICONS` line.

- Elevated (scope, follow-up 2): B2, B4 and B5 change existing windows too (the shared `Window` and every window's menu), setting aside the hard rule against changing existing windows, since the notes say "any of these content windows", "all selector components" and a menu order for every window. Reverse: revert those commits.
- Normal (follow-up 2 B2): the bevel fix lives once in `Window` (a positioned content wrapper) rather than in each window that overlays content, and the two components that redrew the bevel themselves (WorkSelector, OBH's About) stop doing so. Reverse: drop `relative` from the wrapper and restore their `classic-inset`.
- Normal (follow-up 2 B2): SCOTT-989's B6 and F3 tests pinned `classic-inset` on OBH's About; they now assert the About fills the content box with 16px padding and no second bevel, and the bevel itself is pinned by `windows.test.tsx` "B2". Reverse: revert the tests with the About class.

## Parked asks

- None open. The Blob store rename was done by the user in the dashboard (2026-11-10); the store reads `"name": "ev3-portfolio"`.

## Follow-up 1

Base: 41b5475 (the merge of main, so this follow-up's review diff holds only its own work)
- B1: desktop icons redone. The 4 single-work icons keep their source's aspect with no square crop. The 5 zeums galleries, 3xGP, R3MIX and "on being human" get a fan-out of up to three of their selector thumbs, each at its true aspect. Every other icon stays as it is.

## Follow-up 2

Base: 0f7c151
- B2: every content window shows its sunken inset bevel; absolutely placed content (a work, the selector, About) sits inside it instead of covering it.
- B3: one shared pulsing "loading..." component, shown over a work's image or video until the image has loaded or the video can play.
- B4: every selector's menu item reads "Select Piece" (galleries, remember.exe, R3MIX, STEV3, on being human).
- B5: every window's menu follows Select Piece, Seed, Refresh, About, Purchase, skipping items it lacks.
- B6: "some days" shows its zeums video (served from Blob) instead of the interactive sketch.
