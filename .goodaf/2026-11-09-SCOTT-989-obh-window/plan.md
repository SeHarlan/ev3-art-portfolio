# Plan: SCOTT-989 on being human window: live pieces with selector

Tier: Standard (visual)
Branch: goodaf/SCOTT-989-obh-window · Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-989-obh-window
Tags: visual: the whole diff (OBH window, vendored piece pages, thumbs)

## Approach

Each ETH piece's `animation_url` is a self-contained baked HTML page (~145KB: Epoch One engine, its UI and a `window.__NFT__` config). Vendor the five pages into `public/obh/`, change only the image URLs in them to Vercel Blob, and show them in a same-origin `<iframe>` inside the OBH window. The window copies `components/windows/STEV3.tsx` (3xGP): `WorkSelector` → piece view → About. The iframe isolates the engine's document-level key and wheel handlers and its one-instance-per-page limit. Don't build or import the engine from `Techtonic/archive/techtonic-engine-1` or npm `@ev3-art/epoch-one`: the baked bytes are the minted render, and the archive's engine is newer than them.

Source data (from `Techtonic/archive/techtonic-engine-1/docs/obh-eth-migration/`, `eth-metadata-urls.json` and `HANDOFF-2026-07-24.md:74-92`, checked against the live final JSONs). Contract: Manifold Creator ERC-721 `0x4759A45c80eB04571902df74200F0D8d6c83F070`, Ethereum mainnet.

| Piece | Title | Token | animation_url (Irys id) |
|---|---|---|---|
| A | there must be something | 1 | `FWg8XhT4wk7kAGPsq9dn8tRH38cr5hoJXAfiN5HqsRAc` |
| B | there is nothing else | 2 | `JB9Cyhv6AwX3r2N7dFyTV5j8qVrBfWL5h6UhtBDZSgRa` |
| C | was it all a dream | 3 | `5HKmNps9DvmQ8fwv6yDFYYnDqc6tLhaifwvEPjsiZUJb` |
| D | the abyss gazes back | 4 | `132TU6s3WZKHApuZTfxarh3ebR6xMfFruwnJozFAvYtw` |
| E | something was found | 5 | `5iQtkSy9iWesu7XVg7F6k7RDGoKiF9iFPgYySkqHVCem` |

URLs are `https://gateway.irys.xyz/<id>`. Each page references three Irys URLs: `thumbnailUrl` (≈3.7MB PNG, also the `<img id="fallback">` src), `imageInUrl` (≈3.3MB, served as `image/EpochOne-imagein`) and `jsonUri` (2KB engine-state JSON). C is landscape (1920x1080); the rest are portrait 1080x1920.

## Files

- `public/obh/{a,b,c,d,e}.html`: vendored baked pages; only the thumbnail and imagein URLs changed (the fallback `<img>` src and the two `__NFT__` fields).
- `public/images/thumbs/obh-{a,b,c,d,e}.jpg`: 96×96 selector thumbs, like the existing ones.
- `components/windows/OnBeingHuman.tsx`: rewritten. Selector, piece iframe, About; menu "Choose piece", "About", "Purchase".

## Steps

