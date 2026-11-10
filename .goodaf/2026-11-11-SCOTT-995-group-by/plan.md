# Plan: SCOTT-995 add a "group by" option in settings

Tier: Feature (no risk modifier)
Branch: goodaf/SCOTT-995-group-by · Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-995-group-by
Tags: visual: desktop folder icons, folder and Find windows, Start menu cascades, Settings Group by row, the three SVG icons

## Approach

One data module holds the spec's tag table, keyed by `WINDOWS` values, and derives each grouping's ordered folders from it. `WindowsProvider` holds the choice beside the open/order maps and saves it to localStorage the way `context/ThemeProvider.tsx` saves the palette. `Icons.tsx` and `StartMenu.tsx` render from the active grouping instead of `Object.values(WINDOWS)`. A folder is an ordinary window keyed by its bare group name (e.g. "2023"), so `handleOpen`, the open/order maps and the taskbar work unchanged. Folder windows and Find wrap the existing `WorkSelector` the same way `components/windows/R3MIX.tsx:129` does. Find is a new `WINDOWS.FIND` entry, rendered in `pages/index.tsx` like Settings.

## Files

- `data/groups.ts` (new, relative imports only): the tag table, `GROUP_BYS = ["year", "media", "experience"] as const` and its `GroupBy` type, `ART_KEYS` (the `WINDOWS` keys minus HOME, SETTINGS and FIND, in `WINDOWS` order), `groupsFor(groupBy)` → `{ name, keys }[]`, `matchesSearch(key, query)`, `FOLDER_ICON`.
- `context/WindowsProvider.tsx`: `FIND: "Find"` in `WINDOWS`, the `WINDOWS` type and `ICONS`; `ICONS[SETTINGS]` stays `/svg/settings-icon.svg`. The context gains `groupBy`, `setGroupBy` and `ready`, saved under localStorage key `ev3-p95-group-by`. Switching closes open folder windows that aren't in the new grouping.
- `components/Window.tsx`, `components/Footer.tsx`: the title-bar and taskbar icons fall back to `FOLDER_ICON` for keys with no `ICONS` entry.
- `components/Icons.tsx`: Introduction, then the active grouping's folders, then Find and Settings; renders nothing until `ready`.
- `components/windows/Folder.tsx` (new): a `Window` keyed by group name, holding a `WorkSelector` of its works.
- `components/windows/Find.tsx` (new): a search field, a Randomize button, and a `WorkSelector` of the filtered works.
- `pages/index.tsx`: render a `Folder` for each open group of the active grouping, plus `Find`.
- `components/StartMenu.tsx`: Introduction, then the group entries with cascading submenus, then a divider, then Find and Settings.
- `components/windows/Settings.tsx`: a "Group by" row of Year/Media/Experience buttons, matching the palette row; `initSize.h` grows to fit it.
- `public/svg/folder-icon.svg`, `public/svg/find-icon.svg` (new); `public/svg/settings-icon.svg` (redrawn).
- `components/groups.test.tsx` (new), `package.json`: the new test file, added to the `test` script.

## Slices (Feature)

1. Grouping data, the Settings control with saving, desktop folders, folder windows, and the folder and Control Panel icons. Steps 1–5. Ends green and committed.
2. Start menu cascades, the Find window with Randomize, and the Find icon. Steps 6–8. Ends green and committed.

## Steps

