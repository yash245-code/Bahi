'use client';

import { useState } from 'react';
import { X, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { catalogProducts, SalesOrder, SalesOrderLine } from './salesData';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (order: SalesOrder) => void;
}

export function NewOrderModal({ isOpen, onClose, onCreateOrder }: NewOrderModalProps) {
  const [customer, setCustomer] = useState('');
  const [contact, setContact] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const deliveryDays = 5;

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
      quoteRef: 'Direct Commercial Booking',
      customer: customer.trim(),
      contact: contact.trim() || 'Procurement Office',
      date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      deliveryDate: delivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: grandTotal,
      subtotal,
      tax,
      status: 'Confirmed',
      paymentStatus: 'Pending',
      shippingAddress: shippingAddress.trim() || 'Client Corporate Headquarters',
      itemsCount: lines.reduce((acc, l) => acc + l.quantity, 0),
      lines,
    };

    onCreateOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-[#2A2B27]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center border border-accent/25">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink dark:text-neutral-100 tracking-tight">
                New Sales Order Booking
              </h2>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Book a confirmed commercial sales order directly into fulfillment.
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Customer / Organization <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Industrial Corp"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Primary Contact
              </label>
              <input
                type="text"
                placeholder="e.g. Marcus Vance"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Shipping / Delivery Destination
              </label>
              <input
                type="text"
                placeholder="e.g. 500 Industrial Parkway, Dock 3, San Francisco, CA"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-neutral-300">
                Order Items ({lines.length})
              </h3>
              <button
                type="button"
                onClick={handleAddLine}
                className="text-xs font-bold text-accent hover:text-accent-hover flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="border border-border dark:border-[#2A2B27] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                  <tr>
                    <th className="py-2 px-3">Product</th>
                    <th className="py-2 px-3 w-20 text-center">Qty</th>
                    <th className="py-2 px-3 w-24 text-right">Price</th>
                    <th className="py-2 px-3 w-24 text-right">Total</th>
                    <th className="py-2 px-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
                  {lines.map((l, idx) => (
                    <tr key={l.id}>
                      <td className="py-2 px-3">
                        <select
                          value={catalogProducts.find((p) => p.name === l.productName)?.id || firstProd.id}
                          onChange={(e) => handleProductSelect(idx, e.target.value)}
                          className="w-full text-xs p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-100 font-medium"
                        >
                          {catalogProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (${p.unitPrice})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="1"
                          value={l.quantity}
                          onChange={(e) => handleQtyChange(idx, parseInt(e.target.value) || 1)}
                          className="w-full text-center p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-100 font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-ink-muted">
                        ${l.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-ink dark:text-white">
                        ${l.total.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          disabled={lines.length <= 1}
                          onClick={() => handleRemoveLine(idx)}
                          className={`p-1 rounded text-ink-muted hover:text-red-500 cursor-pointer ${
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

          {/* Pricing Preview */}
          <div className="flex justify-between items-center p-4 rounded-2xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27] text-xs">
            <span className="font-semibold text-ink-muted dark:text-neutral-400">Order Subtotal: ${subtotal.toFixed(2)} + 8% Tax</span>
            <div className="text-right">
              <span className="text-sm font-bold text-ink dark:text-white">Order Total: </span>
              <span className="font-mono font-black text-accent text-base">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-[#2A2B27]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!customer.trim()}
              className={`px-5 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs cursor-pointer ${
                !customer.trim() ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              Book Sales Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
