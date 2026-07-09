# Project Structure

## Root Layout

```
Barbers-Bay/
├── src/                  # All application source code
├── .kiro/steering/       # AI steering rules
├── .agents/skills/       # Agent skill definitions
├── app.json              # Expo app configuration
├── biome.jsonc           # Linter/formatter config (extends ultracite)
├── metro.config.js       # Metro bundler config (Uniwind + Reanimated)
├── tsconfig.json         # TypeScript config
├── lefthook.yml          # Git hook definitions
└── PROJECT-BRD.md        # Business requirements document
```

## Source Directory (`src/`)

```
src/
├── app/                  # Expo Router screens (file-based routing)
│   ├── _layout.tsx       # Root layout — providers and navigation shell
│   ├── index.tsx         # Home screen
│   └── +not-found.tsx    # 404 fallback
├── components/           # Shared reusable UI components
│   ├── container.tsx     # Base scrollable/non-scrollable screen wrapper
│   └── theme-toggle.tsx  # Light/dark theme switcher
├── contexts/             # React context providers and hooks
│   └── app-theme-context.tsx
├── lib/                  # Utilities, helpers, config
│   └── env.ts            # Type-safe env vars via @t3-oss/env-core + zod
├── assets/
│   └── images/           # Static image assets
└── global.css            # Tailwind/Uniwind/HeroUI style entry point
```

## Conventions

### File Naming
- All files use **kebab-case**: `theme-toggle.tsx`, `app-theme-context.tsx`
- Screen files live directly in `src/app/` following Expo Router conventions
- Layout files are named `_layout.tsx`

### Imports
- Use the `@/` alias for all internal imports (e.g., `@/components/container`)
- Use `import type` for type-only imports (`verbatimModuleSyntax` is enforced)

### Components
- Named exports for components (not default, except Expo Router screens)
- Expo Router screen files use default exports
- Wrap third-party icon/native components with `withUniwind()` to enable `className` prop

### Providers (root layout order)
The `_layout.tsx` wraps the app in this order:
1. `GestureHandlerRootView` — gesture support
2. `KeyboardProvider` — keyboard-aware layouts
3. `AppThemeProvider` — theme context
4. `HeroUINativeProvider` — design system tokens

### Styling
- Use `className` with Tailwind/Uniwind utility classes — no inline `StyleSheet` objects
- Use HeroUI design tokens for colors: `text-foreground`, `bg-background`, `bg-content1`, `text-primary`, `text-default-400`, etc.
- Use `cn()` from `heroui-native` for conditional class merging
- Use `tailwind-variants` for component variant definitions

### Context Pattern
- Context + Provider + typed hook in a single file under `src/contexts/`
- Hook throws if used outside its provider
- Memoize context values with `useMemo`; memoize callbacks with `useCallback`

### Environment Variables
- All env vars defined and validated in `src/lib/env.ts`
- Client-side vars must be prefixed with `EXPO_PUBLIC_`
- Access via the `env` object — never read `process.env` directly elsewhere

### Screen Layout
- Wrap every screen in `<Container>` for consistent safe-area and scroll handling
- `Container` handles `paddingBottom` from safe area insets automatically


<!-- STRCUTURE -->

# Project Structure

## Root Layout

```
Barbers-Bay/
├── src/                  # All application source code
├── .kiro/steering/       # AI steering rules
├── .agents/skills/       # Agent skill definitions
├── app.json              # Expo app configuration
├── biome.jsonc           # Linter/formatter config (extends ultracite)
├── metro.config.js       # Metro bundler config (Uniwind + Reanimated)
├── tsconfig.json         # TypeScript config
├── lefthook.yml          # Git hook definitions
└── PROJECT-BRD.md        # Business requirements document
```

## Source Directory (`src/`)

```
src/
├── app/                  # Expo Router screens (file-based routing)
│   ├── _layout.tsx       # Root layout — providers and navigation shell
│   ├── index.tsx         # Home screen
│   └── +not-found.tsx    # 404 fallback
├── components/           # Shared reusable UI components
│   ├── container.tsx     # Base scrollable/non-scrollable screen wrapper
│   └── theme-toggle.tsx  # Light/dark theme switcher
├── contexts/             # React context providers and hooks
│   └── app-theme-context.tsx
├── lib/                  # Utilities, helpers, config
│   └── env.ts            # Type-safe env vars via @t3-oss/env-core + zod
├── assets/
│   └── images/           # Static image assets
└── global.css            # Tailwind/Uniwind/HeroUI style entry point
```

