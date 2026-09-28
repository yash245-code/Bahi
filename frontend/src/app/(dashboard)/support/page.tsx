'use client';

import { StatusBadge } from '@/components/ui/StatusBadge';

const tickets = [
  { id: 'TCK-4821', tenant: 'Apex Health Solutions', subject: 'Custom CSV ledger import failed with encoding error', priority: 'Urgent', slaCountdown: '14 min left', assignee: 'DevOps (Elena R.)', status: 'In Progress' },
  { id: 'TCK-4818', tenant: 'Starlight Retailers', subject: 'Invoice retry failed after updating credit card credentials', priority: 'High', slaCountdown: '45 min left', assignee: 'Billing (Yash R.)', status: 'Open' },
  { id: 'TCK-4812', tenant: 'Nexus Logistics Global', subject: 'Request for webhook event rate limit increase to 2,000/s', priority: 'Medium', slaCountdown: '3 hours left', assignee: 'Platform Arch', status: 'Review' },
  { id: 'TCK-4809', tenant: 'Acme Corp', subject: 'Question regarding new AI reconciliation feature flag rollout', priority: 'Low', slaCountdown: 'Within SLA', assignee: 'Support Desk', status: 'Resolved' },
];

export default function SupportAdminPage() {
  return (
    <div className="animate-fade-in space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF4F2] text-accent border border-[#EBD2CB]">
              Support &amp; Incident Desk
            </span>
            <span className="text-xs text-ink-muted">14 Open Platform Tickets • 2 Urgent SLA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Support &amp; Tickets
          </h1>
          <p className="text-sm text-ink-muted mt-0.5">
            Supervise tenant support inquiries, SLA deadlines, ticket assignments, and escalated platform bugs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('New ticket created.')}
          className="btn-primary text-xs py-2 cursor-pointer"
        >
          + Create Incident Ticket
        </button>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="text-sm font-bold text-ink">Active Priority Queue</h3>
        <div className="divide-y divide-border/60">
          {tickets.map((t) => (
            <div key={t.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-accent">{t.id}</span>
                  <span className="font-bold text-ink">{t.tenant}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    t.priority === 'Urgent' ? 'bg-red-100 text-red-700' : t.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {t.priority}
                  </span>
                  <span className="text-[11px] font-mono text-ink-muted">SLA: {t.slaCountdown}</span>
                </div>
                <p className="text-xs text-ink-muted">{t.subject}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[11px] text-ink-muted font-medium">{t.assignee}</span>
                <StatusBadge
                  label={t.status}
                  variant={t.status === 'Resolved' ? 'success' : t.priority === 'Urgent' ? 'danger' : 'warning'}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
