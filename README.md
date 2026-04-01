# MadU Wedding App 💍

Svadobná aplikácia pre Maťku & Dušana — 5. september 2026, Penzión Zemiansky Dvor, Surovce.

---

## Quick Start (Local Development)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### 1. Start the database

```bash
docker-compose up postgres pgadmin -d
```

- PostgreSQL available at `localhost:5432`
- pgAdmin available at `http://localhost:5050`
  - Email: `admin@wedding.local`
  - Password: `admin123`

### 2. Run the backend API

```bash
cd backend
dotnet restore
dotnet ef database update --project WeddingApp.Infrastructure --startup-project WeddingApp.Api
dotnet run --project WeddingApp.Api
```

API available at `http://localhost:5000`
Swagger UI at `http://localhost:5000/swagger`

The API automatically seeds all data on first run (Development environment only):
- 75 guests
- 13 feature flags with correct unlock times
- Placeholder schedule, menu, parking, accommodation
- Full love story timeline
- 12 bingo challenges

### 3. Run the frontend

```bash
cd frontend/wedding-app
npm install
npx expo start --web
```

PWA available at `http://localhost:8081`

---

## Test Logins

| Login name | Role | What you see |
|---|---|---|
| Any guest full name (e.g. `Martin Fillo`) | Guest | Full guest experience |
| `maduadmin` | Admin | Everything + admin panel |
| `djmiles` | DJ | Song request queue only |
| `starejsi` | MasterOfCeremony | Full guest view + questionnaire responses |

---

## Architecture

```
backend/          .NET 8 Clean Architecture API
  Domain/         Entities, enums, interfaces
  Application/    Use cases (MediatR), DTOs, validators
  Infrastructure/ EF Core, repositories, SignalR, JWT
  Api/            Controllers, middleware, Program.cs

frontend/
  wedding-app/    Expo + React Native Web (PWA)
    app/          Expo Router screens
    components/   Reusable UI components
    constants/    Design tokens, Slovak copy strings
    services/     API client, SignalR client
    store/        Auth context

docs/             Architecture, design, API contract
docker-compose.yml  Local PostgreSQL + pgAdmin + API
CLAUDE.md         Project rules for Claude Code sessions
```

---

## Key Design Decisions

- **PWA** via Expo + React Native Web (one codebase, native build possible later)
- **Passwordless login** — guests enter full name, special tokens for DJ/admin/starejší
- **Feature flags** — time-based unlock engine for all features
- **Content in DB** — all user-visible content manageable without code changes
- **SignalR** — real-time DJ song request queue
- **PostgreSQL** local + Azure (identical engine, no migration surprises)

---

## Environment Variables

### Backend (`backend/WeddingApp.Api/appsettings.Development.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=weddingapp;Username=wedding;Password=wedding123"
  },
  "Jwt": {
    "Secret": "local-dev-secret-minimum-32-chars-long!",
    "Issuer": "WeddingApp",
    "Audience": "WeddingAppUsers",
    "ExpiryDays": 7
  },
  "CORS": {
    "AllowedOrigins": ["http://localhost:8081", "http://localhost:19006"]
  }
}
```

### Frontend (`frontend/wedding-app/.env.local`)
```
EXPO_PUBLIC_API_URL=http://localhost:5000/api/v1
EXPO_PUBLIC_SIGNALR_URL=http://localhost:5000/hubs/song-requests
```

**Never commit secrets to git.** Production secrets go to Azure Key Vault.

---

## Useful Commands

```bash
# Add EF migration
dotnet ef migrations add <MigrationName> --project WeddingApp.Infrastructure --startup-project WeddingApp.Api

# Reset local DB (drops + recreates)
docker-compose down -v && docker-compose up postgres -d

# Run backend tests
dotnet test backend/WeddingApp.sln

# Build Expo web (PWA)
cd frontend/wedding-app && npx expo export --platform web

# Start full stack (DB + API + frontend separately)
docker-compose up postgres pgadmin -d
cd backend && dotnet run --project WeddingApp.Api &
cd frontend/wedding-app && npx expo start --web
```

---

## Docs

| File | Content |
|---|---|
| `docs/architecture.md` | Clean Architecture structure, entities, patterns |
| `docs/database-schema.md` | Full PostgreSQL DDL + seed data |
| `docs/api-contract.md` | All API endpoints with examples |
| `docs/implementation-plan.md` | Incremental delivery plan + backlog |
| `docs/design-system.md` | Colors, typography, components |
| `docs/screens.md` | All screens — purpose, components, states |
| `docs/information-architecture.md` | Navigation flows, IA map |
| `docs/stitch-prompt.md` | AI design prompt for Stitch |
| `docs/figma-make-prompt.md` | AI design prompt for Figma Make |
