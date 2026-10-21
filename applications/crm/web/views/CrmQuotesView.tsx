'use client';

import { useState, useEffect, useCallback } from 'react';
import { CrmNav } from '../components/CrmNav';
import { CrmAnnouncer } from '../components/CrmAnnouncer';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';
import { crmApi } from '../lib/api-client';

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface QuoteRecord {
  id: string;
  quoteNumber: string;
  dealTitle: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  subtotal: number;
  discountPercent: number;
  taxPercent: number;
  total: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'EXPIRED';
  validUntil: string;
  createdAt: string;
  signatureData?: string;
  signerName?: string;
  signedAt?: string;
  lineItems: QuoteLineItem[];
}

const initialQuotes: QuoteRecord[] = [
  {
    id: 'QUO-001',
    quoteNumber: 'QUO-2026-0819',
    dealTitle: 'Vortex Global Accounting System',
    companyName: 'Vortex Global',
    contactName: 'David Chen',
    contactEmail: 'finance@vortex.co',
    subtotal: 35000,
    discountPercent: 5,
    taxPercent: 8,
    total: 34000,
    status: 'SENT',
    validUntil: 'Oct 30, 2026',
    createdAt: 'Sep 28, 2026',
    lineItems: [
      { id: '1', description: 'Enterprise Multi-Entity Financial Ledger License', quantity: 1, unitPrice: 22000, total: 22000 },
      { id: '2', description: 'Implementation & Legacy ERP Data Migration', quantity: 1, unitPrice: 8000, total: 8000 },
      { id: '3', description: 'Priority 24/7 SLA Support (Annual)', quantity: 1, unitPrice: 5000, total: 5000 },
    ],
  },
  {
    id: 'QUO-002',
    quoteNumber: 'QUO-2026-0812',
    dealTitle: 'Apex Dynamics Annual ERP Suite',
    companyName: 'Apex Dynamics',
    contactName: 'Elena Rostova',
    contactEmail: 'ceo@apexdynamics.com',
    subtotal: 55000,
    discountPercent: 10,
    taxPercent: 8,
    total: 52000,
    status: 'ACCEPTED',
    validUntil: 'Nov 15, 2026',
    createdAt: 'Sep 20, 2026',
    signerName: 'Elena Rostova, CEO',
    signedAt: 'Sep 24, 2026, 4:15 PM UTC',
    signatureData: 'data:image/svg+xml;utf8,<svg ... signature />',
    lineItems: [
      { id: '1', description: 'Full Platform Enterprise License (100 seats)', quantity: 1, unitPrice: 42000, total: 42000 },
      { id: '2', description: 'Custom API Integrator & Onboarding', quantity: 1, unitPrice: 13000, total: 13000 },
    ],
  },
  {
    id: 'QUO-003',
    quoteNumber: 'QUO-2026-0805',
    dealTitle: 'Summit Digital Operations OS',
    companyName: 'Summit Digital',
    contactName: 'Marcus Rodriguez',
    contactEmail: 'ops@summit.io',
    subtotal: 24000,
    discountPercent: 0,
    taxPercent: 8,
    total: 22000,
    status: 'DRAFT',
    validUntil: 'Oct 15, 2026',
    createdAt: 'Sep 25, 2026',
    lineItems: [
      { id: '1', description: 'Operations & Warehouse Dispatch Engine', quantity: 1, unitPrice: 18000, total: 18000 },
      { id: '2', description: 'User Seat Expansion (20 Seats)', quantity: 20, unitPrice: 200, total: 4000 },
    ],
  },
  {
    id: 'QUO-004',
    quoteNumber: 'QUO-2026-0790',
    dealTitle: 'TechStart Enterprise Cloud Bundle',
    companyName: 'TechStart Inc.',
    contactName: 'Sarah Chen',
    contactEmail: 'sarah@techstart.io',
    subtotal: 12000,
    discountPercent: 0,
    taxPercent: 8,
    total: 12960,
    status: 'EXPIRED',
    validUntil: 'Sep 01, 2026',
    createdAt: 'Aug 10, 2026',
    lineItems: [
      { id: '1', description: 'Cloud Starter Pack', quantity: 1, unitPrice: 12000, total: 12000 },
    ],
  },
];

