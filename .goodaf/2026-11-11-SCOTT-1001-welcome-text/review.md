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

- B1. 2026-11-11 "make the text go out a little slower, like a realy fast human typing speed."
  Done: 2026-11-11, 7fdd925, small change, no repro test (15ms per character, 120ms at line ends; measures 10.5 s)
- B2. 2026-11-11 "remove the extra newline after "I have recently finished two large projects:" and "Enjoy""
  Done: 2026-11-11, 92daea4, small change, no repro test
- B3. 2026-11-11 "make the Social Links component aligned to the left and remove the extra padding around it"
  Done: 2026-11-11, 0616604, small change, no repro test
- B4. 2026-11-11 "increase the default window dimensions so there's no scroll bar and only the bullet points over flow to a second line"
  Done: 2026-11-11, 366745d, small change, no repro test (660×460; at 1024×768 no scroll bar, only the two bullets wrap)

## Follow-ups

- 2026-11-11 small changes in review: head 366745d; did B1, B2, B3, B4; not reviewed
