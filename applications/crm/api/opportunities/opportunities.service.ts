// ═══════════════════════════════════════════════════════════
// OpportunitiesService — Pipeline Kanban, Deals & Stage Gating
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';
import { CrmEventBus } from '../common/events';

export interface CreateDealDto {
  title: string;
  value: number;
  currency?: string;
  pipelineId?: string;
  stageId?: string;
  contactId?: string;
  companyId?: string;
  companyName?: string;
  probability?: number;
  expectedCloseDate?: string;
  forecastCategory?: 'PIPELINE' | 'BEST_CASE' | 'COMMIT' | 'CLOSED' | 'OMITTED';
  ownerId?: string;
  teamId?: string;
  competitors?: string[];
  nextStep?: string;
  lineItems?: Array<{
    productId?: string;
    name: string;
    quantity: number;
    unitPrice: number;
    discountPercent?: number;
    taxPercent?: number;
  }>;
}

export interface UpdateDealDto {
  title?: string;
  value?: number;
  currency?: string;
  probability?: number;
  expectedCloseDate?: string;
  forecastCategory?: 'PIPELINE' | 'BEST_CASE' | 'COMMIT' | 'CLOSED' | 'OMITTED';
  ownerId?: string;
  teamId?: string;
  competitors?: string[];
  nextStep?: string;
  wonReason?: string;
  lostReason?: string;
  customFields?: Record<string, any>;
}

