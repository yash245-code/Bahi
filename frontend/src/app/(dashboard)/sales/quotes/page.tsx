'use client';

import { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Plus,
  Eye,
  ShoppingBag,
  LayoutGrid,
  List,
  Copy,
  Calendar,
  CheckCircle2,
  Send,
  Download,
  X,
  AlertCircle,
} from 'lucide-react';
import { SalesNav } from '@/components/sales/SalesNav';
import { useSalesStore } from '@/components/sales/useSalesStore';
import { NewQuoteModal } from '@/components/sales/NewQuoteModal';
import { NewOrderModal } from '@/components/sales/NewOrderModal';
import { QuoteDetailsModal } from '@/components/sales/QuoteDetailsModal';
import { QuoteKanbanBoard } from '@/components/sales/QuoteKanbanBoard';
import { Quote, formatCurrency, getExpiryStatus } from '@/components/sales/salesData';

export default function QuotationsPage() {
  const {
    quotes,
    orders,
    currency,
    setCurrency,
    activeView,
    setActiveView,
    selectedQuoteIds,
    toggleSelectQuote,
    selectAllQuotes,
    clearSelectedQuotes,
    batchUpdateQuoteStatus,
    batchExtendValidity,
    extendQuoteValidity,
    createQuoteRevision,
    duplicateQuote,
    signAndAcceptQuote,
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

  // Batch selection calculations
  const allFilteredSelected =
    filteredQuotes.length > 0 &&
    filteredQuotes.every((q) => selectedQuoteIds.includes(q.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      clearSelectedQuotes();
    } else {
      selectAllQuotes(filteredQuotes.map((q) => q.id));
    }
  };

  const selectedTotalAmount = quotes
    .filter((q) => selectedQuoteIds.includes(q.id))
    .reduce((sum, q) => sum + q.amount, 0);

  const handleExportCSV = () => {
    const selected = quotes.filter((q) => selectedQuoteIds.includes(q.id));
    const rows = [
      ['Quote ID', 'Customer', 'Contact', 'Amount (USD)', 'Status', 'Valid Until'],
      ...selected.map((q) => [q.id, q.customer, q.contact, q.amount.toString(), q.status, q.validUntil]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bahi_quotes_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Urgent quotes calculation
  const urgentQuotesCount = quotes.filter((q) => {
    const exp = getExpiryStatus(q.validUntil);
    return (exp.isUrgent || exp.isExpired) && q.status !== 'Converted';
  }).length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in relative pb-28">
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
        pipelineTotal={formatCurrency(pipelineValue, currency)}
        currency={currency}
        onCurrencyChange={setCurrency}
        onNewQuote={() => setQuoteModalOpen(true)}
        onNewOrder={() => setOrderModalOpen(true)}
      />

      {/* Header Info & View Switcher Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="text-lg font-extrabold text-ink dark:text-neutral-100 tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-accent" />
              <span>Commercial Quotations &amp; Price Proposals</span>
            </h2>
            {urgentQuotesCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span>{urgentQuotesCount} Action Required</span>
              </span>
            )}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Generate formal itemized estimates, track proposal delivery, negotiate multi-currency discounts, and convert accepted quotes into fulfilled orders.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Toggle: Table vs Kanban */}
          <div className="p-1 rounded-xl bg-neutral-100 dark:bg-[#141513] border border-border/80 dark:border-[#2A2B27] flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveView('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'table'
                  ? 'bg-white dark:bg-[#1A1B18] text-ink dark:text-white shadow-2xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
              title="Table Grid View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('kanban')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'kanban'
                  ? 'bg-white dark:bg-[#1A1B18] text-ink dark:text-white shadow-2xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
              title="Kanban Pipeline Board"
            >
              <LayoutGrid className="w-4 h-4 text-accent" />
              <span className="hidden sm:inline">Kanban Board</span>
            </button>
          </div>

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

      {/* ─── KANBAN VIEW ─── */}
      {activeView === 'kanban' ? (
        <QuoteKanbanBoard
          quotes={filteredQuotes}
          currency={currency}
          onSelectQuote={(q) => setSelectedQuote(q)}
          onUpdateStatus={updateQuoteStatus}
          onConvertToOrder={convertQuoteToOrder}
          onExtendValidity={extendQuoteValidity}
          onDuplicateQuote={duplicateQuote}
        />
      ) : (
        /* ─── TABLE VIEW ─── */
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
            <table className="w-full text-left text-xs min-w-[850px]">
              <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-3 px-3 text-center w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={handleToggleSelectAll}
                      className="rounded accent-accent cursor-pointer"
                      title="Select All Quotes"
                    />
                  </th>
                  <th className="py-3 px-4">Quote Ref</th>
                  <th className="py-3 px-4">Client / Company</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Validity / Expiry</th>
                  <th className="py-3 px-4 text-center">Items</th>
                  <th className="py-3 px-4">Win Odds</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount ({currency})</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
                {filteredQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-10 text-center text-ink-muted dark:text-neutral-500">
                      No quotations match the active filter or search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredQuotes.map((q) => {
                    const isSelected = selectedQuoteIds.includes(q.id);
                    const expiry = getExpiryStatus(q.validUntil);
                    const winOdds = q.winProbability ?? 72;

                    return (
                      <tr
                        key={q.id}
                        className={`transition-colors group cursor-pointer ${
                          isSelected
                            ? 'bg-accent/5 dark:bg-accent/10'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                        }`}
                        onClick={() => setSelectedQuote(q)}
                      >
                        <td
                          className="py-3.5 px-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectQuote(q.id)}
                            className="rounded accent-accent cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-accent">
                          <div className="flex items-center gap-1.5">
                            <span>{q.id}</span>
                            {q.version && q.version > 1 && (
                              <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-accent/15 text-accent font-bold">
                                v{q.version}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-ink dark:text-white group-hover:text-accent transition-colors">
                            {q.customer}
                          </div>
                          <div className="text-[11px] text-ink-muted dark:text-neutral-400">
                            {q.contact}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400 font-mono text-[11px]">
                          {q.date}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${expiry.badgeClass}`}>
                              {expiry.label}
                            </span>
                            {expiry.isUrgent && q.status !== 'Converted' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  extendQuoteValidity(q.id, 7);
                                }}
                                className="text-[10px] px-1.5 py-0.5 rounded text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 font-bold"
                                title="Quickly add 7 days validity"
                              >
                                +7d
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-ink dark:text-neutral-200">
                          {q.itemsCount}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="w-20 space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-ink-muted">{winOdds}%</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  winOdds >= 80
                                    ? 'bg-emerald-500'
                                    : winOdds >= 50
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${winOdds}%` }}
                              />
                            </div>
                          </div>
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
                          {formatCurrency(q.amount, currency)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div
                            className="flex items-center justify-end gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => duplicateQuote(q.id)}
                              className="p-1.5 rounded-lg text-ink-muted hover:text-accent hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                              title="Duplicate Quote"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── FLOATING BATCH ACTIONS TOOLBAR ─── */}
      {selectedQuoteIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#141513]/95 backdrop-blur-md text-white border border-neutral-700/80 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-up text-xs font-semibold">
          <div className="flex items-center gap-2 pr-3 border-r border-neutral-700">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span className="font-bold">{selectedQuoteIds.length} Selected</span>
            <span className="text-neutral-400 font-mono">
              ({formatCurrency(selectedTotalAmount, currency)})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => batchUpdateQuoteStatus(selectedQuoteIds, 'Approved')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Approved</span>
            </button>

            <button
              type="button"
              onClick={() => batchUpdateQuoteStatus(selectedQuoteIds, 'Sent')}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to Clients</span>
            </button>

            <button
              type="button"
              onClick={() => batchExtendValidity(selectedQuoteIds, 7)}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>+7d Validity</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl border border-neutral-600 hover:bg-neutral-800 text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={clearSelectedQuotes}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Clear Selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewQuoteModal
        isOpen={quoteModalOpen}
        currency={currency}
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
        currency={currency}
        onClose={() => setSelectedQuote(null)}
        onConvertToOrder={convertQuoteToOrder}
        onStatusChange={updateQuoteStatus}
        onExtendValidity={extendQuoteValidity}
        onCreateRevision={createQuoteRevision}
        onDuplicateQuote={duplicateQuote}
        onSignAndAccept={signAndAcceptQuote}
      />
    </div>
  );
}
