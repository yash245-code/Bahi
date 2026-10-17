// ═══════════════════════════════════════════════════════════
// CompaniesService — Corporate Accounts & B2B Client Directory
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';

export interface CreateCompanyDto {
  name: string;
  legalName?: string;
  domain?: string;
  industry?: string;
  size?: string;
  annualRevenue?: number;
  currency?: string;
  taxId?: string;
  accountTier?: 'STRATEGIC' | 'ENTERPRISE' | 'MID_MARKET' | 'SMB';
  ownerId?: string;
  tags?: string[];
  billingAddress?: Record<string, any>;
  shippingAddress?: Record<string, any>;
  customFields?: Record<string, any>;
}

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(
    tenantId: string,
    filters?: {
      industry?: string;
      tier?: string;
      ownerId?: string;
      search?: string;
    },
  ) {
    const where: any = {
      tenantId,
      deletedAt: null,
    };

    if (filters?.industry) where.industry = filters.industry;
    if (filters?.tier) where.accountTier = filters.tier;
    if (filters?.ownerId) where.ownerId = filters.ownerId;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { domain: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const companies = await this.prisma.company.findMany({
      where,
      include: {
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
          select: { id: true, value: true, probability: true, stage: { select: { stageType: true } } },
        },
        _count: {
          select: { contacts: true, opportunities: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return companies.map((c) => {
      const activeDeals = c.opportunities.filter((o) => o.stage.stageType === 'OPEN');
      const totalVolume = c.opportunities.reduce((acc, o) => acc + Number(o.value), 0);
      const activePipeline = activeDeals.reduce((acc, o) => acc + Number(o.value), 0);

      return {
        id: c.id,
        name: c.name,
        legalName: c.legalName,
        domain: c.domain,
        industry: c.industry,
        size: c.size,
        annualRevenue: c.annualRevenue ? Number(c.annualRevenue) : null,
        accountTier: c.accountTier,
        healthScore: c.healthScore,
        tags: c.tags,
        owner: c.owner,
        contactsCount: c._count.contacts,
        dealsCount: c._count.opportunities,
        totalVolume,
        activePipeline,
        createdAt: c.createdAt,
      };
    });
  }

  async findOne(tenantId: string, id: string) {
    const company = await this.prisma.company.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
        contacts: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
        opportunities: {
          where: { deletedAt: null },
          include: { stage: true },
          orderBy: { createdAt: 'desc' },
        },
        subsidiaries: true,
        parentCompany: true,
      },
    });

    if (!company) {
      throw new NotFoundException(`Company #${id} not found`);
    }

    return {
      ...company,
      annualRevenue: company.annualRevenue ? Number(company.annualRevenue) : null,
      opportunities: company.opportunities.map((o) => ({
        ...o,
        value: Number(o.value),
      })),
    };
  }

  async create(tenantId: string, dto: CreateCompanyDto, userId?: string) {
    return this.prisma.company.create({
      data: {
        tenantId,
        name: dto.name,
        legalName: dto.legalName,
        domain: dto.domain,
        industry: dto.industry,
        size: dto.size,
        annualRevenue: dto.annualRevenue ?? 0,
        currency: dto.currency || 'USD',
        taxId: dto.taxId,
        accountTier: dto.accountTier ?? 'SMB',
        ownerId: dto.ownerId || userId,
        tags: dto.tags ?? [],
        billingAddress: dto.billingAddress ?? {},
        shippingAddress: dto.shippingAddress ?? {},
        customFields: dto.customFields ?? {},
        createdBy: userId,
      },
    });
  }

  async update(tenantId: string, id: string, dto: Partial<CreateCompanyDto>, userId?: string) {
    await this.findOne(tenantId, id);

    return this.prisma.company.update({
      where: { id },
      data: {
        ...dto,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    });
  }

  async remove(tenantId: string, id: string, userId?: string) {
    await this.findOne(tenantId, id);

    return this.prisma.company.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: userId,
      },
    });
  }
}
