import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { inflateSync } from "node:zlib";
import { ICONS, WINDOWS } from "../context/WindowsProvider";
import { ART_KEYS, FOLDER_ICON } from "../data/groups";

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

test("B1.1: each single work's icon keeps its source's aspect, with no square crop, 192px on its longest side (SCOTT-995 B6)", () => {
  for (const [key, thumb] of singles) {
    const icon = pngSize(file(ICONS[key]));
    const src = jpegSize(file(thumb));
    assert.equal(Math.max(icon.width, icon.height), 192, `${key} icon's longest side`);
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

// The EV3 logos double as techtonic's and Maurer Expanse's icons and are also the Start button's and Welcome's, so they stay as they are.
const SHARED_LOGOS = ["/images/small-logo.png", "/images/small-alt-logo.png"];

test("B6: every work's raster icon is 192px on its longest side, 2× the selector's 96px slot", () => {
  const sizes = ART_KEYS.filter((key) => ICONS[key].endsWith(".png") && !SHARED_LOGOS.includes(ICONS[key]))
    .map((key) => { const { width, height } = pngSize(file(ICONS[key])); return [key, Math.max(width, height)] as const; });
  assert.equal(sizes.length, 16);
  assert.deepEqual(sizes.filter(([, side]) => side !== 192), []);
  // An SVG with no width and height shrinks to 0×0 in the selector's shrink-to-fit cell.
  for (const key of ART_KEYS.filter((k) => ICONS[k].endsWith(".svg"))) {
    assert.match(file(ICONS[key]).toString(), /^<svg [^>]*width="192" height="192"/, `${key} icon's intrinsic size`);
  }
});

test("B3: the Settings window is named My Computer, under the same SETTINGS key, with the computer icon", () => {
  assert.equal(WINDOWS.SETTINGS, "My Computer");
  assert.equal(ICONS[WINDOWS.SETTINGS], "/svg/my-computer-icon.svg");
  assert.match(file(ICONS[WINDOWS.SETTINGS]).toString(), /viewBox="0 0 32 32" shape-rendering="crispEdges"/);
});

// The horizontal span [left, right) of an SVG's <rect>s.
const rectSpan = (svg: string) => {
  const rects = Array.from(svg.matchAll(/<rect x="(\d+)" y="\d+" width="(\d+)"/g), (m) => [Number(m[1]), Number(m[1]) + Number(m[2])]);
  return { left: Math.min(...rects.map(([l]) => l)), right: Math.max(...rects.map(([, r]) => r)) };
};

test("B2: the Find icon's art sits one cell left of where it was, centered on the 16-wide grid", () => {
  const { left, right } = rectSpan(file(ICONS[WINDOWS.FIND]).toString());
  assert.equal((left + right) / 2, 7.5, `art spans x ${left}–${right}`);
});

test("B1: the folder icon is the yellow/gray dithered design, with no solid yellow runs", () => {
  const svg = file(FOLDER_ICON).toString();
  const yellow = Array.from(svg.matchAll(/width="(\d+)" height="1" fill="#ffff00"/g), (m) => Number(m[1]));
  const gray = svg.match(/fill="#c0c0c0"/g) ?? [];
  assert.ok(yellow.length > 100 && gray.length > 100, `${yellow.length} yellow and ${gray.length} gray cells`);
  assert.deepEqual(yellow.filter((w) => w > 1), [], "yellow runs wider than one cell");
});
