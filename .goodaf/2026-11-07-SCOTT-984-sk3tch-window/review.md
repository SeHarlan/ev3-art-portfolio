# Review: SCOTT-984 Sk3tch as a native portfolio window

Tier: Standard · visual (Sk3tch window chrome and layout)
Reviewed: 2026-11-07 · main at 8d9251a · reviewed de4afbb · final de4afbb
Panel: general; no Codex pass: visual or device diff
Oracle check: no oracles
Rounds: 0 (no admitted findings)
Counts: 0 fixed, 1 asks, 0 tracked, 0 dropped

## Acceptance checks

- 1 Icon opens Sk3tch window, title, live UI, Win95 text, palettes, drag/resize/max/min/close, engine stop/start: pass — browser check (Playwright, 1280x800, dev server on 3984) → title `c95e5f50 · Sk3tch`, icon `/svg/sk3tch-icon.svg`, `.p95-root` `data-p95-frame=host`, root rect = content box `224,66,792,670`, 1 root; menu item `"W95FA UI", Tahoma, sans-serif` 11px; Classic/1-Bit/Standard → `win95`/`bw`/`gray`; drag 220,40 → 120,60; grip larger 896x704 (regular), smaller 392x320 with content 384x290 (compact); maximize 0,0,1280,764 (regular), restore back to compact; rAF over 1s: open 122, minimized 0, restored 121; close leaves 0 roots and 0 rAF; reopen `4b8a44c9` → `adce0eee`, 1 root. At 375x812 (from the Start menu): window 0,0,375,776, root = box `4,26,367,746`, compact, title `7652b4ce · Sk3tch`. Console errors only main's hydration `style` warning and SeedDropdown's nested `<button>`
- 2 Sk3tch keys only while active: pass — browser check → active: `c` → Square Brush, `z` → Round Brush; with Settings in front `c` and `z` left Round Brush; after clicking Sk3tch's title bar `c` → Square Brush
- 3 Start menu and dropdown items unchanged after Sk3tch opens: pass — `grep -rn "p95-menu-item" components pages styles` → exit 1, no output; browser check with Sk3tch open → Start item `4px 8px`, hover `rgb(26, 26, 26)` / white; R3MIX Choose dropdown item `0px 8px`, h 18, hover `rgb(26, 26, 26)` / white; window menu item `0px 6px` (= baseline)
- 4 Content text in Sk3tch's font at the same size, stock file gone: pass (bullet wording is A1) — `test ! -e styles/fonts/w95fa.woff2 && grep -c "w95fa.woff2'" styles/globals.css` → test passes, grep prints `0`; browser check after reload → CSSOM `W95FA` and `W95FA UI` both → `w95fa-ui…woff2`; it's just noise ul `140,277,1120,72`, li `140,277,1120,24`, p `140,85,1120,24`, p text `645.008x15`, li text `252.578x15`; DUET ul `120,365,1140,168`, li `120,365,1140,24`, p `120,125,1140,24`, p text `232.867x15`, li text `358.438x15`; p `W95FA 16px`, line-height 24px; `::marker` font `W95FA` — all equal step 1's baseline
- Full check: pass — `npx tsc --noEmit` → exit 0; `yarn build` → exit 0, `sk3tch/app.js` present in `.next/static/chunks/pages/index-*.js`

## Asks

- A1. [parked: spec meaning] Done-when 4 says content text renders "with its dashed bullet", but Sk3tch's font draws the same round `•` as the old stock file, so the list bullets look exactly as before and nothing dashed appears. Did you mean a different bullet (e.g. a `-` marker via `list-style-type`), or is the font's `•` what you expected? If left, the bullets stay the round `•` they are on main, not the small dashed line you described at intake ("a custom version of W95FA, mostly the same but with a bullet point added as a small dashed line"). From plan.md, with F1 as evidence: Sk3tch's stylesheet has no bullet, marker or list-style rule; Sk3tch has only one W95FA file (`packages/sketch-engine/assets/ui-font.woff2`, also in `server/src/vendor/bake/`), byte-identical to the portfolio's `w95fa-ui.woff2`; and its `•` (U+2022) matches the old stock file's and renders as a round dot (checked at 96px; `‐ – · ‧ ▪ - ∙` render as the usual plain dashes, dots and square). So the dashed glyph, if the file has it, sits at another character. Recommend: change — inspect the font's glyph table, find the dashed bullet glyph and point content `list-disc` markers at it (`list-style-type: '<char> '` or `::marker` content), keeping text sizes; if the file has no such glyph, report back and leave the bullets. This departs from plan.md's default (leave) because your intake note says the dashed bullet is what you wanted.
  Answer: —

## Tracked follow-ups

none

## Worth checking by hand

Worktree: /Users/scottharlan/Scottys art/ev3-art-portfolio-95/.claude/worktrees/SCOTT-984-sk3tch-window · dev server: http://localhost:3984
- Paint a few strokes in Sk3tch, minimize it, restore it from the taskbar → the painting is still there and the brush keeps working
- Put another window over Sk3tch without minimizing it → Sk3tch keeps animating behind it (only minimize stops the engine; stopping while covered was left as a product call)

## Findings

- F1. [ask A1] styles/globals.css:6-11 Done-when 4's "dashed bullet" isn't visibly met: the content bullet is the same round `•` as on main. Found by: general. Verifier: track — the gap comes from the spec's premise, not the code: Sk3tch's font draws a plain `•`, so a dashed bullet would need a marker change the spec doesn't describe; the existing Parked ask settles it. Joined A1 as its evidence.

## Bug notes

none

## Follow-ups

none
