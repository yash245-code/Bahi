// ═══════════════════════════════════════════════════════════
// ScoringService — Dynamic Scoring & Lead Distribution Tests
// ═══════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ScoringService } from './scoring.service';

describe('ScoringService', () => {
  let service: ScoringService;
  let mockPrisma: any;

  const mockTenantId = '11111111-1111-1111-1111-111111111111';

  beforeEach(() => {
    mockPrisma = {
      lead: {
        findFirst: (jest.fn() as any).mockResolvedValue({
          id: 'lead-1',
          tenantId: mockTenantId,
          title: 'VP of Technology Inquiry',
          source: 'referral',
          updatedAt: new Date(),
          contact: {
            jobTitle: 'VP of Engineering',
            company: {
              size: 'Enterprise (500+)',
            },
          },
        }),
        update: (jest.fn() as any).mockImplementation(({ data }: { data: any }) => Promise.resolve({ id: 'lead-1', ...data })),
        count: (jest.fn() as any).mockImplementation(({ where }: { where: any }) => {
          if (where.ownerId === 'user-1') return Promise.resolve(10);
          return Promise.resolve(2); // user-2 has lower load
        }),
      },
      activity: {
        count: (jest.fn() as any).mockResolvedValue(4), // 4 activities -> +20 pts
      },
      user: {
        findMany: (jest.fn() as any).mockResolvedValue([
          { id: 'user-1', firstName: 'Alice', lastName: 'Rep', email: 'alice@bahi.app' },
          { id: 'user-2', firstName: 'Bob', lastName: 'Rep', email: 'bob@bahi.app' },
        ]),
      },
      notification: {
        create: (jest.fn() as any).mockResolvedValue({ id: 'notif-1' }),
      },
    };

    service = new ScoringService(mockPrisma);
  });

  it('should calculate demographic, channel, and behavioral score, and rate as HOT', async () => {
    const scored = await service.calculateAndApplyScore(mockTenantId, 'lead-1');

    // VP title (+25) + Enterprise size (+20) + Referral source (+20) + 4 activities (+20) = 85 pts -> HOT
    expect(scored.score).toBeGreaterThanOrEqual(70);
    expect(scored.rating).toBe('HOT');
  });

  it('should assign lead using LOAD_BASED strategy to rep with fewest open leads', async () => {
    const assigned = await service.assignLead(mockTenantId, 'lead-1', 'LOAD_BASED');

    // user-2 has 2 open leads vs user-1 who has 10
    expect(assigned.ownerId).toBe('user-2');
    expect(mockPrisma.notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-2',
          type: 'ASSIGNMENT',
        }),
      }),
    );
  });
});
