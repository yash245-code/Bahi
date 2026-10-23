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

  // ── Forecast Simulator State ──
  const [scenario, setScenario] = useState<'conservative' | 'base' | 'bull'>('base');
  const [winRateSlider, setWinRateSlider] = useState<number>(68);
  const [slippageSlider, setSlippageSlider] = useState<number>(8);
  const [quarterTarget, setQuarterTarget] = useState<number>(320000);

  const announce = (msg: string) => {
    setAnnouncement(msg);
    setTimeout(() => setAnnouncement(null), 4000);
  };

  const applyScenario = (sc: 'conservative' | 'base' | 'bull') => {
    setScenario(sc);
    if (sc === 'conservative') {
      setWinRateSlider(50);
      setSlippageSlider(18);
      announce('Applied Conservative forecast model (50% close, 18% slippage)');
    } else if (sc === 'base') {
      setWinRateSlider(Math.round(metrics.winRate));
      setSlippageSlider(8);
      announce('Reset to Base weighted forecast model');
    } else {
      setWinRateSlider(85);
      setSlippageSlider(2);
      announce('Applied Bull / High-Velocity forecast model (85% close, 2% slippage)');
    }
  };

  // Real-time dynamic simulator calculations
  const effectivePipeline = Math.round(metrics.totalOpenPipeline * (1 - slippageSlider / 100));
  const simulatedNewRevenue = Math.round(effectivePipeline * (winRateSlider / 100));
  const projectedTotalRevenue = metrics.wonRevenue + simulatedNewRevenue;
  const variance = projectedTotalRevenue - quarterTarget;
  const attainmentPct = Math.round((projectedTotalRevenue / quarterTarget) * 100);
  const pacingStatus: 'Ahead' | 'On Pace' | 'At Risk' =
    projectedTotalRevenue >= quarterTarget
      ? 'Ahead'
      : projectedTotalRevenue >= quarterTarget * 0.92
      ? 'On Pace'
      : 'At Risk';

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
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-4 border border-border dark:border-[#2E302A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Total Open Pipeline
          </span>
          <div className="text-2xl font-black font-mono text-ink dark:text-white mt-1">
            ${metrics.totalOpenPipeline.toLocaleString()}
          </div>
          <span className="text-[11px] text-ink-muted">{metrics.openDealsCount} active opportunities</span>
        </div>

        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-4 border border-border dark:border-[#2E302A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Weighted Forecast
          </span>
          <div className="text-2xl font-black font-mono text-accent mt-1">
            ${metrics.weightedForecast.toLocaleString()}
          </div>
          <span className="text-[11px] text-ink-muted">Probability-adjusted expected close</span>
        </div>

        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-4 border border-border dark:border-[#2E302A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Closed Won Revenue
          </span>
          <div className="text-2xl font-black font-mono text-[#1F7A4D] dark:text-emerald-400 mt-1">
            ${metrics.wonRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">{metrics.wonDealsCount} signed deals</span>
        </div>

        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-4 border border-border dark:border-[#2E302A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Win / Loss Rate
          </span>
          <div className="text-2xl font-black font-mono text-ink dark:text-white mt-1">
            {metrics.winRate}%
          </div>
          <span className="text-[11px] text-ink-muted">{metrics.avgSalesCycleDays} days avg sales cycle</span>
        </div>
      </div>

      {/* ── Interactive "What-If" Forecast Simulator & Pacing ── */}
      <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-6 border border-border dark:border-[#2E302A] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80 dark:border-[#2E302A]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-accent/10 text-accent">
                Executive Forecast Lab
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                pacingStatus === 'Ahead'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                  : pacingStatus === 'On Pace'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800'
              }`}>
                {pacingStatus === 'Ahead' ? '✓ Ahead of Quota' : pacingStatus === 'On Pace' ? '⏳ On Pace (Within 8%)' : '⚠️ Revenue at Risk'}
              </span>
            </div>
            <h2 className="text-base font-black text-ink dark:text-white mt-1">
              Interactive &quot;What-If&quot; Revenue Simulator
            </h2>
            <p className="text-xs text-ink-muted">
              Model closing rates, pipeline slippage, and revenue targets in real time against active opportunities.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] dark:bg-neutral-800 p-1 rounded-xl border border-border dark:border-[#2E302A]">
            <button
              type="button"
              onClick={() => applyScenario('conservative')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                scenario === 'conservative'
                  ? 'bg-white dark:bg-neutral-700 text-ink dark:text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              🛡️ Conservative
            </button>
            <button
              type="button"
              onClick={() => applyScenario('base')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                scenario === 'base'
                  ? 'bg-white dark:bg-neutral-700 text-ink dark:text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              ⚖️ Base Model
            </button>
            <button
              type="button"
              onClick={() => applyScenario('bull')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                scenario === 'bull'
                  ? 'bg-white dark:bg-neutral-700 text-ink dark:text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              🚀 Bull / Stretch
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Win Rate Slider */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border/80 dark:border-[#2E302A] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-ink dark:text-white">Simulated Win Rate</span>
              <span className="font-mono font-black text-accent text-sm">{winRateSlider}%</span>
            </div>
            <input
              type="range"
              min={25}
              max={95}
              value={winRateSlider}
              onChange={(e) => {
                setWinRateSlider(Number(e.target.value));
                setScenario('base');
              }}
              className="w-full accent-[#A8462F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ink-muted">
              <span>25% (Pessimistic)</span>
              <span>Baseline: {metrics.winRate}%</span>
              <span>95% (Peak)</span>
            </div>
          </div>

          {/* Deal Slippage Slider */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border/80 dark:border-[#2E302A] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-ink dark:text-white">Pipeline Slippage Buffer</span>
              <span className="font-mono font-black text-ink dark:text-white text-sm">{slippageSlider}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              value={slippageSlider}
              onChange={(e) => {
                setSlippageSlider(Number(e.target.value));
                setScenario('base');
              }}
              className="w-full accent-[#20211F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ink-muted">
              <span>0% (No delays)</span>
              <span>15% (Typical)</span>
              <span>30% (High risk)</span>
            </div>
          </div>

          {/* Target Revenue Setter */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border/80 dark:border-[#2E302A] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-ink dark:text-white">Q3 Executive Target</span>
              <span className="font-mono font-black text-ink dark:text-white text-sm">
                ${quarterTarget.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={250000}
              max={500000}
              step={10000}
              value={quarterTarget}
              onChange={(e) => setQuarterTarget(Number(e.target.value))}
              className="w-full accent-neutral-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ink-muted">
              <span>$250k</span>
              <span>$320k Target</span>
              <span>$500k Stretch</span>
            </div>
          </div>
        </div>

        {/* Real-time Forecast Projections Bar */}
        <div className="p-4 rounded-xl bg-[#141513] text-white space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                Current Won
              </span>
              <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">
                ${metrics.wonRevenue.toLocaleString()}
              </div>
              <span className="text-[10px] text-neutral-400">{metrics.wonDealsCount} signed deals</span>
            </div>
            <div>
              <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                Simulated New Bookings
              </span>
              <div className="text-lg font-black font-mono text-amber-300 mt-0.5">
                +${simulatedNewRevenue.toLocaleString()}
              </div>
              <span className="text-[10px] text-neutral-400">From ${effectivePipeline.toLocaleString()} effective</span>
            </div>
            <div>
              <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                Projected Total Q3
              </span>
              <div className="text-xl font-black font-mono text-white mt-0.5">
                ${projectedTotalRevenue.toLocaleString()}
              </div>
              <span className="text-[10px] text-neutral-300 font-bold">{attainmentPct}% of target</span>
            </div>
            <div>
              <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                Target Variance
              </span>
              <div className={`text-lg font-black font-mono mt-0.5 ${variance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {variance >= 0 ? `+$${variance.toLocaleString()}` : `-$${Math.abs(variance).toLocaleString()}`}
              </div>
              <span className="text-[10px] text-neutral-400">
                {variance >= 0 ? 'Surplus buffer' : 'Pipeline deficit'}
              </span>
            </div>
          </div>

          {/* Visual Goal Bar */}
          <div className="space-y-1 pt-2 border-t border-neutral-800">
            <div className="flex justify-between text-[11px] text-neutral-300">
              <span>Combined Attainment: <strong>{attainmentPct}%</strong></span>
              <span className="font-mono">${projectedTotalRevenue.toLocaleString()} / ${quarterTarget.toLocaleString()}</span>
            </div>
            <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((metrics.wonRevenue / quarterTarget) * 100))}%` }}
                title={`Won: $${metrics.wonRevenue.toLocaleString()}`}
              />
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${Math.min(100 - Math.round((metrics.wonRevenue / quarterTarget) * 100), Math.round((simulatedNewRevenue / quarterTarget) * 100))}%` }}
                title={`Simulated New: $${simulatedNewRevenue.toLocaleString()}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Stage Breakdown & Lead Channel Funnel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Distribution */}
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-5 border border-border dark:border-[#2E302A] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60 dark:border-[#2E302A]">
            <h3 className="text-sm font-bold text-ink dark:text-white">Pipeline Distribution by Conversion Stage</h3>
            <span className="text-xs text-ink-muted">Stage Velocity</span>
          </div>

          <div className="space-y-3">
            {metrics.dealsByStage.map((stg) => {
              const maxVal = Math.max(...metrics.dealsByStage.map((s) => s.value), 1);
              const pct = Math.round((stg.value / maxVal) * 100);

              return (
                <div key={stg.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-ink dark:text-neutral-200">{stg.name} ({stg.count})</span>
                    <span className="font-mono text-ink-muted dark:text-neutral-400 font-bold">${stg.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
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
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-5 border border-border dark:border-[#2E302A] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60 dark:border-[#2E302A]">
            <h3 className="text-sm font-bold text-ink dark:text-white">Inbound Acquisition Channels</h3>
            <span className="text-xs text-ink-muted">Lead Attribution</span>
          </div>

          <div className="space-y-3">
            {metrics.leadsBySource.map((src) => {
              const totalLeads = metrics.leadsBySource.reduce((acc, s) => acc + s.count, 0);
              const pct = totalLeads > 0 ? Math.round((src.count / totalLeads) * 100) : 0;

              return (
                <div key={src.source} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink dark:text-neutral-200">{src.source}</span>
                    <span className="font-mono text-ink-muted dark:text-neutral-400">{src.count} leads ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#20211F] dark:bg-neutral-200 rounded-full transition-all duration-300"
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
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-5 border border-border dark:border-[#2E302A] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60 dark:border-[#2E302A]">
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-white">Deal Approvals &amp; Discount Exceptions</h3>
              <p className="text-[11px] text-ink-muted">Discounts &gt;10% requiring Sales Manager authorization</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              {approvals.filter((a) => a.status === 'PENDING').length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {approvals.map((app) => (
              <div key={app.id} className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border/80 dark:border-[#2E302A] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-ink dark:text-white">{app.dealTitle}</span>
                    <span className="text-ink-muted ml-2">({app.companyName})</span>
                  </div>
                  <span className="font-bold font-mono text-accent">
                    {app.requestedDiscount}% Discount
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted italic">
                  &quot;{app.reason}&quot;
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-border/40 dark:border-[#2E302A] text-[10px]">
                  <span className="text-ink-muted">Requested by: <strong className="text-ink dark:text-neutral-200">{app.requestedBy}</strong></span>
                  {app.status === 'PENDING' ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApprovalDecision(app.id, 'REJECTED')}
                        className="px-2.5 py-1 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
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
                    <span className={`font-bold px-2 py-0.5 rounded ${app.status === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'}`}>
                      {app.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Quota Attainment Hub */}
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-5 border border-border dark:border-[#2E302A] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60 dark:border-[#2E302A]">
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-white">Sales Quota Attainment Tracking</h3>
              <p className="text-[11px] text-ink-muted">Quarterly individual rep quota targets vs closed revenue</p>
            </div>
            <span className="text-xs font-semibold text-ink-muted">Q3 2026</span>
          </div>

          <div className="space-y-4">
            {quotas.map((q) => {
              const attainment = Math.round((q.achievedRevenue / q.targetRevenue) * 100);
              const remaining = Math.max(0, q.targetRevenue - q.achievedRevenue);
              const dealsNeeded = Math.ceil(remaining / metrics.avgDealSize);
              const repPacing = attainment >= 80 ? 'Ahead of Target' : attainment >= 65 ? 'On Pace' : 'At Risk';
              const repBadgeClass =
                repPacing === 'Ahead of Target'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : repPacing === 'On Pace'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                  : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300';

              return (
                <div key={q.id} className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border/70 dark:border-[#2E302A] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-bold text-ink dark:text-white flex items-center gap-2">
                      <span>{q.repName}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${repBadgeClass}`}>
                        {repPacing}
                      </span>
                    </div>
                    <div className="font-mono text-ink dark:text-neutral-100 text-xs">
                      <strong>${q.achievedRevenue.toLocaleString()}</strong> / ${q.targetRevenue.toLocaleString()} ({attainment}%)
                    </div>
                  </div>

                  <div
                    className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden"
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

                  <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1">
                    <span>{q.closedDealsCount} closed deals</span>
                    <span>
                      {remaining === 0 ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">🎉 Quota Met</span>
                      ) : (
                        <span>${remaining.toLocaleString()} needed (~{dealsNeeded} deals)</span>
                      )}
                    </span>
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
