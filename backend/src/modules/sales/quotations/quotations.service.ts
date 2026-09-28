import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class QuotationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.quotation.findMany({
      where: { tenantId },
      include: { contact: true, lines: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.quotation.findFirst({
      where: { id, tenantId },
      include: { contact: true, lines: { include: { product: true } } },
    });
  }

  async create(tenantId: string, dto: any) {
    const count = await this.prisma.quotation.count({ where: { tenantId } });
    const number = `QT-${String(count + 1).padStart(5, '0')}`;
    return this.prisma.quotation.create({
      data: { tenantId, number, ...dto },
    });
  }

  async confirm(tenantId: string, id: string) {
    // Convert quotation → sales order in a transaction
    const quotation = await this.prisma.quotation.findFirst({
      where: { id, tenantId },
      include: { lines: true },
    });
    if (!quotation) throw new Error('Quotation not found');

    const orderCount = await this.prisma.salesOrder.count({ where: { tenantId } });
    const orderNumber = `SO-${String(orderCount + 1).padStart(5, '0')}`;

    const [_, order] = await this.prisma.$transaction([
      this.prisma.quotation.update({
        where: { id },
        data: { status: 'CONFIRMED', confirmedAt: new Date() },
      }),
      this.prisma.salesOrder.create({
        data: {
          tenantId,
          contactId: quotation.contactId,
          quotationId: id,
          number: orderNumber,
          subtotal: quotation.subtotal,
          taxAmount: quotation.taxAmount,
          total: quotation.total,
          currency: quotation.currency,
          lines: {
            create: quotation.lines.map((line) => ({
              productId: line.productId,
              description: line.description,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              taxRate: line.taxRate,
              subtotal: line.subtotal,
            })),
          },
        },
      }),
    ]);

    return order;
  }
}
