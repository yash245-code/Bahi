import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly prisma: PrismaClient) {}

  async getPipelineStages(tenantId: string) {
    return this.prisma.pipelineStage.findMany({
      where: { tenantId },
      include: {
        opportunities: {
          include: { contact: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findAll(tenantId: string, stageId?: string) {
    return this.prisma.opportunity.findMany({
      where: {
        tenantId,
        ...(stageId ? { stageId } : {}),
      },
      include: {
        contact: true,
        stage: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.opportunity.findFirst({
      where: { id, tenantId },
      include: {
        contact: true,
        stage: true,
      },
    });
  }

  async create(tenantId: string, dto: {
    title: string;
    value: number;
    stageId: string;
    contactId?: string;
    contactName?: string;
    company?: string;
    probability?: number;
    expectedClose?: string;
    priority?: string;
  }) {
    let contactId = dto.contactId;

    if (!contactId && dto.contactName) {
      const contact = await this.prisma.contact.create({
        data: {
          tenantId,
          type: 'CUSTOMER',
          name: dto.contactName,
          company: dto.company,
        },
      });
      contactId = contact.id;
    }

    if (!contactId) {
      const defaultContact = await this.prisma.contact.findFirst({
        where: { tenantId },
      });
      if (defaultContact) {
        contactId = defaultContact.id;
      } else {
        const c = await this.prisma.contact.create({
          data: {
            tenantId,
            type: 'CUSTOMER',
            name: dto.company || 'Enterprise Client',
            company: dto.company,
          },
        });
        contactId = c.id;
      }
    }

    return this.prisma.opportunity.create({
      data: {
        tenantId,
        contactId,
        title: dto.title,
        value: Number(dto.value) || 0,
        stageId: dto.stageId,
        probability: dto.probability ?? 25,
        expectedClose: dto.expectedClose ? new Date(dto.expectedClose) : undefined,
      },
      include: {
        contact: true,
        stage: true,
      },
    });
  }

  async updateStage(tenantId: string, id: string, stageId: string) {
    return this.prisma.opportunity.updateMany({
      where: { id, tenantId },
      data: { stageId },
    });
  }

  async update(tenantId: string, id: string, dto: any) {
    return this.prisma.opportunity.updateMany({
      where: { id, tenantId },
      data: dto,
    });
  }
}
