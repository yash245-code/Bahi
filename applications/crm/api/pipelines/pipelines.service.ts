// ═══════════════════════════════════════════════════════════
// PipelinesService — Multi-Pipeline & Stage Configuration
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';

@Injectable()
export class PipelinesService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(tenantId: string) {
    return this.prisma.pipeline.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        stages: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const pipeline = await this.prisma.pipeline.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        stages: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!pipeline) {
      throw new NotFoundException(`Pipeline #${id} not found`);
    }

    return pipeline;
  }

  async create(tenantId: string, dto: { name: string; isDefault?: boolean; stages?: Array<{ name: string; color: string; defaultProbability: number; rottingDays?: number; stageType?: any }> }) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.pipeline.updateMany({
          where: { tenantId },
          data: { isDefault: false },
        });
      }

      const pipeline = await tx.pipeline.create({
        data: {
          tenantId,
          name: dto.name,
          isDefault: dto.isDefault ?? false,
        },
      });

      if (dto.stages && dto.stages.length > 0) {
        let order = 1;
        for (const s of dto.stages) {
          await tx.pipelineStage.create({
            data: {
              tenantId,
              pipelineId: pipeline.id,
              name: s.name,
              color: s.color || '#A8462F',
              defaultProbability: s.defaultProbability ?? 20,
              rottingDays: s.rottingDays ?? 14,
              stageType: s.stageType ?? 'OPEN',
              order: order++,
            },
          });
        }
      }

      return tx.pipeline.findUnique({
        where: { id: pipeline.id },
        include: { stages: { orderBy: { order: 'asc' } } },
      });
    });
  }

  async updateStage(
    tenantId: string,
    stageId: string,
    dto: {
      name?: string;
      color?: string;
      defaultProbability?: number;
      rottingDays?: number;
      requiredFields?: string[];
      order?: number;
    },
  ) {
    const stage = await this.prisma.pipelineStage.findFirst({
      where: { id: stageId, tenantId },
    });
    if (!stage) {
      throw new NotFoundException('Stage not found');
    }

    return this.prisma.pipelineStage.update({
      where: { id: stageId },
      data: dto,
    });
  }
}
