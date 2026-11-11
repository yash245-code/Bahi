'use client';

import React, { useState, useEffect } from 'react';
import { getAuditLogs, AuditEntry } from '@/lib/admin-auth';
import { DataTable, Column } from '@/components/ui/DataTable';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const columns: Column<AuditEntry>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp (UTC)',
      sortable: true,
      render: (l) => <span className="font-mono text-xs text-neutral-400">{l.timestamp}</span>,
    },
    {
      key: 'actor',
      header: 'Staff Actor',
      sortable: true,
      render: (l) => <span className="font-mono font-semibold text-rose-400 text-xs">{l.actor}</span>,
    },
    {
      key: 'action',
      header: 'Event Action',
      sortable: true,
      render: (l) => (
        <span className="font-mono text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white">
          {l.action}
        </span>
      ),
    },
    {
      key: 'target',
      header: 'Target Entity',
      sortable: true,
      render: (l) => <span className="text-white font-medium">{l.target}</span>,
    },
    { key: 'details', header: 'Audit Context / Event Payload' },
    {
      key: 'ip',
      header: 'Source IP',
      render: (l) => <span className="font-mono text-[11px] text-neutral-500">{l.ip}</span>,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
          Immutable Compliance Vault
        </span>
        <h1 className="font-serif text-3xl font-black text-white mt-1">
          Cryptographic Audit Trail
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Append-only verifiable record of every administrative event, impersonation session, and security policy modification.
        </p>
      </div>

      <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 space-y-4">
        <DataTable
          data={logs}
          columns={columns}
          searchPlaceholder="Search audit events by actor, action, or target..."
          exportFilename="immutable_audit_logs.csv"
        />
      </div>
    </div>
  );
}
