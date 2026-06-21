# Cloud Expertise Staircase Rebuild Design Spec

This document defines the approved rebuild of the lower Cloud Expertise staircase section on the desktop Home page. The redesign keeps the three-step structure but replaces the flat blue presentation with a cinematic forest scene, stronger card hierarchy, and deeper integration between the cards and the environment.

---

## 1. Objectives & Scope
- **Target surface**: Desktop Home page only in [`frontend/pages/landing-page.html`](/Users/keithalanspeirs/Documents/AWS/AWS-Website/frontend/pages/landing-page.html) and [`frontend/css/landing-page-desktop.css`](/Users/keithalanspeirs/Documents/AWS/AWS-Website/frontend/css/landing-page-desktop.css).
- **Viewport scope**: Desktop only for widths `>= 769px`.
- **Primary goal**: Rebuild the lower Cloud Expertise three-card area so it feels cinematic, premium, and clearly staircase-shaped while keeping all content editable in HTML/CSS.
- **Out of scope**:
  - Mobile layout changes
  - Events, Sponsors, and Footer redesign
  - Rewriting the Cloud Expertise title hole treatment that was already tuned in the upper part of the section, except where the staircase background needs to visually connect to it

---

## 2. Approved Creative Direction

The approved direction is:
- **Full cinematic rebuild**
- **Deep integration** between cards and environment
- **Diagonal progression dominates**
- **Balanced drama** between readability and atmosphere
- **Stone-and-glass cards**
- **Subtle Cloud Expertise identity** preserved through cool-blue light influence
- **Waterfall behind the center card**

In practice, this means the section should feel like a forest chamber inside the larger Cloud Expertise experience rather than a separate unrelated block. The center card remains the hero, the left and right cards support a clear upper-left to lower-right progression, and the environment should visibly wrap around the cards without covering readable text.

---

## 3. Section Composition

### 3.1 Background
- Replace the entire current staircase-area background treatment with `Staircase_BG.png`.
- The artwork must fill the full width of the staircase area edge-to-edge with no exposed side bars.
- The crop should be responsive and art-directed:
  - the waterfall sits behind the center `Fueling Tomorrow's Tech Leaders` card
  - the warm sunlight remains visible around the middle card
  - darker forest mass remains visible on the upper-left side so the diagonal staircase still reads clearly
- The background should not look stretched. Use cover-style cropping and positioning rather than forcing image distortion.

### 3.2 Staircase hierarchy
- Preserve a distinct three-step silhouette.
- The visual read should move diagonally from:
  1. smaller upper-left `What We Do`
  2. dominant center `Fueling Tomorrow's Tech Leaders`
  3. substantial lower-right `What We Offer`
- The center card should remain the largest and strongest focal point.
- The right card can be larger than the left card, but it must still read as a supporting step, not a second hero.

### 3.3 Environmental continuity
- Keep subtle cool-blue influence in overlays, glass tint, and highlight color so the staircase area still belongs to Cloud Expertise.
- Preserve the green bush transition line between `Who Are We` and `Cloud Expertise`.
- Add a faint foliage echo inside the staircase section for continuity, but keep it atmospheric rather than busy.

---

## 4. Card Material & Styling

### 4.1 Material language
- Replace the current flat blue-glass look with a **stone-and-glass** treatment:
  - darker stone-like outer shell
  - frosted inner reading panel
  - subtle blue reflections to tie back to Cloud Expertise
  - warmer highlight pickup from the forest light source
- Cards should feel embedded in the scene, not pasted on top of it.

### 4.2 Readability rules
- Maintain clear readable zones for all titles, body text, and bullets.
- Foliage overlap must never cover:
  - headings
  - paragraph copy
  - list bullets or list text
- Background drama should stay strongest around the edges and behind the outer shell, not in the text core.

### 4.3 Rooted bottom-edge treatment
- Use `GreenBushEdges.png` as a decorative bottom-edge blend on the cards.
- The foliage should visibly climb into the lower portion of each card, but only in a controlled masked band.
- The effect should make the cards feel rooted into the forest floor.
- The integration should be strongest on the lower-right and center cards, lighter on the upper-left card to preserve the staircase hierarchy.

---

## 5. Layout Intent Per Card

### 5.1 What We Do
- Position: upper-left step
- Role: visual lead-in
- Size: smallest of the three
- Treatment:
  - premium but restrained
  - readable against a slightly darker forest pocket
  - lighter foliage integration than the lower cards

### 5.2 Fueling Tomorrow's Tech Leaders
- Position: center hero platform
- Role: main focal point
- Size: largest card
- Treatment:
  - placed directly over the waterfall/light focal area
  - strongest depth, glow, and compositional emphasis
  - clearest readability buffer because it carries the longest text block

### 5.3 What We Offer
- Position: lower-right step
- Role: final step in the diagonal progression
- Size: larger than `What We Do`, smaller or visually lighter than the center hero
- Treatment:
  - stronger rooted foliage integration
  - enough visual weight to complete the staircase
  - list formatting must remain easy to scan

---

## 6. Implementation Shape

### 6.1 Markup
- Keep content editable in HTML.
- Reuse the existing three-card structure inside `.cloud-expertise-group`.
- Small wrapper additions are allowed if needed for:
  - background layering
  - card shell vs inner panel separation
  - foliage edge overlays

### 6.2 CSS
- Most of the rebuild should happen in `landing-page-desktop.css`.
- The staircase area should gain:
  - a dedicated full-section forest background layer
  - stronger z-index separation between background, atmosphere, card shells, inner panels, and foliage edges
  - explicit positioning for the three-step composition
  - responsive cover cropping that avoids visible side bars

### 6.3 Assets
- The implementation will need local workspace copies of:
  - `Staircase_BG.png`
  - `GreenBushEdges.png`
- These should be placed in the landing-page assets area before wiring the final CSS.

---

## 7. Visual Acceptance Criteria
- The staircase area reads as a cinematic forest scene, not a flat blue card grid.
- The center hero card clearly dominates the composition.
- The three cards still form a recognizable staircase from upper-left to lower-right.
- The waterfall is visually centered behind the middle card.
- The section fills edge-to-edge with no visible blue side bars.
- The bottom foliage treatment makes the cards feel integrated into the environment.
- The green bush transition line remains present between `Who Are We` and `Cloud Expertise`.
- All card text remains clearly readable and editable.
- The section still feels connected to Cloud Expertise through subtle cool-blue lighting influence.

---

## 8. Verification Notes
- Verify at desktop widths including `1440px` and at least one wider viewport.
- Check that no foliage overlaps readable copy.
- Check that background cropping still looks intentional when scaling the 1920px virtual canvas.
- Check that the center card remains the focal point after scroll scaling.
- Confirm mobile layout remains unchanged.
