'use client';

import { usePathname } from 'next/navigation';

const routeNames: Record<string, string> = {
  '/dashboard': 'Business Overview',
  '/crm': 'CRM & Pipeline',
  '/sales': 'Sales & Quotations',
  '/inventory': 'Warehouses & Stock',
  '/accounting': 'Accounting & Ledger',
  '/hr': 'Human Resources',
  '/projects': 'Projects & Timesheets',
  '/settings': 'Tenant Settings',
};

export function Topbar({ onCommandPalette }: { onCommandPalette: () => void }) {
  const pathname = usePathname();
  const currentTitle = routeNames[pathname] || 'Dashboard';

  return (
    <header className="topbar justify-between">
      {/* ─── Breadcrumb & Path ───────────────────────── */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-ink-muted/80">Acme Corp</span>
        <span className="text-ink-muted/40 font-mono">/</span>
        <span className="font-bold text-ink tracking-tight">{currentTitle}</span>
        <span className="hidden lg:inline-flex items-center gap-1.5 ml-3 px-2 py-0.5 rounded-md bg-[#FAF4F2] border border-[#EBD2CB] text-[10px] font-semibold text-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A4D]"></span>
          Atlas Online
        </span>
      </div>

      {/* ─── Center / Actions ───────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Search Trigger */}
        <button
          onClick={onCommandPalette}
          className="flex items-center gap-3 px-3 py-1.5 bg-white hover:bg-[#FAF9F5] border border-border hover:border-[#D5D2CA] rounded-lg text-xs text-ink-muted hover:text-ink transition-all duration-150 min-w-[240px] shadow-xs"
        >
          <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <span className="font-medium">Quick search...</span>
          <kbd className="ml-auto text-[10px] font-mono bg-[#FAF9F5] text-ink-muted px-1.5 py-0.5 rounded border border-border">
            ⌘K
          </kbd>
        </button>

        {/* Fiscal Tag */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF9F5] border border-border text-[11px] font-medium text-ink-muted">
          <span>Q3 FY26</span>
        </div>

        {/* Quick New Action */}
        <button
          onClick={onCommandPalette}
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-accent text-white hover:bg-accent-hover font-semibold text-xs transition-colors shadow-xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>New</span>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-black/5 relative transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile Capsule */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-[#853526] flex items-center justify-center text-white text-[11px] font-bold shadow-xs">
            YR
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-ink leading-tight">Yash Rawat</p>
            <p className="text-[10px] text-ink-muted leading-tight">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
