# CLAUDE.md — MadU Wedding App

This file defines the rules, conventions, and context for all Claude Code sessions working on this project.
**Read this file completely before making any changes.**

---

## Project Overview

**App:** MadU Wedding App — a private mobile-first wedding companion PWA
**Couple:** Maťka & Dušan (madu = Maťka + Dušan)
**Wedding date:** 5.9.2026, 15:30 CEST
**Venue:** Penzion Zemiansky Dvor, Surovce
**Guests:** ~75 people (adults, children, suppliers)
**GitHub repo:** `wedding-app`

---

## Language Rules — CRITICAL

| Context | Language |
|---|---|
| All user-visible UI text | **Slovak only** |
| Source code, class names, method names | **English only** |
| Database schema, column names, table names | **English only** |
| API endpoints, JSON keys | **English only** |
| Comments in code | **English only** |
| Git commit messages | **English** |
| This file and docs/ folder | **English** |
| Seed data (guest names, real content) | **Slovak** (it is real data) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Expo + React Native Web (PWA output) |
| Backend | .NET 8 Web API |
| Architecture | Clean Architecture |
| Local DB | PostgreSQL 16 in Docker |
| Prod DB | Azure Database for PostgreSQL Flexible Server |
| File Storage | Azure Blob Storage |
| Real-time | ASP.NET Core SignalR |
| Auth | JWT (no passwords, name-based guest login) |
| CI/CD | GitHub Actions |
| Cloud | Azure (App Service + Blob + PostgreSQL) |
| Containerization | Docker + Docker Compose (local dev) |

---

## Repository Structure

```
wedding-app/
├── CLAUDE.md                    ← this file
├── README.md
├── docker-compose.yml           ← local dev: API + PostgreSQL + pgAdmin
├── .github/
│   └── workflows/               ← CI/CD pipelines
├── docs/                        ← architecture, design, planning docs
│   ├── design-system.md
│   ├── screens.md
│   ├── information-architecture.md
│   ├── api-contract.md
│   ├── database-schema.md
│   ├── stitch-prompt.md
│   └── figma-make-prompt.md
├── backend/
│   └── WeddingApp.sln
│       ├── WeddingApp.Domain/        ← entities, value objects, enums, interfaces
│       ├── WeddingApp.Application/   ← use cases, DTOs, interfaces, validators
│       ├── WeddingApp.Infrastructure/← EF Core, repositories, SignalR, Azure Blob
│       └── WeddingApp.Api/           ← controllers, middleware, DI, Program.cs
└── frontend/
    └── wedding-app/             ← Expo app
        ├── app/                 ← Expo Router screens
        ├── components/          ← reusable UI components
        ├── hooks/               ← custom React hooks
        ├── services/            ← API clients
        ├── store/               ← state management
        ├── constants/           ← colors, typography, spacing
        └── types/               ← TypeScript types
```

---

## Authentication & Authorization

### Login Flow
1. User types their full name → backend fuzzy-matches against guest seed list
2. If 1 match: JWT issued for that guest
3. If multiple matches: disambiguation UI shown (full name cards)
4. If no match: friendly error in Slovak
5. Special tokens (exact match, not in guest list):
   - `maduadmin` → Role: Admin
   - `djmiles` → Role: DJ
   - `starejsi` → Role: MasterOfCeremony

### JWT Claims
```json
{
  "sub": "guest-uuid",
  "name": "Martin Fillo",
  "role": "Guest",         // Guest | Admin | DJ | MasterOfCeremony
  "exp": "7 days"
}
```

### Future Evolution Path
The auth flow is designed so that special tokens can be replaced by:
- Invitation codes (printed on invitation cards)
- Magic links (SMS/email)
- Short PINs
...without changing the JWT or role infrastructure.

---

## Feature Flag System

Every feature has a `FeatureFlag` record in the database:

```
FeatureFlags table:
- key (string, unique)
- is_enabled (bool)
- available_from (datetime, nullable)  ← auto-unlock at this UTC time
- available_until (datetime, nullable) ← auto-lock at this UTC time
- roles_allowed (string[])             ← which roles can see it
```

