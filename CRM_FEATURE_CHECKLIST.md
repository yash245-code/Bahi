# Bahi CRM — Master Feature Checklist & Verification Matrix

This matrix maps every requirement from the Master Build Prompt to its architectural implementation, source code files, database schema, and test verification.

---

## 1. Authentication, Roles & Permissions
- [x] **Email & Password with Argon2 / Bcrypt:** Implemented in `backend/src/modules/core/auth/auth.service.ts` with salt generation and password hashing.
- [x] **JWT Access Token + Refresh Token in httpOnly Cookie:** Configured in `auth.controller.ts` with secure cookies and expiration.
- [x] **Role Hierarchy (Owner, Admin, Sales Manager, Team Lead, Sales Rep, Marketing, Support, Read-only):** Seeded automatically during tenant creation in `packages/database/prisma/seed.ts` and `auth.service.ts`.
- [x] **Granular Permissions & Field Visibility:** Enforced via `PermissionsGuard` (`backend/src/common/guards/permissions.guard.ts`) and `@RequirePermission()` decorator.
- [x] **Full Audit Logging:** Built into `backend/src/modules/core/audit/audit.service.ts` and PostgreSQL `audit_logs` table (who, what, old values, new values, IP, timestamp).

## 2. Multi-Tenant Data Model & PostgreSQL Row-Level Security
- [x] **PostgreSQL Prisma Schema:** 38 multi-tenant models defined in `packages/database/prisma/schema.prisma`.
- [x] **Strict Tenant Scoping:** Every model enforces `tenantId: UUID`, with `deletedAt: Timestamptz` for soft-deletion and `createdAt`/`updatedAt` telemetry.
- [x] **PostgreSQL RLS Policies:** `packages/database/prisma/rls_policies.sql` enables RLS on all CRM tables using `current_setting('app.current_tenant_id')`.
- [x] **Prisma Tenancy Query Extension:** `packages/database/src/tenancy.ts` automatically applies `tenantId` and `deletedAt: null` across all queries.
- [x] **Realistic Demo Seed Script:** `packages/database/prisma/seed.ts` populates Acme Corporation with pipelines, stages, sources, contacts, companies, catalog products, and opportunities.

## 3. Leads Management (Section 7.2)
- [x] **Lead Capture & Listing:** `LeadsController` and `LeadsService` in `applications/crm/api/leads/`.
- [x] **1-Click Atomic Conversion:** `convert(tenantId, leadId, dto)` converts lead into Contact + Company + Deal in a database transaction (`leads.service.ts:167-270`).
- [x] **Disqualification & Recycling:** `disqualify(tenantId, leadId, reason)` and `recycle(tenantId, leadId)` preserve lead history while managing pipeline cleanliness.
- [x] **Bulk Operations:** Bulk assign, tag, delete, and export implemented in `leads.service.ts:310-360`.
- [x] **Tested:** Verified in `applications/crm/api/leads/leads.service.spec.ts`.

## 4. Pipeline Kanban Board & Opportunities (Section 7.4)
- [x] **Drag-and-Drop Pipeline Board:** `CrmPipelineView.tsx` with live stages, card counts, total values, and weighted stage totals.
- [x] **Rotting Deal Indicator:** Real-time calculation flagging deals untouched past `rottingDays` threshold (`opportunities.service.ts:105-130`).
- [x] **Stage History Duration Tracking:** `StageHistory` records duration in seconds spent in each stage when deals advance (`opportunities.service.ts:390-415`).
- [x] **Won & Lost Dialogs:** `markWon` and `markLost` endpoints capture structured reasons and publish domain events (`opportunities.service.ts:447-510`).
- [x] **Tested:** Verified in `applications/crm/api/opportunities/opportunities.service.spec.ts`.

## 5. Account Directory & Stakeholders (Section 7.3)
- [x] **Company Directory:** `CrmCompaniesView.tsx` & `CompaniesService` managing account tier, domain, industry, and annual revenue.
- [x] **Contact 360 View:** `CrmContactsView.tsx` & `ContactsService` managing multiple emails, phones (WhatsApp flag), job titles, and relationship timelines.
- [x] **Merge Wizard & Deduplication:** `ImpexService.mergeRecords()` performs side-by-side merging with automatic deal and activity re-linking (`impex.service.ts:480-550`).

## 6. Unified Activity Center & Tasks (Section 7.5 & 7.6)
- [x] **Unified Task Queue:** `CrmActivitiesView.tsx` & `ActivitiesService` categorizing items into Today, Overdue, Upcoming, and Completed.
- [x] **Quick Log Modals:** Log Call, Meeting, Task, Note, or WhatsApp interaction directly from any record.
- [x] **Follow-up Triggering:** Completing an activity prompts automatic follow-up task creation.

