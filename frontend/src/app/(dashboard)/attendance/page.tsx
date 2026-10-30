'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employee: string;
  shift: string;
  clockIn: string;
  clockOut: string;
  hours: number;
  status: 'On Time' | 'Late' | 'Overtime';
}

const initialRecords: AttendanceRecord[] = [
  { id: 'ATT-101', employee: 'Carlos Mendez', shift: 'Morning Shift', clockIn: '08:00 AM', clockOut: '05:00 PM', hours: 8.5, status: 'On Time' },
  { id: 'ATT-102', employee: 'Devon Vance', shift: 'Warehouse Early', clockIn: '07:30 AM', clockOut: '04:30 PM', hours: 9.0, status: 'Overtime' },
  { id: 'ATT-103', employee: 'Maya Lin', shift: 'Standard Office', clockIn: '09:12 AM', clockOut: '05:30 PM', hours: 8.0, status: 'Late' },
  { id: 'ATT-104', employee: 'Sarah Chen', shift: 'Finance Flexible', clockIn: '08:45 AM', clockOut: '05:00 PM', hours: 8.25, status: 'On Time' },
];

export default function AttendancePage() {
  const [records] = useState<AttendanceRecord[]>(initialRecords);
  const [search, setSearch] = useState('');

  const filtered = records.filter((r) =>
    r.employee.toLowerCase().includes(search.toLowerCase()) ||
    r.shift.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EC4899]/15 text-[#EC4899] border border-[#EC4899]/30 font-mono">
              Work Hours &amp; Attendance
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Work Hours &amp; Attendance
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            See when employees arrive, check hours worked, and track overtime for payday.
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
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Total Hours Today</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">33.75 hrs</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">4 team members working</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">On Time Rate</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">92.5%</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Arrived on time</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Overtime Logged</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">1.0 hr</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Extra hours approved</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Time Clock Status</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">Online</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Active and syncing</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search employee or shift..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#EC4899]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Assigned Shift</th>
                <th className="py-3 px-4">Clock In</th>
                <th className="py-3 px-4">Clock Out</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-ink dark:text-white">{r.employee}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-300">{r.shift}</td>
                  <td className="py-3.5 px-4 font-mono text-ink dark:text-neutral-200">{r.clockIn}</td>
                  <td className="py-3.5 px-4 font-mono text-ink dark:text-neutral-200">{r.clockOut}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'On Time' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      r.status === 'Overtime' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white">
                    {r.hours.toFixed(2)}h
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
