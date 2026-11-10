# Plan: SCOTT-995 add a "group by" option in settings

Tier: Feature (no risk modifier)
Branch: goodaf/SCOTT-995-group-by · Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-995-group-by
Tags: visual: desktop folder icons, folder and Find windows, Start menu cascades, Settings Group by row, the three SVG icons

## Approach

One data module holds the spec's tag table, keyed by `WINDOWS` values, and derives each grouping's ordered folders from it. A small `GroupByProvider`, modeled on `context/ThemeProvider.tsx`, holds the choice and saves it to localStorage. `Icons.tsx` and `StartMenu.tsx` render from the active grouping instead of `Object.values(WINDOWS)`. A folder is an ordinary window keyed by its bare group name (e.g. "2023"), so `handleOpen`, the open/order maps and the taskbar work unchanged. Folder windows and Find wrap the existing `WorkSelector` the same way `components/windows/R3MIX.tsx:129` does. Find is a new `WINDOWS.FIND` entry, rendered in `pages/index.tsx` like Settings.

## Files

- `data/groups.ts` (new): the tag table, `GroupBy` type and order, `ART_KEYS` (the `WINDOWS` keys minus HOME, SETTINGS and FIND, in `WINDOWS` order), `groupsFor(groupBy)` → `{ name, keys }[]`, `matchesSearch(key, query)`, `FOLDER_ICON`.
- `context/GroupByProvider.tsx` (new): `groupBy`, `setGroupBy`, `ready`; reads and writes localStorage key `ev3-p95-group-by`. Switching closes open folder windows that aren't in the new grouping.
- `pages/_app.tsx`: wrap the page in `GroupByProvider`, inside `WindowsProvider`.
- `context/WindowsProvider.tsx`: `FIND: "Find"` in `WINDOWS`, the `WINDOWS` type and `ICONS`; `ICONS[SETTINGS]` stays `/svg/settings-icon.svg`.
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

1. **Data module and its test.** Write `data/groups.ts` from the spec's tag table, keyed by `WINDOWS.<KEY>` values. Media is an array, experience a single value, year a string. Write `components/groups.test.tsx`: checks that each grouping's folder names and order and each folder's members match the table; that every `ART_KEYS` entry has tags and no other keys do; and that `matchesSearch` is case-insensitive substring matching on name, year, each media tag and experience. Add the test to the `test` script. Files: `data/groups.ts`, `components/groups.test.tsx`, `package.json`. Checks: 2, 3, 4, 7 (search part)
2. **Provider and Settings row.** `GroupByProvider` reads localStorage in a mount effect and falls back to `"year"` when the value is missing, invalid, or the read throws (same guard as `isTheme`), then sets `ready`. `setGroupBy` writes the value in try/catch and sets `openMap[name] = false` for each folder name of the old grouping that isn't in the new one. In Settings, add a "Group by" label and an `aria-pressed` button row like Color palette. Files: `context/GroupByProvider.tsx`, `pages/_app.tsx`, `components/windows/Settings.tsx`. Checks: 1
3. **Desktop folders.** `Icons.tsx` renders Introduction, the folders (label is the group name, icon is `FOLDER_ICON`), then Find and Settings. Keep the current cell markup and the double-click and `onTouchEnd` handlers. Return `null` until `ready`. Files: `components/Icons.tsx`. Checks: 2, 3, 4
4. **Folder windows.** `Folder` takes the group name and its keys and renders `<Window windowKey={name}>` with initSize `{ w: 520, h: 360 }` and initPosition `{ x: 120, y: 60 }`. Inside goes a `WorkSelector` with works `{ id: <WINDOWS enum key, e.g. "TERRA">, title: <window name>, thumb: ICONS[<window name>] }`, so DOM ids carry no spaces or quotes. `onOpen` maps the id back and calls `handleOpen`; the folder stays open. Add the `FOLDER_ICON` fallback in `Window.tsx:120` and `Footer.tsx:68`. Render the folders in `pages/index.tsx`. Files: `components/windows/Folder.tsx`, `components/Window.tsx`, `components/Footer.tsx`, `pages/index.tsx`. Checks: 5
5. **Folder and Control Panel icons.** Pixel-art SVGs on a 16×16 grid with `shape-rendering="crispEdges"`, matching `public/svg/sk3tch-icon.svg`. The folder is Win95's closed yellow folder (tab top-left, dark outline, lighter front flap). The Settings icon is redrawn as Win95's Control Panel icon. Compare both against Win95 reference screenshots found in the browser pane. Files: `public/svg/folder-icon.svg`, `public/svg/settings-icon.svg`. Checks: 8
6. **Start menu cascades.** Group entries show the name with a right-pointing arrow. Hovering an entry (mouse) or clicking it (touch, or a click on desktop) opens its submenu, closes any other submenu, and sets the entry's highlight. The submenu is a `classic-border` panel to the right of the entry, top-aligned with it. It shifts up when it would pass the taskbar and caps at the viewport height with `overflow-y-auto`. Clicking a work calls `handleOpen` and closes the menu. The top-level list is short now (at most 9 rows), so drop its `max-h`/`overflow-y-auto` wrapper, which would clip a flyout. Files: `components/StartMenu.tsx`. Checks: 6
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

## Decisions

- Normal: folder window keys: the bare group name, because the spec's group names never collide with a work name, and the title bar and taskbar show the key. Reverse: prefix the keys and pass `title`.
- Normal: `WorkSelector` ids: the `WINDOWS` enum key (e.g. `TERRA`), because window names contain spaces and quotes that break `aria-activedescendant`. Reverse: use names.
- Normal: desktop and Start order: Introduction, the folders, then Find and Settings, the way Win95 put Find and Settings below Programs. Reverse: reorder in `Icons.tsx`/`StartMenu.tsx`.
- Normal: no wrong-grouping flash on reload: the desktop icons render only once the saved grouping is read, since the palette's pre-paint script can't rearrange React output. Reverse: drop the `ready` gate.
- Normal: switching grouping closes the old grouping's open folder windows, so no stale folders stay in the taskbar. Reverse: drop the close loop in `setGroupBy`.
- Normal: Find matches case-insensitive substrings of the name and all three tag kinds, whatever the active grouping. Reverse: `matchesSearch`.
- Normal: Randomize never repeats the previous pick, so each click visibly changes the front window. Reverse: plain random pick.
- Normal: folder windows stay open after opening a work, as Explorer's do. Reverse: close in `onOpen`.
- Normal: icons on a 16×16 grid, like the repo's other pixel SVGs. Reverse: redraw on 32×32.
- Normal: sizes: folder window 520×360 at (120, 60), Find 560×420 at (160, 80). Reverse: the `initSize`/`initPosition` constants.

## Parked asks

- (none)
