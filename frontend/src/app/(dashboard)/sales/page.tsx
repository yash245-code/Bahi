'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { SalesNav } from '@/components/sales/SalesNav';
import { useSalesStore } from '@/components/sales/useSalesStore';
import { NewQuoteModal } from '@/components/sales/NewQuoteModal';
import { NewOrderModal } from '@/components/sales/NewOrderModal';
import { QuoteDetailsModal } from '@/components/sales/QuoteDetailsModal';
import { OrderDetailsModal } from '@/components/sales/OrderDetailsModal';
import { Quote, SalesOrder, formatCurrency, getExpiryStatus } from '@/components/sales/salesData';

export default function SalesOverviewPage() {
  const {
    quotes,
    orders,
    currency,
    setCurrency,
    toastMessage,
    pipelineValue,
    ordersBookedValue,
    winRate,
    addQuote,
    updateQuoteStatus,
    convertQuoteToOrder,
    addOrder,
    updateOrderStatus,
    extendQuoteValidity,
    createQuoteRevision,
    duplicateQuote,
    signAndAcceptQuote,
  } = useSalesStore();

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  // Stats calculation
  const draftQuotesCount = quotes.filter((q) => q.status === 'Draft').length;
  const sentQuotesCount = quotes.filter((q) => q.status === 'Sent').length;
  const approvedQuotesCount = quotes.filter((q) => q.status === 'Approved').length;
  const convertedQuotesCount = quotes.filter((q) => q.status === 'Converted').length;

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Confirmed' || o.status === 'Processing'
  ).length;

  // Urgent quotes requiring rep attention
  const urgentQuotes = quotes.filter((q) => {
    const exp = getExpiryStatus(q.validUntil);
    return (exp.isUrgent || exp.isExpired) && q.status !== 'Converted';
  });

  // Average discount across active quotes
  const avgDiscount =
    quotes.length > 0
      ? (quotes.reduce((acc, q) => acc + q.discountPercent, 0) / quotes.length).toFixed(1)
      : '0.0';

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-7 animate-fade-in">
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

      {/* ─── Top KPI Cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pipeline */}
        <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] p-5 rounded-2xl shadow-xs hover:border-[#A8462F]/40 transition-all group">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-ink-muted dark:text-neutral-400 uppercase tracking-wider">
              Quotation Pipeline ({currency})
            </span>
            <span className="inline-flex items-center gap-1 bg-[#A8462F]/10 dark:bg-[#A8462F]/20 text-accent border border-[#A8462F]/20 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono">
              {quotes.length} active
            </span>
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono tracking-tight">
            {formatCurrency(pipelineValue, currency)}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>Avg validity cycle: 14 days</span>
          </p>
        </div>

        {/* Card 2: Booked Orders */}
        <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] p-5 rounded-2xl shadow-xs hover:border-emerald-500/40 transition-all group">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-ink-muted dark:text-neutral-400 uppercase tracking-wider">
              Confirmed Orders ({currency})
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono">
              <TrendingUp className="w-2.5 h-2.5" />
              {orders.length} booked
            </span>
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono tracking-tight">
            {formatCurrency(ordersBookedValue, currency)}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-2">
            {pendingOrdersCount} orders currently in fulfillment
          </p>
        </div>

        {/* Card 3: Win / Conversion Rate */}
        <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] p-5 rounded-2xl shadow-xs hover:border-[#A8462F]/40 transition-all group">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-ink-muted dark:text-neutral-400 uppercase tracking-wider">
              Proposal Win Rate
            </span>
            <span className="inline-flex items-center gap-1 bg-[#1F7A4D]/10 text-[#1F7A4D] dark:text-[#38BD7E] border border-[#1F7A4D]/25 px-2 py-0.5 rounded-md text-[10px] font-bold">
              +4.8% vs Q3
            </span>
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono tracking-tight">
            {winRate}%
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-2">
            {approvedQuotesCount + convertedQuotesCount} converted or approved of {quotes.length}
          </p>
        </div>

        {/* Card 4: Sales Velocity & Safeguard */}
        <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] p-5 rounded-2xl shadow-xs hover:border-[#A8462F]/40 transition-all group">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-ink-muted dark:text-neutral-400 uppercase tracking-wider">
              Avg Sales Velocity
            </span>
            <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25 px-2 py-0.5 rounded-md text-[10px] font-bold">
              5.8 Days
            </span>
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono tracking-tight flex items-baseline gap-2">
            <span>{avgDiscount}%</span>
            <span className="text-xs font-normal text-ink-muted">avg discount</span>
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>25% Margin Floor Enforced</span>
          </p>
        </div>
      </div>

      {/* ─── Commercial Conversion Funnel ─────────────── */}
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] p-5 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span>Commercial Pipeline Velocity Funnel</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-mono font-bold">
                End-to-End Commerce
              </span>
            </h2>
            <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
              Live progression from draft proposal generation through customer approval to sales order booking.
            </p>
          </div>

          <Link
            href="/sales/quotes"
            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
          >
            <span>Manage Quotations Board</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Funnel Progress Bars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2A2B27] space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-ink-muted dark:text-neutral-400">
                1. Draft Quotes
              </span>
              <span className="text-[9px] font-mono text-ink-muted">100%</span>
            </div>
            <div className="text-xl font-black text-ink dark:text-white font-mono">
              {draftQuotesCount}
            </div>
            <p className="text-[11px] text-ink-muted">In preparation</p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2A2B27] space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                2. Sent to Client
              </span>
              <span className="text-[9px] font-mono text-blue-600">82%</span>
            </div>
            <div className="text-xl font-black text-ink dark:text-white font-mono">
              {sentQuotesCount}
            </div>
            <p className="text-[11px] text-ink-muted">Under client review</p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2A2B27] space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                3. Accepted
              </span>
              <span className="text-[9px] font-mono text-emerald-600">65%</span>
            </div>
            <div className="text-xl font-black text-ink dark:text-white font-mono">
              {approvedQuotesCount}
            </div>
            <p className="text-[11px] text-ink-muted">Ready to book</p>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2A2B27] space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-accent">
                4. Booked Orders
              </span>
              <span className="text-[9px] font-mono text-accent">50%</span>
            </div>
            <div className="text-xl font-black text-ink dark:text-white font-mono">
              {orders.length}
            </div>
            <p className="text-[11px] text-ink-muted">Fulfillment live</p>
          </div>
        </div>
      </div>

      {/* ─── Urgent Action Items Banner (Dynamic Expiry Radar) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {urgentQuotes.length > 0 ? (
          urgentQuotes.slice(0, 2).map((uq) => {
            const exp = getExpiryStatus(uq.validUntil);
            return (
              <div
                key={uq.id}
                className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#1A1B18] border border-amber-500/30 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-ink dark:text-white truncate">
                        Quote Expiry Radar: {uq.customer}
                      </h3>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${exp.badgeClass}`}>
                        {exp.label}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5 truncate">
                      {uq.id} ({formatCurrency(uq.amount, currency)}) valid until {uq.validUntil}.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => extendQuoteValidity(uq.id, 7)}
                    className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg hover:bg-amber-500/20 cursor-pointer"
                    title="Extend validity +7 days"
                  >
                    +7d
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedQuote(uq)}
                    className="text-xs font-bold text-accent hover:underline cursor-pointer"
                  >
                    Review →
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#1A1B18] border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-semibold text-ink dark:text-white">
              All commercial quotations have healthy validity windows.
            </span>
          </div>
        )}

        {/* Quick Win / Approved Action Card */}
        {approvedQuotesCount > 0 ? (
          <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#1A1B18] border border-emerald-500/30 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-ink dark:text-white">
                  {approvedQuotesCount} Accepted Quotes Ready for Booking
                </h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
                  Proposals formally approved by clients. 1-click booking converts immediately into Sales Orders.
                </p>
              </div>
            </div>

            <Link
              href="/sales/quotes"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 flex items-center gap-1"
            >
              <span>Book Now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#1A1B18] border border-blue-500/30 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-ink dark:text-white">
              Pipeline conversion operating at target speed.
            </span>
            <Link href="/sales/quotes" className="text-xs font-bold text-accent hover:underline">
              View All Quotes →
            </Link>
          </div>
        )}
      </div>

      {/* ─── 2-Column Split: Active Quotations & Orders ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Quotations */}
        <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-ink dark:text-white">
                Active Commercial Quotations
              </h2>
            </div>
            <Link
              href="/sales/quotes"
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              <span>View All ({quotes.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-border/60 dark:divide-[#2A2B27]">
            {quotes.slice(0, 5).map((q) => {
              const exp = getExpiryStatus(q.validUntil);
              return (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuote(q)}
                  className="p-4 hover:bg-[#FAF9F5] dark:hover:bg-[#141513] transition-colors cursor-pointer group flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs font-bold text-accent">
                        {q.id}
                      </span>
                      {q.version && q.version > 1 && (
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-accent/15 text-accent font-bold">
                          v{q.version}
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                          q.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : q.status === 'Sent'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : q.status === 'Converted'
                            ? 'bg-[#A8462F]/15 text-[#A8462F] dark:text-[#E0724F] border border-[#A8462F]/30'
                            : 'bg-neutral-500/10 text-neutral-500'
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-ink dark:text-white truncate group-hover:text-accent transition-colors">
                      {q.customer}
                    </p>
                    <p className="text-[11px] text-ink-muted dark:text-neutral-400">
                      {q.contact} • {q.itemsCount} items
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-black text-ink dark:text-white">
                      {formatCurrency(q.amount, currency)}
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${exp.badgeClass}`}>
                      {exp.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Confirmed Sales Orders */}
        <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-ink dark:text-white">
                Confirmed Sales Orders
              </h2>
            </div>
            <Link
              href="/sales/orders"
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-border/60 dark:divide-[#2A2B27]">
            {orders.slice(0, 5).map((o) => (
              <div
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className="p-4 hover:bg-[#FAF9F5] dark:hover:bg-[#141513] transition-colors cursor-pointer group flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {o.id}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                        o.status === 'Fulfilled'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : o.status === 'Processing'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-ink dark:text-white truncate group-hover:text-accent transition-colors">
                    {o.customer}
                  </p>
                  <p className="text-[11px] text-ink-muted dark:text-neutral-400">
                    Est. delivery: {o.deliveryDate}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-xs font-black text-ink dark:text-white">
                    {formatCurrency(o.amount, currency)}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      o.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {o.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Modals ────────────────────────────────────── */}
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
        currency={currency}
        isOpen={Boolean(selectedQuote)}
        onClose={() => setSelectedQuote(null)}
        onConvertToOrder={convertQuoteToOrder}
        onStatusChange={updateQuoteStatus}
        onExtendValidity={extendQuoteValidity}
        onCreateRevision={createQuoteRevision}
        onDuplicateQuote={duplicateQuote}
        onSignAndAccept={signAndAcceptQuote}
      />

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={updateOrderStatus}
      />
    </div>
  );
}
