# Information Architecture — MadU Wedding App

## App Structure by Role

```
App Root
│
├── Onboarding
│   ├── SplashScreen
│   ├── LoginScreen           ← name input (guests) or special token
│   └── DisambiguationSheet   ← shown when multiple name matches found
│
├── Guest App  (role: Guest)
│   ├── [Tab] Domov
│   │   └── DashboardScreen   ← countdown + feature card grid
│   │
│   ├── [Tab] Program
│   │   ├── ScheduleScreen    ← wedding day timeline
│   │   └── MenuScreen        ← wedding menu
│   │
│   ├── [Tab] Playlist
│   │   └── PlaylistRequestScreen  ← submit song to DJ
│   │
│   └── [Tab] Info
│       ├── InfoHubScreen     ← links to all info screens
│       ├── WeddingInfoScreen ← date, venue, map link
│       ├── ParkingScreen     ← parking details
│       ├── AccommodationScreen ← where to sleep
│       ├── QuestionnaireScreen ← allergies + alcohol [locked after 1.8.2026]
│       └── AddToCalendarModal ← Google + Apple calendar
│
│   [Phase 2 additions — visible but locked until date]
│   ├── LoveStoryScreen       ← timeline [always visible]
│   ├── SeatingScreen         ← find your seat [locked until 5.9.2026]
│   ├── PhotoUploadScreen     ← upload photos [locked until 5.9.2026]
│   ├── GalleryScreen         ← shared photos [locked until 6.9.2026 08:00]
│   └── BingoScreen           ← photo bingo [locked until 5.9.2026]
│
│   [Phase 3 additions]
│   └── ThankYouScreen        ← personalized thank-you [locked until 6.9.2026 08:00]
│
├── DJ App  (role: DJ)
│   └── [Tab] Požiadavky
│       └── DJQueueScreen     ← incoming requests, status management
│
├── MasterOfCeremony App  (role: MasterOfCeremony)
│   └── Same as Guest App + read access to questionnaire responses
│       (uses same navigation, extra "Dotazníky" item in Info tab)
│
└── Admin App  (role: Admin)
    ├── [Tab] Prehľad
    │   └── AdminDashboardScreen  ← stats, quick actions
    │
    ├── [Tab] Nastavenia
    │   └── FeatureTogglesScreen  ← enable/disable features by date or manual
    │
    ├── [Tab] Hostia
    │   ├── GuestListScreen       ← all guests, search
    │   └── QuestionnaireResponsesScreen ← all questionnaire answers
    │
    └── [Tab] Obsah
        ├── ContentHubScreen      ← links to all content editors
        ├── ScheduleEditorScreen  ← add/edit/delete schedule items
        ├── MenuEditorScreen      ← add/edit/delete menu items
        ├── LoveStoryEditorScreen ← add/edit/delete love story events
        ├── BingoChallengesEditorScreen ← add/edit/delete bingo challenges
        ├── StaticContentEditorScreen ← parking, accommodation text
        └── ThankYouEditorScreen  ← per-guest thank-you messages + photos
```

---

## Navigation Flow Diagrams

### Guest Login Flow
```
SplashScreen (2s)
    ↓
LoginScreen
    ├── [special token entered] → role-based app (admin/dj/starejsi)
    ├── [name found, 1 match] → DashboardScreen
    ├── [name found, multiple matches] → DisambiguationSheet → DashboardScreen
    └── [name not found] → error message on LoginScreen
```

### Guest Dashboard Flow
```
DashboardScreen
    ├── [tap countdown] → WeddingInfoScreen
    ├── [tap Schedule card] → ScheduleScreen
    ├── [tap Menu card] → MenuScreen
    ├── [tap Playlist card] → PlaylistRequestScreen
    ├── [tap Questionnaire card] → QuestionnaireScreen (if open)
    │                          → locked state overlay (if after 1.8.2026)
    ├── [tap Parking card] → ParkingScreen
    ├── [tap Accommodation card] → AccommodationScreen
    ├── [tap Seating card] → SeatingScreen (if 5.9.2026+)
    │                     → locked state (if before)
    ├── [tap Gallery card] → GalleryScreen (if 6.9.2026 08:00+)
    │                     → locked state (if before)
    └── [tap Bingo card] → BingoScreen (if 5.9.2026+)
                        → locked state (if before)
```

### DJ Flow
```
LoginScreen → DJQueueScreen
    ├── [incoming request arrives via SignalR] → list updates
    ├── [tap request] → mark as Played / Skip
    └── [pull to refresh] → refresh list
```

### Admin Content Management Flow
```
AdminDashboardScreen
    ↓ [tap Obsah tab]
ContentHubScreen
    ├── ScheduleEditorScreen
    │   ├── [tap item] → edit inline
    │   ├── [swipe left] → delete with confirmation
    │   └── [+ button] → add new item (time + title + description)
    ├── MenuEditorScreen
    │   └── same CRUD pattern
    └── ... all other content screens same pattern
```

---

## Feature Card Grid Layout (Dashboard)

```
┌─────────────────────────────────┐
│  🎊 Countdown Hero Card          │
│     XX dni  XX h  XX min         │
│  do svadby Maťky a Dušana        │
└─────────────────────────────────┘

┌──────────────┐  ┌──────────────┐
│ 📋 Program   │  │ 🍽️ Menu      │
│ Harmonogram  │  │ Svadobné     │
│ dňa          │  │ menu         │
└──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐
│ 🎵 Playlist  │  │ 📝 Dotazník  │
│ Pošli pieseň │  │ Preferencie  │
│ pre DJ       │  │ 🔒 do 1.8.   │
└──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐
│ 🚗 Parkovanie│  │ 🏨 Ubytovanie│
│ Penzión ZD   │  │ Na mieste    │
└──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐
│ 🪑 Stolovanie│  │ 📸 Fotky     │
│ 🔒 v deň     │  │ 🔒 v deň     │
│ svadby       │  │ svadby       │
└──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐
│ 🖼️ Galéria   │  │ 🎯 Bingo     │
│ 🔒 6.9. 08:00│  │ 🔒 v deň     │
└──────────────┘  └──────────────┘

┌─────────────────────────────────┐
│  📅 Pridaj do kalendára         │
│  Tap → výber Google / Apple     │
└─────────────────────────────────┘
```
