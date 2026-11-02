# Bahi Architecture & Run Instructions

Bahi is a modular multi-tenant ERP and CRM platform built as a Turborepo monorepo.

## Architecture

- **Frontend (`frontend/`)**: Next.js 15 (App Router, React 19, Tailwind CSS).
- **Backend (`backend/`)**: NestJS 11 REST API with JWT authentication and tenant-scoped guards.
- **Applications (`applications/`)**: Modular micro-apps (CRM, Inventory, Sales, Accounting, etc.).
- **Packages (`packages/`)**:
  - `@bahi/database`: Prisma ORM with PostgreSQL client, schema, migrations, and seeds.
  - `@bahi/types`: Shared TypeScript definitions and interfaces.
  - `@bahi/tsconfig`: Shared TypeScript compiler configurations.

## Prerequisites

- Node.js >= 20.0.0
- PostgreSQL >= 16 (local or containerized)
- npm >= 10.0.0

## Quick Start

1. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Configure DATABASE_URL and JWT_SECRET
   ```

2. **Start Database**:
   ```bash
   docker compose up -d postgres
   ```

3. **Install Dependencies & Generate Schema**:
   ```bash
   npm install
   npm run db:generate
   npm run db:migrate
   ```

4. **Run Development Servers**:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:4000/api/v1`

5. **Build & Verify**:
   ```bash
   npm run build
   npm run lint
   npm test
   ```
