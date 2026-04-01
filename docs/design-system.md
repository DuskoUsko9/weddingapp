# Design System — MadU Wedding App

**Style:** Premium, romantic, modern. Warm neutrals. Not kitsch.
**Target devices:** Mobile-first (iPhone SE → iPhone 16 Pro Max, Android equivalents)
**Accessibility:** Large touch targets (min 48px), high contrast text, readable for older guests

---

## Color Palette

### Base Colors
```
Ivory (background)      #FDFAF5   ← app background, warm off-white
White (surface)         #FFFFFF   ← cards, modals, sheets
Champagne (primary)     #C9A96E   ← primary brand color, CTAs, accents
Champagne Dark          #A8854A   ← pressed state, active icons
Champagne Light         #EDD9B0   ← subtle highlights, selected chips
Champagne Faint         #F7F0E3   ← very subtle tint, section backgrounds
```

### Text Colors
```
Text Primary            #2C2423   ← main text, headings (warm near-black)
Text Secondary          #8C7B6B   ← subtitles, captions, placeholders
Text Disabled           #C4B9B0   ← disabled state
Text On Primary         #FFFFFF   ← text on champagne buttons
Text Link               #A8854A   ← inline links
```

### Accent Colors
```
Sage (accent)           #A8B5A0   ← soft green, secondary accents
Sage Light              #D4DDD1   ← sage chip backgrounds
Sage Dark               #728A69   ← sage icons active state
```

### Semantic Colors
```
Success                 #7A9E7E   ← confirmation, submitted
Success Light           #E8F2EA   ← success background
Error                   #C0666B   ← validation errors
Error Light             #F9E8E9   ← error background
Warning                 #C4956A   ← caution states
Info                    #7A9EB5   ← informational
Locked                  #C4B9B0   ← locked feature icon/text
Locked BG               #F0EBE5   ← locked card background
```

### Gradients
```
Hero gradient     linear(135deg, #FDFAF5 → #F0E6D0)
Card shimmer      linear(90deg, #F7F0E3 → #EDD9B0 → #F7F0E3)  ← loading skeleton
Gold accent       linear(135deg, #C9A96E → #A8854A)
```

---

## Typography

### Font Families
```
Heading:  Playfair Display (Google Fonts, serif)
          — romantic, elegant, editorial feel
          — use for: page titles, hero text, names, dates

Body:     DM Sans (Google Fonts, humanist sans-serif)
          — modern, highly readable, friendly
          — use for: body text, labels, buttons, captions
```

### Type Scale
```
Display   40px / 48px lh / Playfair Display Bold    ← hero countdown number
H1        32px / 40px lh / Playfair Display Bold    ← page titles
H2        24px / 32px lh / Playfair Display SemiBold ← section headings
H3        20px / 28px lh / DM Sans SemiBold         ← card titles
H4        18px / 24px lh / DM Sans SemiBold         ← subsection headings
Body L    17px / 26px lh / DM Sans Regular          ← primary body text
Body M    15px / 22px lh / DM Sans Regular          ← secondary body text
Body S    13px / 18px lh / DM Sans Regular          ← captions, metadata
Label     12px / 16px lh / DM Sans Medium CAPS      ← labels, chips, tags
Button    16px / 24px lh / DM Sans SemiBold         ← all button text
```

### Letter Spacing
```
Playfair Display headings:  letter-spacing: 0.01em
DM Sans body:               letter-spacing: 0
DM Sans CAPS labels:        letter-spacing: 0.08em
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
space-16   64px
```

### Screen Padding
```
Horizontal screen padding:  16px (space-4)
Content max-width:          430px (centered on web/tablet)
Safe area inset:            respected via SafeAreaView
```

---

## Border Radius

```
radius-sm      8px    ← chips, tags, small elements
radius-md      12px   ← input fields, small cards
radius-lg      16px   ← standard cards
radius-xl      24px   ← large cards, bottom sheets
radius-full    100px  ← pills, avatar circles, round buttons
radius-btn     28px   ← primary button
```

---

## Shadows

