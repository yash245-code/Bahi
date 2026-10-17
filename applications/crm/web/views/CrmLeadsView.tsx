'use client';

import { useState, useEffect, useCallback } from 'react';
import { CrmNav } from '../components/CrmNav';
import { NewLeadModal } from '../components/NewLeadModal';
import { NewDealModal } from '../components/NewDealModal';
import { crmApi } from '../lib/api-client';

interface LeadItem {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  score: number;
  rating: 'HOT' | 'WARM' | 'COLD';
  status: 'New' | 'Contacted' | 'Working' | 'Qualified' | 'Converted' | 'Unqualified';
  createdAt: string;
  assignedTo: string;
  disqualifiedReason?: string;
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
    rating: 'HOT',
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
    rating: 'HOT',
    status: 'Working',
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
    rating: 'WARM',
    status: 'New',
    createdAt: 'Sep 25, 2026',
    assignedTo: 'Daniel Kim',
  },
  {
    id: 'LD-804',
    name: 'Robert Hastings',
    title: 'Managing Director',
    company: 'Hastings Manufacturing',
    email: 'r.hastings@hastingsmfg.com',
    phone: '+1 (555) 345-6789',
    source: 'Outbound Prospecting',
    score: 64,
    rating: 'WARM',
    status: 'Contacted',
    createdAt: 'Sep 24, 2026',
    assignedTo: 'Alex Morgan',
  },
];

