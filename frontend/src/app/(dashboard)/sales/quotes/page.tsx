'use client';

import { useState, useMemo } from 'react';
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Mail,
  Edit,
  Sparkles,
  Clock,
  DollarSign,
  Layers,
} from 'lucide-react';
import { SalesNav } from '@/components/sales/SalesNav';
import { useSalesStore } from '@/components/sales/useSalesStore';
import { NewQuoteModal } from '@/components/sales/NewQuoteModal';
import { NewOrderModal } from '@/components/sales/NewOrderModal';
import { SendQuoteEmailModal } from '@/components/sales/SendQuoteEmailModal';
import { QuoteDetailsModal } from '@/components/sales/QuoteDetailsModal';
import { QuoteKanbanBoard } from '@/components/sales/QuoteKanbanBoard';
import { QuoteComparisonModal } from '@/components/sales/QuoteComparisonModal';
import { Quote, formatCurrency, getExpiryStatus } from '@/components/sales/salesData';

type SortColumn =
  | 'id'
  | 'customer'
  | 'date'
  | 'validUntil'
  | 'itemsCount'
  | 'winProbability'
  | 'status'
  | 'amount';

type QuickChip = 'all' | 'urgent' | 'high_value' | 'followup' | 'high_odds';

export default function QuotationsPage() {
  const {
    quotes,
    orders,
    discountRules,
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
    updateQuote,
    updateQuoteStatus,
    convertQuoteToOrder,
    convertQuoteToInvoice,
    sendQuoteEmail,
    addQuoteInternalNote,
    simulateClientView,
    addOrder,
  } = useSalesStore();

  const [filter, setFilter] = useState<string>('all');
  const [quickChip, setQuickChip] = useState<QuickChip>('all');
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Modals state
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteToEdit, setQuoteToEdit] = useState<Quote | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [emailModalQuote, setEmailModalQuote] = useState<Quote | null>(null);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [comparisonQuotes, setComparisonQuotes] = useState<[Quote | null, Quote | null]>([null, null]);

  // Keep selectedQuote reactive to store updates
  const selectedQuote = useMemo(
    () => quotes.find((q) => q.id === selectedQuoteId) || null,
    [quotes, selectedQuoteId]
  );

  // Sorting Handler
  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(col);
      setSortDirection('desc');
    }
  };

  // Filter & Search Logic
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      // Status Tab filter
      const matchesStatusTab =
        filter === 'all' || q.status.toLowerCase() === filter.toLowerCase();

      // Quick Chip filter
      let matchesChip = true;
      if (quickChip === 'urgent') {
        const exp = getExpiryStatus(q.validUntil);
        matchesChip = (exp.isUrgent || exp.isExpired) && q.status !== 'Converted';
      } else if (quickChip === 'high_value') {
        matchesChip = q.amount >= 3000;
      } else if (quickChip === 'followup') {
        matchesChip = q.status === 'Sent';
      } else if (quickChip === 'high_odds') {
        matchesChip = (q.winProbability ?? 0) >= 80;
      }

      // Search match
      const matchesSearch =
        q.customer.toLowerCase().includes(search.toLowerCase()) ||
        q.id.toLowerCase().includes(search.toLowerCase()) ||
        q.contact.toLowerCase().includes(search.toLowerCase()) ||
        (q.notes && q.notes.toLowerCase().includes(search.toLowerCase()));

      return matchesStatusTab && matchesChip && matchesSearch;
    });
  }, [quotes, filter, quickChip, search]);

  // Sorted Quotes
  const sortedQuotes = useMemo(() => {
    return [...filteredQuotes].sort((a, b) => {
      let result = 0;
      if (sortColumn === 'id') {
        result = a.id.localeCompare(b.id);
      } else if (sortColumn === 'customer') {
        result = a.customer.localeCompare(b.customer);
      } else if (sortColumn === 'date') {
        result = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortColumn === 'validUntil') {
        result = new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime();
      } else if (sortColumn === 'itemsCount') {
        result = a.itemsCount - b.itemsCount;
      } else if (sortColumn === 'winProbability') {
        result = (a.winProbability ?? 0) - (b.winProbability ?? 0);
      } else if (sortColumn === 'status') {
        result = a.status.localeCompare(b.status);
      } else if (sortColumn === 'amount') {
        result = a.amount - b.amount;
      }
      return sortDirection === 'asc' ? result : -result;
    });
  }, [filteredQuotes, sortColumn, sortDirection]);

  const filterTabs = [
    { id: 'all', label: 'All Quotes', count: quotes.length },
    { id: 'draft', label: 'Draft', count: quotes.filter((q) => q.status === 'Draft').length },
    { id: 'sent', label: 'Sent', count: quotes.filter((q) => q.status === 'Sent').length },
    { id: 'approved', label: 'Approved', count: quotes.filter((q) => q.status === 'Approved').length },
    { id: 'converted', label: 'Converted', count: quotes.filter((q) => q.status === 'Converted').length },
    { id: 'expired', label: 'Expired', count: quotes.filter((q) => q.status === 'Expired').length },
  ];

  // Quick Chips Counts
  const urgentCount = quotes.filter((q) => {
    const exp = getExpiryStatus(q.validUntil);
    return (exp.isUrgent || exp.isExpired) && q.status !== 'Converted';
  }).length;
  const highValCount = quotes.filter((q) => q.amount >= 3000).length;
  const followupCount = quotes.filter((q) => q.status === 'Sent').length;
  const highOddsCount = quotes.filter((q) => (q.winProbability ?? 0) >= 80).length;

  // Batch selection calculations
  const allFilteredSelected =
    sortedQuotes.length > 0 &&
    sortedQuotes.every((q) => selectedQuoteIds.includes(q.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      clearSelectedQuotes();
    } else {
      selectAllQuotes(sortedQuotes.map((q) => q.id));
    }
  };

  const selectedTotalAmount = quotes
    .filter((q) => selectedQuoteIds.includes(q.id))
    .reduce((sum, q) => sum + q.amount, 0);

  const handleExportCSV = () => {
    const selected = quotes.filter((q) => selectedQuoteIds.includes(q.id));
    const rows = [
      ['Quote ID', 'Customer', 'Contact', 'Amount (USD)', 'Status', 'Valid Until', 'Win Odds %'],
      ...selected.map((q) => [
        q.id,
        q.customer,
        q.contact,
        q.amount.toString(),
        q.status,
        q.validUntil,
        (q.winProbability ?? 70).toString(),
      ]),
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

  const handleEditQuote = (q: Quote) => {
    setQuoteToEdit(q);
    setQuoteModalOpen(true);
  };

  const handleOpenEmailModal = (q: Quote) => {
    setEmailModalQuote(q);
  };

  const renderSortIndicator = (col: SortColumn) => {
    if (sortColumn !== col) {
      return <ArrowUpDown className="w-3 h-3 text-ink-muted/40 inline ml-1" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-accent inline ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-accent inline ml-1" />
    );
  };

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
        onNewQuote={() => {
          setQuoteToEdit(null);
          setQuoteModalOpen(true);
        }}
        onNewOrder={() => setOrderModalOpen(true)}
      />

      {/* Header Info & View Switcher Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="text-lg font-extrabold text-ink dark:text-neutral-100 tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-accent" />
              <span>Price Quotes &amp; Estimates</span>
            </h2>
            {urgentCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span>{urgentCount} Expiring Soon</span>
              </span>
            )}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Create price quotes for customers, email them directly, and turn accepted quotes into orders with one click.
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
            onClick={() => {
              setComparisonQuotes([quotes[0] || null, quotes[1] || null]);
              setComparisonModalOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:border-accent hover:text-accent transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Compare quotes side-by-side"
          >
            <Layers className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Compare Quotes</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQuoteToEdit(null);
              setQuoteModalOpen(true);
            }}
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
          quotes={sortedQuotes}
          currency={currency}
          onSelectQuote={(q) => setSelectedQuoteId(q.id)}
          onUpdateStatus={updateQuoteStatus}
          onConvertToOrder={convertQuoteToOrder}
          onExtendValidity={extendQuoteValidity}
          onDuplicateQuote={duplicateQuote}
          onOpenEmailModal={(q) => setEmailModalQuote(q)}
          onEditQuote={(q) => {
            setQuoteToEdit(q);
            setQuoteModalOpen(true);
          }}
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
                placeholder="Search by client, ID, or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#141513] text-ink dark:text-white placeholder:text-ink-muted/60 focus:outline-hidden focus:border-accent shadow-2xs"
              />
            </div>
          </div>

          {/* Quick Filter Chips Sub-bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-bold text-ink-muted dark:text-neutral-500 uppercase tracking-wider shrink-0 mr-1">
              Quick Filter:
            </span>

            <button
              type="button"
              onClick={() => setQuickChip('all')}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                quickChip === 'all'
                  ? 'border-accent bg-accent/10 text-accent font-bold'
                  : 'border-border dark:border-[#2A2B27] text-ink-muted hover:text-ink dark:hover:text-white'
              }`}
            >
              All Items ({quotes.length})
            </button>

            <button
              type="button"
              onClick={() => setQuickChip('urgent')}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                quickChip === 'urgent'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                  : 'border-border dark:border-[#2A2B27] text-ink-muted hover:text-ink dark:hover:text-white'
              }`}
            >
              <Clock className="w-3 h-3 text-amber-500" />
              <span>Expiring Soon ({urgentCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setQuickChip('high_value')}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                quickChip === 'high_value'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'border-border dark:border-[#2A2B27] text-ink-muted hover:text-ink dark:hover:text-white'
              }`}
            >
              <DollarSign className="w-3 h-3 text-emerald-500" />
              <span>High Value &gt; $3k ({highValCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setQuickChip('followup')}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                quickChip === 'followup'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-border dark:border-[#2A2B27] text-ink-muted hover:text-ink dark:hover:text-white'
              }`}
            >
              <Mail className="w-3 h-3 text-blue-500" />
              <span>Needs Follow-up ({followupCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setQuickChip('high_odds')}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                quickChip === 'high_odds'
                  ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold'
                  : 'border-border dark:border-[#2A2B27] text-ink-muted hover:text-ink dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>Likely to Close &ge; 80% ({highOddsCount})</span>
            </button>
          </div>

          {/* Quotes Data Table */}
          <div className="border border-border/80 dark:border-[#2A2B27] rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[920px]">
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
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-accent select-none"
                    onClick={() => handleSort('id')}
                  >
                    <span>Quote Ref</span>
                    {renderSortIndicator('id')}
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-accent select-none"
                    onClick={() => handleSort('customer')}
                  >
                    <span>Client / Company</span>
                    {renderSortIndicator('customer')}
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-accent select-none"
                    onClick={() => handleSort('date')}
                  >
                    <span>Issue Date</span>
                    {renderSortIndicator('date')}
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-accent select-none"
                    onClick={() => handleSort('validUntil')}
                  >
                    <span>Validity / Expiry</span>
                    {renderSortIndicator('validUntil')}
                  </th>
                  <th
                    className="py-3 px-4 text-center cursor-pointer hover:text-accent select-none"
                    onClick={() => handleSort('itemsCount')}
                  >
                    <span>Items</span>
                    {renderSortIndicator('itemsCount')}
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-accent select-none"
                    onClick={() => handleSort('winProbability')}
                  >
                    <span>Win Odds</span>
                    {renderSortIndicator('winProbability')}
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-accent select-none"
                    onClick={() => handleSort('status')}
                  >
                    <span>Status</span>
                    {renderSortIndicator('status')}
                  </th>
                  <th
                    className="py-3 px-4 text-right cursor-pointer hover:text-accent select-none"
                    onClick={() => handleSort('amount')}
                  >
                    <span>Amount ({currency})</span>
                    {renderSortIndicator('amount')}
                  </th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
                {sortedQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-10 text-center text-ink-muted dark:text-neutral-500">
                      No quotations match the active filter or search criteria.
                    </td>
                  </tr>
                ) : (
                  sortedQuotes.map((q) => {
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
                        onClick={() => setSelectedQuoteId(q.id)}
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
                            className="flex items-center justify-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Fast Email Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEmailModal(q)}
                              className="p-1.5 rounded-lg text-ink-muted hover:text-accent hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                              title="Email Proposal to Client"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>

                            {/* Fast Edit Button */}
                            {q.status !== 'Converted' && (
                              <button
                                type="button"
                                onClick={() => handleEditQuote(q)}
                                className="p-1.5 rounded-lg text-ink-muted hover:text-accent hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                title="Edit Quotation"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Fast Duplicate Button */}
                            <button
                              type="button"
                              onClick={() => duplicateQuote(q.id)}
                              className="p-1.5 rounded-lg text-ink-muted hover:text-accent hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                              title="Duplicate Quote"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* View Details Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedQuoteId(q.id)}
                              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Book Order Button */}
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

            {selectedQuoteIds.length === 2 && (
              <button
                type="button"
                onClick={() => {
                  setComparisonQuotes([
                    quotes.find((q) => q.id === selectedQuoteIds[0]) || null,
                    quotes.find((q) => q.id === selectedQuoteIds[1]) || null,
                  ]);
                  setComparisonModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Compare (2)</span>
              </button>
            )}

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
        quoteToEdit={quoteToEdit}
        discountRules={discountRules}
        onClose={() => {
          setQuoteModalOpen(false);
          setQuoteToEdit(null);
        }}
        onCreateQuote={addQuote}
        onUpdateQuote={updateQuote}
      />

      <QuoteComparisonModal
        quoteA={comparisonQuotes[0]}
        quoteB={comparisonQuotes[1]}
        allQuotes={quotes}
        currency={currency}
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        onConvertToOrder={convertQuoteToOrder}
        onSelectQuote={(q) => setSelectedQuoteId(q.id)}
      />

      <SendQuoteEmailModal
        isOpen={Boolean(emailModalQuote)}
        quote={emailModalQuote}
        currency={currency}
        onClose={() => setEmailModalQuote(null)}
        onSendEmail={sendQuoteEmail}
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
        onClose={() => setSelectedQuoteId(null)}
        onConvertToOrder={convertQuoteToOrder}
        onConvertToInvoice={convertQuoteToInvoice}
        onStatusChange={updateQuoteStatus}
        onExtendValidity={extendQuoteValidity}
        onCreateRevision={createQuoteRevision}
        onDuplicateQuote={duplicateQuote}
        onSignAndAccept={signAndAcceptQuote}
        onOpenEmailModal={handleOpenEmailModal}
        onEditQuote={handleEditQuote}
        onAddInternalNote={addQuoteInternalNote}
        onSimulateClientView={simulateClientView}
      />
    </div>
  );
}
