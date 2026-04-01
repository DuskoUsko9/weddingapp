# API Contract — MadU Wedding App

**Base URL (local):** `http://localhost:5000/api/v1`
**Base URL (prod):** `https://api.wedding.yourdomain.com/api/v1`
**Auth header:** `Authorization: Bearer {jwt}`
**Content-Type:** `application/json`

## Response Envelope

All responses use this structure:
```json
{
  "data": <T | null>,
  "error": "<string | null>"
}
```

## Error Codes
| HTTP | Meaning |
|---|---|
| 400 | Validation error — `error` contains Slovak-friendly message |
| 401 | Not authenticated |
| 403 | Authenticated but forbidden (wrong role or feature disabled) |
| 404 | Resource not found |
| 409 | Conflict (e.g., questionnaire already submitted) |
| 500 | Internal error |

---

## AUTH

### POST `/auth/login`
Login by name or special token. No password.

**Request:**
```json
{ "name": "Martin Fillo" }
```

**Response 200 — single match:**
```json
{
  "data": {
    "type": "token",
    "token": "eyJ...",
    "role": "Guest",
    "guestId": "uuid",
    "guestName": "Martin Fillo"
  },
  "error": null
}
```

**Response 200 — multiple matches (disambiguation needed):**
```json
{
  "data": {
    "type": "disambiguation",
    "matches": [
      { "guestId": "uuid-1", "fullName": "Martin Fillo", "category": "Rodina", "side": "Ženích" },
      { "guestId": "uuid-2", "fullName": "Martin Musil", "category": "Kolegovia", "side": "Ženích" }
    ]
  },
  "error": null
}
```

**Response 200 — special token (djmiles, maduadmin, starejsi):**
```json
{
  "data": {
    "type": "token",
    "token": "eyJ...",
    "role": "DJ",
    "guestId": null,
    "guestName": "DJ Miles"
  },
  "error": null
}
```

**Response 404 — not found:**
```json
{
  "data": null,
  "error": "Nenašli sme ťa v zozname hostí. Skontroluj celé meno alebo kontaktuj organizátora."
}
```

---

### POST `/auth/confirm`
Confirm identity after disambiguation.

**Auth:** Not required
**Request:**
```json
{ "guestId": "uuid" }
```

**Response 200:**
```json
{
  "data": {
    "token": "eyJ...",
    "role": "Guest",
    "guestId": "uuid",
    "guestName": "Martin Fillo"
  },
  "error": null
}
```

---

## FEATURE FLAGS

### GET `/feature-flags`
Get all feature flags with current state.

**Auth:** Required (any role)
**Response 200:**
```json
{
  "data": [
    {
      "key": "questionnaire",
      "displayName": "Dotazník",
      "isEnabled": true,
      "availableFrom": "2026-01-01T00:00:00Z",
      "availableUntil": "2026-08-01T00:00:00Z",
      "isManuallyEnabled": false,
      "isManuallyDisabled": false
    },
    {
      "key": "seating",
      "displayName": "Stolovanie",
      "isEnabled": false,
      "availableFrom": "2026-09-04T22:00:00Z",
      "availableUntil": null,
      "isManuallyEnabled": false,
      "isManuallyDisabled": false
    }
  ],
  "error": null
}
```

---

### PATCH `/feature-flags/{key}`
Update a feature flag. Admin only.

**Auth:** Admin role required
**Request:**
```json
{
  "isManuallyEnabled": true,
  "isManuallyDisabled": false,
  "availableFrom": "2026-09-04T22:00:00Z",
  "availableUntil": null
}
```

**Response 200:** Updated flag object

---

## QUESTIONNAIRE

### GET `/questionnaire/my`
Get own questionnaire response.

**Auth:** Guest/Admin/MasterOfCeremony
**Feature flag:** `questionnaire` (returns 403 if disabled)
**Response 200 — submitted:**
```json
{
  "data": {
    "guestId": "uuid",
    "alcoholPreference": "WineOnly",
    "hasAllergy": true,
    "allergyNotes": "Laktóza",
    "submittedAt": "2026-07-01T10:30:00Z"
  },
  "error": null
}
```
**Response 200 — not yet submitted:**
```json
{ "data": null, "error": null }
```

---

### POST `/questionnaire`
Submit questionnaire (first time or update before deadline).

**Auth:** Guest role required
**Feature flag:** `questionnaire` enforced
**Request:**
```json
{
  "alcoholPreference": "WineOnly",
  "hasAllergy": true,
  "allergyNotes": "Laktóza, lepok"
}
```
**Validation:**
- `alcoholPreference`: required, one of `Drinks|WineOnly|BeerOnly|NonDrinker`
- `allergyNotes`: required if `hasAllergy=true`, max 500 chars

