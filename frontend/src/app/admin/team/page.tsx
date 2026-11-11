'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { UserRole, ROLE_LABELS } from '@/lib/permissions';
import { Modal } from '@/components/ui/Modal';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  twoFactorEnforced: boolean;
  twoFactorActive: boolean;
  status: 'Active' | 'Pending';
}

export default function AdminStaffTeamPage() {
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 'st-1', name: 'Aiden Vance', email: 'aiden@bahi.app', role: 'super_admin', twoFactorEnforced: true, twoFactorActive: true, status: 'Active' },
    { id: 'st-2', name: 'Rohan Mehra', email: 'rohan@bahi.app', role: 'super_admin', twoFactorEnforced: true, twoFactorActive: true, status: 'Active' },
    { id: 'st-3', name: 'Karan Patel', email: 'karan@bahi.app', role: 'support_agent', twoFactorEnforced: true, twoFactorActive: true, status: 'Active' },
    { id: 'st-4', name: 'Aditi Sharma', email: 'aditi@bahi.app', role: 'content_editor', twoFactorEnforced: true, twoFactorActive: false, status: 'Pending' },
  ]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('support_agent');

  const handleInviteStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;
    setStaff([
      ...staff,
      {
        id: `st-${Date.now()}`,
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        twoFactorEnforced: true,
        twoFactorActive: false,
        status: 'Pending',
      },
    ]);
    setIsInviteModalOpen(false);
    setInviteEmail('');
    setInviteName('');
  };

  const toggle2FAEnforce = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, twoFactorEnforced: !s.twoFactorEnforced } : s)),
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
            Internal Staff Operations
          </span>
          <h1 className="font-serif text-3xl font-black text-white mt-1">
            Company Staff & 2FA Enforcement
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Internal Staff</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/5 text-neutral-400 font-mono text-[10px] uppercase">
                <th className="p-3.5">Staff Name & Email</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">2FA Policy</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-200">
              {staff.map((s) => (
                <tr key={s.id}>
                  <td className="p-3.5">
                    <span className="font-semibold text-white block">{s.name}</span>
                    <span className="text-[11px] text-neutral-400 font-mono">{s.email}</span>
                  </td>
                  <td className="p-3.5 font-mono text-rose-400">
                    {ROLE_LABELS[s.role]?.label || s.role}
                  </td>
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => toggle2FAEnforce(s.id)}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase transition-colors cursor-pointer ${
                        s.twoFactorEnforced
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-white/5 text-neutral-400'
                      }`}
                    >
                      {s.twoFactorEnforced ? 'Mandatory 2FA (Locked)' : 'Optional'}
                    </button>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        s.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {s.role !== 'super_admin' && (
                      <button
                        type="button"
                        onClick={() => setStaff(staff.filter((item) => item.id !== s.id))}
                        className="text-rose-400 hover:text-rose-300 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Staff Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Internal Staff Member"
        subtitle="Staff members will require 2FA authentication"
      >
        <form onSubmit={handleInviteStaff} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase">Staff Full Name</label>
            <input
              type="text"
              required
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="Sarah Jenkins"
              className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase">Staff Email (@bahi.app)</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="sarah@bahi.app"
              className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase">Staff Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
            >
              <option value="support_agent">Support Agent</option>
              <option value="billing_manager">Billing Manager</option>
              <option value="content_editor">Content Editor</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-white/10 text-neutral-300"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold">
              Send Clearance Invite
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