### Key Feature Flags & Their Unlock Times
| Key | Unlocks | Locks |
|---|---|---|
| `questionnaire` | immediately | 2026-08-01 00:00 UTC |
| `seating` | 2026-09-05 00:00 UTC (wedding day midnight) | — |
| `photo_upload` | 2026-09-05 00:00 UTC | — |
| `photo_bingo` | 2026-09-05 00:00 UTC | — |
| `gallery` | 2026-09-06 06:00 UTC (= 08:00 CEST) | — |
| `thank_you` | 2026-09-06 06:00 UTC | — |
| `love_story` | immediately | — |
| `cocktails` | immediately | — |

### Admin Override
Admin can manually enable/disable any feature flag regardless of time rules.
This is the primary tool for content management — no code changes needed.

---

## Content Management Philosophy

**CRITICAL: All user-visible content must be manageable without code changes.**

This means:
- Schedule items → in database (`ScheduleItems` table), editable via admin API
- Menu items → in database (`MenuItems` table), editable via admin API
- Parking info → in database (`StaticContent` table with key `parking`), editable via admin API
- Accommodation info → in database (`StaticContent` table with key `accommodation`), editable via admin API
- Love story events → in database (`LoveStoryEvents` table), editable via admin API
- Bingo challenges → in database (`BingoChallenges` table), editable via admin API
- Cocktails → in database (`Cocktails` table), editable via admin API
- Feature flags → in database (`FeatureFlags` table), editable via admin API
- Guest list → in database (`Guests` table), editable via admin API
- Thank-you messages → in database (`ThankYouMessages` table, per guest), editable via admin API

**Never hardcode user-visible content in code or seed files that can't be overridden via admin.**
Seed data is only the starting point — everything must remain editable at runtime.

---

## Clean Architecture Rules

### Layer Dependencies
```
API → Application → Domain
Infrastructure → Application → Domain
(Domain has no dependencies)
```

### What goes where
| Layer | Contains |
|---|---|
| `Domain` | Entities, Value Objects, Enums, Domain Events, IRepository interfaces |
| `Application` | Use Cases (Commands/Queries), DTOs, IService interfaces, Validators, MediatR handlers |
| `Infrastructure` | EF Core DbContext, Repository implementations, SignalR hubs, Azure Blob, JWT |
| `Api` | Controllers, Middleware, DI registration, Program.cs, appsettings |

### Patterns
- **MediatR** for CQRS (Commands + Queries)
- **FluentValidation** for input validation
- **EF Core** with PostgreSQL (Npgsql)
- **Repository pattern** defined in Domain, implemented in Infrastructure
- **Result pattern** for error handling (no exceptions for business errors)

---

## API Conventions

- Base URL: `/api/v1/`
- Auth header: `Authorization: Bearer {jwt}`
- All responses: `{ data: T, error: string | null }`
- Dates: ISO 8601 UTC strings
- Slovak text in response `data` fields (display strings), English in keys

---

## Database Conventions

- Table names: `snake_case`, plural (e.g., `guests`, `schedule_items`)
- Column names: `snake_case` (e.g., `created_at`, `is_enabled`)
- Primary keys: `id UUID DEFAULT gen_random_uuid()`
- All tables have: `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`
- Soft deletes where appropriate: `deleted_at TIMESTAMPTZ NULL`
- EF Core migrations in `WeddingApp.Infrastructure/Migrations/`

---

## Frontend Conventions (Expo / React Native Web)

- **Expo Router** for file-based routing
- **TypeScript** — strict mode enabled
- Screen files: `app/(guest)/dashboard.tsx`, `app/(dj)/queue.tsx`, etc.
- Components: PascalCase, co-located with screen if single-use, `/components/` if shared
- Styles: `StyleSheet.create()` + design token constants from `/constants/theme.ts`
- State: React Context for auth/user, React Query for server state
- No Redux — overkill for this scale
- All UI text in Slovak — use `/constants/copy.ts` for all strings (no hardcoded Slovak in JSX)

