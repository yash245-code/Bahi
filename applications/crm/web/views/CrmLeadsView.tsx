'use client';

import { useState } from 'react';
import { CrmNav } from '../components/CrmNav';
import { NewLeadModal } from '../components/NewLeadModal';
import { NewDealModal } from '../components/NewDealModal';

interface LeadItem {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  score: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  createdAt: string;
  assignedTo: string;
}

const initialLeads: LeadItem[] = [
  {
    id: 'LD-801',
    name: 'Sarah Chen',
    title: 'Head of Supply Chain',
    company: 'Summit Retail Corp',
    email: 'sarah.chen@summitcorp.com',
    phone: '+1 (555) 234-8901',
    source: 'Inbound Website',
    score: 92,
    status: 'Qualified',
    createdAt: 'Sep 27, 2026',
    assignedTo: 'Alex Morgan',
  },
  {
    id: 'LD-802',
    name: 'Marcus Vance',
    title: 'VP of Technology',
    company: 'DataFlow Systems',
    email: 'm.vance@dataflow.io',
    phone: '+1 (555) 890-1234',
    source: 'Partner Referral',
    score: 85,
    status: 'Contacted',
    createdAt: 'Sep 26, 2026',
    assignedTo: 'Priya Sharma',
  },
  {
    id: 'LD-803',
    name: 'Elena Rostova',
    title: 'Operations Director',
    company: 'Nordic Logistics AG',
    email: 'elena@nordiclogistics.de',
    phone: '+49 30 901820',
    source: 'Product Trial',
    score: 78,
    status: 'New',
    createdAt: 'Sep 25, 2026',
    assignedTo: 'Daniel Kim',
  },
  {
    id: 'LD-804',
    name: 'David Okafor',
    title: 'Chief Financial Officer',
    company: 'Apex Health Ltd',
    email: 'david.o@apexhealth.co',
    phone: '+44 20 7946 0192',
    source: 'Direct Outreach',
    score: 88,
    status: 'Qualified',
    createdAt: 'Sep 24, 2026',
    assignedTo: 'Alex Morgan',
  },
  {
    id: 'LD-805',
    name: 'Lisa Tanaka',
    title: 'Procurement Specialist',
    company: 'BrightWave Retailers',
    email: 'l.tanaka@brightwave.jp',
    phone: '+81 3 5555 0143',
    source: 'Inbound Website',
    score: 64,
    status: 'Contacted',
    createdAt: 'Sep 23, 2026',
    assignedTo: 'Priya Sharma',
  },
  {
    id: 'LD-806',
    name: 'Julian Sterling',
    title: 'Managing Director',
    company: 'Sterling Freight Global',
    email: 'julian@sterlingfreight.com',
    phone: '+1 (555) 789-0123',
    source: 'Webinar/Event',
    score: 95,
    status: 'Converted',
    createdAt: 'Sep 20, 2026',
    assignedTo: 'Alex Morgan',
  },
];

