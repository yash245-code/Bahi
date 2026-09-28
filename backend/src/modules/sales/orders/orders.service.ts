import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.salesOrder.findMany({
      where: { tenantId },
      include: { contact: true, lines: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.salesOrder.findFirst({
      where: { id, tenantId },
      include: { contact: true, lines: { include: { product: true } }, invoices: true },
    });
  }

  async updateStatus(tenantId: string, id: string, status: string) {
    return this.prisma.salesOrder.updateMany({
      where: { id, tenantId },
      data: { status: status as any },
    });
  }
}
