// ═══════════════════════════════════════════════════════════
// ContactsService — Stakeholder Directory & Customer 360 View
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';

export interface CreateContactDto {
  firstName: string;
  lastName: string;
  salutation?: string;
  emails?: Array<{ email: string; isPrimary: boolean; label: string }>;
  phones?: Array<{ phone: string; type: string; isWhatsApp: boolean; isPrimary: boolean }>;
  jobTitle?: string;
  department?: string;
  companyId?: string;
  lifecycleStage?: 'SUBSCRIBER' | 'LEAD' | 'MQL' | 'SQL' | 'OPPORTUNITY' | 'CUSTOMER' | 'EVANGELIST' | 'OTHER';
  ownerId?: string;
  tags?: string[];
  address?: Record<string, any>;
  customFields?: Record<string, any>;
}

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(
    tenantId: string,
    filters?: {
      companyId?: string;
      lifecycleStage?: string;
      ownerId?: string;
      search?: string;
    },
  ) {
    const where: any = {
      tenantId,
      deletedAt: null,
    };

    if (filters?.companyId) where.companyId = filters.companyId;
    if (filters?.lifecycleStage) where.lifecycleStage = filters.lifecycleStage;
    if (filters?.ownerId) where.ownerId = filters.ownerId;
    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.contact.findMany({
      where,
      include: {
        company: { select: { id: true, name: true, domain: true } },
        owner: {
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
    });
  }

  async findOne(tenantId: string, id: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        company: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
        opportunities: {
          where: { deletedAt: null },
          include: { stage: true },
          orderBy: { createdAt: 'desc' },
        },
        quotes: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!contact) {
      throw new NotFoundException(`Contact #${id} not found`);
    }

    // Fetch related activities
    const activities = await this.prisma.activity.findMany({
      where: {
        tenantId,
        relatedType: 'contact',
        relatedId: id,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      ...contact,
      opportunities: contact.opportunities.map((o) => ({
        ...o,
        value: Number(o.value),
      })),
      activities,
    };
  }

  async create(tenantId: string, dto: CreateContactDto, userId?: string) {
    return this.prisma.contact.create({
      data: {
        tenantId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        salutation: dto.salutation,
        emails: (dto.emails as any) ?? [],
        phones: (dto.phones as any) ?? [],
        jobTitle: dto.jobTitle,
        department: dto.department,
        companyId: dto.companyId,
        lifecycleStage: dto.lifecycleStage ?? 'LEAD',
        ownerId: dto.ownerId || userId,
        tags: dto.tags ?? [],
        address: dto.address ?? {},
        customFields: dto.customFields ?? {},
        createdBy: userId,
      },
      include: {
        company: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async update(tenantId: string, id: string, dto: Partial<CreateContactDto>, userId?: string) {
    await this.findOne(tenantId, id);

    return this.prisma.contact.update({
      where: { id },
      data: {
        ...dto,
        emails: dto.emails ? (dto.emails as any) : undefined,
        phones: dto.phones ? (dto.phones as any) : undefined,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      include: { company: true },
    });
  }

  async remove(tenantId: string, id: string, userId?: string) {
    await this.findOne(tenantId, id);

    return this.prisma.contact.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: userId,
      },
    });
  }
}
