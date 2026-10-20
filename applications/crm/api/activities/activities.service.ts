// ═══════════════════════════════════════════════════════════
// ActivitiesService — Unified Task Queue, Calls & Meeting Logs
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PrismaClient,
  Prisma,
  ActivityType,
  ActivityPriority,
  ActivityStatus,
} from '@bahi/database';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(id?: string | null): boolean {
  return typeof id === 'string' && UUID_REGEX.test(id);
}

export interface CreateActivityDto {
  type:
    | 'CALL'
    | 'EMAIL'
    | 'MEETING'
    | 'TASK'
    | 'NOTE'
    | 'WHATSAPP'
    | 'SMS'
    | 'VISIT'
    | 'call'
    | 'email'
    | 'meeting'
    | 'task'
    | 'note'
    | 'whatsapp'
    | 'sms'
    | 'visit';
  subject: string;
  description?: string;
  dueDateTime?: string;
  durationMinutes?: number;
  priority?:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'URGENT'
    | 'Low'
    | 'Medium'
    | 'High'
    | 'Urgent'
    | 'low'
    | 'medium'
    | 'high'
    | 'urgent';
  assigneeId?: string;
  relatedType: 'lead' | 'deal' | 'contact' | 'company' | string;
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
      status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
      assigneeId?: string;
      relatedType?: string;
      relatedId?: string;
    },
  ) {
    const where: Prisma.ActivityWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (filters?.type) {
      where.type = filters.type.toUpperCase() as ActivityType;
    }
    if (filters?.assigneeId) {
      where.assigneeId = filters.assigneeId;
    }
    if (filters?.relatedType) {
      where.relatedType = filters.relatedType.toLowerCase();
    }
    if (filters?.relatedId) {
      where.relatedId = filters.relatedId;
    }
    if (filters?.status) {
      where.status = filters.status as ActivityStatus;
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    if (filters?.view === 'today') {
      where.status = ActivityStatus.PENDING;
      where.dueDateTime = { gte: startOfToday, lte: endOfToday };
    } else if (filters?.view === 'overdue') {
      where.status = ActivityStatus.PENDING;
      where.dueDateTime = { lt: startOfToday };
    } else if (filters?.view === 'upcoming') {
      where.status = ActivityStatus.PENDING;
      where.dueDateTime = { gt: endOfToday };
    } else if (filters?.view === 'completed') {
      where.status = ActivityStatus.COMPLETED;
    }

    const activities = await this.prisma.activity.findMany({
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
        { createdAt: 'desc' },
      ],
    });

    // Polymorphic name enrichment
    return Promise.all(
      activities.map(async (act) => {
        let relatedName = 'Related Record';
        if (isValidUuid(act.relatedId)) {
          try {
            if (act.relatedType === 'deal' || act.relatedType === 'opportunity') {
              const deal = await this.prisma.opportunity.findUnique({
                where: { id: act.relatedId },
                select: { title: true },
              });
              if (deal) relatedName = deal.title;
            } else if (act.relatedType === 'lead') {
              const lead = await this.prisma.lead.findUnique({
                where: { id: act.relatedId },
                select: { title: true },
              });
              if (lead) relatedName = lead.title;
            } else if (act.relatedType === 'company') {
              const comp = await this.prisma.company.findUnique({
                where: { id: act.relatedId },
                select: { name: true },
              });
              if (comp) relatedName = comp.name;
            } else if (act.relatedType === 'contact') {
              const contact = await this.prisma.contact.findUnique({
                where: { id: act.relatedId },
                select: { firstName: true, lastName: true },
              });
              if (contact) relatedName = `${contact.firstName} ${contact.lastName}`.trim();
            }
          } catch {
            // Graceful fallback
          }
        }
        return {
          ...act,
          relatedName,
        };
      }),
    );
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
            avatarUrl: true,
          },
        },
      },
    });

    if (!activity) {
      throw new NotFoundException(`Activity #${id} not found`);
    }

    let relatedName = 'Related Record';
    if (isValidUuid(activity.relatedId)) {
      try {
        if (activity.relatedType === 'deal' || activity.relatedType === 'opportunity') {
          const deal = await this.prisma.opportunity.findUnique({
            where: { id: activity.relatedId },
            select: { title: true },
          });
          if (deal) relatedName = deal.title;
        } else if (activity.relatedType === 'lead') {
          const lead = await this.prisma.lead.findUnique({
            where: { id: activity.relatedId },
            select: { title: true },
          });
          if (lead) relatedName = lead.title;
        } else if (activity.relatedType === 'company') {
          const comp = await this.prisma.company.findUnique({
            where: { id: activity.relatedId },
            select: { name: true },
          });
          if (comp) relatedName = comp.name;
        } else if (activity.relatedType === 'contact') {
          const contact = await this.prisma.contact.findUnique({
            where: { id: activity.relatedId },
            select: { firstName: true, lastName: true },
          });
          if (contact) relatedName = `${contact.firstName} ${contact.lastName}`.trim();
        }
      } catch {
        // Graceful fallback
      }
    }

    return {
      ...activity,
      relatedName,
    };
  }

  async create(tenantId: string, dto: CreateActivityDto, userId?: string) {
    const rawType = (dto.type || 'TASK').toUpperCase();
    const normalizedType: ActivityType = (Object.values(ActivityType).includes(rawType as any)
      ? rawType
      : ActivityType.TASK) as ActivityType;

    const rawPriority = (dto.priority || 'MEDIUM').toUpperCase();
    const normalizedPriority: ActivityPriority = (['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(rawPriority)
      ? rawPriority
      : ActivityPriority.MEDIUM) as ActivityPriority;

    const parsedDue = dto.dueDateTime && !isNaN(Date.parse(dto.dueDateTime))
      ? new Date(dto.dueDateTime)
      : undefined;

    return this.prisma.activity.create({
      data: {
        tenantId,
        type: normalizedType,
        subject: dto.subject,
        description: dto.description,
        dueDateTime: parsedDue,
        durationMinutes: dto.durationMinutes ?? 30,
        priority: normalizedPriority,
        assigneeId: dto.assigneeId || userId,
        relatedType: (dto.relatedType || 'deal').toLowerCase(),
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
            email: true,
            avatarUrl: true,
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