## Conventions

### File Naming
- All files use **kebab-case**: `theme-toggle.tsx`, `app-theme-context.tsx`
- Screen files live directly in `src/app/` following Expo Router conventions
- Layout files are named `_layout.tsx`

### Imports
- Use the `@/` alias for all internal imports (e.g., `@/components/container`)
- Use `import type` for type-only imports (`verbatimModuleSyntax` is enforced)

### Components
- Named exports for components (not default, except Expo Router screens)
- Expo Router screen files use default exports
- Wrap third-party icon/native components with `withUniwind()` to enable `className` prop

### Providers (root layout order)
The `_layout.tsx` wraps the app in this order:
1. `GestureHandlerRootView` — gesture support
2. `KeyboardProvider` — keyboard-aware layouts
3. `AppThemeProvider` — theme context
4. `HeroUINativeProvider` — design system tokens

### Styling
- Use `className` with Tailwind/Uniwind utility classes — no inline `StyleSheet` objects
- Use HeroUI design tokens for colors: `text-foreground`, `bg-background`, `bg-content1`, `text-primary`, `text-default-400`, etc.
- Use `cn()` from `heroui-native` for conditional class merging
- Use `tailwind-variants` for component variant definitions

### Context Pattern
- Context + Provider + typed hook in a single file under `src/contexts/`
- Hook throws if used outside its provider
- Memoize context values with `useMemo`; memoize callbacks with `useCallback`

### Environment Variables
- All env vars defined and validated in `src/lib/env.ts`
- Client-side vars must be prefixed with `EXPO_PUBLIC_`
- Access via the `env` object — never read `process.env` directly elsewhere

### Screen Layout
- Wrap every screen in `<Container>` for consistent safe-area and scroll handling
- `Container` handles `paddingBottom` from safe area insets automatically


<!-- TECH -->

# Tech Stack

## Runtime & Framework

- **React Native 0.83** with **Expo 55** (managed + bare workflow via `expo prebuild`)
- **Expo Router 55** — file-based routing with typed routes enabled
- **React 19** with React Compiler enabled (`experiments.reactCompiler: true`)

## Language

- **TypeScript 5.9** — strict mode, `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters`
- Path alias: `@/*` → `./src/*`
- `verbatimModuleSyntax: true` — use `import type` for type-only imports

## Styling

- **Uniwind** — Tailwind CSS v4 utility classes for React Native via `withUniwind()` HOC
- **HeroUI Native** — component library providing design tokens and primitives
- `tailwind-variants` and `tailwind-merge` for conditional/merged class strings
- Global CSS entry: `src/global.css` (imports tailwindcss, uniwind, heroui-native styles)
- Theming: light/dark via `Uniwind.setTheme()`, tokens accessed as `text-foreground`, `bg-background`, `bg-content1`, `text-primary`, etc.

## Navigation

- Expo Router (file-based, `src/app/` directory)
- `@react-navigation/drawer` available for drawer navigation
- `react-native-screens` and `react-native-safe-area-context` for native screen management

## Animation & Gestures

- **Reanimated 4** (`react-native-reanimated`) — use `Animated` components and hooks
- **React Native Gesture Handler** — wrap root in `<GestureHandlerRootView>`
- **React Native Worklets** — for worklet functions used with Reanimated

## Other Key Libraries

- `@gorhom/bottom-sheet` — bottom sheet component
- `react-native-keyboard-controller` — keyboard-aware layouts
- `expo-haptics` — haptic feedback (iOS only guard with `Platform.OS`)
- `expo-secure-store` — secure key-value storage
- `@expo/vector-icons` (Ionicons etc.) — wrap with `withUniwind()` to apply className styling
- `zod` v4 — schema validation
- `@t3-oss/env-core` — type-safe environment variables (see `src/lib/env.ts`)

## Linting & Formatting

- **Biome** (via `ultracite/biome/core` preset) — primary linter + formatter
- **oxlint** + **oxfmt** — run on staged files via git pre-commit hooks (lefthook)
- **Lefthook** manages pre-commit hooks (parallel: oxlint --fix, oxfmt --write)
- `bun` is the package manager (`bun.lock` present)

## Common Commands

```bash
# Start dev server (clear cache)
bun run dev

# Start dev server
bun run start

# Run on Android / iOS
bun run android
bun run ios

# Prebuild native projects (clean)
bun run prebuild

# Type check
bun run check-types

# Lint check / auto-fix
bun run check
bun run fix

# Find unused exports/deps
bun run knip
```
