Audit all backend DTOs against frontend TypeScript types and fix any mismatches.

## Step 1 — Collect backend DTOs

Read every `*.cs` file in `backend/WeddingApp.Application/**/DTOs/` and extract:
- Class/record name
- All public properties with their C# types
- Nullable annotations (`string?` vs `string`)

## Step 2 — Read frontend types

Read `frontend/wedding-app/types/api.ts` completely.

## Step 3 — Compare and report

For each backend DTO, find the matching TypeScript interface. Report:

| Backend DTO | Frontend Interface | Status |
|-------------|-------------------|--------|
| `GuestDto` | `Guest` | ✅ Match |
| `MenuItemDto` | — | ❌ Missing |
| — | `OldType` | ⚠️ No backend DTO |

Also flag:
- Property name mismatches (PascalCase vs camelCase is expected — note it, don't flag as error)
- Type mismatches (e.g. `Guid` → should be `string`, `DateTime` → `string`, `bool` → `boolean`)
- Nullable mismatches (`string?` in C# → should be `string | null` or `string | undefined` in TS)
- Missing required properties

## Step 4 — Fix

After showing the report, fix all issues in `frontend/wedding-app/types/api.ts`.

C# → TypeScript type mappings:
- `string` → `string`, `string?` → `string | null`
- `Guid` → `string`, `Guid?` → `string | null`
- `int`, `decimal` → `number`
- `bool` → `boolean`
- `DateTime` → `string` (ISO 8601)
- `List<T>` → `T[]`