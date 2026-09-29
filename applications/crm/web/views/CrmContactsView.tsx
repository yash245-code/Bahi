'use client';

import { useState } from 'react';
import { CrmNav } from '../components/CrmNav';
import { NewLeadModal } from '../components/NewLeadModal';
import { NewDealModal } from '../components/NewDealModal';

interface ContactItem {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  lifecycle: 'Customer' | 'Opportunity' | 'Lead' | 'Champion';
  lastActivity: string;
  dealsCount: number;
}

const initialContacts: ContactItem[] = [
  {
    id: 'CNT-501',
    name: 'Sarah Chen',
    title: 'Head of Global Operations',
    company: 'TechStart Inc.',
    email: 'sarah@techstart.io',
    phone: '+1 (555) 349-8921',
    lifecycle: 'Customer',
    lastActivity: 'Yesterday (Call)',
    dealsCount: 2,
  },
  {
    id: 'CNT-502',
    name: 'Marcus Rodriguez',
    title: 'Chief Technology Officer',
    company: 'DataFlow Corp',
    email: 'marcus@dataflow.com',
    phone: '+1 (555) 892-4410',
    lifecycle: 'Opportunity',
    lastActivity: '2 days ago (Meeting)',
    dealsCount: 1,
  },
  {
    id: 'CNT-503',
    name: 'Alex Vance',
    title: 'VP of Platform Engineering',
    company: 'NexGen Systems',
    email: 'cto@nexgen.dev',
    phone: '+1 (555) 219-9032',
    lifecycle: 'Champion',
    lastActivity: 'Sep 24 (Email)',
    dealsCount: 3,
  },
  {
    id: 'CNT-504',
    name: 'Lisa Tanaka',
    title: 'Supply Chain Lead',
    company: 'BrightWave Retail',
    email: 'team@brightwave.co',
    phone: '+81 3 5555 0143',
    lifecycle: 'Opportunity',
    lastActivity: 'Sep 21 (Proposal)',
    dealsCount: 1,
  },
  {
    id: 'CNT-505',
    name: 'David Okafor',
    title: 'Chief Financial Officer',
    company: 'Summit Digital Group',
    email: 'ops@summit.io',
    phone: '+44 20 7946 0192',
    lifecycle: 'Customer',
    lastActivity: 'Sep 18 (Invoice Review)',
    dealsCount: 2,
  },
  {
    id: 'CNT-506',
    name: 'Emily Zhang',
    title: 'Operations Director',
    company: 'CloudBase Ltd',
    email: 'team@cloudbase.io',
    phone: '+1 (555) 789-0123',
    lifecycle: 'Lead',
    lastActivity: 'Sep 15 (Inbound)',
    dealsCount: 0,
  },
];

