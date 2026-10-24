'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface Subscription {
  id: string;
  customer: string;
  plan: string;
  billingCycle: 'Monthly' | 'Annual';
  mrr: number;
  renewalDate: string;
  status: 'Active' | 'Trial' | 'Past Due';
}

const initialSubs: Subscription[] = [
  { id: 'SUB-801', customer: 'Green Garden Cafe', plan: 'Growth Tier', billingCycle: 'Monthly', mrr: 149.00, renewalDate: 'Nov 14, 2026', status: 'Active' },
  { id: 'SUB-802', customer: 'Apex Logistics Hub', plan: 'Enterprise Suite', billingCycle: 'Annual', mrr: 890.00, renewalDate: 'Jan 15, 2027', status: 'Active' },
  { id: 'SUB-803', customer: 'Nordic Warehouses', plan: 'Enterprise Custom', billingCycle: 'Monthly', mrr: 1250.00, renewalDate: 'Nov 02, 2026', status: 'Active' },
  { id: 'SUB-804', customer: 'Summit Medical Clinic', plan: 'Growth Tier', billingCycle: 'Monthly', mrr: 299.00, renewalDate: 'Oct 30, 2026', status: 'Past Due' },
  { id: 'SUB-805', customer: 'Highland Residency', plan: 'Starter Pack', billingCycle: 'Monthly', mrr: 89.00, renewalDate: 'Nov 20, 2026', status: 'Trial' },
];

export default function SubscriptionsPage() {
  const [subs] = useState<Subscription[]>(initialSubs);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = subs.filter((s) => {
    const matchFilter = filter === 'all' || s.status.toLowerCase() === filter.toLowerCase();
    const matchSearch = s.customer.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E11D48]/15 text-[#E11D48] border border-[#E11D48]/30 font-mono">
              Subscriptions &amp; Recurring Billing
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              Active Module
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Recurring Revenue &amp; Contracts
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Automate recurring billing schedules, manage subscription tiers, track MRR growth, and handle renewals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/applications"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            ← Apps Suite
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Monthly Recurring (MRR)</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">$2,677.00</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+12.4% vs last month</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Active Subscriptions</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">3</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">0% churn rate</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Annual Run Rate (ARR)</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">$32,124.00</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Contracted renewals</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Past Due</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">1</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Dunning notice triggered</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border dark:border-[#2A2B27] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['all', 'active', 'trial', 'past due'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                  filter === st
                    ? 'bg-[#E11D48]/15 text-[#E11D48] border border-[#E11D48]/30 font-bold'
                    : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-4">Subscription ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Cycle</th>
                <th className="py-3 px-4">Renewal Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">MRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#E11D48]">{s.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-ink dark:text-white">{s.customer}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-300 font-medium">{s.plan}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{s.billingCycle}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{s.renewalDate}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      s.status === 'Trial' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white">
                    ${s.mrr.toFixed(2)}/mo
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
