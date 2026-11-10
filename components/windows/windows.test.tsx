import "../testAlias";
import assert from "node:assert/strict";
import { test } from "node:test";
import { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ZEUMS } from "../../data/zeums";
import MediaWindow from "../MediaWindow";
import DUETWindow from "./DUET";
import FindWindow from "./Find";
import InTheBeginningWindow from "./InTheBeginning";
import MaurerWindow from "./Maurer";
import NoiseWindow from "./Noise";
import OnBeingHumanWindow from "./OnBeingHuman";
import R3MIXWindow from "./R3MIX";
import RememberWindow from "./Remember";
import STEV3Window from "./STEV3";
import SomeDaysWindow from "./SomeDays";

const html = (el: ReactElement) => renderToStaticMarkup(el);
// A menu item renders its first letter underlined, then the rest of its label (then any dropdown).
const menuLabels = (markup: string) =>
  Array.from(markup.matchAll(/<button class="ev3-menu-item[^"]*"><span class="underline">(.)<\/span>([^<]*)/g), (m) => m[1] + m[2]);

const windows: Record<string, () => string> = {
  "Tune Out (gallery)": () => html(<MediaWindow windowKey="Tune Out" data={ZEUMS.TUNEOUT} />),
  "CEASEFIRE (single)": () => html(<MediaWindow windowKey="CEASEFIRE" data={ZEUMS.CEASEFIRE} />),
  "remember.exe": () => html(<RememberWindow />),
  R3MIX: () => html(<R3MIXWindow />),
  "3xGP": () => html(<STEV3Window />),
  "on being human": () => html(<OnBeingHumanWindow />),
  DUET: () => html(<DUETWindow />),
  "it's just noise": () => html(<NoiseWindow />),
  "Maurer Expanse": () => html(<MaurerWindow />),
  ITB: () => html(<InTheBeginningWindow />),
  "some days": () => html(<SomeDaysWindow />),
};
const selectorWindows = ["Tune Out (gallery)", "remember.exe", "R3MIX", "3xGP", "on being human"];

test("B2: the content box's scroll wrapper is positioned, so absolutely placed content sits inside the inset bevel instead of covering it", () => {
  const markup = windows["CEASEFIRE (single)"]();
  const wrapper = markup.match(/<div class="classic-inset[^"]*"[^>]*><div class="([^"]*)"/);
  assert.ok(wrapper, "a classic-inset content box with a wrapper div");
  assert.match(wrapper![1], /(^| )relative( |$)/, `wrapper classes: ${wrapper![1]}`);
});

test("B3: an open work's video shows the shared pulsing loading... until it can play", () => {
  const markup = windows["CEASEFIRE (single)"]();
  assert.ok(/<video /.test(markup), "CEASEFIRE renders its video");
  assert.ok(/class="[^"]*animate-pulse[^"]*"[^>]*>loading\.\.\.</.test(markup), "a pulsing loading... is shown");
});

test("B4: every selector window's menu says Select Piece, never Choose <x>", () => {
  for (const name of selectorWindows) {
    const labels = menuLabels(windows[name]());
    assert.ok(labels.includes("Select Piece"), `${name}: ${labels.join(", ")}`);
    assert.ok(!labels.some((l) => l.startsWith("Choose")), `${name}: ${labels.join(", ")}`);
  }
});

test("B5: every window's menu runs Select Piece, Seed, Refresh, About, Purchase, skipping what it lacks", () => {
  const order = ["Select Piece", "Seed", "Refresh", "About", "Purchase"];
  for (const [name, render] of Object.entries(windows)) {
    const labels = menuLabels(render()).filter((l) => order.includes(l));
    const sorted = [...labels].sort((a, b) => order.indexOf(a) - order.indexOf(b));
    assert.deepEqual(labels, sorted, `${name}: ${labels.join(", ")}`);
  }
});

test("B6: some days shows its zeums video from the Blob store, not the interactive sketch", () => {
  const markup = windows["some days"]();
  const video = markup.match(/<video [^>]*>/)?.[0];
  assert.ok(video, "some days renders a video");
  assert.ok(/src="https:\/\/k4xw43ajr4eh6re3\.public\.blob\.vercel-storage\.com\/somedays\/[^"]+\.mp4"/.test(video!), `video: ${video}`);
});

test("B7: an open work's video stays transparent until it's ready, so no buffering frames show", () => {
  const video = windows["CEASEFIRE (single)"]().match(/<video [^>]*>/)?.[0];
  assert.ok(video, "CEASEFIRE renders its video");
  assert.match(video!, /class="[^"]*\bopacity-0\b/, `video: ${video}`);
});

test("B8: a Win95 Play button with a play icon, shown only once the video is ready", () => {
  let PlayButton: ((props: { onClick: () => void }) => ReactElement) | undefined;
  try {
    PlayButton = require("../PlayButton").default;
  } catch {
    PlayButton = undefined;
  }
  assert.ok(PlayButton, "components/PlayButton exists");
  const Button = PlayButton;
  const button = html(<Button onClick={() => {}} />);
  assert.match(button, /<button [^>]*class="[^"]*\bclassic-button\b/, button);
  assert.match(button, /<svg[^>]*>.*<\/svg>.*Play/, button);
  assert.ok(!/>Play</.test(windows["CEASEFIRE (single)"]()), "no Play button before the video is ready");
});

test("F7: a work's image or video that isn't ready yet takes no clicks, so clicking loading... can't play the hidden video", () => {
  const video = windows["CEASEFIRE (single)"]().match(/<video [^>]*>/)?.[0];
  assert.ok(video, "CEASEFIRE renders its video");
  assert.match(video!, /class="[^"]*\bpointer-events-none\b/, `video: ${video}`);
  const work = ZEUMS.SEASONS.items[0];
  const image = html(<MediaWindow windowKey="CEASEFIRE" data={{ ...ZEUMS.CEASEFIRE, items: [work] }} />)
    .match(/<img [^>]*>/g)
    ?.find((tag) => tag.includes(`src="${work.src}"`));
  assert.ok(image, "a single image work renders its image");
  assert.match(image!, /class="[^"]*\bpointer-events-none\b/, `image: ${image}`);
});

test("F9: a work's video that isn't ready yet takes no keyboard focus, so Tab and Space can't play it hidden", () => {
  const video = windows["CEASEFIRE (single)"]().match(/<video [^>]*>/)?.[0];
  assert.ok(video, "CEASEFIRE renders its video");
  assert.match(video!, /\btabindex="-1"/, `video: ${video}`);
});

test("F3: Find's Randomize button takes clicks while Find isn't the active window, so each click opens a work", () => {
  // An inactive window's content wrapper is pointer-events-none; Randomize opens a work on top, so Find is inactive.
  const button = html(<FindWindow />).match(/<button [^>]*class="([^"]*)"[^>]*><span>Randomize<\/span>/);
  assert.ok(button, "Find renders a Randomize button");
  assert.ok(button![1].split(" ").includes("pointer-events-auto"), `button classes: ${button![1]}`);
});
