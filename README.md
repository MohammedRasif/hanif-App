# expo-starter

A production-ready starter template for cross-platform mobile apps built with Expo. Targets iOS, Android, and web from a single codebase.

## Features

- **React Native 0.83** + **React 19** + **Expo 55** — latest stable stack
- **TypeScript 5** — strict mode with `noUncheckedIndexedAccess`
- **Expo Router 55** — file-based routing with typed routes
- **React Compiler** — enabled via Expo experiments
- **TailwindCSS 4** + **Uniwind** — utility-first styling for React Native
- **HeroUI Native** — component library with light/dark theming
- **Reanimated 4** + **Gesture Handler** — animations and gestures
- **Oxlint + Oxfmt** — fast linting and formatting via `ultracite`
- **Lefthook** — pre-commit hooks for lint/format on staged files
- **t3-env + Zod** — type-safe environment variables

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

Run on a specific platform:

```bash
pnpm ios        # iOS simulator
pnpm android    # Android emulator
pnpm web        # Browser
```

## Available Scripts

```bash
pnpm dev              # Start Expo dev server (clears cache)
pnpm start            # Start Expo dev server
pnpm ios              # Run on iOS simulator
pnpm android          # Run on Android emulator
pnpm web              # Run in browser
pnpm check            # Lint + format check
pnpm fix              # Lint + format fix
pnpm check-types      # TypeScript type check (tsc --noEmit)
pnpm knip             # Dead code / unused exports check
```

## Project Structure

```
src/
  app/           # Expo Router screens (file-based routing)
  assets/        # Static assets (images, fonts)
  components/    # Shared UI components
  contexts/      # React context providers
  lib/           # Utility modules (env, helpers)
  global.css     # Tailwind + Uniwind + HeroUI style imports
```
