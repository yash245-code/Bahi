'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface InvoiceItem {
  id: string;
  recipient: string;
  amount: number;
  dueDate: string;
  channel: 'Stripe' | 'Bank Transfer' | 'Card';
  status: 'Settled' | 'Pending' | 'Overdue';
}

const initialInvoices: InvoiceItem[] = [
  { id: 'INV-1091', recipient: 'Acme Logistics', amount: 3200.00, dueDate: 'Nov 02, 2026', channel: 'Bank Transfer', status: 'Settled' },
  { id: 'INV-1092', recipient: 'Green Garden Cafe', amount: 890.00, dueDate: 'Nov 04, 2026', channel: 'Stripe', status: 'Pending' },
  { id: 'INV-1093', recipient: 'Nordic Warehouses', amount: 4500.00, dueDate: 'Oct 28, 2026', channel: 'Card', status: 'Settled' },
  { id: 'INV-1094', recipient: 'Summit Health', amount: 1200.00, dueDate: 'Oct 20, 2026', channel: 'Bank Transfer', status: 'Overdue' },
];

export default function InvoicingPage() {
  const [invoices] = useState<InvoiceItem[]>(initialInvoices);
  const [search, setSearch] = useState('');

  const filtered = invoices.filter((i) =>
    i.recipient.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-mono">
              Invoices &amp; Payments
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Customer Invoices
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Send clean bills to customers, share easy payment links, and see what has been collected.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/applications"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            ← All Apps
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Total Invoiced</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">$9,790.00</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">$7,700 received</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Paid Invoices</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">2</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Payments received</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Awaiting Payment</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">$890.00</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Due within 10 days</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Overdue Reminders</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">1</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Friendly reminder sent</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search recipient or invoice ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#10B981]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#10B981]">{inv.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-ink dark:text-white">{inv.recipient}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{inv.channel}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{inv.dueDate}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'Settled' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white">
                    ${inv.amount.toFixed(2)}
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
