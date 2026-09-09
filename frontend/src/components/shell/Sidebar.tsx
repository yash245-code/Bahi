'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const modules = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    badge: null,
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    ),
  },
  {
    name: 'CRM',
    href: '/crm',
    badge: '12',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    name: 'Sales',
    href: '/sales',
    badge: '5',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
  {
    name: 'Inventory',
    href: '/inventory',
    badge: '11',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    name: 'Accounting',
    href: '/accounting',
    badge: '3',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    name: 'HR',
    href: '/hr',
    badge: '2',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    name: 'Projects',
    href: '/projects',
    badge: '4',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
      </svg>
    ),
  },
];

const moduleColorMap: Record<string, { badge: string; activeGlow: string }> = {
  '/crm': {
    badge: 'bg-module-crm-bg text-module-crm border border-module-crm-border',
    activeGlow: 'shadow-glow-crm',
  },
  '/sales': {
    badge: 'bg-module-billing-bg text-module-billing border border-module-billing-border',
    activeGlow: 'shadow-glow-billing',
  },
  '/inventory': {
    badge: 'bg-module-inventory-bg text-module-inventory border border-module-inventory-border',
    activeGlow: 'shadow-glow-inventory',
  },
  '/accounting': {
    badge: 'bg-module-accounting-bg text-module-accounting border border-module-accounting-border',
    activeGlow: 'shadow-glow-accounting',
  },
  '/hr': {
    badge: 'bg-module-hr-bg text-module-hr border border-module-hr-border',
    activeGlow: 'shadow-glow-hr',
  },
  '/projects': {
    badge: 'bg-module-projects-bg text-module-projects border border-module-projects-border',
    activeGlow: 'shadow-glow-projects',
  },
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* ─── Brand Logo & Header ─────────────────────── */}
      <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-950">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-black text-lg shadow-md border border-white/20">
            B
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-neutral-50 tracking-tight">Bahi</span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-accent/25 text-brand-200 border border-accent/40">
                ERP
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 truncate font-medium">Business Operations OS</p>
          </div>
        </div>
      </div>

      {/* ─── Tenant Card ─────────────────────────────── */}
      <div className="px-3 py-3 border-b border-neutral-800">
        <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-status-success/25 border border-status-success/40 flex items-center justify-center text-status-success text-xs font-bold shadow-xs">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-50 truncate">Acme Corp</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-status-success" />
            </div>
            <p className="text-[10px] text-neutral-500 font-medium">Business Plan • 12/25 Seats</p>
          </div>
        </div>
      </div>

      {/* ─── Navigation ──────────────────────────────── */}
      <nav className="flex-1 py-3 overflow-y-auto space-y-0.5">
        <div className="px-5 pb-2 pt-1 flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
            Workspace Modules
          </span>
          <span className="text-[9px] text-neutral-500/70 font-mono">v1.2</span>
        </div>
        {modules.map((item) => {
          const isActive = pathname === item.href;
          const modStyle = moduleColorMap[item.href];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive ? `active ${modStyle?.activeGlow || ''}` : ''}`}
            >
              {item.icon}
              <span className="flex-1 truncate">{item.name}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                  isActive ? 'bg-white text-brand-700' : (modStyle?.badge || 'bg-neutral-800 text-neutral-400 group-hover:text-white')
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ─── Database Health Indicator ───────────────── */}
      <div className="mx-3 my-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
          </span>
          <div>
            <p className="text-[10px] font-bold text-neutral-200 leading-tight">MongoDB Atlas</p>
            <p className="text-[9px] text-neutral-500">Live Cluster Sync</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-status-success bg-status-success/15 border border-status-success/25 px-1.5 py-0.5 rounded">
          12ms
        </span>
      </div>

      {/* ─── Footer Controls ─────────────────────────── */}
      <div className="border-t border-neutral-800 p-3 space-y-1 bg-neutral-950">
        <Link
          href="/settings"
          className={`sidebar-item !m-0 ${pathname === '/settings' ? 'active' : ''}`}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <span className="flex-1">Settings</span>
        </Link>
        <Link
          href="/"
          className="sidebar-item !m-0 group"
        >
          <svg className="w-5 h-5 flex-shrink-0 text-neutral-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span className="flex-1">Website Home</span>
          <span className="text-[10px] text-neutral-500 group-hover:text-accent transition-colors">↗</span>
        </Link>
      </div>
    </aside>
  );
}
