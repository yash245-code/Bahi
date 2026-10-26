'use client';

import { useState } from 'react';
import { X, CheckCircle, ShoppingBag, Printer, Mail, Calendar, Building, Sparkles } from 'lucide-react';
import { Quote } from './salesData';

interface QuoteDetailsModalProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
  onConvertToOrder: (quote: Quote) => void;
  onStatusChange: (quoteId: string, newStatus: Quote['status']) => void;
}

export function QuoteDetailsModal({
  quote,
  isOpen,
  onClose,
  onConvertToOrder,
  onStatusChange,
}: QuoteDetailsModalProps) {
  const [printSuccess, setPrintSuccess] = useState(false);

  if (!isOpen || !quote) return null;

  const handlePrint = () => {
    setPrintSuccess(true);
    setTimeout(() => setPrintSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-[#2A2B27]">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-accent text-sm sm:text-base">
              {quote.id}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                quote.status === 'Approved'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : quote.status === 'Sent'
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  : quote.status === 'Converted'
                  ? 'bg-[#A8462F]/15 text-[#A8462F] dark:text-[#E0724F] border border-[#A8462F]/30'
                  : quote.status === 'Expired'
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                  : 'bg-neutral-500/10 text-neutral-500'
              }`}
            >
              {quote.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Print or Export Quote to PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{printSuccess ? 'Printing...' : 'Print PDF'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Proposal Header */}
        <div className="p-5 rounded-2xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2A2B27] flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-ink-muted dark:text-neutral-400 mb-1">
              <Building className="w-3.5 h-3.5 text-accent" />
              <span>Prepared for:</span>
            </div>
            <h3 className="text-lg font-black text-ink dark:text-white tracking-tight">
              {quote.customer}
            </h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400">
              {quote.contact} • {quote.email}
            </p>
            <p className="text-xs text-ink-muted dark:text-neutral-500 font-mono mt-0.5">
              {quote.phone}
            </p>
          </div>

          <div className="sm:text-right space-y-1 text-xs">
            <div className="flex items-center sm:justify-end gap-1.5 text-ink-muted dark:text-neutral-400">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <span>Issued: <strong className="text-ink dark:text-neutral-200">{quote.date}</strong></span>
            </div>
            <p className="text-ink-muted dark:text-neutral-400">
              Valid Until: <strong className="text-amber-600 dark:text-amber-400">{quote.validUntil}</strong>
            </p>
            <p className="text-ink-muted dark:text-neutral-400">
              Payment Terms: <span className="font-semibold text-ink dark:text-neutral-200">{quote.paymentTerms}</span>
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-border dark:border-[#2A2B27] rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-center">Disc</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
              {quote.lines.map((line) => (
                <tr key={line.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-ink dark:text-white block">{line.productName}</span>
                    <span className="font-mono text-[10px] text-ink-muted">{line.sku}</span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-ink dark:text-neutral-200">
                    {line.quantity}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-ink-muted dark:text-neutral-400">
                    ${line.unitPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-ink-muted dark:text-neutral-400">
                    {line.discountPercent > 0 ? `${line.discountPercent}%` : '—'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-ink dark:text-white">
                    ${line.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Totals */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27]">
          <div className="text-xs text-ink-muted dark:text-neutral-400">
            {quote.notes && (
              <p className="italic">
                &quot;{quote.notes}&quot;
              </p>
            )}
          </div>

          <div className="w-full sm:w-60 space-y-1 text-xs">
            <div className="flex justify-between text-ink-muted dark:text-neutral-400">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">${quote.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-ink-muted dark:text-neutral-400">
              <span>Tax / VAT (8%):</span>
              <span className="font-mono font-semibold">${quote.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-ink dark:text-white pt-1.5 border-t border-border dark:border-[#2A2B27]">
              <span>Final Quote:</span>
              <span className="font-mono font-black text-accent">${quote.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/80 dark:border-[#2A2B27] flex-wrap">
          <div className="flex items-center gap-2">
            {quote.status !== 'Approved' && quote.status !== 'Converted' && (
              <button
                type="button"
                onClick={() => onStatusChange(quote.id, 'Approved')}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-600/20 hover:bg-emerald-600/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Mark as Accepted</span>
              </button>
            )}

            {quote.status === 'Draft' && (
              <button
                type="button"
                onClick={() => onStatusChange(quote.id, 'Sent')}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 hover:bg-blue-600/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send to Customer</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Close
            </button>

            {quote.status !== 'Converted' ? (
              <button
                type="button"
                onClick={() => {
                  onConvertToOrder(quote);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Convert to Sales Order</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-accent px-3 py-2 bg-accent/10 rounded-xl border border-accent/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Booked as Sales Order</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
