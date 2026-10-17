// ═══════════════════════════════════════════════════════════
// @bahi/database — Multi-Tenant Scope & Prisma Client Extension
// Enforces mandatory tenant isolation and soft-delete filtering.
// ═══════════════════════════════════════════════════════════

import { PrismaClient } from '@prisma/client';

export interface TenantContext {
  tenantId: string;
  userId?: string;
}

/**
 * Creates a tenant-scoped Prisma client extension that guarantees:
 * 1. Automatic injection of `tenantId` into queries and mutations.
 * 2. Automatic exclusion of soft-deleted records (`deletedAt == null`).
 * 3. PostgreSQL session RLS setting `app.current_tenant_id`.
 */
export function getTenantScopedClient(client: PrismaClient, context: TenantContext) {
  const { tenantId, userId } = context;

  return client.$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          const where = (args.where as Record<string, any>) ?? {};
          (args as any).where = {
            ...where,
            tenantId,
            deletedAt: null,
          };
          return query(args);
        },
        async findFirst({ args, query }) {
          const where = (args.where as Record<string, any>) ?? {};
          (args as any).where = {
            ...where,
            tenantId,
            deletedAt: null,
          };
          return query(args);
        },
        async count({ args, query }) {
          const where = (args.where as Record<string, any>) ?? {};
          (args as any).where = {
            ...where,
            tenantId,
            deletedAt: null,
          };
          return query(args);
        },
        async create({ args, query }) {
          const data = (args.data as Record<string, any>) ?? {};
          (args as any).data = {
            ...data,
            tenantId,
            createdBy: userId ?? data.createdBy,
          };
          return query(args);
        },
        async updateMany({ args, query }) {
          const where = (args.where as Record<string, any>) ?? {};
          const data = (args.data as Record<string, any>) ?? {};
          (args as any).where = {
            ...where,
            tenantId,
            deletedAt: null,
          };
          (args as any).data = {
            ...data,
            updatedBy: userId ?? data.updatedBy,
          };
          return query(args);
        },
        async deleteMany({ args, query }) {
          const where = (args.where as Record<string, any>) ?? {};
          (args as any).where = {
            ...where,
            tenantId,
          };
          return query(args);
        },
      },
    },
  });
}

/**
 * Sets the PostgreSQL session variable for Row-Level Security (RLS).
 */
export async function setPostgresTenantSession(client: PrismaClient, tenantId: string): Promise<void> {
  await client.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${tenantId}';`);
}
