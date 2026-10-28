'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Send,
  Mail,
  Copy,
  Check,
  Paperclip,
  Sparkles,
} from 'lucide-react';
import {
  Quote,
  CurrencyCode,
  formatCurrency,
  emailTemplates,
  EmailTemplate,
} from './salesData';

interface SendQuoteEmailModalProps {
  quote: Quote | null;
  isOpen: boolean;
  currency?: CurrencyCode;
  onClose: () => void;
  onSendEmail: (
    quoteId: string,
    emailData: {
      to: string;
      cc?: string;
      subject: string;
      body: string;
      templateId: string;
    }
  ) => void;
}

export function SendQuoteEmailModal({
  quote,
  isOpen,
  currency = 'USD',
  onClose,
  onSendEmail,
}: SendQuoteEmailModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('initial_quote');
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('sales-ops@bahi.app');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachPdf, setAttachPdf] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Helper to replace template tokens with actual quote values
  const hydrateTemplate = (
    text: string,
    q: Quote,
    cur: CurrencyCode
  ): string => {
    return text
      .replaceAll('{{customer}}', q.customer)
      .replaceAll('{{contact}}', q.contact)
      .replaceAll('{{quoteId}}', q.id)
      .replaceAll('{{amount}}', formatCurrency(q.amount, cur))
      .replaceAll('{{validUntil}}', q.validUntil)
      .replaceAll('{{paymentTerms}}', q.paymentTerms || 'Net 30')
      .replaceAll('{{version}}', (q.version || 1).toString());
  };

  useEffect(() => {
    if (quote && isOpen) {
      setTo(quote.email || '');

      // Select default template based on quote status or revision
      let defaultTplId = 'initial_quote';
      if (quote.version && quote.version > 1) {
        defaultTplId = 'revised';
      } else if (quote.status === 'Sent') {
        defaultTplId = 'followup';
      } else if (quote.status === 'Expired') {
        defaultTplId = 'urgency';
      }
      setSelectedTemplateId(defaultTplId);

      const tpl = emailTemplates.find((t) => t.id === defaultTplId) || emailTemplates[0];
      if (tpl) {
        setSubject(hydrateTemplate(tpl.subject, quote, currency));
        setBody(hydrateTemplate(tpl.body, quote, currency));
      }
    }
  }, [quote, isOpen, currency]);

  if (!isOpen || !quote) return null;

  const handleTemplateChange = (template: EmailTemplate) => {
    setSelectedTemplateId(template.id);
    setSubject(hydrateTemplate(template.subject, quote, currency));
    setBody(hydrateTemplate(template.body, quote, currency));
  };

  const portalLink = `https://bahi.app/portal/quotes/${quote.id}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(portalLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      onSendEmail(quote.id, {
        to: to.trim(),
        cc: cc.trim() || undefined,
        subject: subject.trim(),
        body: body.trim(),
        templateId: selectedTemplateId,
      });
      setIsSending(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-[#2A2B27]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 text-accent">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink dark:text-white flex items-center gap-2">
                <span>Dispatch Quotation via Email</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent font-semibold">
                  {quote.id}
                </span>
              </h2>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Send formal commercial offer and client portal access link
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Email Template Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-ink-muted dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Preset Message Templates</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {emailTemplates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleTemplateChange(tpl)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedTemplateId === tpl.id
                    ? 'border-accent bg-accent/5 dark:bg-accent/10 shadow-xs'
                    : 'border-border dark:border-[#2A2B27] hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-[#141513]'
                }`}
              >
                <div className="text-[11px] font-bold text-ink dark:text-white truncate">
                  {tpl.name}
                </div>
                <div className="text-[9px] text-ink-muted dark:text-neutral-500 mt-0.5">
                  {tpl.badge}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Recipient & CC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-ink-muted dark:text-neutral-400 font-semibold mb-1">
                To (Recipient Email) *
              </label>
              <input
                type="email"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="client@company.com"
                className="w-full px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-ink-muted dark:text-neutral-400 font-semibold mb-1">
                CC (Sales Operations / Archive)
              </label>
              <input
                type="email"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="sales-ops@bahi.app"
                className="w-full px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-ink-muted dark:text-neutral-400 font-semibold mb-1">
              Subject Line
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent font-medium"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-ink-muted dark:text-neutral-400 font-semibold mb-1">
              Proposal Message Body
            </label>
            <textarea
              rows={8}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent font-mono text-[11px] leading-relaxed resize-y"
            />
          </div>

          {/* Attachment & Portal Link Row */}
          <div className="p-3.5 rounded-2xl bg-neutral-100/70 dark:bg-[#141513] border border-border/80 dark:border-[#2A2B27] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={attachPdf}
                onChange={(e) => setAttachPdf(e.target.checked)}
                className="rounded accent-accent cursor-pointer"
              />
              <span className="flex items-center gap-1.5 font-semibold text-ink dark:text-white text-[11px]">
                <Paperclip className="w-3.5 h-3.5 text-accent" />
                <span>Attach formal PDF summary ({quote.id}.pdf)</span>
              </span>
            </label>

            {/* Shareable Client Link Pill */}
            <div className="flex items-center gap-2 text-[11px] w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-ink-muted dark:text-neutral-400">Portal Link:</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] hover:border-accent text-accent font-mono text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Portal URL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/80 dark:border-[#2A2B27]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 rounded-xl border border-border dark:border-[#2A2B27] text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2 rounded-xl bg-accent text-white font-bold hover:bg-accent/90 transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Sending Proposal...' : 'Dispatch Proposal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

