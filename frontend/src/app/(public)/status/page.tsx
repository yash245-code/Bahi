'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { INITIAL_SYSTEM_SERVICES, INITIAL_INCIDENTS } from '@/lib/cms-store';

export default function StatusPage() {
  const allOperational = INITIAL_SYSTEM_SERVICES.every((s) => s.status === 'operational');

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Operational Pill Banner */}
        <div
          className={`rounded-3xl p-8 sm:p-10 mb-12 border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 ${
            allOperational
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
              <h1 className="font-serif font-black text-2xl text-ink dark:text-white">
                All Core Systems Operational
              </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                99.99% overall uptime across global edge nodes and database clusters.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[11px] font-mono text-neutral-400 block">Current Uptime</span>
            <span className="font-serif font-black text-2xl text-emerald-500">99.99%</span>
          </div>
        </div>

        {/* Live Service Grid */}
        <div className="rounded-3xl p-8 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm mb-16 space-y-6">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
            <h3 className="font-serif font-bold text-lg text-ink dark:text-white">Active Service Nodes</h3>
            <span className="text-[11px] font-mono text-neutral-400">Refreshed every 60s</span>
          </div>

          <div className="space-y-4">
            {INITIAL_SYSTEM_SERVICES.map((srv, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-ink dark:text-white">{srv.name}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">{srv.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-medium text-neutral-500 hidden sm:inline">
                    {srv.uptimePercent}%
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Operational
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Incidents Timeline */}
        <div className="space-y-6">
          <div className="border-b border-black/10 dark:border-white/10 pb-4">
            <h3 className="font-serif font-bold text-xl text-ink dark:text-white">Incident & Maintenance History</h3>
            <p className="text-xs text-neutral-500 mt-1">Recorded audit events over the past 90 days.</p>
          </div>

          <div className="space-y-4">
            {INITIAL_INCIDENTS.map((inc) => (
              <div
                key={inc.id}
                className="rounded-2xl p-6 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink dark:text-white">{inc.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-500 font-bold uppercase">
                    {inc.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">{inc.description}</p>
                <span className="text-[11px] text-neutral-400 font-mono block pt-1">{inc.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
