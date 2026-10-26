'use client';

import { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Plus,
  Eye,
  ShoppingBag,
} from 'lucide-react';
import { SalesNav } from '@/components/sales/SalesNav';
import { useSalesStore } from '@/components/sales/useSalesStore';
import { NewQuoteModal } from '@/components/sales/NewQuoteModal';
import { NewOrderModal } from '@/components/sales/NewOrderModal';
import { QuoteDetailsModal } from '@/components/sales/QuoteDetailsModal';
import { Quote } from '@/components/sales/salesData';

export default function QuotationsPage() {
  const {
    quotes,
    orders,
    toastMessage,
    pipelineValue,
    addQuote,
    updateQuoteStatus,
    convertQuoteToOrder,
    addOrder,
  } = useSalesStore();

  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const filteredQuotes = quotes.filter((q) => {
    const matchesFilter =
      filter === 'all' || q.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      q.customer.toLowerCase().includes(search.toLowerCase()) ||
      q.id.toLowerCase().includes(search.toLowerCase()) ||
      q.contact.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterTabs = [
    { id: 'all', label: 'All Quotes', count: quotes.length },
    { id: 'draft', label: 'Draft', count: quotes.filter((q) => q.status === 'Draft').length },
    { id: 'sent', label: 'Sent', count: quotes.filter((q) => q.status === 'Sent').length },
    { id: 'approved', label: 'Approved', count: quotes.filter((q) => q.status === 'Approved').length },
    { id: 'converted', label: 'Converted', count: quotes.filter((q) => q.status === 'Converted').length },
    { id: 'expired', label: 'Expired', count: quotes.filter((q) => q.status === 'Expired').length },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#141513] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-neutral-700 flex items-center gap-2 text-xs font-semibold animate-slide-down">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <SalesNav
        quotesCount={quotes.length}
        ordersCount={orders.length}
        pipelineTotal={`$${pipelineValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
        onNewQuote={() => setQuoteModalOpen(true)}
        onNewOrder={() => setOrderModalOpen(true)}
      />

      {/* Header Info Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-ink dark:text-neutral-100 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-accent" />
            <span>Commercial Quotations &amp; Price Proposals</span>
          </h2>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Generate formal itemized estimates, track proposal delivery, negotiate discounts within policy guidelines, and convert accepted quotes into fulfilled orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuoteModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Quote</span>
          </button>
        </div>
      </div>

      {/* Filters and Table Container */}
      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden space-y-4 p-4">
        {/* Filter Controls Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-neutral-100/70 dark:bg-[#141513] rounded-xl text-xs font-semibold no-scrollbar">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  filter === tab.id
                    ? 'bg-accent text-white font-bold shadow-xs'
                    : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    filter === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white dark:bg-neutral-800 text-ink-muted dark:text-neutral-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by client, ID, or contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#141513] text-ink dark:text-white placeholder:text-ink-muted/60 focus:outline-hidden focus:border-accent shadow-2xs"
            />
          </div>
        </div>

        {/* Quotes Data Table */}
        <div className="border border-border/80 dark:border-[#2A2B27] rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-4">Quote Ref</th>
                <th className="py-3 px-4">Client / Company</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Valid Until</th>
                <th className="py-3 px-4 text-center">Items</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-ink-muted dark:text-neutral-500">
                    No quotations match the active filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => (
                  <tr
                    key={q.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedQuote(q)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {q.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-ink dark:text-white group-hover:text-accent transition-colors">
                        {q.customer}
                      </div>
                      <div className="text-[11px] text-ink-muted dark:text-neutral-400">
                        {q.contact}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">
                      {q.date}
                    </td>
                    <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400 font-mono text-[11px]">
                      {q.validUntil}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-ink dark:text-neutral-200">
                      {q.itemsCount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          q.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : q.status === 'Sent'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : q.status === 'Converted'
                            ? 'bg-[#A8462F]/15 text-[#A8462F] dark:text-[#E0724F] border border-[#A8462F]/30'
                            : q.status === 'Expired'
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                            : 'bg-neutral-500/10 text-neutral-500'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white">
                      ${q.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedQuote(q)}
                          className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {q.status !== 'Converted' ? (
                          <button
                            type="button"
                            onClick={() => convertQuoteToOrder(q)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                            title="Convert into confirmed Sales Order"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Book Order</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-ink-muted px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                            Booked
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <NewQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        onCreateQuote={addQuote}
      />

      <NewOrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onCreateOrder={addOrder}
      />

      <QuoteDetailsModal
        quote={selectedQuote}
        isOpen={Boolean(selectedQuote)}
        onClose={() => setSelectedQuote(null)}
        onConvertToOrder={convertQuoteToOrder}
        onStatusChange={updateQuoteStatus}
      />
    </div>
  );
}