**Response 200:** Created/updated response object
**Response 409:** Already submitted (use PUT to update)

---

### PUT `/questionnaire`
Update own questionnaire (only allowed before deadline).

**Auth:** Guest role required
**Feature flag:** `questionnaire` enforced (returns 403 after 1.8.2026)
**Request:** Same as POST

---

### GET `/questionnaire/all`
All responses for admin/starejší view.

**Auth:** Admin or MasterOfCeremony role required
**Response 200:**
```json
{
  "data": {
    "totalGuests": 75,
    "submitted": 43,
    "responses": [
      {
        "guestId": "uuid",
        "guestName": "Martin Fillo",
        "alcoholPreference": "WineOnly",
        "hasAllergy": false,
        "allergyNotes": null,
        "submittedAt": "2026-07-01T10:30:00Z"
      }
    ],
    "notSubmitted": [
      { "guestId": "uuid-2", "guestName": "Danica Hulejová" }
    ]
  },
  "error": null
}
```

---

## SONG REQUESTS

### POST `/song-requests`
Submit song request to DJ.

**Auth:** Any authenticated role
**Request:**
```json
{
  "songName": "Bohemian Rhapsody",
  "artist": "Queen",
  "dedication": "Táto pieseň je pre Maťku a Dušana ❤️"
}
```
**Validation:**
- `songName`: required, max 300 chars
- `artist`: optional, max 300 chars
- `dedication`: optional, max 120 chars

**Response 201:**
```json
{
  "data": {
    "id": "uuid",
    "songName": "Bohemian Rhapsody",
    "artist": "Queen",
    "dedication": "Táto pieseň je pre Maťku a Dušana ❤️",
    "guestName": "Martin Fillo",
    "status": "Pending",
    "createdAt": "2026-09-05T18:32:00Z"
  },
  "error": null
}
```
**Side effect:** SignalR `NewSongRequest` event pushed to `dj` group.

---

### GET `/song-requests`
All requests (DJ / admin).

**Auth:** DJ or Admin role required
**Query params:**
- `status`: `Pending|Played|Skipped|All` (default: `All`)
- `page`: int (default: 1)
- `pageSize`: int (default: 50)

**Response 200:**
```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "songName": "Bohemian Rhapsody",
        "artist": "Queen",
        "dedication": "...",
        "guestName": "Martin Fillo",
        "status": "Pending",
        "createdAt": "2026-09-05T18:32:00Z"
      }
    ],
    "total": 28,
    "page": 1,
    "pageSize": 50
  },
  "error": null
}
```

---

### GET `/song-requests/my`
Own song requests (guest view).

**Auth:** Any authenticated role
**Response 200:** Array of own requests with status

---

### PATCH `/song-requests/{id}/status`
Update request status (DJ/admin only).

**Auth:** DJ or Admin role required
**Request:**
```json
{ "status": "Played" }
```
**Validation:** `status` must be `Played|Skipped`
**Response 200:** Updated request object
**Side effect:** SignalR `SongRequestUpdated` event pushed to `dj` group.

---

## SCHEDULE

### GET `/schedule`
Get all schedule items ordered by time.

**Auth:** Any authenticated role
**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "timeLabel": "15:30",
      "timeMinutes": 930,
      "title": "Svadobný obrad",
      "description": "Príchod hostí a začiatok cermónie",
      "icon": "⛪",
      "displayOrder": 1
    }
  ],
  "error": null
}
```

---

### POST `/schedule`
Create schedule item. Admin only.

**Auth:** Admin role required
**Request:**
```json
{
  "timeLabel": "15:30",
  "timeMinutes": 930,
  "title": "Svadobný obrad",
  "description": "Príchod hostí",
  "icon": "⛪",
  "displayOrder": 1
}
```
**Response 201:** Created item

---

### PUT `/schedule/{id}`
Update schedule item. Admin only.

**Auth:** Admin role required
**Request:** Same as POST (all fields)
**Response 200:** Updated item

---

### DELETE `/schedule/{id}`
Delete schedule item. Admin only.

**Auth:** Admin role required
**Response 204:** No content

---

## MENU

### GET `/menu`
Get all menu sections with items.

**Auth:** Any authenticated role
**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Predjedlá",
      "displayOrder": 1,
      "items": [
        {
          "id": "uuid",
          "name": "Šunkovo-syrová plnka",
          "description": null,
          "displayOrder": 1
        }
      ]
    }
  ],
  "error": null
}
```

