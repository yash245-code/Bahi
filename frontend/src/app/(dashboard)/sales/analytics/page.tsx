'use client';

import { useState, useMemo } from 'react';
import {
  BarChart3,
  Layers,
  Download,
  Sparkles,
  TrendingUp,
  Eye,
  CheckCircle2,
  ShoppingBag,
  Send,
} from 'lucide-react';
import { SalesNav } from '@/components/sales/SalesNav';
import { useSalesStore } from '@/components/sales/useSalesStore';
import { NewQuoteModal } from '@/components/sales/NewQuoteModal';
import { NewOrderModal } from '@/components/sales/NewOrderModal';
import { formatCurrency } from '@/components/sales/salesData';

type TimeRange = '30d' | '90d' | 'ytd';

export default function SalesAnalyticsPage() {
  const {
    quotes,
    orders,
    discountRules,
    currency,
    setCurrency,
    toastMessage,
    pipelineValue,
    ordersBookedValue,
    winRate,
    addQuote,
    updateQuote,
    addOrder,
  } = useSalesStore();

  const [timeRange, setTimeRange] = useState<TimeRange>('90d');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // Time-range scaling multiplier for demo telemetry
  const timeMultiplier = timeRange === '30d' ? 0.45 : timeRange === '90d' ? 1.0 : 2.2;

  const monthlyData = useMemo(() => {
    return [
      { month: 'Jun 2026', quoted: Math.round(18400 * timeMultiplier), booked: Math.round(12200 * timeMultiplier) },
      { month: 'Jul 2026', quoted: Math.round(21500 * timeMultiplier), booked: Math.round(14800 * timeMultiplier) },
      { month: 'Aug 2026', quoted: Math.round(24200 * timeMultiplier), booked: Math.round(16900 * timeMultiplier) },
      { month: 'Sep 2026', quoted: Math.round(28900 * timeMultiplier), booked: Math.round(19400 * timeMultiplier) },
      { month: 'Oct 2026 (MTD)', quoted: Math.round(pipelineValue), booked: Math.round(ordersBookedValue) },
    ];
  }, [timeMultiplier, pipelineValue, ordersBookedValue]);

  const maxVal = Math.max(...monthlyData.map((d) => d.quoted), 1);

  const topProducts = [
    { name: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', revenue: 16890, units: 38, share: '46%' },
    { name: 'Warehouse IoT Barcode Scanner Terminal', sku: 'HW-SCAN-80', revenue: 10640, units: 38, share: '29%' },
    { name: 'Multi-Tenant Security & Compliance Audit', sku: 'SEC-AUD-06', revenue: 4800, units: 4, share: '13%' },
    { name: 'High-Speed Thermal Receipt Printer', sku: 'HW-PRN-04', revenue: 2340, units: 12, share: '7%' },
    { name: 'Dedicated Database Replica Migration', sku: 'SVC-MIG-05', revenue: 1700, units: 2, share: '5%' },
  ];

  // Dynamic Commercial Conversion Funnel
  const funnel = useMemo(() => {
    const totalQuotes = quotes.length;
    const sentQuotes = quotes.filter(
      (q) => q.status === 'Sent' || q.status === 'Approved' || q.status === 'Converted'
    ).length;
    const viewedQuotes = quotes.filter(
      (q) => Boolean(q.portalViewedAt) || q.status === 'Approved' || q.status === 'Converted'
    ).length;
    const approvedQuotes = quotes.filter(
      (q) => q.status === 'Approved' || q.status === 'Converted'
    ).length;
    const bookedOrders = orders.length;

    return [
      {
        stage: 'Proposals Drafted',
        count: totalQuotes,
        pct: 100,
        sub: 'Total pipeline drafted',
        icon: Sparkles,
        color: 'text-neutral-500 bg-neutral-100 dark:bg-neutral-800',
      },
      {
        stage: 'Dispatched to Clients',
        count: sentQuotes,
        pct: totalQuotes > 0 ? Math.round((sentQuotes / totalQuotes) * 100) : 0,
        sub: 'Emailed proposals',
        icon: Send,
        color: 'text-blue-600 bg-blue-500/10',
      },
      {
        stage: 'Client Portal Viewed',
        count: viewedQuotes,
        pct: totalQuotes > 0 ? Math.round((viewedQuotes / totalQuotes) * 100) : 0,
        sub: 'Digital access confirmed',
        icon: Eye,
        color: 'text-purple-600 bg-purple-500/10',
      },
      {
        stage: 'Commercial Approval',
        count: approvedQuotes,
        pct: totalQuotes > 0 ? Math.round((approvedQuotes / totalQuotes) * 100) : 0,
        sub: 'Terms authorized',
        icon: CheckCircle2,
        color: 'text-emerald-600 bg-emerald-500/10',
      },
      {
        stage: 'Orders Booked & Active',
        count: bookedOrders,
        pct: totalQuotes > 0 ? Math.round((bookedOrders / totalQuotes) * 100) : 0,
        sub: 'Confirmed fulfillment',
        icon: ShoppingBag,
        color: 'text-accent bg-accent/15',
      },
    ];
  }, [quotes, orders]);

  // Export Summary CSV
  const handleExportAnalytics = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Pipeline Total Quoted', formatCurrency(pipelineValue, currency)],
      ['Revenue Booked', formatCurrency(ordersBookedValue, currency)],
      ['Win Conversion Rate', `${winRate}%`],
      ['Total Quotes Evaluated', quotes.length],
      ['Confirmed Orders Count', orders.length],
      ['Currency Code', currency],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bahi_sales_analytics_${timeRange}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-ink dark:text-neutral-100 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            <span>Commercial Analytics &amp; Proposal Win Velocity</span>
          </h2>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Data intelligence on quote-to-order conversion rates, average contract size, cycle velocity, and product revenue contributions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Time range selector */}
          <div className="p-1 rounded-xl bg-neutral-100 dark:bg-[#141513] border border-border/80 dark:border-[#2A2B27] flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                timeRange === '30d'
                  ? 'bg-white dark:bg-[#1A1B18] text-ink dark:text-white shadow-2xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              30 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('90d')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                timeRange === '90d'
                  ? 'bg-white dark:bg-[#1A1B18] text-ink dark:text-white shadow-2xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              90 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('ytd')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                timeRange === 'ytd'
                  ? 'bg-white dark:bg-[#1A1B18] text-ink dark:text-white shadow-2xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              YTD 2026
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportAnalytics}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:border-accent hover:text-accent transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* ─── 4 Core Metric Cards ──────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Win Conversion Rate</span>
          <div className="text-3xl font-black text-ink dark:text-white font-mono tracking-tight">{winRate}%</div>
          <p className="text-xs text-emerald-600 font-semibold">+6.4% improvement this quarter</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Avg Conversion Cycle</span>
          <div className="text-3xl font-black text-ink dark:text-white font-mono tracking-tight">3.8 Days</div>
          <p className="text-xs text-ink-muted">From quote creation to booking</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Avg Order Value (AOV)</span>
          <div className="text-3xl font-black text-accent font-mono tracking-tight">
            {formatCurrency(Math.round(ordersBookedValue / Math.max(1, orders.length)), currency)}
          </div>
          <p className="text-xs text-ink-muted">Across {orders.length} confirmed orders</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Margin Protected</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">96.8%</div>
          <p className="text-xs text-ink-muted">Zero quotes breached 25% floor</p>
        </div>
      </div>

      {/* ─── LIVE COMMERCIAL CONVERSION FUNNEL ────────── */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span>Commercial Pipeline Conversion Funnel</span>
            </h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
              Live funnel performance tracking quotes through drafting, email delivery, client portal views, and final order booking.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {funnel.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.stage}
                className="p-4 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5] dark:bg-[#141513] space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg ${item.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-ink-muted">
                    Step {idx + 1}
                  </span>
                </div>

                <div>
                  <div className="text-2xl font-black font-mono text-ink dark:text-white">
                    {item.count}
                  </div>
                  <div className="text-xs font-bold text-ink dark:text-neutral-200 mt-0.5">
                    {item.stage}
                  </div>
                  <div className="text-[10px] text-ink-muted dark:text-neutral-400">
                    {item.sub}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 dark:border-[#2A2B27] flex items-center justify-between text-[10px]">
                  <span className="text-ink-muted">Conversion:</span>
                  <span className="font-mono font-bold text-accent">{item.pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Monthly Quoted vs Booked Chart ──────────── */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-white flex items-center gap-2">
              <span>Monthly Commercial Volume Pacing</span>
              <span className="text-xs font-mono text-ink-muted font-normal">(Trend Pacing)</span>
            </h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
              Comparison between total proposals quoted and revenue confirmed into sales orders in {currency}.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-accent inline-block" />
              <span>Quoted Pipeline</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" />
              <span>Booked Orders</span>
            </span>
          </div>
        </div>

        {/* Bar Visualizer */}
        <div className="pt-4 pb-2 space-y-5">
          {monthlyData.map((d) => {
            const quotedPct = Math.round((d.quoted / maxVal) * 100);
            const bookedPct = Math.round((d.booked / maxVal) * 100);

            return (
              <div key={d.month} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="font-bold text-ink dark:text-white font-sans">{d.month}</span>
                  <div className="space-x-3 text-[11px]">
                    <span className="text-accent font-bold">{formatCurrency(d.quoted, currency)} Quoted</span>
                    <span className="text-emerald-600 font-bold">{formatCurrency(d.booked, currency)} Booked</span>
                  </div>
                </div>

                <div className="h-5 w-full bg-neutral-100 dark:bg-[#141513] rounded-lg overflow-hidden flex relative">
                  {/* Quoted bar background */}
                  <div
                    style={{ width: `${quotedPct}%` }}
                    className="h-full bg-accent/20 border-r-2 border-accent transition-all duration-500"
                  />
                  {/* Booked bar overlay */}
                  <div
                    style={{ width: `${bookedPct}%` }}
                    className="absolute top-0 left-0 h-full bg-emerald-600 dark:bg-emerald-500 rounded-lg transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Top Revenue Product Lines Breakdown ───────── */}
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent" />
            <span>Top Performing Commercial Product Lines</span>
          </h3>
          <span className="text-xs text-ink-muted">Ranked by booked sales volume</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-4">Product Catalog Item</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4 text-center">Units Booked</th>
                <th className="py-3 px-4 text-right">Revenue Contribution</th>
                <th className="py-3 px-4 text-right">Share of Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
              {topProducts.map((p) => (
                <tr key={p.sku} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                  <td className="py-3 px-4 font-semibold text-ink dark:text-white">
                    {p.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-ink-muted">
                    {p.sku}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-medium text-ink dark:text-neutral-200">
                    {p.units}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-ink dark:text-white">
                    {formatCurrency(p.revenue, currency)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-accent/10 text-accent">
                      {p.share}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <NewQuoteModal
        isOpen={quoteModalOpen}
        currency={currency}
        discountRules={discountRules}
        onClose={() => setQuoteModalOpen(false)}
        onCreateQuote={addQuote}
        onUpdateQuote={updateQuote}
      />

      <NewOrderModal
        isOpen={orderModalOpen}
        quotes={quotes}
        currency={currency}
        onClose={() => setOrderModalOpen(false)}
        onCreateOrder={addOrder}
      />
    </div>
  );
}
