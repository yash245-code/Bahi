'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';

interface Transaction {
  id: string;
  tenantName: string;
  amount: string;
  provider: 'Stripe' | 'Razorpay';
  type: 'Subscription' | 'Invoice Addon' | 'Refund';
  status: 'Succeeded' | 'Failed' | 'Refunded';
  date: string;
}

export default function AdminPaymentsPage() {
  const [transactions] = useState<Transaction[]>([
    { id: 'ch_3N82bX', tenantName: 'Nexus Dynamics', amount: '$79.00', provider: 'Stripe', type: 'Subscription', status: 'Succeeded', date: '2026-11-01 10:14' },
    { id: 'ch_3N78qZ', tenantName: 'Apex Industrial', amount: '$199.00', provider: 'Stripe', type: 'Subscription', status: 'Succeeded', date: '2026-11-01 09:20' },
    { id: 'pay_M82x9L', tenantName: 'Zenith Global', amount: '$79.00', provider: 'Razorpay', type: 'Subscription', status: 'Succeeded', date: '2026-10-31 16:45' },
    { id: 'ch_3N64aK', tenantName: 'Volkov Industries', amount: '$29.00', provider: 'Stripe', type: 'Subscription', status: 'Failed', date: '2026-10-29 08:30' },
    { id: 're_1N42pM', tenantName: 'Hyperion Build', amount: '-$29.00', provider: 'Stripe', type: 'Refund', status: 'Refunded', date: '2026-10-25 12:00' },
  ]);

  const webhooks = [
    { event: 'customer.subscription.updated', provider: 'Stripe', status: '200 OK', latency: '42ms', time: '12 mins ago' },
    { event: 'invoice.payment_succeeded', provider: 'Stripe', status: '200 OK', latency: '38ms', time: '1 hour ago' },
    { event: 'payment.captured', provider: 'Razorpay', status: '200 OK', latency: '55ms', time: '3 hours ago' },
    { event: 'invoice.payment_failed', provider: 'Stripe', status: '200 OK', latency: '45ms', time: '2 days ago' },
  ];

  const columns: Column<Transaction>[] = [
    { key: 'id', header: 'Charge ID', sortable: true, render: (t) => <span className="font-mono font-bold text-white">{t.id}</span> },
    { key: 'tenantName', header: 'Customer Organization', sortable: true },
    { key: 'amount', header: 'Amount (USD)', sortable: true, render: (t) => <span className="font-mono font-semibold">{t.amount}</span> },
    { key: 'provider', header: 'Provider', sortable: true, render: (t) => <span className="font-mono text-[11px] text-neutral-400">{t.provider}</span> },
    { key: 'type', header: 'Type' },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (t) => (
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
            t.status === 'Succeeded'
              ? 'bg-emerald-500/10 text-emerald-400'
              : t.status === 'Refunded'
                ? 'bg-sky-500/10 text-sky-400'
                : 'bg-rose-500/10 text-rose-400'
          }`}
        >
          {t.status}
        </span>
      ),
    },
    { key: 'date', header: 'Timestamp', sortable: true },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
          Payment Processing
        </span>
        <h1 className="font-serif text-3xl font-black text-white mt-1">
          Transactions & Webhook Health
        </h1>
      </div>

      {/* Webhook Status Strip */}
      <div className="rounded-3xl p-6 bg-[#11131A] border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="font-serif font-bold text-base text-white">Payment Provider Webhook Feed</h3>
          <span className="text-[11px] font-mono text-emerald-400">All Dispatchers Nominal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {webhooks.map((w, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-neutral-400 text-[11px]">{w.provider}</span>
                <span className="font-mono text-emerald-400 text-[10px]">{w.status}</span>
              </div>
              <p className="font-mono text-white text-[11px] truncate">{w.event}</p>
              <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                <span>{w.latency}</span>
                <span>{w.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 space-y-4">
        <DataTable
          data={transactions}
          columns={columns}
          searchPlaceholder="Search charges by ID or tenant..."
          exportFilename="charges_log.csv"
        />
      </div>
    </div>
  );
}
