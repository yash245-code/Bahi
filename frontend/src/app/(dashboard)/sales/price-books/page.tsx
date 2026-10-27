'use client';

import { useState } from 'react';
import {
  Tag,
  Plus,
  ShieldCheck,
  Calculator,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { SalesNav } from '@/components/sales/SalesNav';
import { useSalesStore } from '@/components/sales/useSalesStore';
import { NewDiscountRuleModal } from '@/components/sales/NewDiscountRuleModal';
import { NewQuoteModal } from '@/components/sales/NewQuoteModal';
import { NewOrderModal } from '@/components/sales/NewOrderModal';
import { catalogProducts, formatCurrency } from '@/components/sales/salesData';

export default function PriceBooksPage() {
  const {
    quotes,
    orders,
    discountRules,
    currency,
    setCurrency,
    toastMessage,
    pipelineValue,
    toggleDiscountRule,
    addDiscountRule,
    addQuote,
    addOrder,
  } = useSalesStore();

  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const defaultProd = catalogProducts[0] || {
    id: 'PROD-01',
    name: 'Cloud ERP Core Tenant License',
    sku: 'ERP-CORE-01',
    unitPrice: 450.0,
    category: 'Software',
  };

  // Live Simulator state
  const [simProduct, setSimProduct] = useState(defaultProd.id);
  const [simQty, setSimQty] = useState(12);
  const [simDiscount, setSimDiscount] = useState(15);

  const selectedProd = catalogProducts.find((p) => p.id === simProduct) || defaultProd;

  // COGS model: estimated cost of goods is approx 42% of unit price for software/hardware
  const unitCostBasis = Math.round(selectedProd.unitPrice * 0.42 * 100) / 100;
  const totalCostBasis = unitCostBasis * simQty;

  const simSubtotal = simQty * selectedProd.unitPrice;
  const simDiscountAmount = Math.round(simSubtotal * (simDiscount / 100) * 100) / 100;
  const simFinalAmount = Math.round((simSubtotal - simDiscountAmount) * 100) / 100;

  const grossProfit = Math.round((simFinalAmount - totalCostBasis) * 100) / 100;
  const grossMarginPercent =
    simFinalAmount > 0 ? Math.round((grossProfit / simFinalAmount) * 100) : 0;

  const marginProtected = simDiscount <= 25;

  // Volume Break Tier Matrix
  const volumeTiers = [
    { name: 'Standard Tier', range: '1 - 9 units', discount: 0, minUnits: 1 },
    { name: 'Volume Tier 1', range: '10 - 24 units', discount: 10, minUnits: 10 },
    { name: 'Commercial Tier', range: '25 - 49 units', discount: 15, minUnits: 25 },
    { name: 'Enterprise Bulk', range: '50+ units', discount: 25, minUnits: 50 },
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
            <Tag className="w-5 h-5 text-accent" />
            <span>Price Books &amp; Discount Governance Rules</span>
          </h2>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Standardize pricing tiers, multi-tier volume breaks, and strict margin floor guardrails across all quotation proposals and sales contracts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRuleModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Discount Rule</span>
          </button>
        </div>
      </div>

      {/* Governance Safeguard Notice */}
      <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#1A1B18] border border-[#A8462F]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#A8462F]/10 text-accent flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ink dark:text-white">
              Executive Margin Safeguard Policy (RULE-104 Active)
            </h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400">
              Quotation discounts capped at 25% max without secondary management override. Margin floor safeguard actively monitored in {currency}.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
          ✓ Guardrail Enforced
        </span>
      </div>

      {/* ─── Real-Time Pricing & Profit Margin Heatmap Simulator ─── */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-accent" />
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-white">
                Live Pricing, Volume Breaks &amp; Profit Margin Heatmap
              </h3>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Simulate quantity breaks, rep discount discretion, net gross profit, and margin health before issuing proposals.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-ink dark:text-neutral-200">
            Active Currency: {currency}
          </span>
        </div>

        {/* Simulator Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Select Product */}
          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Select Catalog SKU
            </label>
            <select
              value={simProduct}
              onChange={(e) => setSimProduct(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white font-medium"
            >
              {catalogProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({formatCurrency(p.unitPrice, currency)})
                </option>
              ))}
            </select>
          </div>

          {/* Volume */}
          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Order Volume (Units)
            </label>
            <input
              type="number"
              min="1"
              value={simQty}
              onChange={(e) => setSimQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white font-mono font-bold"
            />
          </div>

          {/* Applied Discount Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-ink dark:text-neutral-200">
                Discretionary Discount (%)
              </label>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  marginProtected ? 'text-accent bg-accent/10' : 'text-red-600 bg-red-500/15'
                }`}
              >
                {simDiscount}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={simDiscount}
              onChange={(e) => setSimDiscount(parseInt(e.target.value) || 0)}
              className="w-full accent-accent cursor-pointer mt-1"
            />
            <div className="flex justify-between text-[10px] text-ink-muted font-mono mt-0.5">
              <span>0% Full MSRP</span>
              <span className="text-emerald-600">15% Recommended</span>
              <span className="text-red-500 font-bold">25% Ceiling</span>
              <span>40% Max</span>
            </div>
          </div>
        </div>

        {/* ─── Margin Heatmap Visualization Bar ─── */}
        <div className="space-y-2 p-4 rounded-xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27]">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-ink dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span>Gross Profit Margin Spectrum</span>
            </span>
            <div className="flex items-center gap-3 font-mono">
              <span className="text-ink-muted">Net Margin:</span>
              <strong
                className={`text-sm ${
                  grossMarginPercent >= 45
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : grossMarginPercent >= 30
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {grossMarginPercent}%
              </strong>
              <span className="text-ink-muted">|</span>
              <span className="text-ink-muted">Gross Profit:</span>
              <strong className="text-sm text-ink dark:text-white font-black">
                {formatCurrency(grossProfit, currency)}
              </strong>
            </div>
          </div>

          {/* Color Heatmap Bar */}
          <div className="relative w-full h-4 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 overflow-hidden shadow-inner">
            <div
              className="absolute top-0 bottom-0 w-2.5 bg-neutral-900 dark:bg-white rounded-full shadow-lg border-2 border-white dark:border-neutral-900 transition-all duration-300"
              style={{
                left: `clamp(2%, ${grossMarginPercent}%, 96%)`,
              }}
              title={`Simulated Margin: ${grossMarginPercent}%`}
            />
          </div>

          <div className="flex justify-between text-[10px] text-ink-muted font-mono">
            <span>Critical Margin (&lt;25%)</span>
            <span>Guarded Margin (25-45%)</span>
            <span>Optimal Enterprise Margin (&gt;45%)</span>
          </div>
        </div>

        {/* ─── Interactive Volume Tier Matrix Table ─── */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-neutral-300 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-accent" />
            <span>Volume Break Tier Matrix (Click to Simulate)</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {volumeTiers.map((tier) => {
              const tierDiscountAmount = Math.round(selectedProd.unitPrice * (tier.discount / 100));
              const tierUnitPrice = selectedProd.unitPrice - tierDiscountAmount;
              const isActive = simQty >= tier.minUnits && simDiscount === tier.discount;

              return (
                <button
                  key={tier.name}
                  type="button"
                  onClick={() => {
                    setSimQty(tier.minUnits);
                    setSimDiscount(tier.discount);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                    isActive
                      ? 'border-accent bg-accent/5 dark:bg-accent/10 shadow-xs'
                      : 'border-border/80 dark:border-[#2A2B27] bg-neutral-50/50 dark:bg-[#141513] hover:border-accent/40'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-ink dark:text-white truncate">
                      {tier.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-ink-muted">
                      {tier.discount}% Off
                    </span>
                  </div>
                  <div className="text-[10px] text-ink-muted">{tier.range}</div>
                  <div className="font-mono text-xs font-black text-accent pt-1">
                    {formatCurrency(tierUnitPrice, currency)}/unit
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Simulator Results Strip */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
          <div>
            <span className="text-ink-muted block text-[10px] uppercase font-sans font-bold">Regular Subtotal</span>
            <span className="text-sm font-semibold text-ink dark:text-neutral-300">
              {formatCurrency(simSubtotal, currency)}
            </span>
          </div>

          <div>
            <span className="text-ink-muted block text-[10px] uppercase font-sans font-bold">Total Savings</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              -{formatCurrency(simDiscountAmount, currency)} ({simDiscount}%)
            </span>
          </div>

          <div>
            <span className="text-ink-muted block text-[10px] uppercase font-sans font-bold">Discounted Quote</span>
            <span className="text-lg font-black text-accent">
              {formatCurrency(simFinalAmount, currency)}
            </span>
          </div>

          <div>
            <span className="text-ink-muted block text-[10px] uppercase font-sans font-bold">Margin Governance</span>
            <span
              className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded text-[11px] ${
                marginProtected
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/15 text-red-600 dark:text-red-400'
              }`}
            >
              {marginProtected ? '✓ Compliant with Policy' : '⚠ Exceeds 25% Ceiling'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Active Discount Rules Grid ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink dark:text-white flex items-center gap-2">
            <span>Commercial Discount Rules Matrix</span>
            <span className="text-xs font-mono text-ink-muted font-normal">
              ({discountRules.length} Defined Policies)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discountRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-5 rounded-2xl bg-white dark:bg-[#1A1B18] border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xs ${
                rule.isActive
                  ? 'border-border dark:border-[#2A2B27] hover:border-accent/40'
                  : 'border-border/50 dark:border-neutral-800 opacity-60 bg-neutral-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono border ${
                      rule.type === 'Volume Discount'
                        ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        : rule.type === 'Partner Tier'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : rule.type === 'Margin Floor'
                        ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}
                  >
                    {rule.type}
                  </span>

                  {/* Interactive Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => toggleDiscountRule(rule.id)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      rule.isActive ? 'bg-accent' : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                    title={rule.isActive ? 'Click to deactivate rule' : 'Click to activate rule'}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        rule.isActive ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-ink dark:text-white leading-snug">
                  {rule.name}
                </h4>
                <p className="text-xs text-ink-muted dark:text-neutral-400 mt-1.5 leading-relaxed">
                  {rule.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/70 dark:border-[#2A2B27] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase">Rate / Benefit</span>
                  <span className="font-bold text-accent text-sm">{rule.discountRate}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-ink-muted block uppercase">Min Volume</span>
                  <span className="font-bold text-ink dark:text-neutral-200">
                    {rule.minUnits} {rule.minUnits === 1 ? 'unit' : 'units'}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-ink-muted block uppercase">Usage</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {rule.usageCount} quotes
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <NewDiscountRuleModal
        isOpen={ruleModalOpen}
        onClose={() => setRuleModalOpen(false)}
        onAddRule={addDiscountRule}
      />

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
    </div>
  );
}
