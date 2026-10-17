// ═══════════════════════════════════════════════════════════
// ActivitiesService — Unified Task Queue, Calls & Meeting Logs
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';

export interface CreateActivityDto {
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK' | 'NOTE' | 'WHATSAPP' | 'SMS' | 'VISIT';
  subject: string;
  description?: string;
  dueDateTime?: string;
  durationMinutes?: number;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeId?: string;
  relatedType: 'lead' | 'deal' | 'contact' | 'company';
  relatedId: string;
  outcome?: string;
  reminders?: Array<{ minutesBefore: number; method: string }>;
}

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(
    tenantId: string,
    filters?: {
      view?: 'today' | 'overdue' | 'upcoming' | 'completed' | 'all';
      type?: string;
      assigneeId?: string;
      relatedType?: string;
      relatedId?: string;
    },
  ) {
    const where: any = {
      tenantId,
      deletedAt: null,
    };

    if (filters?.type) where.type = filters.type;
    if (filters?.assigneeId) where.assigneeId = filters.assigneeId;
    if (filters?.relatedType && filters?.relatedId) {
      where.relatedType = filters.relatedType;
      where.relatedId = filters.relatedId;
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    if (filters?.view === 'today') {
      where.status = 'PENDING';
      where.dueDateTime = { gte: startOfToday, lte: endOfToday };
    } else if (filters?.view === 'overdue') {
      where.status = 'PENDING';
      where.dueDateTime = { lt: startOfToday };
    } else if (filters?.view === 'upcoming') {
      where.status = 'PENDING';
      where.dueDateTime = { gt: endOfToday };
    } else if (filters?.view === 'completed') {
      where.status = 'COMPLETED';
    }

    return this.prisma.activity.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { dueDateTime: 'asc' },
      ],
    });
  }

  async findOne(tenantId: string, id: string) {
    const activity = await this.prisma.activity.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!activity) {
      throw new NotFoundException(`Activity #${id} not found`);
    }

    return activity;
  }

  async create(tenantId: string, dto: CreateActivityDto, userId?: string) {
    return this.prisma.activity.create({
      data: {
        tenantId,
        type: dto.type,
        subject: dto.subject,
        description: dto.description,
        dueDateTime: dto.dueDateTime ? new Date(dto.dueDateTime) : undefined,
        durationMinutes: dto.durationMinutes ?? 30,
        priority: dto.priority ?? 'MEDIUM',
        assigneeId: dto.assigneeId || userId,
        relatedType: dto.relatedType,
        relatedId: dto.relatedId,
        outcome: dto.outcome,
        reminders: (dto.reminders as any) ?? [],
        createdBy: userId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async complete(tenantId: string, id: string, outcome?: string) {
    await this.findOne(tenantId, id);

    return this.prisma.activity.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        outcome,
        completedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    return this.prisma.activity.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