export function CrmContactsView() {
  const [contacts] = useState<ContactItem[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [lifecycleFilter, setLifecycleFilter] = useState<string>('all');
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3500);
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLifecycle =
      lifecycleFilter === 'all' || c.lifecycle.toLowerCase() === lifecycleFilter.toLowerCase();
    return matchesSearch && matchesLifecycle;
  });

  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Persistent CRM Navigation Header ─────────── */}
      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
        activeDealsCount={contacts.length}
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

      {/* ── Summary Stats ────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Total Contacts</span>
          <span className="text-2xl font-black text-ink mt-1 font-mono">{contacts.length}</span>
          <span className="text-[11px] text-[#1F7A4D] font-medium block mt-1">+8 new this month</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Active Champions</span>
          <span className="text-2xl font-black text-purple-700 mt-1 font-mono">
            {contacts.filter((c) => c.lifecycle === 'Champion').length}
          </span>
          <span className="text-[11px] text-purple-600 block mt-1">High conversion influence</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Customers</span>
          <span className="text-2xl font-black text-[#1F7A4D] mt-1 font-mono">
            {contacts.filter((c) => c.lifecycle === 'Customer').length}
          </span>
          <span className="text-[11px] text-ink-muted block mt-1">Contract active</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">In Active Deals</span>
          <span className="text-2xl font-black text-accent mt-1 font-mono">
            {contacts.filter((c) => c.dealsCount > 0).length}
          </span>
          <span className="text-[11px] text-ink-muted block mt-1">Associated with open pipeline</span>
        </div>
      </div>

      {/* ── Search & Filter Controls ─────────────────── */}
      <div className="card p-3 flex flex-wrap items-center justify-between gap-3 bg-white shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[260px] max-w-md">
          <div className="relative w-full">
            <svg className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search contacts by name, company, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#FAF9F5] border border-border rounded-lg text-ink placeholder:text-ink-muted outline-none focus:border-accent focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-ink-muted text-[11px] font-medium mr-1">Lifecycle:</span>
          {['all', 'Customer', 'Opportunity', 'Champion', 'Lead'].map((st) => (
            <button
              key={st}
              onClick={() => setLifecycleFilter(st)}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                lifecycleFilter.toLowerCase() === st.toLowerCase()
                  ? 'bg-accent text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-ink-muted hover:text-ink border border-border'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── Contacts Table ───────────────────────────── */}
      <div className="card overflow-hidden shadow-xs">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-[#FAF9F5]">
              <th className="text-left px-5 py-3.5 font-bold text-ink-muted text-xs uppercase tracking-wider">
                Contact Name &amp; Title
              </th>
              <th className="text-left px-5 py-3.5 font-bold text-ink-muted text-xs uppercase tracking-wider">
                Company
              </th>
              <th className="text-left px-5 py-3.5 font-bold text-ink-muted text-xs uppercase tracking-wider">
                Direct Communication
              </th>
              <th className="text-center px-5 py-3.5 font-bold text-ink-muted text-xs uppercase tracking-wider">
                Lifecycle Stage
              </th>
              <th className="text-left px-5 py-3.5 font-bold text-ink-muted text-xs uppercase tracking-wider">
                Last Activity
              </th>
              <th className="text-right px-5 py-3.5 font-bold text-ink-muted text-xs uppercase tracking-wider">
                Quick Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-[#FAF9F5] transition-colors">
                {/* Contact Name & Title */}
                <td className="px-5 py-4">
                  <div className="font-bold text-ink text-sm flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-accent/20 text-accent font-black text-xs flex items-center justify-center">
                      {contact.name.charAt(0)}
                    </div>
                    <span>{contact.name}</span>
                  </div>
                  <div className="text-xs text-ink-muted ml-9">{contact.title}</div>
                </td>

                {/* Company */}
                <td className="px-5 py-4 font-semibold text-ink">
                  {contact.company}
                </td>

                {/* Direct Comms */}
                <td className="px-5 py-4 text-xs font-mono">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-accent hover:underline block"
                  >
                    {contact.email}
                  </a>
                  <span className="text-ink-muted text-[11px]">{contact.phone}</span>
                </td>

                {/* Lifecycle Badge */}
                <td className="px-5 py-4 text-center">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    contact.lifecycle === 'Customer'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : contact.lifecycle === 'Champion'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : contact.lifecycle === 'Opportunity'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}>
                    {contact.lifecycle}
                  </span>
                </td>

                {/* Last Activity */}
                <td className="px-5 py-4 text-xs text-ink-muted">
                  {contact.lastActivity}
                </td>

                {/* Quick Actions */}
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => showToast(`Initiated email dispatch to ${contact.email}`)}
                    className="text-xs font-semibold text-ink-muted hover:text-accent bg-[#FAF9F5] hover:bg-white border border-border px-2.5 py-1 rounded-lg transition-all cursor-pointer mr-2"
                  >
                    ✉️ Email
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast(`Scheduled follow-up call with ${contact.name}`)}
                    className="text-xs font-semibold text-accent hover:text-[#853526] bg-[#FAF4F2] hover:bg-[#F3E3DF] border border-[#EBD2CB] px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    📞 Call
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Modals ───────────────────────────────────── */}
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
    </div>
  );
}
