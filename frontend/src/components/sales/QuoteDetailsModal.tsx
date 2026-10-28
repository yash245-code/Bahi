'use client';

import { useState, useEffect } from 'react';
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
  TrendingUp,
  Receipt,
  MessageSquare,
  Globe,
  Check,
  Send,
  Edit,
} from 'lucide-react';
import {
  Quote,
  CurrencyCode,
  formatCurrency,
  getExpiryStatus,
  QuoteSignature,
  calculateQuoteMargin,
} from './salesData';
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
  onOpenEmailModal?: (quote: Quote) => void;
  onEditQuote?: (quote: Quote) => void;
  onConvertToInvoice?: (quote: Quote) => void;
  onAddInternalNote?: (quoteId: string, noteText: string) => void;
  onSimulateClientView?: (quoteId: string) => void;
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
  onOpenEmailModal,
  onEditQuote,
  onConvertToInvoice,
  onAddInternalNote,
  onSimulateClientView,
}: QuoteDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'portal' | 'timeline' | 'print' | 'revisions' | 'signature'
  >('overview');

  const [isRevisionInputOpen, setIsRevisionInputOpen] = useState(false);
  const [revDiscount, setRevDiscount] = useState<number>(quote?.discountPercent || 0);
  const [revNotes, setRevNotes] = useState('');

  // Internal note state
  const [newNoteText, setNewNoteText] = useState('');
  const [isPostingNote, setIsPostingNote] = useState(false);

  // Client Portal simulation state
  const [portalFeedback, setPortalFeedback] = useState('');
  const [portalFeedbackSent, setPortalFeedbackSent] = useState(false);

  // E-signature state
  const [signerName, setSignerName] = useState(quote?.contact || '');
  const [signerTitle, setSignerTitle] = useState('Authorized Client Representative');
  const [sigType, setSigType] = useState<'typed' | 'stylized'>('stylized');

  // Trigger client view simulation when portal tab is clicked
  useEffect(() => {
    if (activeTab === 'portal' && quote && onSimulateClientView) {
      onSimulateClientView(quote.id);
    }
  }, [activeTab, quote, onSimulateClientView]);

  if (!isOpen || !quote) return null;

  const expiry = getExpiryStatus(quote.validUntil);
  const marginStats = calculateQuoteMargin(quote.lines, quote.shippingFee || 0);

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
      ipAddress: '198.51.100.42 (Encrypted TLS Client Token)',
    };

    onSignAndAccept?.(quote.id, signature);
    onClose();
  };

  const handlePostInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setIsPostingNote(true);
    onAddInternalNote?.(quote.id, newNoteText.trim());
    setNewNoteText('');
    setIsPostingNote(false);
  };

  const handleSendPortalFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalFeedback.trim()) return;

    onAddInternalNote?.(
      quote.id,
      `[Client Inquiry from Portal]: "${portalFeedback.trim()}"`
    );
    setPortalFeedbackSent(true);
    setPortalFeedback('');
    setTimeout(() => setPortalFeedbackSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 print:p-0 print:border-none print:shadow-none print:max-w-none">
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
            {/* Direct Email Action */}
            {onOpenEmailModal && (
              <button
                type="button"
                onClick={() => onOpenEmailModal(quote)}
                className="p-2 rounded-xl text-ink-muted hover:text-accent hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                title="Send via Email"
              >
                <Mail className="w-4 h-4 text-accent" />
                <span className="hidden sm:inline font-semibold">Email</span>
              </button>
            )}

            {/* Direct Edit Action */}
            {onEditQuote && quote.status !== 'Converted' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditQuote(quote);
                }}
                className="p-2 rounded-xl text-ink-muted hover:text-accent hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                title="Edit Quote"
              >
                <Edit className="w-4 h-4 text-ink-muted" />
                <span className="hidden sm:inline font-semibold">Edit</span>
              </button>
            )}

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
        <div className="flex items-center gap-1 border-b border-border dark:border-[#2A2B27] pb-2 print:hidden overflow-x-auto text-xs font-semibold no-scrollbar">
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
            onClick={() => setActiveTab('portal')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'portal'
                ? 'bg-accent text-white font-bold shadow-xs'
                : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Client Web View</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-accent text-white font-bold shadow-xs'
                : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Activity &amp; Notes ({quote.activities?.length || 0})</span>
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
            <span>Revisions ({quote.revisions?.length || 1})</span>
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
                  <span>
                    Issued: <strong className="text-ink dark:text-neutral-200">{quote.date}</strong>
                  </span>
                </div>
                <p className="text-ink-muted dark:text-neutral-400 flex items-center sm:justify-end gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    Valid Until: <strong className="text-amber-600 dark:text-amber-400">{quote.validUntil}</strong>
                  </span>
                </p>
                <p className="text-ink-muted dark:text-neutral-400">
                  Payment Terms: <span className="font-semibold text-ink dark:text-neutral-200">{quote.paymentTerms}</span>
                </p>
                <p className="text-ink-muted dark:text-neutral-400">
                  Currency: <strong className="font-mono text-accent">{currency}</strong>
                </p>
              </div>
            </div>

            {/* Profit Margin Barometer Banner */}
            <div className="p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-[#141513] border border-border/80 dark:border-[#2A2B27] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-accent/10 text-accent">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-ink dark:text-white">Commercial Margin Breakdown: </span>
                  <span
                    className={`px-2 py-0.2 rounded-full font-bold uppercase tracking-wider text-[10px] font-mono ${
                      marginStats.status === 'healthy'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : marginStats.status === 'moderate'
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                        : 'bg-red-500/15 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {marginStats.marginPercent}% Margin
                  </span>
                  <span className="text-ink-muted dark:text-neutral-400 block text-[11px] mt-0.5">
                    Est. Delivery Cost: {formatCurrency(marginStats.totalCost, currency)} • Gross Profit: {formatCurrency(marginStats.grossProfit, currency)}
                  </span>
                </div>
              </div>

              {quote.portalViewedAt && (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Client opened link on {quote.portalViewedAt}</span>
                </div>
              )}
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
                    <th className="py-2.5 px-3 text-right">Total ({currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
                  {quote.lines.map((line) => (
                    <tr key={line.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                      <td className="py-3 px-3">
                        <span className="font-semibold text-ink dark:text-white block">
                          {line.productName}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-ink-muted">{line.sku}</span>
                          {line.isCustom && (
                            <span className="text-[9px] px-1.5 rounded-sm bg-accent/10 text-accent font-semibold">
                              Custom Item
                            </span>
                          )}
                        </div>
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
                {quote.notes && <p className="italic">&quot;{quote.notes}&quot;</p>}
                {quote.winProbability && (
                  <div className="mt-2 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span className="font-semibold text-ink dark:text-white">
                      AI Win Probability Score:{' '}
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        {quote.winProbability}%
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full sm:w-64 space-y-1 text-xs">
                <div className="flex justify-between text-ink-muted dark:text-neutral-400">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">
                    {formatCurrency(quote.subtotal, currency)}
                  </span>
                </div>
                {quote.discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount ({quote.discountPercent}%):</span>
                    <span className="font-mono font-semibold">
                      - {formatCurrency((quote.subtotal * quote.discountPercent) / 100, currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-ink-muted dark:text-neutral-400">
                  <span>Tax ({quote.taxRate || 8}%):</span>
                  <span className="font-mono font-semibold">{formatCurrency(quote.tax, currency)}</span>
                </div>
                {!!quote.shippingFee && (
                  <div className="flex justify-between text-ink-muted dark:text-neutral-400">
                    <span>Shipping / Logistics:</span>
                    <span className="font-mono font-semibold">
                      {formatCurrency(quote.shippingFee, currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-ink dark:text-white pt-1.5 border-t border-border dark:border-[#2A2B27]">
                  <span>Total Amount:</span>
                  <span className="font-mono font-black text-accent">
                    {formatCurrency(quote.amount, currency)}
                  </span>
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

                {/* Generate Proforma Invoice Button */}
                {onConvertToInvoice && (
                  <button
                    type="button"
                    onClick={() => onConvertToInvoice(quote)}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Generate Proforma Invoice in Invoicing Module"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Generate Invoice</span>
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

        {/* ─── TAB 2: CLIENT PORTAL SIMULATION ─── */}
        {activeTab === 'portal' && (
          <div className="space-y-5">
            {/* Simulation Header */}
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-900 dark:text-blue-300">
                  <strong>Client Portal Simulation:</strong> This is the live responsive interface your client sees when opening{' '}
                  <span className="font-mono text-[10px] underline">https://bahi.app/portal/quotes/{quote.id}</span>
                </span>
              </div>
            </div>

            {/* Portal Page Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF9F5] dark:bg-[#141513] border-2 border-border dark:border-[#2A2B27] shadow-lg space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/80 dark:border-[#2A2B27]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-accent tracking-widest block">
                    Bahi Enterprise Solutions
                  </span>
                  <h3 className="text-xl font-black text-ink dark:text-white">
                    Commercial Proposal for {quote.customer}
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Reference: {quote.id} • Version v{quote.version || 1}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${expiry.badgeClass}`}>
                    {expiry.label}
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-white">
                  Included Solution Items &amp; Services
                </h4>
                <div className="space-y-2">
                  {quote.lines.map((l) => (
                    <div
                      key={l.id}
                      className="p-3 rounded-xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-ink dark:text-white">{l.productName}</div>
                        <div className="text-ink-muted text-[11px]">
                          Quantity: {l.quantity} × {formatCurrency(l.unitPrice, currency)}
                          {l.discountPercent > 0 && ` (${l.discountPercent}% promo discount)`}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-sm text-ink dark:text-white">
                        {formatCurrency(l.total, currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grand Total Bar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] flex items-center justify-between">
                <div>
                  <span className="text-xs text-ink-muted">Total Commercial Commitment</span>
                  <div className="text-xs text-ink-muted">
                    Includes taxes &amp; standard delivery terms
                  </div>
                </div>
                <div className="font-mono font-black text-2xl text-accent">
                  {formatCurrency(quote.amount, currency)}
                </div>
              </div>

              {/* Customer Actions Simulation */}
              <div className="pt-2 border-t border-border/80 dark:border-[#2A2B27] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <form onSubmit={handleSendPortalFeedback} className="flex items-center gap-2 grow max-w-md">
                  <input
                    type="text"
                    value={portalFeedback}
                    onChange={(e) => setPortalFeedback(e.target.value)}
                    placeholder="Ask a question or request adjustment..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white focus:outline-hidden focus:border-accent"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs font-bold rounded-xl border border-border dark:border-[#2A2B27] hover:border-accent text-ink dark:text-white whitespace-nowrap cursor-pointer"
                  >
                    Send Note
                  </button>
                  {portalFeedbackSent && (
                    <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Sent!
                    </span>
                  )}
                </form>

                <button
                  type="button"
                  onClick={() => setActiveTab('signature')}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Accept &amp; Digitally Sign Proposal</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: ACTIVITY TIMELINE & NOTES ─── */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-ink dark:text-white">
                Proposal Audit Trail &amp; Team Collaboration
              </h4>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Track client interactions, email dispatches, status changes, and internal call notes.
              </p>
            </div>

            {/* Post Internal Note Input */}
            <form
              onSubmit={handlePostInternalNote}
              className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27] space-y-2.5"
            >
              <label className="text-xs font-bold text-ink dark:text-white flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-accent" />
                <span>Add Internal Team Note / Call Log</span>
              </label>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  required
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="e.g. Spoke with client CFO: Confirmed budget clearance, expected PO by Friday."
                  className="grow text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white focus:outline-hidden focus:border-accent resize-none"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim() || isPostingNote}
                  className="px-4 py-2 rounded-xl bg-accent text-white font-bold text-xs hover:bg-accent-hover transition-colors shrink-0 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </div>
            </form>

            {/* Timeline Stream */}
            <div className="space-y-3 relative pl-6 border-l-2 border-border dark:border-[#2A2B27] ml-3">
              {(quote.activities || []).length === 0 ? (
                <p className="text-xs text-ink-muted py-4">No logged activities for this quotation yet.</p>
              ) : (
                quote.activities?.map((act) => {
                  let badgeBg = 'bg-accent/10 text-accent';
                  let icon = <FileText className="w-3.5 h-3.5" />;

                  if (act.type === 'sent') {
                    badgeBg = 'bg-blue-500/10 text-blue-500';
                    icon = <Mail className="w-3.5 h-3.5" />;
                  } else if (act.type === 'viewed') {
                    badgeBg = 'bg-amber-500/10 text-amber-500';
                    icon = <Globe className="w-3.5 h-3.5" />;
                  } else if (act.type === 'approved' || act.type === 'signed') {
                    badgeBg = 'bg-emerald-500/10 text-emerald-500';
                    icon = <CheckCircle className="w-3.5 h-3.5" />;
                  } else if (act.type === 'converted' || act.type === 'invoiced') {
                    badgeBg = 'bg-purple-500/10 text-purple-500';
                    icon = <Receipt className="w-3.5 h-3.5" />;
                  } else if (act.type === 'note') {
                    badgeBg = 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-300';
                    icon = <MessageSquare className="w-3.5 h-3.5" />;
                  }

                  return (
                    <div key={act.id} className="relative group">
                      {/* Node point */}
                      <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-[#1A1B18] border-2 border-accent flex items-center justify-center shadow-xs" />

                      <div className="p-3.5 rounded-2xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2A2B27] space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-ink dark:text-white">
                            <span className={`p-1 rounded-md ${badgeBg}`}>{icon}</span>
                            <span>{act.author}</span>
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full uppercase bg-neutral-200/50 dark:bg-neutral-800 text-ink-muted">
                              {act.type}
                            </span>
                          </div>
                          <span className="text-[11px] text-ink-muted font-mono">{act.timestamp}</span>
                        </div>
                        <p className="text-xs text-ink-muted dark:text-neutral-300 pl-6 leading-relaxed">
                          {act.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 4: PRINTABLE OFFICIAL DOCUMENT ─── */}
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

        {/* ─── TAB 5: REVISIONS & CHANGE LOG ─── */}
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
                    className="px-4 py-1.5 text-xs font-bold rounded-xl bg-accent text-white"
                  >
                    Publish Revision
                  </button>
                </div>
              </form>
            )}

            {/* Revisions Stream */}
            <div className="space-y-3">
              {(quote.revisions || []).map((rev) => (
                <div
                  key={rev.version}
                  className={`p-4 rounded-2xl border transition-all ${
                    rev.version === (quote.version || 1)
                      ? 'border-accent bg-accent/5 dark:bg-accent/10 shadow-xs'
                      : 'border-border dark:border-[#2A2B27] bg-[#FAF9F5] dark:bg-[#141513]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-accent px-2 py-0.5 rounded-md bg-accent/10">
                        Version {rev.version}
                      </span>
                      {rev.version === (quote.version || 1) && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Current Active Version
                        </span>
                      )}
                    </div>
                    <span className="text-ink-muted font-mono">{rev.date}</span>
                  </div>

                  <p className="text-xs text-ink dark:text-neutral-200 font-medium">{rev.notes}</p>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/60 dark:border-[#2A2B27] text-xs">
                    <span className="text-ink-muted">Author: {rev.author}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-ink-muted">Discount: {rev.discountPercent}%</span>
                      <span className="font-mono font-bold text-ink dark:text-white">
                        {formatCurrency(rev.amount, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 6: DIGITAL E-SIGNATURE ─── */}
        {activeTab === 'signature' && (
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-bold text-ink dark:text-white flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-accent" />
                <span>Authorized Digital E-Signature</span>
              </h4>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Execute formal client acceptance with legally binding e-signature audit metadata.
              </p>
            </div>

            {quote.signature ? (
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-ink dark:text-white">
                    Proposal Digitally Signed &amp; Approved
                  </h4>
                  <p className="text-xs text-ink-muted">
                    Signed by <strong>{quote.signature.signedBy}</strong> ({quote.signature.title}) on{' '}
                    {quote.signature.signedAt}
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-[#1A1B18] rounded-xl border border-emerald-500/20 font-serif text-2xl italic text-ink dark:text-neutral-100 max-w-sm mx-auto">
                  {quote.signature.signedBy}
                </div>
                <div className="text-[10px] text-ink-muted font-mono">
                  TLS Certificate Hash: SHA-256 Validated • {quote.signature.ipAddress || '198.51.100.42'}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignSubmit} className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-ink-muted dark:text-neutral-400 mb-1 font-semibold">
                        Authorized Signatory Full Name:
                      </label>
                      <input
                        type="text"
                        required
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-xs font-semibold"
                        placeholder="e.g. Maya Lin"
                      />
                    </div>
                    <div>
                      <label className="block text-ink-muted dark:text-neutral-400 mb-1 font-semibold">
                        Signatory Corporate Title:
                      </label>
                      <input
                        type="text"
                        value={signerTitle}
                        onChange={(e) => setSignerTitle(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-xs"
                        placeholder="e.g. VP Operations"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-ink-muted dark:text-neutral-400 mb-1.5 font-semibold">
                      Digital Signature Style:
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSigType('stylized')}
                        className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                          sigType === 'stylized'
                            ? 'border-accent bg-accent/10 text-accent font-bold'
                            : 'border-border dark:border-[#2A2B27]'
                        }`}
                      >
                        Stylized Cursive
                      </button>
                      <button
                        type="button"
                        onClick={() => setSigType('typed')}
                        className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                          sigType === 'typed'
                            ? 'border-accent bg-accent/10 text-accent font-bold'
                            : 'border-border dark:border-[#2A2B27]'
                        }`}
                      >
                        Formal Typed
                      </button>
                    </div>

                    <div className="mt-3 p-4 bg-white dark:bg-[#1A1B18] rounded-xl border-2 border-dashed border-border dark:border-[#2A2B27] text-center min-h-[70px] flex items-center justify-center">
                      <span
                        className={
                          sigType === 'stylized'
                            ? 'font-serif italic text-2xl text-ink dark:text-neutral-100 tracking-wide'
                            : 'font-mono text-base font-bold text-ink dark:text-neutral-100 uppercase tracking-widest'
                        }
                      >
                        {signerName || 'Signature Preview'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-[11px] leading-relaxed">
                  By clicking &quot;Execute Digital Signature &amp; Book Order&quot;, you certify that you have the corporate authority to bind {quote.customer} to the commercial payment terms ({formatCurrency(quote.amount, currency)}).
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="px-4 py-2 text-xs rounded-xl border border-border dark:border-[#2A2B27] text-ink-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Execute Digital Signature &amp; Book Order</span>
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
