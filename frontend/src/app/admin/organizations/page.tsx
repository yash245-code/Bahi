'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';

interface ManagedTenant {
  id: string;
  name: string;
  slug: string;
  plan: 'Starter' | 'Growth' | 'Enterprise';
  status: 'Active' | 'Trial' | 'Suspended';
  seatsUsed: number;
  seatsMax: number;
  storageUsedGb: number;
  monthlyRevenue: string;
  modulesCount: number;
  createdAt: string;
}

export default function AdminOrganizationsPage() {
  const [tenants] = useState<ManagedTenant[]>([
    {
      id: 't-nexus',
      name: 'Nexus Dynamics',
      slug: 'nexus-dynamics',
      plan: 'Growth',
      status: 'Active',
      seatsUsed: 12,
      seatsMax: 15,
      storageUsedGb: 42,
      monthlyRevenue: '$79.00',
      modulesCount: 5,
      createdAt: '2026-09-15',
    },
    {
      id: 't-apex',
      name: 'Apex Industrial Logistics',
      slug: 'apex-logistics',
      plan: 'Enterprise',
      status: 'Active',
      seatsUsed: 38,
      seatsMax: 100,
      storageUsedGb: 280,
      monthlyRevenue: '$199.00',
      modulesCount: 8,
      createdAt: '2026-08-01',
    },
    {
      id: 't-zenith',
      name: 'Zenith Global Dynamics',
      slug: 'zenith-global',
      plan: 'Growth',
      status: 'Active',
      seatsUsed: 14,
      seatsMax: 15,
      storageUsedGb: 68,
      monthlyRevenue: '$79.00',
      modulesCount: 6,
      createdAt: '2026-10-10',
    },
    {
      id: 't-hyperion',
      name: 'Hyperion Build Corp',
      slug: 'hyperion-build',
      plan: 'Growth',
      status: 'Trial',
      seatsUsed: 4,
      seatsMax: 15,
      storageUsedGb: 12,
      monthlyRevenue: '$0.00',
      modulesCount: 4,
      createdAt: '2026-11-04',
    },
  ]);

  const columns: Column<ManagedTenant>[] = [
    {
      key: 'name',
      header: 'Tenant Workspace',
      sortable: true,
      render: (t) => (
        <div>
          <span className="font-semibold text-white">{t.name}</span>
          <span className="text-[11px] text-neutral-400 font-mono block">
            {t.slug}.bahi.app
          </span>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Active Tier',
      sortable: true,
      render: (t) => <span className="font-mono text-xs text-rose-400">{t.plan}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (t) => (
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
            t.status === 'Active'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-amber-500/10 text-amber-400'
          }`}
        >
          {t.status}
        </span>
      ),
    },
    {
      key: 'seats',
      header: 'Seat Utilization',
      render: (t) => (
        <span className="font-mono text-xs text-neutral-300">
          {t.seatsUsed} / {t.seatsMax} seats
        </span>
      ),
    },
    {
      key: 'storageUsedGb',
      header: 'Storage Used',
      render: (t) => <span className="font-mono text-xs">{t.storageUsedGb} GB</span>,
    },
    {
      key: 'monthlyRevenue',
      header: 'MRR',
      sortable: true,
      render: (t) => <span className="font-mono font-bold text-emerald-400">{t.monthlyRevenue}</span>,
    },
    { key: 'createdAt', header: 'Provisioned', sortable: true },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
          Multi-Tenancy Engine
        </span>
        <h1 className="font-serif text-3xl font-black text-white mt-1">
          Organizations & Workspaces
        </h1>
      </div>

      <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 space-y-4">
        <DataTable
          data={tenants}
          columns={columns}
          searchPlaceholder="Search tenants by name or slug..."
          exportFilename="tenants_list.csv"
        />
      </div>
    </div>
  );
}