---

## Design System Quick Reference

See `docs/design-system.md` for full details.
Source: Stitch project `4401616869883670187` (Sage/Editorial Elegance, updated 2026-04-01)

**Core rule: NO 1px solid borders — use background color shifts for boundaries.**

| Token | Value |
|---|---|
| Background (ivory) | `#faf9f6` |
| Surface / Card | `#ffffff` (surface-container-lowest) |
| Surface section | `#f4f3f1` (surface-container-low) |
| Primary (gold) | `#725b28` |
| Primary container | `#c0a469` |
| Secondary (sage) | `#516351` |
| Secondary container | `#d4e8d1` |
| Text primary | `#1a1c1a` (on-surface, warm charcoal) |
| Text secondary | `#4d4638` (on-surface-variant) |
| Error | `#ba1a1a` |
| Border radius card | `24px` (xl) |
| Border radius button | `24px` (xl) |
| Font heading | Noto Serif |
| Font body | Manrope |
| Nav backdrop | `rgba(250,249,246,0.80)` + blur 20px |

---

## Seed Data

Seed data is in `WeddingApp.Infrastructure/Data/Seed/`:
- `GuestSeed.cs` — all ~75 guests
- `FeatureFlagSeed.cs` — all feature flags with unlock times
- `ScheduleSeed.cs` — placeholder schedule items
- `MenuSeed.cs` — placeholder menu items
- `StaticContentSeed.cs` — parking, accommodation text
- `LoveStorySeed.cs` — full love story timeline
- `BingoChallengeSeed.cs` — ~12 photo bingo challenges

**Seed data runs on startup in Development environment only.**
In Production, migrations run but seed data must be applied manually or via admin API.

---

## Environment Configuration

### Local (Docker)
```env
DATABASE_URL=Host=localhost;Port=5432;Database=weddingapp;Username=wedding;Password=wedding123
JWT_SECRET=local-dev-secret-change-in-prod
AZURE_BLOB_CONNECTION=UseDevelopmentStorage=true
ASPNETCORE_ENVIRONMENT=Development
```

### Production (Azure)
- Secrets in Azure Key Vault
- Connection strings in Azure App Service environment variables
- Never commit secrets to git

---

## Working Mode Rules

1. **Ask before assuming** — if business logic is unclear, ask Dušan
2. **Content always editable** — no hardcoded user-visible content; everything goes through DB + admin API
3. **No overengineering** — this serves ~75 people; keep it simple and clean
4. **Slovak UI, English code** — without exception
5. **Phase discipline** — implement only the current phase scope
6. **Step by step** — after each major step, summarize what was done, what remains, what is needed next
7. **Admin = full control** — every feature, every piece of content, every flag must be overridable by maduadmin without code changes
8. **Explain tradeoffs** — before implementing a non-obvious pattern, explain why

---

## Special Business Rules

- DJ login (`djmiles`) sees **only** the song request queue screen — nothing else
- Admin (`maduadmin`) sees everything including all guest questionnaire responses
- Starejší (`starejsi`) sees everything guests see + admin-lite views
- Feature locks are enforced **both on frontend (UX)** and **backend (API)**
- Questionnaire responses are locked for editing after 1.8.2026 (per flag `questionnaire`)
- Gallery and thank-you unlock simultaneously at 2026-09-06 06:00 UTC
- Guest photos go to Azure Blob, not local storage
- All times in database are stored as UTC; converted to CEST (UTC+2) in UI

---

## Phase Plan Summary

| Phase | Target | Scope |
|---|---|---|
| MVP | July 2026 | Login, roles, dashboard, countdown, calendar, parking, accommodation, schedule, menu, questionnaire, DJ requests, admin, feature flags |
| Phase 2 | August 2026 | Love story, seating, photo upload + gallery, photo bingo, cocktails |
| Phase 3 | September 2026+ | Personalized thank-you, gallery unlock, bingo winner |

---

*Last updated: 2026-03-31*
*Maintained by: Claude Code + Dušan*
