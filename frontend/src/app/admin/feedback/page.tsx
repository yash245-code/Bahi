'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';

interface AdminFeedback {
  id: string;
  title: string;
  votes: number;
  category: string;
  status: 'Planned' | 'In Progress' | 'Shipped';
  linkedRelease?: string;
}

export default function AdminFeedbackPage() {
  const [items, setItems] = useState<AdminFeedback[]>([
    { id: 'fb-1', title: 'Barcode scanner mobile camera support in inventory', votes: 48, category: 'Inventory', status: 'In Progress', linkedRelease: 'v2.5.0' },
    { id: 'fb-2', title: 'Multi-entity corporate consolidation ledger', votes: 94, category: 'Accounting', status: 'Planned' },
    { id: 'fb-3', title: 'WhatsApp Business direct invoice delivery', votes: 61, category: 'Sales', status: 'Shipped', linkedRelease: 'v2.4.0' },
    { id: 'fb-4', title: 'SAML 2.0 / Okta enterprise single sign-on', votes: 32, category: 'Security', status: 'Planned' },
  ]);

  const updateStatus = (id: string, status: AdminFeedback['status']) => {
    setItems(items.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const columns: Column<AdminFeedback>[] = [
    { key: 'title', header: 'Feature Request', sortable: true },
    { key: 'category', header: 'Module Tag', sortable: true, render: (i) => <span className="font-mono text-xs text-rose-400">{i.category}</span> },
    { key: 'votes', header: 'Customer Votes', sortable: true, render: (i) => <span className="font-mono font-bold text-white">👍 {i.votes}</span> },
    {
      key: 'status',
      header: 'Roadmap Status',
      render: (i) => (
        <select
          value={i.status}
          onChange={(e) => updateStatus(i.id, e.target.value as any)}
          className="px-2.5 py-1 rounded-lg border border-white/10 bg-[#171924] text-xs text-white"
        >
          <option>Planned</option>
          <option>In Progress</option>
          <option>Shipped</option>
        </select>
      ),
    },
    {
      key: 'linkedRelease',
      header: 'Linked Release',
      render: (i) => (
        <span className="font-mono text-xs text-neutral-400">
          {i.linkedRelease || '— Unlinked'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
          Product Strategy
        </span>
        <h1 className="font-serif text-3xl font-black text-white mt-1">
          Customer Feedback & Roadmap Linking
        </h1>
      </div>

      <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 space-y-4">
        <DataTable
          data={items}
          columns={columns}
          searchPlaceholder="Search feedback items..."
          exportFilename="feedback_roadmap.csv"
        />
      </div>
    </div>
  );
}
