import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ICONS, WINDOWS } from "../../context/WindowsProvider";
import * as obh from "./obh";
import { About, works } from "./obh";

test("B3, replaced by SCOTT-994 B1: OBH's icon is its own fan-out of its thumbs in public/images", () => {
  assert.equal(ICONS[WINDOWS.OBH], "/images/obh-icon.png");
  assert.ok(existsSync(join(process.cwd(), "public", ICONS[WINDOWS.OBH])), "the icon file exists");
});

test("B4: each piece's title starts with its letter", () => {
  assert.deepEqual(
    works.map((w) => w.title),
    [
      "A: there must be something",
      "B: there is nothing else",
      "C: was it all a dream",
      "D: the abyss gazes back",
      "E: something was found",
    ],
  );
});

test("B5: Purchase opens the Manifold collection page, the same for every piece", () => {
  assert.equal(
    (obh as Record<string, unknown>).PURCHASE_URL,
    "https://manifold.xyz/@ev3/contract/124346608",
  );
});

test("B6: the About view is drawn inset, with the sunken bevel over the window's well", () => {
  const html = renderToStaticMarkup(<About visible onBack={() => {}} />);
  const root = html.match(/^<div class="([^"]*)"/)![1].split(" ");
  assert.ok(root.includes("classic-inset"), "the About root has classic-inset");
});

test("F3: the About view keeps its 16px padding under classic-inset's 2px", () => {
  // .classic-inset sets padding after @tailwind utilities, so plain p-4 loses; !p-4 wins, as in Footer.
  const html = renderToStaticMarkup(<About visible onBack={() => {}} />);
  const root = html.match(/^<div class="([^"]*)"/)![1].split(" ");
  assert.ok(root.includes("!p-4"), "the About root has !p-4");
  assert.ok(!root.includes("p-4"), "no plain p-4, which classic-inset overrides");
});

test("B7: the About copy is the series line, then the five lettered titles", () => {
  const html = renderToStaticMarkup(<About visible onBack={() => {}} />);
  const text = Array.from(html.matchAll(/<p[^>]*>([^<]*)<\/p>/g), (m) => m[1]);
  assert.deepEqual(text, [
    "on being human",
    "A series of personal photographs glitched to enshrine the emotions and moments they hold.",
    "A: there must be something",
    "B: there is nothing else",
    "C: was it all a dream",
    "D: the abyss gazes back",
    "E: something was found",
  ]);
});

// Width and height from a JPEG's start-of-frame marker.
const jpegSize = (path: string) => {
  const b = readFileSync(path);
  let i = 2;
  while (i < b.length) {
    const marker = b[i + 1];
    if (marker >= 0xc0 && marker <= 0xc3) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error(`no SOF in ${path}`);
};

test("B10: the selector thumbs keep their pieces' aspect, 54×96 portrait and C 96×54 landscape", () => {
  const sizes = works.map((w) => ({ id: w.id, ...jpegSize(join(process.cwd(), "public", w.thumb)) }));
  assert.deepEqual(sizes, [
    { id: "a", w: 54, h: 96 },
    { id: "b", w: 54, h: 96 },
    { id: "c", w: 96, h: 54 },
    { id: "d", w: 54, h: 96 },
    { id: "e", w: 54, h: 96 },
  ]);
});
