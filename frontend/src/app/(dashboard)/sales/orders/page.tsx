'use client';

import { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Eye,
  Truck,
  Clock,
} from 'lucide-react';
import { SalesNav } from '@/components/sales/SalesNav';
import { useSalesStore } from '@/components/sales/useSalesStore';
import { NewOrderModal } from '@/components/sales/NewOrderModal';
import { NewQuoteModal } from '@/components/sales/NewQuoteModal';
import { OrderDetailsModal } from '@/components/sales/OrderDetailsModal';
import { SalesOrder, formatCurrency } from '@/components/sales/salesData';

export default function SalesOrdersPage() {
  const {
    quotes,
    orders,
    currency,
    setCurrency,
    toastMessage,
    pipelineValue,
    ordersBookedValue,
    addOrder,
    updateOrderStatus,
    addQuote,
  } = useSalesStore();

  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      filter === 'all' || o.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.quoteRef && o.quoteRef.toLowerCase().includes(search.toLowerCase())) ||
      o.contact.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterTabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'confirmed', label: 'Confirmed', count: orders.filter((o) => o.status === 'Confirmed').length },
    { id: 'processing', label: 'Processing', count: orders.filter((o) => o.status === 'Processing').length },
    { id: 'fulfilled', label: 'Fulfilled', count: orders.filter((o) => o.status === 'Fulfilled').length },
    { id: 'invoiced', label: 'Invoiced', count: orders.filter((o) => o.status === 'Invoiced').length },
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
        pipelineTotal={formatCurrency(pipelineValue, currency)}
        currency={currency}
        onCurrencyChange={setCurrency}
        onNewQuote={() => setQuoteModalOpen(true)}
        onNewOrder={() => setOrderModalOpen(true)}
      />

      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-ink dark:text-neutral-100 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Commercial Sales Orders &amp; Fulfillment Booking</span>
          </h2>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Monitor confirmed client orders booked from approved quotations or direct walk-ins. Coordinate warehouse dispatch and invoice generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOrderModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Order</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Mini-Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-ink-muted">Confirmed Stage</span>
          <div className="text-xl font-black text-blue-600 font-mono mt-0.5">
            {orders.filter((o) => o.status === 'Confirmed').length}
          </div>
          <span className="text-[10px] text-ink-muted">Awaiting picking</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-ink-muted">In Processing</span>
          <div className="text-xl font-black text-amber-600 font-mono mt-0.5">
            {orders.filter((o) => o.status === 'Processing').length}
          </div>
          <span className="text-[10px] text-ink-muted">Warehouse pack</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-ink-muted">Fulfilled / Shipped</span>
          <div className="text-xl font-black text-emerald-600 font-mono mt-0.5">
            {orders.filter((o) => o.status === 'Fulfilled').length}
          </div>
          <span className="text-[10px] text-ink-muted">Delivered to site</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-ink-muted">Total Revenue Booked</span>
          <div className="text-xl font-black text-accent font-mono mt-0.5">
            ${ordersBookedValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <span className="text-[10px] text-ink-muted">Across all {orders.length} orders</span>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden space-y-4 p-4">
        {/* Controls Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
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

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search orders, clients, or quote refs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#141513] text-ink dark:text-white placeholder:text-ink-muted/60 focus:outline-hidden focus:border-accent shadow-2xs"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="border border-border/80 dark:border-[#2A2B27] rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Quote Source</th>
                <th className="py-3 px-4">Customer &amp; Recipient</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Target Delivery</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-ink-muted dark:text-neutral-500">
                    No sales orders found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {o.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-ink-muted dark:text-neutral-400">
                      {o.quoteRef || 'Direct'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-ink dark:text-white group-hover:text-accent transition-colors">
                        {o.customer}
                      </div>
                      <div className="text-[11px] text-ink-muted dark:text-neutral-400">
                        {o.contact}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">
                      {o.date}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {o.deliveryDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          o.status === 'Fulfilled'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : o.status === 'Processing'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : o.status === 'Invoiced'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          o.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/15 text-emerald-600'
                            : 'bg-amber-500/15 text-amber-600'
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white">
                      {formatCurrency(o.amount, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {o.status === 'Confirmed' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(o.id, 'Processing')}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Clock className="w-3 h-3" />
                            <span>Process</span>
                          </button>
                        )}

                        {o.status === 'Processing' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(o.id, 'Fulfilled')}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Fulfill</span>
                          </button>
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
      <NewOrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onCreateOrder={addOrder}
      />

      <NewQuoteModal
        isOpen={quoteModalOpen}
        currency={currency}
        onClose={() => setQuoteModalOpen(false)}
        onCreateQuote={addQuote}
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
