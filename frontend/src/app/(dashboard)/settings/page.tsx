'use client';

import { useState } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';

const initialModules = [
  { code: 'crm', name: 'CRM', description: 'Lead tracking, opportunities, and pipeline management', enabled: true, icon: '👥' },
  { code: 'sales', name: 'Sales', description: 'Quotations, sales orders, and revenue tracking', enabled: true, icon: '💰' },
  { code: 'inventory', name: 'Inventory', description: 'Product catalog, warehouses, and stock management', enabled: true, icon: '📦' },
  { code: 'accounting', name: 'Accounting', description: 'Invoicing, payments, and financial reporting', enabled: true, icon: '📊' },
  { code: 'hr', name: 'Human Resources', description: 'Employee directory, leave management, and attendance', enabled: true, icon: '🏢' },
  { code: 'projects', name: 'Projects', description: 'Project tracking, task boards, and timesheets', enabled: false, icon: '📋' },
];

const tenantInfo = {
  name: 'Acme Corp',
  slug: 'acme-corp',
  plan: 'Business',
  seats: { used: 12, total: 25 },
  currency: 'USD',
  timezone: 'America/New_York',
  createdAt: 'Jan 15, 2026',
};

const users = [
  { name: 'Yash Rawat', email: 'yash@acme.co', role: 'Admin', status: 'Active', lastLogin: '2 min ago' },
  { name: 'Alex Morgan', email: 'alex@acme.co', role: 'Manager', status: 'Active', lastLogin: '1 hour ago' },
  { name: 'Priya Sharma', email: 'priya@acme.co', role: 'Manager', status: 'Active', lastLogin: '3 hours ago' },
  { name: 'Marcus Rodriguez', email: 'marcus@acme.co', role: 'Member', status: 'Active', lastLogin: 'Yesterday' },
  { name: 'Emily Zhang', email: 'emily@acme.co', role: 'Member', status: 'Invited', lastLogin: '—' },
];

const roleVariant = (s: string) => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    Admin: 'danger', Manager: 'warning', Member: 'info', Viewer: 'neutral',
  };
  return map[s] || 'neutral';
};

export default function SettingsPage() {
  const [modules, setModules] = useState(initialModules);

  const toggleModule = (code: string) => {
    setModules((prev) =>
      prev.map((m) => (m.code === code ? { ...m, enabled: !m.enabled } : m)),
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your tenant configuration, modules, and team.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Tenant Info */}
        <div className="card p-6">
          <h2 className="text-base font-bold text-ink mb-4">Organization</h2>
          <div className="space-y-3">
            {[
              ['Name', tenantInfo.name],
              ['Slug', tenantInfo.slug],
              ['Plan', tenantInfo.plan],
              ['Currency', tenantInfo.currency],
              ['Timezone', tenantInfo.timezone],
              ['Created', tenantInfo.createdAt],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm py-1 border-b border-border/40 last:border-0">
                <span className="text-ink-muted">{label}</span>
                <span className="font-semibold text-ink">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div className="card p-6">
          <h2 className="text-base font-bold text-ink mb-4">Subscription</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-ink-muted">Current Plan</span>
                <StatusBadge label="Business" variant="success" />
              </div>
              <p className="text-xs text-ink-muted/80">CRM + Sales + Inventory + Accounting + HR</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-ink-muted">Seats Used</span>
                <span className="font-semibold text-ink">{tenantInfo.seats.used} / {tenantInfo.seats.total}</span>
              </div>
              <div className="w-full h-2 bg-[#FAF9F5] border border-border/80 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${(tenantInfo.seats.used / tenantInfo.seats.total) * 100}%` }}
                />
              </div>
            </div>
            <button className="btn-secondary w-full mt-2">Manage Billing</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-base font-bold text-ink mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="btn-ghost w-full justify-start text-ink hover:text-ink">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              Export Company Data
            </button>
            <button className="btn-ghost w-full justify-start text-ink hover:text-ink">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              Security Settings
            </button>
            <button className="btn-ghost w-full justify-start text-ink hover:text-ink">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              Notification Preferences
            </button>
            <button className="btn-ghost w-full justify-start text-ink hover:text-ink">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              API Keys & Webhooks
            </button>
          </div>
        </div>
      </div>

      {/* Module Toggles */}
      <h2 className="text-base font-bold text-ink mb-3">Installed Modules</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {modules.map((mod) => (
          <div key={mod.code} className={`card p-5 transition-all ${!mod.enabled ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{mod.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-ink">{mod.name}</h3>
                  <p className="text-xs text-ink-muted mt-0.5">{mod.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleModule(mod.code)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  mod.enabled ? 'bg-accent' : 'bg-[#E6E3DC]'
                }`}
                role="switch"
                aria-checked={mod.enabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    mod.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Team Members */}
      <h2 className="text-base font-bold text-ink mb-3">Team Members</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-[#FAF9F5]">
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Email</th>
              <th className="text-center px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Role</th>
              <th className="text-center px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Last Login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.email} className="hover:bg-[#FAF9F5] transition-colors cursor-pointer">
                <td className="px-5 py-3.5 font-medium text-ink">{user.name}</td>
                <td className="px-5 py-3.5 text-ink-muted">{user.email}</td>
                <td className="px-5 py-3.5 text-center"><StatusBadge label={user.role} variant={roleVariant(user.role)} /></td>
                <td className="px-5 py-3.5 text-center"><StatusBadge label={user.status} variant={user.status === 'Active' ? 'success' : 'neutral'} /></td>
                <td className="px-5 py-3.5 text-right text-ink-muted">{user.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
