import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Log an auditable action on any entity.
   */
  async log(params: {
    tenantId: string;
    userId: string;
    action: 'create' | 'update' | 'delete';
    entityType: string;
    entityId: string;
    changes?: Record<string, { old: unknown; new: unknown }>;
    ipAddress?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        ...params,
        changes: params.changes as unknown as undefined,
      },
    });
  }

  /**
   * Retrieve audit trail for a specific entity.
   */
  async getForEntity(tenantId: string, entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { tenantId, entityType, entityId },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
