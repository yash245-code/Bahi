import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, status?: string) {
    return this.prisma.lead.findMany({
      where: { tenantId, ...(status ? { status: status as any } : {}) },
      include: { contact: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.lead.findFirst({
      where: { id, tenantId },
      include: { contact: true },
    });
  }

  async create(tenantId: string, dto: any) {
    return this.prisma.lead.create({ data: { tenantId, ...dto } });
  }

  async update(tenantId: string, id: string, dto: any) {
    return this.prisma.lead.updateMany({ where: { id, tenantId }, data: dto });
  }

  async convert(tenantId: string, id: string) {
    // Mark lead as converted and create an opportunity
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId },
      include: { contact: true },
    });
    if (!lead) throw new Error('Lead not found');

    const firstStage = await this.prisma.pipelineStage.findFirst({
      where: { tenantId },
      orderBy: { order: 'asc' },
    });

    const [_, opportunity] = await this.prisma.$transaction([
      this.prisma.lead.update({
        where: { id },
        data: { status: 'CONVERTED', convertedAt: new Date() },
      }),
      this.prisma.opportunity.create({
        data: {
          tenantId,
          contactId: lead.contactId,
          title: `Opportunity from ${lead.contact.name}`,
          value: 0,
          stageId: firstStage!.id,
        },
      }),
    ]);

    return opportunity;
  }
}
