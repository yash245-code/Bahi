# Bahi Modular Applications Architecture

This directory houses the independent, sellable business applications (CRM, Sales, Inventory, Accounting, HR, Projects) that make up the Bahi Business Suite.

## Architectural Rules

1. **Vertical Slices**:
   Each application is a self-contained vertical slice containing:
   - `manifest.ts`: Declarative application metadata, route config, plan eligibility, and permissions.
   - `web/`: Frontend views, components, hooks, and presentation logic.
   - `api/`: Backend NestJS module, controllers, services, and DTOs.
   - `package.json`: Scoped package definition (e.g., `@bahi/app-crm`).
   - `tsconfig.json`: TypeScript compiler options extending `@bahi/tsconfig`.

2. **No Cross-Application Imports**:
   An application must **never** directly import code from another application (`@bahi/app-A` cannot import from `@bahi/app-B`). Any shared data models, utilities, or contracts must reside in `packages/` (such as `@bahi/types`) or be coordinated via domain events or platform API contracts.

3. **Dependency Hierarchy**:
   - Applications may depend on the platform core (`backend/`, `frontend/`) and shared `packages/`.
   - The platform core must **never** hardcode dependencies on specific applications; it only discovers and loads applications dynamically via `@bahi/applications` (`registry.ts`).

4. **Shared Runtime & Single Database**:
   All applications run within the unified Bahi runtime:
   - One shared NestJS backend process mounting each application's `api/` module in `app.module.ts`.
   - One Prisma schema in `packages/database`.
   - One Redis instance.
   Separate standalone servers must not be introduced.

5. **Dynamic Registry-Driven Navigation**:
   The frontend shell (`frontend/`) dynamically loads navigation items, route titles, and service catalogs from `@bahi/applications` (`registry.ts`). No hardcoded service lists should exist in the platform shell.

6. **Backend Licensing & Access Enforcement**:
   UI visibility is solely a user experience convenience. Real access enforcement happens at the backend layer via `ApplicationAccessGuard`, which checks the tenant's subscription plan and `enabledModules` list against the application's `manifest.ts`.

7. **Theme Preservation**:
   All application UIs adhere to the "Paper & Rust" design tokens defined in `frontend/tailwind.config.ts`.