export function CrmLeadsView() {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3500);
  };

  const handleCreateLead = (lead: {
    name: string;
    company: string;
    email: string;
    phone: string;
    source: string;
    score: number;
    notes?: string;
  }) => {
    const newLead: LeadItem = {
      id: `LD-${Math.floor(800 + Math.random() * 200)}`,
      name: lead.name,
      title: 'Prospect Contact',
      company: lead.company,
      email: lead.email,
      phone: lead.phone || '+1 (555) 000-0000',
      source: lead.source,
      score: lead.score,
      status: 'New',
      createdAt: 'Just now',
      assignedTo: 'Alex Morgan',
    };

    setLeads([newLead, ...leads]);
    showToast(`Captured lead for ${lead.name} (${lead.company})`);
  };

  const handleConvertLead = (leadId: string) => {
    setLeads((prev) =>
      prev.map((ld) => {
        if (ld.id === leadId) {
          showToast(`Converted lead ${ld.name} into an active Deal & Customer Account!`);
          return { ...ld, status: 'Converted' };
        }
        return ld;
      })
    );
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesQuery =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || lead.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesQuery && matchesStatus;
  });

  const qualifiedCount = leads.filter((l) => l.status === 'Qualified').length;
  const hotLeadsCount = leads.filter((l) => l.score >= 80).length;
  const convertedCount = leads.filter((l) => l.status === 'Converted').length;

  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Persistent CRM Navigation Header ─────────── */}
      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
      />

      {/* ── Toast Alert ──────────────────────────────── */}
      {toastMessage && (
        <div className="p-3 bg-neutral-900 text-white rounded-xl flex items-center justify-between text-xs font-semibold shadow-lg border border-neutral-800 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-success inline-block" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-white text-xs px-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Metric Cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Total Inbound Leads</span>
          <span className="text-2xl font-black text-ink mt-1 font-mono">{leads.length}</span>
          <span className="text-[11px] text-[#1F7A4D] font-medium block mt-1">+14% this month</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">High-Score Hot Leads</span>
          <span className="text-2xl font-black text-accent mt-1 font-mono">{hotLeadsCount}</span>
          <span className="text-[11px] text-ink-muted block mt-1">Score &gt;= 80 points</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Qualified Pipeline</span>
          <span className="text-2xl font-black text-[#1F7A4D] mt-1 font-mono">{qualifiedCount}</span>
          <span className="text-[11px] text-ink-muted block mt-1">Ready for proposal</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Converted Deals</span>
          <span className="text-2xl font-black text-purple-700 mt-1 font-mono">{convertedCount}</span>
          <span className="text-[11px] text-purple-600 block mt-1">Converted to orders</span>
        </div>
      </div>

      {/* ── Search & Filter Bar ──────────────────────── */}
      <div className="card p-3 flex flex-wrap items-center justify-between gap-3 bg-white shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[260px] max-w-md">
          <div className="relative w-full">
            <svg className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search leads by name, company, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#FAF9F5] border border-border rounded-lg text-ink placeholder:text-ink-muted outline-none focus:border-accent focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs flex-wrap">
          <span className="text-ink-muted text-[11px] font-medium mr-1">Status:</span>
          {['all', 'New', 'Contacted', 'Qualified', 'Converted'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? 'bg-accent text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-ink-muted hover:text-ink border border-border'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── Leads Data Table ─────────────────────────── */}
      <div className="card overflow-hidden shadow-xs">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-[#FAF9F5]">
              <th className="text-left px-5 py-3.5 font-bold text-ink-muted text-xs uppercase tracking-wider">
                Lead Contact
              </th>
              <th className="text-left px-5 py-3.5 font-bold text-ink-muted text-xs uppercase tracking-wider">
                Company &amp; Source
              </th>
              <th className="text-center px-5 py-3.5 font-bold text-ink-muted text-xs uppercase tracking-wider">
                Qualification Score
              </th>
              <th className="text-center px-5 py-3.5 font-bold text-ink-muted text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-5 py-3.5 font-bold text-ink-muted text-xs uppercase tracking-wider">
                Owner
              </th>
              <th className="text-right px-5 py-3.5 font-bold text-ink-muted text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-[#FAF9F5] transition-colors">
                {/* Contact Name & Title */}
                <td className="px-5 py-4">
                  <div className="font-bold text-ink text-sm">{lead.name}</div>
                  <div className="text-xs text-ink-muted">{lead.title}</div>
                  <div className="text-[11px] text-ink-muted font-mono mt-0.5">{lead.email}</div>
                </td>

                {/* Company & Source */}
                <td className="px-5 py-4">
                  <div className="font-semibold text-ink flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-[#FAF4F2] text-accent flex items-center justify-center text-[10px] font-bold">
                      {lead.company.charAt(0)}
                    </span>
                    {lead.company}
                  </div>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF9F5] border border-border text-ink-muted">
                    {lead.source}
                  </span>
                </td>

                {/* Score Meter */}
                <td className="px-5 py-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className={`text-xs font-mono font-bold ${
                      lead.score >= 85 ? 'text-accent' : lead.score >= 70 ? 'text-[#1F7A4D]' : 'text-ink-muted'
                    }`}>
                      {lead.score} / 100
                    </span>
                    <div className="w-16 h-1.5 bg-[#FAF9F5] border border-border rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          lead.score >= 85 ? 'bg-accent' : lead.score >= 70 ? 'bg-[#1F7A4D]' : 'bg-neutral-400'
                        }`}
                        style={{ width: `${lead.score}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-5 py-4 text-center">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    lead.status === 'Qualified'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : lead.status === 'Converted'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : lead.status === 'Contacted'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}>
                    {lead.status}
                  </span>
                </td>

                {/* Assigned Sales Rep */}
                <td className="px-5 py-4 text-xs font-medium text-ink">
                  {lead.assignedTo}
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right">
                  {lead.status !== 'Converted' ? (
                    <button
                      type="button"
                      onClick={() => handleConvertLead(lead.id)}
                      className="text-xs font-bold text-accent hover:text-[#853526] bg-[#FAF4F2] hover:bg-[#F3E3DF] px-3 py-1.5 rounded-lg border border-[#EBD2CB] transition-all cursor-pointer"
                    >
                      Convert to Deal →
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-purple-700">✓ In Deal Pipeline</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Modals ───────────────────────────────────── */}
      <NewLeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSubmit={handleCreateLead}
      />
      <NewDealModal
        isOpen={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSubmit={() => showToast('Deal created from modal')}
      />
    </div>
  );
}
