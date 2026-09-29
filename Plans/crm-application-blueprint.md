# CRM & Revenue Operations Application — Architectural Blueprint

This blueprint defines the architecture, data domain, sub-page hierarchy, API contracts, and user experience for the dedicated **CRM & Revenue Operations** modular application within the Bahi Business Suite.

---

## 1. Architectural Principles

1. **Self-Contained Vertical Slice (`applications/crm/`)**:
   - **`manifest.ts`**: Application manifest declaring metadata, version, plan tiers (`starter`, `growth`, `enterprise`), permissions, and sub-navigation links.
   - **`api/`**: Backend NestJS module providing REST endpoints for leads, deals, companies, contacts, and activity timelines.
   - **`web/`**: Next.js React presentation layer including interactive Kanban boards, tables, modals, and telemetry analytics.
   - **`package.json`**: Scoped workspace package `@bahi/app-crm`.

2. **Decoupled Integration**:
   - The platform shell (`frontend/`) discovers and renders CRM sub-pages via dynamic manifest routing.
   - The modular backend (`backend/src/app.module.ts`) imports `CrmModule` directly from `@bahi/app-crm/api`.
   - Access is guarded at the HTTP layer via `@RequireApplication('crm')` and `ApplicationAccessGuard`.

3. **Design Aesthetics**:
   - Complies with Bahi's *"Paper & Rust"* color palette:
     - Primary Terracotta Accent: `#A8462F`
     - CRM Module Accent: `#A8462F` / `rgba(168, 70, 47, 0.1)`
     - Warm Paper Background: `#FAF9F5` / `#F7F6F3`
     - Deep Charcoal Ink: `#20211F`
     - Status Success: `#1F7A4D`, Warning: `#B8790A`, Danger: `#B23A2E`

---

## 2. Multi-Page Hierarchy & Route Map

The CRM application is organized into 6 dedicated sub-pages accessible via a persistent top sub-navigation bar:

```
/crm (CRM App Root)
├── /crm/pipeline      (Default: Visual Deal Kanban Funnel & Stage Forecasting)
├── /crm/leads         (Inbound Lead Queue, Qualification, Lead Scoring)
├── /crm/companies     (Corporate Accounts, Annual Revenue, Deal Attribution)
├── /crm/contacts      (Individual Customer Contacts, Communication History)
├── /crm/activities    (Activity Timeline, Scheduled Calls, Meetings, Tasks)
└── /crm/analytics     (Win/Loss Ratios, Pipeline Velocity, Revenue Forecasting)
```

---

## 3. Sub-Page Specifications

### Page 1: Pipeline & Deals (`/crm`)
- **Purpose**: Visual Kanban board managing deals across conversion stages.
- **Stages**:
  1. *New Leads* (Initial contact, 20% probability)
  2. *Qualified* (Need verified & budget confirmed, 40% probability)
  3. *Proposal Sent* (Commercial quote delivered, 65% probability)
  4. *Negotiation* (Contract terms & legal review, 85% probability)
  5. *Won / Closed* (Signed contract & closed order, 100% probability)
- **Interactive Capabilities**:
  - Filter by priority (*Hot*, *High*, *Medium*, *Low*) and value thresholds.
  - Quick-search across deal titles, companies, and contacts.
  - Stage totals with dynamic probability-weighted pipeline calculation.
  - Deal cards with close probability meter, assignee avatar, and stage transition actions.

### Page 2: Leads & Intake (`/crm/leads`)
- **Purpose**: Inbound lead capture, vetting, and conversion.
- **Fields**: Name, Company, Email, Phone, Lead Source (`Inbound`, `Referral`, `Event`, `Outbound`), Lead Score (`0-100`), Status (`New`, `Contacted`, `Qualified`, `Unqualified`).
- **Interactive Capabilities**:
  - Filter by status and lead source.
  - One-click *Convert to Deal* action that creates both an Opportunity and an Account.
  - Add New Lead modal.

### Page 3: Accounts & Companies (`/crm/companies`)
- **Purpose**: Manage B2B client organizations and accounts.
- **Fields**: Company Name, Domain/Website, Industry, Tier (`Strategic`, `Enterprise`, `Mid-Market`, `SMB`), Total Deal Volume, Active Deals Count, Primary Account Manager.
- **Interactive Capabilities**:
  - Search by company name and industry.
  - Quick metrics: Total Accounts, Combined Pipeline Value, Average Account Size.

### Page 4: Contacts Directory (`/crm/contacts`)
- **Purpose**: Directory of individual decision-makers and stakeholders.
- **Fields**: Full Name, Job Title, Company, Email, Phone, Lifecycle Stage (`Lead`, `Opportunity Contact`, `Customer`), Last Contacted Date.
- **Interactive Capabilities**:
  - One-click actions: Email (`mailto:`), Call simulation, Log Note.
  - Lifecycle badge indicators.

### Page 5: Activities & Task Queue (`/crm/activities`)
- **Purpose**: Centralized log of sales interactions and scheduled follow-ups.
- **Activity Types**: 📞 Phone Call, 🤝 Client Meeting, ✉️ Email Sent, 📝 Note Added, ✅ Follow-Up Task.
- **Interactive Capabilities**:
  - Filter by activity type and completion status.
  - Mark task complete / pending.
  - Schedule new activity.

### Page 6: Forecasting & Reports (`/crm/analytics`)
- **Purpose**: Executive revenue telemetry and sales velocity reporting.
- **Metrics**:
  - Total Unweighted Pipeline vs Weighted Forecast Pipeline.
  - Win/Loss ratio and conversion rates by stage.
  - Average Deal Size and Sales Cycle Duration.
  - Monthly Expected Revenue run-rate.

---

## 4. Backend Domain & API Specification

Mounted under `/api/v1/crm` with JWT authentication and tenant isolation:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/crm/pipelines` | Get pipeline stages with embedded opportunities |
| `GET` | `/api/v1/crm/opportunities` | List all deals with optional stage/priority filter |
| `POST` | `/api/v1/crm/opportunities` | Create a new deal / opportunity |
| `PATCH` | `/api/v1/crm/opportunities/:id/stage` | Move deal to a new stage |
| `GET` | `/api/v1/crm/leads` | List inbound leads with status filter |
| `POST` | `/api/v1/crm/leads` | Create an inbound lead |
| `PATCH` | `/api/v1/crm/leads/:id` | Update lead status or scoring |
| `POST` | `/api/v1/crm/leads/:id/convert` | Convert lead to opportunity & contact |
| `GET` | `/api/v1/crm/companies` | List corporate accounts & deal aggregations |
| `POST` | `/api/v1/crm/companies` | Register a new corporate account |
| `GET` | `/api/v1/crm/activities` | List scheduled & logged sales activities |
| `POST` | `/api/v1/crm/activities` | Schedule a call, meeting, or task |
| `PATCH` | `/api/v1/crm/activities/:id/complete` | Mark activity as completed |
| `GET` | `/api/v1/crm/analytics` | Aggregate forecast and win-loss telemetry |
