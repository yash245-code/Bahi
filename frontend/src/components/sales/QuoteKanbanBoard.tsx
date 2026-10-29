'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Eye,
  ShoppingBag,
  Sparkles,
  Send,
  Calendar,
  Copy,
  Edit,
  Mail,
  GripVertical,
  Check,
} from 'lucide-react';
import { Quote, CurrencyCode, formatCurrency, getExpiryStatus } from './salesData';

interface QuoteKanbanBoardProps {
  quotes: Quote[];
  currency: CurrencyCode;
  onSelectQuote: (quote: Quote) => void;
  onUpdateStatus: (quoteId: string, status: Quote['status']) => void;
  onConvertToOrder: (quote: Quote) => void;
  onExtendValidity: (quoteId: string, days: number) => void;
  onDuplicateQuote: (quoteId: string) => void;
  onOpenEmailModal?: (quote: Quote) => void;
  onEditQuote?: (quote: Quote) => void;
}

const STAGES: {
  id: Quote['status'];
  title: string;
  badgeClass: string;
  dotColor: string;
  dropBorderClass: string;
}[] = [
  {
    id: 'Draft',
    title: 'Draft Proposals',
    badgeClass: 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20',
    dotColor: 'bg-neutral-400',
    dropBorderClass: 'ring-2 ring-neutral-400 border-transparent',
  },
  {
    id: 'Sent',
    title: 'Sent to Client',
    badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    dotColor: 'bg-blue-500',
    dropBorderClass: 'ring-2 ring-blue-500 border-transparent',
  },
  {
    id: 'Approved',
    title: 'Approved / Won',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dotColor: 'bg-emerald-500',
    dropBorderClass: 'ring-2 ring-emerald-500 border-transparent',
  },
  {
    id: 'Converted',
    title: 'Booked to Order',
    badgeClass: 'bg-[#A8462F]/15 text-[#A8462F] dark:text-[#E0724F] border-[#A8462F]/30',
    dotColor: 'bg-[#A8462F]',
    dropBorderClass: 'ring-2 ring-[#A8462F] border-transparent',
  },
  {
    id: 'Expired',
    title: 'Expired / Stalled',
    badgeClass: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    dotColor: 'bg-red-500',
    dropBorderClass: 'ring-2 ring-red-500 border-transparent',
  },
];

