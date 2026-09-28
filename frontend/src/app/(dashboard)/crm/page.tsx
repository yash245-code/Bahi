'use client';

import { useState } from 'react';

interface Deal {
  id: string;
  title: string;
  value: string;
  amount: number;
  contact: string;
  company: string;
  probability: number;
  expectedDate: string;
  priority: 'Hot' | 'High' | 'Medium' | 'Low';
  tag: string;
  assignee: { name: string; avatar: string; color: string };
}

interface Stage {
  name: string;
  color: string;
  count: number;
  value: string;
  deals: Deal[];
}

const initialStages: Stage[] = [
  {
    name: 'New Leads',
    color: '#75766E',
    count: 3,
    value: '$12,000',
    deals: [
      {
        id: 'D-101',
        title: 'TechStart Enterprise OS',
        value: '$3,200',
        amount: 3200,
        contact: 'sarah@techstart.io',
        company: 'TechStart Inc.',
        probability: 25,
        expectedDate: 'Sep 28',
        priority: 'Medium',
        tag: 'Inbound',
        assignee: { name: 'Alex Morgan', avatar: 'AM', color: 'bg-accent text-white' },
      },
      {
        id: 'D-102',
        title: 'DataFlow Multi-Warehouse Sync',
        value: '$5,400',
        amount: 5400,
        contact: 'marcus@dataflow.com',
        company: 'DataFlow Corp',
        probability: 30,
        expectedDate: 'Oct 05',
        priority: 'Hot',
        tag: 'Referral',
        assignee: { name: 'Priya Sharma', avatar: 'PS', color: 'bg-[#20211F] text-white' },
      },
      {
        id: 'D-103',
        title: 'CloudBase Ledger Integration',
        value: '$3,400',
        amount: 3400,
        contact: 'team@cloudbase.io',
        company: 'CloudBase Ltd',
        probability: 20,
        expectedDate: 'Oct 12',
        priority: 'Low',
        tag: 'Self-Serve',
        assignee: { name: 'Daniel Kim', avatar: 'DK', color: 'bg-[#75766E] text-white' },
      },
    ],
  },
  {
    name: 'Qualified',
    color: '#A8462F',
    count: 2,
    value: '$23,500',
    deals: [
      {
        id: 'D-104',
        title: 'NexGen Cloud ERP Suite',
        value: '$15,000',
        amount: 15000,
        contact: 'cto@nexgen.dev',
        company: 'NexGen Systems',
        probability: 50,
        expectedDate: 'Sep 22',
        priority: 'Hot',
        tag: 'Enterprise',
        assignee: { name: 'Alex Morgan', avatar: 'AM', color: 'bg-accent text-white' },
      },
      {
        id: 'D-105',
        title: 'BrightWave Retail Inventory',
        value: '$8,500',
        amount: 8500,
        contact: 'team@brightwave.co',
        company: 'BrightWave Retail',
        probability: 45,
        expectedDate: 'Sep 25',
        priority: 'High',
        tag: 'E-Commerce',
        assignee: { name: 'Priya Sharma', avatar: 'PS', color: 'bg-[#20211F] text-white' },
      },
    ],
  },
  {
    name: 'Proposal Sent',
    color: '#853526',
    count: 2,
    value: '$45,000',
    deals: [
      {
        id: 'D-106',
        title: 'Summit Digital Operations OS',
        value: '$22,000',
        amount: 22000,
        contact: 'ops@summit.io',
        company: 'Summit Digital',
        probability: 70,
        expectedDate: 'Sep 18',
        priority: 'High',
        tag: 'Renewal',
        assignee: { name: 'Sarah Chen', avatar: 'SC', color: 'bg-[#1F7A4D] text-white' },
      },
      {
        id: 'D-107',
        title: 'Pinnacle Group Global Logistics',
        value: '$23,000',
        amount: 23000,
        contact: 'cfo@pinnacle.com',
        company: 'Pinnacle Group',
        probability: 65,
        expectedDate: 'Sep 20',
        priority: 'Hot',
        tag: 'Logistics',
        assignee: { name: 'Alex Morgan', avatar: 'AM', color: 'bg-accent text-white' },
      },
    ],
  },
  {
    name: 'Negotiation',
    color: '#B8790A',
    count: 2,
    value: '$67,000',
    deals: [
      {
        id: 'D-108',
        title: 'Enterprise One Multi-Tenant Migration',
        value: '$42,000',
        amount: 42000,
        contact: 'deals@enterprise1.com',
        company: 'Enterprise One',
        probability: 85,
        expectedDate: 'Sep 15',
        priority: 'Hot',
        tag: 'Multi-Tenant',
        assignee: { name: 'Priya Sharma', avatar: 'PS', color: 'bg-[#20211F] text-white' },
      },
      {
        id: 'D-109',
        title: 'Global Reach Supply Chain Hub',
        value: '$25,000',
        amount: 25000,
        contact: 'vp@globalreach.co',
        company: 'Global Reach Inc',
        probability: 80,
        expectedDate: 'Sep 16',
        priority: 'High',
        tag: 'Global',
        assignee: { name: 'Daniel Kim', avatar: 'DK', color: 'bg-[#75766E] text-white' },
      },
    ],
  },
  {
    name: 'Won (Closed)',
    color: '#1F7A4D',
    count: 4,
    value: '$124,500',
    deals: [
      {
        id: 'D-110',
        title: 'Apex Dynamics Annual ERP',
        value: '$52,000',
        amount: 52000,
        contact: 'ceo@apexdynamics.com',
        company: 'Apex Dynamics',
        probability: 100,
        expectedDate: 'Closed',
        priority: 'High',
        tag: 'Enterprise',
        assignee: { name: 'Alex Morgan', avatar: 'AM', color: 'bg-accent text-white' },
      },
      {
        id: 'D-111',
        title: 'Vanguard Retail Systems',
        value: '$38,500',
        amount: 38500,
        contact: 'cfo@vanguard.io',
        company: 'Vanguard Retail',
        probability: 100,
        expectedDate: 'Closed',
        priority: 'Hot',
        tag: 'SaaS',
        assignee: { name: 'Priya Sharma', avatar: 'PS', color: 'bg-[#20211F] text-white' },
      },
    ],
  },
];

