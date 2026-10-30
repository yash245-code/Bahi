'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Remote';
  email: string;
}

const initialEmployees: Employee[] = [
  { id: 'EMP-01', name: 'Yash Rawat', role: 'Chief Executive Officer', department: 'Leadership', status: 'Active', email: 'yash@bahi.app' },
  { id: 'EMP-02', name: 'Carlos Mendez', role: 'Lead Field Specialist', department: 'Field Services', status: 'Active', email: 'carlos@bahi.app' },
  { id: 'EMP-03', name: 'Maya Lin', role: 'Client Operations Manager', department: 'Revenue Ops', status: 'Remote', email: 'maya@bahi.app' },
  { id: 'EMP-04', name: 'Devon Vance', role: 'Senior Inventory Director', department: 'Supply Chain', status: 'Active', email: 'devon@bahi.app' },
  { id: 'EMP-05', name: 'Sarah Chen', role: 'Chief Financial Controller', department: 'Finance', status: 'On Leave', email: 'sarah@bahi.app' },
];

export default function HrPage() {
  const [employees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState('');

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C24A6B]/15 text-[#C24A6B] border border-[#C24A6B]/30 font-mono">
              Team &amp; Staff
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Team Directory
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Find contact info for everyone on your team, see their job title, and check who is available.
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
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Team Members</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">{employees.length}</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Full staff roster</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Working Today</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">4</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">At work &amp; remote</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">On Leave</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">1</div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Back on Monday</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Departments</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">5</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Active teams</p>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search team by name or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#C24A6B]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Job Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-ink dark:text-white flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#C24A6B]/15 text-[#C24A6B] font-bold text-xs flex items-center justify-center border border-[#C24A6B]/25">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span>{emp.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-300 font-medium">{emp.role}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{emp.department}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      emp.status === 'Remote' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-ink-muted dark:text-neutral-400">{emp.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
