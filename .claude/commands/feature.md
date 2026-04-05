Scaffold a complete full-stack feature for the WeddingApp named: $ARGUMENTS

Before writing anything, read one existing similar feature to match the patterns exactly.

## Backend (in order)

1. **Domain entity** (if new data needed): `backend/WeddingApp.Domain/Entities/{Feature}.cs`
   - Inherit from `BaseEntity`, add navigation properties, no logic

2. **Application layer** in `backend/WeddingApp.Application/{Feature}/`:
   - `DTOs/{Feature}Dto.cs` — response shape
   - `Commands/Create{Feature}Command.cs` + `Handler` + `Validator`
   - `Queries/Get{Feature}Query.cs` + `Handler`
   - Add List query if the feature is a collection

3. **Infrastructure**:
   - `Data/Configurations/{Feature}Configuration.cs` — EF Core fluent config
   - Add `DbSet<{Feature}>` to `AppDbContext`
   - Add migration: `dotnet ef migrations add Add{Feature} --project WeddingApp.Infrastructure --startup-project WeddingApp.Api`

4. **API**: `backend/WeddingApp.Api/Controllers/{Feature}Controller.cs`
   - Follow kebab-case routes: `/api/v1/{feature-name}`
   - Add `[Authorize(Roles = "...")]` as appropriate

## Frontend (in order)

5. **Types**: Add interface(s) to `frontend/wedding-app/types/api.ts`

6. **Screen**: `frontend/wedding-app/app/(guest or admin)/{feature-name}.tsx`
   - Use only `theme.ts` tokens
   - Put Slovak strings in `constants/copy.ts`
   - Use React Query for data fetching

7. **Navigation**: If needed, add entry to the dashboard or nav in the appropriate `_layout.tsx`

Show me each file before creating it. Do not run `dotnet ef database update` without asking me first.