1. **Data module and its test.** Write `data/groups.ts` from the spec's tag table, keyed by `WINDOWS.<KEY>` values. Media is an array, experience a single value, year a string. Write `components/groups.test.tsx`: checks that each grouping's folder names and order and each folder's members match the table; that every `ART_KEYS` entry has tags and no other keys do; and that `matchesSearch` is case-insensitive substring matching on name, year, each media tag and experience. Add the test to the `test` script. If anything it imports pulls in an `@/` path, import `./testAlias` first, as `components/windows/windows.test.tsx:1` does. Files: `data/groups.ts`, `components/groups.test.tsx`, `package.json`. Checks: 2, 3, 4, 7 (search part)
2. **Grouping state and Settings row.** In `WindowsProvider`, read localStorage in a mount effect and fall back to `"year"` when the value is missing, not in `GROUP_BYS`, or the read throws (same guard as `isTheme`), then set `ready`. `setGroupBy` writes the value in try/catch and sets `openMap[name] = false` for each folder name of the old grouping that isn't in the new one. In Settings, add a "Group by" label and an `aria-pressed` button row (labels Year, Media, Experience) like Color palette. Files: `context/WindowsProvider.tsx`, `components/windows/Settings.tsx`. Checks: 1
3. **Desktop folders.** `Icons.tsx` renders Introduction, the folders (label is the group name, icon is `FOLDER_ICON`), then Find and Settings. Keep the current cell markup and the double-click and `onTouchEnd` handlers. Return `null` until `ready`. Files: `components/Icons.tsx`. Checks: 2, 3, 4
4. **Folder windows.** `Folder` takes the group name and its keys and renders `<Window windowKey={name}>` with initSize `{ w: 520, h: 360 }` and initPosition `{ x: 120, y: 60 }`. Inside goes a `WorkSelector` with works `{ id: <WINDOWS enum key, e.g. "TERRA">, title: <window name>, thumb: ICONS[<window name>] }`, so DOM ids carry no spaces or quotes. `onOpen` maps the id back and calls `handleOpen`; the folder stays open. Add the `FOLDER_ICON` fallback in `Window.tsx:120` and `Footer.tsx:68`. Render the folders in `pages/index.tsx`. Files: `components/windows/Folder.tsx`, `components/Window.tsx`, `components/Footer.tsx`, `pages/index.tsx`. Checks: 5
5. **Folder and Control Panel icons.** Pixel-art SVGs on a 16×16 grid with `shape-rendering="crispEdges"`, matching `public/svg/sk3tch-icon.svg`. The folder is Win95's closed yellow folder (tab top-left, dark outline, lighter front flap). The Settings icon is redrawn as Win95's Control Panel icon. Compare both against Win95 reference screenshots found in the browser pane. Files: `public/svg/folder-icon.svg`, `public/svg/settings-icon.svg`. Checks: 8
6. **Start menu cascades.** Group entries show the name with a right-pointing arrow. They are plain elements inside `Menu.Items`, not `Menu.Item`s, since a Headless UI 1.7 `Menu.Item` click closes the whole menu; only the works inside submenus and the top-level Introduction, Find and Settings are `Menu.Item`s. Hovering an entry (mouse) or clicking it (touch, or a click on desktop) opens its submenu, closes any other submenu, and sets the entry's highlight. The submenu is a `classic-border` panel to the right of the entry, top-aligned with it. It shifts up when it would pass the taskbar and caps at the viewport height with `overflow-y-auto`. Clicking a work calls `handleOpen` and closes the menu. The top-level list is short now (at most 9 rows), so drop its `max-h`/`overflow-y-auto` wrapper, which would clip a flyout. Files: `components/StartMenu.tsx`. Checks: 6
7. **Find window.** `Find.tsx` renders `<Window windowKey={WINDOWS.FIND}>` with initSize `{ w: 560, h: 420 }` and initPosition `{ x: 160, y: 80 }`. Top row: a "Named:" label, a `classic-inset` text input (focused on open), and a Randomize button. Below it, a positioned `flex-1` box holds a `WorkSelector` of `ART_KEYS.filter(k => matchesSearch(k, query))`, keyed by `query` so the selection resets as the list changes. With no matches, it shows an empty grid and Open is disabled. Randomize calls `handleOpen` on a random `ART_KEYS` entry, never the same one twice in a row, whatever the query. Render Find in `pages/index.tsx`. Files: `components/windows/Find.tsx`, `pages/index.tsx`, `context/WindowsProvider.tsx`. Checks: 7
8. **Find icon.** Win95's Find icon (a magnifying glass over a page), on the same 16×16 grid; set it as `ICONS[FIND]`. Files: `public/svg/find-icon.svg`, `context/WindowsProvider.tsx`. Checks: 8

## Acceptance checks