export default function CrmPage() {
  const stages = initialStages;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'hot' | 'high_val'>('all');

  const totalPipelineValue = stages.reduce(
    (acc, stage) => acc + stage.deals.reduce((sum, d) => sum + d.amount, 0),
    0
  );
  const totalDealsCount = stages.reduce((acc, stage) => acc + stage.deals.length, 0);

  const filteredStages = stages.map((stage) => ({
    ...stage,
    deals: stage.deals.filter((deal) => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.contact.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (activeFilter === 'hot') return deal.priority === 'Hot';
      if (activeFilter === 'high_val') return deal.amount >= 20000;
      return true;
    }),
  }));

  return (
    <div className="animate-fade-in space-y-7">
      {/* ─── Page Header ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="page-title">Sales Pipeline</h1>
            <span className="badge badge-success">${totalPipelineValue.toLocaleString()} Pipeline</span>
          </div>
          <p className="page-subtitle">
            Manage high-velocity deals, track stage probability, and qualify inbound leads.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="btn-secondary text-xs py-2">
            <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Import CSV
          </button>
          <button className="btn-primary text-xs py-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Lead
          </button>
        </div>
      </div>

      {/* ─── Funnel Metrics Summary Banner ───────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {stages.map((stage) => {
          const stageTotal = stage.deals.reduce((sum, d) => sum + d.amount, 0);
          const stagePct = totalPipelineValue > 0 ? Math.round((stageTotal / totalPipelineValue) * 100) : 0;

          return (
            <div key={stage.name} className="card p-3.5 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                  <span className="text-xs font-bold text-ink truncate">{stage.name}</span>
                </div>
                <span className="text-[10px] font-mono text-ink-muted bg-[#FAF9F5] px-1.5 py-0.5 rounded border border-border">
                  {stage.deals.length}
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-extrabold text-ink font-mono tracking-tight">
                  ${stageTotal.toLocaleString()}
                </span>
                <span className="text-[10px] font-semibold text-ink-muted">{stagePct}%</span>
              </div>

              {/* Mini progress bar */}
              <div className="w-full h-1.5 bg-[#FAF9F5] border border-border/60 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(stagePct, 8)}%`, backgroundColor: stage.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Controls: Search & Filters ─────────────────── */}
      <div className="card p-3 flex flex-wrap items-center justify-between gap-3 bg-white shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[260px] max-w-md">
          <div className="relative w-full">
            <svg className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search leads, companies, contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#FAF9F5] border border-border rounded-lg text-ink placeholder:text-ink-muted outline-none focus:border-accent focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-ink-muted text-[11px] font-medium mr-1">Filter:</span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-accent text-white shadow-xs'
                : 'bg-[#FAF9F5] text-ink-muted hover:text-ink border border-border'
            }`}
          >
            All ({totalDealsCount})
          </button>
          <button
            onClick={() => setActiveFilter('hot')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              activeFilter === 'hot'
                ? 'bg-accent text-white shadow-xs'
                : 'bg-[#FAF9F5] text-ink-muted hover:text-ink border border-border'
            }`}
          >
            🔥 Hot Deals
          </button>
          <button
            onClick={() => setActiveFilter('high_val')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              activeFilter === 'high_val'
                ? 'bg-accent text-white shadow-xs'
                : 'bg-[#FAF9F5] text-ink-muted hover:text-ink border border-border'
            }`}
          >
            $20K+ High Value
          </button>
        </div>
      </div>

      {/* ─── Kanban Board ───────────────────────────────── */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
        {filteredStages.map((stage) => {
          const colSum = stage.deals.reduce((sum, d) => sum + d.amount, 0);

          return (
            <div key={stage.name} className="min-w-[300px] w-[300px] flex-shrink-0 flex flex-col">
              {/* Column Header */}
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-border mb-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                  <h3 className="text-xs font-bold text-ink">{stage.name}</h3>
                  <span className="text-[10px] font-bold text-ink-muted bg-white px-1.5 py-0.2 rounded border border-border">
                    {stage.deals.length}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-accent">
                  ${colSum.toLocaleString()}
                </span>
              </div>

              {/* Deal Cards Container */}
              <div className="space-y-3 flex-1">
                {stage.deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="card p-4 hover:border-accent/60 cursor-pointer group relative transition-all"
                  >
                    {/* Top Row: Tag & Priority */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF9F5] text-ink-muted border border-border">
                        {deal.tag}
                      </span>
                      {deal.priority === 'Hot' ? (
                        <span className="badge badge-danger text-[10px]">🔥 Hot Lead</span>
                      ) : (
                        <span className="badge badge-warning text-[10px]">⚡ {deal.priority}</span>
                      )}
                    </div>

                    {/* Deal Title & Company */}
                    <h4 className="text-sm font-bold text-ink group-hover:text-accent transition-colors leading-snug mb-1">
                      {deal.title}
                    </h4>
                    <p className="text-xs font-medium text-ink-muted mb-3 flex items-center gap-1">
                      <span className="w-4 h-4 rounded bg-[#FAF4F2] text-accent flex items-center justify-center text-[10px] font-bold">
                        {deal.company.charAt(0)}
                      </span>
                      {deal.company}
                    </p>

                    {/* Value & Probability Meter */}
                    <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-border/80 mb-3 space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-ink-muted font-medium">Deal Value</span>
                        <span className="text-base font-extrabold text-accent font-mono">
                          {deal.value}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-ink-muted">
                          <span>Close Probability</span>
                          <span className="font-semibold text-ink">{deal.probability}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white border border-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer: Date & Assignee */}
                    <div className="flex items-center justify-between pt-1 text-[11px] text-ink-muted">
                      <span className="flex items-center gap-1 font-medium">
                        <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        {deal.expectedDate}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-ink-muted font-mono">{deal.id}</span>
                        <div className={`w-6 h-6 rounded-full ${deal.assignee.color} flex items-center justify-center text-[10px] font-bold shadow-xs`}>
                          {deal.assignee.avatar}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Quick Add Button per Column */}
                <button className="w-full py-2 px-3 rounded-xl border border-dashed border-[#D5D2CA] hover:border-accent hover:bg-[#FAF4F2] text-xs font-semibold text-ink-muted hover:text-accent transition-all flex items-center justify-center gap-1.5 group">
                  <span className="text-sm leading-none">+</span>
                  <span>Add Deal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
