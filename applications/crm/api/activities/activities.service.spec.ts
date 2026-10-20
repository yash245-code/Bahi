// ═══════════════════════════════════════════════════════════
// ActivitiesService — Unit Tests & Queue Filtering
// ═══════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ActivitiesService } from './activities.service';

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  let mockPrisma: any;

  const mockTenantId = '11111111-1111-1111-1111-111111111111';

  beforeEach(() => {
    mockPrisma = {
      activity: {
        findMany: (jest.fn() as any).mockResolvedValue([
          {
            id: 'act-1',
            tenantId: mockTenantId,
            type: 'CALL',
            subject: 'Discovery Call with CTO',
            status: 'PENDING',
            priority: 'HIGH',
            dueDateTime: new Date(),
            relatedType: 'deal',
            relatedId: '22222222-2222-2222-2222-222222222222',
            assignee: {
              id: 'user-1',
              firstName: 'Alex',
              lastName: 'Morgan',
              email: 'alex@bahi.app',
              avatarUrl: null,
            },
          },
        ]),
        findFirst: (jest.fn() as any).mockImplementation(({ where }: { where: any }) => {
          if (where.tenantId !== mockTenantId) return Promise.resolve(null);
          return Promise.resolve({
            id: where.id,
            tenantId: mockTenantId,
            type: 'CALL',
            subject: 'Discovery Call with CTO',
            status: 'PENDING',
            relatedType: 'deal',
            relatedId: '22222222-2222-2222-2222-222222222222',
            assignee: {
              id: 'user-1',
              firstName: 'Alex',
              lastName: 'Morgan',
              email: 'alex@bahi.app',
              avatarUrl: null,
            },
          });
        }),
        create: (jest.fn() as any).mockImplementation(({ data }: { data: any }) =>
          Promise.resolve({
            id: 'act-new',
            ...data,
            assignee: { id: data.assigneeId, firstName: 'Alex', lastName: 'Morgan', email: 'alex@bahi.app', avatarUrl: null },
          }),
        ),
        update: (jest.fn() as any).mockImplementation(({ where, data }: { where: any; data: any }) =>
          Promise.resolve({ id: where.id, ...data }),
        ),
      },
      opportunity: {
        findUnique: (jest.fn() as any).mockResolvedValue({ title: 'Apex Tech Enterprise ERP' }),
      },
      lead: {
        findUnique: (jest.fn() as any).mockResolvedValue({ title: 'DataFlow Systems Lead' }),
      },
      company: {
        findUnique: (jest.fn() as any).mockResolvedValue({ name: 'Apex Tech' }),
      },
      contact: {
        findUnique: (jest.fn() as any).mockResolvedValue({ firstName: 'David', lastName: 'Chen' }),
      },
    };

    service = new ActivitiesService(mockPrisma);
  });

  it('should list activities and enrich with polymorphic related record name', async () => {
    const list = await service.findAll(mockTenantId, { view: 'today' });

    expect(list).toHaveLength(1);
    expect(list[0]?.subject).toBe('Discovery Call with CTO');
    expect(list[0]?.relatedName).toBe('Apex Tech Enterprise ERP');
    expect(mockPrisma.activity.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: mockTenantId,
          status: 'PENDING',
        }),
      }),
    );
  });

  it('should create an activity normalizing lowercase types and priorities', async () => {
    const created = await service.create(mockTenantId, {
      type: 'meeting' as any,
      priority: 'high' as any,
      subject: 'Executive Demo',
      relatedType: 'deal',
      relatedId: '22222222-2222-2222-2222-222222222222',
    });

    expect(created.type).toBe('MEETING');
    expect(created.priority).toBe('HIGH');
    expect(mockPrisma.activity.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'MEETING',
          priority: 'HIGH',
          tenantId: mockTenantId,
        }),
      }),
    );
  });

  it('should mark an activity as completed with outcome note', async () => {
    const completed = await service.complete(mockTenantId, 'act-1', 'Client agreed to proceed');

    expect(completed.status).toBe('COMPLETED');
    expect(completed.outcome).toBe('Client agreed to proceed');
    expect(completed.completedAt).toBeDefined();
  });
});