---

### POST `/menu/sections`
Create menu section. Admin only.

**Auth:** Admin role required
**Request:** `{ "name": "Predjedlá", "displayOrder": 1 }`
**Response 201:** Created section

---

### POST `/menu/sections/{sectionId}/items`
Add item to section. Admin only.

**Auth:** Admin role required
**Request:** `{ "name": "Šunka", "description": null, "displayOrder": 1 }`
**Response 201:** Created item

---

### PUT `/menu/sections/{id}` / **DELETE `/menu/sections/{id}`**
Update/delete section + cascade delete items. Admin only.

### PUT `/menu/items/{id}` / **DELETE `/menu/items/{id}`**
Update/delete individual item. Admin only.

---

## STATIC CONTENT

### GET `/static-content/{key}`
Get content by key (`parking` or `accommodation`).

**Auth:** Any authenticated role
**Response 200:**
```json
{
  "data": {
    "key": "parking",
    "title": "Parkovanie",
    "content": "Parkovisko sa nachádza priamo pri penzióne...",
    "metadata": {
      "mapUrl": "https://maps.google.com/?q=...",
      "coordinates": { "lat": 48.5, "lng": 17.8 }
    }
  },
  "error": null
}
```

---

### PUT `/static-content/{key}`
Update static content. Admin only.

**Auth:** Admin role required
**Request:**
```json
{
  "title": "Parkovanie",
  "content": "Nový text...",
  "metadata": { "mapUrl": "https://...", "phone": "+421..." }
}
```
**Response 200:** Updated content

---

## LOVE STORY

### GET `/love-story`
Get all love story events ordered by date.

**Auth:** Any authenticated role
**Feature flag:** `love_story`
**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "eventDate": "2017-09-09",
      "title": "Prvé stretnutie na Trnavskom jarmoku",
      "description": "Stretli sme sa v noci na diskoteke v Relaxe...",
      "photoUrl": null,
      "displayOrder": 1
    }
  ],
  "error": null
}
```

---

### POST `/love-story`
Create love story event. Admin only.

**Auth:** Admin role required
**Request:** `{ "eventDate": "2017-09-09", "title": "...", "description": "...", "displayOrder": 1 }`

### PUT `/love-story/{id}` / **DELETE `/love-story/{id}`**
Admin only. Standard update/delete.

---

## GUESTS (Admin)

### GET `/guests`
List all guests. Admin/MasterOfCeremony only.

**Auth:** Admin or MasterOfCeremony role required
**Query params:** `search`, `category`, `side`, `page`, `pageSize`
**Response 200:**
```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "fullName": "Martin Fillo",
        "side": "Bride",
        "isChild": false,
        "category": "Family",
        "guestType": "Standard",
        "isConfirmed": true,
        "hasQuestionnaire": true
      }
    ],
    "total": 75
  },
  "error": null
}
```

---

### PATCH `/guests/{id}`
Update guest. Admin only (for corrections).

**Auth:** Admin role required
**Request:** Partial guest update `{ "isConfirmed": false }`

---

## ADMIN

### GET `/admin/stats`
Dashboard statistics.

**Auth:** Admin role required
**Response 200:**
```json
{
  "data": {
    "totalGuests": 75,
    "confirmedGuests": 68,
    "questionnairesSubmitted": 43,
    "songRequestsTotal": 28,
    "songRequestsPending": 12,
    "photosUploaded": 0,
    "activeFeatureFlags": ["wedding_info", "schedule", "menu", "parking", "accommodation", "playlist", "love_story", "questionnaire"]
  },
  "error": null
}
```

---

## SignalR Hub

**Endpoint:** `{baseUrl}/hubs/song-requests`
**Auth:** JWT via query string or header

### Server → Client Events
| Event | Payload | Who receives |
|---|---|---|
| `NewSongRequest` | `SongRequestDto` | `dj` group (DJ + Admin) |
| `SongRequestUpdated` | `SongRequestDto` | `dj` group |

### Connection
```typescript
const connection = new HubConnectionBuilder()
  .withUrl(`${API_BASE}/hubs/song-requests`, {
    accessTokenFactory: () => AsyncStorage.getItem('jwt')
  })
  .withAutomaticReconnect([0, 2000, 5000, 10000])
  .build();

await connection.start();
connection.on("NewSongRequest", handleNewRequest);
connection.on("SongRequestUpdated", handleStatusUpdate);
```

---

## Swagger

Available at `/swagger` in Development environment.
All endpoints documented with request/response examples.
JWT auth supported via "Authorize" button in Swagger UI.
