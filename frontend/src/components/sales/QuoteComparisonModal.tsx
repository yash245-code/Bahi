'use client';

import { useState } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Layers,
  Minus,
} from 'lucide-react';
import {
  Quote,
  CurrencyCode,
  formatCurrency,
  calculateQuoteMargin,
} from './salesData';

interface QuoteComparisonModalProps {
  quoteA: Quote | null;
  quoteB: Quote | null;
  allQuotes: Quote[];
  currency: CurrencyCode;
  isOpen: boolean;
  onClose: () => void;
  onConvertToOrder: (quote: Quote) => void;
  onSelectQuote?: (quote: Quote) => void;
}

export function QuoteComparisonModal({
  quoteA: initialQuoteA,
  quoteB: initialQuoteB,
  allQuotes,
  currency,
  isOpen,
  onClose,
  onConvertToOrder,
  onSelectQuote,
}: QuoteComparisonModalProps) {
  const [selectedIdA, setSelectedIdA] = useState<string>(initialQuoteA?.id || allQuotes[0]?.id || '');
  const [selectedIdB, setSelectedIdB] = useState<string>(
    initialQuoteB?.id || allQuotes[1]?.id || allQuotes[0]?.id || ''
  );

  if (!isOpen) return null;

  const currentA = allQuotes.find((q) => q.id === selectedIdA) || initialQuoteA || allQuotes[0];
  const currentB = allQuotes.find((q) => q.id === selectedIdB) || initialQuoteB || allQuotes[1] || allQuotes[0];

  if (!currentA || !currentB) return null;

  const marginA = calculateQuoteMargin(currentA.lines, currentA.shippingFee);
  const marginB = calculateQuoteMargin(currentB.lines, currentB.shippingFee);

  const amountDelta = Math.round((currentB.amount - currentA.amount) * 100) / 100;
  const percentDelta =
    currentA.amount > 0 ? Math.round(((currentB.amount - currentA.amount) / currentA.amount) * 1000) / 10 : 0;

  // Build unified line items diff
  const skus = Array.from(
    new Set([...currentA.lines.map((l) => l.sku), ...currentB.lines.map((l) => l.sku)])
  );

  const linesDiff = skus.map((sku) => {
    const lineA = currentA.lines.find((l) => l.sku === sku);
    const lineB = currentB.lines.find((l) => l.sku === sku);

    const productName = lineA?.productName || lineB?.productName || sku;

    let diffType: 'identical' | 'qty_changed' | 'price_changed' | 'only_a' | 'only_b' = 'identical';
    if (!lineA) {
      diffType = 'only_b';
    } else if (!lineB) {
      diffType = 'only_a';
    } else if (lineA.quantity !== lineB.quantity && lineA.unitPrice !== lineB.unitPrice) {
      diffType = 'qty_changed';
    } else if (lineA.quantity !== lineB.quantity) {
      diffType = 'qty_changed';
    } else if (lineA.unitPrice !== lineB.unitPrice || lineA.discountPercent !== lineB.discountPercent) {
      diffType = 'price_changed';
    }

    return {
      sku,
      productName,
      lineA,
      lineB,
      diffType,
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl space-y-6 my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-[#2A2B27]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 text-accent">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-ink dark:text-neutral-100">
                Commercial Proposal Diff &amp; Comparative Analysis
              </h2>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Compare line-item scopes, margin profiles, and pricing differences side-by-side.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quote Pickers Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF9F5] dark:bg-[#141513] p-4 rounded-2xl border border-border/70 dark:border-[#2A2B27]">
          {/* Quote A Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-ink dark:text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Base Proposal (Quote A)</span>
              </span>
              <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                {currentA.id} {currentA.version ? `(v${currentA.version})` : ''}
              </span>
            </div>
            <select
              value={selectedIdA}
              onChange={(e) => setSelectedIdA(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1E1F1C] text-ink dark:text-white font-medium focus:outline-hidden focus:border-accent"
            >
              {allQuotes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.id} - {q.customer} ({formatCurrency(q.amount, currency)}) [{q.status}]
                </option>
              ))}
            </select>
          </div>

          {/* Quote B Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-ink dark:text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Comparison Target (Quote B)</span>
              </span>
              <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {currentB.id} {currentB.version ? `(v${currentB.version})` : ''}
              </span>
            </div>
            <select
              value={selectedIdB}
              onChange={(e) => setSelectedIdB(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1E1F1C] text-ink dark:text-white font-medium focus:outline-hidden focus:border-accent"
            >
              {allQuotes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.id} - {q.customer} ({formatCurrency(q.amount, currency)}) [{q.status}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI Delta Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Quote A Total */}
          <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
              Quote A Amount
            </span>
            <div className="text-lg font-black font-mono text-ink dark:text-white">
              {formatCurrency(currentA.amount, currency)}
            </div>
            <span className="text-[10px] text-ink-muted">
              Margin: <strong className="text-ink dark:text-neutral-200">{marginA.marginPercent}%</strong>
            </span>
          </div>

          {/* Quote B Total */}
          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
              Quote B Amount
            </span>
            <div className="text-lg font-black font-mono text-ink dark:text-white">
              {formatCurrency(currentB.amount, currency)}
            </div>
            <span className="text-[10px] text-ink-muted">
              Margin: <strong className="text-ink dark:text-neutral-200">{marginB.marginPercent}%</strong>
            </span>
          </div>

          {/* Amount Delta */}
          <div
            className={`p-3.5 rounded-xl border space-y-1 ${
              amountDelta > 0
                ? 'border-emerald-500/20 bg-emerald-500/5'
                : amountDelta < 0
                ? 'border-rose-500/20 bg-rose-500/5'
                : 'border-neutral-500/20 bg-neutral-500/5'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-ink-muted">
              Value Variance
            </span>
            <div
              className={`text-lg font-black font-mono flex items-center gap-1 ${
                amountDelta > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : amountDelta < 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-ink-muted'
              }`}
            >
              {amountDelta > 0 && <TrendingUp className="w-4 h-4" />}
              {amountDelta < 0 && <TrendingDown className="w-4 h-4" />}
              {amountDelta === 0 && <Minus className="w-4 h-4" />}
              <span>{formatCurrency(Math.abs(amountDelta), currency)}</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-ink-muted">
              {amountDelta > 0 ? `+${percentDelta}% higher` : amountDelta < 0 ? `${percentDelta}% lower` : 'Equal'}
            </span>
          </div>

          {/* Gross Margin Variance */}
          <div className="p-3.5 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5] dark:bg-[#141513] space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-muted">
              Margin Spread
            </span>
            <div className="text-lg font-black font-mono text-ink dark:text-white">
              {marginB.marginPercent - marginA.marginPercent > 0 ? '+' : ''}
              {Math.round((marginB.marginPercent - marginA.marginPercent) * 10) / 10}%
            </div>
            <span className="text-[10px] text-ink-muted">
              Profit: {formatCurrency(marginA.grossProfit, currency)} vs {formatCurrency(marginB.grossProfit, currency)}
            </span>
          </div>
        </div>

        {/* Side-by-Side Metadata Table */}
        <div className="border border-border/80 dark:border-[#2A2B27] rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-2.5 px-4 w-1/4">Commercial Parameter</th>
                <th className="py-2.5 px-4 w-3/8 text-blue-600 dark:text-blue-400">Quote A ({currentA.id})</th>
                <th className="py-2.5 px-4 w-3/8 text-emerald-600 dark:text-emerald-400">Quote B ({currentB.id})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
              <tr>
                <td className="py-2.5 px-4 font-semibold text-ink-muted">Client / Customer</td>
                <td className="py-2.5 px-4 font-bold text-ink dark:text-white">{currentA.customer}</td>
                <td className="py-2.5 px-4 font-bold text-ink dark:text-white">{currentB.customer}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-ink-muted">Status &amp; Stage</td>
                <td className="py-2.5 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-ink dark:text-neutral-200">
                    {currentA.status}
                  </span>
                </td>
                <td className="py-2.5 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-ink dark:text-neutral-200">
                    {currentB.status}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-ink-muted">Payment Terms</td>
                <td className="py-2.5 px-4 text-ink dark:text-neutral-300 font-mono">{currentA.paymentTerms}</td>
                <td className="py-2.5 px-4 text-ink dark:text-neutral-300 font-mono">{currentB.paymentTerms}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-ink-muted">Discount Applied</td>
                <td className="py-2.5 px-4 font-mono font-bold text-ink dark:text-neutral-200">
                  {currentA.discountPercent}%
                </td>
                <td className="py-2.5 px-4 font-mono font-bold text-ink dark:text-neutral-200">
                  {currentB.discountPercent}%
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-ink-muted">Validity Expiration</td>
                <td className="py-2.5 px-4 text-ink dark:text-neutral-300">{currentA.validUntil}</td>
                <td className="py-2.5 px-4 text-ink dark:text-neutral-300">{currentB.validUntil}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-ink-muted">Win Odds Probability</td>
                <td className="py-2.5 px-4 font-mono font-bold text-blue-600">{currentA.winProbability ?? 70}%</td>
                <td className="py-2.5 px-4 font-mono font-bold text-emerald-600">{currentB.winProbability ?? 70}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Itemized Line Items Comparison */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-neutral-200">
              Line Items Scope &amp; Unit Breakdown Diff
            </h3>
            <span className="text-[11px] text-ink-muted">
              {linesDiff.length} unique items compared
            </span>
          </div>

          <div className="border border-border/80 dark:border-[#2A2B27] rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-2.5 px-3">Product / SKU</th>
                  <th className="py-2.5 px-2 text-center">Diff Status</th>
                  <th className="py-2.5 px-3 text-right text-blue-600">Quote A (Qty &times; Price)</th>
                  <th className="py-2.5 px-3 text-right text-blue-600">Quote A Total</th>
                  <th className="py-2.5 px-3 text-right text-emerald-600">Quote B (Qty &times; Price)</th>
                  <th className="py-2.5 px-3 text-right text-emerald-600">Quote B Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
                {linesDiff.map((row) => (
                  <tr key={row.sku} className="hover:bg-neutral-50 dark:hover:bg-[#1C1D18] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-ink dark:text-white">{row.productName}</div>
                      <div className="font-mono text-[10px] text-ink-muted">{row.sku}</div>
                    </td>

                    <td className="py-3 px-2 text-center">
                      {row.diffType === 'identical' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-ink-muted">
                          Identical
                        </span>
                      )}
                      {row.diffType === 'qty_changed' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          Qty Changed
                        </span>
                      )}
                      {row.diffType === 'price_changed' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          Price Delta
                        </span>
                      )}
                      {row.diffType === 'only_a' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          Only in A
                        </span>
                      )}
                      {row.diffType === 'only_b' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          New in B
                        </span>
                      )}
                    </td>

                    {/* Quote A Line */}
                    <td className="py-3 px-3 text-right font-mono text-ink-muted">
                      {row.lineA ? (
                        <span>
                          {row.lineA.quantity} &times; {formatCurrency(row.lineA.unitPrice, currency)}
                        </span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-ink dark:text-neutral-200">
                      {row.lineA ? formatCurrency(row.lineA.total, currency) : '—'}
                    </td>

                    {/* Quote B Line */}
                    <td className="py-3 px-3 text-right font-mono text-ink-muted">
                      {row.lineB ? (
                        <span>
                          {row.lineB.quantity} &times; {formatCurrency(row.lineB.unitPrice, currency)}
                        </span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-ink dark:text-neutral-200">
                      {row.lineB ? formatCurrency(row.lineB.total, currency) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/80 dark:border-[#2A2B27] flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onSelectQuote) onSelectQuote(currentA);
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-blue-500/30 text-blue-600 hover:bg-blue-500/10 transition-colors cursor-pointer"
            >
              Open Quote A Details
            </button>
            <button
              type="button"
              onClick={() => {
                if (onSelectQuote) onSelectQuote(currentB);
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 transition-colors cursor-pointer"
            >
              Open Quote B Details
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Close Diff
            </button>

            {currentB.status !== 'Converted' && (
              <button
                type="button"
                onClick={() => {
                  onConvertToOrder(currentB);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Book Order from Quote B</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

