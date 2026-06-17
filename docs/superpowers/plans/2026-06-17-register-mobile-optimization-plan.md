# Implementation Plan: Register Page Mobile Optimization

**Date**: 2026-06-17  
**Design Spec**: [2026-06-17-register-mobile-optimization-design.md](file:///Users/keithalanspeirs/documents/aws/aws-website/docs/superpowers/specs/2026-06-17-register-mobile-optimization-design.md)  
**Status**: Ready for Execution

---

## Step 1: Layout & Grid Restructuring on Mobile
*   **Target File**: [register.css](file:///Users/keithalanspeirs/documents/aws/aws-website/frontend/css/register.css) inside the `@media (max-width: 767px)` block.
*   **Action**:
    *   Change `.form-row` on mobile to `display: flex; flex-direction: row; flex-wrap: nowrap; gap: 12px; margin-bottom: 16px;`.
    *   Explicitly define column widths for the side-by-side components to match Figma constraints:
        *   **Student Number & Email**: `.form-group-student { flex: 0 0 35%; }` and `.form-group-email { flex: 1; }`
        *   **School Year & Program**: `.form-group-year { flex: 0 0 35%; }` and `.form-group-program { flex: 1; }`
        *   **Date of Birth**: `.form-group-day { flex: 0 0 25%; }`, `.form-group-month { flex: 0 0 45%; }`, `.form-group-year-select { flex: 1; }`

## Step 2: Photo Upload Component Mobile Styling
*   **Target File**: [register.css](file:///Users/keithalanspeirs/documents/aws/aws-website/frontend/css/register.css) inside the `@media (max-width: 767px)` block.
*   **Action**:
    *   Restyle `.name-row` to use flex-row with `align-items: center; justify-content: space-between;`.
    *   Restyle `.form-group-name` to `flex: 1;`.
    *   Restyle `.form-group-photo` to layout horizontally:
        *   Change container to `display: flex; align-items: center; gap: 10px; margin-top: 0; text-align: left;`.
        *   Redesign `.photo-circle` to be an orange capsule/button (`background: #ff8400; border-radius: 20px; width: 80px; height: 50px; border: none;`).
        *   Wrap labels (`.photo-label` and `.photo-optional`) in a flex column container next to the button so they align side-by-side.

## Step 3: Input Controls & Custom Dropdowns Sizing
*   **Target File**: [register.css](file:///Users/keithalanspeirs/documents/aws/aws-website/frontend/css/register.css) inside the `@media (max-width: 767px)` block.
*   **Action**:
    *   Reduce input and trigger paddings to `8px 12px` and font-sizes to `11px` to prevent overflow.
    *   Shrink the dropdown arrow icon/button size to match the scaled down triggers.

## Step 4: Validation Error Styling adjustments
*   **Target File**: [register.css](file:///Users/keithalanspeirs/documents/aws/aws-website/frontend/css/register.css) inside the `@media (max-width: 767px)` block.
*   **Action**:
    *   Style `.form-error` on mobile to have `position: absolute; top: 100%; left: 0; width: 100%; z-index: 10;`.
    *   Decrease error font size to `8px` and warning icon size to `10px` to fit inside narrow columns.

## Step 5: Verification & Safety Checklist
*   Verify layout on `375px` and `320px` simulated mobile viewports.
*   Confirm that all fields remain side-by-side without any overlap.
*   Ensure desktop styling remains unchanged by testing on viewports `>= 1024px`.
