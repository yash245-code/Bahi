// ═══════════════════════════════════════════════════════════
// ScoringService — Dynamic Lead Scoring & Intelligent Assignment
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';

export interface ScoreRule {
  criterion: 'JOB_TITLE' | 'COMPANY_SIZE' | 'INDUSTRY' | 'SOURCE' | 'INTERACTION';
  condition: string;
  points: number;
}

export type AssignmentStrategy = 'ROUND_ROBIN' | 'LOAD_BASED' | 'TERRITORY';

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);
  private roundRobinIndex: Map<string, number> = new Map();

  constructor(private readonly prisma: PrismaClient) {}

  // ─── Scoring Engine ──────────────────────────────────────────

  async calculateAndApplyScore(tenantId: string, leadId: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId, deletedAt: null },
      include: {
        contact: { include: { company: true } },
        campaign: true,
      },
    });

    if (!lead) throw new NotFoundException(`Lead ${leadId} not found`);

    let score = 0;

    // 1. Demographic & Firmographic Scoring
    const title = (lead.contact?.jobTitle || lead.title || '').toLowerCase();
    if (title.includes('director') || title.includes('vp') || title.includes('chief') || title.includes('founder') || title.includes('head')) {
      score += 25;
    } else if (title.includes('manager') || title.includes('lead')) {
      score += 15;
    }

    const company = lead.contact?.company;
    if (company?.size) {
      const size = company.size.toLowerCase();
      if (size.includes('enterprise') || size.includes('500+') || size.includes('1000+')) {
        score += 20;
      } else if (size.includes('50-') || size.includes('100-')) {
        score += 10;
      }
    }

    // 2. Lead Source & Channel Scoring
    const source = (lead.source || '').toLowerCase();
    if (source.includes('referral') || source.includes('inbound_demo')) {
      score += 20;
    } else if (source.includes('google') || source.includes('linkedin')) {
      score += 10;
    }

    // 3. Behavioral Scoring (Activities & Engagement)
    const activitiesCount = await this.prisma.activity.count({
      where: {
        tenantId,
        relatedType: 'lead',
        relatedId: leadId,
      },
    });
    score += Math.min(activitiesCount * 5, 30);

    // 4. Inactivity Decay (-5 for every 14 days untouched)
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysSinceUpdate > 14) {
      const decayPeriods = Math.floor(daysSinceUpdate / 14);
      score = Math.max(0, score - decayPeriods * 5);
    }

    // Rating determination
    let rating: 'HOT' | 'WARM' | 'COLD' = 'COLD';
    if (score >= 60) {
      rating = 'HOT';
    } else if (score >= 30) {
      rating = 'WARM';
    }

    return this.prisma.lead.update({
      where: { id: leadId },
      data: { score, rating },
    });
  }

  // ─── Automated Lead Assignment ───────────────────────────────

  async assignLead(tenantId: string, leadId: string, strategy: AssignmentStrategy = 'ROUND_ROBIN') {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId, deletedAt: null },
    });
    if (!lead) throw new NotFoundException(`Lead ${leadId} not found`);

    // Fetch active sales reps in the tenant
    const salesReps = await this.prisma.user.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    if (salesReps.length === 0) {
      this.logger.warn(`No active sales reps found for tenant ${tenantId}`);
      return lead;
    }

    let assignedRepId: string;

    if (strategy === 'LOAD_BASED') {
      // Find rep with fewest active leads
      const repCounts = await Promise.all(
        salesReps.map(async (rep) => {
          const count = await this.prisma.lead.count({
            where: {
              tenantId,
              ownerId: rep.id,
              status: { in: ['NEW', 'CONTACTED', 'WORKING'] },
              deletedAt: null,
            },
          });
          return { repId: rep.id, count };
        }),
      );

      repCounts.sort((a, b) => a.count - b.count);
      assignedRepId = repCounts[0]?.repId || salesReps[0]!.id;
    } else {
      // Default: ROUND_ROBIN
      const currentIndex = this.roundRobinIndex.get(tenantId) || 0;
      const nextIndex = (currentIndex + 1) % salesReps.length;
      this.roundRobinIndex.set(tenantId, nextIndex);
      const chosen = salesReps[currentIndex % salesReps.length];
      assignedRepId = chosen?.id || salesReps[0]!.id;
    }

    const updatedLead = await this.prisma.lead.update({
      where: { id: leadId },
      data: { ownerId: assignedRepId },
    });

    // Notify assigned representative
    await this.prisma.notification.create({
      data: {
        tenantId,
        userId: assignedRepId,
        title: 'New Lead Assigned',
        body: `You have been assigned lead: "${lead.title}"`,
        type: 'ASSIGNMENT',
        relatedType: 'lead',
        relatedId: leadId,
      },
    });

    return updatedLead;
  }

  // ─── Reassignment of Untouched Leads ─────────────────────────

  async reassignUntouchedLeads(tenantId: string, maxUntouchedDays = 3) {
    const thresholdDate = new Date(Date.now() - maxUntouchedDays * 86400000);

    const untouchedLeads = await this.prisma.lead.findMany({
      where: {
        tenantId,
        status: 'NEW',
        deletedAt: null,
        updatedAt: { lt: thresholdDate },
      },
      select: { id: true, ownerId: true },
    });

    const results = [];
    for (const lead of untouchedLeads) {
      const reassigned = await this.assignLead(tenantId, lead.id, 'LOAD_BASED');
      results.push({ leadId: lead.id, previousOwnerId: lead.ownerId, newOwnerId: reassigned.ownerId });
    }

    return {
      reassignedCount: results.length,
      details: results,
    };
  }
}
