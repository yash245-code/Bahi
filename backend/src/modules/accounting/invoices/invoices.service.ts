import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.invoice.findMany({
      where: { tenantId },
      include: { contact: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.invoice.findFirst({
      where: { id, tenantId },
      include: { contact: true, payments: true },
    });
  }

  async create(tenantId: string, dto: any) {
    return this.prisma.invoice.create({ data: { tenantId, ...dto } });
  }

  async send(tenantId: string, id: string) {
    return this.prisma.invoice.updateMany({
      where: { id, tenantId },
      data: { status: 'SENT' },
    });
  }
}
