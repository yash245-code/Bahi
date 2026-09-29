'use client';

import { useState } from 'react';
import { CrmNav } from '../components/CrmNav';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';

interface ActivityItem {
  id: string;
  type: 'Call' | 'Meeting' | 'Email' | 'Task';
  subject: string;
  relatedTo: { name: string; type: 'Deal' | 'Company' | 'Lead' };
  dueDate: string;
  time: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  completed: boolean;
}

const initialActivities: ActivityItem[] = [
  {
    id: 'ACT-101',
    type: 'Call',
    subject: 'Discovery Call on ERP Multi-Tenant Architecture',
    relatedTo: { name: 'TechStart Enterprise OS', type: 'Deal' },
    dueDate: 'Today',
    time: '2:30 PM',
    priority: 'High',
    assignedTo: 'Alex Morgan',
    completed: false,
  },
  {
    id: 'ACT-102',
    type: 'Meeting',
    subject: 'Executive Demo with VP of Logistics',
    relatedTo: { name: 'DataFlow Corp', type: 'Company' },
    dueDate: 'Today',
    time: '4:00 PM',
    priority: 'High',
    assignedTo: 'Priya Sharma',
    completed: false,
  },
  {
    id: 'ACT-103',
    type: 'Email',
    subject: 'Send Revised Commercial Quotation QT-00014',
    relatedTo: { name: 'Summit Digital Operations OS', type: 'Deal' },
    dueDate: 'Tomorrow',
    time: '10:00 AM',
    priority: 'Medium',
    assignedTo: 'Sarah Chen',
    completed: false,
  },
  {
    id: 'ACT-104',
    type: 'Task',
    subject: 'Audit security compliance document for RFP',
    relatedTo: { name: 'NexGen Systems', type: 'Company' },
    dueDate: 'Oct 02, 2026',
    time: '5:00 PM',
    priority: 'High',
    assignedTo: 'Alex Morgan',
    completed: true,
  },
  {
    id: 'ACT-105',
    type: 'Call',
    subject: 'Quarterly Renewal Check-In with Procurement',
    relatedTo: { name: 'BrightWave Retailers', type: 'Company' },
    dueDate: 'Oct 03, 2026',
    time: '11:30 AM',
    priority: 'Low',
    assignedTo: 'Priya Sharma',
    completed: false,
  },
  {
    id: 'ACT-106',
    type: 'Meeting',
    subject: 'Contract Terms Review with General Counsel',
    relatedTo: { name: 'Enterprise One Multi-Tenant Migration', type: 'Deal' },
    dueDate: 'Oct 05, 2026',
    time: '3:00 PM',
    priority: 'High',
    assignedTo: 'Daniel Kim',
    completed: false,
  },
];

export function CrmActivitiesView() {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'completed'>('open');
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3500);
  };

  const toggleComplete = (id: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === id) {
          const next = !act.completed;
          showToast(`Marked "${act.subject}" as ${next ? 'Completed' : 'Open'}`);
          return { ...act, completed: next };
        }
        return act;
      })
    );
  };

  const filtered = activities.filter((act) => {
    const matchesType = typeFilter === 'all' || act.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'completed'
        ? act.completed
        : !act.completed;
    return matchesType && matchesStatus;
  });

  const openCount = activities.filter((a) => !a.completed).length;
  const callsCount = activities.filter((a) => a.type === 'Call' && !a.completed).length;
  const meetingsCount = activities.filter((a) => a.type === 'Meeting' && !a.completed).length;

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

      {/* ── Summary Stats ────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Pending Tasks</span>
          <span className="text-2xl font-black text-ink mt-1 font-mono">{openCount}</span>
          <span className="text-[11px] text-accent font-medium block mt-1">Requires follow-up</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Scheduled Calls</span>
          <span className="text-2xl font-black text-[#1F7A4D] mt-1 font-mono">{callsCount}</span>
          <span className="text-[11px] text-ink-muted block mt-1">Today &amp; Tomorrow</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Client Meetings</span>
          <span className="text-2xl font-black text-purple-700 mt-1 font-mono">{meetingsCount}</span>
          <span className="text-[11px] text-ink-muted block mt-1">Executive demos</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Completed Interactions</span>
          <span className="text-2xl font-black text-[#1F7A4D] mt-1 font-mono">
            {activities.filter((a) => a.completed).length}
          </span>
          <span className="text-[11px] text-ink-muted block mt-1">Logged in audit trail</span>
        </div>
      </div>

      {/* ── Filter Controls ──────────────────────────── */}
      <div className="card p-3 flex flex-wrap items-center justify-between gap-3 bg-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-ink-muted text-[11px] font-medium mr-1">Activity Type:</span>
          {['all', 'Call', 'Meeting', 'Email', 'Task'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                typeFilter.toLowerCase() === type.toLowerCase()
                  ? 'bg-accent text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-ink-muted hover:text-ink border border-border'
              }`}
            >
              {type === 'Call' ? '📞 Calls' : type === 'Meeting' ? '🤝 Meetings' : type === 'Email' ? '✉️ Emails' : type === 'Task' ? '✅ Tasks' : 'All'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setStatusFilter('open')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              statusFilter === 'open' ? 'bg-neutral-800 text-white' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Open ({openCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              statusFilter === 'completed' ? 'bg-neutral-800 text-white' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              statusFilter === 'all' ? 'bg-neutral-800 text-white' : 'text-ink-muted hover:text-ink'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* ── Activities Timeline List ─────────────────── */}
      <div className="card p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-ink">Upcoming Interaction Queue</h3>
        <div className="divide-y divide-border/60">
          {filtered.map((act) => (
            <div
              key={act.id}
              className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors rounded-lg px-2 ${
                act.completed ? 'opacity-60 bg-neutral-50/50' : 'hover:bg-[#FAF9F5]'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Complete Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleComplete(act.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer mt-0.5 ${
                    act.completed
                      ? 'bg-[#1F7A4D] border-[#1F7A4D] text-white'
                      : 'border-border bg-white hover:border-accent'
                  }`}
                  title={act.completed ? 'Mark incomplete' : 'Mark completed'}
                >
                  {act.completed && '✓'}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink">{act.subject}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                      act.type === 'Call'
                        ? 'bg-blue-100 text-blue-800'
                        : act.type === 'Meeting'
                        ? 'bg-purple-100 text-purple-800'
                        : act.type === 'Email'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {act.type}
                    </span>
                    {act.priority === 'High' && (
                      <span className="badge badge-danger text-[9px]">High Priority</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-ink-muted text-xs mt-1">
                    <span>Target: <strong className="text-ink">{act.relatedTo.name}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-[11px]">{act.dueDate} at {act.time}</span>
                    <span>•</span>
                    <span>Owner: {act.assignedTo}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleComplete(act.id)}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                    act.completed
                      ? 'bg-neutral-100 text-ink-muted border-border hover:bg-neutral-200'
                      : 'bg-[#FAF4F2] text-accent border-[#EBD2CB] hover:bg-accent hover:text-white'
                  }`}
                >
                  {act.completed ? 'Re-open' : '✓ Complete'}
                </button>
              </div>
            </div>
          ))}
        </div>
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
