import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { ICONS, WINDOWS } from "../../context/WindowsProvider";

test("B3: OBH's icon is its own person icon in public/svg", () => {
  assert.equal(ICONS[WINDOWS.OBH], "/svg/obh-icon.svg");
  assert.ok(existsSync(join(process.cwd(), "public", ICONS[WINDOWS.OBH])), "the icon file exists");
});
