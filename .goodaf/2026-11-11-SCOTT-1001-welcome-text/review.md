# Review: SCOTT-1001 update welcome text

Tier: Standard · visual (Welcome window typing and links)
Reviewed: 2026-11-11 · main at 28b5983 · reviewed 71902bf · final 71902bf
Panel: general; no Codex pass: visual or device diff
Oracle check: no oracles
Rounds: 0 (no admitted findings)
Counts: 0 fixed, 0 asks, 0 tracked, 0 dropped

## Acceptance checks

- 1 Welcome types the new text in ~5–6 s; Skip shows it all: pass — browser check on `http://localhost:3001` (fronted background tab): after Menu → Reset, first character at 16 ms, social icons at 5966 ms (5.95 s typing), longest gap between characters 66 ms (line ends only); after Reset → Skip the full text and both social icons show at once, text matches the ticket's Original request word for word without placeholders, the two projects are `disc`/`outside` list items
- 2 Each link does its job: pass — browser check: Sk3tch opens the Sk3tch window, My Computer opens My Computer, click here ×3 opened on being human, Maurer Expanse and it's just noise; Techtonic link and the techtonic window's Visit techtonic link both `href="https://techtonic.ev3.art/"` `target="_blank"`; Visit menu item calls `window.open(SITE, "_blank")` with `SITE` = `https://techtonic.ev3.art/` (`components/windows/Techtonic.tsx:17`); social icons link to `https://www.instagram.com/ev3_art/` and `https://twitter.com/EV3_art`, `target="_blank"`
- 3 No `epoch1` left: pass — `grep -rn epoch1 components pages data` → exit 1, no output
- Full check: pass — `yarn test` → exit 0, 43 tests pass, 0 fail; `yarn build` → exit 0; lint: none in this repo

## Asks

none

## Tracked follow-ups

none

## Worth checking by hand

Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-1001-welcome-text · dev server: http://localhost:3001
none

## Findings

none

## Bug notes

none

## Follow-ups

none