## 7. Executive Telemetry & Forecasting (Section 7.1 & 7.19)
- [x] **Live Executive Metrics:** `AnalyticsService` (`applications/crm/api/analytics/`) computing win rates, open pipeline value, weighted pipeline, won revenue, and sales cycle duration.
- [x] **Visual Funnels & Charts:** Rendered in `CrmAnalyticsView.tsx` using calm, accessible terracotta `#A8462F` accent tones.

## 8. Visual Automation Engine & Cadence Sequences (Section 7.13 & 7.14)
- [x] **Visual Rule Evaluator:** `AutomationsService` (`applications/crm/api/automations/`) evaluates AND/OR condition trees (`eq`, `neq`, `gt`, `gte`, `contains`, `in`).
- [x] **Event-Driven Dispatch:** Listens to `CrmEventBus` events (`lead.created`, `deal.stage_changed`, `deal.won`) and executes `CREATE_TASK`, `NOTIFY_USER`, `UPDATE_FIELD`, and `CALL_WEBHOOK`.
- [x] **Outreach Sequences:** Multi-step cadences with configurable wait days and auto-stop on reply.
- [x] **Tested:** Verified in `applications/crm/api/automations/automations.service.spec.ts`.

## 9. Dynamic Lead Scoring & Intelligent Assignment (Section 7.12)
- [x] **Demographic & Firmographic Scoring:** Weighted scoring on job title (VP/Director/Chief) and company size (`scoring.service.ts:35-55`).
- [x] **Behavioral Scoring & Inactivity Decay:** Points for activities completed with decay penalty (-5 points per 14 days untouched).
- [x] **Lead Rating Classification:** Automatic classification into HOT, WARM, or COLD.
- [x] **Assignment Strategies:** `ROUND_ROBIN` rep rotation and `LOAD_BASED` distribution to rep with fewest open leads.
- [x] **Untouched Leads Sweep:** `reassignUntouchedLeads` automatically sweeps stale leads and redistributes them.
- [x] **Tested:** Verified in `applications/crm/api/scoring/scoring.service.spec.ts`.

## 10. Data Import, Export & Deduplication (Section 7.10 & 7.11)
- [x] **CSV/Excel Parser & Mapping:** `ImpexService.previewImport()` analyzes headers and auto-suggests CRM field mappings.
- [x] **Duplicate Policies:** Configurable `SKIP`, `UPDATE`, or `CREATE` execution modes (`impex.service.ts:145-200`).
- [x] **Export Engine:** `exportData()` produces formatted CSV exports with custom column filtering.
- [x] **Duplicate Scanner:** `scanDuplicates()` identifies potential duplicates by matching email or name.
- [x] **Tested:** Verified in `applications/crm/api/impex/impex.service.spec.ts`.

## 11. Quotations & Customer Portal (Section 7.15 & 7.23)
- [x] **Deal-to-Quote Generation:** `QuotesService.createFromDeal()` generates numbered quotation drafts (`QUO-YYYY-XXXX`) with subtotal, tax, and discount calculation.
- [x] **Public Customer Portal:** Unauthenticated secure portal endpoint `/api/v1/crm/portal/quotes/:id` for quote review.
- [x] **Digital E-Signature:** `acceptQuoteOnline()` stores customer signature data, updates status to `ACCEPTED`, and emits `quote.accepted`.

## 12. Global Omnibar Search (Section 7.18)
- [x] **Cross-Entity Omnibar Search:** `SearchService` (`applications/crm/api/search/`) executes parallel queries across leads, contacts, accounts, deals, and activities.
- [x] **Instant Navigation:** Returns unified search results with title, subtitle, status badges, and direct navigation links.

## 13. Deal Approvals & Quota Goals (Section 7.20 & 7.22)
- [x] **Deal Approval Workflows:** `ApprovalsService` manages exception requests for discounts and deal value thresholds with approver audit comments.
- [x] **Sales Quotas & Attainment:** `Goal` tracking computing monthly, quarterly, and annual revenue or activity attainment percentages.

## 14. Architecture, Testing & DevOps
- [x] **Zero Monorepo Compile Errors:**
  - `packages/database`: Verified `tsc` clean.
  - `@bahi/app-crm`: Verified `tsc` clean.
  - `backend`: Verified `nest build` clean.
  - `frontend`: Verified `next build` clean (all 13 static pages generated).
- [x] **Jest Test Suite:** 5 test suites, 14 unit and isolation tests passing 100% green.
- [x] **Continuous Integration Workflow:** GitHub Actions workflow configured in `.github/workflows/ci.yml`.
- [x] **Docker Infrastructure:** Configured in `docker-compose.yml` (Postgres 16, Redis 7, MinIO, Mailhog).
