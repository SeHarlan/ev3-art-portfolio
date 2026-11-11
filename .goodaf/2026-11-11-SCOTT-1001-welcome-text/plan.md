# Plan: SCOTT-1001 update welcome text

Tier: Standard · visual (Welcome window typing and links)
Branch: goodaf/SCOTT-1001-welcome-text · Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-1001-welcome-text
Tags: visual: `components/windows/Home.tsx` (typing, layout, links)

## Approach

Keep `HomeWindow`'s typewriter in `components/windows/Home.tsx` and replace its `contentList` with the new text. Add one content type, a link segment, typed character by character like plain text but rendered clickable: window links reuse the file's existing `WindowLink` (`handleOpen` from `useWindowsContext`), and the techtonic link is an `<a target="_blank" rel="noreferrer">`. A sentence holding a link is three segments (text, link, text) that must type on without a pause between them. Pauses go only at line and paragraph breaks. The random pick uses `ART_KEYS` from `data/groups.ts`. Then point `components/windows/Techtonic.tsx` and the JSON-LD in `pages/index.tsx` at `https://techtonic.ev3.art/`.

## Files

- `components/windows/Home.tsx`: new content list and link segment type, faster timings, Skip renders the links. Removes the old text, the delete phrases, the commented-out text and the now-unused `web3Links`, `personalLinks`, `WindowLinksWrapper` and `Image` import.
- `components/windows/Techtonic.tsx`: `SITE` becomes `https://techtonic.ev3.art/`.
- `pages/index.tsx`: techtonic JSON-LD entry moves to techtonic.ev3.art. The Epoch One `WebSite` entry, the on being human `Collection` and its `workExample` reference are removed, and the site description stops naming Epoch One.

## Steps

1. Rewrite the content list and typing in `Home.tsx`. The text is the ticket's Original request block as it reads now (the user edited it), word for word between the backtick fences. Each `[link …]` placeholder is dropped, and the words just before it become the link: "Sk3tch" opens `WINDOWS.SK3TCH`, "Techtonic" opens `https://techtonic.ev3.art/` in a new tab, "click here" opens a random entry of `ART_KEYS` (a fresh pick on each click), "My Computer" opens `WINDOWS.SETTINGS`, and `[social links]` is the existing `<Links>` element. Trim trailing spaces. The two projects render as a bulleted list with a hanging indent, so wrapped lines align under the text. Timing: about 8ms per character, no pause between segments of one sentence, and short pauses at breaks, so the whole text types in about 5–6 seconds. Skip shows all of it at once with the links working; Reset retypes it. Files: `components/windows/Home.tsx`. Checks: 1, 2
2. Switch techtonic's URL and clean the metadata. Files: `components/windows/Techtonic.tsx`, `pages/index.tsx`. Checks: 2, 3

## Acceptance checks

| # | Done-when (the ticket's line, in a few words) | Command | Expected result | Verified by |
|---|---|---|---|---|
| 1 | Welcome types the new text in ~5–6 s; Skip shows it all | Browser check on the worktree's dev server: load `/` with Welcome open, time from first character to the social icons; then Menu → Reset, then Menu → Skip; read the window's text with `get_page_text` | Typing ends in roughly 5–6 s with no visible stall mid-sentence; after Skip the full text and social icons show at once. The text matches the ticket's Original request word for word, without the bracketed placeholders, and the two projects show as bullets | browser check |
| 2 | Each link does its job | Browser check: after Skip, click Sk3tch, My Computer and click here (three times), inspect the Techtonic link and the social icons; open the techtonic window and inspect its Visit link | The Sk3tch and My Computer windows open; each "click here" opens an art window; the Techtonic link and the techtonic window's link have `href="https://techtonic.ev3.art/"` and `target="_blank"`; social icons link to Instagram and Twitter | browser check |
| 3 | No `epoch1` left | `grep -rn epoch1 components pages data` | No output (exit 1) | the command itself |

## Hard rules

- Full check: `yarn test` and `yarn build`; lint: none in this repo (no ESLint config, so `next lint` prompts to set one up)
- Dependencies: the repo uses yarn (`yarn.lock`), which is outside the user's no-ask install exception. Run `yarn install --frozen-lockfile` in this worktree only once Progress records the user's yes, and only while `yarn.lock` matches main's.

## Progress

- 2026-11-11 plan written
- 2026-11-11 user approved `yarn install --frozen-lockfile` in this worktree (yarn.lock matches main's); run by start, done, yarn.lock unchanged
- 2026-11-11 step 1: Home.tsx rewritten (typed-count typewriter, p/li/element lines, window and href link segments, new text); checks 1, 2 pass for Welcome (typing 6.07 s first char to icons, pauses only at line ends; Skip shows all 576 chars plus icons; Sk3tch, My Computer and click here ×3 open windows; Techtonic href and target right; techtonic window link pending step 2)

## Decisions

- Normal: random pick: uniform over `ART_KEYS` with `Math.random`, and it can repeat or land on an open window, since the spec asks only for a fresh pick per click. Reverse: filter open windows from the pool.
- Normal: techtonic JSON-LD: `@id` `https://techtonic.ev3.art/#techtonic`, `url` `https://techtonic.ev3.art/`, keeping the existing `#fragment` id pattern. Reverse: edit the two strings.
- Normal: site description: "Art portfolio of EV3 — generative and interactive works including techtonic, on being human, 3xGP, DUET, ITB, and R3MIX.", the old text minus the Epoch One naming. Reverse: edit the string.
- Normal: window links reuse `Home.tsx`'s existing `WindowLink` button rather than a new component. Reverse: replace with a new link component.
- Normal: typing state is one typed-character count rendered from `contentList`, replacing the per-segment JSX state; `WindowLink` takes a key or a function returning one, for the random pick. Reverse: git revert step 1.
- Normal: timing: 8ms per character and 60ms at each line end. Timer and render overhead make a character take about 9.8ms in the browser, so 120ms breaks measured 6.6 s; 60ms measures 6.07 s. Reverse: change `CHAR_DELAY` and `BREAK_DELAY` in `Home.tsx`.
- Normal: paragraphs are `<p class="mb-3">` and the projects a `list-disc list-outside pl-5` list (hanging indent; other windows use `list-inside`). Reverse: edit the classes in `renderContent`.

## Parked asks
