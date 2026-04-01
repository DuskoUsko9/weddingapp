# Architecture — MadU Wedding App

## Overview

Clean Architecture with 4 layers. Dependencies flow inward only.
MediatR for CQRS. FluentValidation for input validation. EF Core for data access.

```
API → Application → Domain
Infrastructure → Application → Domain
Domain has no external dependencies
```

---

## Solution Structure

```
WeddingApp.sln
│
├── WeddingApp.Domain              (no NuGet dependencies)
├── WeddingApp.Application         (depends on Domain)
├── WeddingApp.Infrastructure      (depends on Application + Domain)
└── WeddingApp.Api                 (depends on Application + Infrastructure)
```

---

## WeddingApp.Domain

Entities, value objects, enums, repository interfaces. No frameworks.

```
WeddingApp.Domain/
├── Entities/
│   ├── Guest.cs
│   ├── FeatureFlag.cs
│   ├── QuestionnaireResponse.cs
│   ├── SongRequest.cs
│   ├── ScheduleItem.cs
│   ├── MenuItem.cs
│   ├── MenuSection.cs
│   ├── StaticContent.cs
│   ├── LoveStoryEvent.cs
│   ├── BingoChallenge.cs
│   ├── GuestBingoProgress.cs    (Phase 2)
│   └── ThankYouMessage.cs       (Phase 3)
│
├── Enums/
│   ├── UserRole.cs               Guest | Admin | DJ | MasterOfCeremony
│   ├── AlcoholPreference.cs      Drinks | WineOnly | BeerOnly | NonDrinker
│   ├── SongRequestStatus.cs      Pending | Played | Skipped
│   ├── GuestSide.cs              Bride | Groom | Both
│   └── GuestCategory.cs          Family | Friends | Colleagues | Supplier
│
├── Interfaces/
│   ├── Repositories/
│   │   ├── IGuestRepository.cs
│   │   ├── IFeatureFlagRepository.cs
│   │   ├── IQuestionnaireRepository.cs
│   │   ├── ISongRequestRepository.cs
│   │   ├── IScheduleRepository.cs
│   │   ├── IMenuRepository.cs
│   │   ├── IStaticContentRepository.cs
│   │   └── ILoveStoryRepository.cs
│   └── IUnitOfWork.cs
│
└── Common/
    └── BaseEntity.cs              Id (Guid), CreatedAt, UpdatedAt
```

### Key Entity Design

```csharp
// BaseEntity — all entities inherit this
public abstract class BaseEntity
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

// Guest — central entity
public class Guest : BaseEntity
{
    public string FullName { get; set; }         // "Martin Fillo"
    public GuestSide Side { get; set; }          // Bride | Groom | Both
    public bool IsChild { get; set; }
    public int? AgeAtWedding { get; set; }
    public AlcoholPreference DefaultAlcohol { get; set; }  // from seed
    public string GuestType { get; set; }        // "Standard" | "After20"
    public GuestCategory Category { get; set; }
    public bool IsConfirmed { get; set; } = true;

    // Navigation
    public QuestionnaireResponse? QuestionnaireResponse { get; set; }
    public ICollection<SongRequest> SongRequests { get; set; }
}

// FeatureFlag — core of timed release engine
public class FeatureFlag : BaseEntity
{
    public string Key { get; set; }              // "questionnaire", "seating", etc.
    public string DisplayName { get; set; }      // human-readable Slovak name
    public bool IsManuallyEnabled { get; set; }  // admin override ON
    public bool IsManuallyDisabled { get; set; } // admin override OFF (takes priority)
    public DateTime? AvailableFrom { get; set; } // UTC auto-unlock datetime
    public DateTime? AvailableUntil { get; set; }// UTC auto-lock datetime
    public string[] RolesAllowed { get; set; } = []; // empty = all roles

    // Computed (not stored) — call this to check current state
    public bool IsCurrentlyEnabled(DateTime utcNow)
    {
        if (IsManuallyDisabled) return false;
        if (IsManuallyEnabled) return true;
        if (AvailableFrom.HasValue && utcNow < AvailableFrom.Value) return false;
        if (AvailableUntil.HasValue && utcNow > AvailableUntil.Value) return false;
        return AvailableFrom.HasValue; // must have at least AvailableFrom to be auto-enabled
    }
}

// SongRequest — DJ playlist feature
public class SongRequest : BaseEntity
{
    public Guid GuestId { get; set; }
    public Guest Guest { get; set; }
    public string SongName { get; set; }
    public string? Artist { get; set; }
    public string? Dedication { get; set; }      // max 120 chars
    public SongRequestStatus Status { get; set; } = SongRequestStatus.Pending;
}
```

---

## WeddingApp.Application

