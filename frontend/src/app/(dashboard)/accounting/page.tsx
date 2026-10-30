'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface Invoice {
  id: string;
  client: string;
  issueDate: string;
  dueDate: string;
  total: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

const initialInvoices: Invoice[] = [
  { id: 'INV-2026-084', client: 'Green Garden Cafe', issueDate: 'Oct 20, 2026', dueDate: 'Nov 04, 2026', total: 3200.00, status: 'Paid' },
  { id: 'INV-2026-085', client: 'Apex Logistics Hub', issueDate: 'Oct 21, 2026', dueDate: 'Nov 05, 2026', total: 4750.00, status: 'Pending' },
  { id: 'INV-2026-086', client: 'Nordic Warehouses', issueDate: 'Oct 15, 2026', dueDate: 'Oct 22, 2026', total: 1850.00, status: 'Overdue' },
  { id: 'INV-2026-087', client: 'Summit Medical Clinic', issueDate: 'Oct 23, 2026', dueDate: 'Nov 07, 2026', total: 920.00, status: 'Pending' },
  { id: 'INV-2026-088', client: 'Highland Club', issueDate: 'Oct 18, 2026', dueDate: 'Nov 02, 2026', total: 2150.00, status: 'Paid' },
];

export default function AccountingPage() {
  const [invoices] = useState<Invoice[]>(initialInvoices);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = invoices.filter((inv) => {
    const matchFilter = filter === 'all' || inv.status.toLowerCase() === filter.toLowerCase();
    const matchSearch = inv.client.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2E9169]/15 text-[#2E9169] border border-[#2E9169]/30 font-mono">
              Bookkeeping &amp; Finances
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Invoices &amp; Finances
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            See money coming in, check which bills are paid, and keep track of your cash flow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/applications"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            ← All Apps
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Total Invoiced</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">$12,870.00</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">$5,350 received this week</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Paid Invoices</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">2</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Paid by customers</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Awaiting Payment</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">$5,670.00</div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">2 bills due this month</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Overdue Invoices</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">1</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Friendly reminder sent</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border dark:border-[#2A2B27] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['all', 'paid', 'pending', 'overdue'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                  filter === st
                    ? 'bg-[#2E9169]/15 text-[#2E9169] border border-[#2E9169]/30 font-bold'
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
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#2E9169]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2E9169]">{inv.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-ink dark:text-white">{inv.client}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{inv.issueDate}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{inv.dueDate}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white">
                    ${inv.total.toFixed(2)}
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
