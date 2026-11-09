import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import WorkSelector, { Work } from "./WorkSelector";

const works: Work[] = [
  { id: "a", title: "dithered sky 11", thumb: "/a.jpg" },
  { id: "b", title: "DEGEN DOLLAR", thumb: "/b.jpg" },
];

test("B2: the Open bar sits under the grid, with a File name field showing the selected title beside Open", () => {
  const html = renderToStaticMarkup(<WorkSelector works={works} selectedId="b" onOpen={() => {}} />);
  const grid = html.indexOf('role="listbox"');
  const label = html.indexOf("File name:");
  const field = html.indexOf(">DEGEN DOLLAR</div>", label);
  const open = html.indexOf(">Open<", label);
  assert.ok(label > grid, "a File name: label after the grid");
  assert.ok(field > label, "a field showing the selected title after the label");
  assert.ok(open > field, "the Open button beside the field");
});

test("B10 (SCOTT-989): a thumb shows at its own shape, centered in the 96×96 icon box, not stretched square", () => {
  const html = renderToStaticMarkup(<WorkSelector works={works} onOpen={() => {}} />);
  const img = html.match(/<img [^>]*>/)![0];
  assert.ok(!/width="96"|height="96"|[" ]w-24|[" ]h-24/.test(img), "the img isn't forced to 96×96");
  assert.ok(/max-w-\[96px\]/.test(img) && /max-h-\[96px\]/.test(img), "the img fits within 96×96");
  assert.ok(/<div class="[^"]*w-24 h-24[^"]*items-center justify-center/.test(html), "a 96×96 box centers it");
});
