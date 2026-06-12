# Events Page Desktop Polish Design

## Overview
This design outlines the focused CSS layout and typography fixes required to polish the desktop version of the Events page. The goal is to perfectly align the Hero section, Cloud Background, Navbar, and Event Archives header with the provided Figma mockup.

## Architecture & Scope
All changes are constrained to the CSS layer and scoped exclusively to the Events page. No HTML structural changes or global component modifications are required. 
**Target File:** `frontend/css/events.css`

## 1. Navbar Consistency Fix
**Problem:** The navigation links currently spill outside the pill-shaped header container on the Events page.
**Solution:**
- Target the `.events-page #header-placeholder` or `.events-page nav` container.
- Enforce strict `box-sizing: border-box`, `overflow: hidden`, and apply appropriate padding.
- This ensures the flex children (links) respect the boundaries of the parent pill shape, keeping it visually consistent with the Home page.

## 2. Hero Card & Cloud Background Positioning
**Problem:** The cloud background (`Desktop-Event-Card-BG.jpg`) needs to sit cleanly behind the Hero Card, and the Hero Card itself needs to be perfectly centered rather than absolute-positioned.
**Solution:**
- **Background Layering:** Move the cloud background image from the `body` tag and apply it directly to the `.events-hero` container. Ensure it covers the top portion of the screen perfectly.
- **Card Centering:** Remove fixed absolute positioning (`left`, `bottom`, etc.) from `.events-hero-card`.
- **Flexbox Layout:** Convert `.events-hero` into a Flexbox container (`display: flex`, `justify-content: center`, `align-items: center`) to perfectly suspend the Hero Card over the cloud background regardless of specific screen height.

## 3. Event Archives Typography
**Problem:** The "Event Archives" header typography does not match the specific gradient, shadow, and sizing defined in Figma.
**Solution:**
- Apply the exact Figma CSS rules to the `.section-title-outline` class.
- **Rules to implement:**
  - `font-family: 'Poppins'; font-weight: 700; font-size: 75px; line-height: 112px; text-align: center;`
  - `background: linear-gradient(180deg, rgba(255, 183, 0, 0.95) 10.18%, rgba(242, 175, 0, 0.95) 50%, rgba(255, 111, 8, 0.95) 80.57%);`
  - `-webkit-background-clip: text; -webkit-text-fill-color: transparent;`
  - `text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);`

## Testing & Validation
- **Visual Check:** Compare the rendered output against the provided Figma screenshot to verify the golden gradient text and centered hero card.
- **Responsive Check:** Verify that the Hero card remains centered on multiple desktop resolutions (1024px to 1920px) without the navbar spilling out of its container.
