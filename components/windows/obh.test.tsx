import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ICONS, WINDOWS } from "../../context/WindowsProvider";
import * as obh from "./obh";
import { About, works } from "./obh";

test("B3: OBH's icon is its own person icon in public/svg", () => {
  assert.equal(ICONS[WINDOWS.OBH], "/svg/obh-icon.svg");
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
