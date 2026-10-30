'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface Expense {
  id: string;
  submitter: string;
  category: string;
  date: string;
  amount: number;
  status: 'Approved' | 'Review' | 'Reimbursed';
}

const initialExpenses: Expense[] = [
  { id: 'EXP-401', submitter: 'Carlos Mendez', category: 'Field Travel & Fuel', date: 'Oct 23, 2026', amount: 84.50, status: 'Approved' },
  { id: 'EXP-402', submitter: 'Maya Lin', category: 'Client Lunch & Meeting', date: 'Oct 22, 2026', amount: 142.00, status: 'Reimbursed' },
  { id: 'EXP-403', submitter: 'Devon Vance', category: 'Warehouse Tool Safety', date: 'Oct 21, 2026', amount: 320.00, status: 'Review' },
  { id: 'EXP-404', submitter: 'Sarah Chen', category: 'Tax Software Renewal', date: 'Oct 19, 2026', amount: 490.00, status: 'Reimbursed' },
];

export default function ExpensesPage() {
  const [expenses] = useState<Expense[]>(initialExpenses);
  const [search, setSearch] = useState('');

  const filtered = expenses.filter((e) =>
    e.submitter.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase()) ||
    e.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#84CC16]/15 text-[#84CC16] border border-[#84CC16]/30 font-mono">
              Expenses &amp; Receipts
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Expenses &amp; Receipts
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Record business spending, snap photos of receipts, and pay team members back.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Total Spent This Month</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">$1,036.50</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">All within budget</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Paid Back to Staff</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">$632.00</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Sent to bank accounts</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Awaiting Approval</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">1</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Waiting for manager review</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Avg Approval Time</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">1.2 Days</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Quick turnaround</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search expenses by person or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#84CC16]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-4">Claim ID</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
              {filtered.map((exp) => (
                <tr key={exp.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#84CC16]">{exp.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-ink dark:text-white">{exp.submitter}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-300 font-medium">{exp.category}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{exp.date}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      exp.status === 'Reimbursed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      exp.status === 'Approved' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white">
                    ${exp.amount.toFixed(2)}
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
