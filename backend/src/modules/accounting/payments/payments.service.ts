import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: { invoiceId: string; amount: number }) {
    const payment = await this.prisma.payment.create({
      data: { tenantId, invoiceId: dto.invoiceId, amount: dto.amount },
    });

    const invoice = await this.prisma.invoice.findUnique({ where: { id: dto.invoiceId } });
    if (invoice) {
      await this.prisma.invoice.update({
        where: { id: dto.invoiceId },
        data: {
          status: 'PAID',
        },
      });
    }

    return payment;
  }
}
