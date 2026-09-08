# Multi-Tenant Business Suite SaaS (Bahi) — Project Setup & Foundations

Set up the production-grade monorepo foundation, prerequisite configs, shared database schema, NestJS modular monolith backend, and Next.js web application shell according to the technical blueprint in [`Plans/erp-saas-spec.md`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/Plans/erp-saas-spec.md).

---

## User Review Required

> [!IMPORTANT]
> **Package Manager & Toolchain Choice:**
> - Node.js v24 and npm 11 are installed on your system.
> - We will use **npm workspaces + Turborepo** for clean, fast monorepo orchestration without requiring external package manager installations.
> - **PostgreSQL & Redis** local development setup will be provided via `docker-compose.yml`, while `packages/database` will use Prisma for schema modeling and migrations.

> [!NOTE]
> **Modular Monolith Layout:**
> As specified in §2.4 of the spec, `apps/api` will be structured strictly into decoupled domain modules: `core`, `crm`, `sales`, `inventory`, `accounting`, `hr`, `projects`, and `shared`. All cross-module communication will go through service interfaces, and multi-tenancy will be guarded at the request and database layers.

---

## Proposed Changes

### Monorepo Root & Prerequisites

We will initialize the root workspace structure with Turborepo orchestration, shared tooling, and containerization prerequisites.

#### [NEW] [package.json](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/package.json)
- Define workspaces: `apps/*`, `packages/*`
- Root scripts: `dev`, `build`, `lint`, `db:generate`, `db:migrate`, `db:seed`, `clean`
- Turborepo dependencies

#### [NEW] [turbo.json](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/turbo.json)
- Turbo build pipelines with dependency graphs (`build`, `dev`, `lint`, `db:generate`)

#### [NEW] [docker-compose.yml](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/docker-compose.yml)
- Local PostgreSQL 16 container with default database and healthcheck
- Redis 7 container for caching & BullMQ workers
- Persistent volumes configured

#### [NEW] [.gitignore](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/.gitignore)
- Ignore `node_modules`, `.turbo`, `.next`, `dist`, `.env`, coverage, etc.

