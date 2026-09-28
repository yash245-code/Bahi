'use client';

import { StatusBadge } from '@/components/ui/StatusBadge';

const platformTeam = [
  { name: 'Yash Rawat', email: 'yash@bahi.platform', role: 'Super Admin', access: 'Full Access (Root)', status: 'Active', mfa: 'Enforced' },
  { name: 'Elena Rostova', email: 'elena@bahi.platform', role: 'DevOps Lead', access: 'Cluster, Infra & Telemetry', status: 'Active', mfa: 'Enforced' },
  { name: 'Marcus Vance', email: 'marcus@bahi.platform', role: 'Billing Specialist', access: 'Stripe, Invoices & Dunning', status: 'Active', mfa: 'Enforced' },
  { name: 'Sarah Jenkins', email: 'sarah@bahi.platform', role: 'Support Agent', access: 'Tickets, Diagnostics & Tenants', status: 'Active', mfa: 'Enforced' },
  { name: 'Arjun Mehta', email: 'arjun@bahi.platform', role: 'Security & Audit', access: 'Audit Logs & Policy Gates', status: 'Active', mfa: 'Enforced' },
];

export default function TeamAdminPage() {
  return (
    <div className="animate-fade-in space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF4F2] text-accent border border-[#EBD2CB]">
              Access &amp; Governance
            </span>
            <span className="text-xs text-ink-muted">Platform Admin Roles &amp; Permissions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Team &amp; Roles
          </h1>
          <p className="text-sm text-ink-muted mt-0.5">
            Supervise internal service provider staff, assign RBAC platform roles, and manage hardware security keys.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Invite team member modal')}
          className="btn-primary text-xs py-2 cursor-pointer"
        >
          + Invite Platform Admin
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-xs text-ink border-collapse">
          <thead>
            <tr className="bg-[#FAF9F5] border-b border-border text-[11px] uppercase tracking-wider text-ink-muted font-bold">
              <th className="py-3 px-4">Admin Member</th>
              <th className="py-3 px-4">Platform Role</th>
              <th className="py-3 px-4">Scope of Access</th>
              <th className="py-3 px-4">MFA Status</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {platformTeam.map((member) => (
              <tr key={member.email} className="hover:bg-[#FAF9F5]">
                <td className="py-3.5 px-4 font-semibold">
                  <div>{member.name}</div>
                  <div className="text-[11px] text-ink-muted font-mono">{member.email}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF4F2] border border-[#EBD2CB] text-accent">
                    {member.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-ink-muted">{member.access}</td>
                <td className="py-3.5 px-4 font-mono text-[#1F7A4D] font-semibold">{member.mfa}</td>
                <td className="py-3.5 px-4">
                  <StatusBadge label={member.status} variant="success" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
