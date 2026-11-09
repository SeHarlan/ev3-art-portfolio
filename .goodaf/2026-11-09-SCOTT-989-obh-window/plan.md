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

## Progress

- 2026-11-09 plan written
- 2026-11-09 step 1: vendored five pages byte for byte (145–146KB each) into public/obh/, made 96×96 JPEG thumbs (3–5KB) from the thumbnail PNGs; checks —

## Decisions

- Normal: Purchase target: OpenSea per-token page built from the contract and token ID, the usual ETH marketplace for a Manifold ERC-721 (the user didn't name one). Reverse: change the URL template in `OnBeingHuman.tsx`.
- Normal: Purchase appears only once a piece has been opened, since it acts on that piece. Reverse: always list it and use the selector's piece.
- Normal: the selector is ordered A–E (matching the token IDs), not the snapshot order A, E, C, D, B. Reverse: reorder `works`.
- Normal: `jsonUri` stays on Irys: 2KB, and the engine falls back to the page's own settings if it fails. Reverse: upload it to Blob too and rewrite it.
- Normal: no stop-on-minimize, matching 3xGP and R3MIX. Reverse: unmount the iframe while minimized.

## Parked asks

