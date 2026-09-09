'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';

const stats = [
  {
    label: 'Total Revenue',
    value: '$124,500',
    change: '+14.2%',
    trend: 'up',
    subtext: 'vs last month ($109K)',
    sparkline: [40, 52, 60, 55, 78, 85, 95, 124],
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    label: 'Pipeline Value',
    value: '$174,000',
    change: '+8 deals',
    trend: 'up',
    subtext: '42 active leads across stages',
    sparkline: [20, 35, 45, 60, 58, 80, 110, 174],
    icon: (
      <svg className="w-5 h-5 text-[#1F7A4D]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
  {
    label: 'Pending Invoices',
    value: '$48,500',
    change: '2 Overdue',
    trend: 'down',
    subtext: '7 invoices awaiting payment',
    sparkline: [30, 45, 50, 40, 60, 55, 48, 48],
    icon: (
      <svg className="w-5 h-5 text-[#B8790A]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
    ),
  },
  {
    label: 'Sprint Velocity',
    value: '94.2%',
    change: 'On Track',
    trend: 'up',
    subtext: '8 active projects, 67 tasks',
    sparkline: [80, 84, 88, 86, 90, 92, 91, 94],
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
];

const revenueMonthly = [
  { month: 'Apr', revenue: 78, expense: 42 },
  { month: 'May', revenue: 86, expense: 46 },
  { month: 'Jun', revenue: 95, expense: 50 },
  { month: 'Jul', revenue: 104, expense: 55 },
  { month: 'Aug', revenue: 112, expense: 58 },
  { month: 'Sep', revenue: 124, expense: 62 },
];

const recentActivities = [
  { action: 'New high-value lead qualified', entity: 'NexGen Systems ($15,000)', time: '4 min ago', module: 'CRM', tag: 'Hot Lead' },
  { action: 'Sales proposal confirmed', entity: 'QT-00012 → SO-00009 ($22,000)', time: '18 min ago', module: 'Sales', tag: 'Won' },
  { action: 'Wire transfer payment reconciled', entity: 'INV-00048 — Summit Digital ($22,000)', time: '1 hour ago', module: 'Accounting', tag: 'Paid' },
  { action: 'Warehouse stock receipt checked', entity: '500 units Wireless Keyboard Pro — WH-MAIN', time: '3 hours ago', module: 'Inventory', tag: 'Received' },
  { action: 'Annual leave approved', entity: 'Sarah Chen (Finance) — 6 Days', time: '4 hours ago', module: 'HR', tag: 'Approved' },
  { action: 'Sprint milestone deliverable completed', entity: 'Mobile App MVP — Push Notification Service', time: '6 hours ago', module: 'Projects', tag: 'Sprint 12' },
];

const moduleHealth = [
  { name: 'CRM', path: '/crm', status: 'active' as const, leads: 42, opportunities: 18, rate: '34% Win Rate' },
  { name: 'Sales', path: '/sales', status: 'active' as const, orders: 23, revenue: '$68.2K', rate: '< 5m Turnaround' },
  { name: 'Inventory', path: '/inventory', status: 'active' as const, products: 156, lowStock: 3, rate: '99.9% In-Stock' },
  { name: 'Accounting', path: '/accounting', status: 'warning' as const, unpaid: 7, overdue: 2, rate: 'DSO: 18 Days' },
  { name: 'HR', path: '/hr', status: 'active' as const, employees: 34, pendingLeave: 4, rate: '100% Attendance' },
  { name: 'Projects', path: '/projects', status: 'active' as const, active: 8, tasks: 67, rate: '94% On-Time' },
];

export default function DashboardPage() {
  const [chartMetric, setChartMetric] = useState<'revenue' | 'profit'>('revenue');

  return (
    <div className="animate-fade-in space-y-7">
      {/* ─── Hero Welcome Bar ────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#FAF9F5] to-[#FAF4F2] border border-border p-6 shadow-sm">
        {/* Subtle geometric line pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#A8462F_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF4F2] text-accent border border-[#EBD2CB]">
                Operations Overview
              </span>
              <span className="text-xs text-ink-muted">Tuesday, Sep 8, 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              Good afternoon, Yash.
            </h1>
            <p className="text-sm text-ink-muted max-w-2xl font-normal">
              Acme Corp is operating at <span className="font-semibold text-[#1F7A4D]">83% of monthly revenue quota</span> with healthy cashflow and all 6 modules synchronized.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/accounting"
              className="btn-secondary text-xs py-2.5"
            >
              <svg className="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export Report
            </Link>
            <Link
              href="/crm"
              className="btn-primary text-xs py-2.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Opportunity
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Stat Cards with Sparklines ──────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card group">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#FAF9F5] border border-border flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                {stat.icon}
              </div>
              <span className={`badge ${
                stat.trend === 'up' ? 'badge-success' : 'badge-warning'
              }`}>
                {stat.change}
              </span>
            </div>

            <div className="mt-2">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-value text-2xl sm:text-3xl mt-0.5">{stat.value}</div>
              <p className="text-[11px] text-ink-muted mt-0.5">{stat.subtext}</p>
            </div>

            {/* Sparkline Visual SVG */}
            <div className="mt-3 pt-2 border-t border-border/50">
              <svg className="w-full h-7 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                <defs>
                  <linearGradient id={`grad-${stat.label.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#A8462F" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#A8462F" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 ${30 - (stat.sparkline[0] ?? 0) * 0.2} Q 25 ${30 - (stat.sparkline[2] ?? 0) * 0.2} 50 ${30 - (stat.sparkline[4] ?? 0) * 0.2} T 100 ${30 - (stat.sparkline[7] ?? 0) * 0.2}`}
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

      {/* ─── Middle Section: Financial Cashflow & Velocity Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-border gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-ink">Cashflow & Revenue Velocity</h2>
                <span className="badge badge-success">+$28.5K Net Margin</span>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">Monthly billing vs operational expenditures</p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-[#FAF9F5] border border-border rounded-lg text-xs">
              <button
                onClick={() => setChartMetric('revenue')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  chartMetric === 'revenue' ? 'bg-white shadow-xs text-accent' : 'text-ink-muted hover:text-ink'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setChartMetric('profit')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  chartMetric === 'profit' ? 'bg-white shadow-xs text-accent' : 'text-ink-muted hover:text-ink'
                }`}
              >
                Net Profit
              </button>
            </div>
          </div>

          {/* Custom SVG Bar / Area Visualization */}
          <div className="mt-6 pt-2">
            <div className="h-56 flex items-end justify-between gap-3 px-2">
              {revenueMonthly.map((d) => {
                const heightPct = Math.round((d.revenue / 140) * 100);
                const expensePct = Math.round((d.expense / 140) * 100);

                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-44">
                      {/* Revenue Bar */}
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full max-w-[28px] bg-gradient-to-t from-[#853526] to-[#A8462F] rounded-t-md transition-all duration-300 group-hover:brightness-110 relative"
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-ink px-1.5 py-0.5 rounded shadow whitespace-nowrap pointer-events-none">
                          ${d.revenue}K
                        </span>
                      </div>
                      {/* Expense Bar */}
                      <div
                        style={{ height: `${expensePct}%` }}
                        className="w-full max-w-[28px] bg-[#E6E3DC] hover:bg-[#D5D2CA] rounded-t-md transition-all duration-300 relative"
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-ink bg-white border border-border px-1.5 py-0.5 rounded shadow whitespace-nowrap pointer-events-none">
                          ${d.expense}K
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-ink-muted group-hover:text-ink transition-colors">
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend & Summary */}
            <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between text-xs text-ink-muted">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-accent" />
                  <span className="font-medium text-ink">Gross Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#E6E3DC]" />
                  <span className="font-medium">Operating Expenses</span>
                </div>
              </div>
              <span className="font-mono text-[11px] text-ink-muted font-medium">
                P&L Audited • GAAP Ready
              </span>
            </div>
          </div>
        </div>

        {/* ─── Quick Actions & Target Progress ─────────── */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-bold text-ink mb-3">Fiscal Q3 Milestone</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-muted">Quarterly Goal ($150K)</span>
                  <span className="font-bold text-ink">$124.5K (83%)</span>
                </div>
                <div className="w-full h-2.5 bg-[#FAF9F5] border border-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#A8462F] to-[#1F7A4D] rounded-full" style={{ width: '83%' }} />
                </div>
              </div>
              <p className="text-[11px] text-ink-muted">
                Need <span className="font-semibold text-ink">$25.5K</span> in confirmed invoices to exceed target before Sep 30.
              </p>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold text-ink mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/crm"
                className="p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#FAF4F2] border border-border hover:border-[#EBD2CB] flex flex-col items-center text-center transition-all group"
              >
                <span className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent group-hover:scale-105 transition-transform mb-1.5 shadow-xs">
                  +
                </span>
                <span className="text-xs font-semibold text-ink">Add Lead</span>
                <span className="text-[10px] text-ink-muted">CRM Funnel</span>
              </Link>

              <Link
                href="/sales"
                className="p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#FAF4F2] border border-border hover:border-[#EBD2CB] flex flex-col items-center text-center transition-all group"
              >
                <span className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent group-hover:scale-105 transition-transform mb-1.5 shadow-xs">
                  QT
                </span>
                <span className="text-xs font-semibold text-ink">New Quote</span>
                <span className="text-[10px] text-ink-muted">Sales Order</span>
              </Link>

              <Link
                href="/accounting"
                className="p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#FAF4F2] border border-border hover:border-[#EBD2CB] flex flex-col items-center text-center transition-all group"
              >
                <span className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent group-hover:scale-105 transition-transform mb-1.5 shadow-xs">
                  $
                </span>
                <span className="text-xs font-semibold text-ink">Invoice</span>
                <span className="text-[10px] text-ink-muted">Accounting</span>
              </Link>

              <Link
                href="/inventory"
                className="p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#FAF4F2] border border-border hover:border-[#EBD2CB] flex flex-col items-center text-center transition-all group"
              >
                <span className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent group-hover:scale-105 transition-transform mb-1.5 shadow-xs">
                  📦
                </span>
                <span className="text-xs font-semibold text-ink">Stock Move</span>
                <span className="text-[10px] text-ink-muted">Warehouse</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Two Column Layout: Module Status & Activity ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Module Health Grid ─────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-ink">Module Operational Status</h2>
            <span className="text-xs text-ink-muted">6 Connected Services</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {moduleHealth.map((mod) => (
              <Link
                key={mod.name}
                href={mod.path}
                className="card p-4 hover:border-accent/50 group cursor-pointer block"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-ink group-hover:text-accent transition-colors flex items-center gap-1.5">
                    {mod.name}
                    <span className="text-xs text-ink-muted group-hover:translate-x-0.5 transition-transform">→</span>
                  </h3>
                  <StatusBadge
                    label={mod.status === 'warning' ? 'Attention' : 'Healthy'}
                    variant={mod.status === 'warning' ? 'warning' : 'success'}
                  />
                </div>
                <div className="space-y-1.5 text-xs text-ink-muted">
                  {Object.entries(mod)
                    .filter(([k]) => !['name', 'status', 'path'].includes(k))
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between py-0.5 border-b border-border/40 last:border-0">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-semibold text-ink">{value}</span>
                      </div>
                    ))}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── Recent Activity Feed ───────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-ink">Live Activity Ledger</h2>
            <span className="text-xs font-mono text-accent">Real-time</span>
          </div>

          <div className="card divide-y divide-border overflow-hidden">
            {recentActivities.map((activity, i) => (
              <div key={i} className="p-3.5 hover:bg-[#FAF9F5] transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#FAF4F2] text-accent border border-[#EBD2CB]">
                        {activity.module}
                      </span>
                      <span className="text-[10px] text-ink-muted">{activity.time}</span>
                    </div>
                    <p className="text-xs font-semibold text-ink truncate">{activity.action}</p>
                    <p className="text-[11px] text-ink-muted truncate">{activity.entity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
