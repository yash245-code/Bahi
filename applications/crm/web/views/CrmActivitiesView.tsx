'use client';

import { useState, useEffect, useCallback } from 'react';
import { CrmNav } from '../components/CrmNav';
import { CrmAnnouncer } from '../components/CrmAnnouncer';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';
import { crmApi } from '../lib/api-client';

interface ActivityItem {
  id: string;
  type: 'call' | 'meeting' | 'email' | 'task' | 'note' | 'whatsapp';
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
  {
    id: 'ACT-105',
    type: 'whatsapp',
    title: 'WhatsApp Check-in with Marcus Rodriguez',
    relatedTo: { name: 'DataFlow Systems', type: 'company' },
    dueTime: 'Today, 5:00 PM',
    priority: 'Medium',
    status: 'Pending',
    assignee: { name: 'Alex Morgan', avatar: 'AM' },
    description: 'Confirm attendance for technical architecture deep dive.',
  },
];

export function CrmActivitiesView() {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [activeTab, setActiveTab] = useState<'today' | 'overdue' | 'upcoming' | 'completed' | 'all'>('today');
  const [typeFilter, setTypeFilter] = useState<'all' | 'call' | 'meeting' | 'task' | 'whatsapp' | 'email'>('all');
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [activityType, setActivityType] = useState<'call' | 'meeting' | 'task' | 'note' | 'whatsapp'>('call');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [targetName, setTargetName] = useState('Apex Tech Enterprise ERP');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  // Follow-up prompt state
  const [completedActivity, setCompletedActivity] = useState<ActivityItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setAnnouncement(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3500);
  };

  const loadActivities = useCallback(async () => {
    try {
      const data = await crmApi.activities.list({ view: activeTab === 'all' ? undefined : activeTab });
      if (data && data.length > 0) {
        setActivities(
          data.map((a: any) => ({
            id: a.id,
            type: (a.type?.toLowerCase() || 'task') as any,
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

  const handleComplete = async (act: ActivityItem) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === act.id ? { ...a, status: 'Completed', outcome: 'Marked completed by sales rep' } : a))
    );
    showToast(`Activity "${act.title}" marked completed.`);
    setCompletedActivity(act);

    try {
      await crmApi.activities.complete(act.id, 'Completed successfully');
    } catch {
      // Keep optimistic
    }
  };

  const handleScheduleFollowUp = (daysAhead: number, actionTitle: string) => {
    if (!completedActivity) return;

    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + daysAhead);
    const dateStr = followUpDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const newAct: ActivityItem = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      type: 'task',
      title: `${actionTitle}: ${completedActivity.relatedTo.name}`,
      relatedTo: completedActivity.relatedTo,
      dueTime: `Due in ${daysAhead} days (${dateStr})`,
      priority: 'High',
      status: 'Pending',
      assignee: completedActivity.assignee,
      description: `Follow-up to previous interaction: "${completedActivity.title}"`,
    };

    setActivities((prev) => [newAct, ...prev]);
    setCompletedActivity(null);
    showToast(`Follow-up scheduled for ${dateStr}.`);
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
        relatedTo: { name: targetName || 'Opportunity Deal', type: 'deal' },
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
    const matchesTab =
      activeTab === 'today'
        ? a.status === 'Pending' && !a.dueTime.includes('Overdue')
        : activeTab === 'overdue'
        ? a.status === 'Pending' && a.dueTime.includes('Overdue')
        : activeTab === 'completed'
        ? a.status === 'Completed'
        : activeTab === 'upcoming'
        ? a.status === 'Pending' && (a.dueTime.includes('Tomorrow') || a.dueTime.includes('days'))
        : true;

    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    return matchesTab && matchesType;
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

      {/* ── View Filter Tabs & Type Selector ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['today', 'overdue', 'upcoming', 'completed', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              aria-pressed={activeTab === tab}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border capitalize transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent ${
                activeTab === tab
                  ? 'bg-[#20211F] text-white border-[#20211F]'
                  : 'bg-white text-ink-muted border-border hover:bg-neutral-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Activity Type Selector */}
          <select
            aria-label="Filter by activity type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="text-xs p-1.5 rounded-lg border border-border bg-white text-ink focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="all">All Types</option>
            <option value="call">📞 Calls Only</option>
            <option value="meeting">🤝 Meetings Only</option>
            <option value="whatsapp">💬 WhatsApp Only</option>
            <option value="email">✉️ Emails Only</option>
            <option value="task">✅ Tasks Only</option>
          </select>

          <button
            type="button"
            onClick={() => setLogModalOpen(true)}
            aria-label="Log an interaction or task"
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
          >
            + Log Activity
          </button>
        </div>
      </div>

      {/* ── Activities List Queue ── */}
      <div
        role="region"
        aria-label="Activities queue"
        className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs divide-y divide-border/60"
      >
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-ink-muted">
            <p className="text-sm font-semibold text-ink">No tasks or activities in this queue.</p>
            <p className="text-xs mt-1">You are all caught up for this view.</p>
          </div>
        ) : (
          filtered.map((act) => (
            <div
              key={act.id}
              className="p-4 flex items-start justify-between gap-4 hover:bg-neutral-50/80 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5 select-none" aria-hidden="true">
                  {act.type === 'call' ? '📞' : act.type === 'meeting' ? '🤝' : act.type === 'whatsapp' ? '💬' : act.type === 'email' ? '✉️' : '✅'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs font-bold ${act.status === 'Completed' ? 'line-through text-ink-muted' : 'text-ink'}`}>
                      {act.title}
                    </h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 uppercase">
                      {act.type}
                    </span>
                    {act.priority === 'High' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-800 border border-red-200">
                        ⚡ High
                      </span>
                    )}
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
                  type="button"
                  onClick={() => handleComplete(act)}
                  aria-label={`Mark task ${act.title} complete`}
                  className="px-3 py-1 text-xs font-bold rounded-lg bg-[#1F7A4D]/15 text-[#1F7A4D] hover:bg-[#1F7A4D] hover:text-white transition-colors cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#1F7A4D]"
                >
                  ✓ Mark Complete
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── Auto-Follow-Up Modal Prompt ── */}
      {completedActivity && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="followup-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCompletedActivity(null);
          }}
        >
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4 text-ink">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h3 id="followup-dialog-title" className="text-base font-bold text-ink">
                Schedule Next Follow-Up Touchpoint
              </h3>
            </div>
            <p className="text-xs text-ink-muted">
              Great job completing &quot;{completedActivity.title}&quot;! Keep deal momentum going by setting your next step:
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => handleScheduleFollowUp(2, 'Touchpoint Follow-up')}
                className="w-full p-2.5 rounded-xl border border-border bg-[#FAF9F5] hover:bg-white hover:border-accent font-semibold text-left flex justify-between items-center transition-colors"
              >
                <span>Follow up in 2 days (Standard check-in)</span>
                <span className="text-accent font-bold">+2 Days →</span>
              </button>
              <button
                type="button"
                onClick={() => handleScheduleFollowUp(7, 'Weekly Review Call')}
                className="w-full p-2.5 rounded-xl border border-border bg-[#FAF9F5] hover:bg-white hover:border-accent font-semibold text-left flex justify-between items-center transition-colors"
              >
                <span>Weekly progress review call</span>
                <span className="text-accent font-bold">+1 Week →</span>
              </button>
              <button
                type="button"
                onClick={() => handleScheduleFollowUp(14, 'Commercial Follow-up')}
                className="w-full p-2.5 rounded-xl border border-border bg-[#FAF9F5] hover:bg-white hover:border-accent font-semibold text-left flex justify-between items-center transition-colors"
              >
                <span>Commercial follow-up (In 2 weeks)</span>
                <span className="text-accent font-bold">+2 Weeks →</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setCompletedActivity(null)}
                className="px-3 py-1.5 text-xs rounded-lg border border-border text-ink-muted hover:bg-neutral-100"
              >
                Skip Follow-Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Log Activity Modal ── */}
      {logModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="log-activity-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLogModalOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4 text-ink">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 id="log-activity-title" className="text-base font-bold text-ink">
                Log Sales Interaction / Task
              </h3>
              <button
                type="button"
                onClick={() => setLogModalOpen(false)}
                className="text-ink-muted hover:text-ink text-sm p-1 rounded-lg hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Interaction Type</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['call', 'meeting', 'whatsapp', 'task', 'note'] as const).map((t) => (
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
                <label htmlFor="activity-subject-input" className="text-xs font-semibold text-ink block mb-1">
                  Subject / Summary *
                </label>
                <input
                  id="activity-subject-input"
                  type="text"
                  required
                  placeholder="e.g. Budget review call with VP of Engineering"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-[#FAF9F5] text-ink focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="activity-target-input" className="text-xs font-semibold text-ink block mb-1">
                  Related Deal or Account
                </label>
                <input
                  id="activity-target-input"
                  type="text"
                  placeholder="e.g. Apex Tech Enterprise ERP"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-[#FAF9F5] text-ink focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="activity-notes-input" className="text-xs font-semibold text-ink block mb-1">
                  Details &amp; Outcome Notes
                </label>
                <textarea
                  id="activity-notes-input"
                  rows={3}
                  placeholder="Notes, key discussion topics, next steps..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-[#FAF9F5] text-ink focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setLogModalOpen(false)}
                  className="btn-secondary text-xs py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4"
                >
                  Save Activity
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
