// ═══════════════════════════════════════════════════════════
// ImpexService — Data Import, Export & Duplicate Management
// ═══════════════════════════════════════════════════════════

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';

export interface ImportPreviewDto {
  entityType: 'lead' | 'contact' | 'company';
  csvContent: string;
}

export interface ExecuteImportDto {
  entityType: 'lead' | 'contact' | 'company';
  csvContent: string;
  fieldMapping: Record<string, string>; // { csvHeader: crmField }
  duplicateStrategy: 'SKIP' | 'UPDATE' | 'CREATE';
}

export interface MergeRecordsDto {
  entityType: 'contact' | 'company';
  primaryId: string;
  secondaryId: string;
  fieldOverrides?: Record<string, any>;
}

@Injectable()
export class ImpexService {
  constructor(private readonly prisma: PrismaClient) {}

  // ─── Import Preview & Header Parsing ─────────────────────────

  parseCsv(content: string): { headers: string[]; rows: Record<string, string>[] } {
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) {
      throw new BadRequestException('CSV file content is empty');
    }

    const headerLine = lines[0] || '';
    const headers = headerLine.split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i] || '';
      const values = line.split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }

    return { headers, rows };
  }

  async previewImport(dto: ImportPreviewDto) {
    const { headers, rows } = this.parseCsv(dto.csvContent);

    // Auto-detect mappings based on header heuristics
    const suggestedMapping: Record<string, string> = {};
    const crmFields = dto.entityType === 'lead'
      ? ['title', 'firstName', 'lastName', 'email', 'phone', 'companyName', 'source', 'status']
      : dto.entityType === 'contact'
      ? ['firstName', 'lastName', 'email', 'phone', 'jobTitle', 'department']
      : ['name', 'domain', 'industry', 'size', 'annualRevenue'];

    headers.forEach((h) => {
      const lower = h.toLowerCase().replace(/[^a-z]/g, '');
      const match = crmFields.find((f) => f.toLowerCase().includes(lower) || lower.includes(f.toLowerCase()));
      if (match) suggestedMapping[h] = match;
    });

    return {
      totalRowsDetected: rows.length,
      headers,
      suggestedMapping,
      sampleRows: rows.slice(0, 5),
    };
  }

  // ─── Execute Import with Duplicate Handling ──────────────────

  async executeImport(tenantId: string, userId: string, dto: ExecuteImportDto) {
    const { rows } = this.parseCsv(dto.csvContent);
    const job = await this.prisma.importJob.create({
      data: {
        tenantId,
        entityType: dto.entityType,
        fileName: `import_${dto.entityType}_${Date.now()}.csv`,
        status: 'PROCESSING',
        totalRows: rows.length,
        fieldMapping: dto.fieldMapping as any,
        createdBy: userId,
      },
    });

    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ rowNumber: number; reason: string }> = [];

    for (let i = 0; i < rows.length; i++) {
      const rawRow = rows[i];
      if (!rawRow) continue;

      const mappedRecord: Record<string, any> = {};

      for (const [csvHeader, crmField] of Object.entries(dto.fieldMapping)) {
        if (crmField && rawRow[csvHeader] !== undefined) {
          mappedRecord[crmField] = rawRow[csvHeader];
        }
      }

      try {
        if (dto.entityType === 'lead') {
          await this.importLeadRow(tenantId, userId, mappedRecord, dto.duplicateStrategy);
        } else if (dto.entityType === 'contact') {
          await this.importContactRow(tenantId, mappedRecord, dto.duplicateStrategy);
        } else if (dto.entityType === 'company') {
          await this.importCompanyRow(tenantId, mappedRecord, dto.duplicateStrategy);
        }
        successCount++;
      } catch (err: any) {
        errorCount++;
        errors.push({ rowNumber: i + 2, reason: err.message || 'Validation or DB error' });
      }
    }

    const completedJob = await this.prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: errorCount === rows.length ? 'FAILED' : 'COMPLETED',
        successRows: successCount,
        errorRows: errorCount,
        errorReportUrl: errors.length > 0 ? JSON.stringify(errors.slice(0, 50)) : null,
        completedAt: new Date(),
      },
    });

    return {
      jobId: completedJob.id,
      status: completedJob.status,
      totalRows: rows.length,
      successCount,
      errorCount,
      errors: errors.slice(0, 10),
    };
  }

  private async importLeadRow(
    tenantId: string,
    userId: string,
    data: Record<string, any>,
    strategy: 'SKIP' | 'UPDATE' | 'CREATE',
  ) {
    if (!data.title && !data.email && !data.firstName) {
      throw new Error('Lead requires at least a title, first name, or email');
    }

    const title = data.title || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Imported Lead';
    let contactId: string | undefined;

    // Duplicate check on Contact if email or phone is present
    if (data.email && strategy !== 'CREATE') {
      const existingLeads = await this.prisma.lead.findMany({
        where: { tenantId, deletedAt: null },
        include: { contact: true },
      });

      const matched = existingLeads.find((l) => {
        const emails = (l.contact?.emails as any[]) || [];
        return emails.some((e: any) => e.email?.toLowerCase() === data.email.toLowerCase());
      });

      if (matched) {
        if (strategy === 'SKIP') return;
        if (strategy === 'UPDATE') {
          await this.prisma.lead.update({
            where: { id: matched.id },
            data: {
              title,
              companyName: data.companyName || matched.companyName,
            },
          });
          return;
        }
      }
    }

    // Create linked Contact if contact data present
    if (data.firstName || data.lastName || data.email || data.phone) {
      const contact = await this.prisma.contact.create({
        data: {
          tenantId,
          firstName: data.firstName || 'Imported',
          lastName: data.lastName || 'Lead',
          emails: data.email ? [{ email: data.email, isPrimary: true, label: 'Work' }] : [],
          phones: data.phone ? [{ phone: data.phone, type: 'Mobile', isWhatsApp: true, isPrimary: true }] : [],
          source: data.source || 'CSV_IMPORT',
          lifecycleStage: 'LEAD',
          createdBy: userId,
        },
      });
      contactId = contact.id;
    }

    await this.prisma.lead.create({
      data: {
        tenantId,
        title,
        companyName: data.companyName || null,
        contactId: contactId || null,
        source: data.source || 'CSV_IMPORT',
        status: data.status || 'NEW',
        createdBy: userId,
      },
    });
  }

  private async importContactRow(
    tenantId: string,
    data: Record<string, any>,
    strategy: 'SKIP' | 'UPDATE' | 'CREATE',
  ) {
    if (!data.firstName && !data.email) {
      throw new Error('Contact requires first name or email');
    }

    if (data.email && strategy !== 'CREATE') {
      const allContacts = await this.prisma.contact.findMany({
        where: { tenantId, deletedAt: null },
      });

      const existing = allContacts.find((c) => {
        const emails = (c.emails as any[]) || [];
        return emails.some((e: any) => e.email?.toLowerCase() === data.email.toLowerCase());
      });

      if (existing) {
        if (strategy === 'SKIP') return;
        if (strategy === 'UPDATE') {
          await this.prisma.contact.update({
            where: { id: existing.id },
            data: {
              firstName: data.firstName || existing.firstName,
              lastName: data.lastName || existing.lastName,
              jobTitle: data.jobTitle || existing.jobTitle,
            },
          });
          return;
        }
      }
    }

    await this.prisma.contact.create({
      data: {
        tenantId,
        firstName: data.firstName || 'Imported',
        lastName: data.lastName || '',
        jobTitle: data.jobTitle || null,
        emails: data.email ? [{ email: data.email, isPrimary: true }] : [],
        phones: data.phone ? [{ phone: data.phone, type: 'work', isWhatsApp: true }] : [],
      },
    });
  }

  private async importCompanyRow(
    tenantId: string,
    data: Record<string, any>,
    strategy: 'SKIP' | 'UPDATE' | 'CREATE',
  ) {
    if (!data.name) throw new Error('Company requires name');

    if (data.name && strategy !== 'CREATE') {
      const existing = await this.prisma.company.findFirst({
        where: { tenantId, name: { equals: data.name, mode: 'insensitive' }, deletedAt: null },
      });

      if (existing) {
        if (strategy === 'SKIP') return;
        if (strategy === 'UPDATE') {
          await this.prisma.company.update({
            where: { id: existing.id },
            data: {
              domain: data.domain || existing.domain,
              industry: data.industry || existing.industry,
              size: data.size || existing.size,
            },
          });
          return;
        }
      }
    }

    await this.prisma.company.create({
      data: {
        tenantId,
        name: data.name,
        domain: data.domain || null,
        industry: data.industry || null,
        size: data.size || null,
      },
    });
  }

  // ─── Export Engine ───────────────────────────────────────────

  async exportData(tenantId: string, entityType: string, columns?: string[]) {
    let records: any[] = [];

    switch (entityType) {
      case 'leads': {
        const rawLeads = await this.prisma.lead.findMany({
          where: { tenantId, deletedAt: null },
          include: { contact: true },
        });

        records = rawLeads.map((l) => ({
          id: l.id,
          title: l.title,
          firstName: l.contact?.firstName || '',
          lastName: l.contact?.lastName || '',
          email: Array.isArray(l.contact?.emails) ? (l.contact.emails[0] as any)?.email || '' : '',
          phone: Array.isArray(l.contact?.phones) ? (l.contact.phones[0] as any)?.phone || '' : '',
          companyName: l.companyName || '',
          status: l.status,
          rating: l.rating,
          score: l.score,
          createdAt: l.createdAt,
        }));
        break;
      }

      case 'contacts':
        records = await this.prisma.contact.findMany({
          where: { tenantId, deletedAt: null },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            jobTitle: true,
            emails: true,
            phones: true,
            lifecycleStage: true,
            createdAt: true,
          },
        });
        break;

      case 'companies':
        records = await this.prisma.company.findMany({
          where: { tenantId, deletedAt: null },
          select: {
            id: true,
            name: true,
            domain: true,
            industry: true,
            size: true,
            annualRevenue: true,
            accountTier: true,
            createdAt: true,
          },
        });
        break;

      case 'deals':
      case 'opportunities': {
        const rawDeals = await this.prisma.opportunity.findMany({
          where: { tenantId, deletedAt: null },
          include: { stage: true },
        });

        records = rawDeals.map((d) => ({
          id: d.id,
          title: d.title,
          value: d.value,
          currency: d.currency,
          probability: d.probability,
          expectedCloseDate: d.expectedCloseDate,
          forecastCategory: d.forecastCategory,
          stage: d.stage?.name || '',
          isWon: d.stage?.stageType === 'WON',
          createdAt: d.createdAt,
        }));
        break;
      }

      default:
        throw new BadRequestException(`Unsupported export entity: ${entityType}`);
    }

    if (records.length === 0) {
      return { csv: '', totalRows: 0 };
    }

    // Generate CSV string
    const keys = columns && columns.length > 0 ? columns : Object.keys(records[0] || {});
    const headerRow = keys.join(',');
    const dataRows = records.map((rec) => {
      return keys
        .map((k) => {
          let val = rec[k];
          if (val instanceof Date) val = val.toISOString();
          if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
          val = String(val ?? '').replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(',');
    });

    return {
      csv: [headerRow, ...dataRows].join('\n'),
      totalRows: records.length,
    };
  }

  // ─── Duplicate Scanning & Side-by-side Merge ─────────────────

  async scanDuplicates(tenantId: string, entityType: 'contact' | 'company') {
    if (entityType === 'contact') {
      const contacts = await this.prisma.contact.findMany({
        where: { tenantId, deletedAt: null },
        select: { id: true, firstName: true, lastName: true, emails: true, phones: true },
      });

      const duplicates: Array<{ record1: any; record2: any; matchReason: string }> = [];

      for (let i = 0; i < contacts.length; i++) {
        for (let j = i + 1; j < contacts.length; j++) {
          const c1 = contacts[i];
          const c2 = contacts[j];
          if (!c1 || !c2) continue;

          const nameMatch =
            c1.firstName.toLowerCase() === c2.firstName.toLowerCase() &&
            c1.lastName.toLowerCase() === c2.lastName.toLowerCase() &&
            c1.firstName.length > 2;

          if (nameMatch) {
            duplicates.push({ record1: c1, record2: c2, matchReason: 'Matching first and last name' });
          }
        }
      }
      return duplicates;
    } else {
      const companies = await this.prisma.company.findMany({
        where: { tenantId, deletedAt: null },
        select: { id: true, name: true, domain: true },
      });

      const duplicates: Array<{ record1: any; record2: any; matchReason: string }> = [];

      for (let i = 0; i < companies.length; i++) {
        for (let j = i + 1; j < companies.length; j++) {
          const c1 = companies[i];
          const c2 = companies[j];
          if (!c1 || !c2) continue;

          const domainMatch = c1.domain && c2.domain && c1.domain.toLowerCase() === c2.domain.toLowerCase();
          const nameMatch = c1.name.toLowerCase() === c2.name.toLowerCase();

          if (domainMatch || nameMatch) {
            duplicates.push({
              record1: c1,
              record2: c2,
              matchReason: domainMatch ? 'Matching domain' : 'Identical company name',
            });
          }
        }
      }
      return duplicates;
    }
  }

  async mergeRecords(tenantId: string, dto: MergeRecordsDto) {
    if (dto.entityType === 'company') {
      const primary = await this.prisma.company.findFirst({
        where: { id: dto.primaryId, tenantId, deletedAt: null },
      });
      const secondary = await this.prisma.company.findFirst({
        where: { id: dto.secondaryId, tenantId, deletedAt: null },
      });

      if (!primary || !secondary) {
        throw new NotFoundException('Both primary and secondary companies must exist');
      }

      await this.prisma.opportunity.updateMany({
        where: { companyId: secondary.id },
        data: { companyId: primary.id },
      });

      await this.prisma.contact.updateMany({
        where: { companyId: secondary.id },
        data: { companyId: primary.id },
      });

      await this.prisma.activity.updateMany({
        where: { relatedType: 'company', relatedId: secondary.id },
        data: { relatedId: primary.id },
      });

      if (dto.fieldOverrides) {
        await this.prisma.company.update({
          where: { id: primary.id },
          data: dto.fieldOverrides,
        });
      }

      await this.prisma.company.update({
        where: { id: secondary.id },
        data: { deletedAt: new Date() },
      });

      return {
        success: true,
        primaryId: primary.id,
        mergedSecondaryId: secondary.id,
        message: 'Companies successfully merged and related records re-linked',
      };
    } else {
      const primary = await this.prisma.contact.findFirst({
        where: { id: dto.primaryId, tenantId, deletedAt: null },
      });
      const secondary = await this.prisma.contact.findFirst({
        where: { id: dto.secondaryId, tenantId, deletedAt: null },
      });

      if (!primary || !secondary) {
        throw new NotFoundException('Both primary and secondary contacts must exist');
      }

      await this.prisma.opportunity.updateMany({
        where: { contactId: secondary.id },
        data: { contactId: primary.id },
      });

      await this.prisma.activity.updateMany({
        where: { relatedType: 'contact', relatedId: secondary.id },
        data: { relatedId: primary.id },
      });

      if (dto.fieldOverrides) {
        await this.prisma.contact.update({
          where: { id: primary.id },
          data: dto.fieldOverrides,
        });
      }

      await this.prisma.contact.update({
        where: { id: secondary.id },
        data: { deletedAt: new Date() },
      });

      return {
        success: true,
        primaryId: primary.id,
        mergedSecondaryId: secondary.id,
        message: 'Contacts successfully merged and related records re-linked',
      };
    }
  }
}
