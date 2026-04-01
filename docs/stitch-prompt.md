# Stitch Design Prompt — MadU Wedding App

## Master Prompt (paste directly into Stitch)

Create a complete premium mobile wedding app UI for a Slovak wedding. App name: "MadU — Svadba Maťky a Dušana". Wedding date: 5. september 2026. Venue: Penzión Zemiansky Dvor, Surovce.

---

## Design System

**Color palette:**
- Background: #FDFAF5 (warm ivory)
- Surface / cards: #FFFFFF
- Primary brand: #C9A96E (champagne gold)
- Primary pressed: #A8854A (darker gold)
- Primary light: #EDD9B0 (champagne light)
- Primary faint: #F7F0E3 (champagne faint, section bg)
- Text primary: #2C2423 (warm near-black)
- Text secondary: #8C7B6B (warm gray)
- Text disabled: #C4B9B0
- Accent: #A8B5A0 (muted sage green)
- Accent light: #D4DDD1
- Success: #7A9E7E
- Error: #C0666B
- Locked BG: #F0EBE5
- Locked text: #C4B9B0

**Typography:**
- Headings: Playfair Display (serif, elegant, romantic)
- Body + UI: DM Sans (modern humanist sans)
- Display size: 40px (countdown numbers)
- H1: 32px Playfair Display Bold
- H2: 24px Playfair Display SemiBold
- H3: 20px DM Sans SemiBold
- Body: 17px DM Sans Regular
- Caption: 13px DM Sans Regular
- Labels: 12px DM Sans Medium UPPERCASE

**Spacing:** 4px base unit, primary padding 16px
**Border radius:** Cards 16px, buttons 28px, chips 8px, inputs 12px
**Shadows:** Subtle warm shadows (rgba 44,36,35 at 6-10% opacity)
**Buttons:** 52px tall, full-width primary with rounded pill shape
**Touch targets:** Minimum 48×48px for all interactive elements

---

## Screens to Generate

### Screen 1: Login / Vitajte

**Layout:** Full-screen ivory background with subtle champagne gradient at top
**Elements:**
- TOP: Small "M & D" monogram in Playfair Display, champagne gold, centered, top 25% of screen
- Below monogram: "Vitajte na svadbe" (H1, Playfair Display Bold, Text Primary)
- Below heading: "Maťky a Dušana" (H2, champagne gold)
- Chip below: "5. september 2026" in sage green chip
- Center: Large text input field, placeholder "Tvoje celé meno", full-width, 52px tall, rounded 12px, ivory/white bg
- Below input: Primary button "Vstúpiť na svadbu" (champagne gold, full width, 52px, rounded pill 28px)
- Below button: small gray text "Ak si DJ alebo organizátor, zadaj svoj špeciálny kód"
- BOTTOM: very subtle floral watercolor decoration (champagne tones, abstract)
**State shown:** default/empty input, button disabled (lighter champagne)

---

### Screen 2: Disambiguation Bottom Sheet

**Layout:** Same login screen in background (blurred/dimmed), bottom sheet slides up 60% of screen
**Bottom sheet elements:**
- Handle bar at top center (36×4px, rounded, champagne light color)
- Heading: "Našli sme viac zhôd" (H3, DM Sans SemiBold)
- Subheading: "Vyber, kto si ty" (Body M, Text Secondary)
- 2 guest option cards (full width, white, shadow-sm, radius-lg):
  - Card 1: "Martin Fillo" (H4) + "Rodina · Ženích" small text + category tag "Rodina" sage chip
  - Card 2: "Martin Musil" (H4) + "Kolegovia · Ženích" small text + category tag "Kolegovia" sage chip
  - Selected state: champagne gold border (1.5px), checkmark badge top-right
- Primary button: "Potvrdiť" (full width, disabled until selection)
- Ghost button: "Späť"

---

### Screen 3: Guest Dashboard — Domov

**Layout:** Scrollable screen, ivory background, 16px horizontal padding
**Header:**
- Row: champagne circle avatar with letter "M" (left) + "Ahoj, Martin! 👋" (H3, center-left) + settings icon (right)

