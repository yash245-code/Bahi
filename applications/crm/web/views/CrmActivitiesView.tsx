'use client';

import { useState, useEffect, useCallback } from 'react';
import { CrmNav } from '../components/CrmNav';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';
import { crmApi } from '../lib/api-client';

interface ActivityItem {
  id: string;
  type: 'call' | 'meeting' | 'email' | 'task' | 'note';
  title: string;
  relatedTo: { name: string; type: 'deal' | 'lead' | 'contact' | 'company' };
  dueTime: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed';
  assignee: { name: string; avatar: string };
  description?: string;
  outcome?: string;
}

const initialActivities: ActivityItem[] = [
  {
    id: 'ACT-101',
    type: 'call',
    title: 'Commercial Terms Review with David Chen',
    relatedTo: { name: 'Apex Tech Enterprise ERP', type: 'deal' },
    dueTime: 'Today, 2:30 PM',
    priority: 'High',
    status: 'Pending',
    assignee: { name: 'Alex Morgan', avatar: 'AM' },
    description: 'Review 10% volume discount and 3-year agreement terms.',
  },
  {
    id: 'ACT-102',
    type: 'meeting',
    title: 'Executive Stakeholder Demo with Elena Rostova',
    relatedTo: { name: 'Nordic Logistics Dispatch', type: 'deal' },
    dueTime: 'Today, 4:00 PM',
    priority: 'High',
    status: 'Pending',
    assignee: { name: 'Priya Sharma', avatar: 'PS' },
    description: 'Walkthrough of real-time inventory multi-warehouse allocation module.',
  },
  {
    id: 'ACT-103',
    type: 'task',
    title: 'Send Security Questionnaire & SOC2 Report',
    relatedTo: { name: 'Vertex Health Clinical Engine', type: 'deal' },
    dueTime: 'Overdue (Yesterday)',
    priority: 'High',
    status: 'Pending',
    assignee: { name: 'Alex Morgan', avatar: 'AM' },
    description: 'Deliver compliance whitepaper for HIPAA security review.',
  },
  {
    id: 'ACT-104',
    type: 'email',
    title: 'Follow-up regarding custom warehouse pricing quote',
    relatedTo: { name: 'Marcus Vance', type: 'lead' },
    dueTime: 'Tomorrow, 10:00 AM',
    priority: 'Medium',
    status: 'Pending',
    assignee: { name: 'Daniel Kim', avatar: 'DK' },
  },
];

