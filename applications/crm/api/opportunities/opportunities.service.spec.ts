// ═══════════════════════════════════════════════════════════
// OpportunitiesService — Pipeline Kanban & Stage Gating Tests
// ═══════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { OpportunitiesService } from './opportunities.service';

describe('OpportunitiesService', () => {
  let service: OpportunitiesService;
  let mockPrisma: any;
  let mockEventBus: any;

  const mockTenantId = '11111111-1111-1111-1111-111111111111';

  beforeEach(() => {
    mockEventBus = {
      publish: jest.fn() as any,
    };

    mockPrisma = {
      pipeline: {
        findFirst: (jest.fn() as any).mockResolvedValue({
          id: 'pipe-1',
          tenantId: mockTenantId,
          name: 'Direct Sales Pipeline',
          stages: [
            { id: 'stage-1', name: 'Qualified', order: 1, defaultProbability: 20, stageType: 'OPEN', rottingDays: 14 },
            { id: 'stage-2', name: 'Demo Done', order: 2, defaultProbability: 40, stageType: 'OPEN', rottingDays: 7 },
            { id: 'stage-won', name: 'Closed Won', order: 3, defaultProbability: 100, stageType: 'WON' },
            { id: 'stage-lost', name: 'Closed Lost', order: 4, defaultProbability: 0, stageType: 'LOST' },
          ],
        }),
        findUnique: (jest.fn() as any).mockResolvedValue({
          id: 'pipe-1',
          tenantId: mockTenantId,
          name: 'Direct Sales Pipeline',
        }),
      },
      pipelineStage: {
        findMany: (jest.fn() as any).mockResolvedValue([
          { id: 'stage-1', name: 'Qualified', order: 1, defaultProbability: 20, stageType: 'OPEN', rottingDays: 14, opportunities: [{ id: 'deal-1', value: 50000, probability: 20, stageEnteredAt: new Date() }] },
          { id: 'stage-2', name: 'Demo Done', order: 2, defaultProbability: 40, stageType: 'OPEN', rottingDays: 7, opportunities: [] },
          { id: 'stage-won', name: 'Closed Won', order: 3, defaultProbability: 100, stageType: 'WON', opportunities: [] },
          { id: 'stage-lost', name: 'Closed Lost', order: 4, defaultProbability: 0, stageType: 'LOST', opportunities: [] },
        ]),
        findFirst: (jest.fn() as any).mockImplementation(({ where }: { where: any }) => {
          if (where.id === 'stage-2') {
            return Promise.resolve({ id: 'stage-2', name: 'Demo Done', defaultProbability: 40, stageType: 'OPEN', pipelineId: 'pipe-1' });
          }
          if (where.stageType === 'WON') {
            return Promise.resolve({ id: 'stage-won', name: 'Closed Won', defaultProbability: 100, stageType: 'WON', pipelineId: 'pipe-1' });
          }
          if (where.stageType === 'LOST') {
            return Promise.resolve({ id: 'stage-lost', name: 'Closed Lost', defaultProbability: 0, stageType: 'LOST', pipelineId: 'pipe-1' });
          }
          return Promise.resolve({ id: 'stage-1', name: 'Qualified', defaultProbability: 20, stageType: 'OPEN', pipelineId: 'pipe-1' });
        }),
      },
      opportunity: {
        findFirst: (jest.fn() as any).mockImplementation(({ where }: { where: any }) => {
          if (where.tenantId !== mockTenantId) return Promise.resolve(null);
          return Promise.resolve({
            id: where.id || 'deal-1',
            tenantId: mockTenantId,
            title: 'Enterprise ERP License',
            value: 50000,
            currency: 'USD',
            probability: 20,
            pipelineId: 'pipe-1',
            stageId: 'stage-1',
            stageEnteredAt: new Date(Date.now() - 3600000), // 1 hour ago
            stage: { id: 'stage-1', name: 'Qualified', stageType: 'OPEN' },
            lineItems: [],
          });
        }),
        findMany: (jest.fn() as any).mockResolvedValue([
          {
            id: 'deal-1',
            tenantId: mockTenantId,
            title: 'Enterprise ERP License',
            value: 50000,
            probability: 20,
            stageId: 'stage-1',
            stageEnteredAt: new Date(),
            stage: { id: 'stage-1', name: 'Qualified', stageType: 'OPEN' },
            lineItems: [],
          },
        ]),
        update: (jest.fn() as any).mockImplementation(({ where, data }: { where: any; data: any }) =>
          Promise.resolve({ id: where.id, ...data }),
        ),
      },
      stageHistory: {
        findFirst: (jest.fn() as any).mockResolvedValue(null),
        create: (jest.fn() as any).mockResolvedValue({ id: 'history-1' }),
        update: (jest.fn() as any).mockResolvedValue({ id: 'history-1' }),
      },
      lostReason: {
        findFirst: (jest.fn() as any).mockResolvedValue({ id: 'reason-1', reason: 'Budget Cut' }),
      },
      $transaction: (jest.fn() as any).mockImplementation(async (callback: any) => callback(mockPrisma)),
    };

    service = new OpportunitiesService(mockPrisma, mockEventBus);
  });

  it('should calculate Kanban board stages and totals accurately', async () => {
    const board = await service.getPipelineBoard(mockTenantId);
    expect(board.pipeline).toBeDefined();
    expect(board.stages).toHaveLength(4);
    expect(board.stages[0]?.totalValue).toBe(50000);
    expect(board.stages[0]?.weightedValue).toBe(10000);
  });

  it('should transition deal to new stage, log StageHistory, and emit domain event', async () => {
    const updated = await service.updateStage(mockTenantId, 'deal-1', 'stage-2', 'user-1');

    expect(updated.stageId).toBe('stage-2');
    expect(updated.probability).toBe(40);
    expect(mockPrisma.stageHistory.create).toHaveBeenCalled();
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      'deal.stage_changed',
      expect.objectContaining({
        tenantId: mockTenantId,
        dealId: 'deal-1',
        fromStageId: 'stage-1',
        toStageId: 'stage-2',
      }),
    );
  });

  it('should mark deal as Won and trigger deal.won domain event', async () => {
    const won = await service.markWon(mockTenantId, 'deal-1', 'Superior multi-tenant performance', 'user-1');

    expect(won.wonReason).toBe('Superior multi-tenant performance');
    expect(won.probability).toBe(100);
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      'deal.won',
      expect.objectContaining({
        tenantId: mockTenantId,
        dealId: 'deal-1',
        title: 'Enterprise ERP License',
        value: 50000,
      }),
    );
  });

  it('should require a lost reason and emit deal.lost event when marked as lost', async () => {
    const lost = await service.markLost(mockTenantId, 'deal-1', 'Budget Cut', 'user-1');

    expect(lost.lostReason).toBe('Budget Cut');
    expect(lost.probability).toBe(0);
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      'deal.lost',
      expect.objectContaining({
        tenantId: mockTenantId,
        dealId: 'deal-1',
        reason: 'Budget Cut',
      }),
    );
  });
});
