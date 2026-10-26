'use client';

import { useState } from 'react';
import {
  Tag,
  Plus,
  ShieldCheck,
  Calculator,
} from 'lucide-react';
import { SalesNav } from '@/components/sales/SalesNav';
import { useSalesStore } from '@/components/sales/useSalesStore';
import { NewDiscountRuleModal } from '@/components/sales/NewDiscountRuleModal';
import { NewQuoteModal } from '@/components/sales/NewQuoteModal';
import { NewOrderModal } from '@/components/sales/NewOrderModal';
import { catalogProducts } from '@/components/sales/salesData';

export default function PriceBooksPage() {
  const {
    quotes,
    orders,
    discountRules,
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
  const simSubtotal = simQty * selectedProd.unitPrice;
  const simDiscountAmount = Math.round(simSubtotal * (simDiscount / 100) * 100) / 100;
  const simFinalAmount = Math.round((simSubtotal - simDiscountAmount) * 100) / 100;
  const marginProtected = simDiscount <= 25;

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
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ink dark:text-white">
              Executive Margin Safeguard Policy (Active)
            </h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400">
              Quotation discounts capped at 25% max without secondary management override.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
          ✓ Guardrail Enforced
        </span>
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

      {/* ─── Real-Time Pricing & Discount Simulator ─── */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-accent" />
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-white">
              Real-Time Pricing &amp; Margin Simulator
            </h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400">
              Test how discount rules impact quote totals and corporate margin compliance before finalizing proposals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Select Product */}
          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Select Product SKU
            </label>
            <select
              value={simProduct}
              onChange={(e) => setSimProduct(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white"
            >
              {catalogProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (${p.unitPrice})
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
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white font-mono"
            />
          </div>

          {/* Applied Discount */}
          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Simulated Discount (%)
            </label>
            <input
              type="range"
              min="0"
              max="40"
              value={simDiscount}
              onChange={(e) => setSimDiscount(parseInt(e.target.value) || 0)}
              className="w-full accent-accent cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[11px] text-ink-muted font-mono mt-1">
              <span>0%</span>
              <span className="font-bold text-accent">{simDiscount}%</span>
              <span>40% Max</span>
            </div>
          </div>
        </div>

        {/* Simulator Results Strip */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
          <div>
            <span className="text-ink-muted block text-[10px] uppercase font-sans font-bold">Regular Subtotal</span>
            <span className="text-sm font-semibold text-ink dark:text-neutral-300">
              ${simSubtotal.toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-ink-muted block text-[10px] uppercase font-sans font-bold">Total Savings</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              -${simDiscountAmount.toFixed(2)} ({simDiscount}%)
            </span>
          </div>

          <div>
            <span className="text-ink-muted block text-[10px] uppercase font-sans font-bold">Discounted Quote</span>
            <span className="text-lg font-black text-accent">
              ${simFinalAmount.toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-ink-muted block text-[10px] uppercase font-sans font-bold">Margin Compliance</span>
            <span
              className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[11px] ${
                marginProtected
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/15 text-red-600 dark:text-red-400'
              }`}
            >
              {marginProtected ? '✓ Compliant' : '⚠ Exceeds 25% Ceiling'}
            </span>
          </div>
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
