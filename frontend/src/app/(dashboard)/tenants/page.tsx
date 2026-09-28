'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';

const initialTenants = [
  {
    id: 't-01',
    name: 'Acme Corp',
    slug: 'acme-corp',
    plan: 'Enterprise',
    mrr: '$2,850',
    seats: '45/50',
    status: 'active' as const,
    region: 'us-east-1',
    created: 'Jan 15, 2026',
    contact: 'yash@acme.co',
  },
  {
    id: 't-02',
    name: 'Nexus Logistics Global',
    slug: 'nexus-logistics',
    plan: 'Enterprise',
    mrr: '$4,200',
    seats: '80/100',
    status: 'active' as const,
    region: 'us-east-1',
    created: 'Feb 02, 2026',
    contact: 'ops@nexuslogistics.com',
  },
  {
    id: 't-03',
    name: 'Finova Global Corp',
    slug: 'finova-global',
    plan: 'Professional',
    mrr: '$1,450',
    seats: '25/30',
    status: 'active' as const,
    region: 'eu-west-1',
    created: 'Mar 11, 2026',
    contact: 'admin@finovaglobal.io',
  },
  {
    id: 't-04',
    name: 'Starlight Retailers',
    slug: 'starlight-retail',
    plan: 'Professional',
    mrr: '$1,400',
    seats: '20/25',
    status: 'warning' as const,
    region: 'us-west-2',
    created: 'Apr 04, 2026',
    contact: 'billing@starlight.store',
  },
  {
    id: 't-05',
    name: 'Apex Health Solutions',
    slug: 'apex-health',
    plan: 'Enterprise',
    mrr: '$3,600',
    seats: '60/75',
    status: 'active' as const,
    region: 'us-east-1',
    created: 'May 19, 2026',
    contact: 'compliance@apexhealth.org',
  },
  {
    id: 't-06',
    name: 'Horizon Tech Labs',
    slug: 'horizon-tech',
    plan: 'Starter',
    mrr: '$450',
    seats: '8/10',
    status: 'active' as const,
    region: 'ap-south-1',
    created: 'Jun 28, 2026',
    contact: 'dev@horizontech.dev',
  },
  {
    id: 't-07',
    name: 'Crestline Manufacturing',
    slug: 'crestline-mfg',
    plan: 'Enterprise',
    mrr: '$5,100',
    seats: '110/125',
    status: 'active' as const,
    region: 'us-east-1',
    created: 'Jul 14, 2026',
    contact: 'it@crestlinemfg.com',
  },
];

export default function TenantsPage() {
  const [tenants] = useState(initialTenants);
  const [query, setQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('all');

  const filtered = tenants.filter((t) => {
    const matches = t.name.toLowerCase().includes(query.toLowerCase()) || t.slug.toLowerCase().includes(query.toLowerCase());
    const matchPlan = planFilter === 'all' || t.plan.toLowerCase() === planFilter.toLowerCase();
    return matches && matchPlan;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF4F2] text-accent border border-[#EBD2CB]">
              Multi-Tenant Registry
            </span>
            <span className="text-xs text-ink-muted">148 Active Organizations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Tenants &amp; Organizations
          </h1>
          <p className="text-sm text-ink-muted mt-0.5">
            Supervise platform tenants, inspect allocated tiers, manage seat allocations, and drill into services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/services"
            className="btn-secondary text-xs py-2"
          >
            Manage Services
          </Link>
          <button
            type="button"
            className="btn-primary text-xs py-2 cursor-pointer"
            onClick={() => alert('Tenant Provisioning Wizard: Fill organization details, tier selection, and database shard assignment.')}
          >
            + Provision Tenant
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search organizations by name, slug or contact..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
          />
          <svg className="w-4 h-4 text-ink-muted absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {['all', 'Enterprise', 'Professional', 'Starter'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlanFilter(p)}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                planFilter === p
                  ? 'bg-accent text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-ink-muted hover:text-ink'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tenants Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-border text-[11px] uppercase tracking-wider text-ink-muted font-bold">
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Tier Plan</th>
                <th className="py-3 px-4">MRR</th>
                <th className="py-3 px-4">Seats</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-[#FAF4F2]/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-ink">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF4F2] border border-[#EBD2CB] flex items-center justify-center font-bold text-accent text-xs">
                        {tenant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-ink">{tenant.name}</div>
                        <div className="text-[11px] text-ink-muted font-mono">{tenant.contact}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tenant.plan === 'Enterprise'
                        ? 'bg-purple-100 text-purple-800'
                        : tenant.plan === 'Professional'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold">{tenant.mrr}</td>
                  <td className="py-3.5 px-4 font-mono text-ink-muted">{tenant.seats}</td>
                  <td className="py-3.5 px-4 font-mono text-ink-muted">{tenant.region}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge
                      label={tenant.status === 'active' ? 'Operational' : 'Payment Overdue'}
                      variant={tenant.status === 'active' ? 'success' : 'warning'}
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      href="/services"
                      className="text-accent font-semibold hover:underline"
                    >
                      Services →
                    </Link>
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
