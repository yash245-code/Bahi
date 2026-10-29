'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Quote,
  SalesOrder,
  DiscountRule,
  CurrencyCode,
  QuoteRevision,
  QuoteSignature,
  QuoteActivity,
  initialQuotes,
  initialOrders,
  initialDiscountRules,
  formatCurrency,
} from './salesData';

const QUOTES_STORAGE_KEY = 'bahi-sales-quotes';
const ORDERS_STORAGE_KEY = 'bahi-sales-orders';
const RULES_STORAGE_KEY = 'bahi-sales-discount-rules';
const CURRENCY_STORAGE_KEY = 'bahi-sales-currency';
const VIEW_STORAGE_KEY = 'bahi-sales-quotes-view';

export function useSalesStore() {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [orders, setOrders] = useState<SalesOrder[]>(initialOrders);
  const [discountRules, setDiscountRules] = useState<DiscountRule[]>(initialDiscountRules);
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [activeView, setActiveViewState] = useState<'table' | 'kanban'>('table');
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedQuotes = localStorage.getItem(QUOTES_STORAGE_KEY);
      if (savedQuotes) {
        const parsed = JSON.parse(savedQuotes) as Quote[];
        // Backfill any missing fields for backwards compatibility
        const normalized = parsed.map((q) => ({
          ...q,
          version: q.version || 1,
          winProbability: q.winProbability ?? Math.floor(65 + Math.random() * 30),
          taxRate: q.taxRate ?? (q.subtotal > 0 ? Math.round((q.tax / q.subtotal) * 1000) / 10 : 8.0),
          shippingFee: q.shippingFee ?? 0,
          activities:
            q.activities && q.activities.length > 0
              ? q.activities
              : [
                  {
                    id: `act-init-${q.id}`,
                    timestamp: `${q.date} 10:00 AM`,
                    type: 'created' as const,
                    author: 'Sales Executive',
                    message: `Quotation ${q.id} created for ${q.customer}.`,
                  },
                ],
          revisions: q.revisions || [
            {
              version: 1,
              date: q.date,
              author: 'Sales Rep',
              amount: q.amount,
              discountPercent: q.discountPercent || 0,
              notes: 'Initial quotation generated.',
            },
          ],
          tags: q.tags || ['Standard Quote'],
        }));
        setQuotes(normalized);
      }

      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedRules = localStorage.getItem(RULES_STORAGE_KEY);
      if (savedRules) setDiscountRules(JSON.parse(savedRules));

      const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode;
      if (savedCurrency) setCurrencyState(savedCurrency);

      const savedView = localStorage.getItem(VIEW_STORAGE_KEY) as 'table' | 'kanban';
      if (savedView) setActiveViewState(savedView);
    } catch (_) {}
    setIsLoaded(true);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 3500);
  }, []);

  // Sync to localStorage
  const saveQuotes = useCallback((nextQuotes: Quote[]) => {
    setQuotes(nextQuotes);
    try {
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(nextQuotes));
    } catch (_) {}
  }, []);

  const saveOrders = useCallback((nextOrders: SalesOrder[]) => {
    setOrders(nextOrders);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(nextOrders));
    } catch (_) {}
  }, []);

  const saveRules = useCallback((nextRules: DiscountRule[]) => {
    setDiscountRules(nextRules);
    try {
      localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(nextRules));
    } catch (_) {}
  }, []);

  const setCurrency = useCallback(
    (code: CurrencyCode) => {
      setCurrencyState(code);
      try {
        localStorage.setItem(CURRENCY_STORAGE_KEY, code);
      } catch (_) {}
      showToast(`Active Currency changed to ${code}`);
    },
    [showToast]
  );

  const setActiveView = useCallback((view: 'table' | 'kanban') => {
    setActiveViewState(view);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, view);
    } catch (_) {}
  }, []);

  // Multi-selection operations
  const toggleSelectQuote = useCallback((id: string) => {
    setSelectedQuoteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const selectAllQuotes = useCallback((ids: string[]) => {
    setSelectedQuoteIds(ids);
  }, []);

  const clearSelectedQuotes = useCallback(() => {
    setSelectedQuoteIds([]);
  }, []);

  const batchUpdateQuoteStatus = useCallback(
    (ids: string[], status: Quote['status']) => {
      const now = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const next = quotes.map((q) => {
        if (!ids.includes(q.id)) return q;
        const newAct: QuoteActivity = {
          id: `act-${Date.now()}-${q.id}`,
          timestamp: now,
          type: status === 'Approved' ? 'approved' : status === 'Sent' ? 'sent' : 'revised',
          author: 'Sales Operations',
          message: `Status updated to ${status} via bulk update.`,
        };
        return {
          ...q,
          status,
          activities: [newAct, ...(q.activities || [])],
        };
      });
      saveQuotes(next);
      clearSelectedQuotes();
      showToast(`Updated ${ids.length} quotation(s) to status ${status}`);
    },
    [quotes, saveQuotes, clearSelectedQuotes, showToast]
  );

  const batchExtendValidity = useCallback(
    (ids: string[], daysToAdd: number = 7) => {
      const now = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const next = quotes.map((q) => {
        if (!ids.includes(q.id)) return q;
        const current = new Date(q.validUntil);
        current.setDate(current.getDate() + daysToAdd);
        const newValid = current.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        const resetStatus = q.status === 'Expired' ? ('Draft' as const) : q.status;
        const newAct: QuoteActivity = {
          id: `act-${Date.now()}-${q.id}`,
          timestamp: now,
          type: 'revised',
          author: 'Sales Operations',
          message: `Validity extended by +${daysToAdd} days to ${newValid}.`,
        };
        return {
          ...q,
          validUntil: newValid,
          status: resetStatus,
          activities: [newAct, ...(q.activities || [])],
        };
      });
      saveQuotes(next);
      clearSelectedQuotes();
      showToast(`Extended validity by +${daysToAdd} days for ${ids.length} quote(s)`);
    },
    [quotes, saveQuotes, clearSelectedQuotes, showToast]
  );

  // Single Quote operations
  const addQuote = useCallback(
    (newQuote: Quote) => {
      const now = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const initialActivity: QuoteActivity = {
        id: `act-${Date.now()}`,
        timestamp: now,
        type: 'created',
        author: 'Current User',
        message: `Commercial proposal ${newQuote.id} created for ${newQuote.customer} (${formatCurrency(newQuote.amount, currency)}).`,
      };

      const quoteWithMetadata: Quote = {
        ...newQuote,
        version: newQuote.version || 1,
        winProbability: newQuote.winProbability ?? Math.floor(70 + Math.random() * 25),
        activities: newQuote.activities?.length ? newQuote.activities : [initialActivity],
        revisions: newQuote.revisions || [
          {
            version: 1,
            date: newQuote.date,
            author: 'Current User',
            amount: newQuote.amount,
            discountPercent: newQuote.discountPercent,
            notes: 'Initial quotation created.',
          },
        ],
      };
      const next = [quoteWithMetadata, ...quotes];
      saveQuotes(next);
      showToast(`Quotation ${newQuote.id} created successfully for ${newQuote.customer}`);
    },
    [quotes, currency, saveQuotes, showToast]
  );

  const updateQuote = useCallback(
    (updatedQuote: Quote) => {
      const now = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const updateActivity: QuoteActivity = {
        id: `act-${Date.now()}`,
        timestamp: now,
        type: 'revised',
        author: 'Current User',
        message: `Quotation updated (Amount: ${formatCurrency(updatedQuote.amount, currency)}, Lines: ${updatedQuote.itemsCount}).`,
      };
      const quoteWithActivity: Quote = {
        ...updatedQuote,
        activities: [updateActivity, ...(updatedQuote.activities || [])],
      };
      const next = quotes.map((q) => (q.id === updatedQuote.id ? quoteWithActivity : q));
      saveQuotes(next);
      showToast(`Quotation ${updatedQuote.id} updated successfully`);
    },
    [quotes, currency, saveQuotes, showToast]
  );

  const updateQuoteStatus = useCallback(
    (quoteId: string, status: Quote['status']) => {
      const now = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const next = quotes.map((q) => {
        if (q.id !== quoteId) return q;
        const newAct: QuoteActivity = {
          id: `act-${Date.now()}`,
          timestamp: now,
          type: status === 'Approved' ? 'approved' : status === 'Sent' ? 'sent' : 'revised',
          author: 'Current User',
          message: `Status moved to ${status}.`,
        };
        return {
          ...q,
          status,
          activities: [newAct, ...(q.activities || [])],
        };
      });
      saveQuotes(next);
      showToast(`Quotation ${quoteId} updated to ${status}`);
    },
    [quotes, saveQuotes, showToast]
  );

  const extendQuoteValidity = useCallback(
    (quoteId: string, daysToAdd: number = 7) => {
      const now = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const next = quotes.map((q) => {
        if (q.id !== quoteId) return q;
        const current = new Date(q.validUntil);
        current.setDate(current.getDate() + daysToAdd);
        const newValid = current.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        const nextStatus = q.status === 'Expired' ? ('Draft' as const) : q.status;
        const newAct: QuoteActivity = {
          id: `act-${Date.now()}`,
          timestamp: now,
          type: 'revised',
          author: 'Current User',
          message: `Validity extended +${daysToAdd} days (due ${newValid}).`,
        };
        return {
          ...q,
          validUntil: newValid,
          status: nextStatus,
          activities: [newAct, ...(q.activities || [])],
        };
      });
      saveQuotes(next);
      showToast(`Extended ${quoteId} validity by +${daysToAdd} days`);
    },
    [quotes, saveQuotes, showToast]
  );

  const createQuoteRevision = useCallback(
    (quoteId: string, newDiscount?: number, newNotes?: string) => {
      const target = quotes.find((q) => q.id === quoteId);
      if (!target) return;

      const currentVer = target.version || 1;
      const nextVer = currentVer + 1;
      const today = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const now = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const updatedDiscount = newDiscount !== undefined ? newDiscount : target.discountPercent;
      const subtotal = target.subtotal;
      const discountAmount = subtotal * (updatedDiscount / 100);
      const newAmount = Math.round((subtotal - discountAmount + target.tax) * 100) / 100;

      const newRev: QuoteRevision = {
        version: nextVer,
        date: today,
        author: 'Account Executive',
        amount: newAmount,
        discountPercent: updatedDiscount,
        notes: newNotes || `Revision v${nextVer} generated with adjusted pricing terms.`,
      };

      const newAct: QuoteActivity = {
        id: `act-${Date.now()}`,
        timestamp: now,
        type: 'revised',
        author: 'Account Executive',
        message: `Generated Revision v${nextVer} with ${updatedDiscount}% discount (${formatCurrency(newAmount, currency)}).`,
      };

      const next = quotes.map((q) => {
        if (q.id !== quoteId) return q;
        return {
          ...q,
          version: nextVer,
          amount: newAmount,
          discountPercent: updatedDiscount,
          status: 'Draft' as const,
          revisions: [...(q.revisions || []), newRev],
          activities: [newAct, ...(q.activities || [])],
          notes: newNotes ? `${q.notes ? q.notes + ' • ' : ''}${newNotes}` : q.notes,
        };
      });

      saveQuotes(next);
      showToast(`Created Revision v${nextVer} for Quote ${quoteId} (${formatCurrency(newAmount, currency)})`);
    },
    [quotes, currency, saveQuotes, showToast]
  );

  const duplicateQuote = useCallback(
    (quoteId: string) => {
      const original = quotes.find((q) => q.id === quoteId);
      if (!original) return;

      const today = new Date();
      const valid = new Date();
      valid.setDate(today.getDate() + 14);

      const newId = `QT-2026-${Math.floor(100 + Math.random() * 900)}`;
      const duplicated: Quote = {
        ...original,
        id: newId,
        customer: `${original.customer} (Copy)`,
        date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        validUntil: valid.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Draft',
        version: 1,
        revisions: [
          {
            version: 1,
            date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            author: 'Current User',
            amount: original.amount,
            discountPercent: original.discountPercent,
            notes: `Cloned from quotation ${original.id}.`,
          },
        ],
        activities: [
          {
            id: `act-${Date.now()}`,
            timestamp: today.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            type: 'created',
            author: 'Current User',
            message: `Proposal duplicated from ${original.id}.`,
          },
        ],
        signature: undefined,
        portalViewedAt: undefined,
      };

      const next = [duplicated, ...quotes];
      saveQuotes(next);
      showToast(`Cloned ${original.id} into new draft proposal ${newId}`);
    },
    [quotes, saveQuotes, showToast]
  );

  const sendQuoteEmail = useCallback(
    (quoteId: string, emailData: { to: string; cc?: string; subject: string; body: string; templateId: string }) => {
      const now = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const next = quotes.map((q) => {
        if (q.id !== quoteId) return q;
        const newActivity: QuoteActivity = {
          id: `act-${Date.now()}`,
          timestamp: now,
          type: 'sent',
          author: 'Sales Operations',
          message: `Emailed proposal to ${emailData.to} (Subject: "${emailData.subject}").`,
          metadata: { to: emailData.to, subject: emailData.subject, templateId: emailData.templateId },
        };
        const nextStatus = q.status === 'Draft' || q.status === 'Expired' ? ('Sent' as const) : q.status;
        return {
          ...q,
          status: nextStatus,
          activities: [newActivity, ...(q.activities || [])],
        };
      });

      saveQuotes(next);
      showToast(`✓ Quotation proposal dispatched to ${emailData.to}`);
    },
    [quotes, saveQuotes, showToast]
  );

  const addQuoteInternalNote = useCallback(
    (quoteId: string, noteText: string, author: string = 'Commercial Rep') => {
      const now = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const newActivity: QuoteActivity = {
        id: `act-${Date.now()}`,
        timestamp: now,
        type: 'note',
        author,
        message: noteText,
      };

      const next = quotes.map((q) => {
        if (q.id !== quoteId) return q;
        return {
          ...q,
          activities: [newActivity, ...(q.activities || [])],
        };
      });

      saveQuotes(next);
      showToast('Internal note saved to proposal timeline.');
    },
    [quotes, saveQuotes, showToast]
  );

  const simulateClientView = useCallback(
    (quoteId: string) => {
      const now = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const next = quotes.map((q) => {
        if (q.id !== quoteId) return q;
        if (q.portalViewedAt) return q;
        const newActivity: QuoteActivity = {
          id: `act-${Date.now()}`,
          timestamp: now,
          type: 'viewed',
          author: 'Client Portal',
          message: 'Client viewed the digital proposal via client portal.',
        };
        return {
          ...q,
          portalViewedAt: now,
          activities: [newActivity, ...(q.activities || [])],
        };
      });

      saveQuotes(next);
    },
    [quotes, saveQuotes]
  );

  const convertQuoteToInvoice = useCallback(
    (quote: Quote) => {
      const invId = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
      const now = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const newActivity: QuoteActivity = {
        id: `act-${Date.now()}`,
        timestamp: now,
        type: 'invoiced',
        author: 'Accounting Automation',
        message: `Generated Proforma Invoice ${invId} for ${quote.customer} (${formatCurrency(quote.amount, currency)}).`,
      };

      const next = quotes.map((q) => {
        if (q.id !== quote.id) return q;
        return {
          ...q,
          status: q.status === 'Converted' ? q.status : ('Converted' as const),
          activities: [newActivity, ...(q.activities || [])],
        };
      });

      saveQuotes(next);
      showToast(`✓ Generated Proforma Invoice ${invId} for ${quote.customer}`);
    },
    [quotes, currency, saveQuotes, showToast]
  );

  const signAndAcceptQuote = useCallback(
    (quoteId: string, signature: QuoteSignature) => {
      const target = quotes.find((q) => q.id === quoteId);
      if (!target) return;

      const today = new Date();
      const delivery = new Date();
      delivery.setDate(today.getDate() + 5);

      const newOrder: SalesOrder = {
        id: `SO-2026-${Math.floor(100 + Math.random() * 900)}`,
        quoteRef: target.id,
        customer: target.customer,
        contact: target.contact,
        date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        deliveryDate: delivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: target.amount,
        subtotal: target.subtotal,
        tax: target.tax,
        status: 'Confirmed',
        paymentStatus: 'Pending',
        shippingAddress: `${target.customer} HQ, Attn: ${signature.signedBy}`,
        itemsCount: target.itemsCount,
        lines: target.lines.map((l) => ({
          id: `SOL-${Date.now()}-${l.id}`,
          productName: l.productName,
          sku: l.sku,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          total: l.total,
        })),
      };

      const now = today.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const signAct: QuoteActivity = {
        id: `act-${Date.now()}-sign`,
        timestamp: now,
        type: 'signed',
        author: signature.signedBy,
        message: `Digitally signed & authorized by ${signature.signedBy} (${signature.title}).`,
      };

      const convertAct: QuoteActivity = {
        id: `act-${Date.now()}-conv`,
        timestamp: now,
        type: 'converted',
        author: 'System Automation',
        message: `Proposal converted to booked Sales Order ${newOrder.id}.`,
      };

      const nextQuotes = quotes.map((q) =>
        q.id === target.id
          ? {
              ...q,
              status: 'Converted' as const,
              signature,
              activities: [convertAct, signAct, ...(q.activities || [])],
            }
          : q
      );

      saveQuotes(nextQuotes);
      saveOrders([newOrder, ...orders]);
      showToast(`✓ Digitally Signed by ${signature.signedBy}! Order ${newOrder.id} booked automatically.`);
    },
    [quotes, orders, saveQuotes, saveOrders, showToast]
  );

  const convertQuoteToOrder = useCallback(
    (quote: Quote) => {
      const today = new Date();
      const delivery = new Date();
      delivery.setDate(today.getDate() + 5);

      const newOrder: SalesOrder = {
        id: `SO-2026-${Math.floor(100 + Math.random() * 900)}`,
        quoteRef: quote.id,
        customer: quote.customer,
        contact: quote.contact,
        date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        deliveryDate: delivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: quote.amount,
        subtotal: quote.subtotal,
        tax: quote.tax,
        status: 'Confirmed',
        paymentStatus: 'Pending',
        shippingAddress: `${quote.customer} Procurement Dept, Dock 1`,
        itemsCount: quote.itemsCount,
        lines: quote.lines.map((l) => ({
          id: `SOL-${Date.now()}-${l.id}`,
          productName: l.productName,
          sku: l.sku,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          total: l.total,
        })),
      };

      const now = today.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const convertAct: QuoteActivity = {
        id: `act-${Date.now()}`,
        timestamp: now,
        type: 'converted',
        author: 'Sales Operations',
        message: `Converted proposal into Sales Order ${newOrder.id}.`,
      };

      const nextQuotes = quotes.map((q) =>
        q.id === quote.id
          ? {
              ...q,
              status: 'Converted' as const,
              activities: [convertAct, ...(q.activities || [])],
            }
          : q
      );
      saveQuotes(nextQuotes);
      saveOrders([newOrder, ...orders]);
      showToast(`✓ Converted Quote ${quote.id} into Sales Order ${newOrder.id}`);
    },
    [quotes, orders, saveQuotes, saveOrders, showToast]
  );

  const addOrder = useCallback(
    (newOrder: SalesOrder) => {
      const next = [newOrder, ...orders];
      saveOrders(next);
      showToast(`Sales Order ${newOrder.id} booked for ${newOrder.customer}`);
    },
    [orders, saveOrders, showToast]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: SalesOrder['status']) => {
      const next = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
      saveOrders(next);
      showToast(`Sales Order ${orderId} moved to stage ${status}`);
    },
    [orders, saveOrders, showToast]
  );

  const updateOrderPaymentStatus = useCallback(
    (orderId: string, paymentStatus: SalesOrder['paymentStatus']) => {
      const next = orders.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o));
      saveOrders(next);
      showToast(`Order ${orderId} payment status set to ${paymentStatus}`);
    },
    [orders, saveOrders, showToast]
  );

  const updateOrderTracking = useCallback(
    (orderId: string, carrier: string, trackingNumber: string) => {
      const next = orders.map((o) => (o.id === orderId ? { ...o, carrier, trackingNumber } : o));
      saveOrders(next);
      showToast(`Updated dispatch logistics for Order ${orderId}`);
    },
    [orders, saveOrders, showToast]
  );

  const addOrderInternalNote = useCallback(
    (orderId: string, noteText: string, author: string = 'Fulfillment Team') => {
      if (!noteText.trim()) return;
      const now = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const next = orders.map((o) => {
        if (o.id !== orderId) return o;
        const newNote = {
          id: `onote-${Date.now()}`,
          timestamp: now,
          author,
          text: noteText.trim(),
        };
        return {
          ...o,
          orderNotes: [newNote, ...(o.orderNotes || [])],
        };
      });
      saveOrders(next);
      showToast(`Logistics note added to Order ${orderId}`);
    },
    [orders, saveOrders, showToast]
  );

  const batchUpdateOrderStatus = useCallback(
    (orderIds: string[], status: SalesOrder['status']) => {
      if (orderIds.length === 0) return;
      const set = new Set(orderIds);
      const next = orders.map((o) => (set.has(o.id) ? { ...o, status } : o));
      saveOrders(next);
      showToast(`Updated ${orderIds.length} order(s) to stage ${status}`);
    },
    [orders, saveOrders, showToast]
  );

  const batchUpdateOrderPaymentStatus = useCallback(
    (orderIds: string[], paymentStatus: SalesOrder['paymentStatus']) => {
      if (orderIds.length === 0) return;
      const set = new Set(orderIds);
      const next = orders.map((o) => (set.has(o.id) ? { ...o, paymentStatus } : o));
      saveOrders(next);
      showToast(`Marked ${orderIds.length} order(s) as ${paymentStatus}`);
    },
    [orders, saveOrders, showToast]
  );

  const deleteOrder = useCallback(
    (orderId: string) => {
      const next = orders.filter((o) => o.id !== orderId);
      saveOrders(next);
      showToast(`Order ${orderId} removed from registry`);
    },
    [orders, saveOrders, showToast]
  );

  const toggleDiscountRule = useCallback(
    (ruleId: string) => {
      const next = discountRules.map((r) =>
        r.id === ruleId ? { ...r, isActive: !r.isActive } : r
      );
      saveRules(next);
      const rule = discountRules.find((r) => r.id === ruleId);
      showToast(
        `Discount Rule "${rule?.name || ruleId}" is now ${
          rule?.isActive ? 'Disabled' : 'Active'
        }`
      );
    },
    [discountRules, saveRules, showToast]
  );

  const addDiscountRule = useCallback(
    (rule: DiscountRule) => {
      const next = [rule, ...discountRules];
      saveRules(next);
      showToast(`New Discount Rule "${rule.name}" activated.`);
    },
    [discountRules, saveRules, showToast]
  );

  // Key performance calculations
  const pipelineValue = quotes
    .filter((q) => q.status !== 'Rejected' && q.status !== 'Expired')
    .reduce((acc, q) => acc + q.amount, 0);

  const ordersBookedValue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.amount, 0);

  const approvedQuotesCount = quotes.filter(
    (q) => q.status === 'Approved' || q.status === 'Converted'
  ).length;

  const totalQuotesEvaluated = quotes.length;
  const winRate =
    totalQuotesEvaluated > 0
      ? Math.round((approvedQuotesCount / totalQuotesEvaluated) * 100)
      : 0;

  return {
    quotes,
    orders,
    discountRules,
    currency,
    setCurrency,
    activeView,
    setActiveView,
    selectedQuoteIds,
    toggleSelectQuote,
    selectAllQuotes,
    clearSelectedQuotes,
    batchUpdateQuoteStatus,
    batchExtendValidity,
    extendQuoteValidity,
    createQuoteRevision,
    duplicateQuote,
    signAndAcceptQuote,
    toastMessage,
    isLoaded,
    addQuote,
    updateQuote,
    updateQuoteStatus,
    convertQuoteToOrder,
    convertQuoteToInvoice,
    sendQuoteEmail,
    addQuoteInternalNote,
    simulateClientView,
    addOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateOrderTracking,
    addOrderInternalNote,
    batchUpdateOrderStatus,
    batchUpdateOrderPaymentStatus,
    deleteOrder,
    toggleDiscountRule,
    addDiscountRule,
    showToast,
    pipelineValue,
    ordersBookedValue,
    winRate,
  };
}