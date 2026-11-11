'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const kpis = [
    { label: 'Monthly Recurring Revenue (MRR)', val: '$148,200', change: '+18.5%', positive: true, sub: 'vs $125k last month' },
    { label: 'Active Tenant Organizations', val: '4,280', change: '+142 New', positive: true, sub: '82% on Growth & Ent' },
    { label: 'Total Registered Users', val: '28,450', change: '+1,120 Wk', positive: true, sub: '99.4% active 30d' },
    { label: 'Trial Conversion Rate', val: '24.8%', change: '+3.2%', positive: true, sub: 'Industry benchmark: 14%' },
    { label: 'Net Monthly Churn', val: '1.2%', change: '-0.4%', positive: true, sub: 'Target < 2.0%' },
    { label: 'System Health & Edge Nodes', val: '99.99%', change: 'Nominal', positive: true, sub: '6 global regions live' },
  ];

  const recentTenants = [
    { name: 'Apex Industrial Logistics', slug: 'apex-logistics', plan: 'Enterprise', mrr: '$199/mo', status: 'Active', created: '2 hrs ago' },
    { name: 'Zenith Global Dynamics', slug: 'zenith-global', plan: 'Growth', mrr: '$79/mo', status: 'Active', created: '5 hrs ago' },
    { name: 'Hyperion Build Corp', slug: 'hyperion-build', plan: 'Growth', mrr: '$79/mo', status: 'Trial', created: '1 day ago' },
    { name: 'Kinetics Automotive Parts', slug: 'kinetics-auto', plan: 'Starter', mrr: '$29/mo', status: 'Active', created: '2 days ago' },
  ];

  const activeAlerts = [
    { title: 'High Volume Reorder Spike', tenant: 'Apex Logistics', desc: 'Auto-requisition triggered for 5,000 SKUs', sev: 'info' },
    { title: 'Failed Webhook Retry Exceeded', tenant: 'Stripe Synchronizer', desc: 'Retrying transaction tx_98a72 in 10s', sev: 'warning' },
    { title: 'New Staff Admin Provisioned', tenant: 'Security Console', desc: 'karan@bahi.app added as Support Agent', sev: 'success' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
            Platform Command Center
          </span>
          <h1 className="font-serif text-3xl font-black text-white mt-1">
            Enterprise Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/analytics"
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold transition-colors"
          >
            Detailed Metrics
          </Link>
          <Link
            href="/admin/users"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all"
          >
            Manage Users & Impersonate
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="rounded-3xl p-6 bg-[#11131A] border border-white/10 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                {kpi.label}
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {kpi.change}
              </span>
            </div>
            <div>
              <span className="font-serif font-black text-3xl text-white">{kpi.val}</span>
              <p className="text-[11px] text-neutral-500 mt-1">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tenancies */}
        <div className="lg:col-span-2 rounded-3xl p-6 bg-[#11131A] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-serif font-bold text-lg text-white">Recent Organization Signups</h3>
            <Link href="/admin/organizations" className="text-xs text-rose-400 hover:underline">
              View All 4,280 Tenants
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/5 text-neutral-400 font-mono text-[10px] uppercase">
                  <th className="p-3">Organization</th>
                  <th className="p-3">Plan Tier</th>
                  <th className="p-3">MRR</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-200">
                {recentTenants.map((t, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="p-3">
                      <div className="font-semibold text-white">{t.name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{t.slug}.bahi.app</div>
                    </td>
                    <td className="p-3 font-mono">{t.plan}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{t.mrr}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          t.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-right text-neutral-500 font-mono text-[11px]">{t.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time System Alert Stream */}
        <div className="rounded-3xl p-6 bg-[#11131A] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-serif font-bold text-lg text-white">Security & Job Queue</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-3">
            {activeAlerts.map((alt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{alt.title}</span>
                  <span className="text-[10px] font-mono text-neutral-500">{alt.tenant}</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{alt.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5">
            <Link
              href="/admin/audit-logs"
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Inspect Full Audit Log</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
