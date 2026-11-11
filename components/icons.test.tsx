import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { inflateSync } from "node:zlib";
import { ICONS, WINDOWS } from "../context/WindowsProvider";

const file = (path: string) => readFileSync(join(process.cwd(), "public", path));

const pngSize = (buf: Buffer) => ({ width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) });

const jpegSize = (buf: Buffer) => {
  for (let i = 2; i < buf.length; ) {
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xc2) return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error("no SOF marker");
};

// Share of fully transparent pixels in an 8-bit RGBA PNG (0 for any other kind of PNG).
const transparentShare = (buf: Buffer) => {
  const { width, height } = pngSize(buf);
  if (buf[24] !== 8 || buf[25] !== 6) return 0;
  const idat: Buffer[] = [];
  for (let i = 8; i < buf.length; ) {
    const len = buf.readUInt32BE(i);
    if (buf.toString("ascii", i + 4, i + 8) === "IDAT") idat.push(buf.subarray(i + 8, i + 8 + len));
    i += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const px = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const type = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const v = raw[y * (stride + 1) + 1 + x];
      const a = x >= 4 ? px[y * stride + x - 4] : 0;
      const b = y > 0 ? px[(y - 1) * stride + x] : 0;
      const c = x >= 4 && y > 0 ? px[(y - 1) * stride + x - 4] : 0;
      const p = a + b - c;
      const pred = [0, a, b, (a + b) >> 1, Math.abs(p - a) <= Math.abs(p - b) && Math.abs(p - a) <= Math.abs(p - c) ? a : Math.abs(p - b) <= Math.abs(p - c) ? b : c][type];
      px[y * stride + x] = (v + pred) & 0xff;
    }
  }
  let clear = 0;
  for (let i = 3; i < px.length; i += 4) if (px[i] === 0) clear++;
  return clear / (width * height);
};

const singles: [string, string][] = [
  [WINDOWS.CEASEFIRE, "/images/thumbs/ceasefire-ceasefire.jpg"],
  [WINDOWS.ISAAC, "/images/thumbs/isaac-exaltation-of-isaac.jpg"],
  [WINDOWS.PROGRESS, "/images/thumbs/progress-progress.jpg"],
  [WINDOWS.FLOWER, "/images/thumbs/flower-a-flower-blooms-in-autumn.jpg"],
];

const fans = [
  WINDOWS.REMEMBER,
  WINDOWS.SEASONS,
  WINDOWS.SINGLEPATH,
  WINDOWS.TERRA,
  WINDOWS.TUNEOUT,
  WINDOWS.GP,
  WINDOWS.R3MIX,
  WINDOWS.OBH,
];

test("B1.1: each single work's icon keeps its source's aspect, with no square crop, at most 56px", () => {
  for (const [key, thumb] of singles) {
    const icon = pngSize(file(ICONS[key]));
    const src = jpegSize(file(thumb));
    assert.equal(Math.max(icon.width, icon.height), 56, `${key} icon's longest side`);
    assert.ok(
      Math.abs(icon.width / icon.height - src.width / src.height) < 0.05,
      `${key} icon is ${icon.width}×${icon.height}, its source ${src.width}×${src.height}`,
    );
  }
});

test("B1.2–4: galleries, 3xGP, R3MIX and on being human get a fan-out icon: a PNG with clear space around its cards", () => {
  for (const key of fans) {
    assert.match(ICONS[key], /^\/images\/[a-z0-9-]+-icon\.png$/, `${key} icon path`);
    const share = transparentShare(file(ICONS[key]));
    assert.ok(share > 0.1, `${key} icon has ${(share * 100).toFixed(0)}% transparent pixels`);
  }
});

test("B3: the Settings window is named My Computer, under the same SETTINGS key, with the computer icon", () => {
  assert.equal(WINDOWS.SETTINGS, "My Computer");
  assert.equal(ICONS[WINDOWS.SETTINGS], "/svg/my-computer-icon.svg");
  assert.match(file(ICONS[WINDOWS.SETTINGS]).toString(), /viewBox="0 0 32 32" shape-rendering="crispEdges"/);
});
