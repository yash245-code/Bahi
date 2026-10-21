'use client';

import { useState, useEffect, useCallback } from 'react';
import { CrmNav } from '../components/CrmNav';
import { CrmAnnouncer } from '../components/CrmAnnouncer';
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

interface ApprovalItem {
  id: string;
  dealTitle: string;
  companyName: string;
  requestedBy: string;
  requestedDiscount: number;
  dealValue: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface QuotaGoal {
  id: string;
  repName: string;
  targetRevenue: number;
  achievedRevenue: number;
  closedDealsCount: number;
  period: string;
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

const initialApprovals: ApprovalItem[] = [
  {
    id: 'APP-1',
    dealTitle: 'NexGen Cloud ERP Suite',
    companyName: 'NexGen Systems',
    requestedBy: 'Alex Morgan',
    requestedDiscount: 18,
    dealValue: 15000,
    reason: 'Multi-year commitment request with upfront annual payment.',
    status: 'PENDING',
  },
  {
    id: 'APP-2',
    dealTitle: 'DataFlow Multi-Warehouse Sync',
    companyName: 'DataFlow Corp',
    requestedBy: 'Priya Sharma',
    requestedDiscount: 12,
    dealValue: 5400,
    reason: 'Strategic customer trial conversion incentive.',
    status: 'PENDING',
  },
];

const initialQuotas: QuotaGoal[] = [
  { id: 'Q-1', repName: 'Alex Morgan', targetRevenue: 150000, achievedRevenue: 118000, closedDealsCount: 6, period: 'Q3 2026' },
  { id: 'Q-2', repName: 'Priya Sharma', targetRevenue: 120000, achievedRevenue: 98500, closedDealsCount: 4, period: 'Q3 2026' },
  { id: 'Q-3', repName: 'Daniel Kim', targetRevenue: 90000, achievedRevenue: 82000, closedDealsCount: 3, period: 'Q3 2026' },
];

export function CrmAnalyticsView() {
  const [metrics, setMetrics] = useState<MetricsState>(defaultMetrics);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [quotas] = useState<QuotaGoal[]>(initialQuotas);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const announce = (msg: string) => {
    setAnnouncement(msg);
    setTimeout(() => setAnnouncement(null), 4000);
  };

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

  const handleApprovalDecision = (id: string, decision: 'APPROVED' | 'REJECTED') => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: decision } : a))
    );
    announce(`Discount request ${decision === 'APPROVED' ? 'approved' : 'rejected'} with audit comment.`);
  };

  return (
    <div className="space-y-6">
      <CrmAnnouncer message={announcement} />

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

      {/* ── Revenue Ops: Quotas & Approvals Queue ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deal Approvals Queue */}
        <div className="bg-white rounded-2xl p-5 border border-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="text-sm font-bold text-ink">Deal Approvals &amp; Discount Exceptions</h3>
              <p className="text-[11px] text-ink-muted">Discounts &gt;10% requiring Sales Manager authorization</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {approvals.filter((a) => a.status === 'PENDING').length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {approvals.map((app) => (
              <div key={app.id} className="p-3 rounded-xl bg-[#FAF9F5] border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-ink">{app.dealTitle}</span>
                    <span className="text-ink-muted ml-2">({app.companyName})</span>
                  </div>
                  <span className="font-bold font-mono text-accent">
                    {app.requestedDiscount}% Discount
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted italic">
                  &quot;{app.reason}&quot;
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px]">
                  <span className="text-ink-muted">Requested by: <strong>{app.requestedBy}</strong></span>
                  {app.status === 'PENDING' ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApprovalDecision(app.id, 'REJECTED')}
                        className="px-2.5 py-1 rounded bg-neutral-200 text-neutral-800 font-bold hover:bg-neutral-300 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprovalDecision(app.id, 'APPROVED')}
                        className="px-2.5 py-1 rounded bg-[#1F7A4D] text-white font-bold hover:bg-emerald-800 transition-colors shadow-2xs"
                      >
                        Authorize
                      </button>
                    </div>
                  ) : (
                    <span className={`font-bold px-2 py-0.5 rounded ${app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {app.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Quota Attainment Hub */}
        <div className="bg-white rounded-2xl p-5 border border-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="text-sm font-bold text-ink">Sales Quota Attainment Tracking</h3>
              <p className="text-[11px] text-ink-muted">Quarterly individual rep quota targets vs closed revenue</p>
            </div>
            <span className="text-xs font-semibold text-ink-muted">Q3 2026</span>
          </div>

          <div className="space-y-4">
            {quotas.map((q) => {
              const attainment = Math.round((q.achievedRevenue / q.targetRevenue) * 100);
              return (
                <div key={q.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-bold text-ink flex items-center gap-2">
                      <span>{q.repName}</span>
                      <span className="text-[10px] text-ink-muted font-normal">({q.closedDealsCount} won deals)</span>
                    </div>
                    <div className="font-mono text-ink">
                      <strong>${q.achievedRevenue.toLocaleString()}</strong> / ${q.targetRevenue.toLocaleString()} ({attainment}%)
                    </div>
                  </div>
                  <div
                    className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={attainment}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${q.repName} quota attainment ${attainment}%`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${attainment >= 85 ? 'bg-[#1F7A4D]' : attainment >= 70 ? 'bg-accent' : 'bg-amber-600'}`}
                      style={{ width: `${Math.min(attainment, 100)}%` }}
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
