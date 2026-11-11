'use client';

import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Users,
  Key,
  Trash2,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function CustomerSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'team' | 'api' | 'danger'>('profile');

  // Profile State
  const [profile, setProfile] = useState({
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena@nexusdynamics.io',
    phone: '+1 (555) 234-8901',
    role: 'Organization Owner (Customer Admin)',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [totpCode, setTotpCode] = useState('');

  // Notification Preferences
  const [notifs, setNotifs] = useState({
    emailInvoices: true,
    emailDealWon: true,
    emailStockLow: true,
    browserPush: false,
    weeklyDigest: true,
  });

  // Team Members
  const [team, setTeam] = useState([
    { id: '1', name: 'Elena Rostova', email: 'elena@nexusdynamics.io', role: 'Organization Owner', status: 'Active' },
    { id: '2', name: 'Alexandre Dubois', email: 'alex@nexusdynamics.io', role: 'Billing Manager', status: 'Active' },
    { id: '3', name: 'Sarah Chen', email: 'sarah@nexusdynamics.io', role: 'Customer Member', status: 'Active' },
    { id: '4', name: 'Karan Mehra', email: 'karan@nexusdynamics.io', role: 'Support Agent', status: 'Invited' },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Customer Member');

  // Scoped API Keys
  const [apiKeys, setApiKeys] = useState([
    { id: 'key_1', name: 'Production Webhook Dispatcher', prefix: 'bahi_live_8a92f...', created: '2026-10-12', lastUsed: '2 mins ago' },
    { id: 'key_2', name: 'Zapier Automation Integration', prefix: 'bahi_live_410bc...', created: '2026-09-04', lastUsed: 'Yesterday' },
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Danger Zone Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setTeam([
      ...team,
      {
        id: `m-${Date.now()}`,
        name: inviteEmail.split('@')[0] || 'Member',
        email: inviteEmail,
        role: inviteRole,
        status: 'Invited',
      },
    ]);
    setInviteEmail('');
  };

  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) return;
    const generatedPrefix = `bahi_live_${Math.random().toString(36).substring(2, 8)}...`;
    setApiKeys([
      ...apiKeys,
      {
        id: `key_${Date.now()}`,
        name: newKeyName,
        prefix: generatedPrefix,
        created: 'Just now',
        lastUsed: 'Never',
      },
    ]);
    setNewKeyName('');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-bold">
          Account Administration
        </span>
        <h1 className="font-serif text-3xl font-black text-ink dark:text-white mt-1">
          Workspace Settings & Security
        </h1>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-3 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'security', label: 'Password & 2FA', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'team', label: 'Team & Roles', icon: Users },
          { id: 'api', label: 'API Keys & Scopes', icon: Key },
          { id: 'danger', label: 'Account Deletion', icon: Trash2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-accent text-white shadow-xs'
                  : 'text-neutral-500 hover:text-ink dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl p-8 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-6 max-w-3xl">
          <div className="border-b border-black/5 dark:border-white/5 pb-4">
            <h3 className="font-serif font-bold text-xl text-ink dark:text-white">Profile Information</h3>
            <p className="text-xs text-neutral-500 mt-1">Update your personal account details and communication address.</p>
          </div>

          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase">First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs text-ink dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase">Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs text-ink dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase">Work Email</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-white/5 text-xs text-neutral-400 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs text-ink dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-500 uppercase">Assigned System Role</label>
              <input
                type="text"
                disabled
                value={profile.role}
                className="w-full px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-white/5 text-xs text-neutral-400 font-mono cursor-not-allowed"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold shadow-md shadow-accent/20 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Security & 2FA */}
      {activeTab === 'security' && (
        <div className="rounded-3xl p-8 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-8 max-w-3xl">
          <div className="border-b border-black/5 dark:border-white/5 pb-4">
            <h3 className="font-serif font-bold text-xl text-ink dark:text-white">Security & Authenticator</h3>
            <p className="text-xs text-neutral-500 mt-1">Manage password changes and mandatory two-factor authentication.</p>
          </div>

          {/* 2FA Banner */}
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-ink dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                Two-Factor Authentication (TOTP)
              </h4>
              <p className="text-xs text-neutral-500 max-w-md">
                Require a time-based one-time password from Google Authenticator, 1Password, or YubiKey upon login.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (twoFactorEnabled) setTwoFactorEnabled(false);
                else setIs2FAModalOpen(true);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                twoFactorEnabled
                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  : 'bg-accent text-white shadow-md shadow-accent/20'
              }`}
            >
              {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>

          {/* Change password form */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-ink dark:text-white">Change Account Password</h4>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs text-ink dark:text-white"
              />
              <input
                type="password"
                placeholder="New Password (min 8 characters)"
                className="w-full px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs text-ink dark:text-white"
              />
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold text-xs cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'notifications' && (
        <div className="rounded-3xl p-8 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-6 max-w-3xl">
          <div className="border-b border-black/5 dark:border-white/5 pb-4">
            <h3 className="font-serif font-bold text-xl text-ink dark:text-white">Notification Preferences</h3>
            <p className="text-xs text-neutral-500 mt-1">Control which transactional events send email or push pings.</p>
          </div>

          <div className="space-y-4 text-xs">
            {[
              { key: 'emailInvoices', label: 'Payment Invoices & Receipts', desc: 'Receive PDF receipts when customer invoices settle via Stripe.' },
              { key: 'emailDealWon', label: 'High-Value Deal Won Alerts', desc: 'Get pings when deals cross the Closed Won threshold.' },
              { key: 'emailStockLow', label: 'Inventory Reorder Notifications', desc: 'Notify when warehouse stock reaches min safety threshold.' },
              { key: 'browserPush', label: 'Browser Web Push Notifications', desc: 'Real-time desktop desktop notifications during working hours.' },
              { key: 'weeklyDigest', label: 'Weekly Executive Performance Digest', desc: 'Monday morning email summarizing GMV, sales pipeline, and cash flow.' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5"
              >
                <div>
                  <h4 className="font-semibold text-ink dark:text-white">{item.label}</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={(notifs as any)[item.key]}
                  onChange={(e) => setNotifs({ ...notifs, [item.key]: e.target.checked })}
                  className="w-4 h-4 rounded text-accent cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Team & Roles */}
      {activeTab === 'team' && (
        <div className="rounded-3xl p-8 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4">
            <div>
              <h3 className="font-serif font-bold text-xl text-ink dark:text-white">Team Members & Invitations</h3>
              <p className="text-xs text-neutral-500 mt-1">Manage organization members, send invites, and assign RBAC roles.</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-500">
              {team.length} of 15 Seats Used (Growth Plan)
            </span>
          </div>

          {/* Invite form */}
          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="newteam@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs text-ink dark:text-white"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs text-ink dark:text-white"
            >
              <option>Customer Member</option>
              <option>Billing Manager</option>
              <option>Support Agent</option>
              <option>Organization Owner</option>
            </select>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-accent text-white text-xs font-semibold cursor-pointer"
            >
              Send Invitation
            </button>
          </form>

          {/* Members Table */}
          <div className="overflow-x-auto rounded-2xl border border-black/5 dark:border-white/5">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5 bg-neutral-50 dark:bg-white/[0.02] text-neutral-400 font-semibold uppercase text-[10px]">
                  <th className="p-3.5">Member</th>
                  <th className="p-3.5">Assigned Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 text-ink dark:text-neutral-200">
                {team.map((m) => (
                  <tr key={m.id}>
                    <td className="p-3.5">
                      <div className="font-semibold text-ink dark:text-white">{m.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{m.email}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-xs">{m.role}</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          m.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {m.role !== 'Organization Owner' && (
                        <button
                          type="button"
                          onClick={() => setTeam(team.filter((t) => t.id !== m.id))}
                          className="text-rose-500 hover:underline text-xs"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: API Keys */}
      {activeTab === 'api' && (
        <div className="rounded-3xl p-8 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-6">
          <div className="border-b border-black/5 dark:border-white/5 pb-4">
            <h3 className="font-serif font-bold text-xl text-ink dark:text-white">API Keys & Webhook Scopes</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Generate scoped API secrets for programmatic CRM queries and warehouse integrations.
            </p>
          </div>

          {/* New key form */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g. ERP Zapier Webhook Sync"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs text-ink dark:text-white"
            />
            <button
              type="button"
              onClick={handleCreateApiKey}
              className="px-5 py-2 rounded-xl bg-accent text-white text-xs font-semibold cursor-pointer"
            >
              Generate New Key
            </button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((k) => (
              <div
                key={k.id}
                className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-ink dark:text-white">{k.name}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono mt-0.5">
                    <span>Key Prefix: {k.prefix}</span>
                    <span>Created: {k.created}</span>
                    <span>Last Used: {k.lastUsed}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCopiedKey(k.id);
                      setTimeout(() => setCopiedKey(null), 1500);
                    }}
                    className="p-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 text-neutral-500"
                    title="Copy Key"
                  >
                    {copiedKey === k.id ? <span className="text-[10px] text-emerald-500 font-bold px-1">Copied</span> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setApiKeys(apiKeys.filter((item) => item.id !== k.id))}
                    className="p-2 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/5"
                    title="Revoke Key"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Danger Zone */}
      {activeTab === 'danger' && (
        <div className="rounded-3xl p-8 bg-rose-500/5 border border-rose-500/20 shadow-sm space-y-6 max-w-3xl">
          <div className="border-b border-rose-500/10 pb-4">
            <h3 className="font-serif font-bold text-xl text-rose-500">Danger Zone: Account Deletion</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Irreversible actions that purge tenant records, active subscriptions, and customer data.
            </p>
          </div>

          <div className="space-y-4 text-xs text-neutral-700 dark:text-neutral-300">
            <p>
              Deleting your tenant account will immediately cancel any active Stripe billing subscription,
              revoke all team member invites, and schedule all database tables for permanent cryptographic wipe.
            </p>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs shadow-md shadow-rose-600/20 cursor-pointer"
            >
              Initiate Tenant Deletion Request
            </button>
          </div>
        </div>
      )}

      {/* 2FA Enable Modal */}
      <Modal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        title="Enable Two-Factor Authentication"
        subtitle="Scan the QR code with your authenticator application"
      >
        <div className="space-y-4 text-center">
          <div className="w-40 h-40 mx-auto bg-neutral-100 dark:bg-white/10 rounded-2xl flex items-center justify-center font-mono text-xs text-neutral-500 border border-black/10 dark:border-white/10">
            [ TOTP QR Code ]
          </div>
          <p className="text-xs text-neutral-400">
            Or manually enter secret key: <code className="text-accent font-bold">BAHI-AUTH-9824-XK</code>
          </p>
          <div className="space-y-1 text-left">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase">Enter 6-Digit Code</label>
            <input
              type="text"
              maxLength={6}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              placeholder="123456"
              className="w-full text-center text-lg font-mono font-bold tracking-widest px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029]"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setTwoFactorEnabled(true);
              setIs2FAModalOpen(false);
            }}
            className="w-full py-2.5 rounded-xl bg-accent text-white text-xs font-semibold"
          >
            Verify & Activate 2FA
          </button>
        </div>
      </Modal>

      {/* Deletion Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Organization Deletion"
        subtitle="This action cannot be undone"
      >
        <div className="space-y-4 text-xs">
          <p className="text-rose-500 font-semibold">
            Please type <code className="bg-rose-500/10 px-1 py-0.5 rounded">DELETE NEXUS DYNAMICS</code> to confirm.
          </p>
          <input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="DELETE NEXUS DYNAMICS"
            className="w-full px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/5 text-xs text-ink dark:text-white"
          />
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleteConfirmation !== 'DELETE NEXUS DYNAMICS'}
              onClick={() => {
                alert('Account scheduled for legal deletion.');
                setIsDeleteModalOpen(false);
              }}
              className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold disabled:opacity-30"
            >
              Permanently Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
