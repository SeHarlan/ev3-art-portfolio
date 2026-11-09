import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { ICONS, WINDOWS } from "../../context/WindowsProvider";
import * as obh from "./obh";
import { works } from "./obh";

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
