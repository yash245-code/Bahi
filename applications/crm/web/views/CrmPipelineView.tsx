'use client';

import { useState } from 'react';
import { CrmNav } from '../components/CrmNav';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';

export interface Deal {
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

export interface Stage {
  name: string;
  color: string;
  count: number;
  deals: Deal[];
}

const defaultStages: Stage[] = [
  {
    name: 'New Leads',
    color: '#75766E',
    count: 3,
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
    count: 2,
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

export function CrmPipelineView() {
  const [stages, setStages] = useState<Stage[]>(defaultStages);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'hot' | 'high_val'>('all');
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalPipelineValue = stages.reduce(
    (acc, stage) => acc + stage.deals.reduce((sum, d) => sum + d.amount, 0),
    0
  );
  const totalDealsCount = stages.reduce((acc, stage) => acc + stage.deals.length, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3500);
  };

  const moveDeal = (dealId: string, direction: 'forward' | 'backward') => {
    setStages((prev) => {
      let foundDeal: Deal | undefined;
      let fromIdx = -1;

      for (let idx = 0; idx < prev.length; idx++) {
        const d = prev[idx]?.deals.find((item) => item.id === dealId);
        if (d) {
          foundDeal = d;
          fromIdx = idx;
          break;
        }
      }

      if (!foundDeal || fromIdx === -1) return prev;
      const targetIdx = direction === 'forward' ? fromIdx + 1 : fromIdx - 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;

      const targetStage = prev[targetIdx];
      if (!targetStage) return prev;

      showToast(`Moved "${foundDeal.title}" to ${targetStage.name}`);

      return prev.map((stg, idx) => {
        if (idx === fromIdx) {
          return { ...stg, deals: stg.deals.filter((d) => d.id !== dealId) };
        }
        if (idx === targetIdx) {
          return { ...stg, deals: [...stg.deals, foundDeal!] };
        }
        return stg;
      });
    });
  };

  const handleCreateDeal = (newDealData: {
    title: string;
    value: number;
    company: string;
    contact: string;
    stage: string;
    priority: 'Hot' | 'High' | 'Medium' | 'Low';
    probability: number;
  }) => {
    const newDeal: Deal = {
      id: `D-${Math.floor(100 + Math.random() * 900)}`,
      title: newDealData.title,
      value: `$${newDealData.value.toLocaleString()}`,
      amount: newDealData.value,
      contact: newDealData.contact,
      company: newDealData.company,
      probability: newDealData.probability,
      expectedDate: 'Nov 15',
      priority: newDealData.priority,
      tag: 'New Deal',
      assignee: { name: 'Alex Morgan', avatar: 'AM', color: 'bg-accent text-white' },
    };

    setStages((prev) =>
      prev.map((stg) => {
        if (stg.name === newDealData.stage) {
          return { ...stg, deals: [newDeal, ...stg.deals] };
        }
        return stg;
      })
    );

    showToast(`Created opportunity "${newDeal.title}" in ${newDealData.stage}`);
  };

  const handleCaptureLead = (lead: {
    name: string;
    company: string;
    email: string;
    source: string;
    score: number;
  }) => {
    const newDeal: Deal = {
      id: `L-${Math.floor(100 + Math.random() * 900)}`,
      title: `${lead.company} Discovery`,
      value: `$${(lead.score * 120).toLocaleString()}`,
      amount: lead.score * 120,
      contact: lead.email,
      company: lead.company,
      probability: Math.min(lead.score, 30),
      expectedDate: 'Oct 20',
      priority: lead.score > 75 ? 'Hot' : 'High',
      tag: lead.source,
      assignee: { name: 'Sarah Chen', avatar: 'SC', color: 'bg-[#1F7A4D] text-white' },
    };

    setStages((prev) =>
      prev.map((stg, i) => (i === 0 ? { ...stg, deals: [newDeal, ...stg.deals] } : stg))
    );

    showToast(`Captured lead for ${lead.company} (Score: ${lead.score})`);
  };

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
    <div className="animate-fade-in space-y-6">
      {/* ── Persistent CRM Navigation Header ─────────── */}
      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
        totalPipelineValue={`$${totalPipelineValue.toLocaleString()}`}
        activeDealsCount={totalDealsCount}
      />

      {/* ── Toast Alert ──────────────────────────────── */}
      {toastMessage && (
        <div className="p-3 bg-neutral-900 text-white rounded-xl flex items-center justify-between text-xs font-semibold shadow-lg border border-neutral-800 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-success inline-block" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-white text-xs px-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Funnel Metrics Summary Banner ────────────── */}
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

      {/* ── Controls: Search & Filters ──────────────── */}
      <div className="card p-3 flex flex-wrap items-center justify-between gap-3 bg-white shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[260px] max-w-md">
          <div className="relative w-full">
            <svg className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search deals, companies, contacts..."
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
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-accent text-white shadow-xs'
                : 'bg-[#FAF9F5] text-ink-muted hover:text-ink border border-border'
            }`}
          >
            All ({totalDealsCount})
          </button>
          <button
            onClick={() => setActiveFilter('hot')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeFilter === 'hot'
                ? 'bg-accent text-white shadow-xs'
                : 'bg-[#FAF9F5] text-ink-muted hover:text-ink border border-border'
            }`}
          >
            🔥 Hot Deals
          </button>
          <button
            onClick={() => setActiveFilter('high_val')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeFilter === 'high_val'
                ? 'bg-accent text-white shadow-xs'
                : 'bg-[#FAF9F5] text-ink-muted hover:text-ink border border-border'
            }`}
          >
            $20K+ High Value
          </button>
        </div>
      </div>

      {/* ── Kanban Board Columns ─────────────────────── */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
        {filteredStages.map((stage, stageIdx) => {
          const colSum = stage.deals.reduce((sum, d) => sum + d.amount, 0);

          return (
            <div key={stage.name} className="min-w-[310px] w-[310px] flex-shrink-0 flex flex-col">
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
                    className="card p-4 hover:border-accent/60 group relative transition-all shadow-xs"
                  >
                    {/* Top Row: Tag & Priority */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF9F5] text-ink-muted border border-border">
                        {deal.tag}
                      </span>
                      {deal.priority === 'Hot' ? (
                        <span className="badge badge-danger text-[10px]">🔥 Hot</span>
                      ) : (
                        <span className="badge badge-warning text-[10px]">⚡ {deal.priority}</span>
                      )}
                    </div>

                    {/* Deal Title & Company */}
                    <h4 className="text-sm font-bold text-ink group-hover:text-accent transition-colors leading-snug mb-1">
                      {deal.title}
                    </h4>
                    <p className="text-xs font-medium text-ink-muted mb-3 flex items-center gap-1.5">
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

                    {/* Footer: Date, Assignee, & Stage Move Actions */}
                    <div className="flex items-center justify-between pt-1 text-[11px] text-ink-muted">
                      <span className="flex items-center gap-1 font-medium">
                        <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        {deal.expectedDate}
                      </span>

                      {/* Stage Move Controls */}
                      <div className="flex items-center gap-1">
                        {stageIdx > 0 && (
                          <button
                            type="button"
                            onClick={() => moveDeal(deal.id, 'backward')}
                            className="p-1 rounded bg-[#FAF9F5] hover:bg-neutral-200 text-ink-muted hover:text-ink cursor-pointer"
                            title="Move back"
                          >
                            ◀
                          </button>
                        )}
                        {stageIdx < stages.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveDeal(deal.id, 'forward')}
                            className="p-1 rounded bg-[#FAF9F5] hover:bg-accent hover:text-white text-ink-muted cursor-pointer transition-colors"
                            title="Advance stage"
                          >
                            ▶
                          </button>
                        )}
                        <div className={`w-6 h-6 rounded-full ${deal.assignee.color} flex items-center justify-center text-[10px] font-bold shadow-xs ml-1`}>
                          {deal.assignee.avatar}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Quick Add Button */}
                <button
                  type="button"
                  onClick={() => setDealModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#D5D2CA] hover:border-accent hover:bg-[#FAF4F2] text-xs font-semibold text-ink-muted hover:text-accent transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="text-sm leading-none">+</span>
                  <span>Add Deal to {stage.name}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modals ───────────────────────────────────── */}
      <NewDealModal
        isOpen={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSubmit={handleCreateDeal}
      />
      <NewLeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSubmit={handleCaptureLead}
      />
    </div>
  );
}
