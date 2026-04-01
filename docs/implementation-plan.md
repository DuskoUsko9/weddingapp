# Implementation Plan — MadU Wedding App

Incremental delivery. Each increment is independently deployable and testable.
Work in this order — each step depends on the previous.

---

## Increment 0 — Repository Bootstrap (Day 1)

**Goal:** Empty but fully wired project that builds and runs locally.

**What gets created:**
- Git repo initialized
- `.gitignore` (.NET + Node + secrets)
- `docker-compose.yml` — PostgreSQL 16, pgAdmin, API
- `WeddingApp.sln` with 4 projects (Domain, Application, Infrastructure, Api)
- `frontend/wedding-app/` Expo project initialized
- `CLAUDE.md` (already done)
- `README.md` with local run instructions
- GitHub Actions: build + test workflow skeleton

**Acceptance criteria:**
- `docker-compose up` starts DB
- `dotnet run` in Api project returns 200 on `/health`
- `npx expo start --web` opens blank Expo web app
- GitHub Actions green on push

**Test strategy:** Smoke test — manual curl to `/health`

---

## Increment 1 — Domain + Database Foundation

**Goal:** All entities in DB, migrations work, seed data loads.

**Files impacted:**
- `WeddingApp.Domain/` — all entities, enums, interfaces
- `WeddingApp.Infrastructure/Data/WeddingAppDbContext.cs`
- `WeddingApp.Infrastructure/Data/Configurations/` — EF config per entity
- `WeddingApp.Infrastructure/Data/Migrations/` — initial migration
- `WeddingApp.Infrastructure/Data/Seed/` — all seed files
- `WeddingApp.Api/Program.cs` — add DB + seed call

**Acceptance criteria:**
- `dotnet ef migrations add Initial` creates full schema
- `dotnet ef database update` applies migration to local Docker DB
- On startup: all guests seeded, feature flags seeded, love story seeded
- pgAdmin shows all tables with correct data
- All 75 guests present in `guests` table

**Test strategy:**
- Integration test: verify seed counts (75 guests, 13 feature flags, 10 love story events)

---

## Increment 2 — Authentication

**Goal:** Login works end-to-end. JWT issued. All roles tested.

**Files impacted:**
- `WeddingApp.Application/Auth/` — LoginCommand, ConfirmCommand, DTOs
- `WeddingApp.Infrastructure/Auth/JwtService.cs`
- `WeddingApp.Infrastructure/Services/CurrentUserService.cs`
- `WeddingApp.Api/Controllers/AuthController.cs`
- `WeddingApp.Api/Extensions/` — JWT middleware setup

**Acceptance criteria:**
- `POST /auth/login` with "Martin Fillo" → JWT with role Guest
- `POST /auth/login` with "maduadmin" → JWT with role Admin
- `POST /auth/login` with "djmiles" → JWT with role DJ
- `POST /auth/login` with "starejsi" → JWT with role MasterOfCeremony
- `POST /auth/login` with "Martin" (2 matches) → disambiguation response
- `POST /auth/login` with unknown name → 404 with Slovak message
- `POST /auth/confirm` with guestId → JWT issued
- JWT includes: sub, name, role, iat, exp (7 days)
- Slovak name with diacritics works ("Maťka", "Dušan", "Ľuboš")

**Test strategy:**
- Unit tests: JwtService signs and validates correctly
- Integration tests: all login scenarios via HTTP

---

## Increment 3 — Feature Flags API

**Goal:** Feature flag system works. Admin can toggle. Frontend can fetch.

**Files impacted:**
- `WeddingApp.Application/FeatureFlags/`
- `WeddingApp.Infrastructure/Services/FeatureFlagService.cs`
- `WeddingApp.Api/Controllers/FeatureFlagsController.cs`
- `WeddingApp.Api/Filters/RequireFeatureAttribute.cs`

**Acceptance criteria:**
- `GET /feature-flags` returns all 13 flags with correct `isEnabled` based on current time
- `PATCH /feature-flags/seating` (Admin) toggles manual override
- `RequireFeature("questionnaire")` attribute returns 403 after 1.8.2026 (test with mock clock)
- Feature flags respect priority: ManuallyDisabled > ManuallyEnabled > time rules
- Non-admin cannot call PATCH

**Test strategy:**
- Unit tests: FeatureFlagService.IsEnabled() with various time/override combinations
- Integration tests: GET returns seeded flags, PATCH requires admin JWT

---

## Increment 4 — Static Content APIs (Schedule, Menu, Parking, Accommodation)

