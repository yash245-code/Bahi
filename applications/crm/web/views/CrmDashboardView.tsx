'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CrmNav } from '../components/CrmNav';
import { CrmAnnouncer } from '../components/CrmAnnouncer';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';

interface LeaderboardRep {
  id: string;
  name: string;
  avatar: string;
  role: string;
  wonRevenue: number;
  quotaTarget: number;
  attainmentPercent: number;
  dealsWon: number;
  pipelineActive: number;
}

const leaderboardData: LeaderboardRep[] = [
  {
    id: '1',
    name: 'Alex Morgan',
    avatar: 'AM',
    role: 'Senior Account Executive',
    wonRevenue: 118000,
    quotaTarget: 150000,
    attainmentPercent: 78.7,
    dealsWon: 6,
    pipelineActive: 104400,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    avatar: 'PS',
    role: 'Enterprise Sales Lead',
    wonRevenue: 98500,
    quotaTarget: 120000,
    attainmentPercent: 82.1,
    dealsWon: 4,
    pipelineActive: 89000,
  },
  {
    id: '3',
    name: 'Daniel Kim',
    avatar: 'DK',
    role: 'Inbound Growth Rep',
    wonRevenue: 82000,
    quotaTarget: 90000,
    attainmentPercent: 91.1,
    dealsWon: 3,
    pipelineActive: 54600,
  },
];

const recentFeed = [
  { id: '1', time: '12m ago', type: 'won', text: 'Apex Dynamics Annual ERP ($52,000) marked Closed Won by Alex Morgan.' },
  { id: '2', time: '45m ago', type: 'quote', text: 'Digital quotation QUO-2026-0812 signed by Elena Rostova (CEO).' },
  { id: '3', time: '2h ago', type: 'lead', text: 'High-score inbound lead Sarah Chen (Score: 92, HOT) qualified.' },
  { id: '4', time: '3h ago', type: 'stage', text: 'Vortex Global Accounting advanced to Negotiation ($34,000).' },
  { id: '5', time: '5h ago', type: 'task', text: 'Executive demo completed with Nordic Logistics AG.' },
];

const highValueSpotlight = [
  { id: 'D-108', title: 'Vortex Global Accounting', company: 'Vortex Global', amount: 34000, probability: 85, closeDate: 'Sep 30', rep: 'Alex Morgan' },
  { id: 'D-106', title: 'Summit Digital Operations OS', company: 'Summit Digital', amount: 22000, probability: 70, closeDate: 'Sep 18', rep: 'Priya Sharma' },
  { id: 'D-104', title: 'NexGen Cloud ERP Suite', company: 'NexGen Systems', amount: 15000, probability: 50, closeDate: 'Sep 22', rep: 'Alex Morgan' },
];