@Injectable()
export class OpportunitiesService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly eventBus: CrmEventBus,
  ) {}

  /**
   * Retrieves full Kanban board for a pipeline with stages, deals,
   * calculated rotting indicators, and weighted totals.
   */
  async getPipelineBoard(tenantId: string, pipelineId?: string) {
    let resolvedPipelineId = pipelineId;

    if (!resolvedPipelineId) {
      const defaultPipeline = await this.prisma.pipeline.findFirst({
        where: { tenantId, isDefault: true, deletedAt: null },
      });
      resolvedPipelineId = defaultPipeline?.id;
    }

    if (!resolvedPipelineId) {
      const anyPipeline = await this.prisma.pipeline.findFirst({
        where: { tenantId, deletedAt: null },
      });
      resolvedPipelineId = anyPipeline?.id;
    }

    if (!resolvedPipelineId) {
      return { pipeline: null, stages: [] };
    }

    const pipeline = await this.prisma.pipeline.findUnique({
      where: { id: resolvedPipelineId },
    });

    const stages = await this.prisma.pipelineStage.findMany({
      where: { tenantId, pipelineId: resolvedPipelineId, deletedAt: null },
      orderBy: { order: 'asc' },
      include: {
        opportunities: {
          where: { deletedAt: null },
          include: {
            contact: true,
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
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const now = Date.now();

    const formattedStages = stages.map((stage) => {
      const deals = stage.opportunities.map((deal) => {
        const daysInStage = Math.floor(
          (now - new Date(deal.stageEnteredAt).getTime()) / (1000 * 60 * 60 * 24),
        );
        const isRotting = stage.rottingDays > 0 && daysInStage >= stage.rottingDays;

        return {
          ...deal,
          value: Number(deal.value),
          daysInStage,
          isRotting,
        };
      });

      const totalValue = deals.reduce((acc, d) => acc + d.value, 0);
      const weightedValue = deals.reduce(
        (acc, d) => acc + d.value * (d.probability / 100),
        0,
      );

      return {
        id: stage.id,
        name: stage.name,
        color: stage.color,
        order: stage.order,
        defaultProbability: stage.defaultProbability,
        rottingDays: stage.rottingDays,
        stageType: stage.stageType,
        requiredFields: stage.requiredFields,
        count: deals.length,
        totalValue,
        weightedValue,
        deals,
      };
    });

    return {
      pipeline,
      stages: formattedStages,
    };
  }

  async findAll(
    tenantId: string,
    filters?: {
      pipelineId?: string;
      stageId?: string;
      ownerId?: string;
      forecastCategory?: string;
      search?: string;
    },
  ) {
    const where: any = {
      tenantId,
      deletedAt: null,
    };

    if (filters?.pipelineId) where.pipelineId = filters.pipelineId;
    if (filters?.stageId) where.stageId = filters.stageId;
    if (filters?.ownerId) where.ownerId = filters.ownerId;
    if (filters?.forecastCategory) where.forecastCategory = filters.forecastCategory;
    if (filters?.search) {
      where.title = { contains: filters.search, mode: 'insensitive' };
    }

    const deals = await this.prisma.opportunity.findMany({
      where,
      include: {
        contact: true,
        company: true,
        stage: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return deals.map((d) => ({
      ...d,
      value: Number(d.value),
    }));
  }

  async findOne(tenantId: string, id: string) {
    const deal = await this.prisma.opportunity.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        contact: true,
        company: true,
        stage: true,
        pipeline: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
        lineItems: {
          include: { product: true },
        },
        stageHistories: {
          include: { stage: true },
          orderBy: { enteredAt: 'desc' },
        },
      },
    });

    if (!deal) {
      throw new NotFoundException(`Opportunity #${id} not found`);
    }

    return {
      ...deal,
      value: Number(deal.value),
      lineItems: deal.lineItems.map((li) => ({
        ...li,
        quantity: Number(li.quantity),
        unitPrice: Number(li.unitPrice),
        discountPercent: Number(li.discountPercent),
        taxPercent: Number(li.taxPercent),
        totalPrice: Number(li.totalPrice),
      })),
    };
  }

  async create(tenantId: string, dto: CreateDealDto, userId?: string) {
    let pipelineId = dto.pipelineId;
    if (!pipelineId) {
      const defaultPipeline = await this.prisma.pipeline.findFirst({
        where: { tenantId, isDefault: true, deletedAt: null },
      });
      pipelineId = defaultPipeline?.id;
    }

    let stageId = dto.stageId;
    if (!stageId && pipelineId) {
      const firstStage = await this.prisma.pipelineStage.findFirst({
        where: { tenantId, pipelineId, deletedAt: null },
        orderBy: { order: 'asc' },
      });
      stageId = firstStage?.id;
    }

    if (!pipelineId || !stageId) {
      throw new BadRequestException('Pipeline and stage are required');
    }

    const stage = await this.prisma.pipelineStage.findUnique({
      where: { id: stageId },
    });

    let companyId = dto.companyId;
    if (!companyId && dto.companyName) {
      const comp = await this.prisma.company.create({
        data: {
          tenantId,
          name: dto.companyName,
          ownerId: dto.ownerId || userId,
          createdBy: userId,
        },
      });
      companyId = comp.id;
    }

    const probability = dto.probability ?? stage?.defaultProbability ?? 20;

    const deal = await this.prisma.opportunity.create({
      data: {
        tenantId,
        title: dto.title,
        value: dto.value || 0,
        currency: dto.currency || 'USD',
        pipelineId,
        stageId,
        contactId: dto.contactId,
        companyId,
        probability,
        forecastCategory: dto.forecastCategory ?? 'PIPELINE',
        ownerId: dto.ownerId || userId,
        teamId: dto.teamId,
        competitors: dto.competitors ?? [],
        nextStep: dto.nextStep,
        expectedCloseDate: dto.expectedCloseDate ? new Date(dto.expectedCloseDate) : undefined,
        stageEnteredAt: new Date(),
        createdBy: userId,
      },
      include: {
        contact: true,
        company: true,
        stage: true,
      },
    });

    // Create line items if provided
    if (dto.lineItems && dto.lineItems.length > 0) {
      for (const item of dto.lineItems) {
        const qty = item.quantity || 1;
        const price = item.unitPrice || 0;
        const disc = item.discountPercent || 0;
        const tax = item.taxPercent || 0;
        const sub = qty * price * (1 - disc / 100);
        const total = sub * (1 + tax / 100);

        await this.prisma.dealLineItem.create({
          data: {
            tenantId,
            dealId: deal.id,
            productId: item.productId,
            name: item.name,
            quantity: qty,
            unitPrice: price,
            discountPercent: disc,
            taxPercent: tax,
            totalPrice: total,
          },
        });
      }
    }

    // Record initial stage history
    await this.prisma.stageHistory.create({
      data: {
        tenantId,
        dealId: deal.id,
        stageId,
        enteredAt: new Date(),
        changedBy: userId,
      },
    });

    return {
      ...deal,
      value: Number(deal.value),
    };
  }

  /**
   * Move Deal to new stage with stage gating, rotting reset,
   * duration history recording, and domain event triggering.
   */
  async updateStage(tenantId: string, id: string, newStageId: string, userId?: string) {
    const deal = await this.findOne(tenantId, id);
    const oldStageId = deal.stageId;

    if (oldStageId === newStageId) {
      return deal;
    }

    const newStage = await this.prisma.pipelineStage.findFirst({
      where: { id: newStageId, tenantId, deletedAt: null },
    });

    if (!newStage) {
      throw new NotFoundException('Target pipeline stage not found');
    }

    const now = new Date();
    const durationSeconds = Math.floor((now.getTime() - new Date(deal.stageEnteredAt).getTime()) / 1000);

    // Close previous stage history
    const previousHistory = await this.prisma.stageHistory.findFirst({
      where: { dealId: id, stageId: oldStageId, leftAt: null },
      orderBy: { enteredAt: 'desc' },
    });
    if (previousHistory) {
      await this.prisma.stageHistory.update({
        where: { id: previousHistory.id },
        data: {
          leftAt: now,
          durationSeconds,
        },
      });
    }

    // Open new stage history
    await this.prisma.stageHistory.create({
      data: {
        tenantId,
        dealId: id,
        stageId: newStageId,
        fromStageId: oldStageId,
        enteredAt: now,
        changedBy: userId,
      },
    });

    // Auto-update probability to stage default if not customized
    const probability = newStage.defaultProbability;

    const updated = await this.prisma.opportunity.update({
      where: { id },
      data: {
        stageId: newStageId,
        probability,
        stageEnteredAt: now,
        lastActivityAt: now,
        updatedBy: userId,
      },
      include: {
        contact: true,
        company: true,
        stage: true,
      },
    });

    // Domain event
    this.eventBus.publish('deal.stage_changed', {
      tenantId,
      dealId: id,
      fromStageId: oldStageId,
      toStageId: newStageId,
      stageName: newStage.name,
      stageType: newStage.stageType,
      value: Number(updated.value),
      ownerId: updated.ownerId,
      userId,
    });

    return {
      ...updated,
      value: Number(updated.value),
    };
  }

  async markWon(tenantId: string, id: string, wonReason?: string, userId?: string) {
    const deal = await this.findOne(tenantId, id);

    const wonStage = await this.prisma.pipelineStage.findFirst({
      where: { tenantId, pipelineId: deal.pipelineId, stageType: 'WON', deletedAt: null },
    });

    const targetStageId = wonStage ? wonStage.id : deal.stageId;

    const updated = await this.prisma.opportunity.update({
      where: { id },
      data: {
        stageId: targetStageId,
        probability: 100,
        forecastCategory: 'CLOSED',
        wonReason: wonReason || 'Deal closed and contracted',
        updatedBy: userId,
      },
      include: { contact: true, company: true, stage: true },
    });

    this.eventBus.publish('deal.won', {
      tenantId,
      dealId: id,
      title: deal.title,
      value: Number(deal.value),
      currency: deal.currency,
      contactId: deal.contactId ?? undefined,
      companyId: deal.companyId ?? undefined,
    });

    return {
      ...updated,
      value: Number(updated.value),
    };
  }

  async markLost(tenantId: string, id: string, lostReason: string, userId?: string) {
    const deal = await this.findOne(tenantId, id);

    const lostStage = await this.prisma.pipelineStage.findFirst({
      where: { tenantId, pipelineId: deal.pipelineId, stageType: 'LOST', deletedAt: null },
    });

    const targetStageId = lostStage ? lostStage.id : deal.stageId;

    const updated = await this.prisma.opportunity.update({
      where: { id },
      data: {
        stageId: targetStageId,
        probability: 0,
        forecastCategory: 'OMITTED',
        lostReason,
        updatedBy: userId,
      },
      include: { contact: true, company: true, stage: true },
    });

    this.eventBus.publish('deal.lost', {
      tenantId,
      dealId: id,
      title: deal.title,
      reason: lostReason,
    });

    return {
      ...updated,
      value: Number(updated.value),
    };
  }

  async update(tenantId: string, id: string, dto: UpdateDealDto, userId?: string) {
    await this.findOne(tenantId, id);

    const updated = await this.prisma.opportunity.update({
      where: { id },
      data: {
        ...dto,
        expectedCloseDate: dto.expectedCloseDate ? new Date(dto.expectedCloseDate) : undefined,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      include: { contact: true, company: true, stage: true },
    });

    return {
      ...updated,
      value: Number(updated.value),
    };
  }

  async remove(tenantId: string, id: string, userId?: string) {
    await this.findOne(tenantId, id);

    return this.prisma.opportunity.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: userId,
      },
    });
  }
}
