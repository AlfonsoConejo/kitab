# AGENTS.md — Kitab frontend

## Scope

This directory is the React frontend for Kitab, a student academic-planning application. Its backend lives in the sibling `../kitab-api` repository. Do not change the backend, database schema, or environment files unless the task explicitly includes them.

## Architecture

### Application structure

```text
src/main.jsx
  BrowserRouter
  AuthProvider
    PeriodProvider
      App (routes and layouts)
        pages / components
          apiFetch -> Kitab REST API
```

- `src/main.jsx` is the application entry point. It mounts React, the router, global providers, and the Sonner toaster.
- `src/App.jsx` defines public, auth, and protected routes.
- `src/layouts/` owns shared page shells:
  - `LandingLayout` for public pages.
  - `AuthLayout` for login and registration.
  - `AppLayout` for authenticated views, including `AppHeader`, `Sidebar`, and the route `<Outlet />`.
- `src/pages/` contains route-level screens and their orchestration logic.
- `src/components/` contains reusable UI and focused feature components. Prefer composing these instead of duplicating UI.
- `src/context/AuthContext.tsx` holds the authenticated user and session bootstrap/logout behavior.
- `src/context/PeriodContext.tsx` holds the selected academic period. It persists it in `localStorage` under `selectedPeriod_<userId>`.
- `src/services/apiFetch.ts` is the default authenticated HTTP client. It sends cookies, refreshes an expired access token once on `401`, then retries the original request.
- `src/types/` contains frontend contracts for API data. Keep them synchronized with the backend response shapes.
- `src/utils/`, `src/functions.ts`, and `src/data/` contain shared helpers and static content.

### Routing and authorization

- Public landing routes are nested under `/`.
- Authentication routes are nested under `/auth`.
- Private application routes are nested under `/app` and must remain protected by `ProtectedRoute`.
- `App` already redirects signed-in users away from public/auth pages. Preserve this behavior when adding routes.
- Route-level components should handle loading, empty, error, and no-selected-period states explicitly, reusing `Loader`, `SectionLoader`, `EmptySection`, and `NoActivePeriodMessage` where suitable.

### Backend contract

The frontend communicates with `VITE_API_URL` using cookie-based credentials. Never hard-code the API host or manually attach JWTs to headers.

The API is an Express/PostgreSQL application organized as:

```text
routes -> controllers -> services -> PostgreSQL
                 -> validators
```

Its protected resources are user-scoped. Core relations are:

```text
users -> academic_periods -> subjects -> classes
users -> sessions -> refresh_tokens
```

Important endpoints include:

- `/api/auth`: register, login, current user, token refresh, logout.
- `/api/periods`: period CRUD plus period subjects and classes.
- `/api/subjects`: subject CRUD, classes, and internal/external scheduling-conflict checks.

The API refresh flow relies on HttpOnly cookies. Use `apiFetch` for normal authenticated requests. Keep endpoint payload keys and response handling compatible with the backend validators and normalizers.

## Feature conventions

### Periods, subjects, and classes

- A selected period is required before showing or mutating period-scoped data. Read it with `usePeriod()`; do not duplicate it in unrelated state.
- A subject owns its `classes`. In `SubjectsForm`, the parent owns the complete subject state and `ClassForm` edits one class entry through callbacks.
- New client-side classes use `tempId` (`crypto.randomUUID()`); persisted classes also have a database `id`. Preserve this distinction when editing, deleting, or matching conflicts.
- Subject editing sends `classes` and `deletedClassIds`. Do not silently discard IDs for persisted classes.
- Conflict detection has two sources: internal conflicts compare classes in the current form; external conflicts compare them against other subjects in the same period. Recalculate both when changing a schedule and show the returned conflict data rather than reimplementing the server algorithm in the UI.
- Dates and times should use the existing helpers in `src/utils/date.utils.ts` and `src/functions.ts` when applicable. Avoid locale-dependent ad hoc parsing.

### State and side effects

- Use functional React components and hooks.
- Keep route-level data fetching in pages or a focused custom hook; keep presentational components focused on rendering and callbacks.
- Honor existing loading guards (`authLoading`, `isLoadingPeriod`) before fetching dependent data.
- Include the actual dependencies of effects. Do not disable the hooks lint rule to silence stale-closure problems.
- Use `notify` for user-facing async errors and success messages. Avoid browser alerts.
- Set a meaningful `document.title` in route-level pages, matching the established pattern.

## Coding conventions

- This is a mixed JavaScript/TypeScript codebase. Preserve the extension and style of the file you modify; use TypeScript for new typed modules when it integrates cleanly, without undertaking broad JS-to-TS conversions in feature work.
- Use the `@/` alias for modules under `src` when it improves readability. It is configured in Vite and TypeScript.
- Use named, descriptive variables and functions. Avoid `any`; model shared data with the existing types in `src/types/`.
- Follow the existing functional-component style and Tailwind utility-class approach. Reuse existing components, colors, icons, and UI patterns before adding new dependencies.
- Use Lucide icons consistently with existing UI.
- Keep components small and single-purpose. Extract a component or hook when logic is reused or obscures a route-level screen.
- Do not introduce state-management, HTTP, UI, or date libraries unless explicitly justified and approved.
- Keep API error handling defensive: check `response.ok`, parse the documented response shape, and preserve the `SESSION_EXPIRED` behavior from `apiFetch`.

## Safety and change rules

- Inspect the route, its consumers, types, and corresponding API endpoint before changing a shared component, context, response shape, or form payload.
- Do not modify `.env` files, expose secrets, hard-code tokens, or log credentials/cookies.
- Do not bypass `ProtectedRoute`, authentication checks, ownership enforcement, or conflict validation.
- Do not make unrelated refactors, formatting rewrites, dependency upgrades, or backend changes as part of a focused task.
- Preserve current user data and `localStorage` key formats unless a migration is explicitly planned.
- The pages for tasks, tests, calendar, and breaks may be under development. Verify the API contract exists before adding data-fetching behavior for them.
- Do not create commits or push changes unless explicitly requested.

## Decision making

- If the task is ambiguous or requires choosing between materially different architectural approaches, ask for clarification before making the change.
- Do not infer new business rules when the existing code or API contract does not establish them.
- Prefer inspecting existing implementations and patterns over introducing a new approach.

## Permissions

- You may modify project files when the task explicitly asks you to implement or change functionality.
- Before modifying files outside the scope of the task, explain why they are necessary and ask for approval.
- Never modify files outside this repository unless explicitly requested.
- Never commit or push changes unless explicitly requested.
- After making changes, review the resulting diff and remove unrelated changes before finishing.

## Verification

Run checks from this directory after relevant changes:

```bash
npm run lint
npm run build
```

For behavior involving the API, verify both frontend and backend are running and `VITE_API_URL` points to the backend. Do not create or edit `.env` files during normal feature work.
