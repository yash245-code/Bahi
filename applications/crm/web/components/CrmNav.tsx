'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CrmOmnibarModal } from './CrmOmnibarModal';
import { CrmShortcutsModal } from './CrmShortcutsModal';
import { CrmDataCenterModal } from './CrmDataCenterModal';

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
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
  {
    name: 'Deals Pipeline',
    href: '/crm/deals',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.539.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.378-1.007.917-1.096A48.32 48.32 0 0 1 12 3Z" />
      </svg>
    ),
  },
  {
    name: 'Leads & Intake',
    href: '/crm/leads',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.765Z" />
      </svg>
    ),
  },
  {
    name: 'Companies',
    href: '/crm/companies',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    name: 'Contacts',
    href: '/crm/contacts',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    name: 'Activities',
    href: '/crm/activities',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
      </svg>
    ),
  },
  {
    name: 'Quotes',
    href: '/crm/quotes',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    name: 'Sequences',
    href: '/crm/sequences',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
      </svg>
    ),
  },
  {
    name: 'Products',
    href: '/crm/products',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
  },
  {
    name: 'Reports',
    href: '/crm/analytics',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    name: 'Settings',
    href: '/crm/settings',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.6 6.6 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, onNewDeal, onNewLead]);

  return (
    <header className="space-y-4 pb-2 border-b border-border" role="banner">
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
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF4F2] text-accent border border-[#EBD2CB]">
              CRM &amp; Revenue Ops
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-[#FAF9F5] border border-border px-1.5 py-0.2 rounded">
              v1.5.0
            </span>
            <span className="text-xs font-semibold text-[#1F7A4D] bg-[#1F7A4D]/10 px-2 py-0.5 rounded-full border border-[#1F7A4D]/20">
              {totalPipelineValue} Pipeline ({activeDealsCount} Deals)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
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
            <kbd className="font-mono text-[10px] text-ink-muted bg-white border border-border px-1.5 py-0.5 rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Data Center Button (Import/Export/Dedup) */}
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
            className="p-2 rounded-lg border border-border text-ink-muted hover:text-ink hover:bg-neutral-100 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
            title="Keyboard Shortcuts (?)"
          >
            <span className="font-bold font-mono text-xs">?</span>
          </button>
        </div>
      </div>

      {/* ─── Sub-Page Tab Bar ──────────────────────────── */}
      <nav aria-label="CRM Modules Navigation" className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar border-t border-border/80 pt-3">
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
                  : 'text-ink-muted hover:text-ink hover:bg-[#FAF9F5]'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
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
    </header>
  );
}
