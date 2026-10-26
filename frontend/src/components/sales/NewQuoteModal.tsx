'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Calculator, Sparkles } from 'lucide-react';
import { catalogProducts, Quote, QuoteLine } from './salesData';

interface NewQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateQuote: (quote: Quote) => void;
}

export function NewQuoteModal({ isOpen, onClose, onCreateQuote }: NewQuoteModalProps) {
  const [customer, setCustomer] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const phone = '+1 (555) 234-5678';
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
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantity: q,
        unitPrice: item.unitPrice,
        discountPercent: item.discountPercent,
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
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
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

  const subtotal = lines.reduce((acc, l) => acc + l.total, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
  const grandTotal = Math.round((subtotal + tax) * 100) / 100;

  const handleSubmit = (status: 'Draft' | 'Sent') => {
    if (!customer.trim()) return;

    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + validDays);

    const newQuote: Quote = {
      id: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      customer: customer.trim(),
      contact: contact.trim() || 'Primary Procurement',
      email: email.trim() || 'billing@acme.com',
      phone: phone.trim() || '+1 (555) 000-0000',
      date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      validUntil: expiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: grandTotal,
      subtotal,
      tax,
      discountPercent: lines.some((l) => l.discountPercent > 0) ? 5 : 0,
      itemsCount: lines.reduce((acc, l) => acc + l.quantity, 0),
      paymentTerms,
      status,
      notes: notes.trim() || undefined,
      lines,
    };

    onCreateQuote(newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-[#2A2B27]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#A8462F]/10 dark:bg-[#A8462F]/20 text-[#A8462F] flex items-center justify-center border border-[#A8462F]/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink dark:text-neutral-100 tracking-tight">
                New Commercial Quotation
              </h2>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Generate itemized pricing proposal with automated tax and margin limits.
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
              Contact Name
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
              Payment Terms
            </label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
            >
              <option value="Net 30">Net 30 Days</option>
              <option value="Net 15">Net 15 Days</option>
              <option value="Net 60">Net 60 Days</option>
              <option value="Due on Receipt">Due on Receipt</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Validity Window
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

        {/* Dynamic Line Items Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-neutral-300">
              Quotation Line Items ({lines.length})
            </h3>
            <button
              type="button"
              onClick={handleAddLine}
              className="text-xs font-bold text-[#A8462F] hover:text-[#853526] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Catalog Item</span>
            </button>
          </div>

          <div className="border border-border dark:border-[#2A2B27] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-2.5 px-3">Product / Service</th>
                  <th className="py-2.5 px-3 w-20 text-center">Qty</th>
                  <th className="py-2.5 px-3 w-24 text-right">Price</th>
                  <th className="py-2.5 px-3 w-20 text-center">Disc %</th>
                  <th className="py-2.5 px-3 w-24 text-right">Line Total</th>
                  <th className="py-2.5 px-3 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
                {lines.map((line, idx) => (
                  <tr key={line.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                    <td className="py-2.5 px-3">
                      <select
                        value={line.productId}
                        onChange={(e) => handleProductChange(idx, e.target.value)}
                        className="w-full text-xs p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-100 font-medium"
                      >
                        {catalogProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (${p.unitPrice})
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-ink-muted font-mono block mt-0.5">{line.sku}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value) || 1)}
                        className="w-full text-center p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-100 font-mono"
                      >
                      </input>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-ink-muted dark:text-neutral-400">
                      ${line.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={line.discountPercent}
                        onChange={(e) => handleDiscountChange(idx, parseFloat(e.target.value) || 0)}
                        className="w-full text-center p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-100 font-mono"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-ink dark:text-white">
                      ${line.total.toFixed(2)}
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

        {/* Pricing Summary Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27]">
          <div className="flex items-center gap-2 text-xs text-ink-muted dark:text-neutral-400">
            <Calculator className="w-4 h-4 text-[#A8462F]" />
            <span>Standard 8% sales tax applied automatically.</span>
          </div>

          <div className="w-full sm:w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-ink-muted dark:text-neutral-400">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-ink-muted dark:text-neutral-400">
              <span>Tax (8%):</span>
              <span className="font-mono font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-ink dark:text-white pt-1 border-t border-border/80 dark:border-[#2A2B27]">
              <span>Total Quote:</span>
              <span className="font-mono font-black text-[#A8462F] text-base">${grandTotal.toFixed(2)}</span>
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
