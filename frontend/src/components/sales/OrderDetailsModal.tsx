'use client';

import { useState } from 'react';
import { X, Clock, Truck, Receipt, Building, MapPin } from 'lucide-react';
import { SalesOrder } from './salesData';

interface OrderDetailsModalProps {
  order: SalesOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, nextStatus: SalesOrder['status']) => void;
}

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onStatusChange,
}: OrderDetailsModalProps) {
  const [invoiceCreated, setInvoiceCreated] = useState(false);

  if (!isOpen || !order) return null;

  const steps: SalesOrder['status'][] = ['Confirmed', 'Processing', 'Fulfilled', 'Invoiced'];
  const currentStepIdx = steps.indexOf(order.status);

  const getNextStatus = (): SalesOrder['status'] | null => {
    if (order.status === 'Confirmed') return 'Processing';
    if (order.status === 'Processing') return 'Fulfilled';
    if (order.status === 'Fulfilled') return 'Invoiced';
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-[#2A2B27]">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-accent text-sm sm:text-base">
              {order.id}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                order.status === 'Fulfilled'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : order.status === 'Processing'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : order.status === 'Invoiced'
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                  : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
              }`}
            >
              {order.status}
            </span>
            {order.quoteRef && (
              <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md border border-border dark:border-[#2A2B27]">
                Ref: {order.quoteRef}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fulfillment Pipeline Progress Bar */}
        <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2A2B27] space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-ink dark:text-white">
            <span>Fulfillment Pipeline Status</span>
            <span className="text-accent font-mono text-[11px]">{order.status} Stage</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {steps.map((st, idx) => {
              const isPastOrCurrent = currentStepIdx >= idx;
              const isCurrent = currentStepIdx === idx;
              return (
                <div key={st} className="space-y-1 text-center">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isCurrent
                        ? 'bg-accent shadow-xs'
                        : isPastOrCurrent
                        ? 'bg-emerald-500'
                        : 'bg-neutral-200 dark:bg-neutral-800'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold block truncate ${
                      isCurrent
                        ? 'text-accent font-bold'
                        : isPastOrCurrent
                        ? 'text-ink dark:text-neutral-200'
                        : 'text-ink-muted/60'
                    }`}
                  >
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl border border-border dark:border-[#2A2B27] space-y-1">
            <div className="flex items-center gap-1.5 text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <Building className="w-3.5 h-3.5 text-accent" />
              <span>Customer Details</span>
            </div>
            <p className="font-bold text-ink dark:text-white text-sm">{order.customer}</p>
            <p className="text-ink-muted dark:text-neutral-400">{order.contact}</p>
            <p className="text-ink-muted dark:text-neutral-400 mt-2">
              Booked Date: <strong className="text-ink dark:text-neutral-200">{order.date}</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-border dark:border-[#2A2B27] space-y-1">
            <div className="flex items-center gap-1.5 text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              <span>Delivery &amp; Logistics</span>
            </div>
            <p className="text-ink dark:text-neutral-200 leading-relaxed font-medium">
              {order.shippingAddress}
            </p>
            <p className="text-ink-muted dark:text-neutral-400 mt-2">
              Target Delivery: <strong className="text-emerald-600 dark:text-emerald-400">{order.deliveryDate}</strong>
            </p>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="border border-border dark:border-[#2A2B27] rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-2.5 px-3">Item / Service SKU</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
              {order.lines.map((l) => (
                <tr key={l.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-ink dark:text-white block">{l.productName}</span>
                    <span className="font-mono text-[10px] text-ink-muted">{l.sku}</span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-ink dark:text-neutral-200">
                    {l.quantity}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-ink-muted dark:text-neutral-400">
                    ${l.unitPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-ink dark:text-white">
                    ${l.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-between items-center p-4 rounded-2xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink-muted dark:text-neutral-400">Payment Status:</span>
            <span
              className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                order.paymentStatus === 'Paid'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-ink dark:text-neutral-300">Total Booked:</span>
            <span className="font-mono font-black text-accent text-lg">${order.amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/80 dark:border-[#2A2B27] flex-wrap">
          <button
            type="button"
            onClick={() => {
              setInvoiceCreated(true);
              setTimeout(() => setInvoiceCreated(false), 3000);
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1E1F1C] text-ink dark:text-neutral-200 hover:border-accent hover:text-accent transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>{invoiceCreated ? '✓ Invoiced to General Ledger' : 'Generate Digital Invoice'}</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Close
            </button>

            {nextStatus && (
              <button
                type="button"
                onClick={() => {
                  onStatusChange(order.id, nextStatus);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {nextStatus === 'Processing' && <Clock className="w-3.5 h-3.5" />}
                {nextStatus === 'Fulfilled' && <Truck className="w-3.5 h-3.5" />}
                {nextStatus === 'Invoiced' && <Receipt className="w-3.5 h-3.5" />}
                <span>Advance to {nextStatus}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