1. Fetch the five pages from Irys into `public/obh/` byte for byte, plus their thumbnail and imagein files into a scratch folder outside the repo. Make the 96×96 thumbs from the thumbnail PNGs with `sips` (center-crop to square, JPEG, a few KB like `public/images/thumbs/3xgp-1.jpg`). Files: `public/obh/*`, `public/images/thumbs/obh-*.jpg`. Checks: —
2. **Blocking ask first:** creating a public Vercel Blob store on the portfolio's Vercel project and uploading the 10 images uses the user's Vercel credentials. Ask, then wait for their yes. Find the project with the Vercel MCP (`list_projects`; there's no `.vercel/` link in this repo), create the store (`create_storage_stores_blob`), then upload as `obh/<letter>-thumb.png` and `obh/<letter>-imagein`. Keep each Irys content type. Use the Vercel CLI (`vercel blob put`) or the MCP, whichever works with the user's existing login, and never print the token. Confirm each Blob URL returns 200 with `access-control-allow-origin` for a cross-origin request (`curl -sI -H "Origin: http://localhost:3000" <url>`); the engine fetches the imagein cross-origin. Checks: 2
3. Rewrite the three image references in each vendored page to its Blob URLs, then diff it against the Irys original: only those URL strings may differ. `jsonUri` stays on Irys. Files: `public/obh/*.html`. Checks: 2
4. Rewrite `OnBeingHuman.tsx` from `STEV3.tsx`'s shape. Views are `selector | piece | about`. The piece view is an `<iframe src="/obh/<id>.html" key={id}>` filling the content box with no border. Menu: "Choose piece", "About", and "Purchase" only while a piece has been opened, which opens `https://opensea.io/assets/ethereum/0x4759A45c80eB04571902df74200F0D8d6c83F070/<token>` in a new tab. The initial size fits a portrait piece (3xGP's `560*1.4` × `890*1.4`), `wrapperClassName="bg-black"`. About: the series line from the metadata ("Photographic, generative glitch art by EV3. An original photo modified by the Epoch One engine."), the five titles, and a note that each piece shows its still first and then starts moving. If dragging the window by its title bar stutters or drops once the cursor crosses the iframe, set `pointer-events-none` on the iframe while dragging (`components/Window.tsx` drag via `dragRef`). Files: `components/windows/OnBeingHuman.tsx`. Checks: 1, 3

## Acceptance checks