```
shadow-sm   0px 1px 3px rgba(44, 36, 35, 0.06)                            ← subtle card
shadow-md   0px 4px 12px rgba(44, 36, 35, 0.08)                           ← raised card
shadow-lg   0px 8px 24px rgba(44, 36, 35, 0.10), 0px 2px 6px rgba(44,36,35,0.06)  ← modal
shadow-glow 0px 0px 16px rgba(201, 169, 110, 0.20)                        ← gold accent glow
```

---

## Components

### Buttons

**Primary Button**
```
Background:     #C9A96E (champagne)
Text:           #FFFFFF, DM Sans SemiBold 16px
Border radius:  28px
Height:         52px
Padding:        16px 28px
Shadow:         shadow-sm
Pressed:        background #A8854A, scale 0.98
Disabled:       background #C4B9B0, text #FFFFFF
Loading:        spinner icon, text "Načítava sa..."
```

**Secondary Button**
```
Background:     transparent
Border:         1.5px solid #C9A96E
Text:           #A8854A, DM Sans SemiBold 16px
Border radius:  28px
Height:         52px
Pressed:        background #F7F0E3
```

**Ghost Button / Text Button**
```
Background:     transparent
Text:           #8C7B6B, DM Sans Medium 15px
Underline on press
```

**Icon Button**
```
Size:           48px × 48px (touch target)
Icon size:      24px
Background:     transparent or #F7F0E3
Border radius:  radius-full
```

---

### Cards

**Standard Card**
```
Background:     #FFFFFF
Border radius:  radius-lg (16px)
Shadow:         shadow-md
Padding:        16px
Margin bottom:  12px
```

**Feature Card (dashboard tile)**
```
Background:     #FFFFFF
Border radius:  radius-lg (16px)
Shadow:         shadow-md
Padding:        16px
Contains:       icon (32px), title (H3), subtitle (Body S)
State — available:   normal
State — locked:      background #F0EBE5, icon greyed, lock icon overlay, text muted
State — active:      subtle champagne border (1.5px #EDD9B0)
```

**Hero Card**
```
Background:     gradient (champagne faint)
Border radius:  radius-xl (24px)
Padding:        24px
Use for:        countdown, wedding info summary
```

**Timeline Card**
```
Left border:    3px solid #C9A96E (for schedule items)
Background:     #FFFFFF
Border radius:  radius-md (12px)
Padding:        12px 16px
```

---

### Input Fields

**Text Input**
```
Background:     #FFFFFF
Border:         1.5px solid #E0D8D0
Border radius:  radius-md (12px)
Height:         52px
Padding:        16px
Font:           DM Sans Regular 17px, Text Primary
Placeholder:    DM Sans Regular 17px, Text Disabled
Focus:          border #C9A96E, shadow-glow
Error:          border #C0666B, error message below
```

**Search Input** (for name lookup)
```
Background:     #F7F0E3
Border:         none
Border radius:  radius-full (100px)
Height:         52px
Prefix:         🔍 icon (18px, #8C7B6B)
```

---

### Chips & Tags

**Role chip**
```
Background:     #EDD9B0
Text:           #A8854A, Label (12px CAPS)
Border radius:  radius-sm (8px)
Padding:        4px 10px
```

**Category tag**
```
Background:     #D4DDD1 (sage light)
Text:           #728A69, Label (12px CAPS)
Border radius:  radius-sm (8px)
Padding:        4px 10px
```

**Status chip — locked**
```
Background:     #F0EBE5
Text:           #C4B9B0, Label (12px)
Icon:           🔒 (12px)
Border radius:  radius-sm (8px)
```

**Status chip — available**
```
Background:     #E8F2EA
Text:           #7A9E7E, Label (12px)
Border radius:  radius-sm (8px)
```

---

### Navigation

**Bottom Tab Bar**
```
Background:     #FFFFFF
Border top:     1px solid #F0EBE5
Height:         64px + safe area inset
Active tab:     icon + label, color #C9A96E
Inactive tab:   icon + label, color #C4B9B0
```

