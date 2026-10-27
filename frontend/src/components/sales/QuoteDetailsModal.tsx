'use client';

import { useState } from 'react';
import {
  X,
  CheckCircle,
  ShoppingBag,
  Printer,
  Mail,
  Calendar,
  Building,
  Sparkles,
  History,
  FileText,
  PenTool,
  Clock,
  Copy,
  Plus,
} from 'lucide-react';
import { Quote, CurrencyCode, formatCurrency, getExpiryStatus, QuoteSignature } from './salesData';
import { PrintableQuoteDocument } from './PrintableQuoteDocument';

interface QuoteDetailsModalProps {
  quote: Quote | null;
  isOpen: boolean;
  currency?: CurrencyCode;
  onClose: () => void;
  onConvertToOrder: (quote: Quote) => void;
  onStatusChange: (quoteId: string, newStatus: Quote['status']) => void;
  onExtendValidity?: (quoteId: string, days: number) => void;
  onCreateRevision?: (quoteId: string, newDiscount?: number, newNotes?: string) => void;
  onDuplicateQuote?: (quoteId: string) => void;
  onSignAndAccept?: (quoteId: string, signature: QuoteSignature) => void;
}

export function QuoteDetailsModal({
  quote,
  isOpen,
  currency = 'USD',
  onClose,
  onConvertToOrder,
  onStatusChange,
  onExtendValidity,
  onCreateRevision,
  onDuplicateQuote,
  onSignAndAccept,
}: QuoteDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'print' | 'revisions' | 'signature'>('overview');
  const [isRevisionInputOpen, setIsRevisionInputOpen] = useState(false);
  const [revDiscount, setRevDiscount] = useState<number>(quote?.discountPercent || 0);
  const [revNotes, setRevNotes] = useState('');

  // E-signature state
  const [signerName, setSignerName] = useState(quote?.contact || '');
  const [signerTitle, setSignerTitle] = useState('Authorized Client Representative');
  const [sigType, setSigType] = useState<'typed' | 'stylized'>('stylized');

  if (!isOpen || !quote) return null;

  const expiry = getExpiryStatus(quote.validUntil);

  const handlePrint = () => {
    window.print();
  };

  const handleCreateRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRevision?.(quote.id, revDiscount, revNotes || `Discount updated to ${revDiscount}%`);
    setIsRevisionInputOpen(false);
    setActiveTab('revisions');
  };

  const handleSignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim()) return;

    const signature: QuoteSignature = {
      signedBy: signerName.trim(),
      title: signerTitle.trim() || 'Purchaser',
      signedAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      ipAddress: '198.51.100.42 (Encrypted TLS)',
    };

    onSignAndAccept?.(quote.id, signature);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 print:p-0 print:border-none print:shadow-none print:max-w-none">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-[#2A2B27] print:hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-accent text-sm sm:text-base">
              {quote.id}
            </span>

            {quote.version && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-accent/15 text-accent border border-accent/25">
                v{quote.version}
              </span>
            )}

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

            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${expiry.badgeClass}`}>
              {expiry.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Print Official Proposal"
            >
              <Printer className="w-4 h-4 text-ink-muted" />
              <span className="hidden sm:inline font-semibold">Print</span>
            </button>

            {onDuplicateQuote && (
              <button
                type="button"
                onClick={() => {
                  onDuplicateQuote(quote.id);
                  onClose();
                }}
                className="p-2 rounded-xl text-ink-muted hover:text-accent hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                title="Clone Quote"
              >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">Clone</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-border dark:border-[#2A2B27] pb-2 print:hidden overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-accent text-white font-bold shadow-xs'
                : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Proposal Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('print')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'print'
                ? 'bg-accent text-white font-bold shadow-xs'
                : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Official PDF Document</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('revisions')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'revisions'
                ? 'bg-accent text-white font-bold shadow-xs'
                : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Revisions &amp; Versions ({quote.revisions?.length || 1})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('signature')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'signature'
                ? 'bg-accent text-white font-bold shadow-xs'
                : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Digital E-Signature {quote.signature ? '✓' : ''}</span>
          </button>
        </div>

        {/* ─── TAB 1: OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
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
                <p className="text-ink-muted dark:text-neutral-400 flex items-center sm:justify-end gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Valid Until: <strong className="text-amber-600 dark:text-amber-400">{quote.validUntil}</strong></span>
                </p>
                <p className="text-ink-muted dark:text-neutral-400">
                  Payment Terms: <span className="font-semibold text-ink dark:text-neutral-200">{quote.paymentTerms}</span>
                </p>
                <p className="text-ink-muted dark:text-neutral-400">
                  Currency: <strong className="font-mono text-accent">{currency}</strong>
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
                        {formatCurrency(line.unitPrice, currency)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-ink-muted dark:text-neutral-400">
                        {line.discountPercent > 0 ? `${line.discountPercent}%` : '—'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-ink dark:text-white">
                        {formatCurrency(line.total, currency)}
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
                {quote.winProbability && (
                  <div className="mt-2 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span className="font-semibold text-ink dark:text-white">
                      AI Win Probability Score: <strong className="text-emerald-600 dark:text-emerald-400">{quote.winProbability}%</strong>
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full sm:w-64 space-y-1 text-xs">
                <div className="flex justify-between text-ink-muted dark:text-neutral-400">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">{formatCurrency(quote.subtotal, currency)}</span>
                </div>
                {quote.discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount ({quote.discountPercent}%):</span>
                    <span className="font-mono font-semibold">- {formatCurrency((quote.subtotal * quote.discountPercent) / 100, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink-muted dark:text-neutral-400">
                  <span>Tax / VAT (8%):</span>
                  <span className="font-mono font-semibold">{formatCurrency(quote.tax, currency)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-ink dark:text-white pt-1.5 border-t border-border dark:border-[#2A2B27]">
                  <span>Total Amount:</span>
                  <span className="font-mono font-black text-accent">{formatCurrency(quote.amount, currency)}</span>
                </div>
              </div>
            </div>

            {/* Quick Extension & Action Controls */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/80 dark:border-[#2A2B27] flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {onExtendValidity && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onExtendValidity(quote.id, 7)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3 h-3" />
                      <span>+7 Days Validity</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onExtendValidity(quote.id, 14)}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400 hover:bg-amber-500/15 transition-colors cursor-pointer"
                    >
                      +14d
                    </button>
                  </div>
                )}

                {quote.status !== 'Approved' && quote.status !== 'Converted' && (
                  <button
                    type="button"
                    onClick={() => onStatusChange(quote.id, 'Approved')}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-600/20 hover:bg-emerald-600/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve Proposal</span>
                  </button>
                )}

                {quote.status === 'Draft' && (
                  <button
                    type="button"
                    onClick={() => onStatusChange(quote.id, 'Sent')}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 hover:bg-blue-600/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send to Client</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('signature')}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-accent/30 text-accent hover:bg-accent/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>E-Sign &amp; Convert</span>
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
                    <span>Convert to Order</span>
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
        )}

        {/* ─── TAB 2: PRINTABLE OFFICIAL DOCUMENT ─── */}
        {activeTab === 'print' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-neutral-100 dark:bg-[#141513] p-3 rounded-xl text-xs print:hidden">
              <span className="text-ink-muted">
                Executive formatted proposal layout ready for browser printing or client export.
              </span>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 font-bold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
            <PrintableQuoteDocument quote={quote} currency={currency} />
          </div>
        )}

        {/* ─── TAB 3: REVISIONS & CHANGE LOG ─── */}
        {activeTab === 'revisions' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-ink dark:text-white">
                  Proposal Versioning &amp; Discount History
                </h4>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  Track client negotiation rounds, price concessions, and audit trails.
                </p>
              </div>

              {onCreateRevision && (
                <button
                  type="button"
                  onClick={() => setIsRevisionInputOpen(!isRevisionInputOpen)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Revision v{(quote.version || 1) + 1}</span>
                </button>
              )}
            </div>

            {/* Create Revision Drawer */}
            {isRevisionInputOpen && (
              <form
                onSubmit={handleCreateRevisionSubmit}
                className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#141513] border border-accent/30 space-y-3"
              >
                <h5 className="text-xs font-bold text-accent uppercase tracking-wider">
                  New Revision Terms (v{(quote.version || 1) + 1})
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-ink-muted dark:text-neutral-400 mb-1">
                      New Negotiated Discount (%):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={revDiscount}
                      onChange={(e) => setRevDiscount(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-ink-muted dark:text-neutral-400 mb-1">
                      Reason / Negotiation Note:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Matched competitor bid after CFO call"
                      value={revNotes}
                      onChange={(e) => setRevNotes(e.target.value)}
                      className="w-full p-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRevisionInputOpen(false)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-border dark:border-[#2A2B27] text-ink-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover"
                  >
                    Save Revision v{(quote.version || 1) + 1}
                  </button>
                </div>
              </form>
            )}

            {/* Timeline */}
            <div className="relative pl-6 space-y-4 border-l-2 border-border dark:border-[#2A2B27]">
              {(quote.revisions && quote.revisions.length > 0 ? quote.revisions : [
                {
                  version: quote.version || 1,
                  date: quote.date,
                  author: 'Account Manager',
                  amount: quote.amount,
                  discountPercent: quote.discountPercent,
                  notes: 'Initial quotation created.',
                }
              ]).map((rev) => (
                <div key={rev.version} className="relative group">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-accent border-2 border-white dark:border-[#1A1B18]" />
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-ink dark:text-white flex items-center gap-2">
                        <span>Version {rev.version}</span>
                        {rev.version === quote.version && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-600 font-bold">
                            Current
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-ink-muted text-[11px]">{rev.date}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-ink-muted dark:text-neutral-400">By: {rev.author}</span>
                      <span className="font-mono font-bold text-accent">
                        {formatCurrency(rev.amount, currency)} ({rev.discountPercent}% off)
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted dark:text-neutral-400 italic pt-1">
                      &quot;{rev.notes}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 4: CLIENT E-SIGNATURE SIMULATOR ─── */}
        {activeTab === 'signature' && (
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-bold text-ink dark:text-white flex items-center gap-2">
                <PenTool className="w-4 h-4 text-accent" />
                <span>Client E-Signature &amp; Instant Order Authorization</span>
              </h4>
              <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
                Simulate formal commercial acceptance with cryptographic timestamping. Formally accepting immediately books this proposal as an active Sales Order.
              </p>
            </div>

            {quote.signature ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                  <CheckCircle className="w-4 h-4" />
                  <span>Proposal Formally Signed &amp; Accepted</span>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-[#141513] border border-border dark:border-[#2A2B27]">
                  <div className="font-serif italic text-2xl text-ink dark:text-white mb-1">
                    {quote.signature.signedBy}
                  </div>
                  <div className="text-xs text-ink-muted">
                    {quote.signature.title} • Executed: {quote.signature.signedAt}
                  </div>
                  <div className="text-[10px] text-ink-muted font-mono mt-1">
                    Verified Security Hash: TLS-SHA256-{quote.id}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-ink dark:text-neutral-300 mb-1">
                      Signatory Full Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      className="w-full p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#141513] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-ink dark:text-neutral-300 mb-1">
                      Signatory Job Title:
                    </label>
                    <input
                      type="text"
                      required
                      value={signerTitle}
                      onChange={(e) => setSignerTitle(e.target.value)}
                      placeholder="e.g. Chief Operating Officer"
                      className="w-full p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#141513] text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Simulated Signature Preview Box */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-ink dark:text-neutral-300">
                      Digital Signature Render:
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSigType('stylized')}
                        className={`text-[10px] px-2 py-0.5 rounded cursor-pointer ${
                          sigType === 'stylized' ? 'bg-accent text-white font-bold' : 'text-ink-muted'
                        }`}
                      >
                        Cursive
                      </button>
                      <button
                        type="button"
                        onClick={() => setSigType('typed')}
                        className={`text-[10px] px-2 py-0.5 rounded cursor-pointer ${
                          sigType === 'typed' ? 'bg-accent text-white font-bold' : 'text-ink-muted'
                        }`}
                      >
                        Serif Formal
                      </button>
                    </div>
                  </div>

                  <div className="h-28 rounded-2xl border-2 border-dashed border-border dark:border-[#2A2B27] bg-[#FAF9F5] dark:bg-[#141513] flex flex-col items-center justify-center p-4">
                    <div
                      className={`text-2xl sm:text-3xl text-neutral-800 dark:text-neutral-200 ${
                        sigType === 'stylized'
                          ? 'font-serif italic tracking-wider'
                          : 'font-mono uppercase tracking-widest'
                      }`}
                    >
                      {signerName || 'Signature Preview'}
                    </div>
                    <span className="text-[10px] text-ink-muted mt-2 font-mono">
                      Timestamp: {new Date().toLocaleDateString()} • IP Checked
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    By signing, the client accepts pricing of <strong>{formatCurrency(quote.amount, currency)}</strong> and agrees to Bahi terms. A confirmed Sales Order will be booked automatically.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Sign &amp; Formally Book Order</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
