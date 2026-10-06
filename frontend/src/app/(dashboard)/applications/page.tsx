'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AppCard {
  id: string;
  name: string;
  category: 'Commercial' | 'Operations' | 'Finance' | 'Workforce';
  description: string;
  route: string;
  version: string;
  status: 'Active' | 'Live' | 'Syncing';
  metrics: { label: string; value: string };
  badgeColor: string;
  accentColor: string;
  icon: React.ReactNode;
  tags: string[];
}

const APPS: AppCard[] = [
  {
    id: 'crm',
    name: 'Customer Relationship (CRM)',
    category: 'Commercial',
    description: 'Visual multi-stage sales pipelines, deal scoring, lead lifecycle tracking, and 360-degree party contact sync.',
    route: '/crm',
    version: '1.2.0',
    status: 'Live',
    metrics: { label: 'Active Pipeline', value: '$240,000' },
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    accentColor: 'from-emerald-500 to-teal-600',
    icon: (
      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
    tags: ['Leads', 'Pipeline', 'Kanban', 'Deals'],
  },
  {
    id: 'sales',
    name: 'Sales & Quotations',
    category: 'Commercial',
    description: 'Create multi-currency quotations, automate order fulfillment workflows, and monitor real-time booking revenue.',
    route: '/sales',
    version: '1.4.2',
    status: 'Live',
    metrics: { label: 'Monthly Revenue', value: '$68,200' },
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    accentColor: 'from-blue-500 to-indigo-600',
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6H2.25m0 0v1.5a.75.75 0 0 0 .75.75H3m0 0v1.5a.75.75 0 0 1-.75.75H2.25m0 0v1.5a.75.75 0 0 0 .75.75H3m18-6v-.75A.75.75 0 0 0 20.25 4.5H19.5m0 0v1.5a.75.75 0 0 1 .75.75h.75m0 0v1.5a.75.75 0 0 0-.75.75H19.5m0 0v1.5a.75.75 0 0 1 .75.75h.75m0 0v1.5a.75.75 0 0 0-.75.75H19.5M3.75 4.5h16.5M3.75 19.5h16.5M5.25 9h13.5m-13.5 3h13.5m-13.5 3h13.5" />
      </svg>
    ),
    tags: ['Quotations', 'Orders', 'Invoices', 'Fulfillment'],
  },
  {
    id: 'inventory',
    name: 'Inventory & Stock Control',
    category: 'Operations',
    description: 'Multi-location warehouse stock, automated reorder triggers, SKU tracking, and low-inventory telemetry alerts.',
    route: '/inventory',
    version: '1.1.0',
    status: 'Live',
    metrics: { label: 'Stock Valuation', value: '$512,000' },
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    accentColor: 'from-amber-500 to-orange-600',
    icon: (
      <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
    tags: ['Warehouses', 'SKUs', 'Reorder Triggers', 'Lots'],
  },
  {
    id: 'accounting',
    name: 'Accounting & Ledger',
    category: 'Finance',
    description: 'Automated double-entry bookkeeping, P&L reporting, customer invoicing, and bank reconciliation engine.',
    route: '/accounting',
    version: '2.0.1',
    status: 'Live',
    metrics: { label: 'Net Profit (Q3)', value: '$88,000' },
    badgeColor: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
    accentColor: 'from-violet-500 to-purple-600',
    icon: (
      <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    tags: ['Double-Entry', 'P&L', 'Reconciliation', 'Tax'],
  },
  {
    id: 'hr',
    name: 'Human Resources & People',
    category: 'Workforce',
    description: 'Employee organization hierarchy, department headcounts, leave approval workflows, and talent records.',
    route: '/hr',
    version: '1.0.8',
    status: 'Live',
    metrics: { label: 'Active Personnel', value: '34 Members' },
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    accentColor: 'from-rose-500 to-pink-600',
    icon: (
      <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    tags: ['Directory', 'Leave Requests', 'Departments', 'Payroll'],
  },
  {
    id: 'projects',
    name: 'Projects & Tasks',
    category: 'Operations',
    description: 'Sprint planning boards, task assignments, milestone delivery tracking, and client budget timesheets.',
    route: '/projects',
    version: '1.3.1',
    status: 'Live',
    metrics: { label: 'Active Sprints', value: '4 Projects' },
    badgeColor: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    accentColor: 'from-cyan-500 to-teal-600',
    icon: (
      <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
    tags: ['Kanban', 'Milestones', 'Timesheets', 'Budgets'],
  },
];

export default function ApplicationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Commercial', 'Operations', 'Finance', 'Workforce'];

  const filteredApps = APPS.filter((app) => {
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ─── Header & Platform Telemetry ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Unified Enterprise Suite
            </span>
            <span className="text-xs text-ink-muted font-mono">v2.4.0 Live</span>
          </div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight font-serif">
            Applications Workspace
          </h1>
          <p className="text-sm text-ink-muted mt-1 max-w-2xl">
            Access your active business modules. All applications share double-entry ledger state, multi-tenant RBAC, and real-time MongoDB syncing.
          </p>
        </div>

        {/* Quick Suite Telemetry */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-white border border-border shadow-xs flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-status-success animate-ping" />
            <div>
              <p className="text-[11px] font-bold text-ink uppercase tracking-wider">Cluster State</p>
              <p className="text-xs text-ink-muted font-mono">Nominal • 14ms</p>
            </div>
          </div>
          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            Switch Account
          </Link>
        </div>
      </div>

      {/* ─── Search and Category Filter Bar ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur rounded-xl border border-border overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-accent text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink hover:bg-black/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <div className="relative min-w-[260px]">
          <input
            type="text"
            placeholder="Search applications or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-border text-xs text-ink placeholder:text-ink-muted/60 focus:outline-hidden focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all shadow-2xs"
          />
          <svg className="w-4 h-4 text-ink-muted/70 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>

      {/* ─── Applications Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="group relative bg-white rounded-2xl border border-border/80 hover:border-accent/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Color Edge */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${app.accentColor}`} />

            <div className="p-6">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-border/60 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  {app.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${app.badgeColor}`}>
                    {app.status}
                  </span>
                  <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 px-1.5 py-0.5 rounded">
                    v{app.version}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-accent tracking-wider font-mono">
                  {app.category}
                </span>
                <h3 className="text-lg font-bold text-ink mt-0.5 group-hover:text-accent transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs text-ink-muted mt-2 line-clamp-2 leading-relaxed">
                  {app.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium text-ink-muted bg-[#FAF9F5] border border-border/60 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer with Metric & Launch Button */}
            <div className="p-5 bg-[#FAF9F5] border-t border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">
                  {app.metrics.label}
                </p>
                <p className="text-sm font-bold text-ink font-mono mt-0.5">
                  {app.metrics.value}
                </p>
              </div>

              <Link
                href={app.route}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 group-hover:bg-accent text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95"
              >
                <span>Launch App</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border">
          <p className="text-sm font-semibold text-ink">No applications match your filter</p>
          <p className="text-xs text-ink-muted mt-1">Try resetting the category filter or searching for a different term.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
