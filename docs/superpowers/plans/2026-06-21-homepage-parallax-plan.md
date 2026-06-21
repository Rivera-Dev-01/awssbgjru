# Implementation Plan: Homepage Desktop Parallax & Assets Revision

This document outlines the step-by-step implementation plan to revise the desktop Home page with a custom-asset parallax scrolling experience.

---

## Phase 1: Asset Integration in HTML
**Objective**: Update `landing-page.html` to include the transition layers and leafy frame in the desktop parallax markup.

### Steps:
1. Open [`landing-page.html`](file:///Users/keithalanspeirs/documents/aws/aws-website/frontend/pages/landing-page.html).
2. Inside `.desktop-parallax-home`, add the transition assets:
   - Add `.transition-clouds-overlay` at the bottom of the Hero section.
   - Add `.transition-leaves-overlay` at the bottom of the "Who Are We" section.
3. In the "Who Are We" section:
   - Apply the background `Who_Are_WE_BG.png` to `.who-are-we-group` in CSS (Phase 2).
4. In the "Cloud Expertise" section:
   - Add the foreground image element: `<img src="../assets/landing-page/CloudExperience_Top_layer.png" class="exp-leafy-frame-top">`.
   - Update the cards (`.exp-card-what-we-do`, `.exp-card-fueling`, `.exp-card-what-we-offer`) to use a center-aligned wrapper `.exp-centered-cards-container` to ensure they scroll inside the foliage center opening.
   - Add the class `.reveal-element` to all text blocks and cards to prepare them for scroll-reveal entry animations.

---

## Phase 2: CSS Styles & Parallax speed definitions
**Objective**: Build out the styling, speed properties, and keyframe animations in `landing-page-desktop.css`.

### Steps:
1. Open [`landing-page-desktop.css`](file:///Users/keithalanspeirs/documents/aws/aws-website/frontend/css/landing-page-desktop.css).
2. **Transition Overlays**:
   - Style `.transition-clouds-overlay` with absolute position at `top: 938px` using `Transition_Clouds.png`. Map its parallax scroll translation using `--scroll-top`.
   - Style `.transition-leaves-overlay` at `top: 1750px` using `Transition_Leaves.png`.
3. **Backgrounds**:
   - Style `.who-are-we-group` using `Who_Are_WE_BG.png` as its background image. Map its parallax translation speed to `0.2` (scrolls at 80% viewport speed).
4. **Cloud Expertise Foreground**:
   - Style `.exp-leafy-frame-top` as an absolute foreground layer at `z-index: 6`, width `1920px`, height `2163px`, pointer-events `none`. Map its parallax speed to `0.15` (scrolls at 85% viewport speed).
5. **Center-Stacked Cards**:
   - Style `.exp-centered-cards-container` with display `flex`, flex-direction `column`, align-items `center`, width `100%`, and set absolute top coordinates for each card inside so they slide vertically behind the leafy frame opening.
6. **Keyframe Animations**:
   - Write `@keyframes driftClouds` and `@keyframes driftGlow` for continuous floating.
   - Apply them to the background ellipses with different animation durations and delays.

---

## Phase 3: JavaScript Animations & Interactivity
**Objective**: Add scroll-reveal, 3D mouse tilt, and viewport scaling logic.

### Steps:
1. Open [`landing-page.html`](file:///Users/keithalanspeirs/documents/aws/aws-website/frontend/pages/landing-page.html) and locate the `initDesktopParallax` script.
2. **Scroll-Reveal (IntersectionObserver)**:
   - Create an `IntersectionObserver` instance that toggles the class `.reveal-active` when a `.reveal-element` is intersected with $10\%$ visibility threshold.
3. **3D Spotlight Card Tilt**:
   - Add mousemove event listener to `.waw-card` elements.
   - Calculate coordinate percentages, set rotation angles `--rx` and `--ry`, and apply them to the element transform style.
   - Add cursor tracking for the spotlight background gradient.
4. **Verify Page Heights**:
   - Validate that the final unscaled height is exactly $4050\text{px}$, and adjust the JS scale wrapper variable `origHeight` if needed.
