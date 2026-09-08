# [Product Name TBD] — Multi-Tenant Business Suite SaaS
### Product & Technical Specification (v0.1 Draft)

**Positioning:** An Odoo-style, modular, multi-tenant ERP/business-operations platform, sold as a commercial SaaS to companies (SMB → mid-market first).

---

## 1. Product Brief & Scope

### 1.1 Vision
A single platform where a company can run CRM, Sales, Inventory, Accounting/Invoicing, HR, and Project Management on one shared data model — instead of stitching together five separate tools. The wedge against Odoo: faster UI, cleaner onboarding, and modern API-first extensibility, at a lower "time-to-value" for SMBs.

### 1.2 Target Customer
- **Primary (v1):** Small-to-mid businesses (5–250 employees) currently juggling spreadsheets + 3-4 disconnected SaaS tools.
- **Secondary (v2+):** Mid-market companies (250–1000) that need role-based permissions, approval workflows, and multi-entity/multi-currency support.
- **Not targeting v1:** Large enterprise (5000+) — that requires SSO/SCIM, heavy compliance (SOC2/ISO), and dedicated infra per customer, which comes later.

### 1.3 Core Modules (v1 — "Suite Core")
Ship as one cohesive app, not five separate products, but each module should be independently toggleable per tenant (like Odoo's "Apps").

| Module | Core Objects | Primary Jobs-to-be-done |
|---|---|---|
| **Platform/Core** | Company, User, Role, Team, Currency, Tax, Audit Log | Auth, tenancy, permissions, settings — everything else depends on this |
| **CRM** | Lead, Contact, Opportunity, Pipeline Stage, Activity | Track leads → deals, log calls/emails, forecast pipeline |
| **Sales** | Quotation, Sales Order, Price List, Product | Quote customers, convert to orders, track fulfillment status |
| **Inventory** | Product, Warehouse, Stock Move, Stock Location | Track stock levels, receive/ship goods, low-stock alerts |
| **Accounting/Invoicing** | Invoice, Bill, Payment, Journal Entry, Chart of Accounts | Invoice customers, record payments, basic P&L/balance sheet |
| **HR** | Employee, Department, Leave Request, Attendance | Employee directory, time-off requests/approvals |
| **Projects** | Project, Task, Timesheet | Track internal/client work, log billable hours |

### 1.4 Explicitly Out of Scope for v1
- Manufacturing/MRP, POS, eCommerce storefront, Marketing Automation, full double-entry accounting compliance (auditor-grade), payroll tax computation, on-premise/self-hosted deployment.
- These map to Odoo's own "later" apps — resist scope creep; v1 must ship a usable core suite, not a partial version of everything.

### 1.5 Cross-Module Design Principles (the actual "Odoo-like" part)
1. **Shared party model** — a "Contact" is a single record usable as a CRM lead, a sales customer, an invoice recipient, and a vendor. No duplicate customer records across modules.
2. **App/Module framework** — modules are installable/enable-able per tenant, with declared dependencies (e.g., Sales depends on Core; Invoicing depends on Sales + Accounting-Core).
3. **Universal activity/notes layer** — comments, attachments, and activity logs attach to any record type (polymorphic), same UX everywhere.
4. **One permission model** — role-based access control defined once at the platform level, referenced by every module.
5. **Configurable, not hardcoded** — custom fields, custom statuses/pipelines per tenant, without schema migrations per customer.

### 1.6 Business Model
- Per-seat, per-month pricing, tiered by module bundle (Starter: CRM+Sales; Growth: + Inventory+Invoicing; Business: + HR+Projects).
- Free trial (14–30 days), self-serve signup + optional guided onboarding for paid tiers.

### 1.7 Success Metrics (v1)
- Time-to-first-value: a new tenant creates a lead → quote → invoice within their first session.
- Activation: % of trial tenants that enable ≥2 modules and invite ≥1 teammate within 7 days.
- Retention: monthly logo churn < 3%.

---

## 2. Technical Architecture & Stack

### 2.1 High-Level Architecture
Start as a **modular monolith**, not microservices. Odoo itself is a monolith with pluggable apps — that pattern is correct for your team size and lets you avoid premature distributed-systems complexity. Split into services later only where scaling demands it (e.g., reporting/analytics, background jobs).

```
                        ┌─────────────────────────┐
                        │   CDN / Edge (Cloudflare) │
                        └────────────┬─────────────┘
                                     │
                        ┌────────────▼─────────────┐
                        │   API Gateway / LB (Nginx) │
                        └────────────┬─────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
     ┌────────▼────────┐   ┌─────────▼─────────┐   ┌────────▼────────┐
     │  Web App (Next.js)│  │  API (Node/NestJS) │   │ Background Workers│
     │  SSR + Client SPA │  │  Modular Monolith   │   │ (BullMQ/Redis)   │
     └────────┬─────────┘   └─────────┬──────────┘   └────────┬────────┘
              │                       │                        │
              └──────────────┬────────┴──────────┬─────────────┘
                              │                    │
                    ┌─────────▼─────────┐ ┌────────▼────────┐
                    │  PostgreSQL (RLS)  │ │  Redis (cache/  │
                    │  per-tenant schema │ │  queues/session)│
                    │  or shared+tenant_id│ └─────────────────┘
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Object Storage (S3)│
                    │  files/attachments   │
                    └──────────────────────┘
```

### 2.2 Stack Choices

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | **Next.js (React) + TypeScript**, Tailwind, shadcn/ui | Matches existing team stack; SSR for fast first-load dashboards; good SEO for marketing pages |
| State/data-fetching | TanStack Query + Zustand | Server-state caching vs. UI-state, cleanly separated |
| Backend API | **Node.js + NestJS + TypeScript** | Nest's module system maps 1:1 to your "app/module" product concept (each ERP module = a Nest module) |
| Database | **PostgreSQL** | Relational integrity essential for ERP (foreign keys, transactions); JSONB for custom fields |
| Multi-tenancy | Shared DB, shared schema, `tenant_id` column + **Postgres Row-Level Security (RLS)** | Simpler ops than schema-per-tenant at this stage; RLS enforces isolation at the DB layer, not just app layer |
| ORM | Prisma or TypeORM | Type-safe queries, migrations |
| Auth | Custom JWT (access + refresh) via NestJS Passport, or Auth0/Clerk for v1 to move faster | Multi-tenant login (company subdomain or org switcher), RBAC per tenant |
| Caching/Queues | Redis + BullMQ | Background jobs: invoice PDF generation, email sending, report generation, scheduled reminders |
| File storage | S3-compatible (AWS S3 / Cloudflare R2) | Attachments, invoice PDFs, imports/exports |
| Search | Postgres full-text search initially → Meilisearch/Elasticsearch later | Avoid an extra infra dependency until scale demands it |
| Realtime | WebSockets (Socket.io) or Server-Sent Events | Live notifications, activity feed updates |
| Observability | Sentry (errors), Grafana + Prometheus or Datadog (metrics), structured logging (Pino) | Non-negotiable for a paid SaaS — you need to know when a tenant's data path breaks |

### 2.3 Multi-Tenancy Strategy (key decision)
Recommend **shared database, shared schema, `tenant_id` on every table + Postgres RLS policies**:
- Pros: single schema to migrate, cheaper to run, easy cross-tenant admin tooling.
- Enforce isolation with RLS so a bug in application code can't leak tenant B's data into tenant A's response — the DB refuses the query.
- Revisit schema-per-tenant only if/when a large customer demands physical data isolation for compliance.

### 2.4 Modular Monolith Internals
Mirror the product's module boundaries in code:
```
apps/api/src/
  core/           (auth, users, roles, tenancy, audit-log)
  crm/            (leads, opportunities, pipelines)
  sales/          (quotations, orders, price-lists)
  inventory/      (products, warehouses, stock-moves)
  accounting/     (invoices, payments, journal-entries)
  hr/             (employees, leave, attendance)
  projects/       (projects, tasks, timesheets)
  shared/         (contacts, activities, attachments, notifications)
```
Each module: its own Nest module, own Prisma schema slice, own service/controller layer, communicating with other modules via well-defined internal service interfaces (not direct DB access across module boundaries) — this is what lets you eventually peel a module into its own microservice without a rewrite.

### 2.5 Data Model Sketch (core cross-module entities)
- `Tenant` (company/org) → has many `User`, `Role`
- `Contact` (polymorphic: lead / customer / vendor / employee-linked) — the shared party model from §1.5
- `Product` → used by Sales, Inventory, Accounting
- `Activity` (polymorphic `related_type` + `related_id`) → notes/calls/emails attach to any record
- `AuditLog` (who changed what, when, on any record)

---

## 3. API & Endpoint Design

### 3.1 Conventions
- REST, JSON, versioned: `/api/v1/...`
- Auth: `Authorization: Bearer <JWT>`; tenant resolved from JWT claim (`tenant_id`), never from a client-supplied header, to prevent tenant-spoofing.
- Pagination: cursor-based (`?cursor=...&limit=50`) for large lists (stock moves, activity feeds).
- Filtering/sorting: `?filter[status]=open&sort=-created_at`
- Errors: consistent envelope `{ "error": { "code": "...", "message": "...", "details": [...] } }`

### 3.2 Core / Platform
```
POST   /api/v1/auth/register            create tenant + first admin user
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/tenants/me               current tenant settings
PATCH  /api/v1/tenants/me
GET    /api/v1/users
POST   /api/v1/users/invite
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
GET    /api/v1/roles
POST   /api/v1/roles
PATCH  /api/v1/roles/:id                permission set editing
```

### 3.3 CRM
```
GET    /api/v1/crm/leads
POST   /api/v1/crm/leads
GET    /api/v1/crm/leads/:id
PATCH  /api/v1/crm/leads/:id
POST   /api/v1/crm/leads/:id/convert    lead -> opportunity
GET    /api/v1/crm/pipelines
GET    /api/v1/crm/opportunities?stage=proposal
PATCH  /api/v1/crm/opportunities/:id/stage
```

### 3.4 Sales
```
GET    /api/v1/sales/quotations
POST   /api/v1/sales/quotations
POST   /api/v1/sales/quotations/:id/confirm     quotation -> sales order
GET    /api/v1/sales/orders
GET    /api/v1/sales/orders/:id
PATCH  /api/v1/sales/orders/:id/status
```

### 3.5 Inventory
```
GET    /api/v1/inventory/products
POST   /api/v1/inventory/products
GET    /api/v1/inventory/warehouses
GET    /api/v1/inventory/stock-levels?product_id=&warehouse_id=
POST   /api/v1/inventory/stock-moves            receive/ship/transfer
GET    /api/v1/inventory/stock-moves/:id
```

### 3.6 Accounting/Invoicing
```
GET    /api/v1/accounting/invoices
POST   /api/v1/accounting/invoices              often generated from a sales order
GET    /api/v1/accounting/invoices/:id
POST   /api/v1/accounting/invoices/:id/send
POST   /api/v1/accounting/payments
GET    /api/v1/accounting/reports/profit-loss?from=&to=
```

### 3.7 HR
```
GET    /api/v1/hr/employees
POST   /api/v1/hr/employees
POST   /api/v1/hr/leave-requests
PATCH  /api/v1/hr/leave-requests/:id/approve
GET    /api/v1/hr/attendance?employee_id=&month=
```

### 3.8 Projects
```
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:id/tasks
POST   /api/v1/projects/:id/tasks
POST   /api/v1/tasks/:id/timesheets
```

### 3.9 Shared/Cross-Cutting
```
GET    /api/v1/contacts                 unified party search across leads/customers/vendors
GET    /api/v1/activities?related_type=opportunity&related_id=123
POST   /api/v1/activities
POST   /api/v1/attachments/upload       returns S3 presigned URL
GET    /api/v1/notifications
WS     /ws/notifications                real-time updates
```

### 3.10 Webhooks & Extensibility (for the "sell as SaaS" model)
- `POST /api/v1/webhooks` — tenants register outbound webhooks (`invoice.paid`, `opportunity.won`, `stock.low`) so customers can integrate with Zapier/Slack/their own tools — this is the API-first differentiator vs. Odoo's older API.
- API keys per tenant, scoped by module, for programmatic access.

---

## 4. Frontend UI & Component Breakdown

### 4.1 Application Shell
- **Top-level layout:** left sidebar (module switcher, like Odoo's app icons), top bar (global search, notifications, user/tenant switcher), main content area.
- **Module switcher:** only shows modules enabled for the current tenant's plan.
- **Global command palette** (Cmd+K): jump to any record or action — this is the single highest-leverage UX feature Odoo itself invests heavily in (their "speed" pitch).

### 4.2 Shared/Reusable Components (build these first — every module depends on them)
| Component | Used by | Notes |
|---|---|---|
| `DataTable` | Every list view (leads, orders, products, invoices...) | Server-side pagination, column filters, sort, bulk actions, saved views |
| `RecordDetailLayout` | Every detail page | Header (title, status badge, action buttons) + tabbed body (Details / Activity / Attachments) |
| `ActivityFeed` | Any record's "Activity" tab | Polymorphic — same component for a lead, an invoice, or an employee |
| `KanbanBoard` | CRM pipeline, Project tasks | Drag-and-drop columns by status/stage |
| `FormBuilder` fields | All create/edit forms | Standard inputs + support for tenant-defined custom fields |
| `CommandPalette` | Global | Fuzzy search across records + quick actions |
| `StatusBadge` | Everywhere | Consistent color coding for statuses across modules |
| `CurrencyInput` / `MoneyDisplay` | Sales, Accounting | Respect tenant's currency/locale settings |
| `FilterBar` | All list views | Composable filter chips bound to `DataTable` |
| `NotificationCenter` | Global topbar | Realtime via WebSocket |
| `RoleGate` | Everywhere | Wraps UI elements, hides/disables by permission |

### 4.3 Module-Specific Screens

**CRM**
- Pipeline board (Kanban) — opportunities by stage
- Lead list + Lead detail (with "Convert to Opportunity" action)
- Opportunity detail — value, expected close date, activity timeline

**Sales**
- Quotation builder — line items, product picker, price list auto-fill, PDF preview
- Sales order list + detail — fulfillment status tracker

**Inventory**
- Product catalog grid
- Stock level dashboard per warehouse
- Stock move history / receive-ship wizard

**Accounting**
- Invoice list + invoice builder (from scratch or from sales order)
- Payment recording modal
- Simple P&L / balance sheet report view (charts + table)

**HR**
- Employee directory (card grid)
- Leave request form + manager approval inbox
- Attendance calendar view

**Projects**
- Project list → Task board (Kanban, reuses `KanbanBoard`)
- Timesheet entry (weekly grid, reused across projects)

### 4.4 Settings/Admin Area
- Module enable/disable toggles (per tenant admin)
- User & role management (permission matrix editor)
- Custom fields editor per object type
- Billing/subscription management (plan, seats, invoices from your own billing provider)

### 4.5 Design System Notes
- One shared design system (tokens: spacing, color, typography) so all seven modules feel like one product, not bolted-together tools — this is exactly where Odoo's UI historically felt dated, and is a real differentiation opportunity.
- Dark mode from day one is cheap if the token system is set up correctly early; expensive to retrofit later.

---

## 5. Implementation Roadmap & DevOps

### 5.1 Phased Roadmap

**Phase 0 — Foundations (4–6 weeks)**
- Monorepo setup (Turborepo/Nx), CI pipeline, environments (dev/staging/prod)
- Core module: multi-tenancy, auth, RBAC, tenant onboarding flow
- Shared components: `DataTable`, `RecordDetailLayout`, `ActivityFeed`, design tokens
- Contact model (shared party record)

**Phase 1 — CRM + Sales (6–8 weeks)**
- Lead/Opportunity/Pipeline, Kanban board
- Quotation → Sales Order flow
- Activity feed wired into CRM records
- First paid-tier billing integration (Stripe) gating module access

**Phase 2 — Inventory + Accounting/Invoicing (8–10 weeks)**
- Product catalog, warehouses, stock moves
- Invoice generation from sales orders, payment recording
- Basic financial reports (P&L, balance sheet)

**Phase 3 — HR + Projects (6–8 weeks)**
- Employee directory, leave/attendance
- Project/Task/Timesheet, reusing Kanban + DataTable

**Phase 4 — Platform Hardening & Extensibility (ongoing, parallel)**
- Webhooks, public API keys, rate limiting
- Custom fields framework
- Audit logging, admin observability dashboards
- Performance: query optimization, caching, load testing per module

**Phase 5 — GA & Scale**
- SOC2-track security hardening, SSO (SAML/OIDC) for larger customers
- Multi-region considerations if customer base demands it
- Public API docs + developer portal

### 5.2 DevOps / Infrastructure

| Concern | Approach |
|---|---|
| **CI/CD** | GitHub Actions: lint/test/build on PR, auto-deploy `main` → staging, manual promote → prod |
| **Hosting** | Containerized (Docker) on a managed platform (Railway/Render early → AWS ECS/EKS at scale) |
| **Environments** | dev (local docker-compose), staging (mirrors prod, seeded demo tenant), production |
| **Database migrations** | Prisma Migrate, run in CI before deploy, always backward-compatible (expand/contract pattern) — never a breaking migration during a live deploy |
| **Secrets** | Managed via platform's secret store (AWS Secrets Manager / Doppler), never in repo |
| **Backups** | Automated daily Postgres backups + point-in-time recovery; test restores quarterly |
| **Monitoring** | Sentry for errors, uptime checks (Better Uptime/Pingdom), Grafana dashboards for API latency/error rate per module |
| **Rate limiting** | Per-tenant + per-API-key limits at the gateway layer (protects one noisy tenant from degrading others) |
| **Feature flags** | LaunchDarkly or a simple in-house flag table — needed for per-tenant module rollout and gradual feature releases |
| **Testing** | Unit tests per module (Jest), integration tests for cross-module flows (e.g., quotation → invoice), E2E (Playwright) for critical paths (signup, invoice creation, payment) |
| **Security** | RLS as the tenant-isolation backstop, dependency scanning (Dependabot/Snyk), regular pen-test before GA |

### 5.3 Team Sequencing Recommendation
Given this is a large scope: staff Phase 0–1 with a small core team (2–3 full-stack devs) to nail the module framework and shared components correctly — every phase after this reuses that foundation, so rushing it is the single biggest risk to the whole roadmap.

---

## Open Decisions to Resolve Before Coding Starts
1. Auth: build custom multi-tenant auth, or adopt Clerk/Auth0/WorkOS to save weeks of work?
2. Billing provider: Stripe Billing vs. a custom subscription/metering layer?
3. Which module ships first to design partners — CRM+Sales is the safest bet since it needs the least cross-module dependency.
4. Hosting target for v1 (Railway/Render for speed vs. AWS from day one for control)?
