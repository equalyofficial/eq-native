# Native Theme Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a native-only full-screen circular reveal when the user changes theme from the Appearance selector on the profile screen.

**Architecture:** A root-level theme transition provider coordinates theme swaps, snapshot capture, and overlay state. A Skia overlay renders the frozen outgoing UI and reveals the newly themed app underneath with a Reanimated-driven radial mask that starts from the tapped theme option.

**Tech Stack:** Expo Router, React Native, Uniwind, react-native-reanimated, @shopify/react-native-skia, react-native-view-shot, TypeScript

---

### Task 1: Install native transition dependencies

**Files:**
- Modify: `package.json`
- Modify: `bun.lock`

- [x] **Step 1: Install the native dependencies with bun**

Run:

```bash
bun add @shopify/react-native-skia react-native-view-shot
```

Expected: bun updates `package.json` and `bun.lock` with both dependencies.

- [x] **Step 2: Verify the dependencies are recorded**

Run:

```bash
rg -n "\"@shopify/react-native-skia\"|\"react-native-view-shot\"" package.json
```

Expected: both packages appear in `dependencies`.

### Task 2: Add shared transition types and root controller

**Files:**
- Create: `components/theme/theme-transition.types.ts`
- Create: `components/theme/theme-transition-provider.tsx`
- Modify: `app/_layout.tsx`

- [x] **Step 1: Add the shared transition types**

Create `components/theme/theme-transition.types.ts` with:

```ts
import type { ProfileThemeOption } from "@/features/profile/profile.data";

export type ThemeTransitionRequest = {
  nextTheme: ProfileThemeOption;
  originX: number;
  originY: number;
};

export type ThemeTransitionSnapshot = {
  uri: string;
  width: number;
  height: number;
};

export type ThemeTransitionState = {
  nextTheme: ProfileThemeOption;
  originX: number;
  originY: number;
  snapshot: ThemeTransitionSnapshot | null;
  progress: number;
  isActive: boolean;
};
```

- [x] **Step 2: Add the root provider**

Create `components/theme/theme-transition-provider.tsx` with a provider and hook that:

```tsx
const ThemeTransitionContext = createContext<{
  startThemeTransition: (request: ThemeTransitionRequest) => Promise<void>;
  transitionState: ThemeTransitionState | null;
} | null>(null);
```

Implementation requirements:

- hold a ref to the root view used for capture,
- guard against overlapping transitions with `isTransitioningRef`,
- capture the root view using `captureRef`,
- call `Uniwind.setTheme(request.nextTheme)` after capture,
- animate a shared `progress` value from `0` to `1`,
- clear overlay state in the animation completion callback,
- fall back to `Uniwind.setTheme(request.nextTheme)` directly if capture fails.

- [x] **Step 3: Mount the provider in the root layout**

Update `app/_layout.tsx` so:

```tsx
<ThemeTransitionProvider>
  <Stack ... />
  <StatusBar ... />
</ThemeTransitionProvider>
```

Also wrap the stack content in a view that the provider can capture, rather than trying to capture the status bar or gesture root.

### Task 3: Add the Skia overlay renderer

**Files:**
- Create: `components/theme/theme-transition-overlay.tsx`
- Modify: `components/theme/theme-transition-provider.tsx`

- [x] **Step 1: Create the overlay component**

Create `components/theme/theme-transition-overlay.tsx` that accepts:

```ts
type ThemeTransitionOverlayProps = {
  snapshotUri: string;
  originX: number;
  originY: number;
  progress: SharedValue<number>;
  width: number;
  height: number;
};
```

Implementation requirements:

- render an absolutely positioned full-screen layer,
- load the captured image with Skia,
- compute the reveal radius from the tap origin to the farthest corner,
- use a circular clip or mask driven by `progress`,
- keep pointer events disabled so the overlay never traps input.

- [x] **Step 2: Connect the overlay to the provider**

Render the overlay from `theme-transition-provider.tsx` only while a transition snapshot exists:

```tsx
{transitionState?.snapshot ? (
  <ThemeTransitionOverlay
    snapshotUri={transitionState.snapshot.uri}
    originX={transitionState.originX}
    originY={transitionState.originY}
    progress={progress}
    width={transitionState.snapshot.width}
    height={transitionState.snapshot.height}
  />
) : null}
```

- [x] **Step 3: Verify fallback behavior stays intact**

Ensure `startThemeTransition(...)` still resolves and applies the theme when:

- `captureRef` throws,
- snapshot dimensions are unavailable,
- the overlay image fails to load.

### Task 4: Wire the profile theme selector to the transition controller

**Files:**
- Modify: `features/profile/components/profile-theme-selector.tsx`

- [x] **Step 1: Replace direct theme changes with measured transition requests**

Update the selector so each option:

- stores a ref to its pressable container,
- uses `measureInWindow(...)` to get the tile center,
- calls `startThemeTransition({ nextTheme, originX, originY })`,
- ignores presses for the already active theme.

Representative call:

```ts
startThemeTransition({
  nextTheme: option.value,
  originX: x + width / 2,
  originY: y + height / 2,
});
```

- [x] **Step 2: Preserve the existing card UI and local selector animations**

Keep:

- the current icon-based appearance card,
- the selector’s Reanimated active-pill motion,
- the current helper text for `system` resolution.

Only the theme-change side effect should move from `Uniwind.setTheme(...)` to the provider hook.

### Task 5: Verify the native transition end to end

**Files:**
- Modify: `docs/superpowers/plans/2026-04-05-native-theme-reveal.md`

- [x] **Step 1: Run static verification**

Run:

```bash
npm run lint
```

Expected: exit code `0`.

- [x] **Step 2: Run TypeScript verification**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code `0`.

- [x] **Step 3: Update the plan checkboxes to reflect completion**

Mark completed steps in this file after each task is actually done.

- [x] **Step 4: Record manual verification still required**

Manual verification remains required on iOS and Android for:

- radial reveal origin accuracy,
- full-screen coverage,
- `system` behavior,
- rapid-tap protection,
- fallback-to-instant-switch behavior.
