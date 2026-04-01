# Screen Specifications — MadU Wedding App

All UI copy is in Slovak. All technical names are in English.

---

## S01 — SplashScreen

**Purpose:** Brand intro, app initialization, JWT validation
**Access:** All roles (before login)
**Duration:** Max 2 seconds, then auto-navigate

### Components
- Full screen ivory background
- Centered: monogram "M & D" in Playfair Display (40px, champagne gold)
- Subtitle: "5. september 2026" (Body L, Text Secondary)
- Subtle animation: fade in from white

### States
- Loading: shown while checking stored JWT
- No JWT: navigates to LoginScreen
- Valid JWT: navigates to role-appropriate home screen

### CTA
- None (auto-navigate)

---

## S02 — LoginScreen

**Purpose:** User identification — guests by name, special roles by token
**Access:** Unauthenticated only

### Components
- Top: small monogram "M & D" (24px, champagne)
- Hero heading: "Vitajte na svadbe" (H1, Playfair Display)
- Subheading: "Maťky a Dušana" (H2, champagne gold)
- Date chip: "5. september 2026" (tag, sage)
- Input field: large text input with placeholder "Tvoje celé meno"
  - DM Sans 17px, min-height 52px, radius-md
  - Supports Slovak diacritics (ä, č, ď, é, í, ľ, ň, ó, ô, š, ť, ú, ý, ž)
- Primary CTA: "Vstúpiť na svadbu" button (full width)
- Subtle note below button: "Ak si DJ alebo organizátor, zadaj svoj špeciálny kód"

### States
- **Default:** empty input, button disabled
- **Typing:** button enabled when ≥2 characters
- **Loading:** button shows spinner "Hľadám ťa..."
- **Not found:** inline error below input: "Nenašli sme ťa v zozname hostí. Skús celé meno alebo kontaktuj organizátora."
- **Special token:** immediate redirect, no disambiguation

### CTA
- Primary: "Vstúpiť na svadbu" (disabled until ≥2 chars)

### UX Notes
- No label for the input, just placeholder — keeps it clean
- Keyboard shows immediately on mount (autoFocus)
- "Return" key on keyboard triggers login
- Background: soft ivory with subtle champagne gradient at top

---

## S03 — DisambiguationSheet (Bottom Sheet Modal)

**Purpose:** Let user select correct identity when multiple name matches found
**Access:** Unauthenticated (mid-login flow)
**Trigger:** Backend returns 2+ matches for entered name

### Components
- Bottom sheet (slides up from bottom, backdrop blur)
- Handle bar at top (36×4px, rounded, champagne light)
- Heading: "Našli sme viac zhôd" (H3)
- Subheading: "Vyber sa zo zoznamu" (Body M, Text Secondary)
- Guest option cards (one per match):
  - Full name (H4, Text Primary)
  - Category tag (e.g., "Rodina" or "Kamaráti", sage chip)
  - Strana (Nevesta / Ženích, small text)
  - Tap to select → green border highlight
- "Potvrdiť" button (Primary, full width) — enabled after selection

### States
- **Default:** 2-4 cards shown, none selected
- **Selected:** chosen card has champagne border, checkmark top-right
- **Confirmed:** sheet closes, JWT issued, navigate to Dashboard

### CTA
- "Potvrdiť" (enabled after selection)
- "Späť" (close sheet, return to login)

---

## S04 — GuestDashboardScreen

**Purpose:** Central hub — countdown + feature navigation cards
**Access:** Guest, MasterOfCeremony, Admin
**Route:** `/(guest)/dashboard`

### Components

**Header:**
- Small avatar initial (first letter of guest name, champagne circle)
- Greeting: "Ahoj, [Meno]! 👋" (H3)
- Tap avatar → ProfileSheet (logout option)

**Countdown Hero Card:**
- Heading: "Do svadby zostáva" (Body M, Text Secondary)
- Numbers: DD / HH / MM / SS with labels "dní", "hodín", "minút", "sekúnd"
- Font: Playfair Display Bold 40px for numbers
- Subtext: "Maťka & Dušan · 5. september 2026" (Body S)
- Location: "Penzión Zemiansky Dvor, Surovce" (Body S, with 📍 icon)
- Background: champagne gradient card

