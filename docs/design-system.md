# Design System — MadU Wedding App

**Style:** Editorial Elegance — "The Digital Concierge"
**Source:** Stitch project `4401616869883670187` (Sage variant, updated 2026-04-01)
**Target devices:** Mobile-first (iPhone SE → iPhone 16 Pro Max, Android equivalents)
**Accessibility:** Large touch targets (min 48dp), high contrast, readable for older guests

---

## Core Philosophy

The UI should feel like a high-end, tactile wedding invitation — not a standard mobile app.
Three principles drive every decision:

1. **Breathability** — generous whitespace is a luxury. If a guest has to scroll, let them.
2. **Tonal Layering** — depth is created by stacking warm paper layers, not by drop-shadows or borders.
3. **"No-Line" Rule** — **1px solid borders are strictly forbidden** for defining sections. Boundaries come from background color shifts only.

> Ghost border exception: if accessibility demands a visible border (e.g., high-sunlight outdoor use), use `outlineVariant` at **15% opacity** — felt, not seen.

---

## Color System

### Surface Hierarchy — "Stacked Paper Layers"

```
surface-container-lowest  #ffffff    ← floating cards (max contrast on ivory)
background / surface       #faf9f6   ← base layer, warm ivory
surface-container-low     #f4f3f1   ← large section groupings
surface-container         #efeeeb   ← default containers
surface-container-high    #e9e8e5   ← input field backgrounds
surface-container-highest #e3e2e0   ← toggle / interactive backgrounds
surface-dim               #dbdad7   ← dimmed state
```

### Primary — Gold

```
primary               #725b28   ← dark gold, buttons, active icons
primary-container     #c0a469   ← lighter gold, gradient end, highlights
primary-fixed         #fedf9f   ← very light gold, subtle tints
primary-fixed-dim     #e0c385   ← dim gold
on-primary            #ffffff   ← text on primary backgrounds
on-primary-container  #4d3a08
```

### Secondary — Eucalyptus / Sage

```
secondary             #516351   ← sage green, success, positive actions
secondary-container   #d4e8d1   ← light sage, chip backgrounds
on-secondary          #ffffff
on-secondary-container #576957
```

### Tertiary — Warm Brown

```
tertiary              #6a5d43
tertiary-container    #b6a687
on-tertiary           #ffffff
```

### Text

```
on-surface            #1a1c1a   ← deep warm charcoal (NEVER pure black)
on-surface-variant    #4d4638   ← secondary text, captions
on-background         #1a1c1a
```

### Semantic

```
error                 #ba1a1a
error-container       #ffdad6
on-error              #ffffff
```

### Outline

```
outline               #7f7667   ← visible outlines when needed
outline-variant       #d0c5b3   ← ghost border base (apply at 15% opacity)
```

### Gradients

```
Primary CTA gradient   linear(primary #725b28 → primary-container #c0a469)
                       — gives buttons a "silk-like" depth
Hero / section tint    linear(#faf9f6 → #f4f3f1)
```

---

## Typography

### Font Families

```
Heading:  Noto Serif (Google Fonts, serif)
          — statement elements: page titles, names, dates, display numbers
          — handles Slovak diacritics (mäkčene/dĺžne) gracefully
          — centered, generous vertical breathing room

Body:     Manrope (Google Fonts, geometric sans-serif)
          — functional counter-balance, high legibility for all ages
          — buttons, labels, body text, captions
```

### Type Scale

```
Display   40px / 48px lh / Noto Serif Bold    ← hero countdown, couple name
H1        32px / 40px lh / Noto Serif Bold    ← page titles
H2        24px / 32px lh / Noto Serif Regular ← section headings
H3        20px / 28px lh / Manrope SemiBold   ← card titles
H4        18px / 24px lh / Manrope SemiBold   ← subsection headings
Body L    17px / 26px lh / Manrope Regular    ← primary body text
Body M    15px / 22px lh / Manrope Regular    ← secondary body text
Body S    13px / 18px lh / Manrope Regular    ← captions, metadata
Label     12px / 16px lh / Manrope Medium     ← labels, chips, tags
Button    16px / 24px lh / Manrope SemiBold   ← all button text
```

