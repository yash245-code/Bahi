// ═══════════════════════════════════════════════════════════
// PrismaService — Injectable wrapper around PrismaClient
// Handles PostgreSQL connection lifecycle & tenant client factory
// ═══════════════════════════════════════════════════════════

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, getTenantScopedClient, setPostgresTenantSession } from '@bahi/database';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['error', 'warn']
          : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Connected to PostgreSQL database');
    } catch (err: any) {
      console.warn('⚠️  Prisma could not connect to PostgreSQL on startup. Ensure PostgreSQL is running and check DATABASE_URL in .env.');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Returns a tenant-scoped Prisma client extension with automatic
   * tenantId injection and soft-delete filtering.
   */
  forTenant(tenantId: string, userId?: string) {
    return getTenantScopedClient(this, { tenantId, userId });
  }

  /**
   * Sets PostgreSQL RLS session setting `app.current_tenant_id`
   */
  async setTenantSession(tenantId: string): Promise<void> {
    await setPostgresTenantSession(this, tenantId);
  }
}