**Tab configuration (Guest)**
```
Tab 1: 🏠  Domov       ← Dashboard
Tab 2: 📋  Program     ← Schedule + Menu
Tab 3: 🎵  Playlist    ← DJ Song Request
Tab 4: ℹ️  Info        ← Parking, Accommodation, Wedding Info
```

**Tab configuration (DJ)**
```
Tab 1: 🎵  Požiadavky  ← Song Request Queue (only screen)
```

**Tab configuration (Admin)**
```
Tab 1: 🏠  Prehľad     ← Admin Dashboard
Tab 2: ⚙️  Nastavenia  ← Feature Toggles
Tab 3: 👥  Hostia      ← Guest List + Questionnaire responses
Tab 4: 📝  Obsah       ← Content Management
```

---

### Empty States

**Standard empty state**
```
Illustration:   simple line icon (centered, 80px, color #EDD9B0)
Title:          H3, Text Secondary
Subtitle:       Body M, Text Secondary
CTA:            optional Primary Button
```

**Locked feature state**
```
Icon:           🔒 large (64px, #C4B9B0)
Title:          "Dostupné [date]" or "Dostupné v deň svadby"
Subtitle:       brief explanation
Background:     #F0EBE5
```

**Loading state**
```
Use skeleton screens (shimmer animation)
Skeleton color: gradient #F7F0E3 → #EDD9B0 → #F7F0E3
Card skeletons match real card dimensions
```

**Error state**
```
Icon:           ⚠️ (48px, #C0666B)
Title:          "Niečo sa pokazilo"
Subtitle:       friendly Slovak error message
CTA:            "Skúsiť znova" (retry button)
```

**Success state**
```
Icon:           ✓ in circle (48px, #7A9E7E)
Title:          confirmation message in Slovak
Auto-dismiss:   after 2s or with button "Zavrieť"
Background:     #E8F2EA
```

---

### Banners & Alerts

**Info banner**
```
Background:     #F7F0E3
Left border:    3px solid #C9A96E
Icon:           ℹ️
Text:           Body M, Text Primary
Border radius:  radius-md
Padding:        12px 16px
```

**Warning banner**
```
Background:     #FDF3E8
Left border:    3px solid #C4956A
```

**Success banner**
```
Background:     #E8F2EA
Left border:    3px solid #7A9E7E
```

---

### Countdown Widget

```
Container:      Hero Card (gradient champagne)
Layout:         centered
Numbers:        Display (40px), Playfair Display Bold, Text Primary
Labels:         Label (12px CAPS), Text Secondary ("DNÍ", "HODÍN", "MINÚT", "SEKÚND")
Separator:      ":" in Text Secondary
Animation:      subtle fade transition on number change
```

---

## Microinteractions

- Button press: `scale(0.98)` + slight shadow reduction, 80ms ease-out
- Card tap: `scale(0.99)` + opacity 0.95, 100ms ease-out
- Page transitions: slide left/right (native feel), 300ms
- Countdown: smooth number flip animation
- Success submission: green checkmark with scale-in animation
- Skeleton loading: left-to-right shimmer, 1.5s loop
- Bottom sheet: spring animation from bottom, blur backdrop
- Feature unlock notification: subtle champagne glow pulse

---

## Icons

**Library:** `@expo/vector-icons` (Feather + MaterialCommunityIcons)
**Size:** 24px standard, 20px inline, 32px feature card, 48px empty state
**Color:** follows text color hierarchy (primary/secondary/disabled)

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
- **Love story photos:** displayed in rounded cards (radius-lg), with subtle shadow
- **Aspect ratios:** 16:9 for banners, 1:1 for timeline photos, 4:3 for gallery
- **Placeholder:** champagne gradient with centered heart icon

---

## Responsive Layout

```
Mobile (default):    1 column, 16px horizontal padding
Tablet (768px+):     2 column grid for feature cards, max-width 768px centered
Desktop web (1024+): max-width 430px centered (simulating phone frame)
```

The app is intentionally narrow even on desktop — it is a mobile companion, not a website.
