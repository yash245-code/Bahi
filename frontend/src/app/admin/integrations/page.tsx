'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';

interface MasterApiKey {
  id: string;
  name: string;
  prefix: string;
  scope: string;
  createdBy: string;
  status: 'Active' | 'Rotated';
  lastUsed: string;
}

export default function AdminIntegrationsPage() {
  const [keys, setKeys] = useState<MasterApiKey[]>([
    { id: 'mk-1', name: 'Zapier Global Webhook Relay', prefix: 'bahi_sec_99a84...', scope: 'read:write:all', createdBy: 'aiden@bahi.app', status: 'Active', lastUsed: '4 mins ago' },
    { id: 'mk-2', name: 'Internal Billing Ledger Auditor', prefix: 'bahi_sec_41b12...', scope: 'billing:read', createdBy: 'rohan@bahi.app', status: 'Active', lastUsed: '1 hour ago' },
    { id: 'mk-3', name: 'Legacy Data Migration Script', prefix: 'bahi_sec_10c89...', scope: 'impex:write', createdBy: 'karan@bahi.app', status: 'Rotated', lastUsed: '30 days ago' },
  ]);

  const rotateKey = (id: string) => {
    setKeys((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              prefix: `bahi_sec_${Math.random().toString(36).substring(2, 7)}...`,
              status: 'Active',
              lastUsed: 'Rotated just now',
            }
          : k,
      ),
    );
  };

  const columns: Column<MasterApiKey>[] = [
    { key: 'name', header: 'Key Name', sortable: true, render: (k) => <span className="font-semibold text-white">{k.name}</span> },
    { key: 'prefix', header: 'Key Token', render: (k) => <span className="font-mono text-xs text-rose-400">{k.prefix}</span> },
    { key: 'scope', header: 'Granular Scopes', render: (k) => <span className="font-mono text-[11px] bg-white/5 px-2 py-0.5 rounded text-neutral-300">{k.scope}</span> },
    { key: 'createdBy', header: 'Staff Owner' },
    {
      key: 'status',
      header: 'Status',
      render: (k) => (
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
            k.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
          }`}
        >
          {k.status}
        </span>
      ),
    },
    { key: 'lastUsed', header: 'Last Invoked' },
    {
      key: 'actions',
      header: 'Key Actions',
      className: 'text-right',
      render: (k) => (
        <button
          type="button"
          onClick={() => rotateKey(k.id)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-rose-300"
          title="Rotate Key"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Rotate</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
          API Infrastructure
        </span>
        <h1 className="font-serif text-3xl font-black text-white mt-1">
          Platform API Keys & Webhook Scopes
        </h1>
      </div>

      <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 space-y-4">
        <DataTable
          data={keys}
          columns={columns}
          searchPlaceholder="Search API keys by name or scope..."
          exportFilename="api_keys_audit.csv"
        />
      </div>
    </div>
  );
}
