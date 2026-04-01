# Figma Make Prompt — MadU Wedding App

## Primary Prompt

Generate an interactive clickable prototype for a Slovak wedding mobile app called "MadU — Svadba Maťky a Dušana". The app serves wedding guests, a DJ, and admins. Design in iPhone 15 Pro frame. The style is premium romantic modern — warm ivory background (#FDFAF5), champagne gold (#C9A96E) as primary accent, Playfair Display serif for headings, DM Sans for body. Not kitsch. Elegant, clean, emotional.

---

## Design System

Colors: background #FDFAF5, cards #FFFFFF, primary #C9A96E, primary dark #A8854A, primary light #EDD9B0, text #2C2423, text secondary #8C7B6B, sage accent #A8B5A0, success #7A9E7E, error #C0666B, locked bg #F0EBE5.

Typography: headings Playfair Display (Bold/SemiBold), body DM Sans (Regular/Medium/SemiBold). Scale: Display 40px, H1 32px, H2 24px, H3 20px, H4 18px, Body 17px, Caption 13px, Label 12px uppercase.

Spacing: 4px base, standard padding 16px. Radius: cards 16px, buttons 28px pill, chips 8px, inputs 12px. Shadows: subtle warm shadows 6-10% opacity.

Components: Primary button 52px tall full-width champagne pill. Toggle switches champagne. Radio cards with border selection. Bottom tab bar 64px ivory with champagne active icons. Cards white with shadow. Feature cards 2-column grid. Timeline with left champagne border.

---

## Prototype Flows

### Flow 1 — Guest Login and Dashboard
1. Login screen → guest types name "Martin Fillo" → tap "Vstúpiť na svadbu"
2. Dashboard loads with countdown hero card showing "328 dní 14 hodín 22 minút"
3. Tap "Program" card → Schedule screen with timeline
4. Back → tap "Dotazník" card → Questionnaire form
5. Fill out form → tap "Odoslať dotazník" → success state
6. Back → tap "Playlist" card → Song request form
7. Fill song → tap "Odoslať DJ-ovi" → success, song appears in "Moje požiadavky"
8. Tap locked "Stolovanie" card → locked overlay: "Dostupné v deň svadby"
9. Tap calendar banner → Add to calendar bottom sheet

### Flow 2 — DJ Login
1. Login screen → type "djmiles" → tap enter
2. Goes directly to DJ Queue screen (only screen visible)
3. Queue shows 4 pending requests
4. Tap "Zahrali sme" on request → card status changes to green "Zahrali sme"
5. New request appears at top with slide animation

### Flow 3 — Admin
1. Login → "maduadmin" → Admin Dashboard
2. Tap "Feature prepínače" → Feature Toggles screen
3. Toggle "Stolovanie" from OFF to ON → chip changes to "Aktívny"
4. Tap "Odpovede dotazníka" → see list of guest responses

---

## Screen Specifications

**LOGIN SCREEN**
Full ivory background. Top 30%: "M & D" monogram Playfair Display 40px champagne, then "Vitajte na svadbe" H1 black, then "Maťky a Dušana" H2 champagne gold, then "5. september 2026" sage chip. Center: text input "Tvoje celé meno" 52px, rounded 12px. Below: primary button "Vstúpiť na svadbu" disabled (lighter). Subtle champagne bottom decoration. No clutter.

**DISAMBIGUATION SHEET**
Semi-transparent blurred overlay behind 60%-height bottom sheet. Sheet: white, top handle bar, "Našli sme viac zhôd" H3, "Vyber, kto si ty" subtitle. Two full-width guest cards: "Martin Fillo / Rodina / Ženích" and "Martin Musil / Kolegovia / Ženích". Selected card gets champagne border + checkmark. "Potvrdiť" button below.

**GUEST DASHBOARD**
Ivory bg. Header: avatar circle "M" + "Ahoj, Martin! 👋". Full-width hero countdown card (champagne gradient, radius 24px): "Do svadby zostáva" small text, then "328 dní · 14 hodín · 22 minút" in large Playfair Display numbers with labels below. Bottom of card: venue + date. Below: 2-column feature card grid — Program, Menu, Playlist, Dotazník (locked 🔒 #F0EBE5 bg), Parkovanie, Ubytovanie, Stolovanie (locked), Fotky (locked), Galéria (locked), Bingo (locked). Full-width calendar banner at bottom. Bottom nav bar: Domov · Program · Playlist · Info.

**SCHEDULE SCREEN**
Header "Program dňa" Playfair H1 + date. Vertical timeline: each item is white card with left 3px champagne border, time in champagne gold H4, title H3, description Body S. Dashed line connects cards. Items: 15:30 Svadobný obrad, 17:00 Foto session, 18:00 Príchod na hostinu, 18:30 Uvítací prípitok, 19:00 Prvý tanec, 20:00 Večera.

**QUESTIONNAIRE SCREEN**
"Dotazník" H1 + subtitle. Info banner (champagne left border): deadline notice. Section "Vzťah k alkoholu": 4 radio cards (🍷 Pijem alkohol, 🥂 Iba víno, 🍺 Iba pivo, 🧃 Nepijem). Section "Alergie": toggle + conditional textarea. Submit button full-width bottom.

**PLAYLIST REQUEST SCREEN**
"Pošli pieseň DJ Milesovi" H1 Playfair. Form: Názov piesne (required), Interpret (optional), Odkaz pre Maťku a Dušana (textarea, 120 char limit). Submit button. Below form: "Tvoje požiadavky" section with submitted song cards showing status chips.

**DJ QUEUE SCREEN**
"Požiadavky" H1 + green dot "Živé". Filter chip row. Request cards: song + artist + "od [name]" in champagne + dedication italic + action buttons (✅ Zahrali sme, ⏭️ Preskočiť) + status chip. Show 4 cards in mixed states. No other navigation visible — single screen for DJ.

**ADMIN DASHBOARD**
"MadU Admin 💍" H1. 2×2 stats grid. Quick action list. Active feature flags chip row. Locked feature chips muted.

**FEATURE TOGGLES SCREEN**
List of feature rows. Each: feature name + auto-date + status chip + toggle switch. Interactive toggles that change chip color when flipped.

**QUESTIONNAIRE RESPONSES**
"Odpovede dotazníka" H1. Progress bar "43/75". Search + filter chips. Guest response cards: name + alcohol chip + allergy note. Non-submitted section collapsed at bottom.

---

## Component States to Include

Every interactive component must have:
- Default
- Hover/Focus (web)
- Pressed (mobile scale 0.98)
- Disabled (muted colors)
- Loading (spinner or skeleton)
- Success (green, Slovak confirmation message)
- Error (red, Slovak error message)

Feature cards specifically:
- Available: white, shadow, tappable
- Locked: #F0EBE5, 🔒 icon, muted text, NOT tappable (shows overlay)
- Just unlocked: pulse animation, champagne border

---

## Figma Component Structure

Create a component library with:
- Colors/tokens frame
- Typography scale frame
- Button variants (primary, secondary, ghost, icon, loading, disabled)
- Card variants (standard, feature available, feature locked, hero, timeline)
- Input variants (default, focus, error, disabled)
- Chip variants (role, category, status-active, status-locked, status-scheduled)
- Bottom tab bar (guest, dj, admin variants)
- Empty state component
- Locked feature overlay
- Bottom sheet component
- Banner/alert variants (info, success, error, warning)
- Countdown widget
- Timeline item

All components with auto-layout, proper constraints, and variant properties.

---

## Realistic Slovak Content to Use

Guest names: Martin Fillo, Danica Hulejová, Katarína Hudcovičová, Jakub Kováčik
Songs: Bohemian Rhapsody (Queen), September (Earth Wind & Fire), Perfect (Ed Sheeran)
Dedications: "Táto pesnicka je pre Maťku a Dušana ❤️", "Pre celú rodinu!", "Na tanec!"
Schedule: 15:30 Svadobný obrad, 17:00 Foto session, 19:00 Prvý tanec, 20:00 Večera, 22:00 Torta
Venue: Penzión Zemiansky Dvor, Surovce
Date: 5. september 2026, 15:30
Couple: Maťka & Dušan

---

## Tone & Aesthetic Notes

- Romantic but NOT kitsch — no clipart hearts, no pink, no glitter
- Modern wedding aesthetic: editorial, warm, premium
- Think: luxury boutique hotel app crossed with a wedding invitation
- Every screen should feel like it was designed by a senior product designer
- Champagne gold used as accent only — not overwhelming
- Large readable text everywhere — guests include older adults
- Generous whitespace — never cluttered
- Smooth, considered interactions