**Feature Card Grid (2 columns):**
| Card | Icon | Title | Subtitle | State |
|---|---|---|---|---|
| Program | 📋 | Program | Harmonogram dňa | Always on |
| Menu | 🍽️ | Menu | Svadobné menu | Always on |
| Playlist | 🎵 | Playlist | Pošli pieseň DJ-ovi | Always on |
| Dotazník | 📝 | Dotazník | Preferencie a alergie | Locked after 1.8.2026 |
| Parkovanie | 🚗 | Parkovanie | Informácie o parkovaní | Always on |
| Ubytovanie | 🏨 | Ubytovanie | Kde sa ubytovať | Always on |
| Stolovanie | 🪑 | Stolovanie | Nájdi si miesto | Locked until 5.9.2026 |
| Fotky | 📸 | Fotky | Zdieľaj spomienky | Locked until 5.9.2026 |
| Galéria | 🖼️ | Galéria | Spoločné fotky | Locked until 6.9.2026 08:00 |
| Bingo | 🎯 | Foto Bingo | Svadobné výzvy | Locked until 5.9.2026 |

**Add to Calendar Banner (full width):**
- Icon: 📅
- Text: "Pridaj svadbu do kalendára"
- Chevron right
- Background: champagne faint

### States
- **Card — available:** normal, tappable, white bg, shadow-md
- **Card — locked:** #F0EBE5 bg, 🔒 top-right corner, muted text, shows unlock date
- **Card — locked (after passed):** becomes available + subtle pulse animation
- **Loading (initial):** skeleton cards in 2-column grid

### CTA
- Tap any card → navigate to that feature (or show locked overlay)
- Tap calendar banner → AddToCalendarModal
- Tap avatar → ProfileSheet

---

## S05 — ScheduleScreen

**Purpose:** Wedding day timeline
**Access:** Guest, MasterOfCeremony, Admin
**Route:** `/(guest)/schedule`
**Content:** Managed via admin API (ScheduleItems table)

### Components
- Header: "Program dňa" (H1, Playfair Display)
- Subheader: "5. september 2026" (Body M, Text Secondary)
- Timeline list of `ScheduleItem` cards:
  - Time (H4, champagne gold, left)
  - Title (H3, Text Primary)
  - Description (Body M, Text Secondary, optional)
  - Icon (optional, 24px)
  - Left border: 3px solid champagne (timeline line)
- Vertical connecting line between cards (dashed, champagne light)

### Seed Placeholder Items
```
15:30  Svadobný obrad
17:00  Foto session
18:00  Svadobná hostina — príchod hostí
18:30  Uvítací prípitok
19:00  Prvý tanec
20:00  Večera
22:00  Svadobná torta
23:00  Zábava a tanec
[TBD by Dušan before MVP launch]
```

### States
- **Normal:** scrollable list
- **Empty:** "Program čoskoro pribudne" with calendar icon
- **Loading:** 4 skeleton timeline cards

### CTA
- None (informational screen)

---

## S06 — MenuScreen

**Purpose:** Display the wedding menu
**Access:** Guest, MasterOfCeremony, Admin
**Route:** `/(guest)/menu`
**Content:** Managed via admin API (MenuItems table)

### Components
- Header: "Svadobné menu" (H1, Playfair Display)
- Menu sections (e.g., Predjedlá, Polievka, Hlavné jedlo, Dezerty)
- Each item:
  - Name (H3)
  - Description (Body M, Text Secondary, optional)
  - Dietary icons (🌱 vegetarian, 🥛 dairy-free, etc.) — optional future feature
- Section dividers: champagne line with section label

### States
- **Normal:** scrollable sections
- **Empty:** "Menu čoskoro pribudne"
- **Loading:** skeleton sections

### CTA
- None (informational)

---

## S07 — ParkingScreen

**Purpose:** Parking information for guests
**Access:** Guest, MasterOfCeremony, Admin
**Route:** `/(guest)/parking`
**Content:** Managed via admin API (StaticContent table, key: `parking`)

