# Design Specification: Register Page Mobile Optimization

**Date**: 2026-06-17  
**Author**: Antigravity  
**Status**: Draft (Awaiting User Review)

---

## 1. Goal & Requirements
The goal is to optimize the registration page ([register.html](file:///Users/keithalanspeirs/documents/aws/aws-website/frontend/pages/register.html)) specifically for mobile viewports (`< 768px`). The page must strictly match the Figma mockup provided in the user's screenshot.

### Scope Constraints
- **Zero changes** to the backend.
- **Zero changes** to the desktop version or desktop layout.
- All styles must be fully responsive and adjustable, targeted strictly within the `@media (max-width: 767px)` block in [register.css](file:///Users/keithalanspeirs/documents/aws/aws-website/frontend/css/register.css) under the page container class `.register-page`.

---

## 2. Layout & Grid Architecture (Mobile-Only)
On mobile, the form will keep a side-by-side column structure for related fields, matching the desktop concept but scaled to mobile screen widths:

- **Full Name + Photo Upload**:
  - The Full Name field remains on the left, but its flex-basis will adjust to make space for the photo upload on the right.
- **Student Number & Email**:
  - Arranged horizontally in a flex row. Student Number takes `35%` width, and Email takes `65%` width.
- **School Year & Program**:
  - Arranged horizontally in a flex row. School Year takes `35%` width, and Program takes `65%` width.
- **Date of Birth**:
  - Arranged horizontally in a flex row. Day takes `25%`, Month takes `45%`, and Year takes `30%` width.
- **Consent Box**:
  - Layout is horizontal, with a custom checkbox and data privacy text wrapping cleanly on mobile screens.

---

## 3. Visual & UI Component Details

### A. Photo Upload Section
- The photo preview circle (`.photo-circle`) will be redesigned on mobile to appear as a stylized horizontal container.
- It will feature an orange camera button block (`100px` width) with a white SVG camera icon.
- Next to it, the text "2x2 Photo" and "Optional" or "(Upload)" labels will align horizontally.

### B. Form Inputs, Selects & Typography
- Fonts and placeholders will be scaled dynamically to prevent truncation and overflow.
- Inputs and custom select drop-downs will use smaller paddings (`10px 14px`) to accommodate the side-by-side layout.
- Select arrows will scale down proportionally.

### C. Validation Error Messages
- Positioned absolutely below each field or styled with small line-heights to prevent them from pushing other columns out of alignment.
- Font size for error text will be set to `8px` to fit inside the narrow side-by-side columns.

---

## 4. Verification & Testing Plan
- Test on different mobile screen widths: `320px`, `375px`, `414px`, and `768px`.
- Verify input side-by-side alignment.
- Verify dropdown triggers and dropdown item options function correctly.
- Verify photo upload file input opens, updates the preview, and aligns correctly.
- Verify validation logic runs correctly and shows error highlights without breaking layouts.
- Verify desktop registration view remains identical to current design.
