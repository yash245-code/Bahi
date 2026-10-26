'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Quote,
  SalesOrder,
  DiscountRule,
  initialQuotes,
  initialOrders,
  initialDiscountRules,
} from './salesData';

const QUOTES_STORAGE_KEY = 'bahi-sales-quotes';
const ORDERS_STORAGE_KEY = 'bahi-sales-orders';
const RULES_STORAGE_KEY = 'bahi-sales-discount-rules';

export function useSalesStore() {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [orders, setOrders] = useState<SalesOrder[]>(initialOrders);
  const [discountRules, setDiscountRules] = useState<DiscountRule[]>(initialDiscountRules);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedQuotes = localStorage.getItem(QUOTES_STORAGE_KEY);
      if (savedQuotes) setQuotes(JSON.parse(savedQuotes));

      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedRules = localStorage.getItem(RULES_STORAGE_KEY);
      if (savedRules) setDiscountRules(JSON.parse(savedRules));
    } catch (_) {}
    setIsLoaded(true);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 3200);
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

  const addQuote = useCallback(
    (newQuote: Quote) => {
      const next = [newQuote, ...quotes];
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

      // Update quote status to Converted
      const nextQuotes = quotes.map((q) =>
        q.id === quote.id ? { ...q, status: 'Converted' as const } : q
      );
      saveQuotes(nextQuotes);

      // Prepend order
      const nextOrders = [newOrder, ...orders];
      saveOrders(nextOrders);

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