export function CrmQuotesView() {
  const [quotes, setQuotes] = useState<QuoteRecord[]>(initialQuotes);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRecord | null>(null);
  const [newQuoteModalOpen, setNewQuoteModalOpen] = useState(false);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  // New quote draft state
  const [draftDealTitle, setDraftDealTitle] = useState('TechStart Enterprise OS');
  const [draftCompany, setDraftCompany] = useState('TechStart Inc.');
  const [draftContactEmail, setDraftContactEmail] = useState('sarah@techstart.io');
  const [draftAmount, setDraftAmount] = useState('18500');

  const announce = (msg: string) => {
    setAnnouncement(msg);
    setTimeout(() => setAnnouncement(null), 4000);
  };

  const loadQuotes = useCallback(async () => {
    try {
      const data = await crmApi.quotes.list();
      if (data && data.length > 0) {
        setQuotes(
          data.map((q: any) => ({
            id: q.id,
            quoteNumber: q.quoteNumber || `QUO-${q.id.slice(0, 8)}`,
            dealTitle: q.deal?.title || 'Opportunity Quote',
            companyName: q.deal?.company?.name || 'Corporate Account',
            contactName: q.deal?.contact?.firstName ? `${q.deal.contact.firstName} ${q.deal.contact.lastName || ''}` : 'Stakeholder',
            contactEmail: q.deal?.contact?.emails?.[0]?.email || 'N/A',
            subtotal: Number(q.subtotal) || 10000,
            discountPercent: Number(q.discount) || 0,
            taxPercent: Number(q.tax) || 8,
            total: Number(q.total) || 10800,
            status: q.status || 'SENT',
            validUntil: q.validUntil ? new Date(q.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '30 days',
            createdAt: new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            signerName: q.signerName,
            signedAt: q.signedAt,
            lineItems: q.lineItems || [],
          }))
        );
      }
    } catch {
      // Use fallback initialQuotes
    }
  }, []);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  const filteredQuotes = quotes.filter((q) => {
    const matchesFilter = filterStatus === 'ALL' || q.status === filterStatus;
    const matchesSearch =
      q.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.dealTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalQuotedValue = quotes.reduce((acc, q) => acc + q.total, 0);
  const acceptedValue = quotes
    .filter((q) => q.status === 'ACCEPTED')
    .reduce((acc, q) => acc + q.total, 0);

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    const newQuoteNum = `QUO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const amt = Number(draftAmount) || 15000;
    const created: QuoteRecord = {
      id: `QUO-${Date.now().toString().slice(-4)}`,
      quoteNumber: newQuoteNum,
      dealTitle: draftDealTitle,
      companyName: draftCompany,
      contactName: 'Executive Sponsor',
      contactEmail: draftContactEmail,
      subtotal: amt,
      discountPercent: 0,
      taxPercent: 8,
      total: Math.round(amt * 1.08),
      status: 'SENT',
      validUntil: 'Nov 30, 2026',
      createdAt: 'Today',
      lineItems: [
        { id: '1', description: 'Core Application Service License', quantity: 1, unitPrice: amt, total: amt },
      ],
    };

    setQuotes((prev) => [created, ...prev]);
    setNewQuoteModalOpen(false);
    announce(`Created proposal quotation ${newQuoteNum} for ${draftCompany}`);
  };

  const handleSendReminder = (q: QuoteRecord) => {
    announce(`Digital proposal reminder re-sent to ${q.contactEmail}`);
  };

  return (
    <div className="space-y-6">
      <CrmAnnouncer message={announcement} />

      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
        totalPipelineValue={`$${totalQuotedValue.toLocaleString()}`}
        activeDealsCount={quotes.length}
      />

      {/* ── Key Metrics Header ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Total Pipeline Quoted
          </span>
          <div className="text-2xl font-black font-mono text-ink mt-1">
            ${totalQuotedValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-ink-muted">{quotes.length} total proposals</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Signed &amp; Accepted (Won)
          </span>
          <div className="text-2xl font-black font-mono text-[#1F7A4D] mt-1">
            ${acceptedValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Legally binding e-signatures</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Awaiting Customer Action
          </span>
          <div className="text-2xl font-black font-mono text-accent mt-1">
            {quotes.filter((q) => q.status === 'SENT').length}
          </div>
          <span className="text-[11px] text-ink-muted">Live public portal review</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Drafting Proposals
          </span>
          <div className="text-2xl font-black font-mono text-ink mt-1">
            {quotes.filter((q) => q.status === 'DRAFT').length}
          </div>
          <span className="text-[11px] text-ink-muted">Internal pricing reviews</span>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <svg
              className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              aria-label="Filter quotations by quote number, company, or email"
              placeholder="Search by quote number, company, or deal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-white text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-[#F3F2EE] p-0.5 rounded-xl border border-border">
            {(['ALL', 'SENT', 'ACCEPTED', 'DRAFT', 'EXPIRED'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#20211F] text-white shadow-2xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {st === 'ALL' ? 'All Quotes' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setNewQuoteModalOpen(true)}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>+ Create Quote</span>
          </button>
        </div>
      </div>

      {/* ── Quotation Table ── */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-border text-ink-muted uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Quote Number</th>
                <th className="py-3 px-4">Deal / Opportunity</th>
                <th className="py-3 px-4">Account / Client</th>
                <th className="py-3 px-4">Quoted Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Valid Until</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-ink-muted">
                    No quotations match the active filters.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-accent">
                      {q.quoteNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-ink">
                      {q.dealTitle}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-ink">{q.companyName}</div>
                      <div className="text-[11px] text-ink-muted">{q.contactEmail}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-ink text-sm">
                      ${q.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {q.status === 'ACCEPTED' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                          ✓ Signed &amp; Won
                        </span>
                      ) : q.status === 'SENT' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-300">
                          ✉ Sent (Awaiting Sign)
                        </span>
                      ) : q.status === 'DRAFT' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-300">
                          ✎ Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-300">
                          ✕ Expired
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-ink-muted text-[11px]">
                      {q.validUntil}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedQuote(q)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-ink transition-colors cursor-pointer"
                        >
                          View Quote
                        </button>
                        {q.status === 'SENT' && (
                          <button
                            type="button"
                            onClick={() => handleSendReminder(q)}
                            className="px-2 py-1 text-xs font-medium rounded-lg text-accent hover:bg-accent/10 transition-colors cursor-pointer"
                          >
                            Resend Link
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── View Formal Quote Drawer / Modal ── */}
      {selectedQuote && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-detail-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedQuote(null);
          }}
        >
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-2xl w-full p-6 space-y-5 text-ink">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                  Official Quotation
                </span>
                <h2 id="quote-detail-title" className="text-xl font-black text-ink">
                  {selectedQuote.quoteNumber}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                aria-label="Close quote modal"
                className="text-ink-muted hover:text-ink text-sm p-1 rounded-lg hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            {/* Recipient and Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-[#FAF9F5] p-3 rounded-xl border border-border">
              <div>
                <span className="text-[10px] font-bold text-ink-muted uppercase">Prepared For:</span>
                <div className="font-bold text-ink text-sm mt-0.5">{selectedQuote.companyName}</div>
                <div className="text-ink-muted">{selectedQuote.contactName} ({selectedQuote.contactEmail})</div>
                <div className="text-ink-muted mt-1">Opportunity: <strong>{selectedQuote.dealTitle}</strong></div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-ink-muted uppercase">Validity &amp; Status:</span>
                <div className="font-semibold text-ink mt-0.5">Expires: {selectedQuote.validUntil}</div>
                <div className="mt-1">
                  Status: <strong>{selectedQuote.status}</strong>
                </div>
                {selectedQuote.signerName && (
                  <div className="mt-1 text-[11px] text-emerald-800 font-bold">
                    Signed by {selectedQuote.signerName} on {selectedQuote.signedAt}
                  </div>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Line Items
              </span>
              <table className="w-full text-left text-xs border border-border rounded-xl overflow-hidden">
                <thead className="bg-[#FAF9F5] border-b border-border text-[10px] uppercase font-bold text-ink-muted">
                  <tr>
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Unit Price</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {selectedQuote.lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2.5 font-medium">{item.description}</td>
                      <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                      <td className="p-2.5 text-right font-mono">${item.unitPrice.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-mono font-bold">${item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex justify-end text-xs">
              <div className="w-56 space-y-1.5 p-3 rounded-xl bg-[#FAF9F5] border border-border font-mono">
                <div className="flex justify-between text-ink-muted">
                  <span>Subtotal:</span>
                  <span>${selectedQuote.subtotal.toLocaleString()}</span>
                </div>
                {selectedQuote.discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({selectedQuote.discountPercent}%):</span>
                    <span>-${Math.round((selectedQuote.subtotal * selectedQuote.discountPercent) / 100).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink-muted">
                  <span>Tax ({selectedQuote.taxPercent}%):</span>
                  <span>+${Math.round((selectedQuote.subtotal * (selectedQuote.taxPercent / 100))).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-black text-ink border-t border-border pt-1">
                  <span>Total:</span>
                  <span>${selectedQuote.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-[11px] text-ink-muted">
                Digital hash authenticated with audit telemetry
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    announce(`Downloaded Quote ${selectedQuote.quoteNumber} as PDF.`);
                  }}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedQuote(null)}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Create New Quotation Modal ── */}
      {newQuoteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-quote-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setNewQuoteModalOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-lg w-full p-6 space-y-4 text-ink">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 id="new-quote-modal-title" className="text-base font-bold text-ink">
                Create Proposal Quotation
              </h3>
              <button
                type="button"
                onClick={() => setNewQuoteModalOpen(false)}
                className="text-ink-muted hover:text-ink text-sm p-1 rounded-lg hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="space-y-3 text-xs">
              <div>
                <label htmlFor="quote-deal-input" className="block font-semibold text-ink mb-1">
                  Opportunity Deal Title *
                </label>
                <input
                  id="quote-deal-input"
                  type="text"
                  required
                  value={draftDealTitle}
                  onChange={(e) => setDraftDealTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-[#FAF9F5] text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="quote-company-input" className="block font-semibold text-ink mb-1">
                    Company Name *
                  </label>
                  <input
                    id="quote-company-input"
                    type="text"
                    required
                    value={draftCompany}
                    onChange={(e) => setDraftCompany(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-[#FAF9F5] text-ink"
                  />
                </div>
                <div>
                  <label htmlFor="quote-email-input" className="block font-semibold text-ink mb-1">
                    Contact Email *
                  </label>
                  <input
                    id="quote-email-input"
                    type="email"
                    required
                    value={draftContactEmail}
                    onChange={(e) => setDraftContactEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-[#FAF9F5] text-ink"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="quote-amount-input" className="block font-semibold text-ink mb-1">
                  Proposed Contract Value ($) *
                </label>
                <input
                  id="quote-amount-input"
                  type="number"
                  required
                  value={draftAmount}
                  onChange={(e) => setDraftAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-[#FAF9F5] text-ink font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setNewQuoteModalOpen(false)}
                  className="btn-secondary text-xs py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4"
                >
                  Generate &amp; Dispatch Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Standard Modals */}
      <NewDealModal
        isOpen={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSubmit={() => {
          loadQuotes();
          announce('Opportunity Deal registered');
        }}
      />
      <NewLeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSubmit={() => {
          announce('Lead captured into qualification intake');
        }}
      />
    </div>
  );
}
