'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';

interface BlockedIp {
  ip: string;
  reason: string;
  failedCount: number;
  blockedAt: string;
  expiresIn: string;
}

export default function AdminSecurityCenterPage() {
  const [blockedIps, setBlockedIps] = useState<BlockedIp[]>([
    { ip: '185.220.101.4', reason: 'Brute-force credential stuffing on /admin/login', failedCount: 14, blockedAt: '2026-11-10 18:22', expiresIn: '23 hours' },
    { ip: '45.154.255.89', reason: 'SQL injection probe on search endpoint', failedCount: 8, blockedAt: '2026-11-09 11:05', expiresIn: '12 hours' },
    { ip: '194.26.29.112', reason: 'Unverified Stripe webhook flood', failedCount: 22, blockedAt: '2026-11-08 04:30', expiresIn: 'Permanent' },
  ]);

  const [newIp, setNewIp] = useState('');
  const [newReason, setNewReason] = useState('');

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp) return;
    setBlockedIps([
      {
        ip: newIp,
        reason: newReason || 'Manual administrative quarantine',
        failedCount: 0,
        blockedAt: 'Just now',
        expiresIn: 'Permanent',
      },
      ...blockedIps,
    ]);
    setNewIp('');
    setNewReason('');
  };

  const removeBlock = (ip: string) => {
    setBlockedIps(blockedIps.filter((b) => b.ip !== ip));
  };

  const columns: Column<BlockedIp>[] = [
    { key: 'ip', header: 'Quarantined IP Address', sortable: true, render: (b) => <span className="font-mono font-bold text-rose-400">{b.ip}</span> },
    { key: 'reason', header: 'Violation Reason' },
    { key: 'failedCount', header: 'Failed Auth Hits', sortable: true, render: (b) => <span className="font-mono">{b.failedCount}</span> },
    { key: 'blockedAt', header: 'Blocked Timestamp' },
    { key: 'expiresIn', header: 'Quarantine Duration' },
    {
      key: 'actions',
      header: 'Action',
      className: 'text-right',
      render: (b) => (
        <button
          type="button"
          onClick={() => removeBlock(b.ip)}
          className="text-emerald-400 hover:underline text-xs"
        >
          Unblock IP
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
          Zero-Trust Perimeter
        </span>
        <h1 className="font-serif text-3xl font-black text-white mt-1">
          Security Center & Threat Protection
        </h1>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Staff 2FA Adoption Rate', val: '100%', sub: 'Mandatory TOTP enforced' },
          { label: 'Customer 2FA Adoption', val: '64.2%', sub: '+8% this quarter' },
          { label: 'Blocked Malicious IPs', val: '3 Active', sub: 'Automated firewall drop' },
          { label: 'Failed Login Rate', val: '0.04%', sub: 'Well below 1% threshold' },
        ].map((s, idx) => (
          <div key={idx} className="rounded-3xl p-6 bg-[#11131A] border border-white/10 space-y-1">
            <span className="text-[11px] font-mono uppercase text-neutral-400">{s.label}</span>
            <div className="font-serif font-black text-3xl text-white">{s.val}</div>
            <p className="text-xs text-neutral-500">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Manual IP Block Form */}
      <div className="rounded-3xl p-6 bg-[#11131A] border border-white/10 space-y-4">
        <h3 className="font-serif font-bold text-lg text-white">Manual IP Blocklist Addition</h3>
        <form onSubmit={handleAddBlock} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="IP Address (e.g. 192.0.2.1)"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-white/10 bg-[#171924] text-xs text-white font-mono"
          />
          <input
            type="text"
            placeholder="Reason for block..."
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl border border-white/10 bg-[#171924] text-xs text-white"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs cursor-pointer shrink-0"
          >
            Quarantine IP
          </button>
        </form>
      </div>

      {/* Blocked IP Table */}
      <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 space-y-4">
        <DataTable
          data={blockedIps}
          columns={columns}
          searchPlaceholder="Search blocked IP addresses..."
          exportFilename="blocked_ips.csv"
        />
      </div>
    </div>
  );
}
