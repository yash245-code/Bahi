'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  CreditCard,
  Package,
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const [isEmptyState, setIsEmptyState] = useState(false);

  const metrics = [
    { label: 'Monthly Recurring Revenue', value: '$24,850', change: '+12.4%', positive: true, icon: CreditCard },
    { label: 'Active Pipeline Deals', value: '42 Deals', change: '8 Closing This Wk', positive: true, icon: TrendingUp },
    { label: 'Total Enterprise Contacts', value: '1,420', change: '+85 New', positive: true, icon: Users },
    { label: 'Low Stock SKU Alerts', value: '3 Units', change: 'Reorder Needed', positive: false, icon: Package },
  ];

  const recentActivity = [
    { action: 'Quote Accepted', client: 'Apex Logistics Ltd.', amount: '$12,400', time: '14 mins ago', status: 'Approved' },
    { action: 'Invoice Paid (Stripe)', client: 'Zenith Global Dynamics', amount: '$4,800', time: '1 hr ago', status: 'Settled' },
    { action: 'New Deal In Pipeline', client: 'Hyperion Build Corp.', amount: '$29,000', time: '3 hrs ago', status: 'Proposal Sent' },
    { action: 'Stock Transfer Dispatched', client: 'Main Hub -> Warehouse East', amount: '240 SKUs', time: '5 hrs ago', status: 'In Transit' },
  ];

  if (isEmptyState) {
    return (
      <div className="py-20 max-w-xl mx-auto px-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-accent/10 text-accent flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-ink dark:text-white">Workspace Initialized</h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Your tenant workspace is ready. You have no recorded transactions, leads, or invoices yet.
            Get started by creating your first sales quote or importing contacts.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/sales/quotes"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20"
          >
            + Create First Quote
          </Link>
          <Link
            href="/crm/contacts"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold"
          >
            Import Contacts
          </Link>
        </div>
        <button
          onClick={() => setIsEmptyState(false)}
          className="text-[11px] text-neutral-400 underline block mx-auto mt-4"
        >
          Toggle Demo Data View
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-bold">
              Executive Overview
            </span>
            <span className="text-neutral-400">•</span>
            <span className="text-xs text-neutral-500 font-mono">Nexus Dynamics (Tenant Org)</span>
          </div>
          <h1 className="font-serif text-3xl font-black text-ink dark:text-white mt-1">
            Operations & Revenue Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsEmptyState(true)}
            className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-xs text-neutral-500 hover:text-ink dark:hover:text-white"
          >
            View Empty State
          </button>
          <Link
            href="/sales/quotes"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold shadow-md shadow-accent/20 hover:opacity-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Transaction</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl p-6 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-semibold text-neutral-400">
                  {m.label}
                </span>
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5 text-neutral-500">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <span className="font-serif font-black text-3xl text-ink dark:text-white">{m.value}</span>
                <p
                  className={`text-[11px] font-medium flex items-center gap-1 ${
                    m.positive ? 'text-emerald-500' : 'text-amber-500'
                  }`}
                >
                  {m.positive ? <TrendingUp className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  <span>{m.change}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Launchpad & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Operational Activity */}
        <div className="lg:col-span-2 rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
            <h3 className="font-serif font-bold text-lg text-ink dark:text-white">Recent Transactions</h3>
            <Link href="/accounting" className="text-xs text-accent font-semibold hover:underline">
              View All Invoices
            </Link>
          </div>

          <div className="divide-y divide-black/5 dark:divide-white/5">
            {recentActivity.map((act, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-ink dark:text-white">{act.action}</p>
                  <p className="text-[11px] text-neutral-400">{act.client}</p>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="font-mono font-bold text-ink dark:text-white">{act.amount}</span>
                  <div className="flex items-center gap-1.5 justify-end text-[10px] text-neutral-400">
                    <Clock className="w-3 h-3" />
                    <span>{act.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-lg text-ink dark:text-white">Quick Operations</h3>

          <div className="space-y-2.5">
            <Link
              href="/crm/deals"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-accent text-xs font-medium text-ink dark:text-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-accent" />
                <span>Move Deals on Kanban</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </Link>

            <Link
              href="/inventory"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-accent text-xs font-medium text-ink dark:text-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-accent" />
                <span>Log Warehouse Stock Move</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </Link>

            <Link
              href="/support"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-accent text-xs font-medium text-ink dark:text-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-accent" />
                <span>Submit Support Ticket</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </Link>

            <Link
              href="/billing"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-accent text-xs font-medium text-ink dark:text-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-accent" />
                <span>Manage Subscription & Plan</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200 text-xs space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Growth Plan Active
            </span>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Your next invoice will generate on Dec 1, 2026. 12 of 15 team seats utilized.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
