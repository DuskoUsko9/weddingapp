Create and apply an EF Core migration named: $ARGUMENTS

Steps:

1. First show me which entities/DbContext changes are pending (read the current DbContext and recent model changes)

2. Add the migration:
```bash
cd backend && dotnet ef migrations add $ARGUMENTS --project WeddingApp.Infrastructure --startup-project WeddingApp.Api
```

3. Read the generated migration file in `backend/WeddingApp.Infrastructure/Data/Migrations/` and show me its full content

4. Ask for my confirmation before running the update

5. After my approval, apply it:
```bash
cd backend && dotnet ef database update --project WeddingApp.Infrastructure --startup-project WeddingApp.Api
```

6. Confirm success by checking the output.

Do NOT run `database update` automatically — always wait for my go-ahead after showing the migration.