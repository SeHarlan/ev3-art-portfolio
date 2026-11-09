import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const pages = ["a", "b", "c", "d", "e"];

test("B1: each OBH page's <head> preloads its engine buffers, the imagein as fetch and the thumb as image, both crossorigin", () => {
  for (const id of pages) {
    const html = readFileSync(join(process.cwd(), "public/obh", `${id}.html`), "utf8");
    const head = html.slice(0, html.indexOf("</head>"));
    const nft = JSON.parse(html.match(/window\.__NFT__ = (\{.*?\});/)![1]);
    assert.ok(
      head.includes(`<link rel="preload" as="fetch" crossorigin href="${nft.imageInUrl}">`),
      `${id}: preload for its imageInUrl in <head>`,
    );
    assert.ok(
      head.includes(`<link rel="preload" as="image" crossorigin href="${nft.thumbnailUrl}">`),
      `${id}: preload for its thumbnailUrl in <head>`,
    );
  }
});