Use cases as MediatR Commands/Queries. DTOs. Validators. No infrastructure dependencies.

```
WeddingApp.Application/
├── Auth/
│   ├── Commands/
│   │   └── LoginCommand.cs           + Handler + Validator
│   └── DTOs/
│       └── LoginResultDto.cs         TokenType, Token, Role, GuestId, GuestName
│
├── Guests/
│   ├── Queries/
│   │   ├── SearchGuestsByNameQuery.cs + Handler
│   │   ├── GetGuestListQuery.cs       + Handler (admin)
│   │   └── GetGuestByIdQuery.cs       + Handler
│   └── DTOs/
│       └── GuestDto.cs
│
├── FeatureFlags/
│   ├── Queries/
│   │   └── GetAllFeatureFlagsQuery.cs + Handler
│   ├── Commands/
│   │   └── UpdateFeatureFlagCommand.cs + Handler + Validator (admin)
│   └── DTOs/
│       └── FeatureFlagDto.cs          Key, DisplayName, IsEnabled, AvailableFrom, etc.
│
├── Questionnaire/
│   ├── Commands/
│   │   └── SubmitQuestionnaireCommand.cs + Handler + Validator
│   ├── Queries/
│   │   ├── GetMyQuestionnaireQuery.cs   + Handler (guest)
│   │   └── GetAllResponsesQuery.cs      + Handler (admin)
│   └── DTOs/
│       └── QuestionnaireResponseDto.cs
│
├── SongRequests/
│   ├── Commands/
│   │   ├── CreateSongRequestCommand.cs  + Handler + Validator
│   │   └── UpdateSongRequestStatusCommand.cs + Handler (DJ/admin)
│   ├── Queries/
│   │   ├── GetAllSongRequestsQuery.cs   + Handler (DJ/admin)
│   │   └── GetMySongRequestsQuery.cs    + Handler (guest)
│   └── DTOs/
│       └── SongRequestDto.cs
│
├── Schedule/
│   ├── Queries/GetScheduleQuery.cs      + Handler
│   ├── Commands/
│   │   ├── CreateScheduleItemCommand.cs + Handler + Validator (admin)
│   │   ├── UpdateScheduleItemCommand.cs + Handler + Validator (admin)
│   │   └── DeleteScheduleItemCommand.cs + Handler (admin)
│   └── DTOs/ScheduleItemDto.cs
│
├── Menu/
│   ├── Queries/GetMenuQuery.cs
│   ├── Commands/ (CRUD, admin only)
│   └── DTOs/MenuItemDto.cs, MenuSectionDto.cs
│
├── StaticContent/
│   ├── Queries/GetStaticContentQuery.cs (by key: parking | accommodation)
│   ├── Commands/UpdateStaticContentCommand.cs (admin)
│   └── DTOs/StaticContentDto.cs
│
├── LoveStory/
│   ├── Queries/GetLoveStoryQuery.cs
│   ├── Commands/ (CRUD, admin only)
│   └── DTOs/LoveStoryEventDto.cs
│
├── Admin/
│   ├── Queries/GetAdminStatsQuery.cs    + Handler
│   └── DTOs/AdminStatsDto.cs
│
└── Common/
    ├── Interfaces/
    │   ├── IJwtService.cs
    │   ├── ICurrentUserService.cs        GuestId, Role, IsAuthenticated
    │   └── ISongRequestNotifier.cs       NotifyNewRequest(), NotifyStatusChanged()
    ├── Models/
    │   └── Result.cs                     Result<T> with IsSuccess, Error, Value
    ├── Behaviors/
    │   └── ValidationBehavior.cs         MediatR pipeline: validates before handler
    └── Exceptions/
        ├── NotFoundException.cs
        ├── ForbiddenException.cs
        └── FeatureDisabledException.cs
```

### Result Pattern

All handlers return `Result<T>` — never throw for business errors:

```csharp
public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }

    public static Result<T> Success(T value) => new(true, value, null);
    public static Result<T> Failure(string error) => new(false, default, error);
}
```

---

## WeddingApp.Infrastructure

EF Core, repositories, JWT, SignalR hub, Azure Blob (Phase 2).

