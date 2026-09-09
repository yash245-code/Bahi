import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, stageId?: string) {
    return this.prisma.opportunity.findMany({
      where: { tenantId, ...(stageId ? { stageId } : {}) },
      include: { contact: true, stage: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.opportunity.findFirst({
      where: { id, tenantId },
      include: { contact: true, stage: true },
    });
  }

  async updateStage(tenantId: string, id: string, stageId: string) {
    return this.prisma.opportunity.updateMany({
      where: { id, tenantId },
      data: { stageId },
    });
  }

  async getPipelineStages(tenantId: string) {
    return this.prisma.pipelineStage.findMany({
      where: { tenantId },
      include: { opportunities: { include: { contact: true } } },
      orderBy: { order: 'asc' },
    });
  }
}
