// ═══════════════════════════════════════════════════════════
// PrismaService — Injectable wrapper around PrismaClient
// Handles connection lifecycle with NestJS hooks.
// ═══════════════════════════════════════════════════════════

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';

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
    } catch (err: any) {
      console.warn('⚠️  Prisma could not connect to database on startup. Ensure MongoDB is running or check DATABASE_URL in .env.');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
