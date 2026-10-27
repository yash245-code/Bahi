'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Quote,
  SalesOrder,
  DiscountRule,
  CurrencyCode,
  QuoteRevision,
  QuoteSignature,
  initialQuotes,
  initialOrders,
  initialDiscountRules,
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
      const next = quotes.map((q) => (ids.includes(q.id) ? { ...q, status } : q));
      saveQuotes(next);
      clearSelectedQuotes();
      showToast(`Updated ${ids.length} quotation(s) to status ${status}`);
    },
    [quotes, saveQuotes, clearSelectedQuotes, showToast]
  );

  const batchExtendValidity = useCallback(
    (ids: string[], daysToAdd: number = 7) => {
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
        return {
          ...q,
          validUntil: newValid,
          status: resetStatus,
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
      const quoteWithMetadata: Quote = {
        ...newQuote,
        version: newQuote.version || 1,
        winProbability: newQuote.winProbability ?? Math.floor(70 + Math.random() * 25),
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
    [quotes, saveQuotes, showToast]
  );

  const updateQuoteStatus = useCallback(
    (quoteId: string, status: Quote['status']) => {
      const next = quotes.map((q) => (q.id === quoteId ? { ...q, status } : q));
      saveQuotes(next);
      showToast(`Quotation ${quoteId} updated to ${status}`);
    },
    [quotes, saveQuotes, showToast]
  );

  const extendQuoteValidity = useCallback(
    (quoteId: string, daysToAdd: number = 7) => {
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
        return {
          ...q,
          validUntil: newValid,
          status: nextStatus,
        };
      });
      saveQuotes(next);
      showToast(`Extended ${quoteId} validity by +${daysToAdd} days (New due date: ${next.find(q => q.id === quoteId)?.validUntil})`);
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

      const next = quotes.map((q) => {
        if (q.id !== quoteId) return q;
        return {
          ...q,
          version: nextVer,
          amount: newAmount,
          discountPercent: updatedDiscount,
          status: 'Draft' as const,
          revisions: [...(q.revisions || []), newRev],
          notes: newNotes ? `${q.notes ? q.notes + ' • ' : ''}${newNotes}` : q.notes,
        };
      });

      saveQuotes(next);
      showToast(`Created Revision v${nextVer} for Quote ${quoteId} ($${newAmount.toFixed(2)})`);
    },
    [quotes, saveQuotes, showToast]
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
        signature: undefined,
      };

      const next = [duplicated, ...quotes];
      saveQuotes(next);
      showToast(`Cloned ${original.id} into new draft proposal ${newId}`);
    },
    [quotes, saveQuotes, showToast]
  );

  const signAndAcceptQuote = useCallback(
    (quoteId: string, signature: QuoteSignature) => {
      const target = quotes.find((q) => q.id === quoteId);
      if (!target) return;

      // Update quote with signature
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

      const nextQuotes = quotes.map((q) =>
        q.id === target.id
          ? {
              ...q,
              status: 'Converted' as const,
              signature,
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

      const nextQuotes = quotes.map((q) =>
        q.id === quote.id ? { ...q, status: 'Converted' as const } : q
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
    updateQuoteStatus,
    convertQuoteToOrder,
    addOrder,
    updateOrderStatus,
    toggleDiscountRule,
    addDiscountRule,
    showToast,
    pipelineValue,
    ordersBookedValue,
    winRate,
  };
}
