'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';

interface ServerErrorLog {
  id: string;
  severity: 'Critical' | 'Warning' | 'Error';
  service: string;
  message: string;
  endpoint: string;
  count: number;
  lastSeen: string;
}

export default function AdminErrorLogsPage() {
  const [logs] = useState<ServerErrorLog[]>([
    { id: 'err-101', severity: 'Warning', service: 'BullMQ Worker', message: 'Mailhog connection timeout after 3 retries', endpoint: 'queue:smtp-mailer', count: 12, lastSeen: '4 mins ago' },
    { id: 'err-102', severity: 'Error', service: 'NestJS REST API', message: 'Invalid JWT tenant signature token', endpoint: 'POST /api/v1/auth/refresh', count: 4, lastSeen: '18 mins ago' },
    { id: 'err-103', severity: 'Critical', service: 'Stripe Webhook Daemon', message: 'Webhook signature verification mismatch (secret mismatch)', endpoint: 'POST /api/v1/billing/stripe', count: 1, lastSeen: '1 hour ago' },
    { id: 'err-104', severity: 'Warning', service: 'S3 Attachment Store', message: 'Presigned upload URL expired before client upload', endpoint: 'GET /api/v1/storage/upload-url', count: 8, lastSeen: '2 hours ago' },
  ]);

  const columns: Column<ServerErrorLog>[] = [
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      render: (l) => (
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
            l.severity === 'Critical'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : l.severity === 'Error'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-white/10 text-neutral-300'
          }`}
        >
          {l.severity}
        </span>
      ),
    },
    { key: 'service', header: 'Service Subsystem', sortable: true, render: (l) => <span className="font-mono text-white text-xs">{l.service}</span> },
    { key: 'message', header: 'Error Message & Trace', render: (l) => <span className="text-neutral-200">{l.message}</span> },
    { key: 'endpoint', header: 'Target Endpoint', render: (l) => <span className="font-mono text-[11px] text-neutral-400">{l.endpoint}</span> },
    { key: 'count', header: 'Events', sortable: true, render: (l) => <span className="font-mono text-xs">{l.count}</span> },
    { key: 'lastSeen', header: 'Last Triggered', sortable: true },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
          System Diagnostics
        </span>
        <h1 className="font-serif text-3xl font-black text-white mt-1">
          Error Logs & Job Failures
        </h1>
      </div>

      <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 space-y-4">
        <DataTable
          data={logs}
          columns={columns}
          searchPlaceholder="Search error logs by service or trace..."
          exportFilename="server_error_logs.csv"
        />
      </div>
    </div>
  );
}
