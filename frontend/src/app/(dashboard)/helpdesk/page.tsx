'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface Ticket {
  id: string;
  customer: string;
  subject: string;
  priority: 'Urgent' | 'High' | 'Normal';
  assignee: string;
  updated: string;
  status: 'Open' | 'Pending' | 'Resolved';
}

const initialTickets: Ticket[] = [
  { id: 'TKT-901', customer: 'Green Garden Cafe', subject: 'Printer receipt thermal head error', priority: 'High', assignee: 'Carlos Mendez', updated: '20 mins ago', status: 'Open' },
  { id: 'TKT-902', customer: 'Apex Logistics Hub', subject: 'API Webhook authentication timeout', priority: 'Urgent', assignee: 'Yash Rawat', updated: '1 hour ago', status: 'Pending' },
  { id: 'TKT-903', customer: 'Nordic Warehouses', subject: 'Add 3 new barcode scanner licences', priority: 'Normal', assignee: 'Maya Lin', updated: '3 hours ago', status: 'Resolved' },
  { id: 'TKT-904', customer: 'Summit Medical Clinic', subject: 'Monthly data export format clarification', priority: 'Normal', assignee: 'Sarah Chen', updated: 'Yesterday', status: 'Resolved' },
];

export default function HelpdeskPage() {
  const [tickets] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState('');

  const filtered = tickets.filter((t) =>
    t.customer.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 font-mono">
              Customer Help &amp; Support
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Customer Help &amp; Support
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Answer customer questions, solve problems quickly, and keep clients happy.
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
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Open Tickets</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">2</div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">1 waiting for our reply</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">First Response Time</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">14 mins</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Average response: under 30 mins</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Answered On Time</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">98.4%</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Over the last 30 days</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Customer Satisfaction</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">4.9 / 5.0</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Happy customer reviews</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search customer, issue or ticket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#8B5CF6]">{t.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-ink dark:text-white">{t.customer}</td>
                  <td className="py-3.5 px-4 text-ink dark:text-neutral-200">{t.subject}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' :
                      t.priority === 'High' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                      'bg-neutral-500/10 text-neutral-500'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{t.assignee}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      t.status === 'Pending' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-ink-muted dark:text-neutral-400 font-mono">
                    {t.updated}
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
