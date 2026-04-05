Run pre-deploy compile checks on both backend and frontend.

## Backend build

```bash
cd backend && dotnet build --no-restore -c Release 2>&1
```

## Frontend type check

```bash
cd frontend/wedding-app && npx tsc --noEmit 2>&1
```

Run both, then report:

- ✅ Backend build: OK / ❌ N errors
- ✅ Frontend types: OK / ❌ N errors

If either fails, show the full error output and stop — do NOT suggest deploying until both pass.

If both pass, show the last 3 git commits and ask if I want to trigger a deploy.