```
WeddingApp.Infrastructure/
├── Data/
│   ├── WeddingAppDbContext.cs
│   ├── Configurations/                    EF Fluent API per entity
│   │   ├── GuestConfiguration.cs
│   │   ├── FeatureFlagConfiguration.cs
│   │   ├── SongRequestConfiguration.cs
│   │   └── ... (one per entity)
│   ├── Repositories/
│   │   ├── GuestRepository.cs
│   │   ├── FeatureFlagRepository.cs
│   │   ├── SongRequestRepository.cs
│   │   └── ... (one per interface)
│   ├── Migrations/                        EF Core generated
│   └── Seed/
│       ├── DataSeeder.cs                  orchestrates all seeders
│       ├── GuestSeed.cs                   all 75 guests
│       ├── FeatureFlagSeed.cs             all flags with unlock times
│       ├── ScheduleSeed.cs                placeholder schedule
│       ├── MenuSeed.cs                    placeholder menu
│       ├── StaticContentSeed.cs           parking + accommodation text
│       ├── LoveStorySeed.cs               full love story timeline
│       └── BingoChallengeSeed.cs          12 bingo challenges
│
├── Auth/
│   └── JwtService.cs                      signs + validates JWTs
│
├── SignalR/
│   └── SongRequestHub.cs                  real-time DJ notifications
│
├── Services/
│   ├── FeatureFlagService.cs              IsEnabled(key, role, utcNow)
│   ├── CurrentUserService.cs              reads JWT claims from HttpContext
│   └── SongRequestNotifier.cs            ISongRequestNotifier → calls Hub
│
└── DependencyInjection.cs                 AddInfrastructure(services, config)
```

---

## WeddingApp.Api

Controllers, middleware, SignalR endpoint registration, Program.cs.

```
WeddingApp.Api/
├── Controllers/
│   ├── AuthController.cs           POST /api/v1/auth/login
│   ├── GuestsController.cs         GET  /api/v1/guests/search
│   ├── FeatureFlagsController.cs   GET/PATCH /api/v1/feature-flags
│   ├── QuestionnaireController.cs  GET/POST /api/v1/questionnaire
│   ├── SongRequestsController.cs   GET/POST/PATCH /api/v1/song-requests
│   ├── ScheduleController.cs       GET/POST/PUT/DELETE /api/v1/schedule
│   ├── MenuController.cs           GET/POST/PUT/DELETE /api/v1/menu
│   ├── StaticContentController.cs  GET/PUT /api/v1/static-content/{key}
│   ├── LoveStoryController.cs      GET/POST/PUT/DELETE /api/v1/love-story
│   └── AdminController.cs          GET /api/v1/admin/stats
│
├── Middleware/
│   ├── ExceptionHandlingMiddleware.cs    maps exceptions to HTTP responses
│   └── RequestLoggingMiddleware.cs       structured request logs
│
├── Filters/
│   └── RequireFeatureAttribute.cs        [RequireFeature("seating")] on actions
│
├── Extensions/
│   ├── ServiceCollectionExtensions.cs    JWT, CORS, SignalR, Swagger setup
│   └── ApplicationBuilderExtensions.cs  middleware pipeline
│
└── Program.cs
```

### Program.cs Structure

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();        // MediatR, FluentValidation
builder.Services.AddInfrastructure(builder.Configuration);  // EF, JWT, SignalR, repos
builder.Services.AddApiServices(builder.Configuration);     // Controllers, CORS, Swagger

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    await app.SeedDatabaseAsync();  // runs seed data in dev only
}

app.UseExceptionHandling();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<SongRequestHub>("/hubs/song-requests");

app.Run();
```

---

## Authentication Flow (JWT, no passwords)

### Guest Login
```
POST /api/v1/auth/login  { "name": "Martin Fillo" }

1. Check if name matches special token (maduadmin, djmiles, starejsi)
   → Yes: issue JWT with appropriate role, no guest lookup
   → No: continue

2. Search guests table: WHERE LOWER(full_name) = LOWER(input) OR similarity > 0.7
   → 0 matches: return 404 with Slovak message
   → 1 match: issue JWT for that guest
   → 2+ matches: return 200 with list of matches (no JWT yet)

3. If disambiguation needed:
   POST /api/v1/auth/confirm  { "guestId": "uuid" }
   → Validate guestId exists
   → Issue JWT for that guest

JWT payload:
{
  "sub": "guest-uuid",          (or "system-djmiles" for special roles)
  "name": "Martin Fillo",
  "role": "Guest",              Guest | Admin | DJ | MasterOfCeremony
  "iat": ...,
  "exp": ... (7 days)
}

Token stored in: AsyncStorage (React Native) / localStorage (web)
```

### Authorization Attributes

```csharp
// Role-based
[Authorize(Roles = "Admin")]
[Authorize(Roles = "Admin,MasterOfCeremony")]

// Feature-based (custom attribute)
[RequireFeature("questionnaire")]   // returns 403 if feature disabled

// Combined
[Authorize(Roles = "Admin")]
[RequireFeature("seating")]
```

---

## SignalR — Real-time DJ Song Requests

### Architecture

```
Guest submits song (REST POST)
        ↓
SongRequestsController
        ↓
CreateSongRequestCommand Handler
        ↓
Song saved to DB
        ↓
