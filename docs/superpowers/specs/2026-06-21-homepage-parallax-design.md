# Homepage Desktop Parallax & Assets Revision Design Spec

This document details the high-fidelity desktop parallax layout, custom asset integration, and advanced visual interactions for the Home page of the AWS Learning Club website.

---

## 1. Objectives & Scope
- **Target**: Home / Landing page (`frontend/pages/landing-page.html`) for **desktop viewports only ($\ge 769\text{px}$)**.
- **Goal**: Implement a seamless, highly pretty scroll-driven parallax design incorporating custom assets for transitions and sections.
- **Mobile Compatibility**: Keep the existing mobile layout completely intact and separate.
- **Performance**: Use vanilla HTML, CSS, and lightweight JS for zero external library footprint, ensuring sub-second load times and smooth 60fps animations.

---

## 2. Layout Architecture & Asset Integration

The page is split into a **desktop-only parallax wrapper** and a **mobile-only container**. The desktop container utilizes an absolute positioning layout inside a centered virtual $1920\text{px}$ canvas that dynamically scales using CSS transform scaling.

### Section Layers & Assets
The homepage parallax content spans from $Y = 0\text{px}$ to $Y = 4050\text{px}$ (virtual unscaled pixels), mapped to these sections:

1. **Hero Section** ($0\text{px}$ to $1372\text{px}$):
   - **Far Background**: `Hero-Section.webp` (Sky) scrolling slowly.
   - **Glow Ellipses**: Blurred gradient circles providing subtle depth.
   - **Hero Content Card**: Center glassmorphic card containing "IT'S ALWAYS DAY ONE" title, description, and buttons.
   - **Close-up Clouds**: Large transparent cloud layers scrolling faster.

2. **Hero to "Who Are We" Transition** ($938\text{px}$ to $1100\text{px}$):
   - **Asset**: `Transition_Clouds.png` positioned overlapping the boundary.
   - **Behavior**: Slides upwards on scroll to hide the sky-to-background transition line.

3. **"Who Are We" Section** ($938\text{px}$ to $1837\text{px}$):
   - **Background**: `Who_Are_WE_BG.png` scrolling at a slower speed.
   - **Foreground Title & Description Box**: Positioned exactly to Figma specifications.
   - **Spotlight Cards**: DEPARTMENTS, OFFICES, VISION, and MISSION aligned horizontally at `top: 1475.29px`.
   - **Mascot**: `Hima_Ship.webp` positioned at the bottom right.

4. **"Who Are We" to "Cloud Expertise" Transition** ($1750\text{px}$ to $1900\text{px}$):
   - **Asset**: `Transition_Leaves.png` overlapping the section divide.
   - **Behavior**: Acts as a transition layer leading into the forestry theme of the next section.

5. **Cloud Expertise Section** ($1873\text{px}$ to $4036\text{px}$):
   - **Far Background**: Blue-to-cyan linear gradient background + `What-We-Do-Background.webp` blend.
   - **Foreground Frame**: `CloudExperience_Top_layer.png` (dense green leaves frame with transparent center).
   - **Middle-ground Content**: Center-stacked content cards scrolling behind the leafy opening.
   - **Bottom Transition**: Green bush gradient ellipses mimicking foliage at the bottom.

---

## 3. Parallax Speeds & Virtual Scroll Mapping

The unscaled scroll position is mapped via CSS custom properties. As the page scrolls, layers translate vertically using the formula:
$$\text{translateY} = \text{scrolled} \times \text{speed\_factor}$$

| Layer Name / Element | Z-Index | Speed Factor | Scroll Behavior |
| :--- | :---: | :---: | :--- |
| **Sky Background** (Hero) | 1 | `0.4` | Scrolls very slow (40% viewport speed) |
| **Who Are We Background** (`Who_Are_WE_BG.png`) | 4 | `0.2` | Scrolls slow (20% viewport speed) |
| **Transition Clouds / Leaves** | 5 | `0.12` | Overlaps background transition |
| **Content Cards** (Cloud Expertise) | 4 | `0.0` | Scrolls at normal viewport speed |
| **Leafy Foreground Frame** (`CloudExperience_Top_layer.png`) | 6 | `0.15` | Scrolls slightly slower (85% viewport speed) |
| **Foreground Clouds** (Hero close-ups) | 5 | `-0.15` | Scrolls faster than viewport (close-up parallax) |

---

## 4. Advanced Interactive Animations

### 1. Scroll-Reveal Transitions
- **Trigger**: Native JavaScript `IntersectionObserver` watches elements with the class `.reveal-element`.
- **CSS States**:
  ```css
  .reveal-element {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .reveal-element.reveal-active {
      opacity: 1;
      transform: translateY(0);
  }
  ```

### 2. 3D Spotlight Card Tilt
- **Target**: DEPARTMENTS, OFFICES, VISION, MISSION cards.
- **Code**: Mousemove event listener captures relative coordinates:
  $$\text{rotateX} = \left(\frac{\text{clientY} - \text{cardTop}}{\text{cardHeight}} - 0.5\right) \times -15\text{deg}$$
  $$\text{rotateY} = \left(\frac{\text{clientX} - \text{cardLeft}}{\text{cardWidth}} - 0.5\right) \times 15\text{deg}$$
- **Effect**: Card tilts towards the mouse and activates a radial gradient background spotlight follow.

### 3. Hero Button Shimmers
- **Target**: **Join** and **About us** buttons.
- **Effect**: Diagonal gloss overlay (`linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent)`) sweeps across the button faces on hover over `0.6s` with custom ease.

### 4. Idle Floating Motions
- **Target**: Sky clouds, glowing background ellipses.
- **Effect**: Gentle continuous drift utilizing CSS animations:
  ```css
  @keyframes idleFloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-12px) rotate(0.5deg); }
  }
  ```

---

## 5. Verification & Testing Criteria
1. **Viewport Separation**: Ensure mobile styles/layouts do not change when width $< 769\text{px}$.
2. **Dynamic Scaling**: Resize desktop browser from $800\text{px}$ to $2000\text{px}$ and verify that the virtual $1920\text{px}$ layout scales proportionally without breaking boundaries or overflowing.
3. **Scroll Performance**: Ensure scroll animations achieve solid 60fps on major desktop browsers (Chrome, Safari, Firefox).
