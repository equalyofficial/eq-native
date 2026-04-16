# Agent Guidelines - Equaly App

Equaly is a universal mobile application built with Expo, leveraging a domain-driven feature architecture. This document provides the necessary context and guidelines for agentic coding agents to maintain consistency and quality.

## 🛠 Knowledge Graph (MCP Tools)

**IMPORTANT: This project uses a knowledge graph for codebase navigation.**
ALWAYS use the `code-review-graph` MCP tools BEFORE using Grep, Glob, or Read to explore the codebase.

| Tool | Use Case |
| :--- | :--- |
| `semantic_search_nodes` | Find functions/classes by name or keyword |
| `query_graph` | Trace callers, callees, imports, tests, and dependencies |
| `get_impact_radius` | Understand the blast radius of a proposed change |
| `detect_changes` | Review code changes with risk-scored analysis |
| `get_review_context` | Get precise source snippets for review |
| `get_affected_flows` | Identify which execution paths are impacted |
| `get_architecture_overview` | Understand high-level codebase structure |

## 🚀 Development Workflow

### Essential Commands
- **Linting**: `npm run lint` (Run this before every commit)
- **API Types**: `npm run api:types` (Updates `lib/api-types.ts` from `api.json`)
- **Start App**: `npm run start` (Options: `--ios`, `--android`, `--web`)

### Testing
No automated test suite is currently implemented. When adding new features, prefer creating modular logic in `*.hooks.ts` or `*.api.ts` that can be easily tested.

## 🏗 Architecture & Project Structure

The project follows a **Feature-Based Architecture** to ensure scalability and isolation.

- `app/`: **Routing Layer**. Expo Router file-based routes.
  - `(auth)/`: Authentication flow (login, register, etc.)
  - `(protected)/`: Authenticated area.
  - `(protected)/(tabs)/`: Main application tab navigation.
- `features/`: **Domain Layer**. Each folder is a self-contained feature.
  - `*.api.ts`: API client calls for the feature.
  - `*.hooks.ts`: TanStack Query hooks for data fetching/mutation.
  - `*.types.ts`: Domain-specific TypeScript types.
  - `*.keys.ts`: TanStack Query keys to prevent collisions.
  - `screens/`: UI screens specific to the feature.
  - `components/`: UI components specific to the feature.
  - `index.ts`: The public entry point; export only what other features need.
- `lib/`: **Infrastructure Layer**. Global utilities.
  - `api.ts`: `openapi-fetch` client configuration.
  - `api-error.ts`: Centralized error handling (`ApiError` class).
  - `schemas.ts`: Global Zod validation schemas.
- `components/`: **Shared UI Layer**. Reusable, generic components.
- `store/`: **Global State**. Zustand stores (e.g., `use-auth-store.ts`).
- `hooks/`: **Shared Logic**. Generic hooks (e.g., theme, device).

## 🎨 Coding Guidelines

### 1. Naming Conventions
- **Files**: `kebab-case` (e.g., `auth-text-field.tsx`, `use-auth-store.ts`).
- **Components/Screens**: `PascalCase` (e.g., `RegisterScreen`, `ThemedView`).
- **Functions/Variables**: `camelCase` (e.g., `parseApiError`, `isAuthenticated`).
- **Hooks**: `useCamelCase` (e.g., `useAuthStore`, `useThemeColor`).
- **Types/Interfaces**: `PascalCase` (e.g., `ApiErrorBody`, `User`).

### 2. TypeScript & Imports
- **Aliases**: Always use `@/` for absolute imports (e.g., `@/lib/api` instead of `../../../lib/api`).
- **Typing**: Use `interface` for API data models and `type` for unions/aliases.
- **Strictness**: Avoid `any`. Use `unknown` and type guards (e.g., `isApiError`).

### 3. Styling & UI
- **Styling**: Use **Uniwind** (Tailwind CSS v4). Use the `className` prop on components.
- **UI Library**: Use **HeroUI Native** for standard components (Buttons, Inputs, etc.).
- **Theming**: Use `ThemedView` and `ThemedText` or the `useThemeColor` hook to ensure support for light/dark modes.

### 4. State Management
- **Server State**: Use **TanStack Query**. Logic must reside in `features/[feature]/*.hooks.ts`.
- **Client State**: Use **Zustand** for global states (Auth, App Settings). Stores reside in `store/`.

### 5. API & Error Handling
- **Client**: Use the `api` client from `@/lib/api` (powered by `openapi-fetch`).
- **Type Safety**: Rely on types generated in `lib/api-types.ts`.
- **Error Pattern**: 
  1. Wrap API calls in try/catch or use TanStack Query's error state.
  2. Use `parseApiError(error)` from `@/lib/api-error` to convert raw errors into `ApiError` instances.
  3. Access field-specific errors via `apiError.fieldError('fieldName')`.

## 🛡 Security & Best Practices
- **Secrets**: NEVER commit `.env` files or hardcode API keys.
- **Auth**: Always use `setAuthToken` and `clearAuthToken` from `@/lib/api` to manage JWTs.
- **Performance**: Memoize expensive components and avoid unnecessary re-renders in the `app/` routing layer.
