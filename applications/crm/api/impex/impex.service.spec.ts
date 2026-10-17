// ═══════════════════════════════════════════════════════════
// ImpexService — Data Import, Export & Merge Tests
// ═══════════════════════════════════════════════════════════

import { ImpexService } from './impex.service';

describe('ImpexService', () => {
  let service: ImpexService;
  let mockPrisma: any;

  const mockTenantId = '11111111-1111-1111-1111-111111111111';

  beforeEach(() => {
    mockPrisma = {
      importJob: {
        create: jest.fn().mockResolvedValue({ id: 'job-1', status: 'PROCESSING' }),
        update: jest.fn().mockResolvedValue({ id: 'job-1', status: 'COMPLETED' }),
      },
      lead: {
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({ id: 'lead-imp' }),
        update: jest.fn().mockResolvedValue({ id: 'lead-imp' }),
      },
      contact: {
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({ id: 'contact-imp' }),
        update: jest.fn().mockResolvedValue({ id: 'contact-imp' }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      company: {
        findFirst: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 'comp-1') return Promise.resolve({ id: 'comp-1', name: 'Acme Corp', tenantId: mockTenantId });
          if (where.id === 'comp-2') return Promise.resolve({ id: 'comp-2', name: 'Acme Inc', tenantId: mockTenantId });
          return Promise.resolve(null);
        }),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({ id: 'comp-imp' }),
        update: jest.fn().mockResolvedValue({ id: 'comp-1' }),
      },
      opportunity: {
        updateMany: jest.fn().mockResolvedValue({ count: 2 }),
      },
      activity: {
        updateMany: jest.fn().mockResolvedValue({ count: 3 }),
      },
    };

    service = new ImpexService(mockPrisma);
  });

  it('should parse CSV content and auto-suggest field mappings', async () => {
    const csvContent = `First Name,Last Name,Work Email,Phone Number,Company
John,Doe,john.doe@acme.com,+123456789,Acme Inc`;

    const preview = await service.previewImport({
      entityType: 'lead',
      csvContent,
    });

    expect(preview.totalRowsDetected).toBe(1);
    expect(preview.headers).toContain('First Name');
    expect(preview.suggestedMapping['Work Email']).toBe('email');
    expect(preview.suggestedMapping['First Name']).toBe('firstName');
    expect(preview.suggestedMapping['Company']).toBe('companyName');
  });

  it('should execute import and record completed status in ImportJob', async () => {
    const csvContent = `Title,First Name,Email
CTO,Sarah,sarah@tech.io`;

    const result = await service.executeImport(mockTenantId, 'user-1', {
      entityType: 'lead',
      csvContent,
      fieldMapping: {
        Title: 'title',
        'First Name': 'firstName',
        Email: 'email',
      },
      duplicateStrategy: 'CREATE',
    });

    expect(result.status).toBe('COMPLETED');
    expect(result.successCount).toBe(1);
    expect(result.errorCount).toBe(0);
    expect(mockPrisma.lead.create).toHaveBeenCalled();
  });

  it('should execute side-by-side company merge and re-link all deals and contacts', async () => {
    const mergeResult = await service.mergeRecords(mockTenantId, {
      entityType: 'company',
      primaryId: 'comp-1',
      secondaryId: 'comp-2',
      fieldOverrides: { domain: 'acme.com' },
    });

    expect(mergeResult.success).toBe(true);
    expect(mockPrisma.opportunity.updateMany).toHaveBeenCalledWith({
      where: { companyId: 'comp-2' },
      data: { companyId: 'comp-1' },
    });
    expect(mockPrisma.company.update).toHaveBeenCalledWith({
      where: { id: 'comp-2' },
      data: expect.objectContaining({ deletedAt: expect.any(Date) }),
    });
  });
});
