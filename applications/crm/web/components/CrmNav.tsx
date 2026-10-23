'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CrmOmnibarModal } from './CrmOmnibarModal';
import { CrmShortcutsModal } from './CrmShortcutsModal';
import { CrmDataCenterModal } from './CrmDataCenterModal';
import { CrmThemeToggle } from './CrmThemeToggle';
import { CrmQuickNoteModal } from './CrmQuickNoteModal';

interface CrmNavProps {
  onNewDeal?: () => void;
  onNewLead?: () => void;
  totalPipelineValue?: string;
  activeDealsCount?: number;
}

const navTabs = [
  {
    name: 'Dashboard',
    href: '/crm',
    badge: null,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
  {
    name: 'Deals Pipeline',
    href: '/crm/deals',
    badge: '11',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.539.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.378-1.007.917-1.096A48.32 48.32 0 0 1 12 3Z" />
      </svg>
    ),
  },
  {
    name: 'Leads & Intake',
    href: '/crm/leads',
    badge: '4 New',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.765Z" />
      </svg>
    ),
  },
  {
    name: 'Companies',
    href: '/crm/companies',
    badge: null,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    name: 'Contacts',
    href: '/crm/contacts',
    badge: null,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    name: 'Activities',
    href: '/crm/activities',
    badge: null,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
      </svg>
    ),
  },
  {
    name: 'Quotes',
    href: '/crm/quotes',
    badge: null,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    name: 'Sequences',
    href: '/crm/sequences',
    badge: null,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
      </svg>
    ),
  },
  {
    name: 'Products',
    href: '/crm/products',
    badge: null,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
  },
  {
    name: 'Reports',
    href: '/crm/analytics',
    badge: null,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    name: 'Settings',
    href: '/crm/settings',
    badge: null,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.6 6.6 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

interface CrmNavNotification {
  id: string;
  type: 'approval' | 'decay' | 'lead';
  title: string;
  subtitle: string;
  timestamp: string;
  actionPayload?: {
    discount?: number;
    rep?: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'READ';
}

const initialNotifications: CrmNavNotification[] = [
  {
    id: 'NOTIF-1',
    type: 'approval',
    title: 'NexGen Cloud ERP Suite',
    subtitle: '18% discount requested by Alex Morgan (Deal: $15,000)',
    timestamp: '10m ago',
    actionPayload: { discount: 18, rep: 'Alex Morgan' },
    status: 'PENDING',
  },
  {
    id: 'NOTIF-2',
    type: 'approval',
    title: 'DataFlow Multi-Warehouse Sync',
    subtitle: '12% discount requested by Priya Sharma (Deal: $5,400)',
    timestamp: '42m ago',
    actionPayload: { discount: 12, rep: 'Priya Sharma' },
    status: 'PENDING',
  },
  {
    id: 'NOTIF-3',
    type: 'decay',
    title: 'Stalled Deal Alert: Pacific Rim Logistics',
    subtitle: 'Proposal Sent stage untouched for 14 days ($18,500)',
    timestamp: '2h ago',
    status: 'PENDING',
  },
  {
    id: 'NOTIF-4',
    type: 'lead',
    title: 'High-Intent Inbound: Sarah Chen',
    subtitle: 'Score 92 • Enterprise trial request from HyperGrowth AI',
    timestamp: '3h ago',
    status: 'READ',
  },
];

export function CrmNav({
  onNewDeal,
  onNewLead,
  totalPipelineValue = '$272,000',
  activeDealsCount = 11,
}: CrmNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [omnibarOpen, setOmnibarOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [quickNoteOpen, setQuickNoteOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<CrmNavNotification[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bahi-crm-notifications');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return initialNotifications;
  });
  const [density, setDensity] = useState<'normal' | 'compact'>('normal');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => n.status === 'PENDING').length;

  const handleApproval = (id: string, decision: 'APPROVED' | 'REJECTED') => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, status: decision } : n));
      try {
        localStorage.setItem('bahi-crm-notifications', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setToastMessage(`Discount request ${decision === 'APPROVED' ? 'approved' : 'rejected'} successfully.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.status === 'PENDING' ? { ...n, status: 'READ' as const } : n));
      try {
        localStorage.setItem('bahi-crm-notifications', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setToastMessage('All notifications marked as read.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initialize and load density from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bahi-crm-density');
      if (saved === 'compact') setDensity('compact');
    } catch (_) {}
  }, []);

  const toggleDensity = () => {
    const next = density === 'normal' ? 'compact' : 'normal';
    setDensity(next);
    try {
      localStorage.setItem('bahi-crm-density', next);
    } catch (_) {}
    window.dispatchEvent(new CustomEvent('bahi-crm-density-change', { detail: next }));
    showToast(`Table density switched to ${next}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3000);
  };

  // Global Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.tagName === 'SELECT' ||
        (activeEl as HTMLElement)?.isContentEditable;

      // Cmd+K or Ctrl+K for Omnibar
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOmnibarOpen((prev) => !prev);
        return;
      }

      if (isInput) return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      } else if (e.key === 'd' || e.key === 'D') {
        if (onNewDeal) {
          e.preventDefault();
          onNewDeal();
        }
      } else if (e.key === 'l' || e.key === 'L') {
        if (onNewLead) {
          e.preventDefault();
          onNewLead();
        }
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setQuickNoteOpen(true);
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('bahi-theme', 'light');
        } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('bahi-theme', 'dark');
        }
        window.dispatchEvent(new Event('bahi-theme-change'));
        showToast(isDark ? 'Switched to Light mode' : 'Switched to Dark mode');
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        toggleDensity();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, onNewDeal, onNewLead, density]);

  const recentItems = [
    { title: 'TechStart Enterprise OS', href: '/crm/deals', tag: 'Deal • $3,200' },
    { title: 'Sarah Chen', href: '/crm/leads', tag: 'Lead • HOT (Score: 92)' },
    { title: 'Vortex Global Accounting', href: '/crm/deals', tag: 'Deal • $34,000' },
    { title: 'DataFlow Systems', href: '/crm/companies', tag: 'Account • 48 Users' },
  ];

  return (
    <header className="space-y-4 pb-2 border-b border-border dark:border-[#2E302A] relative" role="banner">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#141513] text-white px-4 py-2.5 rounded-xl shadow-xl border border-neutral-700 flex items-center gap-2 text-xs font-semibold animate-slide-down">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── WCAG Skip to Main Content Link ──────────── */}
      <a
        href="#crm-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-xl focus:shadow-2xl focus:font-bold focus:outline-hidden"
      >
        Skip to CRM main content
      </a>

      {/* ─── Top Control Header ────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF4F2] dark:bg-[#2A1B16] text-accent border border-[#EBD2CB] dark:border-[#5A2E22] font-mono">
              CRM &amp; Revenue Ops
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-[#FAF9F5] dark:bg-neutral-800 border border-border dark:border-[#2E302A] px-1.5 py-0.5 rounded">
              v1.5.0
            </span>
            <span className="text-xs font-semibold text-[#1F7A4D] bg-[#1F7A4D]/10 px-2 py-0.5 rounded-full border border-[#1F7A4D]/20">
              {totalPipelineValue} Pipeline ({activeDealsCount} Deals)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Revenue &amp; Deal Management
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Command center for deal pipelines, lead scoring, corporate accounts, sequence cadences, and revenue operations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Global Omnibar Search Button */}
          <button
            type="button"
            onClick={() => setOmnibarOpen(true)}
            aria-label="Open global search (Cmd+K)"
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <span className="hidden md:inline">Omnibar</span>
            <kbd className="font-mono text-[10px] text-ink-muted bg-white dark:bg-neutral-800 border border-border dark:border-[#2E302A] px-1.5 py-0.5 rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Quick Note Button */}
          <button
            type="button"
            onClick={() => setQuickNoteOpen(true)}
            aria-label="Quick Log Call, Meeting, or Note (Press N)"
            className="btn-secondary text-xs py-2 px-3 cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-accent"
            title="Log Call, Meeting or Note (Press N)"
          >
            <span>📝 Log Activity</span>
            <kbd className="font-mono text-[10px] text-ink-muted bg-white dark:bg-neutral-800 border border-border dark:border-[#2E302A] px-1 rounded">
              N
            </kbd>
          </button>

          {/* Recent Items Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRecentOpen(!recentOpen)}
              className="btn-secondary text-xs py-2 px-2.5 cursor-pointer flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-accent"
              title="Recent Deals & Leads"
            >
              <span>⏱️ Recent</span>
              <svg className={`w-3 h-3 text-ink-muted transition-transform ${recentOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {recentOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2E302A] rounded-xl shadow-xl z-50 p-2 space-y-1 animate-fade-in">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted border-b border-border dark:border-[#2E302A]">
                  Recently Viewed
                </div>
                {recentItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setRecentOpen(false)}
                    className="block p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="font-semibold text-xs text-ink dark:text-neutral-100 truncate">{item.title}</div>
                    <div className="text-[10px] text-ink-muted">{item.tag}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Notifications & Approvals Flyout */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label={`Notifications and Approvals (${unreadCount} unread)`}
              className="relative p-2 rounded-lg border border-border dark:border-[#2E302A] text-ink-muted hover:text-ink hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
              title="Notifications & Approvals"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-black text-white shadow-2xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-84 sm:w-96 bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2E302A] rounded-2xl shadow-2xl z-50 p-4 space-y-3 animate-fade-in text-ink dark:text-neutral-100">
                <div className="flex items-center justify-between pb-2 border-b border-border dark:border-[#2E302A]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-ink dark:text-white">
                      Notifications &amp; Approvals
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 text-accent font-mono">
                        {unreadCount} pending
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-ink-muted hover:text-ink dark:hover:text-white underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-ink-muted">
                      No notifications or pending approvals
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border text-xs space-y-2 transition-colors ${
                          item.status === 'PENDING'
                            ? 'bg-[#FAF9F5] dark:bg-neutral-800/60 border-accent/30'
                            : 'bg-white dark:bg-neutral-900 border-border dark:border-[#2E302A] opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-ink dark:text-white">
                              <span>
                                {item.type === 'approval'
                                  ? '⚖️ Discount Approval'
                                  : item.type === 'decay'
                                  ? '⏳ Deal Stalled Alert'
                                  : '🔥 Inbound Lead'}
                              </span>
                              <span className="font-normal text-[10px] text-ink-muted">
                                • {item.timestamp}
                              </span>
                            </div>
                            <div className="font-semibold text-ink dark:text-neutral-200">
                              {item.title}
                            </div>
                            <p className="text-[11px] text-ink-muted leading-tight">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        {item.type === 'approval' && item.status === 'PENDING' && (
                          <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/50 dark:border-neutral-700">
                            <button
                              type="button"
                              onClick={() => handleApproval(item.id, 'REJECTED')}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApproval(item.id, 'APPROVED')}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#1F7A4D] text-white hover:bg-emerald-800 transition-colors shadow-2xs cursor-pointer"
                            >
                              Approve Discount
                            </button>
                          </div>
                        )}

                        {item.type === 'approval' && item.status !== 'PENDING' && (
                          <div className="pt-1 text-[10px] font-bold">
                            <span
                              className={`px-2 py-0.5 rounded ${
                                item.status === 'APPROVED'
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Table Density Switcher */}
          <button
            type="button"
            onClick={toggleDensity}
            className="p-2 rounded-lg border border-border dark:border-[#2E302A] text-ink-muted hover:text-ink hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title={`Density: ${density} (Press C to toggle)`}
            aria-label="Toggle view density"
          >
            {density === 'normal' ? (
              // Icon for comfortable / spacious
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            ) : (
              // Icon for compact
              <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5M3.75 9h16.5M3.75 13.5h16.5M3.75 18h16.5" />
              </svg>
            )}
          </button>

          {/* Theme Toggle Button */}
          <CrmThemeToggle />

          {/* Data Center Button */}
          <button
            type="button"
            onClick={() => setDataModalOpen(true)}
            aria-label="Open CSV Import, Export and Deduplication Center"
            className="btn-secondary text-xs py-2 px-3 cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-accent"
            title="CSV Import, Export and Deduplication"
          >
            <span>📥 Data Center</span>
          </button>

          {/* New Lead */}
          {onNewLead && (
            <button
              type="button"
              onClick={onNewLead}
              aria-label="Create a new lead (Press L)"
              className="btn-secondary text-xs py-2 cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-accent"
            >
              <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.765Z" />
              </svg>
              <span>+ New Lead</span>
            </button>
          )}

          {/* New Deal */}
          {onNewDeal && (
            <button
              type="button"
              onClick={onNewDeal}
              aria-label="Create a new deal (Press D)"
              className="btn-primary text-xs py-2 cursor-pointer flex items-center gap-1.5 shadow-xs focus-visible:ring-2 focus-visible:ring-accent"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>+ Create Deal</span>
            </button>
          )}

          {/* Keyboard Shortcuts Help Button */}
          <button
            type="button"
            onClick={() => setShortcutsOpen(true)}
            aria-label="View keyboard shortcuts guide (Press ?)"
            className="p-2 rounded-lg border border-border dark:border-[#2E302A] text-ink-muted hover:text-ink hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
            title="Keyboard Shortcuts (?)"
          >
            <span className="font-bold font-mono text-xs">?</span>
          </button>
        </div>
      </div>

      {/* ─── Sub-Page Tab Bar ──────────────────────────── */}
      <nav aria-label="CRM Modules Navigation" className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-border/80 dark:border-[#2E302A] pt-3">
        {navTabs.map((tab) => {
          const isActive =
            tab.href === '/crm'
              ? pathname === '/crm' || pathname === '/crm/dashboard'
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-accent focus:outline-hidden ${
                isActive
                  ? 'bg-accent text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink dark:hover:text-neutral-100 hover:bg-[#FAF9F5] dark:hover:bg-[#1E1F1C]'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-ink-muted'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Modals */}
      <CrmOmnibarModal
        isOpen={omnibarOpen}
        onClose={() => setOmnibarOpen(false)}
      />

      <CrmShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      <CrmDataCenterModal
        isOpen={dataModalOpen}
        onClose={() => setDataModalOpen(false)}
      />

      <CrmQuickNoteModal
        isOpen={quickNoteOpen}
        onClose={() => setQuickNoteOpen(false)}
        onSaved={(item) => showToast(`Saved ${item.type.toLowerCase()}: "${item.title}"`)}
      />
    </header>
  );
}
