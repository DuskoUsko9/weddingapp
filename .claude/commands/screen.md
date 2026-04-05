Create a new Expo Router screen: $ARGUMENTS

Expected format: `<screen-name> <role>` — e.g. `song-history guest` or `bingo-results admin`

Before writing, read an existing screen in the same route group (`app/(<role>)/`) to match its structure.

## Rules

- File path: `frontend/wedding-app/app/(<role>)/<screen-name>.tsx`
- Design tokens: import ONLY from `constants/theme.ts` — no hardcoded colors, spacing, or fonts
- Slovak strings: add to `constants/copy.ts`, import from there
- API calls: use `services/api.ts` — never `fetch()`
- Types: add any new response shapes to `types/api.ts`
- Data: use React Query `useQuery`/`useMutation`
- Auth: use `useAuth()` from `store/AuthContext` if role checking needed
- Feature flags: if this screen is behind a feature flag, check availability first

## Structure template

```tsx
import { theme } from '../../constants/theme'
import { copy } from '../../constants/copy'
import { api } from '../../services/api'
import { useQuery } from '@tanstack/react-query'

export default function ScreenName() {
  // data fetching with useQuery
  // loading/error states
  // render with theme tokens only
}
```

Show me the file content before creating it.