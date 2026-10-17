import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class QuotationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, status?: string) {
    return this.prisma.quotation.findMany({
      where: { tenantId, ...(status ? { status } : {}) },
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
    const { lines, ...data } = dto;
    return this.prisma.quotation.create({
      data: {
        tenantId,
        ...data,
        lines: lines
          ? {
              create: lines.map((l: any) => ({
                productId: l.productId,
                quantity: l.quantity,
                unitPrice: l.unitPrice,
                total: l.quantity * l.unitPrice,
              })),
            }
          : undefined,
      },
      include: { lines: true },
    });
  }

  async confirm(tenantId: string, id: string) {
    const quotation = await this.prisma.quotation.findFirst({
      where: { id, tenantId },
      include: { lines: true },
    });
    if (!quotation) throw new Error('Quotation not found');

    const [_, order] = await this.prisma.$transaction([
      this.prisma.quotation.update({
        where: { id },
        data: { status: 'CONFIRMED' },
      }),
      this.prisma.salesOrder.create({
        data: {
          tenantId,
          contactId: quotation.contactId,
          quotationId: id,
          subtotal: quotation.subtotal,
          tax: quotation.tax,
          total: quotation.total,
          lines: {
            create: quotation.lines.map((line) => ({
              productId: line.productId,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              total: line.total,
            })),
          },
        },
      }),
    ]);

    return order;
  }
}
