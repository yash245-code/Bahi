'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface PurchaseOrder {
  id: string;
  vendor: string;
  items: number;
  expectedDate: string;
  total: number;
  status: 'Received' | 'Approved' | 'Sent' | 'Draft';
}

const initialPOs: PurchaseOrder[] = [
  { id: 'PO-2026-041', vendor: 'Global Microchips Inc', items: 250, expectedDate: 'Oct 28, 2026', total: 6400.00, status: 'Sent' },
  { id: 'PO-2026-042', vendor: 'Pacific Paper & Packaging', items: 1200, expectedDate: 'Oct 26, 2026', total: 1850.00, status: 'Approved' },
  { id: 'PO-2026-043', vendor: 'Apex Industrial Parts', items: 40, expectedDate: 'Oct 22, 2026', total: 4200.00, status: 'Received' },
  { id: 'PO-2026-044', vendor: 'Metro Office Supplies', items: 85, expectedDate: 'Nov 02, 2026', total: 680.00, status: 'Draft' },
];

export default function ProcurementPage() {
  const [pos] = useState<PurchaseOrder[]>(initialPOs);
  const [search, setSearch] = useState('');

  const filtered = pos.filter((p) =>
    p.vendor.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0284C7]/15 text-[#0284C7] border border-[#0284C7]/30 font-mono">
              Purchases &amp; Suppliers
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Purchases &amp; Suppliers
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Order items from suppliers, track incoming shipments, and make sure you get what you paid for.
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
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Total Spent on Supplies</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">$13,130.00</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Under monthly budget</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Open Orders</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">2</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Waiting on suppliers</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Active Suppliers</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">14</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Trusted vendor list</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Items On the Way</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">1,450</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Units arriving this week</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search vendor or PO #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#0284C7]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-4">PO Ref</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Units</th>
                <th className="py-3 px-4">Expected Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
              {filtered.map((po) => (
                <tr key={po.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0284C7]">{po.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-ink dark:text-white">{po.vendor}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-300 font-mono">{po.items} items</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{po.expectedDate}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      po.status === 'Received' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      po.status === 'Approved' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                      po.status === 'Sent' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                      'bg-neutral-500/10 text-neutral-500'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white">
                    ${po.total.toFixed(2)}
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
