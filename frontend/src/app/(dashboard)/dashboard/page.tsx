'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';

const platformStats = [
  {
    label: 'Active Organizations',
    value: '148',
    change: '+14 MoM',
    trend: 'up',
    subtext: '6 pending onboarding • 2 enterprise trials',
    sparkline: [110, 118, 124, 130, 134, 139, 142, 148],
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
      </svg>
    ),
  },
  {
    label: 'Platform MRR',
    value: '$184,250',
    change: '+8.4% MRR',
    trend: 'up',
    subtext: '1.18% net churn • 3 failed retries ($4.2K)',
    sparkline: [142, 148, 155, 160, 168, 172, 179, 184],
    icon: (
      <svg className="w-5 h-5 text-[#1F7A4D]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    label: 'System SLA & Sync',
    value: '99.98%',
    change: 'All Nominal',
    trend: 'up',
    subtext: '14ms p99 latency • 6 clusters healthy',
    sparkline: [99, 99, 100, 99, 100, 100, 99, 100],
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
  {
    label: 'Open Support Tickets',
    value: '14',
    change: '2 Urgent SLA',
    trend: 'down',
    subtext: '18m avg first response • 8 resolved today',
    sparkline: [18, 16, 21, 19, 15, 17, 13, 14],
    icon: (
      <svg className="w-5 h-5 text-[#B8790A]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
      </svg>
    ),
  },
];

const platformMonthlyGrowth = [
  { month: 'Apr', mrr: 142, tenants: 110, churn: 1.4 },
  { month: 'May', mrr: 150, tenants: 118, churn: 1.1 },
  { month: 'Jun', mrr: 159, tenants: 126, churn: 0.9 },
  { month: 'Jul', mrr: 168, tenants: 134, churn: 1.2 },
  { month: 'Aug', mrr: 176, tenants: 141, churn: 1.0 },
  { month: 'Sep', mrr: 184, tenants: 148, churn: 1.18 },
];

const platformEvents = [
  { action: 'New tenant provisioned', entity: 'Apex Health Solutions (Enterprise Plan)', time: '3 min ago', type: 'Tenant', tag: 'Live' },
  { action: 'Annual plan renewal billed', entity: 'Finova Global Corp ($28,800/yr)', time: '14 min ago', type: 'Billing', tag: 'Paid' },
  { action: 'Kafka sync schema verified', entity: 'Warehouse inventory event stream (11ms)', time: '42 min ago', type: 'System', tag: 'Synced' },
  { action: 'Failed payment retry scheduled', entity: 'Starlight Retail (INV-2026-902, $1,400)', time: '1 hour ago', type: 'Billing', tag: 'Retry 2' },
  { action: 'Feature flag enabled', entity: 'AI Auto-Reconciliation → 18 Pro Tenants', time: '2 hours ago', type: 'Flags', tag: 'Rollout' },
  { action: 'Cluster node auto-scaled', entity: 'us-east-worker-04 provisioned (+8 CPU / 32GB)', time: '4 hours ago', type: 'Infra', tag: 'Scaled' },
];

const moduleAdoption = [
  {
    name: 'Accounting & Ledger',
    code: 'accounting',
    adoption: '91%',
    activeTenants: 135,
    status: 'healthy',
    sync: '99.9% In-Sync',
    errorRate: '< 0.01%',
    latency: '11ms',
  },
  {
    name: 'CRM & Pipeline',
    code: 'crm',
    adoption: '84%',
    activeTenants: 124,
    status: 'healthy',
    sync: 'Real-time',
    errorRate: '0.02%',
    latency: '14ms',
  },
  {
    name: 'Sales & Invoicing',
    code: 'sales',
    adoption: '78%',
    activeTenants: 115,
    status: 'healthy',
    sync: 'Connected',
    errorRate: '0.01%',
    latency: '9ms',
  },
  {
    name: 'Inventory & Stock',
    code: 'inventory',
    adoption: '62%',
    activeTenants: 92,
    status: 'healthy',
    sync: 'Event Sourced',
    errorRate: '0.03%',
    latency: '16ms',
  },
  {
    name: 'Projects & Tasks',
    code: 'projects',
    adoption: '58%',
    activeTenants: 86,
    status: 'warning',
    sync: 'Queue Backlog',
    errorRate: '0.12%',
    latency: '48ms',
  },
  {
    name: 'Human Resources',
    code: 'hr',
    adoption: '45%',
    activeTenants: 67,
    status: 'healthy',
    sync: 'Batch Synced',
    errorRate: '0.01%',
    latency: '12ms',
  },
];

export default function PlatformDashboardPage() {
  const [metricView, setMetricView] = useState<'mrr' | 'tenants'>('mrr');

  return (
    <div className="animate-fade-in space-y-7">
      {/* ─── Hero Welcome Bar (Artisan Paper & Rust) ─────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#FAF9F5] to-[#FAF4F2] border border-[#EBD2CB] p-6 sm:p-7 shadow-xs">
        {/* Subtle geometric dot grid & paper ledger accents */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(#A8462F_1px,transparent_1px)] [background-size:18px_18px] opacity-15 pointer-events-none" />
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#FAF4F2] text-accent border border-[#EBD2CB] flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A4D] animate-pulse inline-block" />
                Platform Supervision Core
              </span>
              <span className="text-xs text-ink-muted font-mono">US-East • Cluster v2.4</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink tracking-tight font-sans">
              Platform <span className="font-serif italic font-normal text-accent">Supervision</span> Console
            </h1>

            <p className="text-xs sm:text-sm text-ink-muted max-w-2xl font-normal leading-relaxed">
              Supervising <span className="font-mono font-semibold text-ink px-1.5 py-0.5 rounded bg-white border border-[#E6E3DC] shadow-xs">148</span> active tenant organizations across <span className="font-mono font-semibold text-ink px-1.5 py-0.5 rounded bg-white border border-[#E6E3DC] shadow-xs">6</span> microservice clusters with <span className="font-semibold text-[#1F7A4D] font-mono">99.98%</span> platform SLA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/system-health"
              className="btn-secondary text-xs py-2.5 px-4 font-semibold shadow-xs"
            >
              <svg className="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
              Cluster Health
            </Link>
            <Link
              href="/services"
              className="btn-primary text-xs py-2.5 px-4 font-semibold shadow-xs bg-gradient-to-r from-accent to-[#853526] hover:from-[#853526] hover:to-[#6F2E22] border border-white/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              Service Registry
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Platform Stat Cards with Sparklines ─────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((stat, idx) => (
          <div
            key={stat.label}
            className="card p-5 bg-white border border-[#E6E3DC] hover:border-[#D5D2CA] hover:shadow-card-hover group relative overflow-hidden transition-all duration-200"
          >
            {/* Top hairline rust accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-[#B7624C] transition-all" />

            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#FAF9F5] border border-[#E6E3DC] group-hover:border-[#EBD2CB] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                {stat.icon}
              </div>
              <span className={`badge ${
                stat.trend === 'up'
                  ? 'badge-success'
                  : 'badge-warning'
              }`}>
                {stat.change}
              </span>
            </div>

            <div className="mt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                {stat.label}
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-ink mt-0.5 tracking-tight">
                {stat.value}
              </div>
              <p className="text-[11px] text-ink-muted mt-1 truncate">{stat.subtext}</p>
            </div>

            {/* Sparkline Visual SVG */}
            <div className="mt-3 pt-2 border-t border-border/50">
              <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                <defs>
                  <linearGradient id={`grad-stat-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#A8462F" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#A8462F" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 30 L 0 ${30 - (stat.sparkline[0] ?? 0) * 0.16} Q 25 ${30 - (stat.sparkline[2] ?? 0) * 0.16} 50 ${30 - (stat.sparkline[4] ?? 0) * 0.16} T 100 ${30 - (stat.sparkline[7] ?? 0) * 0.16} L 100 30 Z`}
                  fill={`url(#grad-stat-${idx})`}
                />
                <path
                  d={`M 0 ${30 - (stat.sparkline[0] ?? 0) * 0.16} Q 25 ${30 - (stat.sparkline[2] ?? 0) * 0.16} 50 ${30 - (stat.sparkline[4] ?? 0) * 0.16} T 100 ${30 - (stat.sparkline[7] ?? 0) * 0.16}`}
                  fill="none"
                  stroke="#A8462F"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Middle Section: MRR / Tenant Cohort Velocity ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 bg-white border border-[#E6E3DC] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-border gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-ink font-sans">
                  {metricView === 'mrr' ? 'Platform MRR Velocity' : 'Active Tenant Cohort Count'}
                </h2>
                <span className="badge badge-success font-mono font-bold text-[11px]">
                  +$34.2K Net Q3 Addition
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                Trailing 6-month cross-tenant revenue expansion vs churn rate
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-[#FAF9F5] border border-border rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setMetricView('mrr')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  metricView === 'mrr'
                    ? 'bg-white shadow-xs text-accent border border-[#EBD2CB]'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                MRR ($K)
              </button>
              <button
                type="button"
                onClick={() => setMetricView('tenants')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  metricView === 'tenants'
                    ? 'bg-white shadow-xs text-accent border border-[#EBD2CB]'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Tenant Count
              </button>
            </div>
          </div>

          {/* Visualization Bars (Paper & Rust Palette) */}
          <div className="mt-6 pt-2">
            <div className="h-56 flex items-end justify-between gap-3 px-2">
              {platformMonthlyGrowth.map((d) => {
                const primaryVal = metricView === 'mrr' ? d.mrr : d.tenants;
                const maxVal = metricView === 'mrr' ? 200 : 160;
                const heightPct = Math.round((primaryVal / maxVal) * 100);
                const churnHeightPct = Math.round((d.churn / 3) * 35);

                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-44">
                      {/* Main Metric Bar */}
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full max-w-[32px] bg-gradient-to-t from-[#853526] via-[#A8462F] to-[#C88775] rounded-t-md transition-all duration-300 group-hover:brightness-110 shadow-xs relative"
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white bg-ink px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none z-10">
                          {metricView === 'mrr' ? `$${d.mrr}K` : `${d.tenants} Orgs`}
                        </span>
                      </div>
                      {/* Churn Reference Bar */}
                      <div
                        style={{ height: `${churnHeightPct}%` }}
                        className="w-full max-w-[14px] bg-[#E6E3DC] hover:bg-[#D5D2CA] rounded-t-md transition-all duration-300 relative"
                        title={`Churn: ${d.churn}%`}
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-ink bg-white border border-border px-1.5 py-0.5 rounded shadow whitespace-nowrap pointer-events-none z-10">
                          {d.churn}%
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-ink-muted group-hover:text-ink transition-colors font-mono">
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend & Telemetry Note */}
            <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between text-xs text-ink-muted">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-accent shadow-xs" />
                  <span className="font-semibold text-ink">
                    {metricView === 'mrr' ? 'Monthly Recurring Revenue' : 'Active Paid Tenants'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#E6E3DC]" />
                  <span className="font-medium">Net Churn Rate</span>
                </div>
              </div>
              <span className="font-mono text-[11px] text-ink-muted font-medium">
                P&amp;L Audited • Multi-Tenant Stripe Gateway
              </span>
            </div>
          </div>
        </div>

        {/* ─── Platform Capacity & Quick Actions ───────────── */}
        <div className="space-y-4">
          <div className="card p-5 bg-white border border-[#E6E3DC] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-ink">Platform Infrastructure Load</h3>
              <span className="badge badge-success text-[10px] font-mono">Optimal</span>
            </div>
            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-ink-muted font-medium">MongoDB Atlas Storage</span>
                  <span className="font-bold text-ink font-mono">840 GB / 2 TB (42%)</span>
                </div>
                <div className="w-full h-2 bg-[#FAF9F5] border border-border rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-ink-muted font-medium">Redis Cache Hit Ratio</span>
                  <span className="font-bold text-ink font-mono">97.4% (&gt;95% SLA)</span>
                </div>
                <div className="w-full h-2 bg-[#FAF9F5] border border-border rounded-full overflow-hidden">
                  <div className="h-full bg-[#1F7A4D] rounded-full" style={{ width: '97%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-ink-muted font-medium">Peak API Ingress</span>
                  <span className="font-bold text-ink font-mono">64.2K / 100K req/min</span>
                </div>
                <div className="w-full h-2 bg-[#FAF9F5] border border-border rounded-full overflow-hidden">
                  <div className="h-full bg-[#B8790A] rounded-full" style={{ width: '64%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5 bg-white border border-[#E6E3DC] shadow-xs">
            <h3 className="text-sm font-bold text-ink mb-3">Platform Admin Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/tenants"
                className="p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#FAF4F2] border border-[#E6E3DC] hover:border-[#EBD2CB] flex flex-col items-center text-center transition-all group"
              >
                <span className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent group-hover:scale-105 transition-transform mb-1.5 shadow-xs font-bold text-sm">
                  +
                </span>
                <span className="text-xs font-semibold text-ink">Provision Org</span>
                <span className="text-[10px] text-ink-muted">New Tenant</span>
              </Link>

              <Link
                href="/services"
                className="p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#FAF4F2] border border-[#E6E3DC] hover:border-[#EBD2CB] flex flex-col items-center text-center transition-all group"
              >
                <span className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent group-hover:scale-105 transition-transform mb-1.5 shadow-xs text-sm">
                  ⚙️
                </span>
                <span className="text-xs font-semibold text-ink">Services Hub</span>
                <span className="text-[10px] text-ink-muted">Tier Toggles</span>
              </Link>

              <Link
                href="/billing"
                className="p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#FAF4F2] border border-[#E6E3DC] hover:border-[#EBD2CB] flex flex-col items-center text-center transition-all group"
              >
                <span className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent group-hover:scale-105 transition-transform mb-1.5 shadow-xs text-sm">
                  💳
                </span>
                <span className="text-xs font-semibold text-ink">Billing Retries</span>
                <span className="text-[10px] text-ink-muted">3 Overdue</span>
              </Link>

              <Link
                href="/system-health"
                className="p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#FAF4F2] border border-[#E6E3DC] hover:border-[#EBD2CB] flex flex-col items-center text-center transition-all group"
              >
                <span className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent group-hover:scale-105 transition-transform mb-1.5 shadow-xs text-sm">
                  📊
                </span>
                <span className="text-xs font-semibold text-ink">Cluster Nodes</span>
                <span className="text-[10px] text-ink-muted">Telemetry</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Section: Module Usage Breakdown & Live Events ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Module Adoption Breakdown Across Tenants ──── */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-ink">Module Usage Breakdown Across Tenants</h2>
              <p className="text-xs text-ink-muted">Active provisioning and health metrics across all 148 tenant orgs</p>
            </div>
            <Link
              href="/services"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              Manage Services →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {moduleAdoption.map((mod) => (
              <div
                key={mod.code}
                className="card p-4.5 bg-white border border-[#E6E3DC] hover:border-[#EBD2CB] group transition-all duration-150"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-ink group-hover:text-accent transition-colors">
                    {mod.name}
                  </h3>
                  <StatusBadge
                    label={mod.status === 'warning' ? 'Lag Notice' : 'Operational'}
                    variant={mod.status === 'warning' ? 'warning' : 'success'}
                  />
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-muted">Tenant Adoption</span>
                    <span className="font-bold text-ink font-mono">{mod.adoption} ({mod.activeTenants} Orgs)</span>
                  </div>
                  <div className="w-full h-2 bg-[#FAF9F5] border border-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500 shadow-xs"
                      style={{ width: mod.adoption }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-ink-muted pt-2 border-t border-border/50">
                  <div className="flex justify-between">
                    <span>Sync Health</span>
                    <span className="font-semibold text-ink">{mod.sync}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Rate</span>
                    <span className="font-mono font-semibold text-ink">{mod.errorRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>p99 Latency</span>
                    <span className="font-mono font-semibold text-[#1F7A4D]">{mod.latency}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Live Platform Activity Stream (Paper Slip Ledger) ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-ink">Live Platform Audit Log</h2>
              <p className="text-xs text-ink-muted">Real-time tenant &amp; infrastructure stream</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-accent bg-[#FAF4F2] border border-[#EBD2CB] px-2 py-0.5 rounded shadow-xs">
              LIVE
            </span>
          </div>

          <div className="card bg-white border border-[#E6E3DC] divide-y divide-border/60 overflow-hidden shadow-xs">
            {platformEvents.map((event, i) => (
              <div key={i} className="p-3.5 hover:bg-[#FAF9F5] transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#FAF4F2] text-accent border border-[#EBD2CB]">
                        {event.type}
                      </span>
                      <span className="text-[10px] text-ink-muted font-mono">{event.time}</span>
                    </div>
                    <p className="text-xs font-semibold text-ink truncate">{event.action}</p>
                    <p className="text-[11px] text-ink-muted truncate font-mono mt-0.5">{event.entity}</p>
                  </div>
                  <span className="badge badge-neutral text-[10px] flex-shrink-0 font-mono">
                    {event.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
