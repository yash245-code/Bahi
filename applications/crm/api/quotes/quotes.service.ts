// ═══════════════════════════════════════════════════════════
// QuotesService — Quotation Engine & Customer Portal Handoff
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';
import { CrmEventBus } from '../common/events';

export interface CreateQuoteDto {
  dealId?: string;
  companyId?: string;
  contactId?: string;
  validUntil?: string;
  currency?: string;
  terms?: string;
  notes?: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    discountPercent?: number;
    taxRatePercent?: number;
  }>;
}

export interface AcceptQuoteDto {
  signerName: string;
  signerEmail?: string;
  signatureData: string; // Base64 signature image or typed legal name
}

@Injectable()
export class QuotesService {
  private readonly logger = new Logger(QuotesService.name);

  constructor(
    private readonly prisma: PrismaClient,
    private readonly eventBus: CrmEventBus,
  ) {}

  async findAll(tenantId: string) {
    return this.prisma.quote.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        deal: { select: { id: true, title: true, value: true } },
        company: { select: { id: true, name: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        deal: true,
        company: true,
        contact: true,
      },
    });
    if (!quote) throw new NotFoundException(`Quote ${id} not found`);
    return quote;
  }

  async create(tenantId: string, dto: CreateQuoteDto, userId?: string) {
    // Generate sequential quote number
    const count = await this.prisma.quote.count({ where: { tenantId } });
    const year = new Date().getFullYear();
    const quoteNumber = `QUO-${year}-${String(count + 1).padStart(4, '0')}`;

    // Compute totals
    let subtotal = 0;
    let taxTotal = 0;

    const formattedLines = dto.lineItems.map((item) => {
      const gross = item.quantity * item.unitPrice;
      const discount = gross * ((item.discountPercent || 0) / 100);
      const net = gross - discount;
      const tax = net * ((item.taxRatePercent || 0) / 100);
      const total = net + tax;

      subtotal += net;
      taxTotal += tax;

      return {
        ...item,
        gross,
        discount,
        net,
        tax,
        total,
      };
    });

    const grandTotal = subtotal + taxTotal;

    const quote = await this.prisma.quote.create({
      data: {
        tenantId,
        quoteNumber,
        dealId: dto.dealId || null,
        companyId: dto.companyId || null,
        contactId: dto.contactId || null,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
        subtotal,
        taxTotal,
        grandTotal,
        currency: dto.currency || 'USD',
        terms: dto.terms || 'Standard payment terms: 30 days from date of issue.',
        notes: dto.notes || null,
        lineItems: formattedLines as any,
        createdBy: userId || null,
      },
      include: {
        deal: true,
        company: true,
        contact: true,
      },
    });

    this.logger.log(`Created Quote ${quote.quoteNumber} for amount ${grandTotal}`);
    return quote;
  }

  async createFromDeal(tenantId: string, dealId: string, userId?: string) {
    const deal = await this.prisma.opportunity.findFirst({
      where: { id: dealId, tenantId, deletedAt: null },
      include: {
        lineItems: { include: { product: true } },
        company: true,
        contact: true,
      },
    });

    if (!deal) throw new NotFoundException(`Deal ${dealId} not found`);

    const lineItems = deal.lineItems.map((li) => ({
      description: li.product?.name || li.name,
      quantity: Number(li.quantity),
      unitPrice: Number(li.unitPrice),
      discountPercent: Number(li.discountPercent),
      taxRatePercent: Number(li.taxPercent),
    }));

    // Fallback if deal has no line items
    if (lineItems.length === 0) {
      lineItems.push({
        description: deal.title,
        quantity: 1,
        unitPrice: Number(deal.value),
        discountPercent: 0,
        taxRatePercent: 0,
      });
    }

    return this.create(
      tenantId,
      {
        dealId: deal.id,
        companyId: deal.companyId || undefined,
        contactId: deal.contactId || undefined,
        currency: deal.currency,
        lineItems,
      },
      userId,
    );
  }

  // ─── Customer Portal Public Access & E-Signature ─────────────

  async getPublicQuote(quoteId: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id: quoteId, deletedAt: null },
      include: {
        tenant: { select: { id: true, name: true, logoUrl: true, currency: true } },
        company: { select: { id: true, name: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!quote) throw new NotFoundException(`Quotation not found`);

    return quote;
  }

  async acceptQuoteOnline(quoteId: string, dto: AcceptQuoteDto) {
    const quote = await this.prisma.quote.findFirst({
      where: { id: quoteId, deletedAt: null },
    });

    if (!quote) throw new NotFoundException(`Quotation not found`);
    if (quote.status === 'ACCEPTED') {
      throw new BadRequestException('Quotation has already been accepted');
    }

    const updated = await this.prisma.quote.update({
      where: { id: quoteId },
      data: {
        status: 'ACCEPTED',
        signedAt: new Date(),
        signatureData: dto.signatureData,
        notes: quote.notes ? `${quote.notes}\nSigned online by ${dto.signerName}` : `Signed online by ${dto.signerName}`,
      },
    });

    // Publish domain event for cross-module integration (Sales, Invoicing)
    this.eventBus.publish('quote.accepted', {
      tenantId: quote.tenantId,
      quoteId: quote.id,
      quoteNumber: quote.quoteNumber,
      dealId: quote.dealId,
      grandTotal: quote.grandTotal,
      currency: quote.currency,
      signerName: dto.signerName,
    });

    return {
      success: true,
      message: 'Quotation accepted and digitally signed successfully',
      quoteNumber: updated.quoteNumber,
      status: updated.status,
      signedAt: updated.signedAt,
    };
  }
}
