'use client';

import { Printer, Truck } from 'lucide-react';
import { SalesOrder, CurrencyCode, formatCurrency } from './salesData';

interface PrintableOrderDocumentProps {
  order: SalesOrder;
  currency?: CurrencyCode;
}

export function PrintableOrderDocument({
  order,
  currency = 'USD',
}: PrintableOrderDocumentProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Print Trigger Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-100 dark:bg-[#141513] border border-border dark:border-[#2A2B27] print:hidden">
        <div className="flex items-center gap-2 text-xs">
          <Truck className="w-4 h-4 text-accent" />
          <span className="font-semibold text-ink dark:text-neutral-200">
            Commercial Warehouse Dispatch &amp; Fulfillment Packing Slip
          </span>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="p-8 sm:p-10 bg-white text-neutral-900 border border-neutral-200 rounded-3xl shadow-sm space-y-7 font-sans text-xs print:border-none print:shadow-none print:p-0 print:m-0">
        {/* Header Banner */}
        <div className="flex justify-between items-start pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-neutral-900">BAHI</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                ENTERPRISE FULFILLMENT
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
              Bahi Enterprise Logistics &amp; Distribution Operations
              <br />
              Central Logistics Depot 4, Port West Industrial Corridor
              <br />
              logistics@bahi.app • +1 (800) 555-BAHI
            </p>
          </div>

          <div className="text-right">
            <h1 className="text-lg font-black uppercase tracking-wider text-neutral-800">
              COMMERCIAL PACKING SLIP
            </h1>
            <div className="font-mono text-sm font-black text-accent mt-0.5">
              {order.id}
            </div>
            {order.quoteRef && (
              <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                Quote Reference: {order.quoteRef}
              </div>
            )}
            <div className="text-[10px] text-neutral-400 mt-0.5">
              Order Date: {order.date}
            </div>
          </div>
        </div>

        {/* Barcode representation */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
          <div className="space-y-1">
            <div className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
              BARCODE ROUTING MANIFEST
            </div>
            <div className="font-mono text-base font-black tracking-widest text-neutral-800 select-all">
              ||| | |||| | ||||| |||| || ||| |||||
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-bold text-neutral-500 uppercase">Dispatch Stage</div>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
              {order.status}
            </span>
          </div>
        </div>

        {/* Addresses & Dispatch Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">
          {/* Bill To */}
          <div className="space-y-1">
            <h3 className="font-bold text-neutral-400 text-[10px] uppercase tracking-wider">
              Customer Account
            </h3>
            <div className="font-bold text-sm text-neutral-900">{order.customer}</div>
            <div className="text-neutral-600">Attn: {order.contact}</div>
            <div className="text-neutral-500">Commercial Client Billing</div>
          </div>

          {/* Ship To */}
          <div className="space-y-1">
            <h3 className="font-bold text-neutral-400 text-[10px] uppercase tracking-wider">
              Ship-To Delivery Address
            </h3>
            <div className="font-semibold text-neutral-800 leading-snug">
              {order.shippingAddress || 'Client Receiving Dock, Standard Terminal'}
            </div>
            <div className="text-[11px] text-neutral-500 font-mono mt-1">
              Target Delivery: <strong>{order.deliveryDate}</strong>
            </div>
          </div>

          {/* Logistics Carrier */}
          <div className="space-y-1">
            <h3 className="font-bold text-neutral-400 text-[10px] uppercase tracking-wider">
              Logistics &amp; Carrier Info
            </h3>
            <div className="font-semibold text-neutral-800">
              Carrier: <strong>{order.carrier || 'Standard Freight Dispatch'}</strong>
            </div>
            <div className="text-[11px] text-neutral-600 font-mono">
              Tracking: <strong>{order.trackingNumber || 'Pending Waybill Allocation'}</strong>
            </div>
            <div className="text-[11px] text-neutral-600">
              Payment Status:{' '}
              <span className={`font-bold font-mono ${order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                <th className="py-2 px-1 w-8 text-center">Chk</th>
                <th className="py-2 px-2">Item Description / SKU</th>
                <th className="py-2 px-3 text-center w-16">Qty</th>
                <th className="py-2 px-3 text-right w-24">Unit Price</th>
                <th className="py-2 px-3 text-right w-28">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-xs">
              {order.lines.map((line, idx) => (
                <tr key={line.id || idx}>
                  <td className="py-3 px-1 text-center">
                    <span className="w-4 h-4 rounded border border-neutral-400 inline-block" />
                  </td>
                  <td className="py-3 px-2">
                    <div className="font-bold text-neutral-900">{line.productName}</div>
                    <div className="font-mono text-[10px] text-neutral-500">{line.sku}</div>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-neutral-900">
                    {line.quantity}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-neutral-600">
                    {formatCurrency(line.unitPrice, currency)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900">
                    {formatCurrency(line.total, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-between items-start pt-4 border-t border-neutral-200">
          <div className="max-w-md space-y-2">
            <h4 className="font-bold text-[10px] uppercase text-neutral-500">
              Warehouse Picking &amp; Quality Inspection
            </h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              All goods inspected and packaged in accordance with Bahi ISO-9001 standard packaging guidelines. Damaged or missing packages must be reported within 48 hours of carrier sign-off.
            </p>
          </div>

          <div className="w-56 space-y-1.5 text-right font-mono text-xs">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal:</span>
              <span className="font-bold text-neutral-800">{formatCurrency(order.subtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Tax:</span>
              <span className="font-bold text-neutral-800">{formatCurrency(order.tax, currency)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t-2 border-neutral-800 text-sm font-black text-neutral-900">
              <span>Total Value:</span>
              <span>{formatCurrency(order.amount, currency)}</span>
            </div>
          </div>
        </div>

        {/* Warehouse & Carrier Signoff Box */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-neutral-200">
          <div className="border-t border-dashed border-neutral-400 pt-2 space-y-1">
            <div className="text-[10px] font-bold uppercase text-neutral-400">
              Warehouse Dispatcher Signoff
            </div>
            <div className="font-mono text-xs font-semibold text-neutral-700">
              Authorized Dispatch Inspector
            </div>
            <div className="text-[10px] text-neutral-400">Date: {order.date}</div>
          </div>

          <div className="border-t border-dashed border-neutral-400 pt-2 space-y-1">
            <div className="text-[10px] font-bold uppercase text-neutral-400">
              Carrier Receiving Agent / Signature
            </div>
            <div className="font-mono text-xs font-semibold text-neutral-700">
              Received in Good Condition
            </div>
            <div className="text-[10px] text-neutral-400">Date: _______________</div>
          </div>
        </div>
      </div>
    </div>
  );
}

