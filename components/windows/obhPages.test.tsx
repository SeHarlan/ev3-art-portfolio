import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const pages = ["a", "b", "c", "d", "e"];

const read = (id: string) => {
  const html = readFileSync(join(process.cwd(), "public/obh", `${id}.html`), "utf8");
  const head = html.slice(0, html.indexOf("</head>"));
  const nft = JSON.parse(html.match(/window\.__NFT__ = (\{.*?\});/)![1]);
  return { head, nft };
};

test("B1: each OBH page's <head> starts its engine buffers' downloads, the imagein by fetch and the thumb as a crossorigin image preload", () => {
  for (const id of pages) {
    const { head, nft } = read(id);
    assert.ok(
      head.includes(`<script>fetch("${nft.imageInUrl}").catch(() => {})</script>`),
      `${id}: fetch for its imageInUrl in <head>`,
    );
    assert.ok(
      head.includes(`<link rel="preload" as="image" crossorigin href="${nft.thumbnailUrl}">`),
      `${id}: preload for its thumbnailUrl in <head>`,
    );
  }
});

test("B2: no OBH page preloads its imagein as fetch, which makes the engine's own fetch fail once the response is cached", () => {
  for (const id of pages) {
    const { head, nft } = read(id);
    assert.ok(!head.includes(`as="fetch"`), `${id}: no as="fetch" preload in <head>`);
    assert.ok(!head.includes(`href="${nft.imageInUrl}"`), `${id}: no <link> for its imageInUrl`);
  }
});

test("B8: each OBH page hides its still behind a flashing Loading... until the engine's first frame, and shows the still again only if the engine fails", () => {
  for (const id of pages) {
    const { head } = read(id);
    assert.ok(head.includes("#fallback { visibility: hidden; }"), `${id}: the still is hidden`);
    assert.ok(
      /#art:has\(#fallback\)::after \{ content: "Loading\.\.\."; [^}]*animation: obh-loading /.test(head),
      `${id}: a flashing Loading... while the still is in the page`,
    );
    assert.ok(head.includes("html.obh-failed #fallback { visibility: visible; }"), `${id}: the still shows when the engine fails`);
    // Same selector as the Loading rule plus the class, so it outranks it (#fallback in :has counts as an ID).
    assert.ok(
      head.includes("html.obh-failed #art:has(#fallback)::after { content: none; }"),
      `${id}: Loading... goes when the engine fails`,
    );
    assert.ok(
      head.includes(`"[epoch-one] loadNft failed"`) && head.includes(`"[epoch-one] mount threw"`),
      `${id}: the engine's two failure logs mark the page failed`,
    );
  }
});

test("B11–B13: each OBH page's Loading... is drawn like the action bar's TOOLS label: Courier New, uppercase, its size and spacing, its resting green", () => {
  for (const id of pages) {
    const { head } = read(id);
    const rule = head.match(/#art:has\(#fallback\)::after \{ content: "Loading\.\.\."; [^}]*\}/);
    assert.ok(rule, `${id}: the Loading... rule in <head>`);
    // The engine's own .tt-action-bar-btn text style, which TOOLS shows; #00ff80 alone is its pressed/active color.
    const html = readFileSync(join(process.cwd(), "public/obh", `${id}.html`), "utf8");
    assert.match(
      html,
      /\.tt-action-bar-btn\{[^}]*color:#00ff8099;font-family:Courier New,monospace;font-size:11px;text-transform:uppercase;letter-spacing:3px;/,
      `${id}: the engine's bar text is Courier New 11px, uppercase, 3px spacing, #00ff8099`,
    );
    assert.match(html, /@media\(max-width:480px\)\{[^@]*\.tt-action-bar-btn\{font-size:10px;letter-spacing:2px\}/, `${id}: and 10px, 2px spacing at 480px or less`);
    for (const decl of ['color: #00ff8099;', 'font-family: "Courier New", monospace;', "font-size: 11px;", "font-weight: 400;", "letter-spacing: 3px;", "text-transform: uppercase;"]) {
      assert.ok(rule![0].includes(decl), `${id}: Loading... has ${decl}`);
    }
    assert.ok(!rule![0].includes("font-smoothing"), `${id}: Loading... keeps the default font smoothing, as TOOLS does`);
    assert.ok(
      head.includes('@media (max-width: 480px) { #art:has(#fallback)::after { font-size: 10px; letter-spacing: 2px; } }'),
      `${id}: Loading... drops to 10px, 2px spacing at 480px or less, as TOOLS does`,
    );
    assert.ok(!head.includes("W95FA"), `${id}: no W95FA left in <head>`);
  }
  assert.ok(!existsSync(join(process.cwd(), "public/obh/w95fa.woff2")), "the unused W95FA copy is gone");
});

test("B9: each OBH page draws the action bar's System button disabled, unclickable, as the engine's tt-disabled does", () => {
  for (const id of pages) {
    const { head } = read(id);
    assert.ok(
      head.includes("#tt-btn-system { opacity: .35; pointer-events: none; }"),
      `${id}: #tt-btn-system disabled in <head>`,
    );
  }
});
