'use client';

import { useState, useEffect, useCallback } from 'react';
import { CrmNav } from '../components/CrmNav';
import { CrmAnnouncer } from '../components/CrmAnnouncer';
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
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setAnnouncement(msg);
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

  const handleExportCsv = () => {
    const rows = ['ID,Name,Title,Company,Email,Phone,LifecycleStage,LastContacted,DealsCount'];
    filteredContacts.forEach((c) => {
      rows.push(
        `"${c.id}","${c.name}","${c.title}","${c.company}","${c.email}","${c.phone}","${c.lifecycleStage}","${c.lastContacted}",${c.dealsCount}`
      );
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts_directory_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredContacts.length} contacts to CSV.`);
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage =
      stageFilter === 'all' || c.lifecycleStage.toLowerCase() === stageFilter.toLowerCase();

    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      <CrmAnnouncer message={announcement} />

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
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              aria-label="Search contacts by name, company, email, or role"
              placeholder="Search contacts by name, company, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-white text-ink placeholder:text-ink-muted/60 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            {['all', 'lead', 'opportunity', 'customer'].map((st) => (
              <button
                key={st}
                onClick={() => setStageFilter(st)}
                aria-pressed={stageFilter === st}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border capitalize transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent ${
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
            type="button"
            onClick={handleExportCsv}
            aria-label="Export contacts to CSV"
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setNewContactModalOpen(true)}
            aria-label="Add a new contact"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-[#853526] transition-colors cursor-pointer shadow-xs ml-2 focus-visible:ring-2 focus-visible:ring-accent"
          >
            + Add Contact
          </button>
        </div>
      </div>

      {/* ── Contacts Data Table ── */}
      <div
        role="region"
        aria-label="Stakeholders directory"
        className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-border text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                <th scope="col" className="p-3.5">Full Name &amp; Title</th>
                <th scope="col" className="p-3.5">Company / Account</th>
                <th scope="col" className="p-3.5">Email &amp; Phone</th>
                <th scope="col" className="p-3.5">Lifecycle Stage</th>
                <th scope="col" className="p-3.5">Last Contacted</th>
                <th scope="col" className="p-3.5 text-right">Quick Channels</th>
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
                      <button
                        type="button"
                        onClick={() => setSelectedContact(c)}
                        className="text-left font-bold text-ink hover:text-accent transition-colors cursor-pointer"
                        title="Click to view 360 Profile"
                      >
                        {c.name}
                      </button>
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
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <a
                          href={`mailto:${c.email}`}
                          aria-label={`Send email to ${c.name}`}
                          className="px-2 py-1 text-[11px] font-medium rounded-lg bg-neutral-100 hover:bg-neutral-200 text-ink transition-colors cursor-pointer"
                        >
                          ✉️ Email
                        </a>
                        <a
                          href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                          aria-label={`Call ${c.name} at ${c.phone}`}
                          className="px-2 py-1 text-[11px] font-medium rounded-lg bg-neutral-100 hover:bg-neutral-200 text-ink transition-colors cursor-pointer"
                        >
                          📞 Call
                        </a>
                        <a
                          href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Chat with ${c.name} on WhatsApp`}
                          className="px-2 py-1 text-[11px] font-medium rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          💬 WhatsApp
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 360 Contact Profile Drawer ── */}
      {selectedContact && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-360-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedContact(null);
          }}
        >
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4 text-ink">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-[10px] font-mono text-ink-muted uppercase">Contact 360</span>
                <h3 id="contact-360-title" className="text-xl font-bold text-ink">
                  {selectedContact.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                aria-label="Close contact profile"
                className="text-ink-muted hover:text-ink text-sm p-1 rounded-lg hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#FAF9F5] p-3 rounded-xl border border-border text-xs space-y-2">
              <div>
                <span className="text-ink-muted text-[10px] font-bold uppercase">Role &amp; Company</span>
                <div className="font-bold text-ink text-sm">{selectedContact.title}</div>
                <div className="text-ink-muted">{selectedContact.company}</div>
              </div>
              <div className="pt-1 border-t border-border/40">
                <span className="text-ink-muted text-[10px] font-bold uppercase">Lifecycle Stage</span>
                <div className="mt-0.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent/15 text-accent">
                    {selectedContact.lifecycleStage}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-ink-muted text-[10px] font-bold uppercase">Communications</span>
              <div className="p-2.5 rounded-lg border border-border flex justify-between items-center">
                <span>Email: <strong className="font-mono">{selectedContact.email}</strong></span>
                <a href={`mailto:${selectedContact.email}`} className="text-accent font-bold">Mail →</a>
              </div>
              <div className="p-2.5 rounded-lg border border-border flex justify-between items-center">
                <span>Phone: <strong className="font-mono">{selectedContact.phone}</strong></span>
                <a href={`https://wa.me/${selectedContact.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-700 font-bold">WhatsApp →</a>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                className="btn-primary text-xs py-2 px-4"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Contact Modal ── */}
      {newContactModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-contact-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setNewContactModalOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4 text-ink">
            <h3 id="add-contact-title" className="text-base font-bold text-ink">
              Add Stakeholder Contact
            </h3>
            <form onSubmit={handleCreateContact} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="cont-first-name" className="text-xs font-semibold text-ink block mb-1">First Name *</label>
                  <input
                    id="cont-first-name"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border bg-[#FAF9F5] text-ink focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </div>
                <div>
                  <label htmlFor="cont-last-name" className="text-xs font-semibold text-ink block mb-1">Last Name *</label>
                  <input
                    id="cont-last-name"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border bg-[#FAF9F5] text-ink focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="cont-job-title" className="text-xs font-semibold text-ink block mb-1">Job Title</label>
                <input
                  id="cont-job-title"
                  type="text"
                  placeholder="e.g. Director of Engineering"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-[#FAF9F5] text-ink focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="cont-email" className="text-xs font-semibold text-ink block mb-1">Work Email *</label>
                <input
                  id="cont-email"
                  type="email"
                  required
                  placeholder="alex@techstart.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-[#FAF9F5] text-ink focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="cont-phone" className="text-xs font-semibold text-ink block mb-1">Phone / WhatsApp</label>
                <input
                  id="cont-phone"
                  type="tel"
                  placeholder="+1 (555) 234-8901"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-[#FAF9F5] text-ink focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setNewContactModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-border text-ink-muted hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-[#853526] focus-visible:ring-2 focus-visible:ring-accent"
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
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#20211F] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 animate-fade-in"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
