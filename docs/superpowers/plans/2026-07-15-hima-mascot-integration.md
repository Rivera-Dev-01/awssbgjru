# Hima Mascot Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the supplied Hima mascot images to the existing About and Members pages while preserving the current structure and ensuring readable desktop and mobile layouts.

**Architecture:** Keep the current page DOM and behavior intact. Replace only the existing Members hero image source, add decorative About mascot siblings in three existing sections, and place their breakpoint-specific sizing and positioning in a focused shared stylesheet. Assets are optimized WebP files with reserved aspect-ratio containers.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Sharp image optimization, Python assertion tests.

## Global Constraints

- Do not change any existing content, section order, navigation, card markup, Founder cards, or registration behavior.
- The Members hero mascot must retain the current visual slot and responsive size; only its image changes.
- Mascots are decorative: empty `alt`, `aria-hidden="true"`, and `pointer-events: none`.
- No mascot may overlap readable copy, interactive controls, or cards at 320, 375, 768, 1024, 1280, or 1536 pixels.
- Respect `prefers-reduced-motion`; do not add mandatory motion.

---

### Task 1: Prepare optimized mascot assets

**Files:**
- Create: `frontend/assets/about/mascot/hima-rocket.webp`
- Create: `frontend/assets/about/mascot/hima-rocket-hug.webp`
- Create: `frontend/assets/about/mascot/hima-rocket-point.webp`
- Create: `frontend/assets/members/Mascot/hima-representing.webp`
- Create: `scripts/prepare-mascot.js`
- Test: `tests/scripts/prepare-mascot.test.js`

**Interfaces:**
- Consumes the four approved PNG files from `/Users/keithalanspeirs/Downloads/`.
- Produces stable WebP paths used by the About and Members markup.

- [ ] **Step 1: Write the failing asset test**

```javascript
assert.deepEqual(expectedMascots, [
  "frontend/assets/about/mascot/hima-rocket.webp",
  "frontend/assets/about/mascot/hima-rocket-hug.webp",
  "frontend/assets/about/mascot/hima-rocket-point.webp",
  "frontend/assets/members/Mascot/hima-representing.webp"
]);
```

- [ ] **Step 2: Run the test and verify it fails because the assets do not yet exist**

Run: `node tests/scripts/prepare-mascot.test.js`

- [ ] **Step 3: Implement the one-purpose optimizer script**

```javascript
await sharp(inputPath)
  .webp({ quality: 88, alphaQuality: 100 })
  .toFile(outputPath);
```

- [ ] **Step 4: Run the optimizer and rerun the asset test**

Run: `node scripts/prepare-mascot.js && node tests/scripts/prepare-mascot.test.js`

- [ ] **Step 5: Commit the prepared assets**

```bash
git add scripts/prepare-mascot.js tests/scripts/prepare-mascot.test.js frontend/assets/about/mascot frontend/assets/members/Mascot/hima-representing.webp
git commit -m "feat: prepare Hima mascot assets"
```

### Task 2: Replace the Members hero mascot without changing its layout

**Files:**
- Modify: `frontend/pages/members.html:123`
- Test: `tests/frontend/members-mascot.test.js`

**Interfaces:**
- Consumes `../assets/members/Mascot/hima-representing.webp`.
- Produces the existing `.hero-mascot` element with unchanged classes and responsive CSS ownership.

- [ ] **Step 1: Write the failing markup test**

```javascript
assert.match(html, /class="hero-mascot"/);
assert.match(html, /src="\.\.\/assets\/members\/Mascot\/hima-representing\.webp"/);
assert.doesNotMatch(html, /Hima-Hero-Mascot\.webp/);
```

- [ ] **Step 2: Run the test and verify it fails on the old asset path**

Run: `node tests/frontend/members-mascot.test.js`

- [ ] **Step 3: Change only the hero image source**

```html
<img src="../assets/members/Mascot/hima-representing.webp" alt="" aria-hidden="true" class="hero-mascot" />
```

- [ ] **Step 4: Rerun the test and verify computed hero dimensions at desktop and mobile**

Run: `node tests/frontend/members-mascot.test.js`

- [ ] **Step 5: Commit the Members replacement**

```bash
git add frontend/pages/members.html tests/frontend/members-mascot.test.js
git commit -m "feat: replace Members hero mascot"
```

### Task 3: Insert readable About-page mascots in existing sections

**Files:**
- Modify: `frontend/pages/about.html`
- Create: `frontend/css/mascots.css`
- Modify: `frontend/pages/about.html` stylesheet imports
- Test: `tests/frontend/about-mascots.test.js`

**Interfaces:**
- Consumes the three About WebP assets from Task 1.
- Produces additive `.about-mascot-slot` figures scoped to the existing Vision/Mission, Goals, and Future sections.

- [ ] **Step 1: Write failing markup tests for the three approved placements**

```javascript
assert.match(html, /hima-rocket-point\.webp/);
assert.match(html, /hima-rocket-hug\.webp/);
assert.match(html, /hima-rocket\.webp/);
assert.equal((html.match(/about-mascot-slot/g) || []).length, 3);
```

- [ ] **Step 2: Run the test and verify it fails because the slots do not exist**

Run: `node tests/frontend/about-mascots.test.js`

- [ ] **Step 3: Add only decorative siblings to the existing sections**

```html
<figure class="about-mascot-slot about-mascot-slot--goals" aria-hidden="true">
  <img src="../assets/about/mascot/hima-rocket-hug.webp" alt="" loading="lazy" />
</figure>
```

- [ ] **Step 4: Add responsive slot rules without editing existing content layout**

```css
.about-mascot-slot { aspect-ratio: 1 / 1; pointer-events: none; }
.about-mascot-slot img { width: 100%; height: 100%; object-fit: contain; }
@media (max-width: 768px) {
  .about-mascot-slot { position: static; width: clamp(9rem, 52vw, 14rem); margin-inline: auto; }
}
```

- [ ] **Step 5: Rerun the markup test and test desktop/mobile content boundaries**

Run: `node tests/frontend/about-mascots.test.js`

- [ ] **Step 6: Commit the About additions**

```bash
git add frontend/pages/about.html frontend/css/mascots.css tests/frontend/about-mascots.test.js
git commit -m "feat: add responsive About mascots"
```

### Task 4: Verify visual safety and regression boundaries

**Files:**
- Test: `tests/frontend/about-mascots.test.js`
- Test: `tests/frontend/members-mascot.test.js`
- Test: `tests/frontend/founders-card-sizing.test.py`

**Interfaces:**
- Validates the completed markup, asset references, Founder-card sizing, and responsive visual behavior.

- [ ] **Step 1: Run the mascot and existing registration tests**

Run: `node tests/scripts/prepare-mascot.test.js && node tests/frontend/members-mascot.test.js && node tests/frontend/about-mascots.test.js && node tests/frontend/division-availability-markup.test.js && node tests/frontend/division-availability-behavior.test.js`

- [ ] **Step 2: Validate every target viewport in the browser**

Run at 320, 375, 768, 1024, 1280, and 1536 pixels. Confirm no horizontal scroll, text overlap, clipped mascot, content movement, or blocked controls.

- [ ] **Step 3: Run source and style checks**

Run: `git diff --check && .venv/bin/python tests/frontend/founders-card-sizing.test.py`

- [ ] **Step 4: Commit any boundary corrections found during viewport validation**

```bash
git add frontend/css/mascots.css tests/frontend
git commit -m "test: verify mascot layout boundaries"
```
