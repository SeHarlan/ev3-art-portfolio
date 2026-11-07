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
