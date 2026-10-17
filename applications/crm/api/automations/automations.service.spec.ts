// ═══════════════════════════════════════════════════════════
// AutomationsService — Workflow Rule & Action Execution Tests
// ═══════════════════════════════════════════════════════════

import { AutomationsService } from './automations.service';

describe('AutomationsService', () => {
  let service: AutomationsService;
  let mockPrisma: any;
  let mockEventBus: any;

  const mockTenantId = '11111111-1111-1111-1111-111111111111';

  beforeEach(() => {
    mockEventBus = {
      events$: {
        subscribe: jest.fn(),
      },
    };

    mockPrisma = {
      automationRule: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'rule-1',
            tenantId: mockTenantId,
            name: 'High-Value Deal Alert',
            triggerEvent: 'deal.stage_changed',
            active: true,
            conditions: [
              { field: 'value', operator: 'gte', value: 25000 },
            ],
            actions: [
              {
                type: 'CREATE_TASK',
                params: { subject: 'Follow up on high-value opportunity', priority: 'HIGH' },
              },
              {
                type: 'NOTIFY_USER',
                params: { title: 'High-value deal advanced', userId: 'user-manager' },
              },
            ],
          },
        ]),
        update: jest.fn().mockResolvedValue({ id: 'rule-1' }),
      },
      activity: {
        create: jest.fn().mockResolvedValue({ id: 'activity-auto' }),
      },
      notification: {
        create: jest.fn().mockResolvedValue({ id: 'notif-auto' }),
      },
    };

    service = new AutomationsService(mockPrisma, mockEventBus);
  });

  it('should correctly evaluate conditions for gte, eq, and contains', () => {
    const payload = { value: 30000, status: 'QUALIFIED', companyName: 'Acme Corporation' };

    expect(
      service.evaluateConditions([{ field: 'value', operator: 'gte', value: 25000 }], payload),
    ).toBe(true);

    expect(
      service.evaluateConditions([{ field: 'value', operator: 'gte', value: 50000 }], payload),
    ).toBe(false);

    expect(
      service.evaluateConditions([{ field: 'status', operator: 'eq', value: 'QUALIFIED' }], payload),
    ).toBe(true);

    expect(
      service.evaluateConditions([{ field: 'companyName', operator: 'contains', value: 'acme' }], payload),
    ).toBe(true);
  });

  it('should trigger actions when incoming domain event matches rule criteria', async () => {
    await service.handleDomainEvent({
      eventName: 'deal.stage_changed',
      timestamp: new Date(),
      payload: {
        tenantId: mockTenantId,
        dealId: 'deal-99',
        id: 'deal-99',
        value: 35000,
        ownerId: 'user-sales',
      },
    });

    expect(mockPrisma.activity.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: mockTenantId,
          type: 'TASK',
          priority: 'HIGH',
        }),
      }),
    );

    expect(mockPrisma.notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: mockTenantId,
          userId: 'user-manager',
        }),
      }),
    );

    expect(mockPrisma.automationRule.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'rule-1' },
      }),
    );
  });
});
