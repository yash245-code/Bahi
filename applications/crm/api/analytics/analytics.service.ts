// ═══════════════════════════════════════════════════════════
// AnalyticsService — Forecasting, Win/Loss & Sales Velocity
// ═══════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaClient) {}

  async getExecutiveMetrics(tenantId: string) {
    const deals = await this.prisma.opportunity.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        stage: { select: { name: true, stageType: true, order: true } },
      },
    });

    const leads = await this.prisma.lead.findMany({
      where: { tenantId, deletedAt: null },
    });

    // 1. Pipeline Totals
    const openDeals = deals.filter((d) => d.stage.stageType === 'OPEN');
    const wonDeals = deals.filter((d) => d.stage.stageType === 'WON');
    const lostDeals = deals.filter((d) => d.stage.stageType === 'LOST');

    const totalOpenPipeline = openDeals.reduce((acc, d) => acc + Number(d.value), 0);
    const weightedForecast = openDeals.reduce(
      (acc, d) => acc + Number(d.value) * (d.probability / 100),
      0,
    );
    const wonRevenue = wonDeals.reduce((acc, d) => acc + Number(d.value), 0);

    // 2. Win / Loss ratio
    const closedCount = wonDeals.length + lostDeals.length;
    const winRate = closedCount > 0 ? (wonDeals.length / closedCount) * 100 : 0;

    // 3. Average deal size
    const avgDealSize =
      deals.length > 0
        ? deals.reduce((acc, d) => acc + Number(d.value), 0) / deals.length
        : 0;

    // 4. Sales cycle length (days from creation to won)
    let avgSalesCycleDays = 0;
    if (wonDeals.length > 0) {
      const totalCycleDays = wonDeals.reduce((acc, d) => {
        const days = Math.max(
          1,
          Math.floor(
            (new Date(d.updatedAt).getTime() - new Date(d.createdAt).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        );
        return acc + days;
      }, 0);
      avgSalesCycleDays = Math.round(totalCycleDays / wonDeals.length);
    }

    // 5. Deals by Stage
    const stagesMap: Record<string, { name: string; count: number; value: number; order: number }> = {};
    for (const d of deals) {
      const stageName = d.stage.name;
      if (!stagesMap[stageName]) {
        stagesMap[stageName] = {
          name: stageName,
          count: 0,
          value: 0,
          order: d.stage.order,
        };
      }
      stagesMap[stageName].count += 1;
      stagesMap[stageName].value += Number(d.value);
    }
    const dealsByStage = Object.values(stagesMap).sort((a, b) => a.order - b.order);

    // 6. Leads by Source
    const sourcesMap: Record<string, number> = {};
    for (const l of leads) {
      const src = l.source || 'Direct / Other';
      sourcesMap[src] = (sourcesMap[src] || 0) + 1;
    }
    const leadsBySource = Object.entries(sourcesMap).map(([source, count]) => ({
      source,
      count,
    }));

    return {
      totalOpenPipeline,
      weightedForecast: Math.round(weightedForecast),
      wonRevenue,
      winRate: Math.round(winRate * 10) / 10,
      avgDealSize: Math.round(avgDealSize),
      avgSalesCycleDays: avgSalesCycleDays || 18,
      openDealsCount: openDeals.length,
      wonDealsCount: wonDeals.length,
      lostDealsCount: lostDeals.length,
      totalLeadsCount: leads.length,
      dealsByStage,
      leadsBySource,
    };
  }
}