ISongRequestNotifier.NotifyNewRequest(songRequestDto)
        ↓
SongRequestNotifier (Infrastructure)
        ↓
IHubContext<SongRequestHub>.Clients.Group("dj").SendAsync("NewSongRequest", dto)
        ↓
DJ client receives event → updates queue list in real-time
```

### Hub Definition

```csharp
public class SongRequestHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
        if (role == "DJ" || role == "Admin")
            await Groups.AddToGroupAsync(Context.ConnectionId, "dj");

        await base.OnConnectedAsync();
    }
}
```

### Client Events (Server → Client)
- `NewSongRequest(SongRequestDto)` — new request arrived
- `SongRequestUpdated(SongRequestDto)` — status changed (Played/Skipped)

### Client Connection (React Native / Expo Web)
```typescript
const connection = new HubConnectionBuilder()
  .withUrl(`${API_BASE}/hubs/song-requests`, {
    accessTokenFactory: () => getStoredToken()
  })
  .withAutomaticReconnect()
  .build();

connection.on("NewSongRequest", (request: SongRequestDto) => {
  // prepend to queue list
});
```

---

## Feature Flag Mechanism (detailed)

### Resolution Logic

```csharp
public bool IsEnabled(string key, string? role, DateTime utcNow)
{
    var flag = await _repo.GetByKey(key);
    if (flag == null) return false;

    // Admin override OFF takes highest priority
    if (flag.IsManuallyDisabled) return false;

    // Admin override ON
    if (flag.IsManuallyEnabled) return true;

    // Role restriction
    if (flag.RolesAllowed.Length > 0 && role != null)
        if (!flag.RolesAllowed.Contains(role)) return false;

    // Time-based auto rules
    if (flag.AvailableFrom.HasValue && utcNow < flag.AvailableFrom.Value)
        return false;

    if (flag.AvailableUntil.HasValue && utcNow > flag.AvailableUntil.Value)
        return false;

    // Must have at least AvailableFrom set to auto-enable
    return flag.AvailableFrom.HasValue;
}
```

### RequireFeature Attribute

```csharp
public class RequireFeatureAttribute : ActionFilterAttribute
{
    public RequireFeatureAttribute(string featureKey) { ... }

    public override async Task OnActionExecutionAsync(...)
    {
        var role = context.HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
        var isEnabled = await _flagService.IsEnabled(_key, role, DateTime.UtcNow);

        if (!isEnabled)
        {
            context.Result = new ObjectResult(new { error = "Feature not available" })
            {
                StatusCode = 403
            };
            return;
        }
        await next();
    }
}
```

### Frontend Feature Flag Cache

```typescript
// Fetched once on app load, refreshed every 5 minutes
const { data: flags } = useQuery({
  queryKey: ['feature-flags'],
  queryFn: () => api.get('/feature-flags'),
  staleTime: 5 * 60 * 1000,
  refetchInterval: 5 * 60 * 1000,
});

// Usage in component
const isSeatingEnabled = useFeatureFlag('seating');
if (!isSeatingEnabled) return <LockedFeatureScreen unlockDate="5.9.2026" />;
```

---

## NuGet Packages

### WeddingApp.Domain
- None (pure C#)

### WeddingApp.Application
- MediatR (12.x)
- FluentValidation.DependencyInjectionExtensions (11.x)
- Microsoft.Extensions.Logging.Abstractions

### WeddingApp.Infrastructure
- Microsoft.EntityFrameworkCore (8.x)
- Npgsql.EntityFrameworkCore.PostgreSQL (8.x)
- Microsoft.AspNetCore.SignalR (built-in .NET 8)
- Microsoft.AspNetCore.Authentication.JwtBearer (8.x)
- System.IdentityModel.Tokens.Jwt (7.x)
- Azure.Storage.Blobs (12.x) — Phase 2

### WeddingApp.Api
- Microsoft.AspNetCore (built-in .NET 8)
- Swashbuckle.AspNetCore (6.x) — Swagger
- Serilog.AspNetCore (8.x) — structured logging

---

## Logging Strategy

Using Serilog with structured logging:

```csharp
Log.Information("Guest {GuestName} logged in with role {Role}", name, role);
Log.Warning("Feature {FeatureKey} access denied for role {Role}", key, role);
Log.Information("Song request created: {SongName} by guest {GuestId}", song, guestId);
```

Local: console + file sink
Production: Azure Application Insights (via Serilog sink)

**What we log:**
- All logins (success + failure) with guest name + role
- Feature flag access denials
- Song request creation
- Admin actions (flag changes, content edits)
- Unhandled exceptions

**What we do NOT log:**
- Questionnaire content (allergies are sensitive-ish)
- JWT tokens
- Full request/response bodies
