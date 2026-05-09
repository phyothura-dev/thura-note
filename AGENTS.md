# Frontend AGENTS Guide

## Scope
- This folder is the Vue 3 + TypeScript frontend for the note-taking app refernce from .
- Backend API is in `../backend` and should be treated as source of truth for endpoint contracts.

## Stack
- Vue 3 + Vite
- Pinia for state
- Vue Router for routing
- TanStack Query (`@tanstack/vue-query`) for server state/fetch caching
- Axios for HTTP client
- `md-editor-v3` for markdown editing
- shadcn-vue components in `src/components/ui`

## Directory Convention
- `src/pages`: route-level page components
- `src/router`: router setup and guards
- `src/stores`: Pinia stores (auth/session/ui)
- `src/services`: Axios instance and API service modules
- `src/composables`: reusable composition hooks
- `src/editor`: markdown editor wrapper/config
- `src/types`: shared DTO and domain types
- `src/utils`: utility functions & format

## API Integration Rules
- Keep network calls in `src/services/*`; UI components should not call Axios directly.
- Use TanStack Query for fetch/list/detail cache workflows.
- Keep auth token handling centralized (Axios interceptor + auth store).
- Confirm request/response shapes against backend Swagger/docs before implementation.

## UI/UX Rules
- Use shadcn-vue as base UI library for forms, dialogs, buttons, etc.
- Support both light and dark mode.
- Include sign-out flow and breadcrumb navigation on authenticated pages.
- Keep searchable note list by title (client-side filter on fetched list unless backend search endpoint exists).
- Prefer reusable UI modules for shared behavior (for example theme toggle button, status tone styles).
- Preserve mobile-first behavior:
  - Top nav first row: logo left, actions (theme/logout) right.
  - Search field on its own full-width row.
  - Floating Add button at bottom-right on mobile.
  - Markdown editor should hide preview pane on mobile and show editor-only.
- Note detail page should keep heading-based TOC click-to-scroll behavior and avoid horizontal overflow on mobile.

## Delivery Workflow
- For new features:
  1. Define/update `src/types`.
  2. Implement API functions in `src/services`.
  3. Add query/mutation composables.
  4. Build page/component UI with shadcn-vue.
  5. Wire route + guard + store.
- Before handoff, run:
  - `npm run typecheck`
  - `npm run build`
