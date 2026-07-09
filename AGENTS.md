# Product: Barbers Bay

Barbers Bay is a **multi-location salon & barbershop booking platform** built as a mobile-first React Native app.

## What It Is

A SaaS-style, multi-tenant booking system (comparable to Booksy / Fresha) that lets customers discover, book, and pay for appointments across multiple salon locations owned by a single operator.

## Core User Roles

- **Customer** — browses salons, books/reschedules/cancels appointments, pays in-app, leaves reviews
- **Barber** — manages own availability, services, client notes, and portfolio; largely self-employed
- **Salon Manager** — manages a single location's schedule, staff, and reporting
- **Owner / Super Admin** — oversees all salon locations from one dashboard with full reporting and config control

## Key Capabilities

- Appointment booking with real-time availability (prevents double-booking)
- Multi-location management from a single owner account
- In-app payments via third-party gateway (e.g., Stripe)
- Automated reminders (push, email, SMS) and post-appointment review prompts
- Barber-specific portfolio, private client notes, and personal waitlist
- Revenue, occupancy, and no-show reporting at owner and barber level
- Social media integration (Facebook/Instagram posting) and Telegram confirmation bot
- Unified communication inbox

## Design Reference

Figma prototype: https://www.figma.com/design/vPw5w8BmdJW4vNflQxWwla/personal
Primary coverage: customer onboarding, discovery, booking flow, appointment management, reviews.
Admin/barber screens are outstanding deliverables.




<!-- strcuture -->

# Project Structure

```
src/
├── app/                  # Expo Router screens (file-based routing)
│   ├── _layout.tsx       # Root layout — providers, Stack navigator
│   ├── index.tsx         # Home screen
│   └── +not-found.tsx    # 404 fallback
│
├── components/           # Shared, reusable UI components
│   ├── container.tsx     # Base screen wrapper (safe area + optional scroll)
│   └── theme-toggle.tsx  # Light/dark theme switch
│
├── contexts/             # React context providers and hooks
│   └── app-theme-context.tsx
│
├── lib/                  # Utilities, configs, non-UI modules
│   └── env.ts            # Type-safe env vars
│
├── assets/
│   └── images/           # Static image assets
│
└── global.css            # Tailwind + Uniwind + HeroUI Native CSS entry
```

## Conventions

### File & Folder Naming
- All files and folders use **kebab-case** (e.g., `app-theme-context.tsx`, `theme-toggle.tsx`)
- Screen files live directly in `src/app/` following Expo Router conventions
- Group related screens with route groups: `src/app/(group)/screen.tsx`

### Component Pattern
- Named exports for components (not default exports, except for Expo Router screens)
- Props typed inline with `type Props = ...` above the component
- Use `PropsWithChildren<Props>` when children are accepted
- Wrap third-party components with `withUniwind()` to enable `className` prop (e.g., `withUniwind(Ionicons)`)

### Styling
- Use **className** with Uniwind/Tailwind utility classes exclusively — no `StyleSheet.create()`
- Use **semantic color tokens** from HeroUI Native (`text-foreground`, `bg-background`, `bg-content1`, `text-primary`, `text-default-400`, etc.)
- Use `cn()` from `heroui-native` for conditional class merging
- Apply safe area insets via `useSafeAreaInsets()` in the `Container` component — do not re-apply in individual screens

### Provider Stack (Root Layout)
Providers must be nested in this order in `_layout.tsx`:
1. `GestureHandlerRootView` (outermost)
2. `KeyboardProvider`
3. `AppThemeProvider`
4. `HeroUINativeProvider`
5. Navigator (Stack/Drawer)

### Context Pattern
- Context value built with `useMemo` to prevent unnecessary re-renders
- Callbacks stabilised with `useCallback`
- Export both the Provider (`AppThemeProvider`) and the hook (`useAppTheme`) from the same file
- Hook throws if used outside its provider

### Path Aliases
- `@/*` maps to `src/*` — always use this alias for internal imports
  ```ts
  import { Container } from "@/components/container";
  ```

### Environment Variables
- Add new vars to `src/lib/env.ts` with a Zod schema
- Client vars must be prefixed `EXPO_PUBLIC_`
- Never access `process.env` directly — always import from `@/lib/env`

### TypeScript
- Strict mode enabled; `noUnusedLocals` and `noUnusedParameters` are errors
- Use `type` imports (`import type`) for type-only imports (`verbatimModuleSyntax` is on)
- `noUncheckedIndexedAccess` is enabled — handle possible `undefined` on array/object access


<!-- tech -->

# Tech Stack

## Runtime & Framework

- **React Native 0.83** with **React 19**
- **Expo SDK 55** with **Expo Router 55** (file-based routing, typed routes enabled)
- **React Compiler** enabled via Expo experiments (`reactCompiler: true`)

## Styling

- **Uniwind** — Tailwind-for-React-Native utility classes via `withUniwind()` HOC; configured in `metro.config.js`
- **Tailwind CSS 4** — underlying utility system; CSS entry at `src/global.css`
- **HeroUI Native** — component library providing tokens (`cn`, semantic color names like `text-foreground`, `bg-content1`, `bg-primary`)
- **tailwind-variants** and **tailwind-merge** — for composing and merging class strings
- Use semantic color tokens (`foreground`, `background`, `primary`, `default-400`, etc.) rather than hardcoded colors

## Navigation

- **Expo Router** (file-based) — screens live in `src/app/`
- **React Navigation Drawer** available for drawer-style navigation

## Animations & Gestures

- **React Native Reanimated 4** — all animations; use `Animated.View`, `ZoomIn`, `FadeOut`, etc.
- **React Native Gesture Handler** — wrap root in `<GestureHandlerRootView style={{ flex: 1 }}>`
- **React Native Worklets** — for worklet-based animation logic

## Forms & Validation

- **Zod 4** — schema validation
- **@t3-oss/env-core** — type-safe environment variables (see `src/lib/env.ts`)

## UI Utilities

- **@gorhom/bottom-sheet** — bottom sheet modals
- **expo-haptics** — haptic feedback (iOS-gated: `if (Platform.OS === 'ios')`)
- **react-native-keyboard-controller** — wrap root in `<KeyboardProvider>`
- **react-native-safe-area-context** — `useSafeAreaInsets()` for safe area padding
- **@expo/vector-icons** (Ionicons) — icon set; use `withUniwind(Ionicons)` to apply className styling

## Package Manager & Build

- **Bun** — package manager (`bun.lock` present)
- **Metro** — bundler (configured in `metro.config.js` with Reanimated + Uniwind wrappers)

## Linting & Formatting

- **Biome 2** — extends `ultracite/biome/core`; runs via `ultracite`
- **oxlint** + **oxfmt** — fast lint/format tools run as pre-commit hooks via **Lefthook**
- **Knip** — unused exports/files detection

## Common Commands

```bash
# Start dev server (clear cache)
bun dev

# Start dev server (no clear)
bun start

# Run on Android
bun android

# Run on iOS
bun ios

# Type-check (no emit)
bun check-types

# Lint check
bun check

# Lint fix
bun fix

# Find unused code
bun knip

# Prebuild native (clean)
bun prebuild
```

## Environment Variables

Defined and validated in `src/lib/env.ts` using `@t3-oss/env-core` + Zod.
All client-side vars must be prefixed `EXPO_PUBLIC_`.





<!-- BEGIN:behavioral-guidelines -->

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Restricted file or this file: you don't need to edit.

- node_modules/
- android
  These are the files that are restricted and not only that. That folder or file that is mentioned in the.gitignore, do not edit or modify anything on that particular file or folder.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

<!-- END:behavioral-guidelines -->