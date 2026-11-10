import assert from "node:assert/strict";
import { test } from "node:test";
import { WINDOWS } from "../context/WindowsProvider";
import { ART_KEYS, groupsFor, hasTags, matchesSearch } from "../data/groups";

const asObject = (groups: { name: string; keys: string[] }[]) =>
  groups.map(({ name, keys }) => [name, keys] as const);

test("Year: folders 2026→2022, each work in exactly one, in window order", () => {
  assert.deepEqual(asObject(groupsFor("year")), [
    ["2026", ["techtonic", "on being human", "Sk3tch"]],
    ["2025", ["CEASEFIRE", "remember.exe", "s34s0ns", "Exaltation of Isaac"]],
    ["2024", ["3xGP", "ITB", "R3MIX", "some days"]],
    ["2023", ["DUET", "it's just noise", "Maurer Expanse", '"Progress"', "A Single Path", "T3RRA"]],
    ["2022", ["A Flower Blooms in Autumn", "Tune Out"]],
  ]);
  const all = groupsFor("year").flatMap(g => g.keys);
  assert.equal(all.length, ART_KEYS.length);
  assert.deepEqual(new Set(all), new Set(ART_KEYS));
});

test("Media: code, video, image, audio, with multi-tag works in every folder", () => {
  assert.deepEqual(asObject(groupsFor("media")), [
    ["code", ["3xGP", "DUET", "it's just noise", "ITB", "R3MIX", "Maurer Expanse", "techtonic", "on being human", "Sk3tch", "remember.exe", '"Progress"']],
    ["video", ["some days", "CEASEFIRE", "Exaltation of Isaac", "T3RRA", "A Flower Blooms in Autumn", "Tune Out"]],
    ["image", ["s34s0ns", "A Single Path", "T3RRA"]],
    ["audio", ["DUET", "A Flower Blooms in Autumn", "Tune Out"]],
  ]);
});

test("Experience: Interactive, Generative, Fixed, each work in exactly one", () => {
  assert.deepEqual(asObject(groupsFor("experience")), [
    ["Interactive", ["DUET", "ITB", "Maurer Expanse", "Sk3tch", "remember.exe", '"Progress"']],
    ["Generative", ["3xGP", "it's just noise", "R3MIX", "techtonic", "on being human"]],
    ["Fixed", ["some days", "CEASEFIRE", "s34s0ns", "Exaltation of Isaac", "A Single Path", "T3RRA", "A Flower Blooms in Autumn", "Tune Out"]],
  ]);
});

test("every art window has tags; Introduction, Settings and Find don't and aren't art", () => {
  assert.equal(ART_KEYS.length, 19);
  for (const key of ART_KEYS) assert.ok(hasTags(key), key);
  for (const key of [WINDOWS.HOME, WINDOWS.SETTINGS, WINDOWS.FIND]) {
    assert.ok(!hasTags(key), key);
    assert.ok(!ART_KEYS.includes(key), key);
  }
  assert.deepEqual(ART_KEYS, Object.values(WINDOWS).filter(k => hasTags(k)));
});

test("matchesSearch: case-insensitive substring of the name or any tag", () => {
  const find = (q: string) => ART_KEYS.filter(k => matchesSearch(k, q));
  assert.equal(find("").length, 19);
  assert.deepEqual(find("audio"), ["DUET", "A Flower Blooms in Autumn", "Tune Out"]);
  assert.deepEqual(find("AUDIO"), find("audio"));
  assert.deepEqual(find("maur"), ["Maurer Expanse"]);
  assert.deepEqual(find("2026"), ["techtonic", "on being human", "Sk3tch"]);
  assert.deepEqual(find("xyz"), []);
  assert.deepEqual(find("fixed"), groupsFor("experience").find(g => g.name === "Fixed")!.keys);
  assert.deepEqual(find("IMAGE"), ["s34s0ns", "A Single Path", "T3RRA"]);
});
