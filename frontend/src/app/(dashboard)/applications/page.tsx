'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AppCard {
  id: string;
  name: string;
  description: string;
  route: string;
  colorClass: string;
  icon: React.ReactNode;
}

const APPS: AppCard[] = [
  {
    id: 'crm',
    name: 'CRM',
    description: 'Manage your customers and track sales leads',
    route: '/crm',
    colorClass: 'text-module-crm bg-module-crm/10 border-module-crm/20',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Track stock across your warehouses in real-time',
    route: '/inventory',
    colorClass: 'text-module-inventory bg-module-inventory/10 border-module-inventory/20',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Send invoices, track expenses, and manage finances',
    route: '/accounting',
    colorClass: 'text-module-accounting bg-module-accounting/10 border-module-accounting/20',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    id: 'hr',
    name: 'HR',
    description: 'Manage staff, timesheets, and time-off requests',
    route: '/hr',
    colorClass: 'text-module-hr bg-module-hr/10 border-module-hr/20',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Collaborate with your team on tasks and to-dos',
    route: '/projects',
    colorClass: 'text-module-projects bg-module-projects/10 border-module-projects/20',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Process orders and build professional price quotes',
    route: '/sales',
    colorClass: 'text-accent bg-accent/10 border-accent/20',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6H2.25m0 0v1.5a.75.75 0 0 0 .75.75H3m0 0v1.5a.75.75 0 0 1-.75.75H2.25m0 0v1.5a.75.75 0 0 0 .75.75H3m18-6v-.75A.75.75 0 0 0 20.25 4.5H19.5m0 0v1.5a.75.75 0 0 1 .75.75h.75m0 0v1.5a.75.75 0 0 0-.75.75H19.5m0 0v1.5a.75.75 0 0 1 .75.75h.75m0 0v1.5a.75.75 0 0 0-.75.75H19.5M3.75 4.5h16.5M3.75 19.5h16.5M5.25 9h13.5m-13.5 3h13.5m-13.5 3h13.5" />
      </svg>
    ),
  }
];

export default function UserOverviewPage() {
  const [greeting, setGreeting] = useState<string>('Welcome');
  
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          {greeting}, <span className="text-accent">Yash</span>
        </h1>
        <p className="text-ink-muted">
          Here is what&apos;s happening across your business today. Select an application to dive in.
        </p>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-border p-5 rounded-2xl shadow-card hover:shadow-card-hover transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">Revenue (30d)</span>
            <span className="bg-[#1F7A4D]/10 text-[#1F7A4D] px-2 py-0.5 rounded text-[10px] font-bold">+14%</span>
          </div>
          <div className="text-2xl font-black text-ink font-mono">$12,450.00</div>
          <p className="text-xs text-ink-muted mt-2">vs $10,920 previous month</p>
        </div>

        <div className="bg-white border border-border p-5 rounded-2xl shadow-card hover:shadow-card-hover transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">New Leads</span>
            <span className="bg-[#1F7A4D]/10 text-[#1F7A4D] px-2 py-0.5 rounded text-[10px] font-bold">+5</span>
          </div>
          <div className="text-2xl font-black text-ink font-mono">42</div>
          <p className="text-xs text-ink-muted mt-2">12 need follow-up today</p>
        </div>

        <div className="bg-white border border-border p-5 rounded-2xl shadow-card hover:shadow-card-hover transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">Active Projects</span>
          </div>
          <div className="text-2xl font-black text-ink font-mono">8</div>
          <p className="text-xs text-ink-muted mt-2">3 due this week</p>
        </div>

        <div className="bg-[#FAF4F2] border border-[#EBD2CB] p-5 rounded-2xl shadow-card group">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">System Status</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1F7A4D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1F7A4D]"></span>
            </span>
          </div>
          <div className="text-lg font-black text-ink">All Systems Normal</div>
          <p className="text-xs text-accent mt-2">Cloud synced 2 mins ago</p>
        </div>
      </div>

      {/* Applications Grid */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-4">Your Application Suite</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {APPS.map((app) => (
            <Link 
              href={app.route} 
              key={app.id}
              className="bg-white rounded-2xl p-5 border border-border shadow-card hover:shadow-card-hover hover:border-[#D5D2CA] transition-all group flex items-start gap-4 cursor-pointer"
            >
              <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-105 ${app.colorClass}`}>
                {app.icon}
              </div>
              <div>
                <h3 className="font-bold text-ink group-hover:text-accent transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  {app.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity (mock placeholder) */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-4">Recent Activity</h2>
        <div className="bg-white border border-border rounded-2xl shadow-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-4 hover:bg-[#F7F6F3] transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#EBD2CB] text-accent flex items-center justify-center font-bold text-xs shrink-0">YR</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">Quote #104 accepted by Green Garden Cafe</p>
              <p className="text-xs text-ink-muted">Sales • 2 hours ago</p>
            </div>
          </div>
          <div className="p-4 border-b border-border flex items-center gap-4 hover:bg-[#F7F6F3] transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#16283A]/10 text-[#3E7FBF] flex items-center justify-center font-bold text-xs shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">Incoming stock received (150 items)</p>
              <p className="text-xs text-ink-muted">Inventory • 4 hours ago</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4 hover:bg-[#F7F6F3] transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#123322]/10 text-[#2E9169] flex items-center justify-center font-bold text-xs shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">Invoice #084 marked as Paid</p>
              <p className="text-xs text-ink-muted">Accounting • Yesterday</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