### Components
- Header: "Parkovanie" (H1, Playfair Display)
- Info card with content from DB:
  - Default text: "Parkovisko sa nachádza priamo pri Penzióne Zemiansky Dvor v Surovciach. Kapacita je dostatočná pre všetkých hostí."
- Map button: "Navigovať na miesto" → opens Google Maps link
  - URL: directions to Penzión Zemiansky Dvor, Surovce
- Optional: embedded static map image (Phase 2)

### CTA
- "Navigovať na miesto" (secondary button, opens map app)

---

## S08 — AccommodationScreen

**Purpose:** Accommodation information
**Access:** Guest, MasterOfCeremony, Admin
**Route:** `/(guest)/accommodation`
**Content:** Managed via admin API (StaticContent table, key: `accommodation`)

### Components
- Header: "Ubytovanie" (H1, Playfair Display)
- Info card:
  - Name: "Penzión Zemiansky Dvor"
  - Address + map link
  - Availability info: "Izby sú k dispozícii od [dátum/čas]"
  - Note: "Raňajky nie sú v cene ubytovania."
  - Contact info (optional, added by admin)
- Call to action if phone number provided: "Zavolať penzión"

### CTA
- "Navigovať na miesto" (optional map link)
- "Zavolať" (if phone provided)

---

## S09 — QuestionnaireScreen

**Purpose:** Collect allergy and alcohol preferences from each guest
**Access:** Guest (own response), MasterOfCeremony (all), Admin (all)
**Route:** `/(guest)/questionnaire`
**Locked:** After 1.8.2026 (feature flag `questionnaire`)

### Components
- Header: "Dotazník" (H1)
- Subheader: "Pomôž nám pripraviť sa na tvoj príchod" (Body M, Text Secondary)
- Deadline banner: "Dotazník bude uzavretý 1. augusta 2026" (info banner)

**Section 1 — Alkohol**
- Question: "Aký máš vzťah k alkoholu?"
- Options (radio):
  - 🍷 "Pijem alkohol"
  - 🥂 "Pijem iba víno / šampanské"
  - 🍺 "Pijem iba pivo"
  - 🧃 "Nepijem alkohol"

**Section 2 — Alergie a intolerancie**
- Question: "Máš nejakú alergiu alebo intoleranciu na potraviny?"
- Toggle: "Áno" / "Nie"
- If Áno: multiline text input "Opíš prosím svoju alergiu alebo intoleranciu"
  - Placeholder: "Napr. laktóza, lepok, orechy..."

**Submit button:** "Odoslať dotazník"

### States
- **Open (before 1.8.2026, not submitted):** form editable
- **Open (before 1.8.2026, submitted):** success state + "Upraviť odpovede" option
- **Locked (after 1.8.2026, submitted):** read-only view of submitted answers
- **Locked (after 1.8.2026, not submitted):** lock overlay: "Dotazník bol uzavretý. Kontaktuj organizátora."
- **Loading:** skeleton form
- **Error:** error banner + retry

### CTA
- "Odoslať dotazník" (Primary)
- "Upraviť odpovede" (Ghost, only before deadline + already submitted)

---

## S10 — AddToCalendarModal

**Purpose:** Add wedding to device calendar
**Access:** Guest, MasterOfCeremony, Admin
**Type:** Bottom sheet modal

### Components
- Handle bar
- Heading: "Pridaj do kalendára" (H3)
- Event preview card:
  - "💍 Svadba Maťky a Dušana"
  - "5. september 2026, 15:30"
  - "Penzión Zemiansky Dvor, Surovce"
- Two large buttons:
  - "🍎 Apple Kalendár" → universal calendar link
  - "📅 Google Kalendár" → Google Calendar URL with prefilled event

### CTA
- "Apple Kalendár" / "Google Kalendár"
- "Zavrieť" (Ghost)

---

## S11 — PlaylistRequestScreen

**Purpose:** Guest submits song request to DJ in real time
**Access:** Guest, MasterOfCeremony, Admin
**Route:** `/(guest)/playlist`

