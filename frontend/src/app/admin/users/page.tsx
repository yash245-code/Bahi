'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserX,
  UserCheck,
  Key,
  LogIn,
  CheckCircle2,
} from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { startImpersonation, recordAuditEntry } from '@/lib/admin-auth';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  tenantName: string;
  role: string;
  status: 'Active' | 'Suspended';
  twoFactor: boolean;
  lastLogin: string;
}

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<ManagedUser[]>([
    {
      id: 'u-1',
      name: 'Elena Rostova',
      email: 'elena@nexusdynamics.io',
      tenantId: 't-nexus',
      tenantName: 'Nexus Dynamics',
      role: 'customer_admin',
      status: 'Active',
      twoFactor: true,
      lastLogin: '10 mins ago',
    },
    {
      id: 'u-2',
      name: 'Alexandre Dubois',
      email: 'alex@nexusdynamics.io',
      tenantId: 't-nexus',
      tenantName: 'Nexus Dynamics',
      role: 'billing_manager',
      status: 'Active',
      twoFactor: false,
      lastLogin: '2 hours ago',
    },
    {
      id: 'u-3',
      name: 'Vikram Sethi',
      email: 'vikram@apexlogistics.com',
      tenantId: 't-apex',
      tenantName: 'Apex Industrial Logistics',
      role: 'customer_admin',
      status: 'Active',
      twoFactor: true,
      lastLogin: 'Yesterday',
    },
    {
      id: 'u-4',
      name: 'Priya Nambiar',
      email: 'priya@zenithglobal.tech',
      tenantId: 't-zenith',
      tenantName: 'Zenith Global Dynamics',
      role: 'customer_admin',
      status: 'Active',
      twoFactor: true,
      lastLogin: '3 days ago',
    },
    {
      id: 'u-5',
      name: 'Dmitri Volkov',
      email: 'dmitri@suspicious-corp.org',
      tenantId: 't-volk',
      tenantName: 'Volkov Industries',
      role: 'customer_user',
      status: 'Suspended',
      twoFactor: false,
      lastLogin: '14 days ago',
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [isImpersonateModalOpen, setIsImpersonateModalOpen] = useState(false);
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);
  const [successNote, setSuccessNote] = useState('');

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          recordAuditEntry({
            actor: 'admin@bahi.app',
            action: nextStatus === 'Suspended' ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
            target: u.email,
            details: `Status toggled to ${nextStatus}`,
          });
          return { ...u, status: nextStatus };
        }
        return u;
      }),
    );
  };

  const handleImpersonate = (u: ManagedUser) => {
    startImpersonation('admin@bahi.app', {
      email: u.email,
      name: u.name,
      tenantId: u.tenantId,
      tenantName: u.tenantName,
    });
    router.push('/dashboard');
  };

  const handleResetPassword = () => {
    if (!selectedUser) return;
    recordAuditEntry({
      actor: 'admin@bahi.app',
      action: 'ADMIN_PASSWORD_RESET_DISPATCHED',
      target: selectedUser.email,
      details: 'Sent secure temporary one-time credential URL',
    });
    setSuccessNote(`Temporary password link dispatched to ${selectedUser.email}`);
    setIsResetPassModalOpen(false);
    setTimeout(() => setSuccessNote(''), 3000);
  };

  const columns: Column<ManagedUser>[] = [
    {
      key: 'name',
      header: 'User Identity',
      sortable: true,
      render: (u) => (
        <div>
          <div className="font-semibold text-white">{u.name}</div>
          <div className="text-[11px] text-neutral-400 font-mono">{u.email}</div>
        </div>
      ),
    },
    {
      key: 'tenantName',
      header: 'Tenant Workspace',
      sortable: true,
      render: (u) => (
        <div>
          <span className="font-medium text-white">{u.tenantName}</span>
          <span className="text-[10px] text-neutral-500 font-mono block">{u.tenantId}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      sortable: true,
      render: (u) => <span className="font-mono text-xs text-rose-400">{u.role}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (u) => (
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
            u.status === 'Active'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {u.status}
        </span>
      ),
    },
    {
      key: 'twoFactor',
      header: '2FA Auth',
      render: (u) => (
        <span
          className={`text-[11px] font-mono ${
            u.twoFactor ? 'text-emerald-400' : 'text-neutral-500'
          }`}
        >
          {u.twoFactor ? '✓ Enabled' : 'Disabled'}
        </span>
      ),
    },
    { key: 'lastLogin', header: 'Last Login', sortable: true },
    {
      key: 'actions',
      header: 'Admin Actions',
      className: 'text-right',
      render: (u) => (
        <div className="flex items-center justify-end gap-2">
          {/* Impersonate button */}
          <button
            type="button"
            onClick={() => {
              setSelectedUser(u);
              setIsImpersonateModalOpen(true);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-mono text-[11px] transition-colors"
            title="Login as User"
          >
            <LogIn className="w-3 h-3" />
            <span>Impersonate</span>
          </button>

          {/* Reset password */}
          <button
            type="button"
            onClick={() => {
              setSelectedUser(u);
              setIsResetPassModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-neutral-400"
            title="Reset Password"
          >
            <Key className="w-3.5 h-3.5" />
          </button>

          {/* Suspend / Reactivate */}
          <button
            type="button"
            onClick={() => toggleUserStatus(u.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              u.status === 'Active'
                ? 'border-rose-500/20 text-rose-400 hover:bg-rose-500/10'
                : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
            }`}
            title={u.status === 'Active' ? 'Suspend User' : 'Reactivate User'}
          >
            {u.status === 'Active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
            Identity & Authorization
          </span>
          <h1 className="font-serif text-3xl font-black text-white mt-1">
            Users Management & Impersonation
          </h1>
        </div>
      </div>

      {successNote && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successNote}</span>
        </div>
      )}

      {/* Users DataTable */}
      <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 space-y-4">
        <DataTable
          data={users}
          columns={columns}
          searchPlaceholder="Search users by name, email, or tenant..."
          exportFilename="users_list.csv"
        />
      </div>

      {/* Impersonation Confirmation Modal */}
      <Modal
        isOpen={isImpersonateModalOpen}
        onClose={() => setIsImpersonateModalOpen(false)}
        title="Confirm User Impersonation"
        subtitle="Time-limited audit logged staff override"
      >
        {selectedUser && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
              <span className="font-bold block">WARNING: You are about to log in as:</span>
              <p className="font-mono text-white text-sm">
                {selectedUser.name} ({selectedUser.email})
              </p>
              <p className="text-[11px] text-amber-300">
                Workspace: {selectedUser.tenantName} ({selectedUser.tenantId})
              </p>
            </div>

            <p className="text-neutral-400 leading-relaxed">
              This session is valid for 60 minutes. An immutable audit trail entry will be created
              binding your admin account (admin@bahi.app) to any actions performed inside this workspace.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsImpersonateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleImpersonate(selectedUser)}
                className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold cursor-pointer"
              >
                Launch Impersonated Session
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Password Reset Modal */}
      <Modal
        isOpen={isResetPassModalOpen}
        onClose={() => setIsResetPassModalOpen(false)}
        title="Admin Reset Password"
        subtitle="Dispatch one-time reset token"
      >
        {selectedUser && (
          <div className="space-y-4 text-xs">
            <p className="text-neutral-300">
              Generate a temporary cryptographic reset token for <strong>{selectedUser.email}</strong>.
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsResetPassModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetPassword}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold cursor-pointer"
              >
                Dispatch Reset Email
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