export function QuoteKanbanBoard({
  quotes,
  currency,
  onSelectQuote,
  onUpdateStatus,
  onConvertToOrder,
  onExtendValidity,
  onDuplicateQuote,
  onOpenEmailModal,
  onEditQuote,
}: QuoteKanbanBoardProps) {
  const [draggedQuoteId, setDraggedQuoteId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Quote['status'] | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, quoteId: string) => {
    e.dataTransfer.setData('text/plain', quoteId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedQuoteId(quoteId);
  };

  const handleDragEnd = () => {
    setDraggedQuoteId(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, stageId: Quote['status']) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStage: Quote['status']) => {
    e.preventDefault();
    setDragOverStage(null);
    const quoteId = e.dataTransfer.getData('text/plain') || draggedQuoteId;
    if (!quoteId) return;

    const targetQuote = quotes.find((q) => q.id === quoteId);
    if (!targetQuote || targetQuote.status === targetStage) return;

    if (targetStage === 'Converted') {
      onConvertToOrder(targetQuote);
    } else {
      onUpdateStatus(quoteId, targetStage);
    }
    setDraggedQuoteId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 select-none">
      {STAGES.map((stage) => {
        const stageQuotes = quotes.filter((q) => q.status === stage.id);
        const stageTotal = stageQuotes.reduce((sum, q) => sum + q.amount, 0);
        const isTarget = dragOverStage === stage.id;

        return (
          <div
            key={stage.id}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
            className={`flex flex-col bg-neutral-50/80 dark:bg-[#141513] rounded-2xl border transition-all duration-200 p-3 min-w-[270px] shadow-2xs ${
              isTarget
                ? `${stage.dropBorderClass} bg-accent/5 dark:bg-[#1C1D18]`
                : 'border-border/80 dark:border-[#2A2B27]'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border/70 dark:border-[#2A2B27]">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${stage.dotColor}`} />
                <h3 className="text-xs font-bold text-ink dark:text-neutral-200 uppercase tracking-wider">
                  {stage.title}
                </h3>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${stage.badgeClass}`}>
                {stageQuotes.length}
              </span>
            </div>

            {/* Total pipeline value for this column */}
            <div className="mb-3 px-1 flex items-center justify-between text-[11px] text-ink-muted dark:text-neutral-400">
              <span>Stage Value:</span>
              <span className="font-mono font-bold text-ink dark:text-neutral-200">
                {formatCurrency(stageTotal, currency)}
              </span>
            </div>

            {/* Cards Stack */}
            <div className="flex-1 space-y-3 min-h-[360px]">
              {stageQuotes.length === 0 ? (
                <div
                  className={`h-40 border border-dashed rounded-xl flex flex-col items-center justify-center p-4 text-center transition-colors ${
                    isTarget
                      ? 'border-accent bg-accent/10 text-accent font-semibold'
                      : 'border-border/70 dark:border-[#2A2B27] text-ink-muted/70 dark:text-neutral-500'
                  }`}
                >
                  <span className="text-[11px]">
                    {isTarget ? 'Drop Quote Here' : `No quotes in ${stage.id.toLowerCase()}`}
                  </span>
                  <span className="text-[9px] opacity-75 mt-1">Drag quotation cards here to move</span>
                </div>
              ) : (
                stageQuotes.map((quote) => {
                  const expiry = getExpiryStatus(quote.validUntil);
                  const winOdds = quote.winProbability ?? 70;
                  const isDragging = draggedQuoteId === quote.id;

                  return (
                    <div
                      key={quote.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, quote.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onSelectQuote(quote)}
                      className={`bg-white dark:bg-[#1A1B18] border rounded-xl p-3.5 shadow-xs transition-all cursor-grab active:cursor-grabbing group space-y-2.5 relative ${
                        isDragging
                          ? 'opacity-40 scale-95 border-accent'
                          : 'border-border dark:border-[#2A2B27] hover:border-accent/40 hover:shadow-md'
                      }`}
                    >
                      {/* Top Bar: Quote ID & Version & Expiry */}
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <GripVertical className="w-3.5 h-3.5 text-ink-muted/50 group-hover:text-ink-muted transition-colors cursor-grab" />
                          <span className="font-mono font-bold text-accent text-xs">
                            {quote.id}
                          </span>
                          {quote.version && quote.version > 1 && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md font-mono bg-accent/10 text-accent font-bold">
                              v{quote.version}
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-md ${expiry.badgeClass}`}
                          title={`Valid until ${quote.validUntil}`}
                        >
                          {expiry.label}
                        </span>
                      </div>

                      {/* Customer & Contact */}
                      <div>
                        <div className="text-xs font-bold text-ink dark:text-white group-hover:text-accent transition-colors line-clamp-1">
                          {quote.customer}
                        </div>
                        <div className="text-[10px] text-ink-muted dark:text-neutral-400 truncate">
                          {quote.contact} • {quote.paymentTerms}
                        </div>
                      </div>

                      {/* Amount & Items */}
                      <div className="flex items-baseline justify-between pt-1 border-t border-border/50 dark:border-[#2A2B27]">
                        <span className="text-[10px] text-ink-muted font-medium">
                          {quote.itemsCount} {quote.itemsCount === 1 ? 'item' : 'items'}
                          {quote.discountPercent > 0 && ` (${quote.discountPercent}% off)`}
                        </span>
                        <span className="font-mono text-sm font-black text-ink dark:text-white">
                          {formatCurrency(quote.amount, currency)}
                        </span>
                      </div>

                      {/* Win Probability Bar */}
                      {quote.status !== 'Converted' && quote.status !== 'Expired' && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[9px] text-ink-muted">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-accent" />
                              <span>Win Probability</span>
                            </span>
                            <span className="font-mono font-bold text-ink dark:text-neutral-300">
                              {winOdds}%
                            </span>
                          </div>
                          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                winOdds >= 80
                                  ? 'bg-emerald-500'
                                  : winOdds >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${winOdds}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {quote.tags && quote.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {quote.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] px-1.5 py-0.2 bg-neutral-100 dark:bg-neutral-800 text-ink-muted rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Quick Action Footer */}
                      <div
                        className="pt-2 border-t border-border/50 dark:border-[#2A2B27] flex items-center justify-between gap-1 flex-wrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onSelectQuote(quote)}
                            className="p-1 rounded text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Inspect Quote Details"
                          >
                            <Eye className="w-3 h-3" />
                          </button>

                          {onEditQuote && (quote.status === 'Draft' || quote.status === 'Sent') && (
                            <button
                              type="button"
                              onClick={() => onEditQuote(quote)}
                              className="p-1 rounded text-ink-muted hover:text-accent hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                              title="Edit Proposal"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          )}

                          {onOpenEmailModal && (
                            <button
                              type="button"
                              onClick={() => onOpenEmailModal(quote)}
                              className="p-1 rounded text-ink-muted hover:text-blue-600 hover:bg-blue-500/10 transition-colors"
                              title="Send Proposal via Email"
                            >
                              <Mail className="w-3 h-3" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onDuplicateQuote(quote.id)}
                            className="p-1 rounded text-ink-muted hover:text-accent hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Clone as New Quote"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Stage Specific Advance Button */}
                        {quote.status === 'Draft' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(quote.id, 'Sent')}
                            className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-2.5 h-2.5" />
                            <span>Send</span>
                          </button>
                        )}

                        {quote.status === 'Sent' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(quote.id, 'Approved')}
                            className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {quote.status === 'Approved' && (
                          <button
                            type="button"
                            onClick={() => onConvertToOrder(quote)}
                            className="px-2 py-0.5 text-[10px] font-bold rounded bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-bold"
                          >
                            <ShoppingBag className="w-2.5 h-2.5" />
                            <span>Book Order</span>
                          </button>
                        )}

                        {quote.status === 'Expired' && (
                          <button
                            type="button"
                            onClick={() => onExtendValidity(quote.id, 7)}
                            className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/10 text-amber-700 hover:bg-amber-600 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Calendar className="w-2.5 h-2.5" />
                            <span>+7 Days</span>
                          </button>
                        )}

                        {quote.status === 'Converted' && (
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Order Active</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