**Goal:** All read-only content APIs work. Admin CRUD works.

**Files impacted:**
- `WeddingApp.Application/Schedule/`, `/Menu/`, `/StaticContent/`, `/LoveStory/`
- `WeddingApp.Infrastructure/Data/Repositories/` (4 repos)
- `WeddingApp.Api/Controllers/` (4 controllers)

**Acceptance criteria:**
- `GET /schedule` returns placeholder schedule items ordered by time
- `GET /menu` returns menu sections with items
- `GET /static-content/parking` returns parking text
- `GET /static-content/accommodation` returns accommodation text
- `GET /love-story` returns all 10 love story events ordered by date
- Admin can POST/PUT/DELETE items on all content endpoints
- Non-admin cannot modify content (403)
- Seed data present and correct

**Test strategy:**
- Integration tests: CRUD operations on each content type

---

## Increment 5 — Questionnaire API

**Goal:** Guests can submit questionnaire. Admin can view all responses.

**Files impacted:**
- `WeddingApp.Application/Questionnaire/`
- `WeddingApp.Infrastructure/Data/Repositories/QuestionnaireRepository.cs`
- `WeddingApp.Api/Controllers/QuestionnaireController.cs`

**Acceptance criteria:**
- `POST /questionnaire` (Guest JWT) → saves response
- `GET /questionnaire/my` → returns own response or null
- `PUT /questionnaire` → updates if before deadline
- Feature flag `questionnaire` blocks after 1.8.2026
- `GET /questionnaire/all` requires Admin or MasterOfCeremony
- Slovak validation messages on invalid input
- 409 if submitting twice without PUT

**Test strategy:**
- Unit tests: validator rejects invalid alcoholPreference
- Integration tests: submit, retrieve, update, deadline enforcement

---

## Increment 6 — Song Requests + SignalR

**Goal:** Guests submit songs. DJ sees them in real-time.

**Files impacted:**
- `WeddingApp.Application/SongRequests/`
- `WeddingApp.Infrastructure/SignalR/SongRequestHub.cs`
- `WeddingApp.Infrastructure/Services/SongRequestNotifier.cs`
- `WeddingApp.Api/Controllers/SongRequestsController.cs`
- `WeddingApp.Api/Program.cs` — MapHub

**Acceptance criteria:**
- `POST /song-requests` (any auth) → song saved → SignalR event fired to `dj` group
- `GET /song-requests` (DJ/Admin) → returns all with pagination + status filter
- `GET /song-requests/my` → returns own requests
- `PATCH /song-requests/{id}/status` (DJ/Admin) → updates status + SignalR event
- Non-DJ/Admin cannot call PATCH status
- SignalR hub accessible at `/hubs/song-requests`
- DJ client receives `NewSongRequest` event without refresh

**Test strategy:**
- Integration tests: submit song → verify DB + SignalR event fired
- Manual test: two browser tabs (guest + DJ), submit song, verify real-time update

---

## Increment 7 — Frontend Foundation (Expo PWA)

**Goal:** Expo app runs as PWA. Auth flow works end-to-end. Navigation scaffolded.

**Files impacted:**
- `frontend/wedding-app/app/` — all route files (stubs)
- `frontend/wedding-app/constants/theme.ts` — design system tokens
- `frontend/wedding-app/constants/copy.ts` — all Slovak strings
- `frontend/wedding-app/services/api.ts` — Axios client + JWT interceptor
- `frontend/wedding-app/store/auth.ts` — auth state (React Context)
- `frontend/wedding-app/components/` — Button, Card, Input, FeatureCard, LockedCard
- `frontend/wedding-app/hooks/useFeatureFlags.ts`
- `frontend/wedding-app/app/index.tsx` — SplashScreen
- `frontend/wedding-app/app/login.tsx` — LoginScreen
- `frontend/wedding-app/app/(guest)/_layout.tsx` — tab navigation
- `frontend/wedding-app/app/(dj)/_layout.tsx`
- `frontend/wedding-app/app/(admin)/_layout.tsx`

**Acceptance criteria:**
- `npx expo start --web` → app opens in browser
- Login with "Martin Fillo" → navigates to Guest dashboard
- Login with "djmiles" → navigates to DJ screen
- Login with "maduadmin" → navigates to Admin dashboard
- JWT stored in AsyncStorage, persisted across refresh
- Bottom tab navigation works for all roles
- Design system tokens applied (ivory bg, champagne primary, Playfair headings)
- Slovak text throughout
- Locked feature cards shown correctly based on feature flags
- Countdown widget shows days/hours/minutes to 5.9.2026

