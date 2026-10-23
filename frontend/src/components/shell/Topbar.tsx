'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getAllApplications } from '@bahi/applications';
import { ThemeToggle } from '@/components/ThemeToggle';

const appRouteTitles: Record<string, string> = {
  '/applications': 'User Overview',
  '/crm': 'Customer Relationship Management',
  '/sales': 'Sales Orders & Quotations',
  '/inventory': 'Inventory & Stock Control',
  '/accounting': 'Accounting & Double-Entry Ledger',
  '/hr': 'Human Resources & Workforce',
  '/projects': 'Projects & Sprint Delivery',
  '/services': 'Field Services & Dispatch',
};

const routeNames: Record<string, string> = {
  ...appRouteTitles,
  ...Object.fromEntries(
    getAllApplications().map((app) => [app.routePrefix, `${app.name} (Active Workspace)`]),
  ),
};

export function Topbar({
  onToggleSidebar,
  onCommandPalette,
}: {
  onToggleSidebar: () => void;
  onCommandPalette: () => void;
}) {
  const pathname = usePathname();
  const currentTitle = routeNames[pathname] || 'Applications Suite';

  return (
    <header className="topbar justify-between">
      {/* ─── Hamburger & Breadcrumb ──────────────────── */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-sm min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="p-2 -ml-1 mr-1 rounded-lg text-ink-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          title="Open Menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <Link href="/applications" className="font-bold text-ink dark:text-white tracking-tight flex items-center gap-1.5 flex-shrink-0 hover:text-accent transition-colors">
            <span className="w-2 h-2 rounded-full bg-accent inline-block shadow-xs" />
            <span className="hidden xs:inline">Bahi</span> Suite
          </Link>
          <span className="text-ink-muted/40 font-mono">/</span>
          <span className="font-semibold text-ink-muted dark:text-[#A0A29C] tracking-tight truncate">{currentTitle}</span>
          <span className="hidden xl:inline-flex items-center gap-1.5 ml-3 px-2 py-0.5 rounded-md bg-[#FAF4F2] dark:bg-accent/15 border border-[#EBD2CB] dark:border-accent/30 text-[10px] font-semibold text-accent flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A4D] dark:bg-emerald-400 animate-pulse"></span>
            Mongo Atlas • 99.98% Sync
          </span>
        </div>
      </div>

      {/* ─── Center / Actions ───────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Search Trigger */}
        <button
          onClick={onCommandPalette}
          className="flex items-center gap-3 px-3 py-1.5 bg-white dark:bg-[#1E1F1C] hover:bg-[#FAF9F5] dark:hover:bg-neutral-800 border border-border dark:border-[#2E302A] hover:border-[#D5D2CA] dark:hover:border-neutral-700 rounded-lg text-xs text-ink-muted hover:text-ink dark:hover:text-white transition-all duration-150 min-w-[200px] sm:min-w-[240px] shadow-xs cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <span className="font-medium">Search applications...</span>
          <kbd className="ml-auto text-[10px] font-mono bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted px-1.5 py-0.5 rounded border border-border dark:border-[#2E302A]">
            ⌘K
          </kbd>
        </button>

        {/* Applications Hub Shortcut */}
        <Link
          href="/applications"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF9F5] dark:bg-[#1E1F1C] border border-border dark:border-[#2E302A] text-[11px] font-semibold text-ink dark:text-neutral-100 hover:border-accent/40 transition-colors"
        >
          <span>All Apps</span>
        </Link>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* User Profile & Sign Out Link */}
        <div className="flex items-center gap-2 pl-2 border-l border-border dark:border-[#2E302A]">
          <Link
            href="/login"
            title="Sign Out to Login"
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-[#853526] flex items-center justify-center text-white text-[11px] font-bold shadow-xs group-hover:scale-105 transition-transform">
              YR
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-ink dark:text-white leading-tight group-hover:text-accent transition-colors">Yash Rawat</p>
              <p className="text-[10px] text-ink-muted dark:text-[#A0A29C] leading-tight">Acme Admin • Sign Out</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
