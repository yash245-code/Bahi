# Bahi SaaS — Project Setup Tasks

## 1. Monorepo Root & Prerequisites
- [x] Root `package.json` (npm workspaces + packageManager)
- [x] `turbo.json` pipeline config
- [x] `.gitignore`
- [x] `.env.example`
- [x] `docker-compose.yml` (Postgres + Redis)

## 2. Shared Packages
- [x] `packages/tsconfig` (base, node, nextjs configs)
- [x] `packages/types` (shared DTOs, enums, API envelopes)
- [x] `packages/database` (Prisma schema, client, seed)

## 3. Backend API (`apps/api`) — NestJS
- [x] Package.json & NestJS bootstrap (`main.ts`)
- [x] `src/core/` — auth, tenancy, users, roles, audit
- [x] `src/crm/` — leads, opportunities, pipelines
- [x] `src/sales/` — quotations, orders
- [x] `src/inventory/` — products, warehouses, stock-moves
- [x] `src/accounting/` — invoices, payments
- [x] `src/hr/` — employees, leave
- [x] `src/projects/` — projects, tasks, timesheets
- [x] `src/shared/` — contacts, activities, attachments

## 4. Frontend Web App (`apps/web`) — Next.js
- [x] Next.js init, Tailwind, globals.css
- [x] Application shell (Sidebar, Topbar, CommandPalette)
- [x] Dashboard page
- [x] Module starter pages (CRM, Sales, Inventory, Accounting, HR, Projects, Settings)
- [x] Shared UI components (StatusBadge)

## 5. Verification
- [x] `npm install`
- [x] `npm run db:generate`
- [x] `npm run build`
- [x] Dev server smoke test
