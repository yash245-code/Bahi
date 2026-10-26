'use client';

import { useState } from 'react';
import {
  BarChart3,
  Layers,
} from 'lucide-react';
import { SalesNav } from '@/components/sales/SalesNav';
import { useSalesStore } from '@/components/sales/useSalesStore';
import { NewQuoteModal } from '@/components/sales/NewQuoteModal';
import { NewOrderModal } from '@/components/sales/NewOrderModal';

export default function SalesAnalyticsPage() {
  const {
    quotes,
    orders,
    toastMessage,
    pipelineValue,
    ordersBookedValue,
    winRate,
    addQuote,
    addOrder,
  } = useSalesStore();

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const monthlyData = [
    { month: 'Jun 2026', quoted: 18400, booked: 12200 },
    { month: 'Jul 2026', quoted: 21500, booked: 14800 },
    { month: 'Aug 2026', quoted: 24200, booked: 16900 },
    { month: 'Sep 2026', quoted: 28900, booked: 19400 },
    { month: 'Oct 2026 (MTD)', quoted: Math.round(pipelineValue), booked: Math.round(ordersBookedValue) },
  ];

  const maxVal = Math.max(...monthlyData.map((d) => d.quoted));

  const topProducts = [
    { name: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', revenue: 16890, units: 38, share: '46%' },
    { name: 'Warehouse IoT Barcode Scanner Terminal', sku: 'HW-SCAN-80', revenue: 10640, units: 38, share: '29%' },
    { name: 'Multi-Tenant Security & Compliance Audit', sku: 'SEC-AUD-06', revenue: 4800, units: 4, share: '13%' },
    { name: 'High-Speed Thermal Receipt Printer', sku: 'HW-PRN-04', revenue: 2340, units: 12, share: '7%' },
    { name: 'Dedicated Database Replica Migration', sku: 'SVC-MIG-05', revenue: 1700, units: 2, share: '5%' },
  ];

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
        pipelineTotal={`$${pipelineValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
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

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Telemetry Live • Mongo Atlas Sync
          </span>
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
            ${Math.round(ordersBookedValue / Math.max(1, orders.length)).toLocaleString()}
          </div>
          <p className="text-xs text-ink-muted">Across {orders.length} confirmed orders</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Margin Protected</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">96.8%</div>
          <p className="text-xs text-ink-muted">Zero quotes breached 25% floor</p>
        </div>
      </div>

      {/* ─── Monthly Quoted vs Booked Chart ──────────── */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-white flex items-center gap-2">
              <span>Monthly Commercial Volume Pacing</span>
              <span className="text-xs font-mono text-ink-muted font-normal">(Last 5 Months)</span>
            </h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
              Comparison between total proposals quoted and revenue confirmed into sales orders.
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
                    <span className="text-accent font-bold">${d.quoted.toLocaleString()} Quoted</span>
                    <span className="text-emerald-600 font-bold">${d.booked.toLocaleString()} Booked</span>
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
                    ${p.revenue.toLocaleString()}
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
        onClose={() => setQuoteModalOpen(false)}
        onCreateQuote={addQuote}
      />

      <NewOrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onCreateOrder={addOrder}
      />
    </div>
  );
}
