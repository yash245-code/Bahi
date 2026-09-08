import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: { invoiceId: string; amount: number; method?: string; reference?: string }) {
    const payment = await this.prisma.payment.create({
      data: { tenantId, ...dto, method: (dto.method as any) || 'BANK_TRANSFER' },
    });

    // Update invoice paid amount and status
    const invoice = await this.prisma.invoice.findUnique({ where: { id: dto.invoiceId } });
    if (invoice) {
      const newPaidAmount = Number(invoice.paidAmount) + dto.amount;
      const newStatus = newPaidAmount >= Number(invoice.total) ? 'PAID' : 'PARTIALLY_PAID';
      await this.prisma.invoice.update({
        where: { id: dto.invoiceId },
        data: {
          paidAmount: newPaidAmount,
          status: newStatus,
          ...(newStatus === 'PAID' ? { paidAt: new Date() } : {}),
        },
      });
    }

    return payment;
  }
}