export function CrmActivitiesView() {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [activeTab, setActiveTab] = useState<'today' | 'overdue' | 'upcoming' | 'completed' | 'all'>('today');
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [activityType, setActivityType] = useState<'call' | 'meeting' | 'task' | 'note'>('call');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3500);
  };

  const loadActivities = useCallback(async () => {
    try {
      const data = await crmApi.activities.list({ view: activeTab === 'all' ? undefined : activeTab });
      if (data && data.length > 0) {
        setActivities(
          data.map((a: any) => ({
            id: a.id,
            type: a.type?.toLowerCase() || 'task',
            title: a.subject,
            relatedTo: { name: a.relatedName || 'Related Record', type: a.relatedType || 'deal' },
            dueTime: a.dueDateTime ? new Date(a.dueDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Flexible',
            priority: a.priority === 'URGENT' || a.priority === 'HIGH' ? 'High' : 'Medium',
            status: a.status === 'COMPLETED' ? 'Completed' : 'Pending',
            assignee: {
              name: a.assignee ? `${a.assignee.firstName} ${a.assignee.lastName || ''}`.trim() : 'Sales Rep',
              avatar: a.assignee ? `${a.assignee.firstName[0]}${a.assignee.lastName?.[0] || ''}` : 'SR',
            },
            description: a.description,
            outcome: a.outcome,
          }))
        );
      }
    } catch {
      // Keep initialActivities fallback
    }
  }, [activeTab]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handleComplete = async (id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Completed', outcome: 'Marked completed by sales rep' } : a))
    );
    showToast('Activity marked completed');

    try {
      await crmApi.activities.complete(id, 'Completed successfully');
      loadActivities();
    } catch {
      // Keep optimistic
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;

    try {
      await crmApi.activities.create({
        type: activityType.toUpperCase() as any,
        subject,
        description,
        relatedType: 'deal',
        relatedId: '00000000-0000-0000-0000-000000000000',
      });
      showToast(`${activityType.toUpperCase()} logged`);
      loadActivities();
    } catch {
      const created: ActivityItem = {
        id: `ACT-${Date.now().toString().slice(-3)}`,
        type: activityType,
        title: subject,
        relatedTo: { name: 'Opportunity Deal', type: 'deal' },
        dueTime: 'Today',
        priority: 'High',
        status: 'Pending',
        assignee: { name: 'You', avatar: 'ME' },
        description,
      };
      setActivities((prev) => [created, ...prev]);
      showToast(`Logged activity: ${subject}`);
    } finally {
      setLogModalOpen(false);
      setSubject('');
      setDescription('');
    }
  };

  const filtered = activities.filter((a) => {
    if (activeTab === 'today') return a.status === 'Pending' && !a.dueTime.includes('Overdue');
    if (activeTab === 'overdue') return a.status === 'Pending' && a.dueTime.includes('Overdue');
    if (activeTab === 'completed') return a.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6">
      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
        totalPipelineValue={`$272,000`}
        activeDealsCount={11}
      />

      {/* ── View Filter Tabs & Quick Log Button ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['today', 'overdue', 'upcoming', 'completed', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border capitalize transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#20211F] text-white border-[#20211F]'
                  : 'bg-white text-ink-muted border-border hover:bg-neutral-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => setLogModalOpen(true)}
          className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-[#853526] transition-colors cursor-pointer shadow-xs"
        >
          + Log Activity / Task
        </button>
      </div>

      {/* ── Activities List Queue ── */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs divide-y divide-border/60">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-ink-muted">
            <p className="text-sm font-semibold">No tasks or activities in this queue.</p>
            <p className="text-xs mt-1">You are all caught up for this view.</p>
          </div>
        ) : (
          filtered.map((act) => (
            <div
              key={act.id}
              className="p-4 flex items-start justify-between gap-4 hover:bg-neutral-50/80 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">
                  {act.type === 'call' ? '📞' : act.type === 'meeting' ? '🤝' : act.type === 'email' ? '✉️' : '✅'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs font-bold ${act.status === 'Completed' ? 'line-through text-ink-muted' : 'text-ink'}`}>
                      {act.title}
                    </h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 uppercase">
                      {act.type}
                    </span>
                  </div>
                  {act.description && (
                    <p className="text-[11px] text-ink-muted mt-0.5 max-w-xl">
                      {act.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-ink-muted">
                    <span>Target: <strong className="text-ink">{act.relatedTo.name}</strong></span>
                    <span>Due: <strong className={act.dueTime.includes('Overdue') ? 'text-red-700 font-bold' : 'text-ink'}>{act.dueTime}</strong></span>
                    <span>Assigned: <strong className="text-ink">{act.assignee.name}</strong></span>
                  </div>
                </div>
              </div>

              {act.status !== 'Completed' && (
                <button
                  onClick={() => handleComplete(act.id)}
                  className="px-3 py-1 text-xs font-bold rounded-lg bg-[#1F7A4D]/15 text-[#1F7A4D] hover:bg-[#1F7A4D] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  ✓ Mark Complete
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── Log Activity Modal ── */}
      {logModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-ink">Log Sales Interaction / Task</h3>
            <form onSubmit={handleCreateActivity} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Interaction Type</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['call', 'meeting', 'task', 'note'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setActivityType(t)}
                      className={`p-2 rounded-xl text-xs font-bold capitalize border cursor-pointer ${
                        activityType === t
                          ? 'bg-[#20211F] text-white border-[#20211F]'
                          : 'bg-white text-ink-muted border-border'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Follow-up phone call regarding revised quote"
                  value={subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-border bg-white text-ink"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Notes & Details</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  placeholder="Key discussion points, objections, or follow-up commitments..."
                  className="w-full text-xs p-2 rounded-xl border border-border bg-white text-ink"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLogModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-border text-ink-muted hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-[#853526]"
                >
                  Save Entry
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
