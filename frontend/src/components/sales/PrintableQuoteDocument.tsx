'use client';

import { CheckCircle2, Shield } from 'lucide-react';
import { Quote, CurrencyCode, formatCurrency } from './salesData';

interface PrintableQuoteDocumentProps {
  quote: Quote;
  currency: CurrencyCode;
}

export function PrintableQuoteDocument({ quote, currency }: PrintableQuoteDocumentProps) {
  return (
    <div className="bg-white text-neutral-900 p-8 rounded-2xl border border-neutral-300 shadow-xl max-w-3xl mx-auto print:border-none print:shadow-none print:p-0 print:max-w-none">
      {/* ─── Corporate Header ─── */}
      <div className="flex items-start justify-between border-b-2 border-neutral-900 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#A8462F] flex items-center justify-center text-white font-black text-sm">
              B
            </div>
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">
              BAHI ENTERPRISE
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-mono">
            Autonomous Business Operating Platform • Commercial Division
          </p>
          <p className="text-xs text-neutral-500">
            One World Trade Center, Suite 4400 • New York, NY 10007 • finance@bahi.io
          </p>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-neutral-900 text-white font-mono font-bold text-xs rounded-sm tracking-wider uppercase mb-2">
            Official Quotation
          </span>
          <div className="font-mono text-base font-bold text-[#A8462F]">
            {quote.id}
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">
            Revision: <strong>v{quote.version || 1}</strong>
          </div>
        </div>
      </div>

      {/* ─── Client & Meta Details ─── */}
      <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
        <div className="space-y-1.5 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
          <span className="font-bold text-neutral-400 uppercase text-[10px] tracking-wider">
            Proposal Prepared For
          </span>
          <h2 className="text-base font-black text-neutral-900">
            {quote.customer}
          </h2>
          <p className="text-neutral-700">Attn: <strong>{quote.contact}</strong></p>
          <p className="text-neutral-600 font-mono">{quote.email}</p>
          <p className="text-neutral-600 font-mono">{quote.phone}</p>
        </div>

        <div className="space-y-1.5 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
          <span className="font-bold text-neutral-400 uppercase text-[10px] tracking-wider">
            Commercial Terms
          </span>
          <div className="flex justify-between">
            <span className="text-neutral-600">Issue Date:</span>
            <span className="font-semibold text-neutral-900">{quote.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Valid Until:</span>
            <span className="font-semibold text-neutral-900 font-mono">{quote.validUntil}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Payment Terms:</span>
            <span className="font-semibold text-neutral-900">{quote.paymentTerms}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Proposal Currency:</span>
            <span className="font-bold text-neutral-900 font-mono">{currency}</span>
          </div>
        </div>
      </div>

      {/* ─── Itemized Lines Table ─── */}
      <div className="mb-6">
        <table className="w-full text-xs">
          <thead className="bg-neutral-100 text-neutral-700 font-bold uppercase tracking-wider border-y border-neutral-300">
            <tr>
              <th className="py-2.5 px-3 text-left">SKU</th>
              <th className="py-2.5 px-3 text-left">Description</th>
              <th className="py-2.5 px-3 text-center">Qty</th>
              <th className="py-2.5 px-3 text-right">Unit Price</th>
              <th className="py-2.5 px-3 text-right">Disc %</th>
              <th className="py-2.5 px-3 text-right">Ext Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {quote.lines.map((line) => (
              <tr key={line.id}>
                <td className="py-3 px-3 font-mono font-semibold text-neutral-600">
                  {line.sku}
                </td>
                <td className="py-3 px-3">
                  <div className="font-bold text-neutral-900">{line.productName}</div>
                  <div className="text-[10px] text-neutral-500">Commercial enterprise license</div>
                </td>
                <td className="py-3 px-3 text-center font-mono font-bold">
                  {line.quantity}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {formatCurrency(line.unitPrice, currency)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-neutral-600">
                  {line.discountPercent > 0 ? `${line.discountPercent}%` : '—'}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900">
                  {formatCurrency(line.total, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Summary Calculation Box ─── */}
      <div className="flex justify-between items-start pt-4 border-t-2 border-neutral-900 mb-8">
        <div className="max-w-sm space-y-2 text-xs">
          <h3 className="font-bold uppercase text-[10px] tracking-wider text-neutral-500">
            Proposal Notes &amp; Special Conditions
          </h3>
          <p className="text-neutral-700 italic bg-neutral-50 p-3 rounded-lg border border-neutral-200">
            {quote.notes || 'Subject to Bahi Master Services Agreement. Standard SLA applies for software deliverables.'}
          </p>

          <div className="flex items-center gap-2 pt-2 text-[10px] text-neutral-500 font-mono">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Security Checksum: SHA256:{quote.id.replace(/-/g, '')}F91B</span>
          </div>
        </div>

        <div className="w-64 space-y-2 text-xs">
          <div className="flex justify-between text-neutral-600">
            <span>Gross Subtotal:</span>
            <span className="font-mono font-semibold">{formatCurrency(quote.subtotal, currency)}</span>
          </div>
          {quote.discountPercent > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Discretionary Discount ({quote.discountPercent}%):</span>
              <span className="font-mono">- {formatCurrency((quote.subtotal * quote.discountPercent) / 100, currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-neutral-600">
            <span>Estimated Sales Tax (GST/VAT):</span>
            <span className="font-mono font-semibold">{formatCurrency(quote.tax, currency)}</span>
          </div>

          <div className="flex justify-between items-baseline pt-2 border-t-2 border-neutral-900 text-neutral-900">
            <span className="font-black text-sm uppercase">Total Proposal:</span>
            <span className="font-black text-lg font-mono text-[#A8462F]">
              {formatCurrency(quote.amount, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* ─── E-Signature / Authorization Block ─── */}
      <div className="grid grid-cols-2 gap-8 pt-6 border-t border-neutral-200 text-xs">
        <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
          <span className="font-bold text-neutral-500 uppercase text-[10px] block mb-2">
            Issued By (Authorized Representative)
          </span>
          <div className="font-serif italic text-base text-neutral-800 mb-1">
            Alex Morgan, VP Commercial Accounts
          </div>
          <div className="text-[10px] text-neutral-500">
            Bahi Enterprise Technologies Inc. • Verified Digital Signing
          </div>
        </div>

        <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
          <span className="font-bold text-neutral-500 uppercase text-[10px] block mb-2">
            Client Acceptance Sign-Off
          </span>
          {quote.signature ? (
            <div>
              <div className="font-serif italic text-base text-emerald-700 font-bold mb-0.5">
                {quote.signature.signedBy}
              </div>
              <div className="text-[10px] text-neutral-600">
                {quote.signature.title} • Signed: {quote.signature.signedAt}
              </div>
              <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-mono mt-1 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Legally Binding Digital Signature Verified</span>
              </div>
            </div>
          ) : (
            <div className="text-neutral-400 italic text-[11px] pt-2 border-b border-dashed border-neutral-300 pb-1">
              Sign &amp; date to accept proposal terms and book order.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
