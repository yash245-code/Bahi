import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(tenantId: string, status?: string) {
    return this.prisma.lead.findMany({
      where: {
        tenantId,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        contact: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.lead.findFirst({
      where: { id, tenantId },
      include: { contact: true },
    });
  }

  async create(tenantId: string, dto: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    score?: number;
    notes?: string;
    assignedTo?: string;
  }) {
    // 1. Create party contact record first
    const contact = await this.prisma.contact.create({
      data: {
        tenantId,
        type: 'LEAD',
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        company: dto.company,
        notes: dto.notes,
      },
    });

    // 2. Create lead record referencing contact
    return this.prisma.lead.create({
      data: {
        tenantId,
        contactId: contact.id,
        source: dto.source || 'Inbound Website',
        score: dto.score ?? 50,
        notes: dto.notes,
        assignedTo: dto.assignedTo,
        status: 'NEW',
      },
      include: {
        contact: true,
      },
    });
  }

  async update(tenantId: string, id: string, dto: any) {
    return this.prisma.lead.updateMany({
      where: { id, tenantId },
      data: dto,
    });
  }

  async convert(tenantId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId },
      include: { contact: true },
    });
    if (!lead) throw new Error('Lead not found');

    const firstStage = await this.prisma.pipelineStage.findFirst({
      where: { tenantId },
      orderBy: { order: 'asc' },
    });

    // Update lead contact to CUSTOMER
    await this.prisma.contact.update({
      where: { id: lead.contactId },
      data: { type: 'CUSTOMER' },
    });

    // Mark lead converted
    await this.prisma.lead.update({
      where: { id },
      data: { status: 'CONVERTED', convertedAt: new Date() },
    });

    // Create opportunity in first stage
    if (firstStage) {
      return this.prisma.opportunity.create({
        data: {
          tenantId,
          contactId: lead.contactId,
          title: `Deal with ${lead.contact.company || lead.contact.name}`,
          value: (lead.score || 50) * 100,
          stageId: firstStage.id,
          probability: 25,
        },
        include: {
          contact: true,
          stage: true,
        },
      });
    }

    return lead;
  }
}