### Letter Spacing

```
Noto Serif headings:   letter-spacing: 0.01em
Manrope body:          letter-spacing: 0
Manrope label CAPS:    letter-spacing: 0.08em
```

---

## Spacing System

Base unit: **4px**

```
space-1    4px
space-2    8px
space-3    12px
space-4    16px    ← standard padding
space-5    20px
space-6    24px    ← section spacing
space-8    32px
space-10   40px
space-12   48px
space-16   64px    ← top-of-page margin ("Gallery" feel)
```

### Screen Padding

```
Horizontal screen padding:  16px (space-4)
Top-of-page margin:         64px (space-16) for "Gallery" feel
Content max-width:          430px (centered on web/tablet)
Safe area inset:            respected via SafeAreaView
```

---

## Border Radius

Roundness scale: **ROUND_EIGHT** (base 8px)

```
radius-sm      8px    ← chips, tags, small elements
radius-md      12px   ← input fields
radius-lg      16px   ← medium elements
radius-card    24px   ← "Madu" card (xl = 1.5rem)
radius-button  24px   ← primary CTA (xl roundness)
radius-full    999px  ← pills, avatars, round buttons
```

---

## Elevation & Shadows

**Tonal Layering Principle:** Place a `surface-container-lowest` (#fff) card on a
`surface-container-low` (#f4f3f1) section to create a "soft lift" — natural, not mechanical.

When an element *must* float, use ambient shadow only:

```
Ambient shadow:   blur 24px, y-offset 8px, opacity 6%, color on-surface (#1a1c1a)
                  → looks like a soft glow, NOT a dark drop-shadow
```

---

## Components

### Buttons & CTAs

**Primary Button**
```
Background:     gradient primary (#725b28) → primary-container (#c0a469)
Text:           #ffffff, Manrope SemiBold 16px
Border radius:  24px (radius-button)
Height:         52px
Padding:        16px 28px
Pressed:        slight scale(0.98), 80ms ease-out
Disabled:       surface-container-highest background, on-surface-variant text
Loading:        spinner, "Načítava sa..."
```

**Secondary (Text-only CTA)**
```
Style:          Manrope title-md in primary color (#725b28)
Layout:         gap 1.2rem + trailing chevron-right icon
Background:     none (no box, no border)
```

**Ghost / Text Button**
```
Text:           on-surface-variant (#4d4638), Manrope Medium 15px
Underline on press
```

**Icon Button**
```
Size:           48dp × 48dp (minimum touch target)
Icon size:      24px
Background:     transparent or surface-container-low
Border radius:  radius-full
```

---

### Cards — "The Madu Card"

**Standard Card**
```
Background:     surface-container-lowest (#ffffff)
Border radius:  24px (radius-card)
Shadow:         ambient (blur 24px, y-offset 8px, 6% on-surface)
Padding:        space-4 (16px) internally
No dividers.    Use space-4 (16px) between elements.
Layout trick:   overlap images slightly over card edge to break the container feel
```

**Hero Card**
```
Background:     gradient #faf9f6 → #f4f3f1
Border radius:  24px
Padding:        24px
Use for:        countdown, wedding info summary
```

**Feature Card (dashboard tile)**
```
Background:     surface-container-lowest (#ffffff)
Border radius:  24px
Shadow:         ambient
Contains:       icon (32px), title (H3), subtitle (Body S)
State — locked:  surface-container-low bg, greyed icon, lock icon, muted text
```

**Timeline Card (schedule)**
```
Layout:         vertical whitespace (space-8 = 32px) between blocks
Marker:         secondary (#516351) dot — NO connecting line
Background:     surface-container-lowest
Border radius:  radius-md (12px)
Padding:        12px 16px
```

---

### Input Fields

**Text Input**
```
Background:     surface-container-high (#e9e8e5)
Border:         none (default) — no line borders
Border radius:  radius-md (12px)
Height:         52px
Padding:        16px
Font:           Manrope Regular 17px, on-surface (#1a1c1a)
Placeholder:    Manrope Regular 17px, on-surface-variant
Focus:          background shifts to surface-container-lowest (#fff),
                ghost primary border at 20% opacity
Error:          error border (ba1a1a at 20%), error message below
```

**Search Input** (name lookup)
```
Background:     surface-container-low (#f4f3f1)
Border:         none
Border radius:  radius-full (999px)
Height:         52px
Prefix:         search icon (18px, on-surface-variant)
```

---

### Chips & Tags

**Role chip**
```
Background:     primary-fixed (#fedf9f)
Text:           on-primary-container (#4d3a08), Label 12px
Border radius:  radius-sm (8px)
Padding:        4px 10px
```

**Category tag**
```
Background:     secondary-container (#d4e8d1)
Text:           on-secondary-container (#576957), Label 12px
Border radius:  radius-sm (8px)
Padding:        4px 10px
```

**Status — locked**
```
Background:     surface-container-highest (#e3e2e0)
Text:           on-surface-variant, Label 12px
Icon:           lock (12px)
```

**Status — available**
```
Background:     secondary-container (#d4e8d1)
Text:           secondary (#516351), Label 12px
```

---

### Navigation

**Bottom Tab Bar (Glassmorphism)**
```
Background:     rgba(250, 249, 246, 0.80) — surface at 80% opacity
Backdrop blur:  20px
Height:         64px + safe area inset
No top border.  The blur provides visual separation.
Active tab:     icon + label, color primary (#725b28)
Inactive tab:   icon + label, color on-surface-variant (#4d4638)
```

**Tab configuration (Guest)**
```
Tab 1: Domov       ← Dashboard
Tab 2: Program     ← Schedule + Menu
Tab 3: Playlist    ← DJ Song Request
Tab 4: Info        ← Parking, Accommodation, Wedding Info
```

**Tab configuration (DJ)**
```
Tab 1: Požiadavky  ← Song Request Queue only
```

**Tab configuration (Admin)**
```
Tab 1: Prehľad     ← Admin Dashboard
Tab 2: Nastavenia  ← Feature Toggles
Tab 3: Hostia      ← Guest List + Questionnaire responses
Tab 4: Obsah       ← Content Management
```

---

### Empty & State Components

**Standard empty state**
```
Icon:           thin-stroke line icon, 80px, color primary-fixed (#fedf9f)
Title:          H3, on-surface-variant
Subtitle:       Body M, on-surface-variant
CTA:            optional Primary Button
```

**Locked feature state**
```
Icon:           lock, 64px, on-surface-variant
Title:          "Dostupné [date]" or "Dostupné v deň svadby"
Background:     surface-container-low (#f4f3f1)
```

**Loading state**
```
Skeleton screens — shimmer from surface-container-low → surface-container-highest → surface-container-low
Duration: 1.5s loop
Card skeletons match real card dimensions
```

**Error state**
```
Icon:           warning, 48px, error (#ba1a1a)
Title:          "Niečo sa pokazilo"
CTA:            "Skúsiť znova"
```

**Success state**
```
Icon:           check-circle, 48px, secondary (#516351)
Title:          confirmation message in Slovak
Background:     secondary-container (#d4e8d1)
Auto-dismiss:   2s or "Zavrieť"
```

---

### Banners & Alerts

No left borders on banners — use background color shifts only.

**Info banner**
```
Background:     primary-fixed (#fedf9f)
Icon:           info
Text:           Body M, on-primary-container (#4d3a08)
Border radius:  radius-md
Padding:        12px 16px
```

**Warning banner**
```
Background:     tertiary-container (#b6a687)
```

**Success banner**
```
Background:     secondary-container (#d4e8d1)
```

---

### Countdown Widget

```
Container:      Hero Card (gradient faf9f6 → f4f3f1)
Layout:         centered
Numbers:        Display (40px), Noto Serif Bold, on-surface (#1a1c1a)
Labels:         Label (12px), Manrope, on-surface-variant ("DNÍ", "HODÍN", "MINÚT", "SEKÚND")
Separator:      ":" in on-surface-variant
Animation:      subtle fade transition on number change
```

---

## Microinteractions

- Button press: `scale(0.98)` + slight shadow reduction, 80ms ease-out
- Card tap: `scale(0.99)` + opacity 0.95, 100ms ease-out
- Page transitions: slide left/right (native feel), 300ms
- Countdown: smooth number flip animation
- Success submission: secondary-colored checkmark with scale-in animation
- Skeleton loading: left-to-right shimmer, 1.5s loop
- Bottom sheet: spring animation from bottom, glassmorphism backdrop
- Feature unlock: subtle primary glow pulse

---

## Icons

**Library:** `@expo/vector-icons` (Feather + MaterialCommunityIcons)
**Style:** thin-stroke, elegant iconography — matches Manrope weight. No kitschy symbols.
**Size:** 24px standard, 20px inline, 32px feature card, 48px empty state
**Color:** follows text hierarchy (on-surface / on-surface-variant / disabled)

**Key icons:**
```
Home:           home (Feather)
Schedule:       calendar (Feather)
Music/Playlist: music (Feather)
Info:           info (Feather)
Lock:           lock (Feather)
Settings:       settings (Feather)
Guests:         users (Feather)
Photo:          camera (Feather)
Heart:          heart (Feather) — love story
Cocktail:       glass-cocktail (MaterialCommunity)
Bingo:          grid (Feather)
Parking:        car (Feather)
Accommodation:  home (Feather)
Check:          check-circle (Feather)
Arrow:          chevron-right (Feather)
```

---

## Imagery & Media

- **Hero photos:** warm toned, soft focus, slightly desaturated (+5% warm filter)
- **Love story photos:** rounded cards (radius-card = 24px), ambient shadow, overlap card edge
- **Aspect ratios:** 16:9 for banners, 1:1 for timeline photos, 4:3 for gallery
- **Placeholder:** primary-fixed gradient (#fedf9f) with thin centered icon

---

## Responsive Layout

```
Mobile (default):    1 column, 16px horizontal padding
Tablet (768px+):     2 column grid for feature cards, max-width 768px centered
Desktop web (1024+): max-width 430px centered (simulating phone frame)
```

The app is intentionally narrow on desktop — it is a mobile companion, not a website.

---

## Stitch Screens Reference

Project ID: `4401616869883670187`

| Screen | Stitch ID |
|---|---|
| Welcome / Login | `292127959a6144dfbe7ba8d67b09f081` |
| Guest Dashboard | `2ee6236f0c664af1adff3b9f17898abb` |
| Wedding Schedule | `279734c037844b9a8d0116a9fdf3e0ee` |
| Wedding Menu | `06af7a1838024cd2a9eeb3c50c0895ae` |
| Questionnaire | `800ef5596f7c464f9ed1673141238e1f` |
| Wedding Details | `e9a3da9b49dc469c882d3297bfa94094` |
| Accommodation | `038b9cdc569c4721b2acb5586484bcf4` |
| Parking Information | `db2d69eeff4b4313bed6124a0cca88b7` |
| Love Story Timeline | `bdc7119c9caf489a836db0e282fee9ae` |
| Seating Plan | `53753295e0fe425280fad5b0b19b4f28` |
| Photo Gallery | `785335a2a82c44eb8a8e769745305908` |
| Photo Bingo | `504199cd4db24bf0a453a851793d21da` |
| DJ Screen | `44335af8b2434a299149b95edb3e5cb2` |
| Playlist Request | `68b11f480c074a4eb5e7faf27e8530be` |
| Add to Calendar | `9a52d13476944514be865fa8034df23f` |
| Admin Overview | `358ed1e306cf49ee9e057c0fa4011573` |
| Thank You | `56fcd30fb19a4885b31cae95b1f56873` |
