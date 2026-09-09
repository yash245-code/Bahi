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
      include: { contact: true, payments: true, salesOrder: true },
    });
  }

  async create(tenantId: string, dto: any) {
    const count = await this.prisma.invoice.count({ where: { tenantId } });
    const number = `INV-${String(count + 1).padStart(5, '0')}`;
    return this.prisma.invoice.create({ data: { tenantId, number, ...dto } });
  }

  async send(tenantId: string, id: string) {
    // In a full implementation, this generates a PDF and sends an email
    return this.prisma.invoice.updateMany({
      where: { id, tenantId },
      data: { status: 'SENT', sentAt: new Date() },
    });
  }
}
