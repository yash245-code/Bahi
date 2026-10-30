'use client';

import { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Eye,
  Truck,
  Clock,
  Download,
  CheckCircle2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  DollarSign,
  X,
  CreditCard,
} from 'lucide-react';
import { SalesNav } from '@/components/sales/SalesNav';
import { useSalesStore } from '@/components/sales/useSalesStore';
import { NewOrderModal } from '@/components/sales/NewOrderModal';
import { NewQuoteModal } from '@/components/sales/NewQuoteModal';
import { OrderDetailsModal } from '@/components/sales/OrderDetailsModal';
import { formatCurrency } from '@/components/sales/salesData';

type OrderSortColumn =
  | 'id'
  | 'quoteRef'
  | 'customer'
  | 'date'
  | 'deliveryDate'
  | 'status'
  | 'paymentStatus'
  | 'amount';

type OrderQuickChip = 'all' | 'unfulfilled' | 'fulfilled' | 'unpaid' | 'high_value';

export default function SalesOrdersPage() {
  const {
    quotes,
    orders,
    discountRules,
    currency,
    setCurrency,
    toastMessage,
    pipelineValue,
    ordersBookedValue,
    addOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateOrderTracking,
    addOrderInternalNote,
    batchUpdateOrderStatus,
    batchUpdateOrderPaymentStatus,
    addQuote,
    updateQuote,
  } = useSalesStore();

  const [filter, setFilter] = useState<string>('all');
  const [quickChip, setQuickChip] = useState<OrderQuickChip>('all');
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<OrderSortColumn>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Modals state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  // Sorting Handler
  const handleSort = (col: OrderSortColumn) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(col);
      setSortDirection('desc');
    }
  };

  // Filter & Search Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status Tab
      const matchesFilter =
        filter === 'all' || o.status.toLowerCase() === filter.toLowerCase();

      // Quick Chip
      let matchesChip = true;
      if (quickChip === 'unfulfilled') {
        matchesChip = o.status === 'Confirmed' || o.status === 'Processing';
      } else if (quickChip === 'fulfilled') {
        matchesChip = o.status === 'Fulfilled' || o.status === 'Invoiced';
      } else if (quickChip === 'unpaid') {
        matchesChip = o.paymentStatus !== 'Paid';
      } else if (quickChip === 'high_value') {
        matchesChip = o.amount >= 5000;
      }

      // Search
      const q = search.toLowerCase();
      const matchesSearch =
        o.customer.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        (o.quoteRef && o.quoteRef.toLowerCase().includes(q)) ||
        o.contact.toLowerCase().includes(q) ||
        (o.carrier && o.carrier.toLowerCase().includes(q)) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q));

      return matchesFilter && matchesChip && matchesSearch;
    });
  }, [orders, filter, quickChip, search]);

  // Sort Logic
  const sortedOrders = useMemo(() => {
    const list = [...filteredOrders];
    list.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      switch (sortColumn) {
        case 'id':
          valA = a.id;
          valB = b.id;
          break;
        case 'quoteRef':
          valA = a.quoteRef || '';
          valB = b.quoteRef || '';
          break;
        case 'customer':
          valA = a.customer.toLowerCase();
          valB = b.customer.toLowerCase();
          break;
        case 'date':
          valA = new Date(a.date).getTime() || 0;
          valB = new Date(b.date).getTime() || 0;
          break;
        case 'deliveryDate':
          valA = new Date(a.deliveryDate).getTime() || 0;
          valB = new Date(b.deliveryDate).getTime() || 0;
          break;
        case 'status':
          valA = a.status;
          valB = b.status;
          break;
        case 'paymentStatus':
          valA = a.paymentStatus;
          valB = b.paymentStatus;
          break;
        case 'amount':
          valA = a.amount;
          valB = b.amount;
          break;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredOrders, sortColumn, sortDirection]);

  // Batch Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // CSV Export
  const handleExportCSV = () => {
    const targetOrders = selectedOrderIds.length > 0
      ? orders.filter((o) => selectedOrderIds.includes(o.id))
      : filteredOrders;

    const headers = [
      'Order ID',
      'Quote Ref',
      'Customer',
      'Contact',
      'Date',
      'Delivery Date',
      'Status',
      'Payment Status',
      'Carrier',
      'Tracking Number',
      'Amount',
    ];

    const rows = targetOrders.map((o) => [
      `"${o.id}"`,
      `"${o.quoteRef || 'Direct'}"`,
      `"${o.customer}"`,
      `"${o.contact}"`,
      `"${o.date}"`,
      `"${o.deliveryDate}"`,
      `"${o.status}"`,
      `"${o.paymentStatus}"`,
      `"${o.carrier || ''}"`,
      `"${o.trackingNumber || ''}"`,
      o.amount,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bahi_sales_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Tabs counts
  const filterTabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'confirmed', label: 'Confirmed', count: orders.filter((o) => o.status === 'Confirmed').length },
    { id: 'processing', label: 'Processing', count: orders.filter((o) => o.status === 'Processing').length },
    { id: 'fulfilled', label: 'Fulfilled', count: orders.filter((o) => o.status === 'Fulfilled').length },
    { id: 'invoiced', label: 'Invoiced', count: orders.filter((o) => o.status === 'Invoiced').length },
  ];

  // Quick Chips counts
  const unfulfilledCount = orders.filter((o) => o.status === 'Confirmed' || o.status === 'Processing').length;
  const fulfilledCount = orders.filter((o) => o.status === 'Fulfilled' || o.status === 'Invoiced').length;
  const unpaidCount = orders.filter((o) => o.paymentStatus !== 'Paid').length;
  const highValCount = orders.filter((o) => o.amount >= 5000).length;

  const renderSortIndicator = (col: OrderSortColumn) => {
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
            <span>Customer Orders</span>
          </h2>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Track customer orders from accepted quotes or direct sales. Coordinate packing, print packing slips, and record payments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:border-accent hover:text-accent transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setOrderModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Order</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Mini-Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-ink-muted">Confirmed</span>
          <div className="text-xl font-black text-blue-600 font-mono mt-0.5">
            {orders.filter((o) => o.status === 'Confirmed').length}
          </div>
          <span className="text-[10px] text-ink-muted">Ready to pack</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-ink-muted">Packing</span>
          <div className="text-xl font-black text-amber-600 font-mono mt-0.5">
            {orders.filter((o) => o.status === 'Processing').length}
          </div>
          <span className="text-[10px] text-ink-muted">Being prepared</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-ink-muted">Shipped</span>
          <div className="text-xl font-black text-emerald-600 font-mono mt-0.5">
            {orders.filter((o) => o.status === 'Fulfilled').length}
          </div>
          <span className="text-[10px] text-ink-muted">Sent to customer</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-ink-muted">Total Order Sales</span>
          <div className="text-xl font-black text-accent font-mono mt-0.5">
            {formatCurrency(ordersBookedValue, currency)}
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
              placeholder="Search orders, clients, or waybills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#141513] text-ink dark:text-white placeholder:text-ink-muted/60 focus:outline-hidden focus:border-accent shadow-2xs"
            />
          </div>
        </div>

        {/* Quick Filter Chips Sub-bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-semibold text-ink-muted dark:text-neutral-500 mr-1 flex items-center gap-1 shrink-0">
            <span>Fast Filter:</span>
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
            All Items
          </button>

          <button
            type="button"
            onClick={() => setQuickChip('unfulfilled')}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              quickChip === 'unfulfilled'
                ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                : 'border-border dark:border-[#2A2B27] text-ink-muted hover:text-ink dark:hover:text-white'
            }`}
          >
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Awaiting Delivery ({unfulfilledCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setQuickChip('fulfilled')}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              quickChip === 'fulfilled'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-border dark:border-[#2A2B27] text-ink-muted hover:text-ink dark:hover:text-white'
            }`}
          >
            <Truck className="w-3 h-3 text-emerald-500" />
            <span>Fulfilled / In Transit ({fulfilledCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setQuickChip('unpaid')}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              quickChip === 'unpaid'
                ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                : 'border-border dark:border-[#2A2B27] text-ink-muted hover:text-ink dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-3 h-3 text-rose-500" />
            <span>Payment Due / Pending ({unpaidCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setQuickChip('high_value')}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              quickChip === 'high_value'
                ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold'
                : 'border-border dark:border-[#2A2B27] text-ink-muted hover:text-ink dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-3 h-3 text-purple-500" />
            <span>High Value &ge; $5k ({highValCount})</span>
          </button>
        </div>

        {/* Orders Table */}
        <div className="border border-border/80 dark:border-[#2A2B27] rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[840px]">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredOrders.length > 0 &&
                      selectedOrderIds.length === filteredOrders.length
                    }
                    onChange={handleToggleSelectAll}
                    className="rounded accent-accent cursor-pointer"
                    title="Select All Orders"
                  />
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-accent select-none"
                  onClick={() => handleSort('id')}
                >
                  <span>Order Ref</span>
                  {renderSortIndicator('id')}
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-accent select-none"
                  onClick={() => handleSort('quoteRef')}
                >
                  <span>Quote Ref</span>
                  {renderSortIndicator('quoteRef')}
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-accent select-none"
                  onClick={() => handleSort('customer')}
                >
                  <span>Customer &amp; Recipient</span>
                  {renderSortIndicator('customer')}
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-accent select-none"
                  onClick={() => handleSort('date')}
                >
                  <span>Order Date</span>
                  {renderSortIndicator('date')}
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-accent select-none"
                  onClick={() => handleSort('deliveryDate')}
                >
                  <span>Target Delivery</span>
                  {renderSortIndicator('deliveryDate')}
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-accent select-none"
                  onClick={() => handleSort('status')}
                >
                  <span>Fulfillment Stage</span>
                  {renderSortIndicator('status')}
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-accent select-none"
                  onClick={() => handleSort('paymentStatus')}
                >
                  <span>Payment</span>
                  {renderSortIndicator('paymentStatus')}
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:text-accent select-none"
                  onClick={() => handleSort('amount')}
                >
                  <span>Amount</span>
                  {renderSortIndicator('amount')}
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-ink-muted dark:text-neutral-500">
                    No sales orders found matching current filter.
                  </td>
                </tr>
              ) : (
                sortedOrders.map((o) => {
                  const isSelected = selectedOrderIds.includes(o.id);
                  return (
                    <tr
                      key={o.id}
                      onClick={() => setSelectedOrderId(o.id)}
                      className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group cursor-pointer ${
                        isSelected ? 'bg-accent/5 dark:bg-accent/10' : ''
                      }`}
                    >
                      <td
                        className="py-3.5 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(o.id)}
                          className="rounded accent-accent cursor-pointer"
                        />
                      </td>
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
                            onClick={() => setSelectedOrderId(o.id)}
                            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                            title="View Order Details & Packing Slip"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 1-click Advance Stage */}
                          {o.status === 'Confirmed' && (
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(o.id, 'Processing')}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                              title="Advance to Processing"
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
                              title="Mark Fulfilled"
                            >
                              <Truck className="w-3 h-3" />
                              <span>Fulfill</span>
                            </button>
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

      {/* ─── FLOATING BATCH ACTIONS TOOLBAR ─── */}
      {selectedOrderIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#141513]/95 backdrop-blur-md text-white border border-neutral-700/80 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-up text-xs font-semibold">
          <div className="flex items-center gap-2 pr-3 border-r border-neutral-700">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span className="font-bold">{selectedOrderIds.length} Orders Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                batchUpdateOrderStatus(selectedOrderIds, 'Processing');
                setSelectedOrderIds([]);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Mark Processing</span>
            </button>

            <button
              type="button"
              onClick={() => {
                batchUpdateOrderStatus(selectedOrderIds, 'Fulfilled');
                setSelectedOrderIds([]);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Mark Fulfilled</span>
            </button>

            <button
              type="button"
              onClick={() => {
                batchUpdateOrderPaymentStatus(selectedOrderIds, 'Paid');
                setSelectedOrderIds([]);
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Paid</span>
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
              onClick={() => setSelectedOrderIds([])}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Clear Selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewOrderModal
        isOpen={orderModalOpen}
        quotes={quotes}
        currency={currency}
        onClose={() => setOrderModalOpen(false)}
        onCreateOrder={addOrder}
      />

      <NewQuoteModal
        isOpen={quoteModalOpen}
        currency={currency}
        discountRules={discountRules}
        onClose={() => setQuoteModalOpen(false)}
        onCreateQuote={addQuote}
        onUpdateQuote={updateQuote}
      />

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        currency={currency}
        onClose={() => setSelectedOrderId(null)}
        onStatusChange={updateOrderStatus}
        onUpdatePaymentStatus={updateOrderPaymentStatus}
        onUpdateTracking={updateOrderTracking}
        onAddNote={addOrderInternalNote}
      />
    </div>
  );
}
