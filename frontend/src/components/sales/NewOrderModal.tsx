'use client';

import { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  ShoppingBag,
  Building,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';
import {
  catalogProducts,
  crmCustomerPresets,
  SalesOrder,
  SalesOrderLine,
  Quote,
  CurrencyCode,
  formatCurrency,
  CrmCustomerPreset,
} from './salesData';

interface NewOrderModalProps {
  isOpen: boolean;
  quotes?: Quote[];
  currency?: CurrencyCode;
  onClose: () => void;
  onCreateOrder: (order: SalesOrder) => void;
}

export function NewOrderModal({
  isOpen,
  quotes = [],
  currency = 'USD',
  onClose,
  onCreateOrder,
}: NewOrderModalProps) {
  const [customer, setCustomer] = useState('');
  const [contact, setContact] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [quoteRef, setQuoteRef] = useState<string>('Direct Commercial Booking');
  const [carrier, setCarrier] = useState('FedEx Ground Dispatch');
  const [deliveryDays, setDeliveryDays] = useState(5);

  const firstProd = catalogProducts[0] || {
    id: 'PROD-01',
    name: 'Cloud ERP Core Tenant License',
    sku: 'ERP-CORE-01',
    unitPrice: 450.0,
    category: 'Software',
  };

  const [lines, setLines] = useState<SalesOrderLine[]>([
    {
      id: 'SOL-init-1',
      productName: firstProd.name,
      sku: firstProd.sku,
      quantity: 1,
      unitPrice: firstProd.unitPrice,
      total: firstProd.unitPrice,
    },
  ]);

  if (!isOpen) return null;

  const handlePopulateFromQuote = (selectedQuoteId: string) => {
    if (!selectedQuoteId) return;
    const q = quotes.find((quote) => quote.id === selectedQuoteId);
    if (!q) return;

    setCustomer(q.customer);
    setContact(q.contact);
    setQuoteRef(q.id);
    setShippingAddress(`${q.customer} Receiving Dock, Facility Gate 2`);
    setLines(
      q.lines.map((l) => ({
        id: `SOL-${Date.now()}-${l.id}`,
        productName: l.productName,
        sku: l.sku,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        total: l.total,
      }))
    );
  };

  const handleSelectCrmPreset = (crm: CrmCustomerPreset) => {
    setCustomer(crm.customer);
    setContact(crm.contact);
    setShippingAddress(crm.address);
  };

  const handleProductSelect = (index: number, productId: string) => {
    const prod = catalogProducts.find((p) => p.id === productId);
    if (!prod) return;

    setLines((prev) => {
      const next = [...prev];
      const current = next[index];
      if (!current) return prev;
      const qty = current.quantity;
      next[index] = {
        id: current.id,
        productName: prod.name,
        sku: prod.sku,
        quantity: qty,
        unitPrice: prod.unitPrice,
        total: Math.round(qty * prod.unitPrice * 100) / 100,
      };
      return next;
    });
  };

  const handleQtyChange = (index: number, qty: number) => {
    const q = Math.max(1, qty);
    setLines((prev) => {
      const next = [...prev];
      const current = next[index];
      if (!current) return prev;
      next[index] = {
        id: current.id,
        productName: current.productName,
        sku: current.sku,
        quantity: q,
        unitPrice: current.unitPrice,
        total: Math.round(q * current.unitPrice * 100) / 100,
      };
      return next;
    });
  };

  const handleAddLine = () => {
    const prod = catalogProducts[lines.length % catalogProducts.length] || firstProd;
    setLines((prev) => [
      ...prev,
      {
        id: `SOL-new-${Date.now()}`,
        productName: prod.name,
        sku: prod.sku,
        quantity: 1,
        unitPrice: prod.unitPrice,
        total: prod.unitPrice,
      },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = lines.reduce((acc, l) => acc + l.total, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const grandTotal = Math.round((subtotal + tax) * 100) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim()) return;

    const today = new Date();
    const delivery = new Date();
    delivery.setDate(today.getDate() + deliveryDays);

    const newOrder: SalesOrder = {
      id: `SO-2026-${Math.floor(100 + Math.random() * 900)}`,
      quoteRef: quoteRef || 'Direct Commercial Booking',
      customer: customer.trim(),
      contact: contact.trim() || 'Procurement Office',
      date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      deliveryDate: delivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: grandTotal,
      subtotal,
      tax,
      status: 'Confirmed',
      paymentStatus: 'Pending',
      carrier,
      trackingNumber: `TRK-${Math.floor(1000 + Math.random() * 9000)}-${carrier.substring(0, 3).toUpperCase()}`,
      shippingAddress: shippingAddress.trim() || `${customer.trim()} Receiving Dept, Dock 1`,
      itemsCount: lines.reduce((acc, l) => acc + l.quantity, 0),
      lines,
    };

    onCreateOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-[#2A2B27]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-ink dark:text-neutral-100 tracking-tight">
                  Book Commercial Sales Order
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
                  {currency} Currency
                </span>
              </div>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Create confirmed order directly or convert from approved quotations with delivery routing.
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

        {/* Populate from Approved Quotes Bar */}
        {quotes.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-neutral-100/70 dark:bg-[#141513] border border-border/80 dark:border-[#2A2B27] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-ink dark:text-white flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-accent" />
                <span>Populate from Pipeline Quotation:</span>
              </span>
              <span className="text-[10px] text-ink-muted">
                1-click imports items, customer, and pricing
              </span>
            </div>
            <select
              defaultValue=""
              onChange={(e) => handlePopulateFromQuote(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1E1F1C] text-ink dark:text-white focus:outline-hidden focus:border-accent"
            >
              <option value="" disabled>
                -- Choose an Approved or Open Quotation to book --
              </option>
              {quotes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.id} - {q.customer} ({formatCurrency(q.amount, currency)}) [{q.status}]
                </option>
              ))}
            </select>
          </div>
        )}

        {/* CRM Preset Auto-fill Chips */}
        <div className="p-3 rounded-2xl bg-neutral-100/70 dark:bg-[#141513] border border-border/80 dark:border-[#2A2B27] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-ink dark:text-white flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-accent" />
              <span>Auto-fill Customer Profile:</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {crmCustomerPresets.map((crm) => (
              <button
                key={crm.id}
                type="button"
                onClick={() => handleSelectCrmPreset(crm)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  customer === crm.customer
                    ? 'border-accent bg-accent/10 text-accent font-bold'
                    : 'border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink-muted hover:border-accent/40'
                }`}
              >
                <span>{crm.customer}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Details Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Customer / Account <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Logistics Hub"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent"
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
                className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Fulfillment Logistics Carrier
              </label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent"
              >
                <option value="FedEx Ground Dispatch">FedEx Ground Dispatch</option>
                <option value="FedEx Express Freight">FedEx Express Freight</option>
                <option value="DHL Global Logistics">DHL Global Logistics</option>
                <option value="Internal Logistics Fleet">Internal Logistics Fleet</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Shipping &amp; Delivery Dock Address
              </label>
              <input
                type="text"
                placeholder="Receiving Dock 14, Main Industrial Depot"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Target Delivery Window
              </label>
              <select
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent"
              >
                <option value={2}>Express (2 Days)</option>
                <option value={5}>Standard (5 Days)</option>
                <option value={10}>Extended (10 Days)</option>
              </select>
            </div>
          </div>

          {/* Line Items Editor */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-neutral-300">
                Order Items &amp; Quantities
              </h3>
              <button
                type="button"
                onClick={handleAddLine}
                className="px-3 py-1 text-xs font-bold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#141513] text-ink dark:text-neutral-200 hover:border-accent hover:text-accent transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item Line</span>
              </button>
            </div>

            <div className="border border-border dark:border-[#2A2B27] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                  <tr>
                    <th className="py-2.5 px-3">Product Catalog Item</th>
                    <th className="py-2.5 px-3 text-center w-24">Qty</th>
                    <th className="py-2.5 px-3 text-right w-28">Unit Price</th>
                    <th className="py-2.5 px-3 text-right w-28">Total</th>
                    <th className="py-2.5 px-3 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
                  {lines.map((line, idx) => (
                    <tr key={line.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                      <td className="py-2.5 px-3">
                        <select
                          value={catalogProducts.find((p) => p.sku === line.sku)?.id || ''}
                          onChange={(e) => handleProductSelect(idx, e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white font-medium"
                        >
                          {catalogProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sku}) - {formatCurrency(p.unitPrice, currency)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={(e) => handleQtyChange(idx, parseInt(e.target.value) || 1)}
                          className="w-16 p-1.5 text-center rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] font-mono text-ink dark:text-white"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-ink-muted dark:text-neutral-400">
                        {formatCurrency(line.unitPrice, currency)}
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

          {/* Totals Bar */}
          <div className="flex justify-between items-center p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27] text-xs">
            <span className="text-ink-muted">
              Estimated 8% Sales Tax: <strong className="font-mono text-ink dark:text-white">{formatCurrency(tax, currency)}</strong>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-ink-muted">Total Order Value:</span>
              <span className="font-mono font-black text-emerald-600 text-lg">
                {formatCurrency(grandTotal, currency)}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80 dark:border-[#2A2B27]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm &amp; Book Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