export function CrmDashboardView() {
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('quarter');
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const totalWonRevenue = 298500;
  const totalOpenPipeline = 272000;
  const weightedPipeline = 168400;
  const teamQuota = 360000;
  const teamAttainment = Math.round((totalWonRevenue / teamQuota) * 100);

  return (
    <div className="space-y-6">
      <CrmAnnouncer message={announcement} />

      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
        totalPipelineValue={`$${totalOpenPipeline.toLocaleString()}`}
        activeDealsCount={11}
      />

      {/* ── Dashboard Executive Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#20211F] via-[#2D2E2B] to-[#20211F] text-white p-6 rounded-2xl shadow-md border border-black/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent text-white">
              Executive Cockpit
            </span>
            <span className="text-xs text-neutral-300 font-medium">Q3 Revenue Pacing</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Revenue Command Center
          </h2>
          <p className="text-xs text-neutral-300 mt-0.5 max-w-xl">
            Live telemetry on quota pacing, closing velocity, rep attainment, and strategic opportunity health.
          </p>
        </div>

        {/* Time Period Selector */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl backdrop-blur-xs text-xs font-semibold self-start sm:self-auto">
          {(['month', 'quarter', 'year'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setPeriod(p);
                setAnnouncement(`Viewing ${p} revenue metrics`);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                period === p
                  ? 'bg-white text-ink shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {p === 'month' ? 'This Month' : p === 'quarter' ? 'Q3 Pacing' : 'Full Year 2026'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Key Financial KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Closed Won Revenue */}
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-5 border border-border dark:border-[#2E302A] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-[#A0A29C]">
              Closed Won Revenue
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
              +{teamAttainment}% Quota
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-[#1F7A4D] dark:text-emerald-400">
            ${totalWonRevenue.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] text-ink-muted dark:text-[#A0A29C] pt-1 border-t border-border/40 dark:border-[#2E302A]">
            <span>Target: ${teamQuota.toLocaleString()}</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">13 Deals Won</span>
          </div>
        </div>

        {/* Total Active Pipeline */}
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-5 border border-border dark:border-[#2E302A] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-[#A0A29C]">
              Active Pipeline
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
              11 Deals
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-ink dark:text-[#F7F6F3]">
            ${totalOpenPipeline.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] text-ink-muted dark:text-[#A0A29C] pt-1 border-t border-border/40 dark:border-[#2E302A]">
            <span>Weighted: <strong className="text-ink dark:text-[#F7F6F3]">${weightedPipeline.toLocaleString()}</strong></span>
            <span>68% Win Rate</span>
          </div>
        </div>

        {/* Avg Sales Velocity */}
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-5 border border-border dark:border-[#2E302A] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-[#A0A29C]">
              Sales Cycle Velocity
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
              High Speed
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-accent">
            19.4 Days
          </div>
          <div className="flex items-center justify-between text-[11px] text-ink-muted dark:text-[#A0A29C] pt-1 border-t border-border/40 dark:border-[#2E302A]">
            <span>Avg Deal: <strong className="text-ink dark:text-[#F7F6F3]">$24,700</strong></span>
            <span>-3.2d vs Last Qtr</span>
          </div>
        </div>

        {/* Stalled / Rotting Alert */}
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-5 border border-border dark:border-[#2E302A] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-[#A0A29C]">
              Pipeline Health
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50">
              Action Needed
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-amber-800 dark:text-amber-400">
            1 Stalled Deal
          </div>
          <div className="flex items-center justify-between text-[11px] text-ink-muted dark:text-[#A0A29C] pt-1 border-t border-border/40 dark:border-[#2E302A]">
            <span>DataFlow Sync (8d)</span>
            <Link href="/crm" className="font-bold text-accent hover:underline">
              Review Pipeline →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Body: Spotlight & Leaderboard ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: High-Value Deal Spotlight (2 cols on large) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Spotlight Deals */}
          <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-5 border border-border dark:border-[#2E302A] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60 dark:border-[#2E302A]">
              <div>
                <h3 className="text-sm font-bold text-ink dark:text-[#F7F6F3]">
                  High-Value Opportunity Spotlight (&gt;$15,000)
                </h3>
                <p className="text-[11px] text-ink-muted dark:text-[#A0A29C]">
                  Deals with projected close this quarter requiring executive sponsorship
                </p>
              </div>
              <Link
                href="/crm"
                className="text-xs font-bold text-accent hover:underline"
              >
                View Pipeline Board →
              </Link>
            </div>

            <div className="space-y-3">
              {highValueSpotlight.map((deal) => (
                <div
                  key={deal.id}
                  className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border/80 dark:border-[#2E302A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-[#252722] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink dark:text-[#F7F6F3] text-xs">{deal.title}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-accent/10 text-accent border border-accent/20">
                        {deal.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-ink-muted dark:text-[#A0A29C]">
                      <span>Owner: <strong>{deal.rep}</strong></span>
                      <span>Target Close: <strong>{deal.closeDate}</strong></span>
                      <span>Prob: <strong>{deal.probability}%</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="font-mono font-black text-sm text-ink dark:text-[#F7F6F3]">
                        ${deal.amount.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        Weighted: ${Math.round((deal.amount * deal.probability) / 100).toLocaleString()}
                      </span>
                    </div>
                    <Link
                      href="/crm"
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#20211F] text-white hover:bg-accent transition-colors shadow-2xs whitespace-nowrap"
                    >
                      Advance →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Funnel Breakdown */}
          <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-5 border border-border dark:border-[#2E302A] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60 dark:border-[#2E302A]">
              <h3 className="text-sm font-bold text-ink dark:text-[#F7F6F3]">
                Sales Pipeline Conversion Funnel
              </h3>
              <span className="text-xs text-ink-muted dark:text-[#A0A29C]">Cumulative Stage Progression</span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2E302A] space-y-1">
                <span className="text-[10px] font-bold uppercase text-ink-muted dark:text-[#A0A29C]">1. Inbound Leads</span>
                <div className="text-lg font-black font-mono text-ink dark:text-[#F7F6F3]">48</div>
                <span className="text-[10px] text-ink-muted dark:text-[#A0A29C]">100% Volume</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2E302A] space-y-1">
                <span className="text-[10px] font-bold uppercase text-ink-muted dark:text-[#A0A29C]">2. Qualified</span>
                <div className="text-lg font-black font-mono text-blue-700 dark:text-blue-400">32</div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">66.7% pass</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2E302A] space-y-1">
                <span className="text-[10px] font-bold uppercase text-ink-muted dark:text-[#A0A29C]">3. Proposal</span>
                <div className="text-lg font-black font-mono text-amber-700 dark:text-amber-400">21</div>
                <span className="text-[10px] text-ink-muted dark:text-[#A0A29C]">65.6% pass</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2E302A] space-y-1">
                <span className="text-[10px] font-bold uppercase text-ink-muted dark:text-[#A0A29C]">4. Negotiation</span>
                <div className="text-lg font-black font-mono text-accent">16</div>
                <span className="text-[10px] text-ink-muted dark:text-[#A0A29C]">76.2% pass</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-300">5. Closed Won</span>
                <div className="text-lg font-black font-mono text-emerald-800 dark:text-emerald-300">13</div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">81.3% win</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sales Rep Leaderboard & Recent Activity Feed */}
        <div className="space-y-6">
          {/* Rep Leaderboard */}
          <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-5 border border-border dark:border-[#2E302A] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60 dark:border-[#2E302A]">
              <h3 className="text-sm font-bold text-ink dark:text-[#F7F6F3]">Sales Rep Leaderboard</h3>
              <span className="text-[10px] font-bold uppercase text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                Top Earners
              </span>
            </div>

            <div className="space-y-3">
              {leaderboardData.map((rep, idx) => (
                <div
                  key={rep.id}
                  className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border/80 dark:border-[#2E302A] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#20211F] dark:bg-white text-white dark:text-[#20211F] flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-xs text-ink dark:text-[#F7F6F3]">{rep.name}</div>
                        <div className="text-[10px] text-ink-muted dark:text-[#A0A29C]">{rep.role}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-xs text-[#1F7A4D] dark:text-emerald-400">
                        ${rep.wonRevenue.toLocaleString()}
                      </div>
                      <span className="text-[10px] font-semibold text-ink-muted dark:text-[#A0A29C]">
                        {rep.attainmentPercent}% Quota
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(rep.attainmentPercent, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Activity & Telemetry Stream */}
          <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-5 border border-border dark:border-[#2E302A] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60 dark:border-[#2E302A]">
              <h3 className="text-sm font-bold text-ink dark:text-[#F7F6F3]">Live Activity Feed</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3 text-xs">
              {recentFeed.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5 pb-2.5 border-b border-border/40 dark:border-[#2E302A] last:border-b-0">
                  <span className="text-[10px] text-ink-muted dark:text-[#A0A29C] font-mono shrink-0 mt-0.5">
                    {item.time}
                  </span>
                  <p className="text-ink dark:text-[#F7F6F3] text-[11px] leading-snug">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewDealModal
        isOpen={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSubmit={() => setAnnouncement('Deal successfully created')}
      />

      <NewLeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSubmit={() => setAnnouncement('Lead captured')}
      />
    </div>
  );
}
