'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  Package,
  Landmark,
  Layers,
  FolderKanban,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const featureModules = [
  {
    icon: <Users className="w-6 h-6 text-orange-600" />,
    badge: 'CRM & Pipeline',
    title: 'Customer Intelligence & Visual Pipelines',
    desc: 'Centralize contacts, company hierarchies, visual deal stages, and automatic activity logs. Win deals faster with algorithmic lead scoring.',
    highlights: ['Multi-pipeline Kanban board', 'Lead decay & win probability', 'Custom field builder', 'Two-way email sync'],
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
    badge: 'Sales Orders',
    title: 'Quotation-to-Cash Automation',
    desc: 'Generate professional digital quotations, enforce discount validation rules, collect customer e-signatures, and auto-convert to sales orders.',
    highlights: ['Multi-currency price lists', 'Discount approval workflows', 'Printable PDF contracts', 'Embedded Stripe payment links'],
  },
  {
    icon: <Package className="w-6 h-6 text-blue-600" />,
    badge: 'Inventory & Stock',
    title: 'Multi-Warehouse Inventory Control',
    desc: 'Real-time stock valuation, serial/lot tracking, automated reorder points, and seamless transfer orders across physical warehouses.',
    highlights: ['FIFO & Weighted Average costing', 'Automated purchase requisitions', 'Barcode scanner support', 'Stock move audit trails'],
  },
  {
    icon: <Landmark className="w-6 h-6 text-purple-600" />,
    badge: 'Accounting',
    title: 'Double-Entry General Ledger & Invoicing',
    desc: 'Automated accounts receivable, bank feed reconciliation, multi-currency journal entries, and automated tax reporting for GST & VAT.',
    highlights: ['Automated balance sheet & P&L', 'Bank statement CSV parsing', 'Recurring subscription billing', 'Payment gateway webhooks'],
  },
  {
    icon: <Layers className="w-6 h-6 text-amber-600" />,
    badge: 'Human Resources',
    title: 'Employee Directory & Leave Tracking',
    desc: 'Manage staff profiles, departmental rosters, time-off approval flows, and payroll calculation records in full compliance.',
    highlights: ['Self-service leave requests', 'Working hours & holiday calendars', 'Role-based manager approvals', 'Salary slips generation'],
  },
  {
    icon: <FolderKanban className="w-6 h-6 text-teal-600" />,
    badge: 'Projects & Tasks',
    title: 'Project Portfolio & Timesheets',
    desc: 'Connect customer milestones directly to billable hours, project tasks, and final invoice generation without double entry.',
    highlights: ['Interactive Gantt & Kanban views', 'Billable time logging', 'Milestone budgets & tracking', 'Resource workload distribution'],
  },
];

export default function FeaturesPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modular Enterprise Engine</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-ink dark:text-white tracking-tight leading-tight">
            One platform. Every operational department.
          </h1>
          <p className="text-sm sm:text-base text-ink-muted dark:text-neutral-300 leading-relaxed">
            Eliminate fragmented software subscriptions. Bahi unifies CRM, Sales, Stock, Ledger, HR, and
            Projects on an interconnected real-time relational core.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 hover:opacity-95 transition-all"
            >
              Start Free 14-Day Trial
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-ink dark:text-white font-medium text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              View Plan Comparison
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureModules.map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-8 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-white/5">{item.icon}</div>
                  <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-neutral-500">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-xl text-ink dark:text-white">{item.title}</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {item.desc}
                </p>
                <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2">
                  {item.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 mt-6">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:opacity-80 transition-opacity"
                >
                  Explore in demo <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Architecture Callout */}
        <div className="mt-24 rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#14161C] to-[#0E0F12] text-white border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Tenant Row-Level Security</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Built on PostgreSQL & Next.js 15 for zero-latency operations
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Every query is cryptographically scoped to your tenant. Enjoy enterprise-grade backup redundancy,
              100% data portability, and custom domain mapping without operational friction.
            </p>
          </div>
          <Link
            href="/security"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-100 transition-colors"
          >
            Review Security Whitepaper
          </Link>
        </div>
      </div>
    </div>
  );
}
