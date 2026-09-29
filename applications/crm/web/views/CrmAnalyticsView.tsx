'use client';

import { useState } from 'react';
import { CrmNav } from '../components/CrmNav';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';

export function CrmAnalyticsView() {
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [forecastPeriod, setForecastPeriod] = useState<'q3' | 'q4' | 'fy2026'>('q4');

  const funnelStages = [
    { name: '1. Inbound Leads', deals: 42, volume: '$180,000', dropoff: '100% base', color: '#75766E', width: 100 },
    { name: '2. Qualified Discovery', deals: 28, volume: '$145,000', dropoff: '66% conversion', color: '#A8462F', width: 80 },
    { name: '3. Proposal Delivered', deals: 18, volume: '$112,000', dropoff: '42% conversion', color: '#853526', width: 62 },
    { name: '4. Legal Negotiation', deals: 12, volume: '$84,000', dropoff: '28% conversion', color: '#B8790A', width: 45 },
    { name: '5. Closed Won', deals: 8, volume: '$62,000', dropoff: '19% final win rate', color: '#1F7A4D', width: 32 },
  ];

  const repPerformance = [
    { name: 'Alex Morgan', avatar: 'AM', quota: '$120,000', closed: '$104,000', pct: 86, deals: 6, color: 'bg-accent' },
    { name: 'Priya Sharma', avatar: 'PS', quota: '$100,000', closed: '$94,000', pct: 94, deals: 5, color: 'bg-[#20211F]' },
    { name: 'Daniel Kim', avatar: 'DK', quota: '$90,000', closed: '$68,000', pct: 75, deals: 4, color: 'bg-[#75766E]' },
    { name: 'Sarah Chen', avatar: 'SC', quota: '$110,000', closed: '$82,000', pct: 74, deals: 5, color: 'bg-[#1F7A4D]' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Persistent CRM Navigation Header ─────────── */}
      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
        totalPipelineValue="$272,000"
      />

      {/* ── Forecast Period Switcher ─────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Revenue Velocity &amp; Forecasting</h2>
          <p className="text-xs text-ink-muted">Risk-adjusted pipeline conversion and quota attainment.</p>
        </div>

        <div className="inline-flex items-center p-1 rounded-xl bg-white border border-border text-xs">
          {(['q3', 'q4', 'fy2026'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setForecastPeriod(p)}
              className={`px-3 py-1 rounded-lg font-semibold uppercase text-[11px] transition-all cursor-pointer ${
                forecastPeriod === p ? 'bg-accent text-white shadow-xs' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Executive Metric Cards ───────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Total Unweighted Pipeline</span>
          <span className="text-2xl font-black text-ink mt-1 font-mono">$272,000</span>
          <span className="text-[11px] text-[#1F7A4D] font-medium block mt-1">+24% vs Q3 target</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Weighted Risk-Adjusted Forecast</span>
          <span className="text-2xl font-black text-accent mt-1 font-mono">$164,800</span>
          <span className="text-[11px] text-ink-muted block mt-1">Based on stage probabilities</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Win Rate (Trailing 90 Days)</span>
          <span className="text-2xl font-black text-[#1F7A4D] mt-1 font-mono">68.4%</span>
          <span className="text-[11px] text-[#1F7A4D] font-medium block mt-1">+4.2% velocity increase</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Average Deal Velocity</span>
          <span className="text-2xl font-black text-purple-700 mt-1 font-mono">22.5 Days</span>
          <span className="text-[11px] text-ink-muted block mt-1">From discovery to signed contract</span>
        </div>
      </div>

      {/* ── Conversion Funnel Visualization ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stage Conversion Funnel (7 cols) */}
        <div className="lg:col-span-7 card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-ink">Stage-by-Stage Conversion Funnel</h3>
            <span className="text-xs font-mono text-ink-muted">Historical Drop-Off Analysis</span>
          </div>

          <div className="space-y-4 pt-1">
            {funnelStages.map((stg) => (
              <div key={stg.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stg.color }} />
                    <span className="font-bold text-ink">{stg.name}</span>
                    <span className="text-ink-muted font-mono text-[11px]">({stg.deals} deals)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-ink font-mono">{stg.volume}</span>
                    <span className="text-[11px] font-semibold text-ink-muted w-24 text-right">
                      {stg.dropoff}
                    </span>
                  </div>
                </div>

                {/* Funnel Progress Bar */}
                <div className="w-full h-3 bg-[#FAF9F5] border border-border/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${stg.width}%`, backgroundColor: stg.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Rep Quota Attainment Leaderboard (5 cols) */}
        <div className="lg:col-span-5 card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-ink">Quota Attainment Leaderboard</h3>
            <span className="text-xs font-mono text-accent font-semibold">{forecastPeriod.toUpperCase()}</span>
          </div>

          <div className="space-y-4 pt-1">
            {repPerformance.map((rep) => (
              <div key={rep.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${rep.color} text-white font-bold text-[10px] flex items-center justify-center shadow-xs`}>
                      {rep.avatar}
                    </div>
                    <span className="font-bold text-ink">{rep.name}</span>
                    <span className="text-ink-muted text-[10px]">({rep.deals} deals)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink font-mono">{rep.closed}</span>
                    <span className={`text-[11px] font-black ${rep.pct >= 90 ? 'text-[#1F7A4D]' : 'text-accent'}`}>
                      {rep.pct}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-[#FAF9F5] border border-border/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      rep.pct >= 90 ? 'bg-[#1F7A4D]' : rep.pct >= 80 ? 'bg-accent' : 'bg-[#B8790A]'
                    }`}
                    style={{ width: `${Math.min(rep.pct, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-ink-muted">
            <span>Team Quota Target: <strong>$420,000</strong></span>
            <span className="font-bold text-[#1F7A4D]">83% Overall Run-Rate</span>
          </div>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────── */}
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
