'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

interface Quote {
  id: string;
  customer: string;
  contact: string;
  date: string;
  amount: number;
  itemsCount: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Invoiced';
}

const initialQuotes: Quote[] = [
  { id: 'QT-2026-091', customer: 'Green Garden Cafe', contact: 'Maya Lin', date: 'Oct 23, 2026', amount: 1450.00, itemsCount: 4, status: 'Approved' },
  { id: 'QT-2026-092', customer: 'Apex Logistics Hub', contact: 'Devon Vance', date: 'Oct 22, 2026', amount: 3820.00, itemsCount: 8, status: 'Sent' },
  { id: 'QT-2026-093', customer: 'Nordic Warehouses', contact: 'Erik Solberg', date: 'Oct 21, 2026', amount: 5600.00, itemsCount: 12, status: 'Invoiced' },
  { id: 'QT-2026-094', customer: 'Summit Medical Clinic', contact: 'Dr. Sarah Chen', date: 'Oct 20, 2026', amount: 920.00, itemsCount: 2, status: 'Draft' },
  { id: 'QT-2026-095', customer: 'Highland Residency Club', contact: 'Carlos Mendez', date: 'Oct 19, 2026', amount: 2150.00, itemsCount: 5, status: 'Approved' },
];

export default function SalesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState('');

  const filteredQuotes = quotes.filter((q) => {
    const matchesFilter = filter === 'all' || q.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      q.customer.toLowerCase().includes(search.toLowerCase()) ||
      q.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !amount) return;

    const newQuote: Quote = {
      id: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      customer,
      contact: 'Primary Contact',
      date: 'Today',
      amount: parseFloat(amount) || 0,
      itemsCount: 1,
      status: 'Draft',
    };

    setQuotes([newQuote, ...quotes]);
    setNewModalOpen(false);
    setCustomer('');
    setAmount('');
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#A8462F]/15 text-[#A8462F] border border-[#A8462F]/30 font-mono">
              Sales &amp; Quotations
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              Active Module
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Commercial Orders &amp; Price Quotes
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Generate customized commercial proposals, automate discount limits, and convert quotes to orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/applications"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            ← Apps Suite
          </Link>
          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Price Quote</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Total Pipeline Value</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">$13,940.00</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+18.5% win rate</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Approved Quotes</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">2</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Ready for order fulfillment</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Avg Cycle Time</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">4.2 Days</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Quote sent to acceptance</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Active Proposals</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">{quotes.length}</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Acme Corp catalog items</p>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border dark:border-[#2A2B27] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['all', 'draft', 'sent', 'approved', 'invoiced'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                  filter === st
                    ? 'bg-accent/15 text-accent border border-accent/30 font-bold'
                    : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search quotes or client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-accent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-4">Quote Ref</th>
                <th className="py-3 px-4">Client / Company</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
              {filteredQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-accent">{q.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-ink dark:text-white">{q.customer}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{q.date}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      q.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      q.status === 'Sent' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                      q.status === 'Invoiced' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' :
                      'bg-neutral-500/10 text-neutral-500'
                    }`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white">
                    ${q.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2A2B27] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-ink dark:text-white">New Price Quote</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink dark:text-neutral-300 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Industrial"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-ink dark:text-neutral-300 mb-1">Total Quote Amount ($)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2400"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-border dark:border-[#2A2B27] text-ink dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-accent text-white font-bold"
                >
                  Save Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
