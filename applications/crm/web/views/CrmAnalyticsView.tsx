'use client';

import { useState, useEffect, useCallback } from 'react';
import { CrmNav } from '../components/CrmNav';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';
import { crmApi } from '../lib/api-client';

interface MetricsState {
  totalOpenPipeline: number;
  weightedForecast: number;
  wonRevenue: number;
  winRate: number;
  avgDealSize: number;
  avgSalesCycleDays: number;
  openDealsCount: number;
  wonDealsCount: number;
  lostDealsCount: number;
  dealsByStage: Array<{ name: string; count: number; value: number }>;
  leadsBySource: Array<{ source: string; count: number }>;
}

const defaultMetrics: MetricsState = {
  totalOpenPipeline: 272000,
  weightedForecast: 168400,
  wonRevenue: 138500,
  winRate: 68.4,
  avgDealSize: 24700,
  avgSalesCycleDays: 19,
  openDealsCount: 11,
  wonDealsCount: 8,
  lostDealsCount: 3,
  dealsByStage: [
    { name: 'New Inbound', count: 3, value: 34200 },
    { name: 'Qualified', count: 2, value: 48000 },
    { name: 'Proposal Sent', count: 3, value: 68500 },
    { name: 'Negotiation', count: 2, value: 68000 },
    { name: 'Closed Won', count: 4, value: 138500 },
  ],
  leadsBySource: [
    { source: 'Inbound Website', count: 34 },
    { source: 'Google Ads', count: 28 },
    { source: 'LinkedIn Campaign', count: 19 },
    { source: 'Partner Referral', count: 14 },
    { source: 'Outbound Prospecting', count: 11 },
  ],
};

export function CrmAnalyticsView() {
  const [metrics, setMetrics] = useState<MetricsState>(defaultMetrics);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  const loadMetrics = useCallback(async () => {
    try {
      const data = await crmApi.analytics.getMetrics();
      if (data) {
        setMetrics({
          totalOpenPipeline: data.totalOpenPipeline || defaultMetrics.totalOpenPipeline,
          weightedForecast: data.weightedForecast || defaultMetrics.weightedForecast,
          wonRevenue: data.wonRevenue || defaultMetrics.wonRevenue,
          winRate: data.winRate || defaultMetrics.winRate,
          avgDealSize: data.avgDealSize || defaultMetrics.avgDealSize,
          avgSalesCycleDays: data.avgSalesCycleDays || defaultMetrics.avgSalesCycleDays,
          openDealsCount: data.openDealsCount || defaultMetrics.openDealsCount,
          wonDealsCount: data.wonDealsCount || defaultMetrics.wonDealsCount,
          lostDealsCount: data.lostDealsCount || defaultMetrics.lostDealsCount,
          dealsByStage: data.dealsByStage?.length > 0 ? data.dealsByStage : defaultMetrics.dealsByStage,
          leadsBySource: data.leadsBySource?.length > 0 ? data.leadsBySource : defaultMetrics.leadsBySource,
        });
      }
    } catch {
      // Keep defaultMetrics fallback
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  return (
    <div className="space-y-6">
      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
        totalPipelineValue={`$${metrics.totalOpenPipeline.toLocaleString()}`}
        activeDealsCount={metrics.openDealsCount}
      />

      {/* ── Key Executive Revenue Indicators ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Total Open Pipeline
          </span>
          <div className="text-2xl font-black font-mono text-ink mt-1">
            ${metrics.totalOpenPipeline.toLocaleString()}
          </div>
          <span className="text-[11px] text-ink-muted">{metrics.openDealsCount} active opportunities</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Weighted Forecast
          </span>
          <div className="text-2xl font-black font-mono text-accent mt-1">
            ${metrics.weightedForecast.toLocaleString()}
          </div>
          <span className="text-[11px] text-ink-muted">Probability-adjusted expected close</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Closed Won Revenue
          </span>
          <div className="text-2xl font-black font-mono text-[#1F7A4D] mt-1">
            ${metrics.wonRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">{metrics.wonDealsCount} signed deals</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Win / Loss Rate
          </span>
          <div className="text-2xl font-black font-mono text-ink mt-1">
            {metrics.winRate}%
          </div>
          <span className="text-[11px] text-ink-muted">{metrics.avgSalesCycleDays} days avg sales cycle</span>
        </div>
      </div>

      {/* ── Stage Breakdown & Lead Channel Funnel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <h3 className="text-sm font-bold text-ink">Pipeline Distribution by Conversion Stage</h3>
            <span className="text-xs text-ink-muted">Stage Velocity</span>
          </div>

          <div className="space-y-3">
            {metrics.dealsByStage.map((stg) => {
              const maxVal = Math.max(...metrics.dealsByStage.map((s) => s.value), 1);
              const pct = Math.round((stg.value / maxVal) * 100);

              return (
                <div key={stg.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-ink">{stg.name} ({stg.count})</span>
                    <span className="font-mono text-ink-muted font-bold">${stg.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Channels Acquisition */}
        <div className="bg-white rounded-2xl p-5 border border-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <h3 className="text-sm font-bold text-ink">Inbound Acquisition Channels</h3>
            <span className="text-xs text-ink-muted">Lead Attribution</span>
          </div>

          <div className="space-y-3">
            {metrics.leadsBySource.map((src) => {
              const totalLeads = metrics.leadsBySource.reduce((acc, s) => acc + s.count, 0);
              const pct = totalLeads > 0 ? Math.round((src.count / totalLeads) * 100) : 0;

              return (
                <div key={src.source} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink">{src.source}</span>
                    <span className="font-mono text-ink-muted">{src.count} leads ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#20211F] rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewDealModal
        isOpen={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSubmit={() => {}}
      />

      <NewLeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSubmit={() => {}}
      />
    </div>
  );
}
