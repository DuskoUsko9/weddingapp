# Design System Specification: The Digital Curator

## 1. Overview & Creative North Star

This design system is built upon the "Digital Curator" philosophy. It moves away from the rigid, utilitarian grids of standard apps to create a high-end editorial experience that feels curated, romantic, and deeply intentional. The objective is to treat every screen as a bespoke stationery piece rather than a mobile interface.

**The Creative North Star: "The Digital Curator"**
The system prioritizes breathing room (whitespace), asymmetrical balance, and a "layered vellum" aesthetic. By utilizing soft tonal shifts instead of harsh lines, we create an atmosphere of premium tranquility. We break the "template" look by overlapping elements—such as images bleeding off-edge or typography subtly intersecting with containers—to provide a sense of depth and organic flow.

---

## 2. Colors

The palette is a sophisticated blend of natural botanicals and metallic warmth, designed to feel fresh and bridal without falling into clichés.

### Core Palette
*   **Primary (Soft Sage - #516351):** Used for primary actions and authoritative grounding.
*   **Secondary (Champagne Gold - #775a19):** Reserved for high-value accents, brand moments, and delicate details.
*   **Tertiary (Blush - #6d5a54 / #E8CFC7):** Used for romantic highlights and soft supportive elements.
*   **Neutral (Ivory - #fdf9ef):** Our canvas. This replaces the sterile "white" to provide a warmer, tactile feel.

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are prohibited for sectioning.** Physical boundaries must be defined solely through background color shifts. For example, a card should be distinguished from the background by moving from `surface` to `surface-container-low`, not by a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, high-quality paper stocks. 
*   **Level 1 (Base):** `surface` (#fdf9ef).
*   **Level 2 (Sectioning):** `surface-container-low` (#f7f3e9).
*   **Level 3 (Interactive/Callout):** `surface-container-highest` (#e6e2d8).

### The Glass & Gradient Rule
To achieve professional "soul," use subtle gradients for Hero CTAs, transitioning from `primary` (#516351) to `primary-container` (#b4c8b2). For floating navigation or modals, apply **Glassmorphism**: use `surface` at 80% opacity with a 20px backdrop-blur to allow underlying colors to bleed through softly.

---

## 3. Typography

The typography strategy pairs the authoritative presence of Noto Serif with the modern, clean functionality of Manrope.

*   **Display & Headlines (Noto Serif):** These are our "Editorial Moments." Use `display-lg` (3.5rem) with wide tracking and intentional asymmetry (e.g., left-aligned headers with right-aligned sub-copy) to break the grid.
*   **Title & Body (Manrope):** These provide the "Modern Functional" balance. Manrope at `body-lg` (1rem) ensures that even dense wedding schedules or guest lists remain highly readable and contemporary.
*   **Hierarchy as Identity:** Use `label-md` in all-caps with increased letter-spacing (0.05em) for category tags to mimic the feel of a premium luxury brand.

---

## 4. Elevation & Depth

We eschew traditional drop shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural lift that feels architectural rather than digital.
*   **Ambient Shadows:** Where floating effects are required (e.g., a "Save the Date" FAB), use shadows with a 32px blur and 4% opacity. The shadow color must be a tinted version of `on-surface` (#1c1c16), never pure black.
*   **The "Ghost Border" Fallback:** If a container requires definition for accessibility, use the `outline-variant` token at **15% opacity**. This creates a "whisper" of a line that guides the eye without cluttering the interface.
*   **Glassmorphism:** Use for persistent headers to maintain a sense of place within the scroll, allowing the Ivory and Sage tones to interact dynamically.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#516351) with `on-primary` text. `ROUND_TWELVE` (0.75rem) corners.
*   **Secondary:** `surface-container-highest` background with `primary` text. No border.
*   **Tertiary:** Text-only in `secondary` (Gold), utilizing `title-sm` with a subtle underline.

### Input Fields
*   **Style:** Minimalist. No enclosing box. Use a `surface-variant` bottom-stroke (ghost border) and `body-md` for the label.
*   **States:** On focus, the bottom-stroke transitions to `primary` (Sage) with a 2px thickness.

### Cards & Lists
*   **The No-Divider Rule:** Forbid the use of horizontal lines between list items. Use vertical white space (`spacing-6` - 2rem) or alternating `surface` and `surface-container-low` backgrounds to separate content.
*   **Image Handling:** Images in cards should use `DEFAULT` (0.5rem) rounding to feel like physical photographs tucked into a sleeve.

### Specialty: The "Registry" Chip
*   **Selection Chips:** Use `tertiary-container` (Blush) for unselected states and `primary` (Sage) for selected states. This provides a soft, celebratory tactile feel to interaction.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts (e.g., a large image on the left with text staggered lower on the right).
*   **Do** use the full spacing scale (`spacing-24`) for hero sections to create a sense of luxury and "calm."
*   **Do** apply the `primary-fixed-dim` for disabled states to keep the color story consistent even in inactive moments.

### Don’t:
*   **Don’t** use pure black (#000000) for text; always use `on-surface` (#1c1c16) to maintain the softer, premium feel.
*   **Don’t** use 1px solid borders to separate sections or items.
*   **Don’t** use standard "Material Design" shadows. If it looks like a default shadow, it’s too heavy.
*   **Don’t** crowd the edges. Every element should have a minimum of `spacing-4` (1.4rem) from the screen boundary.