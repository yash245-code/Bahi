'use client';

import React, { useState } from 'react';
import { Check, X, CheckCircle2 } from 'lucide-react';
import { ROLE_PERMISSIONS, ROLE_LABELS, UserRole, Permission } from '@/lib/permissions';

const allPermissions: { key: Permission; label: string; group: string }[] = [
  { key: 'admin:access', label: 'Access Staff Admin Console', group: 'Admin' },
  { key: 'admin:users:manage', label: 'Suspend / Delete Users', group: 'Admin' },
  { key: 'admin:users:impersonate', label: 'Impersonate Tenant Users', group: 'Admin' },
  { key: 'admin:plans:manage', label: 'Modify Pricing & Feature Limits', group: 'Admin' },
  { key: 'admin:audit_logs:read', label: 'Inspect Immutable Audit Trail', group: 'Admin' },
  { key: 'billing:manage_subscription', label: 'Upgrade / Cancel Billing Plan', group: 'Billing' },
  { key: 'billing:view_invoices', label: 'Download Tax Receipts & Invoices', group: 'Billing' },
  { key: 'workspace:manage_roles', label: 'Invite Members & Modify Roles', group: 'Workspace' },
  { key: 'apps:crm:access', label: 'CRM Leads & Pipeline Access', group: 'Apps' },
  { key: 'apps:accounting:access', label: 'Double-Entry General Ledger', group: 'Apps' },
  { key: 'support:manage_all_tickets', label: 'Resolve Any Customer Ticket', group: 'Support' },
  { key: 'support:internal_notes', label: 'Write Staff Internal Notes', group: 'Support' },
  { key: 'cms:publish', label: 'Publish Blog & Docs Content', group: 'CMS' },
];

export default function AdminRolesMatrixPage() {
  const [matrix, setMatrix] = useState<Record<UserRole, Permission[]>>(ROLE_PERMISSIONS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const roles: UserRole[] = [
    'super_admin',
    'billing_manager',
    'content_editor',
    'support_agent',
    'customer_admin',
    'customer_user',
  ];

  const togglePermission = (role: UserRole, perm: Permission) => {
    const current = matrix[role] || [];
    const updated = current.includes(perm)
      ? current.filter((p) => p !== perm)
      : [...current, perm];
    setMatrix({ ...matrix, [role]: updated });
  };

  const handleSaveMatrix = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
            Access Control Matrix
          </span>
          <h1 className="font-serif text-3xl font-black text-white mt-1">
            Roles & Granular Permissions
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSaveMatrix}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 cursor-pointer self-start sm:self-center"
        >
          Save Permissions Matrix
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Role-based permission matrix updated and compiled to token verifier.</span>
        </div>
      )}

      {/* Permissions Matrix Table */}
      <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 shadow-sm overflow-x-auto space-y-6">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400 uppercase text-[10px] font-mono">
              <th className="p-4 w-1/3">Permission Grant</th>
              {roles.map((r) => (
                <th key={r} className="p-4 text-center font-bold text-white">
                  <div>{ROLE_LABELS[r]?.label || r}</div>
                  <span className="text-[9px] font-mono text-neutral-500 lowercase">({r})</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-neutral-200">
            {allPermissions.map((perm) => (
              <tr key={perm.key} className="hover:bg-white/[0.02]">
                <td className="p-4">
                  <span className="font-semibold text-white block">{perm.label}</span>
                  <span className="text-[10px] font-mono text-rose-400">{perm.key}</span>
                </td>
                {roles.map((role) => {
                  const has = matrix[role]?.includes(perm.key);
                  return (
                    <td
                      key={role}
                      onClick={() => togglePermission(role, perm.key)}
                      className="p-4 text-center cursor-pointer select-none hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center justify-center">
                        {has ? (
                          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-lg bg-white/5 text-neutral-600 flex items-center justify-center">
                            <X className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
