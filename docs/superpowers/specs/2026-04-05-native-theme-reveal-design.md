# Native Theme Reveal Design

## Goal

Add a premium theme-change transition for iOS and Android where changing `Light`, `Dark`, or `System` from the Appearance tab triggers a full-screen circular reveal from the tapped option instead of an instant swap.

## Scope

- Native only: iOS and Android.
- Triggered only from the Appearance selector in the profile screen.
- Covers the full mounted app UI while the theme changes underneath.
- Falls back to the current instant theme switch if the transition cannot capture or render correctly.

## Out Of Scope

- Web support.
- Theme changes initiated from anywhere else in the app.
- Reworking the app’s broader theme token system.
- Adding persistent user preference storage beyond the current `Uniwind` theme handling.

## Current State

- The theme selector lives in `features/profile/components/profile-theme-selector.tsx`.
- App-wide theme resolution is handled in `app/_layout.tsx` and `hooks/use-effective-color-scheme.ts`.
- `react-native-reanimated` is already installed and configured.
- Theme switching currently happens immediately via `Uniwind.setTheme(...)`.

## Recommended Architecture

Implement a global theme-transition layer mounted near the root layout. The Appearance selector will no longer call `Uniwind.setTheme(...)` directly. Instead, it will request a native transition by passing the selected theme option and the tap origin coordinates to a small controller. The controller will coordinate snapshot capture, overlay presentation, theme swap, and radial reveal animation.

This keeps the animation logic centralized and ensures the transition covers the whole visible app, not just the profile screen. It also avoids duplicating transition code inside feature components.

## Components

### 1. Theme Transition Controller

Add a root-level controller that exposes a method like `startThemeTransition({ nextTheme, originX, originY })`.

Responsibilities:

- prevent overlapping theme transitions,
- render and dismiss the full-screen transition overlay,
- capture the outgoing UI,
- switch the underlying app theme,
- drive the reveal animation state,
- fall back to a direct theme change on failure.

This controller should be reachable through a small React context or hook so the appearance selector can trigger it without prop drilling.

### 2. Theme Transition Overlay

Add a native-only overlay component mounted above the app stack in `app/_layout.tsx`.

Responsibilities:

- cover the whole screen using absolute positioning,
- render the captured outgoing snapshot,
- apply a Skia circular mask that expands from the tap origin,
- animate reveal progress with `react-native-reanimated`,
- clean up captured assets when the animation ends.

The overlay should be inert when no transition is active.

### 3. Appearance Selector Trigger Integration

Update `features/profile/components/profile-theme-selector.tsx` so each option press measures the tapped tile center and invokes the transition controller instead of calling `Uniwind.setTheme(...)` directly.

Responsibilities:

- ignore presses when the selected option is already active,
- pass stable native screen coordinates for the reveal origin,
- preserve the existing selector UI and local motion design,
- continue to support `light`, `dark`, and `system`.

## Animation Flow

1. User taps a theme option in the Appearance selector.
2. The selector measures the pressed option and sends its center coordinates with the target theme.
3. The controller captures the current screen image.
4. The controller shows the overlay containing the captured outgoing screen.
5. The controller updates the app theme underneath the overlay.
6. The overlay animates a circular reveal from the captured tap origin until the new themed UI is fully visible.
7. The overlay unmounts and releases capture resources.

## Rendering Strategy

Use `@shopify/react-native-skia` for the overlay mask rendering and `react-native-reanimated` for reveal progress.

The overlay should render:

- the captured outgoing UI image as the top layer,
- a circular mask that cuts through that image,
- optional subtle edge softness only if it does not hurt frame rate.

The reveal radius should be computed from the tap origin to the farthest viewport corner so the animation fully covers the screen on any device size.

## Failure Handling

If snapshot capture fails, origin measurement fails, or the overlay cannot initialize:

- log the error in development,
- call `Uniwind.setTheme(nextTheme)` directly,
- skip the reveal animation,
- ensure the app remains interactive.

If a transition is already in progress, ignore additional requests until completion.

## Platform Rules

- iOS and Android: full Skia reveal transition enabled.
- Web: no implementation required in this work.

Use `Platform.OS` guards so the native transition code does not run on web.

## Testing Strategy

There is no existing automated test harness in the repo for this UI path. Verification should be done with:

- `npm run lint`,
- manual device or simulator testing on iOS,
- manual device or simulator testing on Android.

Manual verification checklist:

- pressing `Light`, `Dark`, and `System` starts the reveal from the tapped option,
- the reveal covers the entire visible UI,
- the final theme state matches the selected option,
- `System` resolves to the current device theme after the animation,
- repeated taps during an active transition do not break state,
- fallback path still applies the theme if capture fails.

## File Plan

- Modify `app/_layout.tsx` to mount the provider and overlay above the stack.
- Create `components/theme/theme-transition-provider.tsx` for transition state and control API.
- Create `components/theme/theme-transition-overlay.tsx` for the Skia render layer.
- Create `components/theme/theme-transition.types.ts` for shared transition payload and overlay state types.
- Modify `features/profile/components/profile-theme-selector.tsx` to trigger transitions with measured coordinates.
- Reuse `hooks/use-effective-color-scheme.ts` for resolved-theme messaging and state coherence.

## Risks And Mitigations

### Snapshot Capture Compatibility

Risk: reliable full-screen capture APIs vary by library and platform behavior.

Mitigation: choose a capture path supported by the selected dependency set, wrap it in one controller, and preserve a direct no-animation fallback.

### Frame Drops During Animation

Risk: masking a full-screen image can be expensive on lower-end devices.

Mitigation: keep the animation short, avoid extra blur effects in v1, and animate one reveal mask only.

### Theme State Races

Risk: rapid taps could desynchronize overlay state and actual theme state.

Mitigation: serialize transitions in the controller and ignore new requests while active.

## Success Criteria

- Theme changes from the Appearance selector feel intentional and premium.
- The reveal clearly starts from the tapped option.
- The whole visible app changes under the animation, not just the card background.
- The feature stays isolated to iOS and Android.
- Normal theme switching still works if the animated path fails.
