'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';

interface CohortRetention {
  cohort: string;
  size: number;
  month1: string;
  month2: string;
  month3: string;
  month6: string;
  retentionScore: string;
}

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const cohortData: CohortRetention[] = [
    { cohort: '2026-10 (October)', size: 480, month1: '98.5%', month2: '94.2%', month3: '91.8%', month6: '—', retentionScore: '94.2%' },
    { cohort: '2026-09 (September)', size: 412, month1: '97.8%', month2: '93.5%', month3: '90.4%', month6: '88.2%', retentionScore: '92.4%' },
    { cohort: '2026-08 (August)', size: 395, month1: '98.0%', month2: '92.1%', month3: '89.6%', month6: '86.4%', retentionScore: '90.2%' },
    { cohort: '2026-07 (July)', size: 360, month1: '96.5%', month2: '91.4%', month3: '88.2%', month6: '85.1%', retentionScore: '89.5%' },
  ];

  const columns: Column<CohortRetention>[] = [
    { key: 'cohort', header: 'Signup Cohort', sortable: true },
    { key: 'size', header: 'Tenants Onboarded', sortable: true },
    { key: 'month1', header: 'Month 1 Retention' },
    { key: 'month2', header: 'Month 2 Retention' },
    { key: 'month3', header: 'Month 3 Retention' },
    { key: 'month6', header: 'Month 6 Retention' },
    {
      key: 'retentionScore',
      header: 'Net Quality Score',
      render: (r) => <span className="font-mono font-bold text-emerald-400">{r.retentionScore}</span>,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
            Analytics & Cohorts
          </span>
          <h1 className="font-serif text-3xl font-black text-white mt-1">
            Usage Trends & Retention Funnel
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-white/10 bg-[#14161C] text-xs text-white"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last Quarter (Q3 2026)</option>
            <option>Year to Date (2026)</option>
          </select>
        </div>
      </div>

      {/* Funnel Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { step: '1. Landing Visitors', count: '142,500', rate: '100%' },
          { step: '2. Free Trial Signup', count: '14,250', rate: '10.0% conversion' },
          { step: '3. Activated First App', count: '9,840', rate: '69.1% completion' },
          { step: '4. Converted to Paid', count: '3,533', rate: '24.8% net trial' },
        ].map((f, idx) => (
          <div
            key={idx}
            className="rounded-3xl p-6 bg-[#11131A] border border-white/10 space-y-2"
          >
            <span className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">{f.step}</span>
            <div className="font-serif font-black text-3xl text-white">{f.count}</div>
            <p className="text-xs font-mono text-emerald-400">{f.rate}</p>
          </div>
        ))}
      </div>

      {/* Cohort Retention Table with CSV Export */}
      <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 space-y-4">
        <div className="border-b border-white/5 pb-4">
          <h3 className="font-serif font-bold text-xl text-white">Monthly Cohort Net Revenue Retention</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Tracking customer longevity and renewal behavior across historical signup batches.
          </p>
        </div>

        <DataTable
          data={cohortData}
          columns={columns}
          searchPlaceholder="Search cohort month..."
          exportFilename="retention_cohorts.csv"
        />
      </div>
    </div>
  );
}