| # | Done-when (the ticket's line, in a few words) | Command | Expected result | Verified by |
|---|---|---|---|---|
| 1 | Selector of 5, opening runs the piece, other windows' keys unaffected | browser check: `yarn dev` on the worktree's port, open "on being human" from the start menu; open each piece; then open Sk3tch too, click into the OBH piece, press `s` and `f`, and click into Sk3tch and press keys | Five thumbs and titles A–E in the selector; each piece shows its still, then moves, with its own action bar; C letterboxed landscape; keys pressed in the piece change only the piece, and Sk3tch's keys don't reach it | browser check |
| 2 | Images from Blob, none from Irys | `grep -o "gateway.irys.xyz/[A-Za-z0-9]*" public/obh/*.html \| sort -u`, then browser network panel while opening each piece | grep lists one id per file, its `jsonUri` (A's is `6g25BeJGuAhVHshMWaMJvpgZU1i6r5nSenVz36rspe7T`); in the network panel the thumbnail and imagein requests go to the Blob host, and the only gateway.irys.xyz request is the JSON | the command itself + browser check |
| 3 | Purchase opens the piece's marketplace page; Choose piece and About work | browser check: open piece D, click Purchase; use Choose piece and About; and `curl -sIL -o /dev/null -w "%{http_code}" https://opensea.io/assets/ethereum/0x4759A45c80eB04571902df74200F0D8d6c83F070/4` | A new tab on token 4's OpenSea page; Choose piece returns to the selector with D selected; About shows the text and its back button returns; curl ends in 200 (a 403 from bot protection is fine if the page loads in the browser) | browser check + the command |

## Hard rules

- Full check: `yarn test`, `npx tsc --noEmit`, `yarn build`; lint: none in this repo (`next lint` starts interactive setup).
- Dependencies: the repo uses yarn (`yarn.lock`), outside goodaf's no-ask install exception. Ask the user before `yarn install --frozen-lockfile` in this worktree and record the answer in Progress.
- Never edit a vendored page's `<script>` or engine bytes; only the three image URL strings change.
- No new npm package (`@vercel/blob` included): the page uses only the public Blob URLs.

## Follow-up 1

Base: e599830
- B1: each vendored page's `<head>` preloads its engine buffers (`<link rel="preload" as="fetch" crossorigin>` for the imagein, `as="image" crossorigin` for the thumb), the Sk3tch bake's pattern, so the imagein downloads alongside the thumb instead of after it; repro test `components/windows/obhPages.test.tsx`

## Follow-up 2

Base: fb0c58e
- B2: a piece's engine fails to start when another piece is opened after it, and C fails in an expanded window; find the cause (the B1 preloads, the swapped iframe's engine or WebGL context not being released, or C's canvas size), fix it with a repro test
- B3: a simple person icon for OBH (`public/svg/obh-icon.svg`, 16×16 like `settings-icon.svg`), set in `ICONS`
- B4: titles read "A: there must be something" (selector, iframe title)
- B5: Purchase always opens the Manifold collection page `https://manifold.xyz/@ev3/contract/124346608`, whichever piece is open
- B6: the About view drawn inset (`classic-inset`), like the selector
- B7: the About copy replaced with the user's text

## Follow-up 3

Base: 1905739
- B8: each vendored page hides its fallback still and shows "Loading..." flashing in W95FA, centered, until the engine's first frame removes the still; the still shows again only if the engine fails to start
- B9: the piece's action-bar System button (☰) drawn disabled and unclickable, the engine's `tt-disabled` look, by CSS in each page; its `Q` shortcut checked to do nothing
- B10: selector thumbs redone at their own aspect (54×96 portrait, C 96×54), drawn at that shape centered in `WorkSelector`'s 96×96 box

## Progress

- 2026-11-09 plan written
- 2026-11-09 step 1: vendored five pages byte for byte (145–146KB each) into public/obh/, made 96×96 JPEG thumbs (3–5KB) from the thumbnail PNGs; checks —
- 2026-11-09 user approved `yarn install --frozen-lockfile` (yarn.lock same as main) and the Blob store + upload (answers 1a, 2a)
- 2026-11-09 step 2 partial: Blob store `ev3-obh-pieces` (store_K4XW43AjR4eh6RE3, public, iad1) created with the Vercel CLI; the MCP's create returned 403. Connecting it to the project (to get the upload token) was refused by the session's permission classifier as a secret-store write; parked for the user. Nothing uploaded yet
- 2026-11-09 step 4: OnBeingHuman.tsx rewritten (selector → iframe piece → About; Choose piece, About, Purchase); done ahead of steps 2–3 since it doesn't depend on them; checks 1, 3 pass (images still from Irys until step 3)
- 2026-11-09 step 2: user said "Allow it, you connect"; store connected to ev3-art-portfolio with `vercel api POST /v1/storage/stores/<id>/connections` (adds BLOB_READ_WRITE_TOKEN to Production, Preview, Development); user added a permission rule, then a scratch script pulled the token to a temp file (deleted after) and uploaded the 10 files to `https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/obh/<letter>-thumb.png` and `/obh/<letter>-imagein`; each returns 200, `access-control-allow-origin: *`, its Irys content type and byte size; checks — (check 2 runs after step 3)
- 2026-11-09 step 3: rewrote the fallback `<img>` src, `thumbnailUrl` and `imageInUrl` in each page to its Blob URLs; `git diff --word-diff` shows only those strings changed (2 lines per file); check 2's grep lists one Irys id per file, its `jsonUri` (A's `6g25BeJG…`); in the browser each piece's iframe Resource Timing shows exactly two requests, `<letter>-thumb.png` (img) and `<letter>-imagein` (fetch), both 200 from the Blob host, and no gateway.irys.xyz request at all (the engine didn't fetch `jsonUri` in these runs); check 2 passes
- 2026-11-09 simplify: 0 edits (reuse, efficiency, simplification clean apart from skipped nits; altitude's shared view-switching hook and `WindowMenuItem.disabled` skipped as outside this diff); all checks pass: `npx tsc --noEmit` exit 0, `yarn test` 1/1 pass, `yarn build` exit 0, check 2 grep one jsonUri id per file
- 2026-11-10 follow-up 1 B1: two preload `<link>`s after `<title>` in each page (imagein `as="fetch"`, thumb `as="image"`, both `crossorigin`); repro test `components/windows/obhPages.test.tsx` (added to `yarn test`) failed on `a: preload for its imageInUrl in <head>` before, passes after; diff against 9a4bcb7 is only the two head lines plus the three URLs; browser: each page's Resource Timing lists exactly one entry per buffer, both `initiatorType: link` starting together, canvas up and fallback removed, no preload console warnings; checks 2 pass, `yarn test` 2/2, `npx tsc --noEmit` exit 0
- 2026-11-10 follow-up 2 B2: cause was B1's `<link rel="preload" as="fetch" crossorigin>` for the imagein: once the response is cached, the engine's own fetch matched to that preload throws `TypeError: Failed to fetch` ("loadNft failed; engine not started"), so the still stays up and the piece never moves; reproduced in the app (C reopened failed every time, A too) and in isolated iframes (C with that preload 4/4 fail, without it 0/4; thumb-only preload fine); the window size didn't matter, C and A failed at the same box size. Fix: the imagein preload replaced by `<script>fetch("<imageInUrl>").catch(() => {})</script>` in each page's `<head>`, which starts the download at page start; the engine's later fetch joins that request (cold run: both ended at the same moment), so it downloads once. Repro test `components/windows/obhPages.test.tsx` "B2: no OBH page preloads its imagein as fetch…" failed on `a: no as="fetch" preload in <head>` before, passes after; B1's test updated to the new form. Browser: 12 piece switches A–E with C four times all run, C maximized 3/3 run, no console errors; checks 2 (grep) pass, `yarn test` 3/3
- 2026-11-10 follow-up 2 B3: `public/svg/obh-icon.svg`, a 16×16 crispEdges person (white head, teal body, black outline) like `settings-icon.svg`, set as `ICONS[WINDOWS.OBH]`; repro test `components/windows/obh.test.tsx` "B3: OBH's icon is its own person icon in public/svg" (added to `yarn test`) failed on `'/images/small-logo.png'` !== `'/svg/obh-icon.svg'` before, passes after; checks —, `yarn test` 4/4
- 2026-11-10 follow-up 2 B4: titles in `works` read "A: there must be something" … "E: something was found" (the selector labels, File name field, iframe title and About list all read them); `works`, `purchaseUrl` and the About view moved unchanged from `OnBeingHuman.tsx` to `components/windows/obh.tsx` so a node test can load them without the `@/` alias; repro test `components/windows/obh.test.tsx` "B4: each piece's title starts with its letter" failed on the deep-equal (`'there must be something'` for `'A: there must be something'`) before, passes after; checks —, `yarn test` 5/5, `npx tsc --noEmit` exit 0
- 2026-11-10 follow-up 2 B5: Purchase opens `PURCHASE_URL`, the Manifold collection page `https://manifold.xyz/@ev3/contract/124346608` ("on being human (OBH)", 5 works, contract 0x4759…f070, found from the @ev3 profile in the browser), and is always in the menu; the per-token OpenSea URL and the `token` fields are gone; repro test `components/windows/obh.test.tsx` "B5: Purchase opens the Manifold collection page…" failed on `undefined` !== the Manifold URL before, passes after; checks 3 (menu part) rechecked in the browser at the end, `yarn test` 6/6, `npx tsc --noEmit` exit 0
- 2026-11-10 follow-up 2 B6: the About view's root gets `classic-inset`, redrawing the sunken well it covers as `WorkSelector` does; repro test `components/windows/obh.test.tsx` "B6: the About view is drawn inset…" failed on `the About root has classic-inset` before, passes after; browser look checked at the end; `yarn test` 7/7
- 2026-11-10 follow-up 2 B7: the About copy is the bold "on being human" heading, the user's series line, then the five lettered titles read from `works` (no quotes); the "Photographic, generative…" and "Each piece shows its still…" lines are gone; repro test `components/windows/obh.test.tsx` "B7: the About copy is the series line, then the five lettered titles" failed on the deep-equal (quoted titles, the old lines) before, passes after; `yarn test` 8/8, `npx tsc --noEmit` exit 0
- 2026-11-10 follow-up 2 review: general reviewer on fb0c58e..1d5fb1b, 2 findings: F2 tracked (T2, the B5 test doesn't cover the menu wiring), F3 admitted (B6's `classic-inset` overrode `p-4`, About padding 16px → 2px) and fixed by the fixer in ecd3809 (`!p-4`); re-review: fixed, no new findings; all checks rerun on ecd3809: 1, 2, 3 pass in the browser, `yarn test` 9/9, `npx tsc --noEmit` exit 0, `yarn build` exit 0

## Decisions

- Normal: Purchase target: OpenSea per-token page built from the contract and token ID, the usual ETH marketplace for a Manifold ERC-721 (the user didn't name one). Reverse: change the URL template in `OnBeingHuman.tsx`. Replaced in follow-up 2 by B5: the Manifold collection page.
- Normal: Purchase appears only once a piece has been opened, since it acts on that piece. Reverse: always list it and use the selector's piece. Replaced in follow-up 2: Purchase is always listed, since the collection page doesn't depend on a piece.
- Normal: the selector is ordered A–E (matching the token IDs), not the snapshot order A, E, C, D, B. Reverse: reorder `works`.
- Normal: `jsonUri` stays on Irys: 2KB, and the engine falls back to the page's own settings if it fails. Reverse: upload it to Blob too and rewrite it.
- Normal: no stop-on-minimize, matching 3xGP and R3MIX. Reverse: unmount the iframe while minimized.
- Normal: no `pointer-events-none` on the iframe while dragging: a title-bar drag ending over the iframe moved the window and didn't stick (the browser keeps mouse events with the frame that got the mousedown). Reverse: expose `isDragging` from `Window` and add the class.
- Normal: no extra focus handling for the iframe: `Window` already makes an inactive window's content `pointer-events-none`, so a first click on the piece brings the window to the front and later clicks reach the piece. Reverse: add a window `blur` listener that moves OBH to the end of `orderState` when the iframe takes focus.
- Normal: the About view gets its own `bg-amber-50` over the window's black wrapper, so it reads like 3xGP's About. Reverse: drop the class.
- Normal: Purchase calls `window.open(url, "_blank", "noopener")`. Reverse: drop `"noopener"`.
- Elevated: B1 asked for the thumbnail to load only if the engine fails, but the thumbnail is the engine's own base image (`loadSession(seed, …, thumbnailUrl, …)` loads it with `new Image()`, `crossOrigin="anonymous"`), and the fallback `<img>` shares that one request. So the thumb can't be deferred; the real delay was the imagein, fetched only after the thumb loaded. Choice: preload both buffers in `<head>` (Sk3tch's pattern), leave the fallback `<img>` as is (no `fetchpriority="low"`, which would slow the engine's base frame). This relaxes the hard rule "only the three image URL strings change" for two `<head>` lines; scripts and engine bytes untouched. Reverse: delete the two `<link rel="preload">` lines in each page and the B1 test.
- Normal: step 4 built before steps 2–3, which were waiting on the Blob connection; the order doesn't matter because only the vendored pages change in step 3. Reverse: n/a.
- Elevated: follow-up 2 B2 amends B1's choice. B1's `as="fetch" crossorigin` preload for the imagein makes the engine's matched fetch fail once cached. Options: drop the imagein preload (the engine fetches it only after the thumb, about 2.5s slower cold in a test run), a preload without `crossorigin` (not used: "credentials mode does not match", so a second download), or a plain `fetch()` in `<head>`. Chose the `<head>` `fetch()`: same request mode as the engine's, which reuses it. This relaxes the hard rule "never edit a vendored page's `<script>`" further: a new one-line `<script>` is added; the existing scripts and engine bytes are untouched. Reverse: replace the `<script>fetch(…)</script>` line in each page with nothing (sequential load).
- Normal: B3 icon colors: white head and teal (#008080) body with a black outline, Win95 palette. Reverse: change the fills in `public/svg/obh-icon.svg`.
- Normal: `works`, `purchaseUrl` and the About view live in `components/windows/obh.tsx`, imported by `OnBeingHuman.tsx`, so the node tests can import them (the window's `@/` imports don't resolve under `tsc -p tsconfig.test.json`). Reverse: inline them back into `OnBeingHuman.tsx` and drop the B4–B7 tests.
- Normal: follow-up 2 B5: Purchase is always in the menu, the selector and About too, since the collection page doesn't depend on the open piece. Reverse: list it only while `active` is set.
- Normal: follow-up 2 B6 reads "inset" as Win95's sunken bevel (`classic-inset`) on the About view, which paints over the window's own inset well; the amber background stays. Reverse: drop `classic-inset` from `About` in `components/windows/obh.tsx`.
- Normal: follow-up 2 B7 keeps the bold "on being human" heading above the user's copy, as 3xGP's About has its title, and replaces everything else. Reverse: drop the heading `<p>` in `About`.

## Parked asks

- ~~Blob store connection~~: resolved 2026-11-09, see step 2's Progress line.

