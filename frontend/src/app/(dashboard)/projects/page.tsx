'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  client: string;
  tasksCompleted: number;
  tasksTotal: number;
  deadline: string;
  status: 'In Progress' | 'Review' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
}

const initialProjects: Project[] = [
  { id: 'PRJ-101', name: 'Q4 CRM Pipeline Redesign', client: 'Acme Internal', tasksCompleted: 18, tasksTotal: 22, deadline: 'Nov 05, 2026', status: 'In Progress', priority: 'High' },
  { id: 'PRJ-102', name: 'Field Dispatch Mobile Sync', client: 'Apex Logistics', tasksCompleted: 12, tasksTotal: 15, deadline: 'Nov 12, 2026', status: 'In Progress', priority: 'Medium' },
  { id: 'PRJ-103', name: 'Warehouse IoT Sensor Sync', client: 'Nordic Warehouses', tasksCompleted: 24, tasksTotal: 24, deadline: 'Oct 20, 2026', status: 'Completed', priority: 'High' },
  { id: 'PRJ-104', name: 'General Ledger Multi-Currency', client: 'Summit Medical', tasksCompleted: 9, tasksTotal: 14, deadline: 'Nov 25, 2026', status: 'Review', priority: 'Low' },
];

export default function ProjectsPage() {
  const [projects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState('');

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D1A536]/15 text-[#D1A536] border border-[#D1A536]/30 font-mono">
              Projects &amp; Tasks
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Projects &amp; Tasks
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Assign work to your team, see what is in progress, and finish projects on time.
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
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Active Projects</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">3</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">82% overall progress</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Tasks Completed</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">63 / 75</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">12 tasks left to finish</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Finished Projects</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">1</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Finished on time</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Due This Week</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">3</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Due dates coming up</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search projects or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white focus:outline-hidden focus:border-[#D1A536]"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((proj) => {
          const progress = Math.round((proj.tasksCompleted / proj.tasksTotal) * 100);
          return (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-ink-muted dark:text-neutral-500">{proj.id} • {proj.client}</span>
                  <h3 className="font-bold text-base text-ink dark:text-white mt-0.5">{proj.name}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                  proj.status === 'Review' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                  'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                }`}>
                  {proj.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-ink-muted dark:text-neutral-400">
                  <span>Progress ({proj.tasksCompleted}/{proj.tasksTotal} tasks)</span>
                  <span className="font-mono font-bold text-ink dark:text-white">{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#D1A536] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-border dark:border-[#2A2B27] text-ink-muted dark:text-neutral-400">
                <span>Deadline: <strong className="text-ink dark:text-neutral-200">{proj.deadline}</strong></span>
                <span className="font-semibold text-accent">View Details →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
