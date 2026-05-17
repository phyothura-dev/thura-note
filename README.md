# Thura Note

Vue 3 frontend for a markdown-based note-taking app (auth-based, per-user notes) integrated with Flask backend APIs.
This project is written with reference to the Edge Note repository: https://github.com/kaungkhantjc/edge-note

## Tech Stack

- Vue 3 + TypeScript + Vite
- Pinia
- Vue Router
- TanStack Query (`@tanstack/vue-query`)
- Axios
- md-editor (`md-editor-v3`)
- shadcn-vue (`src/components/ui`)
- Cloudflare deployment tooling (`wrangler`, `@cloudflare/vite-plugin`)

## Prerequisites

- Node.js 20+ for local app development
- Node.js 22+ recommended for Cloudflare deployment commands (`wrangler`)

## Setup

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev         # start local dev server
npm run build       # type-check + production build
npm run preview     # preview production build
npm run typecheck   # run TypeScript checks only
npm run cf:deploy   # build and deploy dist/ to cloudflare
```

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ui/               # shadcn-vue base components
│   ├── composables/
│   ├── pages/
│   ├── router/
│   ├── stores/
│   ├── services/
│   ├── utils/
│   ├── types/
│   ├── editor/               # md-editor config/wrapper
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
└── package.json
```


## Planned Features

- Authenticated user-specific notes
- Create/Edit/Delete notes with markdown editor
- Note search by title
- Theme toggle (light/dark)
- Breadcrumb navigation
- Sign out flow

## Implemented UX Highlights

- Auth pages: `Login` + `Register` with password visibility toggles.
- Reusable theme toggle component: `src/components/ThemeToggleButton.vue`.
- Reusable note status tone utility: `src/utils/note.ts`.
- Note detail page:
  - Breadcrumb + right-side actions (Edit/Delete/Theme).
  - Metadata row (Created/Updated/Status).
  - Responsive 2-column desktop layout with mobile stacking.
  - Table of Contents with click-to-scroll heading navigation and active state.
- Mobile UX:
  - Top bar shows logo left and theme/logout right.
  - Search bar appears full-width on the next row.
  - Add button is fixed at bottom-right as a floating action button.
  - Markdown editor uses editor-only mode (preview hidden) on small screens.
