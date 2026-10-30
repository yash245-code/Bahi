'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAllApplications } from '@bahi/applications';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const appIcons: Record<string, React.ReactNode> = {
  crm: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  ),
  sales: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6H2.25m0 0v1.5a.75.75 0 0 0 .75.75H3m0 0v1.5a.75.75 0 0 1-.75.75H2.25m0 0v1.5a.75.75 0 0 0 .75.75H3m18-6v-.75A.75.75 0 0 0 20.25 4.5H19.5m0 0v1.5a.75.75 0 0 1 .75.75h.75m0 0v1.5a.75.75 0 0 0-.75.75H19.5m0 0v1.5a.75.75 0 0 1 .75.75h.75m0 0v1.5a.75.75 0 0 0-.75.75H19.5M3.75 4.5h16.5M3.75 19.5h16.5M5.25 9h13.5m-13.5 3h13.5m-13.5 3h13.5" />
    </svg>
  ),
  inventory: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  ),
  accounting: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  hr: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
  projects: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
    </svg>
  ),
  services: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.07a4.5 4.5 0 0 0 4.486-6.32l-3.27 3.27-2.5-2.5 3.27-3.27a4.5 4.5 0 0 0-6.32 4.486c.118.58.094 1.193-.07 1.743" />
    </svg>
  ),
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const allApps = getAllApplications();

  return (
    <>
      {/* ─── Backdrop Overlay ───────────────────────── */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ─── Collapsible Sidebar Drawer ─────────────── */}
      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        aria-label="Applications Suite Navigation"
      >
        {/* ─── Brand Logo & Header ── */}
        <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <Link href="/applications" onClick={onClose} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-serif font-black text-lg shadow-md border border-white/20">
              B
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-neutral-50 tracking-tight font-serif">Bahi</span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-accent/25 text-brand-200 border border-accent/40 font-mono">
                  Suite
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 truncate font-medium">Business Tools</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Close menu (Esc)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ─── Active Organization Tenant Card ───────── */}
        <div className="px-3 py-3 border-b border-neutral-800">
          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold">
                🏢
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-100 truncate">Acme Global Inc</p>
                <p className="text-[10px] text-neutral-400 font-mono truncate">acme.bahi.io</p>
              </div>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-status-success animate-pulse flex-shrink-0" title="Connected" />
          </div>
        </div>

        {/* ─── Navigation Links ────────────────────────── */}
        <nav className="flex-1 py-3 overflow-y-auto space-y-1 no-scrollbar">
          {/* Applications Hub Launcher */}
          <div className="px-3">
            <Link
              href="/applications"
              onClick={onClose}
              className={`sidebar-item ${pathname === '/applications' ? 'active' : ''}`}
            >
              <svg className="w-5 h-5 flex-shrink-0 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
              </svg>
              <span className="flex-1 font-semibold">All Apps</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/30 font-mono">
                {allApps.length} Apps
              </span>
            </Link>
          </div>

          {/* ─── Business Applications Section ─── */}
          <div className="px-5 pb-2 pt-4 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Your Apps
            </span>
            <span className="text-[9px] text-accent font-mono font-semibold">Live</span>
          </div>

          <div className="px-3 space-y-0.5">
            {allApps.map((app) => {
              const isActive = pathname.startsWith(app.routePrefix);
              return (
                <Link
                  key={app.id}
                  href={app.routePrefix}
                  onClick={onClose}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <span className={`${isActive ? 'text-accent' : 'text-neutral-400'}`}>
                    {appIcons[app.id] || (
                      <span className="w-2 h-2 rounded-full inline-block bg-neutral-500" />
                    )}
                  </span>
                  <span className="flex-1 truncate">{app.name}</span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    v{app.version}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ─── Infrastructure Sync Widget ──────────────── */}
        <div className="mx-3 my-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
            </span>
            <div>
              <p className="text-[10px] font-bold text-neutral-200 leading-tight">Cloud Storage</p>
              <p className="text-[9px] text-neutral-400 font-mono">Connected & Synced</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-status-success bg-status-success/15 border border-status-success/25 px-1.5 py-0.5 rounded">
            Active
          </span>
        </div>

        {/* ─── Footer Controls & Sign Out ───────────────── */}
        <div className="border-t border-neutral-800 p-3 space-y-1 bg-neutral-950">
          <Link
            href="/"
            onClick={onClose}
            className="sidebar-item !m-0 group text-neutral-400 hover:text-white"
          >
            <svg className="w-5 h-5 flex-shrink-0 text-neutral-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span className="flex-1">Home Website</span>
            <span className="text-[10px] text-neutral-400 group-hover:text-accent transition-colors">↗</span>
          </Link>

          <Link
            href="/login"
            onClick={onClose}
            className="sidebar-item !m-0 group text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10"
          >
            <svg className="w-5 h-5 flex-shrink-0 text-rose-400 group-hover:text-rose-300 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            <span className="flex-1 font-medium">Sign Out</span>
            <span className="text-[10px] font-mono text-neutral-400">Exit</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
