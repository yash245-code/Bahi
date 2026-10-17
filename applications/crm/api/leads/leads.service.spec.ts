// ═══════════════════════════════════════════════════════════
// LeadsService — Unit & Multi-Tenant Isolation Tests
// ═══════════════════════════════════════════════════════════

import { LeadsService } from './leads.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let mockPrisma: any;

  const mockTenantId = '11111111-1111-1111-1111-111111111111';
  const otherTenantId = '22222222-2222-2222-2222-222222222222';

  beforeEach(() => {
    mockPrisma = {
      lead: {
        findMany: jest.fn().mockImplementation(({ where }) => {
          if (where.tenantId !== mockTenantId) return Promise.resolve([]);
          return Promise.resolve([
            { id: 'lead-1', tenantId: mockTenantId, title: 'Inbound Inquiry', status: 'NEW' },
          ]);
        }),
        findFirst: jest.fn().mockImplementation(({ where }) => {
          if (where.tenantId !== mockTenantId) return Promise.resolve(null);
          return Promise.resolve({
            id: where.id,
            tenantId: mockTenantId,
            title: 'TechCorp Lead',
            companyName: 'TechCorp',
            status: 'NEW',
          });
        }),
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ id: 'lead-new', ...data }),
        ),
        update: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ id: 'lead-1', ...data }),
        ),
      },
      contact: {
        create: jest.fn().mockResolvedValue({ id: 'contact-1', tenantId: mockTenantId }),
        update: jest.fn().mockResolvedValue({ id: 'contact-1' }),
      },
      company: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'company-1', name: 'TechCorp' }),
      },
      pipeline: {
        findFirst: jest.fn().mockResolvedValue({ id: 'pipe-1' }),
      },
      pipelineStage: {
        findFirst: jest.fn().mockResolvedValue({ id: 'stage-1', defaultProbability: 20 }),
      },
      opportunity: {
        create: jest.fn().mockResolvedValue({ id: 'deal-1', title: 'TechCorp — New Deal' }),
      },
      $transaction: jest.fn().mockImplementation(async (callback) => {
        return callback(mockPrisma);
      }),
    };

    service = new LeadsService(mockPrisma);
  });

  it('should only return leads strictly matching the authenticated tenant ID', async () => {
    const leads = await service.findAll(mockTenantId);
    expect(leads).toHaveLength(1);
    expect(leads[0].tenantId).toBe(mockTenantId);

    // Cross-tenant attempt should return empty
    const crossTenantLeads = await service.findAll(otherTenantId);
    expect(crossTenantLeads).toHaveLength(0);
  });

  it('should create lead with contact reference and default NEW status', async () => {
    const lead = await service.create(mockTenantId, {
      title: 'Global Manufacturing Lead',
      firstName: 'David',
      lastName: 'Miller',
      email: 'd.miller@mfg.com',
      companyName: 'Miller MFG',
      source: 'Google Ads',
    });

    expect(lead.id).toBe('lead-new');
    expect(mockPrisma.contact.create).toHaveBeenCalled();
    expect(mockPrisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: mockTenantId,
          status: 'NEW',
        }),
      }),
    );
  });

  it('should successfully execute 1-click conversion to Deal + Contact + Company', async () => {
    const result = await service.convert(mockTenantId, 'lead-1', {
      dealTitle: 'TechCorp Enterprise Deal',
      dealValue: 25000,
    });

    expect(result.lead.status).toBe('CONVERTED');
    expect(result.deal).toBeDefined();
    expect(mockPrisma.opportunity.create).toHaveBeenCalled();
    expect(mockPrisma.company.create).toHaveBeenCalled();
  });
});