| # | Done-when (the ticket's line, in a few words) | Command | Expected result | Verified by |
|---|---|---|---|---|
| 1 | Group by control; rearranges right away; survives reload | Browser check: `http://localhost:<port>`, open Settings, click Media, then Experience, then reload | Each click changes the desktop folders and Start entries with no reload. After reload, the last choice is still pressed and the desktop matches it. An open "2023" folder window closes when switching to Media. | browser check |
| 2 | Year folders 2026→2022 plus top-level icons | `rm -rf node_modules/.cache/test-build && npx tsc -p tsconfig.test.json && node node_modules/.cache/test-build/components/groups.test.js`; then a browser check of the desktop on first load (localStorage cleared) | Test passes. Desktop shows Introduction, 2026, 2025, 2024, 2023, 2022, Find, Settings, with no individual work icons. | new test `components/groups.test.tsx`: the folder contents are data, a test pins them to the table; plus browser check |
| 3 | Media folders, overlap | same test command; browser: switch to Media | Test passes. Desktop shows code, video, image, audio. The video and image folders both list T3RRA, and code and audio both list DUET. | new test `components/groups.test.tsx`; browser check |
| 4 | Experience folders | same test command; browser: switch to Experience | Test passes. Desktop shows Interactive, Generative, Fixed. | new test `components/groups.test.tsx`; browser check |
| 5 | Folder window lists group in selector; opens work | Browser check: double-click the 2023 folder, then double-click DUET; repeat with a tap at 375×812 | A window titled "2023" with a folder title-bar and taskbar icon lists DUET, it's just noise, Maurer Expanse, "Progress", A Single Path and T3RRA with their desktop icons. DUET's window opens on top and the folder stays open. | browser check |
| 6 | Start cascades | Browser check: open Start, hover 2025, click remember.exe; open Start, click code; check at 1280×600 and 375×812 | Each group entry opens a submenu of its works beside it, fully on screen. remember.exe opens and the menu closes. Introduction, Find and Settings are plain top-level entries. | browser check |
| 7 | Find: opens from desktop and Start; filters by name or any tag; Randomize from all 19 | same test command for `matchesSearch`; browser: open Find from the desktop and from Start, type `audio`, `maur`, `2026`, `xyz`, clear it, then click Randomize 5 times | Test passes. 19 works when empty. `audio` → DUET, A Flower Blooms in Autumn, Tune Out (under every grouping). `maur` → Maurer Expanse. `2026` → techtonic, on being human, Sk3tch. `xyz` → empty with Open disabled. Each Randomize brings a work window to the front, never the same one twice in a row. | new test `components/groups.test.tsx`; browser check |
| 8 | Folder, Find and Control Panel icons look like Win95's | Browser check: desktop at 1280×800 beside Win95 reference screenshots | The three icons read as Win95's closed folder, Find and Control Panel, crisp at 56px and 16px. | browser check (user's E2E has the final say) |

## Hard rules

- Full check: `yarn test`, `npx tsc --noEmit`, `yarn build`; lint: none in this repo: `next lint` prompts to set up ESLint.
- Dependencies: the repo uses yarn (`yarn.lock`), which the worktree setup doesn't install on its own. Run `yarn install --frozen-lockfile` only after the user's yes is logged in Progress.
- `WINDOWS` order stays as it is: folder member order, Find's list and the tests all follow it.

## Progress

- 2026-11-11 plan written
- 2026-11-11 user approved `yarn install --frozen-lockfile` in this worktree
- 2026-11-11 plan check: 1 must-fix fixed, 1 notes adopted, 0 dismissed
- 2026-11-11 step 1: data/groups.ts tag table, groupsFor, matchesSearch, ART_KEYS; WINDOWS.FIND entry; components/groups.test.tsx added to the test script; checks 2, 3, 4, 7 (test parts) pass
- 2026-11-11 step 2: groupBy/setGroupBy/ready in WindowsProvider, saved under `ev3-p95-group-by`; Settings Group by row; `yarn test` and `npx tsc --noEmit` pass; check 1 runs in the browser once the desktop renders folders (step 3–4)
- 2026-11-11 step 3: desktop renders Introduction, the active grouping's folders, Find, Settings, gated on `ready`; checks 2, 3, 4 pass (test, and browser: Year shows 2026→2022, Media shows code/video/image/audio, Experience shows Interactive/Generative/Fixed, Experience survives reload); check 1's desktop part passes, its Start part waits for step 6
- 2026-11-11 step 4: Folder window with WorkSelector, FOLDER_ICON fallback in Window and Footer, folders rendered in pages/index; check 5 passes (browser: 2023 lists DUET, it's just noise, Maurer Expanse, "Progress", A Single Path, T3RRA; DUET opens on top and the folder stays open, by double-click at desktop size and by tap + Open at 375×812); check 1's close-on-switch part passes (open 2023 closes and leaves the taskbar on switching to Media); `yarn test` passes
- 2026-11-11 step 5: original 16×16 pixel-art folder, Control Panel (`settings-icon.svg`) and Find icons; check 8 run as a browser look at 112/56/16px and on the desktop (reads as closed folder, folder with tools, page with magnifier; all three load 200, no 404s), final say is the user's E2E; `yarn test`, `npx tsc --noEmit` and `yarn build` pass
- 2026-11-11 slice 1 done
- 2026-11-11 step 6: Start menu cascades (plain group entries with a `cascade` PixelGlyph arrow, `Menu.Item` works in a flyout kept on screen); check 6 passes (browser: 1280×600 hover 2025 → CEASEFIRE, remember.exe, s34s0ns, Exaltation of Isaac beside it, remember.exe opens and the menu closes; Media code's 11 works shift up to sit on the taskbar; 375×812 tap audio and code both fit inside 375px, tapping Sk3tch opens it and closes the menu); `yarn test` and `npx tsc --noEmit` pass
- 2026-11-11 step 7: Find window (Named: field focused on open, Randomize, WorkSelector of the matches keyed by the query), rendered in pages/index; `selectorWorks`/`windowFromId` in data/groups.ts now shared by Folder and Find; WindowsProvider needed no change (FIND landed in slice 1); check 7 passes (`yarn test` 30 pass incl. matchesSearch; browser: opens from the desktop icon and from Start with the field focused, 19 works when empty, `audio` → DUET, A Flower Blooms in Autumn, Tune Out, `maur` → Maurer Expanse, `2026` → techtonic, on being human, Sk3tch, `xyz` → empty with Open disabled, 5 Randomize clicks each brought a work to the front with no repeat in a row); check 1's Start part passes (switching to Experience in Settings changes Start to Interactive, Generative, Fixed with no reload); `npx tsc --noEmit` passes
- 2026-11-11 step 8: Find icon was drawn and set as `ICONS[FIND]` in slice 1 (Decisions); no file change; check 8's Find part runs as a browser look (`/svg/find-icon.svg` serves 200 image/svg+xml; reads as a page under a magnifier at 56px on the desktop and 16px in the Find title bar and taskbar), final say is the user's E2E
- 2026-11-11 simplify: 13 edits (`iconFor` shared by Window, Footer and Icons; desktop icons invisible rather than unrendered before `ready`; groupings built once at module load; `ART_KEYS` derived from the tag table; name-to-id map; `matchesSearch` reuses `tagsOf`; Folder takes a `Group`; mirror `WINDOWS` type and unused exports dropped; Settings rows share an `OptionRow`; Start menu shares a `PANEL` class, highlights an open cascade by `aria-expanded` in CSS, and uses a new `.classic-divider-h`); skipped: WorkSelector building its own DOM ids (shared component outside this diff), a shared dialog-button class (pre-existing pattern), the provider's `?window=` lookup; all checks pass (`yarn test` 30 pass, `npx tsc --noEmit`, `yarn build`; browser: cascade, highlight, divider and both Settings rows render)
- 2026-11-11 slice 2 done

## Decisions

- Normal: stored format: localStorage key `ev3-p95-group-by` with values `year`, `media`, `experience`, the `GROUP_BYS` ids, the way the palette stores `THEMES` ids. Renaming a value later sends saved choices back to Year. Reverse: change `GROUP_BYS` and the key.
- Normal: grouping state lives in `WindowsProvider`, not a separate provider, because switching has to close folder windows in that provider's `openMap` (plan check note). Reverse: split it into its own provider.
- Normal: folder window keys: the bare group name, because the spec's group names never collide with a work name, and the title bar and taskbar show the key. Reverse: prefix the keys and pass `title`.
- Normal: `WorkSelector` ids: the `WINDOWS` enum key (e.g. `TERRA`), because window names contain spaces and quotes that break `aria-activedescendant`. Reverse: use names.
- Normal: desktop and Start order: Introduction, the folders, then Find and Settings, the way Win95 put Find and Settings below Programs. Reverse: reorder in `Icons.tsx`/`StartMenu.tsx`.
- Normal: no wrong-grouping flash on reload: the desktop icons stay invisible until the saved grouping is read, since the palette's pre-paint script can't rearrange React output (simplify: invisible rather than unrendered, so the icons load from the server HTML and hold their space). Reverse: drop the `ready` gate.
- Normal: switching grouping closes the old grouping's open folder windows, so no stale folders stay in the taskbar. Reverse: drop the close loop in `setGroupBy`.
- Normal: Find matches case-insensitive substrings of the name and all three tag kinds, whatever the active grouping. Reverse: `matchesSearch`.
- Normal: Randomize never repeats the previous pick, so each click visibly changes the front window. Reverse: plain random pick.
- Normal: folder windows stay open after opening a work, as Explorer's do. Reverse: close in `onOpen`.
- Normal: icons on a 16×16 grid, like the repo's other pixel SVGs. Reverse: redraw on 32×32.
- Normal: sizes: folder window 520×360 at (120, 60), Find 560×420 at (160, 80). Reverse: the `initSize`/`initPosition` constants.
- Normal: `WINDOWS.FIND` and `ICONS[FIND]` (`/svg/find-icon.svg`) land in slice 1, since the slice 1 desktop already shows Find (check 2) and `ART_KEYS` excludes it; the Find icon is drawn in step 5 with the other two, and the Find window still comes in step 7. Reverse: move the entry and drawing back to steps 7–8.
- Normal: `ART_KEYS` and `groupsFor(...).keys` hold window names (`WINDOWS` values, the codebase's `windowKey`); `windowId(name)` gives the enum key for `WorkSelector` ids. Reverse: hold enum keys and map at render.
- Normal: `matchesSearch` trims the query, so a stray space doesn't empty the list. Reverse: drop the `trim()`.
- Elevated: plan departure. Situation: the plan keeps `WINDOWS` and `ICONS` in `WindowsProvider`, but the provider now imports `data/groups.ts`, which reads `WINDOWS` at load, an import cycle that throws. Options: move them to their own module, or have the provider compute folder names lazily. Choice: moved verbatim to `data/windows.ts`, re-exported from `WindowsProvider` so every existing import still works. Reverse: move them back and make `groups.ts` read `WINDOWS` lazily.
- Elevated: visual call. Situation: the spec asks for icons as close to Win95's as possible; tracing Microsoft's icon bitmaps pixel for pixel would copy their art. Options: trace the Win9x bitmaps, or draw original pixel art with the same read. Choice: original 16×16 art in the Win95 style, compared against Win9x reference icons in the browser: a flat yellow closed folder with a tab, black outline and olive shading (no yellow/gray dither, which reads as texture at 56px); the same folder with a hammer and screwdriver for Control Panel; a dog-eared page under a cyan-lensed magnifier for Find. Reverse: redraw in `public/svg/`, or trace if the user accepts that.
- Normal: the Find icon is drawn in step 5 with the other two, so the slice 1 desktop has no broken image; step 8 only needs to check it. Reverse: redraw in step 8.
- Normal: the cascade arrow is a new `cascade` glyph in `PixelGlyph`, recolored with the highlight like the title-bar glyphs. Reverse: drop the glyph and use a text arrow.
- Normal: hovering Introduction, Find or Settings closes an open cascade, as Win95 does. Reverse: drop their `onMouseEnter`.
- Normal: a flyout that would pass the right edge shifts left over the menu, since the menu sits at the left edge and can't flip. Reverse: the `x` term in `Cascade`'s fit.
- Normal: group entries take no keyboard focus; Headless UI's arrow keys move over Introduction, Find, Settings and an open cascade's works. Reverse: make entries focusable and open on ArrowRight.
- Normal: the WorkSelector mapping (`selectorWorks`, `windowFromId`) moved from Folder into data/groups.ts so Folder and Find share it. Reverse: inline it in each window.

## Parked asks

- (none)