**Countdown Hero Card (full width, prominent):**
- Background: champagne gradient (#F7F0E3 → #EDD9B0)
- Border radius: 24px
- Padding: 24px
- Small text top: "Do svadby zostáva" (Label, Text Secondary)
- Large numbers row: "328" + "dní" / "14" + "hodín" / "22" + "minút"
- Numbers: Playfair Display Bold 40px, Text Primary
- Labels: DM Sans 12px caps, Text Secondary, below each number
- Separator: ":" between groups
- Bottom: "Maťka & Dušan · 5. september 2026" (Body S, Text Secondary) + "📍 Penzión Zemiansky Dvor, Surovce" (Body S)

**Feature Cards Grid (2 columns, equal width):**
Row 1 (both available):
- Card 1: 📋 icon (32px, champagne) / "Program" (H3) / "Harmonogram dňa" (Body S, Text Secondary) — white card, shadow
- Card 2: 🍽️ / "Menu" / "Svadobné menu" — same style

Row 2:
- Card 3: 🎵 / "Playlist" / "Pošli pieseň DJ-ovi" — available
- Card 4: 📝 / "Dotazník" / "Preferencie a alergie" — LOCKED state: background #F0EBE5, icon muted, small 🔒 top-right corner, subtitle shows "Uzavrie sa 1. aug."

Row 3:
- Card 5: 🚗 / "Parkovanie" / "Informácie" — available
- Card 6: 🏨 / "Ubytovanie" / "Kde spať" — available

Row 4:
- Card 7: 🪑 / "Stolovanie" / "Dostupné v deň svadby" — LOCKED: #F0EBE5 bg, 🔒, muted
- Card 8: 📸 / "Fotky" / "Dostupné v deň svadby" — LOCKED same style

**Add to Calendar Banner (full width):**
- White card, shadow-sm, row layout
- Left: 📅 icon (24px, champagne)
- Center: "Pridaj svadbu do kalendára" (H4) + "Google alebo Apple Kalendár" (Body S)
- Right: chevron-right icon

---

### Screen 4: Harmonogram — Program dňa

**Layout:** Scrollable, ivory bg, 16px padding
**Header:** "Program dňa" (H1, Playfair Display Bold) + "5. september 2026" (Body M, Text Secondary)

**Timeline items** (vertical list with connecting line):
Each item is a white card with:
- Left edge: 3px solid champagne gold border (timeline visual)
- Time: "15:30" (H4, champagne gold)
- Title: "Svadobný obrad" (H3, Text Primary)
- Description: "Príchod hostí a začiatok cermónie" (Body M, Text Secondary, optional)
- Connecting vertical dashed line between cards (champagne light)

Show 6 timeline items:
1. 15:30 — Svadobný obrad (ceremony icon ⛪)
2. 17:00 — Foto session (📸)
3. 18:00 — Príchod hostí na hostinu (🚪)
4. 18:30 — Uvítací prípitok (🥂)
5. 19:00 — Prvý tanec (💃)
6. 20:00 — Večera (🍽️)

---

### Screen 5: Dotazník — Questionnaire

**Layout:** Scrollable form, ivory bg
**Header:** "Dotazník" (H1) + "Pomôž nám sa pripraviť" (Body M, Text Secondary)

**Info banner (top):**
- Champagne left-border banner: "Dotazník bude uzavretý 1. augusta 2026"

**Section 1 — Alkohol:**
Heading: "Vzťah k alkoholu" (H3)
Four radio option cards (full width, stacked):
- 🍷 "Pijem alkohol" — radio circle left, text right
- 🥂 "Pijem iba víno / šampanské"
- 🍺 "Pijem iba pivo"
- 🧃 "Nepijem alkohol"
Selected state: champagne border + filled radio dot

**Section 2 — Alergie:**
Heading: "Alergie a intolerancie" (H3)
Toggle row: "Mám alergiu alebo intoleranciu" + toggle switch (right, champagne when on)
Below toggle (visible when on): multiline text input "Opíš svoju alergiu..."

**Submit button:** "Odoslať dotazník" (Primary, full width, bottom)

---

### Screen 6: Playlist Request — Pošli pieseň DJ-ovi

**Layout:** Scrollable, ivory bg
**Header:** "Pošli pieseň DJ Milesovi" (H1, Playfair Display) + "Tvoja pesnicka zazní na svadobnej zábave" (Body M)

**Form section:**
- Input: "Názov piesne *" — text input (required), placeholder "Napr. Bohemian Rhapsody"
- Input: "Interpret" — text input (optional), placeholder "Napr. Queen"
- Input: "Odkaz pre Maťku a Dušana" — multiline, placeholder "Táto pieseň je pre...", char counter "0/120"
- Button: "Odoslať DJ-ovi" (Primary, full width)

**"Tvoje požiadavky" section:**
Heading: "Tvoje požiadavky" (H4)
Previous request cards (white, shadow-sm):
- "Bohemian Rhapsody" (H4) + "Queen" (Body S, Text Secondary)
- "📝 Táto pesnicka je pre celú rodinu!" (Body S, italic)
- Status chip: "Zaradená" (sage) or "Zahrali sme" (success green)
- Timestamp: "pred 5 min" (Caption)

---

### Screen 7: DJ Queue — Požiadavky

**Layout:** Scrollable, ivory bg — this is the ONLY screen DJ sees
**Header:** "Požiadavky" (H1) + green dot + "Živé" (Body M, success green) + request count chip

**Filter chips row:**
"Všetky (12)" · "Čakajúce (8)" · "Zahrali sme (3)" · "Preskočené (1)"
Active chip: champagne filled, others outlined

**Request cards (full width, stacked):**
Each card (white, shadow-md, radius-lg, padding 16px):
- Row 1: Song name "Bohemian Rhapsody" (H3) + Artist "Queen" (Body M, Text Secondary)
- Row 2: "od Martin Fillo" (Body S, champagne gold)
- Row 3: "📝 Táto pesnicka je pre celú rodinu!" (Body S, italic, Text Secondary)
- Row 4: Timestamp "14:32" + action buttons right: ✅ "Zahrali sme" (success green small button) + ⏭️ "Preskočiť" (outlined small button)
- Status: "Čakajúca" chip top-right (warning yellow)

Show 4 request cards in different states.

---

### Screen 8: Admin Dashboard — Prehľad

**Layout:** Scrollable, ivory bg
**Header:** "MadU Admin 💍" (H1) + "5. september 2026" date chip

**Stats grid (2×2 cards):**
- "👥 75" + "Celkovo hostí" (Body S)
- "📝 43/75" + "Dotazníky" (Body S)
- "🎵 28" + "DJ požiadavky" (Body S)
- "📸 0" + "Nahrané fotky" (Body S, Phase 2)

**Quick actions (full-width list):**
- "📋 Spravovať obsah" → arrow right
- "⚙️ Feature prepínače" → arrow right
- "📝 Odpovede dotazníka" → arrow right
- "👥 Zoznam hostí" → arrow right

**Active feature flags section:**
Heading: "Aktívne funkcie"
Row of chips: "Program ✓" / "Menu ✓" / "Playlist ✓" / "Parkovanie ✓" / "Ubytovanie ✓"
Locked chips (muted): "Stolovanie 🔒" / "Galéria 🔒"

---

### Screen 9: Feature Toggles — Nastavenia

**Layout:** Scrollable list, ivory bg
**Header:** "Feature prepínače" (H1) + "Spravuj dostupnosť funkcií" (Body M, Text Secondary)

**Feature rows (full-width, white card each):**
Each row:
- Feature name (H4, left)
- Auto-unlock date (Body S, Text Secondary): "Auto: 5.9.2026"
- Status chip (center-right): "Aktívny" (success) / "Naplánovaný" (warning) / "Neaktívny" (muted)
- Toggle switch (far right)

Show 8 feature rows:
1. Dotazník — Aktívny (ON) — "Uzavrie sa 1.8.2026"
2. Stolovanie — Naplánovaný (OFF) — "Auto: 5.9.2026"
3. Foto nahrávanie — Naplánovaný (OFF)
4. Foto Bingo — Naplánovaný (OFF)
5. Galéria — Naplánovaný (OFF) — "Auto: 6.9.2026 08:00"
6. Poďakovanie — Naplánovaný (OFF)
7. Love Story — Aktívny (ON)
8. Program — Aktívny (ON)

---

## Overall Design Requirements

- iPhone 15 Pro frame (393×852pt) for all screens
- No generic app store look — custom, premium, wedding-specific
- Every screen must feel production-ready, not wireframe quality
- Large readable text — min 17px body (accessible for older guests)
- Slovak text throughout all UI
- Champagne gold as the signature brand accent — used sparingly but consistently
- Warm ivory backgrounds — never pure white as background
- Cards float on ivory with subtle warm shadows
- Bottom navigation bar on all guest/admin screens
- Consistent use of Playfair Display for all headings
- Smooth visual hierarchy: heading → subheading → body → caption
- Show realistic Slovak content (names, venues, times)
- Include status bar at top of each screen (time, battery, signal)
