'use client';

import { useState, useEffect, useCallback } from 'react';
import { CrmNav } from '../components/CrmNav';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';
import { crmApi } from '../lib/api-client';

interface ContactItem {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  lifecycleStage: 'Lead' | 'Opportunity' | 'Customer' | 'Evangelist';
  lastContacted: string;
  dealsCount: number;
}

const initialContacts: ContactItem[] = [
  {
    id: 'CNT-201',
    name: 'Sarah Chen',
    title: 'Head of Supply Chain & Ops',
    company: 'TechStart Inc.',
    email: 'sarah@techstart.io',
    phone: '+1 (555) 234-8901',
    lifecycleStage: 'Customer',
    lastContacted: '2 days ago',
    dealsCount: 2,
  },
  {
    id: 'CNT-202',
    name: 'Marcus Rodriguez',
    title: 'VP of Global Logistics',
    company: 'DataFlow Corp',
    email: 'marcus@dataflow.com',
    phone: '+1 (555) 890-1234',
    lifecycleStage: 'Opportunity',
    lastContacted: 'Yesterday',
    dealsCount: 3,
  },
  {
    id: 'CNT-203',
    name: 'Alex Vance',
    title: 'Chief Technology Officer',
    company: 'NexGen Systems',
    email: 'cto@nexgen.dev',
    phone: '+1 (555) 456-7890',
    lifecycleStage: 'Opportunity',
    lastContacted: '4 days ago',
    dealsCount: 2,
  },
  {
    id: 'CNT-204',
    name: 'Elena Rostova',
    title: 'Operations Director',
    company: 'Nordic Logistics AG',
    email: 'elena@nordiclogistics.de',
    phone: '+49 30 901820',
    lifecycleStage: 'Lead',
    lastContacted: 'Today',
    dealsCount: 1,
  },
];

export function CrmContactsView() {
  const [contacts, setContacts] = useState<ContactItem[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [newContactModalOpen, setNewContactModalOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3500);
  };

  const loadContacts = useCallback(async () => {
    try {
      const data = await crmApi.contacts.list();
      if (data && data.length > 0) {
        setContacts(
          data.map((c: any) => ({
            id: c.id,
            name: `${c.firstName} ${c.lastName}`.trim(),
            title: c.jobTitle || 'Executive Stakeholder',
            company: c.company?.name || 'Independent Client',
            email: c.emails?.[0]?.email || 'N/A',
            phone: c.phones?.[0]?.phone || 'N/A',
            lifecycleStage: c.lifecycleStage === 'CUSTOMER' ? 'Customer' : c.lifecycleStage === 'OPPORTUNITY' ? 'Opportunity' : 'Lead',
            lastContacted: 'Recently',
            dealsCount: 1,
          }))
        );
      }
    } catch {
      // Keep initialContacts fallback
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;

    try {
      await crmApi.contacts.create({
        firstName,
        lastName,
        jobTitle,
        emails: email ? [{ email, isPrimary: true, label: 'Work' }] : [],
        phones: phone ? [{ phone, type: 'Mobile', isWhatsApp: true, isPrimary: true }] : [],
      });
      showToast(`Contact "${firstName} ${lastName}" added`);
      loadContacts();
    } catch {
      const created: ContactItem = {
        id: `CNT-${Date.now().toString().slice(-3)}`,
        name: `${firstName} ${lastName}`,
        title: jobTitle || 'Stakeholder',
        company: 'Account',
        email: email || 'N/A',
        phone: phone || 'N/A',
        lifecycleStage: 'Lead',
        lastContacted: 'Just now',
        dealsCount: 0,
      };
      setContacts((prev) => [created, ...prev]);
      showToast(`Contact "${firstName} ${lastName}" added`);
    } finally {
      setNewContactModalOpen(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setJobTitle('');
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage =
      stageFilter === 'all' || c.lifecycleStage.toLowerCase() === stageFilter.toLowerCase();

    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
        totalPipelineValue={`$272,000`}
        activeDealsCount={11}
      />

      {/* ── Search & Filter Controls ── */}
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
              placeholder="Search contacts by name, company, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-white text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {['all', 'customer', 'opportunity', 'lead'].map((st) => (
              <button
                key={st}
                onClick={() => setStageFilter(st)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border capitalize transition-colors cursor-pointer ${
                  stageFilter === st
                    ? 'bg-[#20211F] text-white border-[#20211F]'
                    : 'bg-white text-ink-muted border-border hover:bg-neutral-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <button
            onClick={() => setNewContactModalOpen(true)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-[#853526] transition-colors cursor-pointer shadow-xs ml-2"
          >
            + Add Contact
          </button>
        </div>
      </div>

      {/* ── Contacts Data Table ── */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-border text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                <th className="p-3.5">Full Name & Title</th>
                <th className="p-3.5">Company / Account</th>
                <th className="p-3.5">Email & Phone</th>
                <th className="p-3.5">Lifecycle Stage</th>
                <th className="p-3.5">Last Contacted</th>
                <th className="p-3.5 text-right">Quick Connect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ink-muted">
                    No contacts found matching your query.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-ink">{c.name}</div>
                      <div className="text-[11px] text-ink-muted">{c.title}</div>
                    </td>
                    <td className="p-3.5 font-medium text-ink">
                      {c.company}
                    </td>
                    <td className="p-3.5">
                      <div className="text-ink font-mono">{c.email}</div>
                      <div className="text-[11px] text-ink-muted font-mono">{c.phone}</div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          c.lifecycleStage === 'Customer'
                            ? 'bg-[#1F7A4D]/15 text-[#1F7A4D] border border-[#1F7A4D]/30'
                            : c.lifecycleStage === 'Opportunity'
                            ? 'bg-accent/15 text-accent border border-accent/30'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {c.lifecycleStage}
                      </span>
                    </td>
                    <td className="p-3.5 text-ink-muted font-medium">
                      {c.lastContacted}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`mailto:${c.email}`}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-neutral-100 hover:bg-neutral-200 text-ink transition-colors cursor-pointer"
                        >
                          ✉️ Email
                        </a>
                        <button
                          onClick={() => showToast(`Simulating call to ${c.phone}...`)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-neutral-100 hover:bg-neutral-200 text-ink transition-colors cursor-pointer"
                        >
                          📞 Call
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Contact Modal ── */}
      {newContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-ink">Add Stakeholder Contact</h3>
            <form onSubmit={handleCreateContact} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-ink-muted block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-border bg-white text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-muted block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-border bg-white text-ink"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Director of Engineering"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-border bg-white text-ink"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-border bg-white text-ink"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-border bg-white text-ink"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewContactModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-border text-ink-muted hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-[#853526]"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewDealModal
        isOpen={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSubmit={() => showToast('Deal created')}
      />

      <NewLeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSubmit={() => showToast('Lead captured')}
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