export function CrmLeadsView() {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [newDealModalOpen, setNewDealModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [disqualifyId, setDisqualifyId] = useState<string | null>(null);
  const [disqualifyReason, setDisqualifyReason] = useState('No budget / authority');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3500);
  };

  const loadLeads = useCallback(async () => {
    try {
      const data = await crmApi.leads.list();
      if (data && data.length > 0) {
        setLeads(
          data.map((l: any) => ({
            id: l.id,
            name: l.contact ? `${l.contact.firstName} ${l.contact.lastName}` : l.title,
            title: l.contact?.jobTitle || l.title,
            company: l.companyName || l.contact?.company || 'Organization',
            email: l.contact?.emails?.[0]?.email || 'N/A',
            phone: l.contact?.phones?.[0]?.phone || 'N/A',
            source: l.source || 'Inbound Website',
            score: l.score || 50,
            rating: l.rating || 'WARM',
            status: l.status === 'NEW' ? 'New' : l.status === 'WORKING' ? 'Working' : l.status === 'QUALIFIED' ? 'Qualified' : l.status === 'CONVERTED' ? 'Converted' : l.status === 'UNQUALIFIED' ? 'Unqualified' : 'Contacted',
            createdAt: new Date(l.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            assignedTo: l.owner ? `${l.owner.firstName} ${l.owner.lastName || ''}`.trim() : 'Unassigned',
            disqualifiedReason: l.disqualifiedReason,
          }))
        );
      }
    } catch {
      // Keep initialLeads fallback
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleConvert = async (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'Converted' } : l))
    );
    showToast(`Lead "${lead.name}" converted to Deal and Account!`);

    try {
      await crmApi.leads.convert(leadId, { dealTitle: `${lead.company} — New Opportunity` });
      loadLeads();
    } catch {
      // Local state was already updated
    }
  };

  const handleDisqualify = async () => {
    if (!disqualifyId) return;
    setLeads((prev) =>
      prev.map((l) =>
        l.id === disqualifyId ? { ...l, status: 'Unqualified', disqualifiedReason: disqualifyReason } : l
      )
    );
    showToast(`Lead disqualified: ${disqualifyReason}`);

    try {
      await crmApi.leads.disqualify(disqualifyId, disqualifyReason);
      loadLeads();
    } catch {
      // Keep optimistic
    } finally {
      setDisqualifyId(null);
    }
  };

  const handleRecycle = async (leadId: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'New', disqualifiedReason: undefined } : l))
    );
    showToast('Lead recycled back into active qualification queue');

    try {
      await crmApi.leads.recycle(leadId);
      loadLeads();
    } catch {
      // Keep optimistic
    }
  };

  const handleAddLead = async (data: {
    name: string;
    company: string;
    email: string;
    phone: string;
    source: string;
    score: number;
    notes?: string;
  }) => {
    try {
      await crmApi.leads.create({
        title: `${data.name} — ${data.company}`,
        firstName: data.name.split(' ')[0],
        lastName: data.name.split(' ').slice(1).join(' '),
        companyName: data.company,
        email: data.email,
        phone: data.phone,
        source: data.source,
        score: data.score,
        interestNotes: data.notes,
      });
      showToast(`Lead "${data.name}" added to intake queue`);
      loadLeads();
    } catch {
      const newLead: LeadItem = {
        id: `LD-${Date.now().toString().slice(-3)}`,
        name: data.name,
        title: 'Prospect',
        company: data.company,
        email: data.email,
        phone: data.phone,
        source: data.source,
        score: data.score,
        rating: data.score >= 80 ? 'HOT' : 'WARM',
        status: 'New',
        createdAt: 'Today',
        assignedTo: 'You',
      };
      setLeads((prev) => [newLead, ...prev]);
      showToast(`Lead "${data.name}" added`);
    }
  };

  const toggleSelectLead = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map((l) => l.id));
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || lead.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <CrmNav
        onNewDeal={() => setNewDealModalOpen(true)}
        onNewLead={() => setNewLeadModalOpen(true)}
        totalPipelineValue={`$272,000`}
        activeDealsCount={11}
      />

      {/* ─── Search, Filters & Bulk Actions Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <svg
              className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search leads by name, company, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-white text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'new', 'working', 'qualified', 'converted', 'unqualified'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#20211F] text-white border-[#20211F]'
                  : 'bg-white text-ink-muted border-border hover:bg-neutral-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bulk Actions Floating Ribbon ── */}
      {selectedLeads.length > 0 && (
        <div className="p-3 bg-[#20211F] text-white rounded-xl flex items-center justify-between gap-4 text-xs animate-fade-in shadow-xl">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>{selectedLeads.length} leads selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                showToast(`Reassigned ${selectedLeads.length} leads to Alex Morgan`);
                setSelectedLeads([]);
              }}
              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Assign Rep
            </button>
            <button
              onClick={() => {
                setLeads((prev) => prev.filter((l) => !selectedLeads.includes(l.id)));
                showToast(`Deleted ${selectedLeads.length} leads`);
                setSelectedLeads([]);
              }}
              className="px-2.5 py-1 rounded-lg bg-red-800 hover:bg-red-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* ── Leads Data Table ── */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-border text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                </th>
                <th className="p-3.5">Lead / Contact</th>
                <th className="p-3.5">Company</th>
                <th className="p-3.5">Source</th>
                <th className="p-3.5">Score</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Assigned Rep</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-ink-muted">
                    No leads found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleSelectLead(lead.id)}
                        className="rounded border-border text-accent focus:ring-accent"
                      />
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-ink">{lead.name}</div>
                      <div className="text-[11px] text-ink-muted">{lead.email}</div>
                    </td>
                    <td className="p-3.5 font-medium text-ink">
                      {lead.company}
                    </td>
                    <td className="p-3.5 text-ink-muted">
                      {lead.source}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-bold ${lead.score >= 80 ? 'text-red-700' : 'text-amber-700'}`}>
                          {lead.score}
                        </span>
                        <div className="w-12 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${lead.score >= 80 ? 'bg-red-600' : 'bg-amber-600'}`}
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          lead.status === 'Converted'
                            ? 'bg-[#1F7A4D]/15 text-[#1F7A4D] border border-[#1F7A4D]/30'
                            : lead.status === 'Qualified'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : lead.status === 'Working'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : lead.status === 'Unqualified'
                            ? 'bg-neutral-200 text-neutral-700 border border-neutral-300'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-ink-muted font-medium">
                      {lead.assignedTo}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {lead.status !== 'Converted' && lead.status !== 'Unqualified' && (
                          <button
                            onClick={() => handleConvert(lead.id)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-accent text-white hover:bg-[#853526] transition-colors cursor-pointer shadow-xs"
                          >
                            Convert to Deal
                          </button>
                        )}
                        {lead.status !== 'Converted' && lead.status !== 'Unqualified' && (
                          <button
                            onClick={() => setDisqualifyId(lead.id)}
                            className="px-2 py-1 text-[11px] font-medium rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                          >
                            Disqualify
                          </button>
                        )}
                        {lead.status === 'Unqualified' && (
                          <button
                            onClick={() => handleRecycle(lead.id)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-neutral-800 text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                          >
                            Recycle
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

      {/* ── Disqualify Modal ── */}
      {disqualifyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-ink">Disqualify Inbound Lead</h3>
            <p className="text-xs text-ink-muted">
              Select the reason why this lead is not qualified for sales engagement:
            </p>
            <select
              value={disqualifyReason}
              onChange={(e) => setDisqualifyReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border bg-white text-ink"
            >
              <option value="No budget / authority">No Budget / Authority</option>
              <option value="Unresponsive after outreach">Unresponsive After 5 Outreach Attempts</option>
              <option value="Competitor / Student">Competitor / Researcher / Student</option>
              <option value="Feature not supported">Required Feature Not Supported</option>
              <option value="Outside target geography">Outside Target Territory</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDisqualifyId(null)}
                className="px-3 py-1.5 text-xs rounded-lg border border-border text-ink-muted hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDisqualify}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-700 text-white hover:bg-red-800"
              >
                Disqualify Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewLeadModal
        isOpen={newLeadModalOpen}
        onClose={() => setNewLeadModalOpen(false)}
        onSubmit={handleAddLead}
      />

      <NewDealModal
        isOpen={newDealModalOpen}
        onClose={() => setNewDealModalOpen(false)}
        onSubmit={() => showToast('Deal created')}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#20211F] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
