const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "../..");
const office = fs.readFileSync(path.join(root, "frontend/pages/office.html"), "utf8");
const skillbuilder = fs.readFileSync(path.join(root, "frontend/pages/skillbuilder.html"), "utf8");
const availabilityCss = fs.readFileSync(path.join(root, "frontend/css/division-availability.css"), "utf8");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function openingTag(markup) {
  const match = markup.match(/^<[a-z][^>]*>/i);
  assert.ok(match, `Expected markup to start with an opening tag: ${markup}`);
  return match[0];
}

function attribute(markup, name) {
  const pattern = new RegExp(`\\s${escapeRegExp(name)}="([^"]*)"`);
  return openingTag(markup).match(pattern)?.[1] ?? null;
}

function hasAttribute(markup, name) {
  const pattern = new RegExp(`\\s${escapeRegExp(name)}(?=\\s|=|>)`);
  return pattern.test(openingTag(markup));
}

function hasClass(markup, className) {
  return (attribute(markup, "class") || "").split(/\s+/).includes(className);
}

function elements(html, tagName) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, "gi");
  return html.match(pattern) || [];
}

function buttonsWithClass(html, className) {
  return elements(html, "button").filter((button) => hasClass(button, className));
}

function fullButtons(html, className) {
  return buttonsWithClass(html, className).filter((button) => attribute(button, "data-availability") === "full");
}

function badgeFor(button) {
  const badges = elements(button, "span").filter((span) => hasClass(span, "availability-badge"));
  assert.equal(badges.length, 1, "Each full button must contain exactly one availability badge");
  return badges[0];
}

function textContent(markup) {
  return markup.replace(/<[^>]+>/g, "").trim();
}

function assertFullButton(button, divisionName) {
  assert.equal(attribute(button, "data-division"), divisionName);
  assert.equal(attribute(button, "data-availability"), "full");
  assert.equal(attribute(button, "aria-disabled"), "true");
  assert.equal(hasAttribute(button, "disabled"), false, "Full buttons must remain keyboard focusable");

  const badge = badgeFor(button);
  assert.equal(attribute(badge, "aria-hidden"), "true");
  assert.equal(textContent(badge), "FULL", "Badge must contain only the exact text FULL and no emoji");
}

function statusRegion(html, className) {
  const region = html.match(/<div\b[^>]*>/g)?.find((tag) => hasClass(tag, className));
  assert.ok(region, `Expected .${className} status region`);
  return region;
}

function cssRule(selector) {
  const selectorIndex = availabilityCss.indexOf(selector);
  assert.notEqual(selectorIndex, -1, `Expected CSS selector ${selector}`);
  const openBrace = availabilityCss.indexOf("{", selectorIndex);
  const closeBrace = availabilityCss.indexOf("}", openBrace);
  assert.ok(openBrace > selectorIndex && closeBrace > openBrace, `Expected complete CSS rule for ${selector}`);
  return availabilityCss.slice(openBrace + 1, closeBrace);
}

function cssProperty(rule, property) {
  const pattern = new RegExp(`(?:^|\\n)\\s*${escapeRegExp(property)}\\s*:\\s*([\\s\\S]*?);`);
  const value = rule.match(pattern)?.[1].trim();
  assert.ok(value, `Expected CSS property ${property}`);
  return value;
}

function normalizedHex(color) {
  const value = color.toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(value)) return value;
  if (/^#[0-9a-f]{3}$/.test(value)) {
    return `#${[...value.slice(1)].map((digit) => digit.repeat(2)).join("")}`;
  }
  throw new Error(`Expected a hex color, received ${color}`);
}

function composite(foreground, background, alpha) {
  const foregroundHex = normalizedHex(foreground);
  const backgroundHex = normalizedHex(background);
  const channels = [1, 3, 5].map((index) => {
    const front = Number.parseInt(foregroundHex.slice(index, index + 2), 16);
    const back = Number.parseInt(backgroundHex.slice(index, index + 2), 16);
    return Math.round(front * alpha + back * (1 - alpha));
  });
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function relativeLuminance(color) {
  const hex = normalizedHex(color);
  const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
  const linear = channels.map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

test("Office exposes exactly two semantic full-team buttons", () => {
  const buttons = fullButtons(office, "office-pill");
  assert.equal(buttons.length, 2);
  assertFullButton(buttons[0], "Marketing");
  assertFullButton(buttons[1], "Media");
});

test("Skill Builder exposes exactly one semantic full-team button", () => {
  const buttons = fullButtons(skillbuilder, "sb-pill");
  assert.equal(buttons.length, 1);
  assertFullButton(buttons[0], "Software & Web Dev.");

  const divisions = buttonsWithClass(skillbuilder, "sb-pill").map((button) => attribute(button, "data-division"));
  assert.deepEqual(divisions, ["Software & Web Dev.", "Data Analyst", "Cloud Computing", "Machine Learning & AI"]);
  assert.equal(divisions.includes("Security"), false);
  assert.equal(divisions.includes("Advanced Network & Infrastructure"), false);
});

test("both pages load shared assets and expose the correct live status region", () => {
  for (const [html, errorClass] of [[office, "office-error"], [skillbuilder, "sb-error"]]) {
    assert.match(html, /division-availability\.css/);
    assert.match(html, /division-availability\.js/);
    const region = statusRegion(html, errorClass);
    assert.equal(attribute(region, "role"), "status");
    assert.equal(attribute(region, "aria-live"), "polite");
  }
});

test("full pill styling preserves the saturated badge color", () => {
  const fullRule = cssRule('.office-pill[data-availability="full"]');
  assert.doesNotMatch(fullRule, /\bfilter\s*:/, "Ancestor filters alter the rendered badge color");

  const badgeRule = cssRule(".availability-badge {");
  assert.equal(cssProperty(badgeRule, "background"), "#b42318");
  assert.equal(cssProperty(badgeRule, "color"), "#fff");
  assert.doesNotMatch(availabilityCss, /\bfilter\s*:/, "No filter workaround should be needed on the badge");
  assert.ok(contrastRatio("#fff", "#b42318") >= 4.5);
});

test("muted full pill labels meet WCAG AA against the rendered surface", () => {
  const fullRule = cssRule('.office-pill[data-availability="full"]');
  const background = cssProperty(fullRule, "background");
  const foreground = cssProperty(fullRule, "color");
  const overlay = cssProperty(fullRule, "box-shadow").match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  assert.ok(overlay, "Expected the full-pill inset overlay color");

  const overlayColor = `#${overlay.slice(1, 4).map((channel) => Number(channel).toString(16).padStart(2, "0")).join("")}`;
  const renderedSurface = composite(overlayColor, background, Number(overlay[4]));
  const ratio = contrastRatio(foreground, renderedSurface);
  const hoverRule = cssRule('.office-pill[data-availability="full"]:hover');

  assert.equal(renderedSurface, "#d6d9de");
  assert.equal(cssProperty(hoverRule, "background"), background);
  assert.equal(cssProperty(hoverRule, "color"), foreground);
  assert.ok(ratio >= 4.5, `Expected at least 4.5:1 contrast against ${renderedSurface}, received ${ratio.toFixed(2)}:1`);
});