#### [NEW] [.env.example](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/.env.example)
- Root environment configuration template (`DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `PORT`, `NEXT_PUBLIC_API_URL`)

---

### Shared Packages (`packages/`)

#### 1. `packages/tsconfig`
- [NEW] [`packages/tsconfig/package.json`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/packages/tsconfig/package.json)
- [NEW] [`packages/tsconfig/base.json`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/packages/tsconfig/base.json) (strict modern TypeScript configuration)
- [NEW] [`packages/tsconfig/nextjs.json`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/packages/tsconfig/nextjs.json)
- [NEW] [`packages/tsconfig/node.json`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/packages/tsconfig/node.json)

#### 2. `packages/types`
- [NEW] [`packages/types/package.json`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/packages/types/package.json)
- [NEW] [`packages/types/src/index.ts`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/packages/types/src/index.ts)
  - Common API response envelopes: `ApiResponse<T>`, `ApiErrorResponse`, `PaginatedResponse<T>`
  - Tenancy and User DTOs: `TenantContext`, `UserRole`, `ModuleCode`
  - Core domain interfaces (Contacts, Products, Activities, AuditLogs)

#### 3. `packages/database`
- [NEW] [`packages/database/package.json`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/packages/database/package.json)
- [NEW] [`packages/database/prisma/schema.prisma`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/packages/database/prisma/schema.prisma)
  - `Tenant`: id, name, slug, plan, status, modulesEnabled, currency, settings
  - `User`: id, email, passwordHash, name, roleId, tenantId, status
  - `Role` & `RolePermission`: RBAC mapping per tenant
  - `Contact`: Polymorphic party record (lead, customer, vendor, employee)
  - `Product`: Shared product entity for Sales & Inventory
  - `Activity`: Polymorphic notes/calls/emails (`relatedType`, `relatedId`)
  - `AuditLog`: Global mutation logs
- [NEW] [`packages/database/src/index.ts`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/packages/database/src/index.ts)
  - PrismaClient instantiation and tenant context extension
- [NEW] [`packages/database/prisma/seed.ts`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/packages/database/prisma/seed.ts)
  - Seeder for default tenant (`Acme Corp`), admin user, default roles, and sample CRM/Sales data

---

### Backend API (`apps/api`) — NestJS Modular Monolith

Structured according to §2.4 of the specification:

#### [NEW] [`apps/api/package.json`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/apps/api/package.json)
- NestJS core, common, platform-express, jwt, passport, bcrypt, class-validator, class-transformer, swagger.

#### [NEW] [`apps/api/src/main.ts`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/apps/api/src/main.ts)
- Versioned global prefix `/api/v1`
- ValidationPipe with transform & whitelist
- Global exception filter for unified error envelopes
- Swagger OpenAPI documentation setup at `/api/docs`

#### [NEW] Decoupled Modular Monolith Modules
- **`src/core/`**:
  - `auth/`: JWT access/refresh token strategy, password hashing, registration, login
  - `tenancy/`: Tenant resolution middleware & guards, context injection
  - `users/`: User management & invitation
  - `roles/`: RBAC permission gate
  - `audit/`: Polymorphic audit trail service
- **`src/crm/`**: Leads, opportunities, pipelines service & controller skeletons
- **`src/sales/`**: Quotations, sales orders skeletons
- **`src/inventory/`**: Products, warehouses, stock-moves skeletons
- **`src/accounting/`**: Invoices, payments skeletons
- **`src/hr/`**: Employees, leave requests skeletons
- **`src/projects/`**: Projects, tasks, timesheets skeletons
- **`src/shared/`**:
  - `contacts/`: Unified party model API
  - `activities/`: Polymorphic activity timeline API
  - `attachments/`: File storage gateway placeholder

---

### Frontend Web App (`apps/web`) — Next.js 14/15 + Tailwind CSS

Rich, modern, dark-mode ready application shell following Section 4 of the spec:

#### [NEW] Configuration & Tooling
- [`apps/web/package.json`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/apps/web/package.json)
- [`apps/web/tailwind.config.ts`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/apps/web/tailwind.config.ts)
- [`apps/web/src/app/globals.css`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/apps/web/src/app/globals.css) (CSS tokens, dark mode, smooth transitions, glassmorphism)

#### [NEW] Core Application Shell & Layout
- [`apps/web/src/app/layout.tsx`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/apps/web/src/app/layout.tsx): Root layout with typography and themes.
- [`apps/web/src/components/shell/Sidebar.tsx`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/apps/web/src/components/shell/Sidebar.tsx): Odoo-style modular app switcher, showing enabled modules with badges and active states.
- [`apps/web/src/components/shell/Topbar.tsx`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/apps/web/src/components/shell/Topbar.tsx): Tenant switcher, global search (Cmd+K trigger), notifications popover, user profile menu.
- [`apps/web/src/components/shell/CommandPalette.tsx`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/apps/web/src/components/shell/CommandPalette.tsx): Global shortcut launcher across CRM, Sales, Inventory, Invoices, and Actions.
- [`apps/web/src/components/ui/StatusBadge.tsx`](file:///c:/Users/rawat/BUIMB%20Projects/Bahi/apps/web/src/components/ui/StatusBadge.tsx): Shared status badge with consistent color codes.

#### [NEW] Module Starter Pages
- `src/app/(dashboard)/page.tsx`: Executive dashboard showing module health, recent activities, and quick actions.
- `src/app/(dashboard)/crm/page.tsx`: CRM Pipeline view / leads.
- `src/app/(dashboard)/sales/page.tsx`: Quotations & Orders view.
- `src/app/(dashboard)/inventory/page.tsx`: Product catalog & stock status.
- `src/app/(dashboard)/accounting/page.tsx`: Invoices & financial overview.
- `src/app/(dashboard)/hr/page.tsx`: Employee directory.
- `src/app/(dashboard)/projects/page.tsx`: Projects & task boards.
- `src/app/(dashboard)/settings/page.tsx`: Tenant settings & module toggle switchboard.

---

## Verification Plan

### Automated Build & Typecheck
1. **Dependencies installation**: Run `npm install` across the monorepo.
2. **Prisma generation**: Run `npm run db:generate` to generate the typed client in `packages/database`.
3. **TypeScript checks**: Run `npm run build` via Turborepo to ensure clean compilation across `packages/types`, `packages/database`, `apps/api`, and `apps/web`.

### Manual & Runtime Verification
1. **API verification**:
   - Start `apps/api` using `npm run dev --filter=api` or `npm run dev`.
   - Verify health endpoint `GET /api/v1/health` and Swagger UI at `http://localhost:4000/api/docs`.
2. **Web verification**:
   - Start `apps/web` using `npm run dev --filter=web`.
   - Verify interactive dashboard shell, sidebar navigation, module toggle behavior, dark/light theme, and Command Palette (`Cmd+K` / `Ctrl+K`) in the browser.
