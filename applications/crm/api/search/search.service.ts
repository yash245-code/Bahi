// ═══════════════════════════════════════════════════════════
// SearchService — Unified Omnibar Global Search Engine
// ═══════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';

export interface SearchResultItem {
  id: string;
  type: 'lead' | 'contact' | 'company' | 'deal' | 'activity';
  title: string;
  subtitle: string;
  status?: string;
  badge?: string;
  url: string;
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaClient) {}

  async globalSearch(tenantId: string, query: string, limit = 5): Promise<SearchResultItem[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const q = query.trim();
    const results: SearchResultItem[] = [];

    // Parallel multi-entity querying
    const [leads, contacts, companies, deals, activities] = await Promise.all([
      this.prisma.lead.findMany({
        where: {
          tenantId,
          deletedAt: null,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { companyName: { contains: q, mode: 'insensitive' } },
            { source: { contains: q, mode: 'insensitive' } },
            { contact: { firstName: { contains: q, mode: 'insensitive' } } },
            { contact: { lastName: { contains: q, mode: 'insensitive' } } },
          ],
        },
        take: limit,
        select: { id: true, title: true, companyName: true, status: true, score: true },
      }),

      this.prisma.contact.findMany({
        where: {
          tenantId,
          deletedAt: null,
          OR: [
            { firstName: { contains: q, mode: 'insensitive' } },
            { lastName: { contains: q, mode: 'insensitive' } },
            { jobTitle: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: { company: { select: { name: true } } },
      }),

      this.prisma.company.findMany({
        where: {
          tenantId,
          deletedAt: null,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { domain: { contains: q, mode: 'insensitive' } },
            { industry: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: { id: true, name: true, domain: true, industry: true, accountTier: true },
      }),

      this.prisma.opportunity.findMany({
        where: {
          tenantId,
          deletedAt: null,
          title: { contains: q, mode: 'insensitive' },
        },
        take: limit,
        include: { stage: { select: { name: true } } },
      }),

      this.prisma.activity.findMany({
        where: {
          tenantId,
          deletedAt: null,
          subject: { contains: q, mode: 'insensitive' },
        },
        take: limit,
        select: { id: true, subject: true, type: true, status: true, dueDateTime: true },
      }),
    ]);

    // Map Leads
    leads.forEach((l) => {
      results.push({
        id: l.id,
        type: 'lead',
        title: l.title,
        subtitle: l.companyName ? `Company: ${l.companyName}` : 'Inbound Lead',
        status: l.status,
        badge: l.score ? `${l.score} pts` : undefined,
        url: `/crm/leads?id=${l.id}`,
      });
    });

    // Map Contacts
    contacts.forEach((c) => {
      results.push({
        id: c.id,
        type: 'contact',
        title: `${c.firstName} ${c.lastName}`.trim(),
        subtitle: c.jobTitle ? `${c.jobTitle}${c.company ? ` at ${c.company.name}` : ''}` : c.company?.name || 'Contact',
        url: `/crm/contacts?id=${c.id}`,
      });
    });

    // Map Companies
    companies.forEach((co) => {
      results.push({
        id: co.id,
        type: 'company',
        title: co.name,
        subtitle: co.industry ? `${co.industry} • ${co.domain || ''}` : co.domain || 'Account',
        badge: co.accountTier || undefined,
        url: `/crm/companies?id=${co.id}`,
      });
    });

    // Map Deals
    deals.forEach((d) => {
      results.push({
        id: d.id,
        type: 'deal',
        title: d.title,
        subtitle: `Value: $${Number(d.value).toLocaleString()} • Stage: ${d.stage.name}`,
        url: `/crm?dealId=${d.id}`,
      });
    });

    // Map Activities
    activities.forEach((a) => {
      results.push({
        id: a.id,
        type: 'activity',
        title: a.subject,
        subtitle: `Task: ${a.type} • Status: ${a.status}`,
        url: `/crm/activities?id=${a.id}`,
      });
    });

    return results;
  }
}
