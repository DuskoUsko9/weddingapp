# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wedding app for Dušan & Martina's wedding on September 5, 2026. Guests log in by full name (passwordless), and the app unlocks features dynamically based on time-gated feature flags. All content is managed via admin API — nothing is hardcoded.

---

## Commands

### Backend (.NET 8)

```bash
cd backend

# Restore & build
dotnet restore
dotnet build

# Run API (development)
cd WeddingApp.Api && dotnet run

# Run all tests
dotnet test

# EF Core migrations
dotnet ef migrations add <MigrationName> --project WeddingApp.Infrastructure --startup-project WeddingApp.Api
dotnet ef database update --project WeddingApp.Infrastructure --startup-project WeddingApp.Api

# Reset database (drops + recreates via migrations + seed)
dotnet ef database drop --project WeddingApp.Infrastructure --startup-project WeddingApp.Api --force
dotnet ef database update --project WeddingApp.Infrastructure --startup-project WeddingApp.Api
```

### Frontend (Expo + React Native Web)

```bash
cd frontend/wedding-app

# Install deps (legacy-peer-deps required)
npm install --legacy-peer-deps

# Start dev server (web)
npx expo start --web

# Build for web (static export → dist/)
npx expo export --platform web

# Run on Android/iOS
npx expo start --android
npx expo start --ios
```

### Local Full-Stack (Docker Compose)

```bash
# Start all services (SQL Server + API + Frontend)
docker-compose up

# Backend only (SQL Server + API)
docker-compose up sqlserver api
```

---

## Architecture

### Backend — Clean Architecture + CQRS

```
WeddingApp.Domain/           → Entities, Enums, Domain interfaces (no dependencies)
WeddingApp.Application/      → Use cases via MediatR Commands/Queries + FluentValidation
WeddingApp.Infrastructure/   → EF Core, Repositories, JWT, SignalR, Azure Blob, Email
WeddingApp.Api/              → Controllers, Middleware, Program.cs bootstrap
```

**Pattern for any new feature:**
1. Add entity/enum to `Domain`
2. Add Command/Query + DTO + Validator to `Application/{Feature}/`
3. Add EF config + repository to `Infrastructure`
4. Add controller endpoint to `Api`

**API response envelope** — all responses use:
```json
{ "data": { ... }, "error": null }
```

**Auth:** Passwordless — guests enter full name → JWT returned. Special tokens like `"maduadmin"` or `"djmiles"` grant elevated roles. Three roles: `Guest`, `Admin`, `DJ`, `MasterOfCeremony`.

**Real-time:** SignalR hub at `/hubs/song-requests` for the DJ queue.

**Feature flags:** `FeatureFlag` entity with `AvailableFrom`/`AvailableUntil` timestamps controls which app sections are accessible. All content (menu, schedule, love story text, etc.) lives in the database.

### Frontend — Expo Router (file-based routing)

```
app/(auth)/          → login.tsx
app/(guest)/         → All guest-visible screens (dashboard, menu, schedule, etc.)
app/(admin)/         → Admin management screens
app/(dj)/            → DJ queue (real-time SignalR)
app/magic-login.tsx  → Passwordless token handler

services/api.ts      → Axios client with JWT interceptor + simulated time header
store/               → AuthContext, ImpersonationContext, SimulatedTimeContext
constants/theme.ts   → Design tokens (colors, typography, spacing, shadows)
constants/copy.ts    → Slovak UI strings
types/api.ts         → TypeScript interfaces matching backend DTOs
```

**Design tokens (theme.ts):**
- Primary: Gold `#725b28`, Secondary: Sage green `#516351`, Background: Warm ivory `#faf9f6`
- Typography: Georgia/Noto Serif (headings), System-ui/Manrope (body)
- Shadows: soft ambient only (0px 8px 24px @ 6% opacity) — no dark drop shadows

**Admin impersonation:** Admins can impersonate any guest via `ImpersonationContext`. The `SimulatedTimeContext` allows dev-time travel to test feature flag unlocking.

### Infrastructure & CI/CD

- **Local:** Docker Compose — SQL Server 2022 (port 1433), .NET API (port 5000), Expo dev server (port 3000)
- **Backend deploy:** GitHub Actions → Docker build → GHCR → Azure Container Apps
- **Frontend deploy:** GitHub Actions → `expo export` → Azure Static Web Apps (from `dist/`)
- **Secrets:** GitHub Secrets → Azure Container Apps environment variables (no `.env` in production)

---

## Key Conventions

- **Slovak UI strings:** All user-facing text goes in `constants/copy.ts`, not inline.
- **New API types:** Add TypeScript interfaces to `frontend/wedding-app/types/api.ts` to match backend DTOs.
- **Routing guards:** Role checks happen in each route group's `_layout.tsx` via `AuthContext`.
- **EF migrations:** Always use `--project` and `--startup-project` flags targeting the correct projects.
- **Install flag:** Frontend always needs `--legacy-peer-deps` due to Expo/React 19 peer dep conflicts.

## Test Logins (Development)

| Role | Login Name |
|------|-----------|
| Guest | Any name from the guest list (75 guests seeded) |
| Admin | `maduadmin` |
| DJ | `djmiles` |
| Master of Ceremony | `madumc` |