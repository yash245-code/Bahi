# Bahi CRM — API Reference & Architecture Documentation

## Overview
Bahi CRM is an enterprise-grade, multi-tenant CRM engine built as a modular vertical slice within the Bahi business suite. It is designed to operate standalone or alongside future suite modules (Sales/Quotations, Invoicing/Accounting, Inventory, HR, Projects, Helpdesk, and Marketing).

---

## Authentication & Multi-Tenancy Architecture
- **Tenant Scoping:** All database tables enforce `tenant_id: UUID`.
- **Row-Level Security (RLS):** Database-enforced isolation via PostgreSQL session variable `app.current_tenant_id` and Prisma Client `$extends` query extensions.
- **Authentication:** Dual-layer JWT access tokens with Argon2/Bcrypt password hashing and secure session cookies.
- **Permission Checking:** `@RequirePermission(module, entity, action)` decorator with granular Role-Based Access Control (RBAC).

---

## REST Endpoints (`/api/v1/crm`)

### 1. Inbound Leads (`/crm/leads`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/crm/leads` | List tenant leads with filtering (`status`, `rating`, `source`, `ownerId`, `search`) |
| `GET` | `/crm/leads/:id` | Fetch lead details with linked Contact and Company |
| `POST` | `/crm/leads` | Create inbound lead with automated contact linking |
| `PATCH` | `/crm/leads/:id` | Update lead fields, score, or rating |
| `POST` | `/crm/leads/:id/convert` | 1-Click atomic conversion into Deal + Contact + Company |
| `POST` | `/crm/leads/:id/disqualify` | Disqualify lead with structured reason |
| `POST` | `/crm/leads/:id/recycle` | Recycle disqualified lead back to nurture |
| `DELETE` | `/crm/leads/:id` | Soft-delete lead record |

### 2. Opportunities & Pipeline Kanban (`/crm/opportunities`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/crm/opportunities/board` | Full Kanban board payload with stages, rotting indicators, and weighted totals |
| `GET` | `/crm/opportunities` | List deals with filtering and pagination |
| `GET` | `/crm/opportunities/:id` | Deal detail with line items, stage histories, and contacts |
| `POST` | `/crm/opportunities` | Create new deal with product line items |
| `PATCH` | `/crm/opportunities/:id` | Update deal value, close date, or forecast category |
| `PATCH` | `/crm/opportunities/:id/stage` | Move deal stage with duration tracking in `StageHistory` |
| `POST` | `/crm/opportunities/:id/won` | Mark deal as Won with reason capture and `deal.won` event |
| `POST` | `/crm/opportunities/:id/lost` | Mark deal as Lost with reason capture and `deal.lost` event |
| `DELETE` | `/crm/opportunities/:id` | Soft-delete deal |

### 3. Account Directory & Companies (`/crm/companies`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/crm/companies` | List companies with tier, health score, and domain |
| `GET` | `/crm/companies/:id` | Company 360 view with related contacts and active deals |
| `POST` | `/crm/companies` | Register company/account |
| `PATCH` | `/crm/companies/:id` | Update firmographic details and custom fields |
| `DELETE` | `/crm/companies/:id` | Soft-delete company |

### 4. Stakeholder Contacts (`/crm/contacts`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/crm/contacts` | List contacts with multiple emails and phones |
| `GET` | `/crm/contacts/:id` | Contact 360 view with interaction timeline and open deals |
| `POST` | `/crm/contacts` | Create stakeholder contact |
| `PATCH` | `/crm/contacts/:id` | Update contact attributes and opt-out preferences |
| `DELETE` | `/crm/contacts/:id` | Soft-delete contact |

### 5. Activities & Unified Task Queue (`/crm/activities`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/crm/activities` | Query unified queue (today, overdue, upcoming, completed) |
| `POST` | `/crm/activities` | Quick-log call, meeting, task, note, or WhatsApp follow-up |
| `PATCH` | `/crm/activities/:id/complete` | Complete task with outcome notes and follow-up trigger |
| `DELETE` | `/crm/activities/:id` | Soft-delete activity |

### 6. Workflow Automations & Sequences (`/crm/automations`, `/crm/sequences`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/crm/automations` | List visual automation rules |
| `POST` | `/crm/automations` | Create rule with trigger, nested conditions, and actions |
| `PATCH` | `/crm/automations/:id` | Update rule condition tree or action list |
| `POST` | `/crm/automations/:id/test` | Dry-run rule condition simulation against mock payload |
| `DELETE` | `/crm/automations/:id` | Delete automation rule |
| `GET` | `/crm/sequences` | List outreach sequences |
| `POST` | `/crm/sequences` | Create multi-step cadence (email, task, wait days) |
| `DELETE` | `/crm/sequences/:id` | Delete outreach sequence |

### 7. Lead Scoring & Assignment (`/crm/scoring`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/crm/scoring/leads/:id/calculate` | Recalculate demographic and behavioral score |
| `POST` | `/crm/scoring/leads/:id/assign` | Auto-assign lead via `ROUND_ROBIN` or `LOAD_BASED` |
| `POST` | `/crm/scoring/reassign-untouched` | Reassign stale untouched leads (> N days) |

### 8. Data Import, Export & Deduplication (`/crm/data`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/crm/data/import/preview` | Upload CSV, analyze headers, and get field suggestions |
| `POST` | `/crm/data/import/execute` | Run import with `SKIP`, `UPDATE`, or `CREATE` duplicate policy |
| `GET` | `/crm/data/export/:entity` | Export filtered views to formatted CSV string |
| `GET` | `/crm/data/duplicates/:entity` | Scan for potential duplicate contacts or companies |
| `POST` | `/crm/data/duplicates/merge` | Side-by-side record merge with relation re-linking |

### 9. Quotations & Customer Portal (`/crm/quotes`, `/crm/portal/quotes`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/crm/quotes` | List tenant quotations |
| `POST` | `/crm/quotes` | Create quotation with auto-calculated discounts and taxes |
| `POST` | `/crm/deals/:id/generate-quote` | Generate quote draft directly from opportunity |
| `GET` | `/crm/portal/quotes/:id` | Public customer portal endpoint to view quote |
| `POST` | `/crm/portal/quotes/:id/accept` | Public customer portal e-signature & quote acceptance |

### 10. Global Omnibar Search (`/crm/search`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/crm/search?q=...` | Cross-entity search across leads, contacts, accounts, and deals |

### 11. Deal Approvals & Sales Goals (`/crm/approvals`, `/crm/goals`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/crm/approvals` | List pending, approved, and rejected deal exception requests |
| `POST` | `/crm/approvals` | Request discount or deal value exception approval |
| `POST` | `/crm/approvals/:id/decide` | Approve or reject deal exception with audit feedback |
| `GET` | `/crm/goals` | List revenue and activity targets with quota attainment % |
| `POST` | `/crm/goals` | Set monthly, quarterly, or annual sales quotas |
| `POST` | `/crm/goals/:id/recalculate` | Recalculate actual quota attainment percentage |

---

## Domain Event Bus (`CrmEventBus`)

The CRM emits domain events on all key milestones:
1. `lead.created` — Broadcast when new lead is ingested.
2. `lead.converted` — Broadcast when lead is converted to deal + contact + company.
3. `deal.stage_changed` — Broadcast on every stage movement; listened to by AutomationsService.
4. `deal.won` — Triggers quotation handoff to Sales/Invoicing and sends notifications.
5. `deal.lost` — Updates pipeline forecast category and logs lost reason.
6. `quote.accepted` — Emitted when customer digitally signs quote on public portal.
