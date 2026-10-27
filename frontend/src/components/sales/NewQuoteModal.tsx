'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { catalogProducts, Quote, QuoteLine, CurrencyCode, formatCurrency } from './salesData';

interface NewQuoteModalProps {
  isOpen: boolean;
  currency?: CurrencyCode;
  onClose: () => void;
  onCreateQuote: (quote: Quote) => void;
}

export function NewQuoteModal({
  isOpen,
  currency = 'USD',
  onClose,
  onCreateQuote,
}: NewQuoteModalProps) {
  const [customer, setCustomer] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [validDays, setValidDays] = useState(14);
  const [notes, setNotes] = useState('');

  const firstProd = catalogProducts[0] || {
    id: 'PROD-01',
    name: 'Cloud ERP Core Tenant License',
    sku: 'ERP-CORE-01',
    unitPrice: 450.0,
    category: 'Software',
  };

  const [lines, setLines] = useState<QuoteLine[]>([
    {
      id: 'QL-init-1',
      productId: firstProd.id,
      productName: firstProd.name,
      sku: firstProd.sku,
      quantity: 2,
      unitPrice: firstProd.unitPrice,
      discountPercent: 0,
      total: firstProd.unitPrice * 2,
    },
  ]);

  if (!isOpen) return null;

  const handleProductChange = (index: number, productId: string) => {
    const selected = catalogProducts.find((p) => p.id === productId);
    if (!selected) return;

    setLines((prev) => {
      const next = [...prev];
      const current = next[index];
      if (!current) return prev;
      const qty = current.quantity;
      const disc = current.discountPercent;
      const total = qty * selected.unitPrice * (1 - disc / 100);

      next[index] = {
        id: current.id,
        productId: selected.id,
        productName: selected.name,
        sku: selected.sku,
        quantity: qty,
        unitPrice: selected.unitPrice,
        discountPercent: disc,
        total: Math.round(total * 100) / 100,
      };
      return next;
    });
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const q = Math.max(1, quantity);
    setLines((prev) => {
      const next = [...prev];
      const item = next[index];
      if (!item) return prev;
      const total = q * item.unitPrice * (1 - item.discountPercent / 100);
      next[index] = {
        ...item,
        quantity: q,
        total: Math.round(total * 100) / 100,
      };
      return next;
    });
  };

  const handleDiscountChange = (index: number, discount: number) => {
    const d = Math.min(50, Math.max(0, discount));
    setLines((prev) => {
      const next = [...prev];
      const item = next[index];
      if (!item) return prev;
      const total = item.quantity * item.unitPrice * (1 - d / 100);
      next[index] = {
        ...item,
        discountPercent: d,
        total: Math.round(total * 100) / 100,
      };
      return next;
    });
  };

  const handleAddLine = () => {
    const prod = catalogProducts[lines.length % catalogProducts.length] || firstProd;
    setLines((prev) => [
      ...prev,
      {
        id: `QL-new-${Date.now()}`,
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        quantity: 1,
        unitPrice: prod.unitPrice,
        discountPercent: 0,
        total: prod.unitPrice,
      },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  // AI Copilot Actions
  const applyAIPricingOptimization = () => {
    setLines((prev) =>
      prev.map((l) => {
        // Recommend 7.5% volume discount for quantities >= 2, 5% otherwise
        const optDisc = l.quantity >= 2 ? 8 : 5;
        const total = l.quantity * l.unitPrice * (1 - optDisc / 100);
        return {
          ...l,
          discountPercent: optDisc,
          total: Math.round(total * 100) / 100,
        };
      })
    );
    setPaymentTerms('Net 30');
    setNotes(
      (prev) =>
        prev ||
        'Optimized commercial terms: Includes complimentary deployment SLA and 30-day onboarding guarantee.'
    );
  };

  const addUpsellAuditService = () => {
    const auditProd = catalogProducts.find((p) => p.id === 'PROD-06') || {
      id: 'PROD-06',
      name: 'Multi-Tenant Security & Compliance Audit',
      sku: 'SEC-AUD-06',
      unitPrice: 1200.0,
      category: 'Services',
    };

    if (lines.some((l) => l.productId === auditProd.id)) return;

    setLines((prev) => [
      ...prev,
      {
        id: `QL-upsell-${Date.now()}`,
        productId: auditProd.id,
        productName: auditProd.name,
        sku: auditProd.sku,
        quantity: 1,
        unitPrice: auditProd.unitPrice,
        discountPercent: 10,
        total: auditProd.unitPrice * 0.9,
      },
    ]);
  };

  const subtotal = lines.reduce((acc, l) => acc + l.total, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
  const grandTotal = Math.round((subtotal + tax) * 100) / 100;

  // Margin calculation
  const maxDiscountInQuote = Math.max(...lines.map((l) => l.discountPercent), 0);
  const marginFloorBreached = maxDiscountInQuote > 25;

  // AI Win probability estimation
  const avgDiscount = lines.reduce((sum, l) => sum + l.discountPercent, 0) / lines.length;
  let estimatedWinOdds = 65;
  if (avgDiscount >= 5 && avgDiscount <= 15) estimatedWinOdds = 88;
  if (avgDiscount > 15) estimatedWinOdds = 94;
  if (lines.length >= 3) estimatedWinOdds += 4;
  if (paymentTerms === 'Net 60') estimatedWinOdds -= 8;
  estimatedWinOdds = Math.min(98, Math.max(45, estimatedWinOdds));

  const handleSubmit = (status: 'Draft' | 'Sent') => {
    if (!customer.trim()) return;

    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + validDays);

    const newQuote: Quote = {
      id: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      customer: customer.trim(),
      contact: contact.trim() || 'Primary Procurement',
      email: email.trim() || 'procurement@client.com',
      phone: phone.trim() || '+1 (555) 000-0000',
      date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      validUntil: expiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: grandTotal,
      subtotal,
      tax,
      discountPercent: Math.round(avgDiscount),
      itemsCount: lines.reduce((acc, l) => acc + l.quantity, 0),
      paymentTerms,
      status,
      version: 1,
      winProbability: estimatedWinOdds,
      tags: ['New Opportunity', ...(lines.length > 2 ? ['Multi-Line Bundle'] : [])],
      notes: notes.trim() || undefined,
      lines,
    };

    onCreateQuote(newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-[#2A2B27]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#A8462F]/10 dark:bg-[#A8462F]/20 text-[#A8462F] flex items-center justify-center border border-[#A8462F]/25">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-ink dark:text-neutral-100 tracking-tight">
                  New Commercial Quotation
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent font-bold">
                  {currency} Currency
                </span>
              </div>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Generate itemized pricing proposal with automated AI pricing optimization and margin limits.
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

        {/* AI Quote Copilot Bar */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-accent/10 via-purple-500/10 to-blue-500/10 border border-accent/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-ink dark:text-white">
                <span>AI Quotation Copilot</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                  Win Probability: {estimatedWinOdds}%
                </span>
              </div>
              <p className="text-[11px] text-ink-muted dark:text-neutral-400">
                Optimal price bundle detected. Win odds peak around 8-10% discount.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={applyAIPricingOptimization}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimize Pricing</span>
            </button>
            <button
              type="button"
              onClick={addUpsellAuditService}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#141513] text-ink dark:text-neutral-200 hover:text-accent transition-colors flex items-center gap-1 cursor-pointer"
              title="Add Security & Compliance Audit add-on"
            >
              <Plus className="w-3 h-3" />
              <span>+Audit Upsell</span>
            </button>
          </div>
        </div>

        {/* Customer Information Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Client / Account Company <span className="text-[#A8462F]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Logistics Hub"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              placeholder="e.g. Devon Vance"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              placeholder="devon@apex.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Payment Terms
            </label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
            >
              <option value="Due on Receipt">Due on Receipt</option>
              <option value="Net 15">Net 15 Days</option>
              <option value="Net 30">Net 30 Days (Standard)</option>
              <option value="Net 60">Net 60 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Validity Duration
            </label>
            <select
              value={validDays}
              onChange={(e) => setValidDays(Number(e.target.value))}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
            >
              <option value={7}>7 Days</option>
              <option value={14}>14 Days (Standard)</option>
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
            </select>
          </div>
        </div>

        {/* Line Items Editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-neutral-300">
              Quotation Line Items &amp; Pricing
            </h3>
            <button
              type="button"
              onClick={handleAddLine}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#141513] text-ink dark:text-neutral-200 hover:border-accent hover:text-accent transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="border border-border dark:border-[#2A2B27] rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[620px]">
              <thead className="bg-neutral-50 dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-2.5 px-3">Catalog Item</th>
                  <th className="py-2.5 px-3 text-center w-24">Qty</th>
                  <th className="py-2.5 px-3 text-right w-28">Unit Price</th>
                  <th className="py-2.5 px-3 text-center w-24">Disc %</th>
                  <th className="py-2.5 px-3 text-right w-28">Total</th>
                  <th className="py-2.5 px-3 text-center w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
                {lines.map((line, idx) => (
                  <tr key={line.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                    <td className="py-2.5 px-3">
                      <select
                        value={line.productId}
                        onChange={(e) => handleProductChange(idx, e.target.value)}
                        className="w-full p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white font-medium"
                      >
                        {catalogProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku}) - ${p.unitPrice.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value) || 1)}
                        className="w-full text-center p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white font-mono"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-ink-muted dark:text-neutral-400">
                      {formatCurrency(line.unitPrice, currency)}
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={line.discountPercent}
                        onChange={(e) => handleDiscountChange(idx, parseFloat(e.target.value) || 0)}
                        className={`w-full text-center p-1.5 rounded-lg border bg-white dark:bg-[#1A1B18] font-mono ${
                          line.discountPercent > 25
                            ? 'border-red-500 text-red-600 font-bold'
                            : 'border-border dark:border-[#2A2B27] text-ink dark:text-neutral-100'
                        }`}
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-ink dark:text-white">
                      {formatCurrency(line.total, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        disabled={lines.length <= 1}
                        onClick={() => handleRemoveLine(idx)}
                        className={`p-1 rounded-md text-ink-muted hover:text-red-500 cursor-pointer ${
                          lines.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Margin Safeguard Warning */}
        {marginFloorBreached && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Margin Floor Safeguard Breach:</strong> One or more discounts exceed the standard 25% policy ceiling (RULE-104). VP Finance sign-off required prior to client dispatch.
            </span>
          </div>
        )}

        {/* Pricing Summary Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27]">
          <div className="flex items-center gap-2 text-xs text-ink-muted dark:text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Calculated in {currency} • Standard 8% sales tax applied automatically.</span>
          </div>

          <div className="w-full sm:w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-ink-muted dark:text-neutral-400">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">{formatCurrency(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-ink-muted dark:text-neutral-400">
              <span>Estimated Tax (8%):</span>
              <span className="font-mono font-medium">{formatCurrency(tax, currency)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-ink dark:text-white pt-1 border-t border-border/80 dark:border-[#2A2B27]">
              <span>Grand Total:</span>
              <span className="font-mono font-black text-[#A8462F] text-base">
                {formatCurrency(grandTotal, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
            Commercial Notes &amp; Special Conditions
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Price includes standard 1-year hardware warranty and cloud updates."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
          />
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80 dark:border-[#2A2B27]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!customer.trim()}
            onClick={() => handleSubmit('Draft')}
            className={`px-4 py-2 text-xs font-bold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1E1F1C] text-ink dark:text-neutral-200 hover:border-[#A8462F] transition-colors cursor-pointer ${
              !customer.trim() ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={!customer.trim()}
            onClick={() => handleSubmit('Sent')}
            className={`px-5 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs cursor-pointer ${
              !customer.trim() ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            Generate &amp; Send to Client
          </button>
        </div>
      </div>
    </div>
  );
}
