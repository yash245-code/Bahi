'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  Building2,
  Lock,
  UserCheck,
  CreditCard,
  Receipt,
  LifeBuoy,
  MessageSquare,
  Mail,
  FileText,
  Sparkles,
  ToggleLeft,
  Key,
  Settings,
  ScrollText,
  AlertTriangle,
  Shield,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { getAdminSession, clearAdminSession } from '@/lib/admin-auth';

interface AdminSidebarProps {
  onClose?: () => void;
}

const adminNavGroups = [
  {
    group: 'Executive & Insights',
    links: [
      { href: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Analytics & Reports', icon: BarChart3 },
    ],
  },
  {
    group: 'Tenants & Identities',
    links: [
      { href: '/admin/users', label: 'Users & Impersonation', icon: Users },
      { href: '/admin/organizations', label: 'Organizations (Tenants)', icon: Building2 },
      { href: '/admin/roles', label: 'Roles Matrix', icon: Lock },
      { href: '/admin/team', label: 'Internal Staff & 2FA', icon: UserCheck },
    ],
  },
  {
    group: 'Monetization & Plans',
    links: [
      { href: '/admin/plans', label: 'Subscriptions & Plans', icon: CreditCard },
      { href: '/admin/payments', label: 'Payments & Webhooks', icon: Receipt },
    ],
  },
  {
    group: 'Customer Operations',
    links: [
      { href: '/admin/tickets', label: 'Support Queue & Notes', icon: LifeBuoy },
      { href: '/admin/feedback', label: 'Feedback & Roadmap', icon: MessageSquare },
      { href: '/admin/emails', label: 'Email Templates', icon: Mail },
    ],
  },
  {
    group: 'CMS & Configuration',
    links: [
      { href: '/admin/cms', label: 'CMS & Knowledge Base', icon: FileText },
      { href: '/admin/changelog', label: 'Changelog Releases', icon: Sparkles },
      { href: '/admin/feature-flags', label: 'Feature Flags & Betas', icon: ToggleLeft },
      { href: '/admin/integrations', label: 'API Keys & Webhooks', icon: Key },
    ],
  },
  {
    group: 'System & Security',
    links: [
      { href: '/admin/settings', label: 'System Settings', icon: Settings },
      { href: '/admin/audit-logs', label: 'Audit Logs (Immutable)', icon: ScrollText },
      { href: '/admin/error-logs', label: 'Error Logs & Jobs', icon: AlertTriangle },
      { href: '/admin/security', label: 'Security & Blocklist', icon: Shield },
    ],
  },
];

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const session = getAdminSession();

  return (
    <aside className="w-64 bg-[#090A0F] text-neutral-300 border-r border-white/10 flex flex-col h-screen shrink-0 font-sans select-none z-30">
      {/* Brand & Staff Banner */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0F1118]">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white font-serif font-black text-sm shadow-md shadow-rose-600/30">
            B
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-sm text-white tracking-tight">Bahi Admin</span>
              <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1 py-0.2 rounded uppercase">
                Staff
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono block">Zero-Trust Console</span>
          </div>
        </Link>
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 no-scrollbar">
        {adminNavGroups.map((grp, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold px-2 block">
              {grp.group}
            </span>
            {grp.links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-rose-600/15 text-rose-400 border border-rose-500/30 font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-400' : 'text-neutral-400'}`} />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Profile & Sign Out */}
      <div className="p-3 border-t border-white/10 bg-[#0C0E14] space-y-2 text-xs">
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center justify-center font-bold">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{session?.name || 'Super Administrator'}</p>
            <p className="text-[10px] font-mono text-rose-400 truncate">{session?.role || 'super_admin'}</p>
          </div>
        </div>

        <Link
          href="/admin/login"
          onClick={() => clearAdminSession()}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-300 transition-colors text-xs font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin Session</span>
        </Link>
      </div>
    </aside>
  );
}
