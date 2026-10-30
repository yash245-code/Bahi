'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface LeaveRequest {
  id: string;
  employee: string;
  type: 'Annual Vacation' | 'Sick Leave' | 'Personal';
  startDate: string;
  endDate: string;
  days: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const initialLeaves: LeaveRequest[] = [
  { id: 'LV-301', employee: 'Sarah Chen', type: 'Annual Vacation', startDate: 'Oct 23, 2026', endDate: 'Oct 27, 2026', days: 4, status: 'Approved' },
  { id: 'LV-302', employee: 'Maya Lin', type: 'Personal', startDate: 'Nov 04, 2026', endDate: 'Nov 05, 2026', days: 2, status: 'Pending' },
  { id: 'LV-303', employee: 'Devon Vance', type: 'Sick Leave', startDate: 'Oct 14, 2026', endDate: 'Oct 15, 2026', days: 1, status: 'Approved' },
];

export default function LeavePage() {
  const [leaves] = useState<LeaveRequest[]>(initialLeaves);
  const [search, setSearch] = useState('');

  const filtered = leaves.filter((l) =>
    l.employee.toLowerCase().includes(search.toLowerCase()) ||
    l.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/30 font-mono">
              Time Off &amp; Vacations
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Time Off &amp; Vacations
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Review vacation requests, approve sick days, and see who is out of the office.
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
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Out Today</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">1</div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Sarah Chen (returning Mon)</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Awaiting Approval</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">1</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Needs manager sign-off</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Average Days Left</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">16.4 days</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Per employee</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Next Public Holiday</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">Nov 26</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Thanksgiving holiday</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search employee or leave type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#F43F5E]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-ink dark:text-white">{l.employee}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-300">{l.type}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{l.startDate}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{l.endDate}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      l.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      l.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white">
                    {l.days} days
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
