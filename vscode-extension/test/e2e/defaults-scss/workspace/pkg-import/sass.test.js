/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require("node:assert");
const { test } = require("node:test");
const sass = require("sass");

test("noscope", () => {
  const css = sass.compile("src/styles.scss", {
    importers: [new sass.NodePackageImporter()],
  });
  assert.ok(css);
  assert.match(css.css, /color: green/);
});

test("scope", () => {
  const css = sass.compile("src/scoped.scss", {
    importers: [new sass.NodePackageImporter()],
  });
  assert.ok(css);
  assert.match(css.css, /color: green/);
});