### Components
- Header: "Pošli pesničku DJ Milesovi" (H1, Playfair Display)
- Subheader: "Tvoja pesnicka zazní na svadobnej zábave" (Body M)

**Form:**
- "Názov piesne" — text input (required)
- "Interpret / kapela" — text input (optional)
- "Odkaz pre Maťku a Dušana" — text input
  - Placeholder: "Napr. Táto pieseň je pre Maťku a Dušana..."
  - Max 120 chars, character counter shown

**Your requests (below form):**
- Section: "Tvoje požiadavky" (H4)
- List of previously submitted requests by this guest
- Each item:
  - Song name (H4) + Artist (Body S)
  - Status chip: "Zaradená" / "Zahrali sme" / "Preskočená"
  - Timestamp (Body S, Text Secondary)
- Empty state: "Zatiaľ si neposlal žiadnu pesničku"

### States
- **Default:** form empty, button disabled
- **Filling in:** button enabled when song name filled
- **Submitting:** button loading
- **Success:** brief success banner "Pieseň odoslaná! 🎵", form resets
- **Error:** error banner + retry

### CTA
- "Odoslať DJ-ovi" (Primary, disabled until song name filled)

---

## S12 — DJQueueScreen

**Purpose:** DJ manages incoming song requests in real time
**Access:** DJ only (role: DJ)
**Route:** `/(dj)/queue`

### Components
- Header: "Požiadavky na piesne" (H1, Playfair Display)
- Live indicator: green dot + "Živé" (connected via SignalR)
- Request count chip: "12 požiadaviek"

**Request list (chronological, newest first):**
Each request card:
- Song name (H3)
- Artist (Body M, Text Secondary)
- "od [Guest name]" (Body S, champagne)
- Dedication: "📝 [dedication text]" (Body S, Text Secondary, italic)
- Timestamp (Body S)
- Action buttons (inline):
  - ✅ "Zahrali sme" → marks as Played
  - ⏭️ "Preskočiť" → marks as Skipped

**Filter chips (top):**
- "Všetky" / "Čakajúce" / "Zahrali sme" / "Preskočené"

**Real-time:**
- New requests appear at top with subtle slide-in animation
- No manual refresh needed (SignalR push)

### States
- **Connected:** green indicator
- **Disconnected:** yellow "Odpojený — pokúšam sa znova..." banner
- **Empty:** "Žiadne požiadavky zatiaľ" with 🎵 icon
- **Loading (initial):** 3 skeleton request cards

### CTA
- ✅ "Zahrali sme" (per card)
- ⏭️ "Preskočiť" (per card)
- Filter chips (Všetky / Čakajúce / Zahrali sme / Preskočené)

---

## S13 — AdminDashboardScreen

**Purpose:** Admin overview — stats, quick actions, system status
**Access:** Admin only
**Route:** `/(admin)/dashboard`

### Components
- Header: "Admin — MadU 💍" (H1)
- Date chip: "5. september 2026"

**Stats cards (2 columns):**
- "Počet hostí" with number (from DB)
- "Dotazníky vyplnené" with count/total
- "Požiadavky na DJ" with count
- "Fotky nahrané" with count (Phase 2)

**Quick actions:**
- "Spravovať obsah" → ContentHubScreen
- "Feature prepínače" → FeatureTogglesScreen
- "Odpovede dotazníka" → QuestionnaireResponsesScreen
- "Zoznam hostí" → GuestListScreen

**System status banner:**
- Current time (UTC+2) vs wedding date
- Active feature flags shown as green chips

### CTA
- Quick action cards (tap to navigate)

---

## S14 — FeatureTogglesScreen

**Purpose:** Admin enables/disables features manually or sets unlock dates
**Access:** Admin only
**Route:** `/(admin)/feature-toggles`

### Components
- Header: "Feature prepínače" (H1)
- Subtitle: "Spravuj dostupnosť funkcií pre hostí" (Body M, Text Secondary)

