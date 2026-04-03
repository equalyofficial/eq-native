# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # Start Expo dev server
npm run android        # Start on Android emulator
npm run ios            # Start on iOS simulator
npm run web            # Start on web
npm run lint           # Run ESLint
npm run api:types      # Regenerate TypeScript types from api.json OpenAPI spec
npx expo start --clear # Start with cleared Metro cache (use after config changes)
bunx expo-doctor       # Check for SDK/dependency issues
```

## Architecture

**Expo SDK 55** app using **expo-router** (file-based routing), React Native 0.83, React 19.2. TypeScript strict mode. Path alias `@/*` maps to the project root.

### Styling — Uniwind (NOT NativeWind)
All styling uses **Uniwind** (`uniwind.dev`) — Tailwind CSS v4 for React Native. Config is in `global.css` (imported in `app/_layout.tsx`, never in the entry point). All React Native core components accept `className` natively via Uniwind — never use `withUniwind` on them. Only use `withUniwind` for third-party components (e.g. `expo-blur`). No `tailwind.config.js` — all theme config goes in `global.css` via `@theme` and `@layer theme`. Dynamic classNames must use complete string literals — template literals with variables will not work at build time.

**Theme tokens** (defined in `global.css`, usable as Tailwind classes):
- `bg-background` / `text-foreground` — main surface/text
- `bg-card` / `text-muted` — secondary surfaces
- `border-border` — borders
- Light: white background, black text. Dark: pure black background, white text (Uber-like).

**Font**: Outfit loaded via `@expo-google-fonts/outfit`. Available as `font-sans` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700) in Tailwind classes. Font names in `constants/theme.ts` `Fonts` export match exactly.

### API Layer — openapi-fetch + TanStack Query
Backend is a separate Elysia repo. Types are generated from `api.json` (OpenAPI spec) — run `npm run api:types` after backend changes.

```
lib/
  api.ts          ← openapi-fetch client; setAuthToken() / clearAuthToken() for bearer middleware
  api-types.ts    ← generated from api.json — never edit manually
  api-error.ts    ← ApiError class, parseApiError(), isApiError()
  query.ts        ← QueryClient (5min staleTime, retry 2)
  schemas.ts      ← shared Zod primitives (PhoneSchema, PasswordSchema, etc.)

features/<module>/
  <module>.types.ts    ← types extracted from operations in api-types.ts
  <module>.schemas.ts  ← Zod schemas for form validation
  <module>.keys.ts     ← TanStack Query key factories
  <module>.api.ts      ← pure async functions; throw ApiError on failure, return data.data
  <module>.hooks.ts    ← useMutation / useQuery wrappers
  index.ts             ← barrel (hooks + schemas + types only; never re-exports *.api.ts)
```

**Import rule**: screens import from `@/features/<module>` barrel. Only internal files import from `*.api.ts` directly.

All API success responses follow `{ success: true, data: T, message: string }`. Error responses follow `{ success: false, error: { code, message, details? } }`. The `parseApiError()` utility normalises raw error responses into `ApiError` instances.

### State — Zustand
`store/use-auth-store.ts` — auth tokens + `isAuthenticated`. `setTokens()` automatically calls `setAuthToken()` on the api client. `clearTokens()` calls `clearAuthToken()` and is called by `useLogout` along with `queryClient.clear()` to wipe all cached data on session end.

### Navigation
expo-router file-based routing. Root layout: `app/_layout.tsx` (QueryClientProvider → SafeAreaProvider → ThemeProvider → Stack). Two tabs: Home (`index`) and Profile (`profile`). Tab bar uses `expo-blur` BlurView background (wrapped with `withUniwind`).

### Key Constraints
- `withUniwindConfig` must be the **outermost** wrapper in `metro.config.js`
- `global.css` must be imported in `app/_layout.tsx`, not in the entry point (`expo-router/entry`)
- Splash screen stays visible until Outfit fonts are loaded (`useFonts` + `SplashScreen.hideAsync`)
- `newArchEnabled` is not in `app.json` — SDK 55 always uses new architecture
- `edgeToEdgeEnabled` is not in `app.json` — SDK 55 removed this field
