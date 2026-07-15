# Hima Mascot Integration Design

## Goal

Add the supplied Hima poses as decorative, responsive images without changing the existing page structure, copy, section order, navigation, or interactions.

## Confirmed placements

| Page | Existing area | Asset | Role |
| --- | --- | --- | --- |
| Members | Hero | `representing hima.png` | Replace only the current hero Hima image, keeping its existing visual footprint. |
| About | Vision and Mission area | `rocket 3.png` | Add a small pointing Hima in unused visual space beside the cards. |
| About | Goals area | `rocket 2.png` | Add a celebratory Hima in reserved whitespace below the goal copy, away from the cards. |
| About | Build Your Future With Us | `rocket.png` | Replace the existing future-section mascot image. |

## Layout and behavior

- Existing markup stays in place. New About mascots are additive, decorative sibling elements only; the Members change updates the existing mascot image source.
- Each mascot has a positioned wrapper that reserves its own space with `aspect-ratio`; the image uses `width: 100%`, `height: 100%`, and `object-fit: contain`.
- Desktop uses the current visual whitespace around each target section. Mobile switches each wrapper into normal document flow below the relevant copy, so text and cards cannot be covered.
- Image sizes use `clamp()` rather than viewport-only or fixed dimensions. Mascots have `pointer-events: none` and empty alt text because they are decorative.
- The Members replacement preserves the current `.hero-mascot` box dimensions and breakpoints exactly; only the optimized asset changes.

## Asset delivery

- Convert all supplied PNGs to WebP with transparent backgrounds retained.
- Store About assets in `frontend/assets/about/mascot/` and the Members asset in `frontend/assets/members/Mascot/`.
- Add intrinsic dimensions, lazy-load non-hero mascots, and eager-load only the Members hero image.

## Validation

- Check desktop at 1024, 1280, and 1536 pixels; check mobile at 320, 375, and 768 pixels.
- Confirm no horizontal scrolling, text overlap, clipped mascot, content jump, or interactive obstruction.
- Confirm the current About page structure, Members hero layout, Founder cards, and registration changes remain otherwise untouched.
