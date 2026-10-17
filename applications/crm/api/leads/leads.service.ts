// ═══════════════════════════════════════════════════════════
// LeadsService — Production Inbound Lead Intake & Conversion
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';

export interface CreateLeadDto {
  title: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  source?: string;
  score?: number;
  rating?: 'HOT' | 'WARM' | 'COLD';
  ownerId?: string;
  interestNotes?: string;
  customFields?: Record<string, any>;
}

export interface UpdateLeadDto {
  title?: string;
  companyName?: string;
  source?: string;
  status?: 'NEW' | 'CONTACTED' | 'WORKING' | 'QUALIFIED' | 'UNQUALIFIED' | 'CONVERTED';
  score?: number;
  rating?: 'HOT' | 'WARM' | 'COLD';
  ownerId?: string;
  interestNotes?: string;
  customFields?: Record<string, any>;
}

export interface ConvertLeadDto {
  dealTitle?: string;
  dealValue?: number;
  pipelineId?: string;
  stageId?: string;
  ownerId?: string;
  expectedCloseDate?: string;
}

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(
    tenantId: string,
    filters?: {
      status?: string;
      rating?: string;
      source?: string;
      ownerId?: string;
      search?: string;
    },
  ) {
    const where: any = {
      tenantId,
      deletedAt: null,
    };

    if (filters?.status) where.status = filters.status;
    if (filters?.rating) where.rating = filters.rating;
    if (filters?.source) where.source = filters.source;
    if (filters?.ownerId) where.ownerId = filters.ownerId;
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { companyName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.lead.findMany({
      where,
      include: {
        contact: true,
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
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        contact: true,
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
    });

    if (!lead) {
      throw new NotFoundException(`Lead #${id} not found`);
    }

    return lead;
  }

  async create(tenantId: string, dto: CreateLeadDto, userId?: string) {
    let contactId: string | undefined;

    // If firstName or email provided, create associated Contact
    if (dto.firstName || dto.lastName || dto.email) {
      const contact = await this.prisma.contact.create({
        data: {
          tenantId,
          firstName: dto.firstName || 'Inbound',
          lastName: dto.lastName || 'Lead',
          emails: dto.email ? [{ email: dto.email, isPrimary: true, label: 'Work' }] : [],
          phones: dto.phone ? [{ phone: dto.phone, type: 'Mobile', isWhatsApp: true, isPrimary: true }] : [],
          source: dto.source || 'Inbound Website',
          lifecycleStage: 'LEAD',
          ownerId: dto.ownerId || userId,
          createdBy: userId,
        },
      });
      contactId = contact.id;
    }

    return this.prisma.lead.create({
      data: {
        tenantId,
        title: dto.title || `${dto.firstName || ''} ${dto.lastName || ''} — ${dto.companyName || 'Inquiry'}`.trim(),
        companyName: dto.companyName,
        contactId,
        source: dto.source || 'Inbound Website',
        status: 'NEW',
        score: dto.score ?? 50,
        rating: dto.rating ?? 'WARM',
        ownerId: dto.ownerId || userId,
        interestNotes: dto.interestNotes,
        customFields: dto.customFields ?? {},
        createdBy: userId,
      },
      include: {
        contact: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateLeadDto, userId?: string) {
    await this.findOne(tenantId, id);

    return this.prisma.lead.update({
      where: { id },
      data: {
        ...dto,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      include: {
        contact: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async disqualify(tenantId: string, id: string, reason: string, userId?: string) {
    await this.findOne(tenantId, id);

    return this.prisma.lead.update({
      where: { id },
      data: {
        status: 'UNQUALIFIED',
        disqualifiedReason: reason,
        disqualifiedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  async recycle(tenantId: string, id: string, userId?: string) {
    await this.findOne(tenantId, id);

    return this.prisma.lead.update({
      where: { id },
      data: {
        status: 'NEW',
        recycledAt: new Date(),
        disqualifiedReason: null,
        disqualifiedAt: null,
        updatedBy: userId,
      },
    });
  }

  /**
   * One-click conversion: Lead -> Contact + Company + Opportunity (Deal)
   */
  async convert(tenantId: string, id: string, dto?: ConvertLeadDto, userId?: string) {
    const lead = await this.findOne(tenantId, id);

    if (lead.status === 'CONVERTED') {
      throw new BadRequestException('Lead has already been converted');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Create or link Company
      let companyId: string | undefined;
      if (lead.companyName) {
        let company = await tx.company.findFirst({
          where: { tenantId, name: { equals: lead.companyName, mode: 'insensitive' }, deletedAt: null },
        });

        if (!company) {
          company = await tx.company.create({
            data: {
              tenantId,
              name: lead.companyName,
              ownerId: dto?.ownerId || lead.ownerId || userId,
              createdBy: userId,
            },
          });
        }
        companyId = company.id;
      }

      // 2. Link or promote Contact to Opportunity stakeholder
      let contactId = lead.contactId;
      if (contactId) {
        await tx.contact.update({
          where: { id: contactId },
          data: {
            lifecycleStage: 'OPPORTUNITY',
            companyId: companyId ?? undefined,
            updatedBy: userId,
          },
        });
      } else {
        const contact = await tx.contact.create({
          data: {
            tenantId,
            firstName: lead.title.split(' ')[0] || 'Contact',
            lastName: lead.title.split(' ').slice(1).join(' ') || 'Lead',
            companyId,
            lifecycleStage: 'OPPORTUNITY',
            ownerId: dto?.ownerId || lead.ownerId || userId,
            createdBy: userId,
          },
        });
        contactId = contact.id;
      }

      // 3. Resolve Pipeline and First Stage
      let pipelineId = dto?.pipelineId;
      if (!pipelineId) {
        const defaultPipeline = await tx.pipeline.findFirst({
          where: { tenantId, isDefault: true, deletedAt: null },
        });
        pipelineId = defaultPipeline?.id;
      }

      let stageId = dto?.stageId;
      if (!stageId && pipelineId) {
        const firstStage = await tx.pipelineStage.findFirst({
          where: { tenantId, pipelineId, deletedAt: null },
          orderBy: { order: 'asc' },
        });
        stageId = firstStage?.id;
      }

      if (!pipelineId || !stageId) {
        throw new BadRequestException('No active pipeline stage found for conversion');
      }

      // 4. Create Opportunity / Deal
      const deal = await tx.opportunity.create({
        data: {
          tenantId,
          title: dto?.dealTitle || `${lead.companyName || lead.title} — New Deal`,
          contactId,
          companyId,
          pipelineId,
          stageId,
          value: dto?.dealValue ?? 5000.00,
          probability: 40,
          forecastCategory: 'PIPELINE',
          ownerId: dto?.ownerId || lead.ownerId || userId,
          expectedCloseDate: dto?.expectedCloseDate ? new Date(dto.expectedCloseDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdBy: userId,
        },
      });

      // 5. Mark Lead as CONVERTED
      const updatedLead = await tx.lead.update({
        where: { id },
        data: {
          status: 'CONVERTED',
          convertedContactId: contactId,
          convertedCompanyId: companyId,
          convertedDealId: deal.id,
          convertedAt: new Date(),
          updatedBy: userId,
        },
      });

      return {
        lead: updatedLead,
        deal,
        contactId,
        companyId,
      };
    });
  }

  async remove(tenantId: string, id: string, userId?: string) {
    await this.findOne(tenantId, id);

    return this.prisma.lead.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  async bulkUpdateStatus(tenantId: string, ids: string[], status: any, userId?: string) {
    return this.prisma.lead.updateMany({
      where: { tenantId, id: { in: ids } },
      data: { status, updatedBy: userId, updatedAt: new Date() },
    });
  }

  async bulkAssign(tenantId: string, ids: string[], ownerId: string, userId?: string) {
    return this.prisma.lead.updateMany({
      where: { tenantId, id: { in: ids } },
      data: { ownerId, updatedBy: userId, updatedAt: new Date() },
    });
  }
}
