import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