**Test strategy:**
- Manual: login flow for all 4 roles
- Manual: locked card shows correct state

---

## Increment 8 — Guest Screens (MVP content)

**Goal:** All MVP guest-facing screens connected to real API.

**Files impacted:**
- `app/(guest)/dashboard.tsx` — full implementation
- `app/(guest)/schedule.tsx`
- `app/(guest)/menu.tsx`
- `app/(guest)/parking.tsx`
- `app/(guest)/accommodation.tsx`
- `app/(guest)/questionnaire.tsx`
- `app/(guest)/playlist.tsx`

**Acceptance criteria:**
- Dashboard: countdown, feature cards, calendar banner
- Schedule: timeline loaded from API with placeholder data
- Menu: sections + items from API
- Parking: text from API with map link
- Accommodation: text from API
- Questionnaire: form submits, shows success, shows read-only after deadline
- Playlist: submit song, see own requests list
- All screens show loading skeletons → real data
- All screens handle error state (retry button)
- Empty states shown when no data

**Test strategy:**
- Manual: full guest journey (login → dashboard → each screen)
- Manual: questionnaire submit + verification in admin view

---

## Increment 9 — DJ Screen

**Goal:** DJ queue screen fully functional with real-time updates.

**Files impacted:**
- `app/(dj)/queue.tsx`
- `frontend/services/signalr.ts` — SignalR client setup

**Acceptance criteria:**
- DJ logs in → sees song request queue
- Filter chips work (All / Pending / Played / Skipped)
- Tap "Zahrali sme" → status updates + SignalR fires to DJ group
- New request from guest appears instantly (no refresh)
- Disconnection banner shown when offline
- Reconnect on network recovery

**Test strategy:**
- Manual: two browser tabs (guest submits, DJ sees immediately)

---

## Increment 10 — Admin Screens (MVP)

**Goal:** Admin dashboard, feature toggles, questionnaire responses, content editors.

**Files impacted:**
- `app/(admin)/dashboard.tsx`
- `app/(admin)/feature-toggles.tsx`
- `app/(admin)/questionnaire-responses.tsx`
- `app/(admin)/guest-list.tsx`
- `app/(admin)/content/` — all content editors

**Acceptance criteria:**
- Admin dashboard shows stats from API
- Feature toggles: toggle switch → PATCH → immediate visual update
- Questionnaire responses: searchable list, filter chips work
- Schedule editor: add/edit/delete items
- Static content editor: edit parking + accommodation text
- Love story editor: add/edit/delete events

**Test strategy:**
- Manual: add schedule item → visible on guest schedule screen
- Manual: edit parking text → visible on guest parking screen
- Manual: toggle feature flag → guest sees lock/unlock

---

## Increment 11 — CI/CD + Azure Deployment

**Goal:** GitHub Actions deploys to Azure on main branch push.

**Files impacted:**
- `.github/workflows/ci.yml` — build + test
- `.github/workflows/deploy.yml` — deploy to Azure
- Azure resources: App Service, PostgreSQL Flexible Server, Blob Storage

**Acceptance criteria:**
- Push to main → GitHub Actions runs build + tests → deploys to Azure
- Production URL returns 200 on `/health`
- Production DB connected and seeded
- HTTPS enforced
- Secrets in Azure Key Vault (not in git)

---

## Backlog Priority

| # | Item | Phase | Priority |
|---|---|---|---|
| 0 | Repo bootstrap | MVP | P0 |
| 1 | Domain + DB | MVP | P0 |
| 2 | Auth (login) | MVP | P0 |
| 3 | Feature flags | MVP | P0 |
| 4 | Static content APIs | MVP | P1 |
| 5 | Questionnaire API | MVP | P1 |
| 6 | Song requests + SignalR | MVP | P1 |
| 7 | Frontend foundation | MVP | P1 |
| 8 | Guest screens | MVP | P1 |
| 9 | DJ screen | MVP | P1 |
| 10 | Admin screens | MVP | P2 |
| 11 | CI/CD + Azure | MVP | P2 |
| 12 | Love story screen | Phase 2 | P3 |
| 13 | Seating screen + data | Phase 2 | P3 |
| 14 | Photo upload + gallery | Phase 2 | P3 |
| 15 | Photo bingo | Phase 2 | P3 |
| 16 | Cocktails | Phase 2 | P4 |
| 17 | Personalized thank-you | Phase 3 | P4 |