**Feature list:**
Each row:
- Feature name (H4)
- Current status chip (Aktívny / Neaktívny / Naplánovaný)
- Auto-unlock date (Body S, Text Secondary): "Automaticky: 5.9.2026 00:00"
- Toggle switch (right side)
- Tap row → FeatureDetailSheet (edit unlock date, roles)

**Feature rows:**
- Dotazník (questionnaire) — locks 1.8.2026
- Stolovanie (seating) — unlocks 5.9.2026
- Foto & nahrávanie (photo upload) — unlocks 5.9.2026
- Foto Bingo — unlocks 5.9.2026
- Galéria — unlocks 6.9.2026 08:00
- Poďakovanie — unlocks 6.9.2026 08:00
- Love Story — always on
- Kokteily — always on (Phase 2)

### States
- Active: green toggle, "Aktívny" chip
- Inactive (manual): red toggle, "Neaktívny" chip
- Scheduled: grey toggle, "Naplánovaný" chip + countdown

### CTA
- Toggle switch (immediate effect)
- Tap row → edit unlock time (date/time picker)

---

## S15 — QuestionnaireResponsesScreen

**Purpose:** Admin/Starejší sees all guest questionnaire answers
**Access:** Admin, MasterOfCeremony
**Route:** `/(admin)/questionnaire-responses`

### Components
- Header: "Odpovede dotazníka" (H1)
- Summary bar: "43 / 75 vyplnených" (progress bar, champagne)
- Search input: "Hľadaj hosťa..."
- Filter chips: "Všetci" / "S alergiou" / "Nealko" / "Nevyplnení"

**Response list:**
Each card:
- Guest name (H4)
- Alcohol choice chip
- Allergy note (if any, Body S, italic)
- Submitted at timestamp (Body S, Text Secondary)

**Non-submitted guests section:**
- Collapsed section at bottom: "Nevyplnení hostia (X)"
- List of names not yet submitted

### CTA
- Search + filter (no edit — responses are read-only for admin)
- Export (Phase 2: CSV download)

---

## S16 — LockedFeatureScreen / Overlay

**Purpose:** Inform guest that a feature is not yet available
**Type:** Overlay card or full screen (depending on context)

### Components
- Large lock icon (64px, #C4B9B0)
- Title: dynamic per feature:
  - "Dostupné v deň svadby" (seating, bingo, photos)
  - "Dostupné 6. septembra o 08:00" (gallery, thank-you)
  - "Dotazník bol uzavretý" (after 1.8.2026)
- Subtitle: brief explanation
- Countdown: small countdown to unlock (optional)

### CTA
- "Späť" (navigate back)

---

## Screen Routing Summary (Expo Router)

```
app/
├── index.tsx                          ← SplashScreen
├── login.tsx                          ← LoginScreen
├── (guest)/
│   ├── _layout.tsx                    ← Guest tab bar layout
│   ├── dashboard.tsx                  ← S04
│   ├── schedule.tsx                   ← S05
│   ├── menu.tsx                       ← S06
│   ├── parking.tsx                    ← S07
│   ├── accommodation.tsx              ← S08
│   ├── questionnaire.tsx              ← S09
│   ├── playlist.tsx                   ← S11
│   ├── love-story.tsx                 ← Phase 2
│   ├── seating.tsx                    ← Phase 2
│   ├── photo-upload.tsx               ← Phase 2
│   ├── gallery.tsx                    ← Phase 2
│   ├── bingo.tsx                      ← Phase 2
│   └── thank-you.tsx                  ← Phase 3
├── (dj)/
│   ├── _layout.tsx                    ← DJ tab bar layout
│   └── queue.tsx                      ← S12
└── (admin)/
    ├── _layout.tsx                    ← Admin tab bar layout
    ├── dashboard.tsx                  ← S13
    ├── feature-toggles.tsx            ← S14
    ├── questionnaire-responses.tsx    ← S15
    ├── guest-list.tsx
    └── content/
        ├── index.tsx                  ← ContentHubScreen
        ├── schedule.tsx
        ├── menu.tsx
        ├── love-story.tsx
        ├── bingo-challenges.tsx
        ├── static-content.tsx
        └── thank-you.tsx
```
