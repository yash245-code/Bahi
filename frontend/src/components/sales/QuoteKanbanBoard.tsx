'use client';

import {
  CheckCircle2,
  Eye,
  ShoppingBag,
  Sparkles,
  Send,
  Calendar,
  Copy,
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
}

const STAGES: {
  id: Quote['status'];
  title: string;
  badgeClass: string;
  dotColor: string;
}[] = [
  { id: 'Draft', title: 'Draft Proposals', badgeClass: 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20', dotColor: 'bg-neutral-400' },
  { id: 'Sent', title: 'Sent to Client', badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', dotColor: 'bg-blue-500' },
  { id: 'Approved', title: 'Approved / Won', badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', dotColor: 'bg-emerald-500' },
  { id: 'Converted', title: 'Booked to Order', badgeClass: 'bg-[#A8462F]/15 text-[#A8462F] dark:text-[#E0724F] border-[#A8462F]/30', dotColor: 'bg-[#A8462F]' },
  { id: 'Expired', title: 'Expired / Stalled', badgeClass: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', dotColor: 'bg-red-500' },
];

export function QuoteKanbanBoard({
  quotes,
  currency,
  onSelectQuote,
  onUpdateStatus,
  onConvertToOrder,
  onExtendValidity,
  onDuplicateQuote,
}: QuoteKanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const stageQuotes = quotes.filter((q) => q.status === stage.id);
        const stageTotal = stageQuotes.reduce((sum, q) => sum + q.amount, 0);

        return (
          <div
            key={stage.id}
            className="flex flex-col bg-neutral-50/80 dark:bg-[#141513] rounded-2xl border border-border/80 dark:border-[#2A2B27] p-3 min-w-[260px] shadow-2xs"
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
            <div className="flex-1 space-y-3 min-h-[300px]">
              {stageQuotes.length === 0 ? (
                <div className="h-36 border border-dashed border-border/70 dark:border-[#2A2B27] rounded-xl flex items-center justify-center p-4 text-center">
                  <span className="text-[11px] text-ink-muted/70 dark:text-neutral-500">
                    No quotes in {stage.id.toLowerCase()}
                  </span>
                </div>
              ) : (
                stageQuotes.map((quote) => {
                  const expiry = getExpiryStatus(quote.validUntil);
                  const winOdds = quote.winProbability ?? 70;

                  return (
                    <div
                      key={quote.id}
                      onClick={() => onSelectQuote(quote)}
                      className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] hover:border-accent/40 rounded-xl p-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2.5 relative"
                    >
                      {/* Top Bar: Quote ID & Version & Expiry */}
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
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
                        className="pt-2 border-t border-border/50 dark:border-[#2A2B27] flex items-center justify-between gap-1"
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
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ Order Active
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
