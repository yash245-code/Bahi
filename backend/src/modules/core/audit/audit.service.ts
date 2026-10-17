// ═══════════════════════════════════════════════════════════
// AuditService — Immutable Audit Trail Logging & History
// ═══════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Log an auditable event with before/after state diffs.
   */
  async log(params: {
    tenantId: string;
    userId?: string;
    action: string; // 'CREATE' | 'UPDATE' | 'DELETE' | 'STAGE_CHANGE' | 'CONVERT'
    entityType: string;
    entityId: string;
    oldValues?: Record<string, unknown> | null;
    newValues?: Record<string, unknown> | null;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        tenantId: params.tenantId,
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        oldValues: (params.oldValues as any) ?? undefined,
        newValues: (params.newValues as any) ?? undefined,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  }

  /**
   * Retrieve chronological audit trail for a specific entity.
   */
  async getForEntity(tenantId: string, entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { tenantId, entityType, entityId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  /**
   * List audit log with filtering for compliance export.
   */
  async list(tenantId: string, query?: { entityType?: string; action?: string; limit?: number }) {
    return this.prisma.auditLog.findMany({
      where: {
        tenantId,
        ...(query?.entityType ? { entityType: query.entityType } : {}),
        ...(query?.action ? { action: query.action } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: query?.limit ?? 50,
    });
  }
}
