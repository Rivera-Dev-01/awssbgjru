const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "../..");
const office = fs.readFileSync(path.join(root, "frontend/pages/office.html"), "utf8");
const skillbuilder = fs.readFileSync(path.join(root, "frontend/pages/skillbuilder.html"), "utf8");

test("full office divisions are marked and badged", () => {
  for (const name of ["Marketing", "Media"]) {
    const pattern = new RegExp(`data-division="${name}"[^>]*data-availability="full"[\\s\\S]*?FULL`);
    assert.match(office, pattern);
  }
});

test("only Software & Web Dev. is full in Skill Builder registration", () => {
  assert.match(skillbuilder, /data-division="Software & Web Dev\."[^>]*data-availability="full"[\s\S]*?FULL/);
  assert.doesNotMatch(skillbuilder, /data-division="Security"/);
  assert.doesNotMatch(skillbuilder, /data-division="Advanced Network & Infrastructure"/);
});

test("both pages load shared availability assets and expose live status", () => {
  for (const html of [office, skillbuilder]) {
    assert.match(html, /division-availability\.css/);
    assert.match(html, /division-availability\.js/);
    assert.match(html, /role="status"/);
    assert.match(html, /aria-live="polite"/);
  }
});
