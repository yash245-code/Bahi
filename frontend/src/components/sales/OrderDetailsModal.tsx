'use client';

import { useState } from 'react';
import {
  X,
  Clock,
  Truck,
  Receipt,
  Building,
  MapPin,
  Printer,
  FileText,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { SalesOrder, CurrencyCode, formatCurrency } from './salesData';
import { PrintableOrderDocument } from './PrintableOrderDocument';

interface OrderDetailsModalProps {
  order: SalesOrder | null;
  isOpen: boolean;
  currency?: CurrencyCode;
  onClose: () => void;
  onStatusChange: (orderId: string, nextStatus: SalesOrder['status']) => void;
  onUpdatePaymentStatus?: (orderId: string, paymentStatus: SalesOrder['paymentStatus']) => void;
  onUpdateTracking?: (orderId: string, carrier: string, trackingNumber: string) => void;
  onAddNote?: (orderId: string, noteText: string) => void;
}

export function OrderDetailsModal({
  order,
  isOpen,
  currency = 'USD',
  onClose,
  onStatusChange,
  onUpdatePaymentStatus,
  onUpdateTracking,
  onAddNote,
}: OrderDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'document' | 'notes'>('overview');
  const [invoiceCreated, setInvoiceCreated] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [isEditingTracking, setIsEditingTracking] = useState(false);
  const [carrierInput, setCarrierInput] = useState('');
  const [trackingInput, setTrackingInput] = useState('');

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

  const handleSaveTracking = () => {
    if (onUpdateTracking) {
      onUpdateTracking(order.id, carrierInput || order.carrier || 'Standard Freight', trackingInput);
    }
    setIsEditingTracking(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !onAddNote) return;
    onAddNote(order.id, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl space-y-5 my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-[#2A2B27]">
          <div className="flex items-center gap-2 flex-wrap">
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100/70 dark:bg-[#141513] rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-accent text-white font-bold shadow-xs'
                : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Order Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'document'
                ? 'bg-accent text-white font-bold shadow-xs'
                : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Packing Slip &amp; Manifest</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-accent text-white font-bold shadow-xs'
                : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Logistics Notes ({order.orderNotes?.length || 0})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-fade-in">
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
                        className={`text-[10px] block font-mono ${
                          isCurrent
                            ? 'font-bold text-accent'
                            : isPastOrCurrent
                            ? 'text-ink dark:text-neutral-300'
                            : 'text-ink-muted/50 dark:text-neutral-600'
                        }`}
                      >
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl border border-border dark:border-[#2A2B27] space-y-1 bg-white dark:bg-[#1E1F1C]">
                <div className="flex items-center gap-1.5 text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                  <Building className="w-3.5 h-3.5 text-accent" />
                  <span>Customer &amp; Commercial Account</span>
                </div>
                <p className="font-bold text-ink dark:text-white text-sm">{order.customer}</p>
                <p className="text-ink-muted dark:text-neutral-400">{order.contact}</p>
                <p className="text-ink-muted dark:text-neutral-400 mt-2">
                  Booked Date: <strong className="text-ink dark:text-neutral-200">{order.date}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-border dark:border-[#2A2B27] space-y-1 bg-white dark:bg-[#1E1F1C]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span>Delivery &amp; Logistics</span>
                  </div>
                  {!isEditingTracking && (
                    <button
                      type="button"
                      onClick={() => {
                        setCarrierInput(order.carrier || '');
                        setTrackingInput(order.trackingNumber || '');
                        setIsEditingTracking(true);
                      }}
                      className="text-[10px] text-accent font-bold hover:underline cursor-pointer"
                    >
                      Edit Tracking
                    </button>
                  )}
                </div>

                <p className="text-ink dark:text-neutral-200 leading-relaxed font-medium">
                  {order.shippingAddress}
                </p>

                {isEditingTracking ? (
                  <div className="pt-2 space-y-1.5">
                    <input
                      type="text"
                      placeholder="Carrier (e.g. FedEx, DHL)"
                      value={carrierInput}
                      onChange={(e) => setCarrierInput(e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#141513]"
                    />
                    <input
                      type="text"
                      placeholder="Tracking Number"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#141513]"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditingTracking(false)}
                        className="px-2 py-0.5 text-[10px] rounded border"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveTracking}
                        className="px-2 py-0.5 text-[10px] rounded bg-accent text-white font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-ink-muted dark:text-neutral-400 mt-2 space-y-0.5">
                    <div>
                      Carrier: <strong className="text-ink dark:text-neutral-200">{order.carrier || 'Standard Freight'}</strong>
                    </div>
                    {order.trackingNumber && (
                      <div className="font-mono text-[11px]">
                        Waybill: <strong className="text-accent">{order.trackingNumber}</strong>
                      </div>
                    )}
                    <div>
                      Target Delivery: <strong className="text-emerald-600 dark:text-emerald-400">{order.deliveryDate}</strong>
                    </div>
                  </div>
                )}
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
                        {formatCurrency(l.unitPrice, currency)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-ink dark:text-white">
                        {formatCurrency(l.total, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary & Payment Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27] text-xs gap-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-ink-muted dark:text-neutral-400">Payment Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded font-bold font-mono text-[10px] ${
                    order.paymentStatus === 'Paid'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {order.paymentStatus}
                </span>

                {onUpdatePaymentStatus && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdatePaymentStatus(
                        order.id,
                        order.paymentStatus === 'Paid' ? 'Pending' : 'Paid'
                      )
                    }
                    className="px-2 py-0.5 text-[10px] rounded-md border border-border hover:border-accent font-semibold transition-colors cursor-pointer"
                  >
                    Toggle to {order.paymentStatus === 'Paid' ? 'Pending' : 'Paid'}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="font-semibold text-ink dark:text-neutral-300">Total Booked:</span>
                <span className="font-mono font-black text-accent text-lg">
                  {formatCurrency(order.amount, currency)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PACKING SLIP & MANIFEST */}
        {activeTab === 'document' && (
          <div className="animate-fade-in">
            <PrintableOrderDocument order={order} currency={currency} />
          </div>
        )}

        {/* TAB 3: LOGISTICS NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-4 animate-fade-in text-xs">
            {/* Note Composer */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={2}
                placeholder="Add logistics or fulfillment memo (e.g. Carrier pallet size, special dock requirements)..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-white placeholder:text-ink-muted focus:outline-hidden focus:border-accent"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    newNoteText.trim()
                      ? 'bg-accent text-white hover:bg-accent-hover'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Logistics Note</span>
                </button>
              </div>
            </form>

            {/* Notes Timeline */}
            <div className="space-y-2 pt-2 border-t border-border/80 dark:border-[#2A2B27]">
              {(!order.orderNotes || order.orderNotes.length === 0) ? (
                <div className="p-6 text-center text-ink-muted border border-dashed rounded-xl">
                  No internal logistics notes recorded yet.
                </div>
              ) : (
                order.orderNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-ink-muted">
                      <span className="font-bold text-ink dark:text-neutral-200">{note.author}</span>
                      <span className="font-mono">{note.timestamp}</span>
                    </div>
                    <p className="text-ink dark:text-neutral-300 leading-relaxed font-medium">
                      {note.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/80 dark:border-[#2A2B27] flex-wrap">
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
