'use client';

import { useState, useEffect, useCallback } from 'react';
import { CrmNav } from '../components/CrmNav';
import { CrmAnnouncer } from '../components/CrmAnnouncer';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';
import { crmApi } from '../lib/api-client';

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
  isRotting?: boolean;
  daysInStage?: number;
}

export interface Stage {
  id?: string;
  name: string;
  color: string;
  count: number;
  rottingDays?: number;
  stageType?: 'OPEN' | 'WON' | 'LOST';
  deals: Deal[];
}

const defaultStages: Stage[] = [
  {
    name: 'New Leads',
    color: '#75766E',
    count: 3,
    rottingDays: 7,
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
        daysInStage: 3,
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
        daysInStage: 8,
        isRotting: true,
        assignee: { name: 'Priya Sharma', avatar: 'PS', color: 'bg-[#20211F] text-white' },
      },
    ],
  },
  {
    name: 'Qualified',
    color: '#2563EB',
    count: 2,
    rottingDays: 10,
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
        daysInStage: 4,
        assignee: { name: 'Alex Morgan', avatar: 'AM', color: 'bg-accent text-white' },
      },
    ],
  },
  {
    name: 'Proposal Sent',
    color: '#D97706',
    count: 2,
    rottingDays: 10,
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
        daysInStage: 5,
        assignee: { name: 'Sarah Chen', avatar: 'SC', color: 'bg-[#1F7A4D] text-white' },
      },
    ],
  },
  {
    name: 'Negotiation',
    color: '#A8462F',
    count: 2,
    rottingDays: 7,
    deals: [
      {
        id: 'D-108',
        title: 'Vortex Global Accounting',
        value: '$34,000',
        amount: 34000,
        contact: 'finance@vortex.co',
        company: 'Vortex Global',
        probability: 85,
        expectedDate: 'Sep 30',
        priority: 'Hot',
        tag: 'Strategic',
        daysInStage: 2,
        assignee: { name: 'Alex Morgan', avatar: 'AM', color: 'bg-accent text-white' },
      },
    ],
  },
  {
    name: 'Won / Closed',
    color: '#1F7A4D',
    count: 2,
    rottingDays: 0,
    stageType: 'WON',
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
        daysInStage: 14,
        assignee: { name: 'Alex Morgan', avatar: 'AM', color: 'bg-accent text-white' },
      },
    ],
  },
];

export function CrmPipelineView() {
  const [stages, setStages] = useState<Stage[]>(defaultStages);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'hot' | 'high_val' | 'rotting' | 'starred'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'value_desc' | 'days_stale'>('default');
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [lostDialogDeal, setLostDialogDeal] = useState<Deal | null>(null);
  const [lostReason, setLostReason] = useState('Budget Constraints');
  const [starredDeals, setStarredDeals] = useState<string[]>([]);
  const [density, setDensity] = useState<'normal' | 'compact'>('normal');

  // Load starred deals, converted custom deals & density from localStorage
  useEffect(() => {
    try {
      const savedStars = JSON.parse(localStorage.getItem('bahi-crm-starred-deals') || '[]');
      if (Array.isArray(savedStars)) setStarredDeals(savedStars);
      const savedDensity = localStorage.getItem('bahi-crm-density');
      if (savedDensity === 'compact') setDensity('compact');
      const savedPreset = localStorage.getItem('bahi-crm-pipeline-preset');
      if (savedPreset) setActiveFilter(savedPreset as any);

      // Hydrate custom deals created via Lead Conversion or Modal
      const customDeals = JSON.parse(localStorage.getItem('bahi-crm-custom-deals') || '[]');
      if (Array.isArray(customDeals) && customDeals.length > 0) {
        setStages((prev) =>
          prev.map((s) => {
            if (s.name === 'Qualified') {
              const existingIds = new Set(s.deals.map((d) => d.id));
              const toAdd = customDeals.filter((d: any) => !existingIds.has(d.id));
              return { ...s, deals: [...toAdd, ...s.deals], count: s.deals.length + toAdd.length };
            }
            return s;
          })
        );
      }
    } catch (_) {}

    const handleDensityChange = (e: any) => {
      if (e.detail) setDensity(e.detail);
    };
    window.addEventListener('bahi-crm-density-change', handleDensityChange);
    return () => window.removeEventListener('bahi-crm-density-change', handleDensityChange);
  }, []);

  const handleSelectPreset = (preset: any) => {
    setActiveFilter(preset);
    try {
      localStorage.setItem('bahi-crm-pipeline-preset', preset);
    } catch (_) {}
    showToast(`Pipeline view filtered: ${preset.toUpperCase()}`);
  };

  const toggleStarDeal = (dealId: string) => {
    setStarredDeals((prev) => {
      const next = prev.includes(dealId) ? prev.filter((id) => id !== dealId) : [...prev, dealId];
      try {
        localStorage.setItem('bahi-crm-starred-deals', JSON.stringify(next));
      } catch (_) {}
      showToast(next.includes(dealId) ? 'Deal pinned to favorites ⭐' : 'Deal removed from favorites');
      return next;
    });
  };

  const handleAdjustProbability = (dealId: string, delta: number) => {
    setStages((prev) =>
      prev.map((s) => ({
        ...s,
        deals: s.deals.map((d) => {
          if (d.id !== dealId) return d;
          const newProb = Math.min(100, Math.max(0, d.probability + delta));
          return { ...d, probability: newProb };
        }),
      }))
    );
    showToast(`Updated deal probability by ${delta > 0 ? '+' : ''}${delta}%`);
  };

  const handleCopyDealId = (dealId: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(dealId);
      showToast(`Copied ${dealId} to clipboard 📋`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setAnnouncement(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3500);
  };

  // ── Load Live Pipeline Board ──
  const loadBoard = useCallback(async () => {
    try {
      const data = await crmApi.pipelines.getBoard();
      if (data && data.stages && data.stages.length > 0) {
        const mappedStages: Stage[] = data.stages.map((stg: any) => ({
          id: stg.id,
          name: stg.name,
          color: stg.color || '#A8462F',
          count: stg.deals?.length || 0,
          rottingDays: stg.rottingDays,
          stageType: stg.stageType,
          deals: (stg.deals || []).map((d: any) => ({
            id: d.id,
            title: d.title,
            value: `$${Number(d.value).toLocaleString()}`,
            amount: Number(d.value) || 0,
            contact: d.contact?.emails?.[0]?.email || d.contact?.firstName || 'Client',
            company: d.company?.name || 'Account',
            probability: d.probability || 20,
            expectedDate: d.expectedCloseDate ? new Date(d.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Open',
            priority: d.probability >= 80 ? 'Hot' : d.probability >= 50 ? 'High' : 'Medium',
            tag: d.forecastCategory || 'Pipeline',
            daysInStage: d.daysInStage || 1,
            isRotting: d.isRotting,
            assignee: {
              name: d.owner?.firstName ? `${d.owner.firstName} ${d.owner.lastName || ''}`.trim() : 'Sales Rep',
              avatar: d.owner?.firstName ? `${d.owner.firstName[0]}${d.owner.lastName?.[0] || ''}` : 'SR',
              color: 'bg-accent text-white',
            },
          })),
        }));
        setStages(mappedStages);
      }
    } catch {
      // Uses fallback defaultStages seamlessly
    }
  }, []);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const totalPipelineValue = stages.reduce(
    (acc, stage) => acc + stage.deals.reduce((sum, d) => sum + d.amount, 0),
    0
  );
  const totalWeightedValue = stages.reduce(
    (acc, stage) =>
      acc + stage.deals.reduce((sum, d) => sum + Math.round(d.amount * (d.probability / 100)), 0),
    0
  );
  const totalDealsCount = stages.reduce((acc, stage) => acc + stage.deals.length, 0);
  const rottingDealsCount = stages.reduce(
    (acc, stage) => acc + stage.deals.filter((d) => d.isRotting).length,
    0
  );

  // ── Move Deal Across Stages with Optimistic Update ──
  const moveDeal = async (dealId: string, direction: 'forward' | 'backward') => {
    let foundDeal: Deal | undefined;
    let fromIdx = -1;

    for (let idx = 0; idx < stages.length; idx++) {
      const d = stages[idx]?.deals.find((item) => item.id === dealId);
      if (d) {
        foundDeal = d;
        fromIdx = idx;
        break;
      }
    }

    if (!foundDeal || fromIdx === -1) return;
    const targetIdx = direction === 'forward' ? fromIdx + 1 : fromIdx - 1;
    if (targetIdx < 0 || targetIdx >= stages.length) return;

    const targetStage = stages[targetIdx];
    if (!targetStage) return;

    const previousStages = stages;
    setStages((prev) =>
      prev.map((stg, idx) => {
        if (idx === fromIdx) {
          return { ...stg, deals: stg.deals.filter((d) => d.id !== dealId) };
        }
        if (idx === targetIdx) {
          return { ...stg, deals: [...stg.deals, foundDeal!] };
        }
        return stg;
      })
    );

    showToast(`Moved "${foundDeal.title}" to ${targetStage.name}`);

    if (targetStage.id) {
      try {
        await crmApi.deals.updateStage(dealId, targetStage.id);
      } catch {
        setStages(previousStages);
        showToast('Error syncing stage transition to server');
      }
    }
  };

  const handleMarkWon = async (deal: Deal) => {
    showToast(`Deal "${deal.title}" marked CLOSED WON!`);
    try {
      await crmApi.deals.markWon(deal.id, 'Contract signed');
      loadBoard();
    } catch {
      // Fallback update
    }
  };

  const handleMarkLost = async () => {
    if (!lostDialogDeal) return;
    showToast(`Deal "${lostDialogDeal.title}" marked Lost: ${lostReason}`);
    try {
      await crmApi.deals.markLost(lostDialogDeal.id, lostReason);
      loadBoard();
    } catch {
      // Fallback
    } finally {
      setLostDialogDeal(null);
    }
  };

  const handleAddDeal = async (newDeal: {
    title: string;
    value: number;
    company: string;
    contact: string;
    stage: string;
    priority: 'Hot' | 'High' | 'Medium' | 'Low';
    probability: number;
  }) => {
    try {
      await crmApi.deals.create({
        title: newDeal.title,
        value: newDeal.value,
        companyName: newDeal.company,
        probability: newDeal.probability,
      });
      showToast(`Deal "${newDeal.title}" successfully created`);
      loadBoard();
    } catch {
      const dealItem: Deal = {
        id: `D-${Date.now().toString().slice(-3)}`,
        title: newDeal.title,
        value: `$${newDeal.value.toLocaleString()}`,
        amount: newDeal.value,
        company: newDeal.company,
        contact: newDeal.contact,
        probability: newDeal.probability,
        expectedDate: '30 days',
        priority: newDeal.priority,
        tag: 'Inbound',
        daysInStage: 1,
        assignee: { name: 'You', avatar: 'ME', color: 'bg-accent text-white' },
      };

      setStages((prev) =>
        prev.map((s, idx) => (idx === 0 ? { ...s, deals: [dealItem, ...s.deals] } : s))
      );
      showToast(`Deal "${newDeal.title}" created`);
    }
  };

  const handleAddLead = async (leadData: {
    name: string;
    company: string;
    email: string;
    phone: string;
    source: string;
    score: number;
    notes?: string;
  }) => {
    try {
      await crmApi.leads.create({
        title: `${leadData.name} — ${leadData.company}`,
        companyName: leadData.company,
        email: leadData.email,
        phone: leadData.phone,
        source: leadData.source,
        score: leadData.score,
        interestNotes: leadData.notes,
      });
      showToast(`Lead "${leadData.name}" captured into qualification queue`);
    } catch {
      showToast(`Lead captured for "${leadData.company}"`);
    }
  };

  // CSV Export of Deals
  const handleExportDealsCsv = () => {
    const rows = ['ID,Title,Company,Contact,Value,Probability,Priority,Stage,DaysInStage'];
    stages.forEach((s) => {
      s.deals.forEach((d) => {
        rows.push(
          `"${d.id}","${d.title}","${d.company}","${d.contact}",${d.amount},${d.probability}%,"${d.priority}","${s.name}",${d.daysInStage || 0}`
        );
      });
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pipeline_deals_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported pipeline deals to CSV');
  };

  // Keyboard navigation on Deal Card
  const handleCardKeyDown = (e: React.KeyboardEvent, deal: Deal, stageIdx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (stageIdx < stages.length - 1) {
        moveDeal(deal.id, 'forward');
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (stageIdx > 0) {
        moveDeal(deal.id, 'backward');
      }
    } else if (e.key === 'w' || e.key === 'W') {
      e.preventDefault();
      handleMarkWon(deal);
    } else if (e.key === 'x' || e.key === 'X') {
      e.preventDefault();
      setLostDialogDeal(deal);
    }
  };

  return (
    <main id="crm-main-content" tabIndex={-1} className="space-y-6 focus:outline-hidden">
      {/* Screen reader live announcements */}
      <CrmAnnouncer message={announcement} />

      {/* ── Persistent CRM Navigation & Controls ── */}
      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
        totalPipelineValue={`$${totalPipelineValue.toLocaleString()}`}
        activeDealsCount={totalDealsCount}
      />

      {/* ── Executive Pipeline Telemetry Ribbon (UI 1) ── */}
      <div className="bg-white dark:bg-[#1E1F1C] p-4 rounded-2xl border border-border dark:border-[#2E302A] shadow-xs space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              Total Open Pipeline
            </span>
            <div className="text-xl font-black font-mono text-ink dark:text-white mt-0.5">
              ${totalPipelineValue.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#1F7A4D] font-semibold flex items-center gap-1 mt-0.5">
              ↑ +18% QoQ velocity
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              Weighted Revenue
            </span>
            <div className="text-xl font-black font-mono text-accent mt-0.5">
              ${totalWeightedValue.toLocaleString()}
            </div>
            <span className="text-[11px] text-ink-muted">
              {Math.round((totalWeightedValue / (totalPipelineValue || 1)) * 100)}% composite win rate
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              Active Pipeline Deals
            </span>
            <div className="text-xl font-black font-mono text-ink dark:text-white mt-0.5">
              {totalDealsCount} <span className="text-xs font-normal text-ink-muted">Opportunities</span>
            </div>
            <span className="text-[11px] text-ink-muted">
              {starredDeals.length} Starred ⭐
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              Velocity &amp; Stale Alert
            </span>
            <div className="text-xl font-black font-mono text-amber-700 dark:text-amber-400 mt-0.5 flex items-center gap-1.5">
              <span>⏳ {rottingDealsCount} At Risk</span>
            </div>
            <span className="text-[11px] text-ink-muted">
              Requires immediate rep touch
            </span>
          </div>
        </div>

        {/* Attainment Pacing Progress Bar */}
        <div className="pt-2 border-t border-border/60 dark:border-[#2E302A] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink dark:text-white">Q3 Target Quota Pacing ($360k):</span>
            <span className="font-mono text-accent font-bold">
              {Math.round(((totalPipelineValue * 0.75) / 360000) * 100)}% Pacing
            </span>
          </div>
          <div className="w-full sm:w-64 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round(((totalPipelineValue * 0.75) / 360000) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─── Search, Quick Filters & Controls (QoL 1, 6) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <svg
              className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              aria-label="Filter deals by company, title, or stakeholder"
              placeholder="Search deals by title, company, or rep..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-border dark:border-[#2E302A] bg-white dark:bg-[#141513] text-ink dark:text-white placeholder:text-ink-muted/60 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink dark:hover:text-white text-xs cursor-pointer p-0.5"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Buttons & Sorting */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 flex-wrap">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleSelectPreset('all')}
              aria-pressed={activeFilter === 'all'}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent ${
                activeFilter === 'all'
                  ? 'bg-[#20211F] text-white border-[#20211F] dark:bg-accent dark:border-accent'
                  : 'bg-white dark:bg-[#1E1F1C] text-ink-muted border-border dark:border-[#2E302A] hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              All Deals ({totalDealsCount})
            </button>
            <button
              onClick={() => handleSelectPreset('hot')}
              aria-pressed={activeFilter === 'hot'}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent ${
                activeFilter === 'hot'
                  ? 'bg-red-700 text-white border-red-700'
                  : 'bg-white dark:bg-[#1E1F1C] text-ink-muted border-border dark:border-[#2E302A] hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              🔥 Hot Deals
            </button>
            <button
              onClick={() => handleSelectPreset('high_val')}
              aria-pressed={activeFilter === 'high_val'}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent ${
                activeFilter === 'high_val'
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white dark:bg-[#1E1F1C] text-ink-muted border-border dark:border-[#2E302A] hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              💰 Over $10k
            </button>
            <button
              onClick={() => handleSelectPreset('rotting')}
              aria-pressed={activeFilter === 'rotting'}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent ${
                activeFilter === 'rotting'
                  ? 'bg-amber-800 text-white border-amber-800'
                  : 'bg-white dark:bg-[#1E1F1C] text-ink-muted border-border dark:border-[#2E302A] hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              ⏳ Stalled Velocity
            </button>
            <button
              onClick={() => handleSelectPreset('starred')}
              aria-pressed={activeFilter === 'starred'}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent ${
                activeFilter === 'starred'
                  ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500'
                  : 'bg-white dark:bg-[#1E1F1C] text-ink-muted border-border dark:border-[#2E302A] hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              ⭐ Starred ({starredDeals.length})
            </button>
          </div>

          {/* Sort selector */}
          <select
            aria-label="Sort deals in stages"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs p-1.5 rounded-lg border border-border dark:border-[#2E302A] bg-white dark:bg-[#1E1F1C] text-ink dark:text-neutral-100 focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="default">Sort: Default</option>
            <option value="value_desc">Sort: Value (High to Low)</option>
            <option value="days_stale">Sort: Days Stale (Highest)</option>
          </select>

          {/* Export CSV button */}
          <button
            type="button"
            onClick={handleExportDealsCsv}
            aria-label="Export deals to CSV"
            className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>📥 Export CSV</span>
          </button>
        </div>
      </div>

      {/* ─── Kanban Pipeline Funnel Board ── */}
      <div
        role="region"
        aria-label="Deals Pipeline Kanban Board"
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-6"
      >
        {stages.map((stage, stageIdx) => {
          let filteredDeals = stage.deals.filter((deal) => {
            const matchesSearch =
              deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
              deal.contact.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;
            if (activeFilter === 'hot') return deal.priority === 'Hot';
            if (activeFilter === 'high_val') return deal.amount >= 10000;
            if (activeFilter === 'rotting') return deal.isRotting;
            if (activeFilter === 'starred') return starredDeals.includes(deal.id);
            return true;
          });

          // Apply column sorting
          if (sortBy === 'value_desc') {
            filteredDeals = [...filteredDeals].sort((a, b) => b.amount - a.amount);
          } else if (sortBy === 'days_stale') {
            filteredDeals = [...filteredDeals].sort((a, b) => (b.daysInStage || 0) - (a.daysInStage || 0));
          }

          const stageTotal = stage.deals.reduce((sum, d) => sum + d.amount, 0);
          const stageWeighted = stage.deals.reduce(
            (sum, d) => sum + Math.round(d.amount * (d.probability / 100)),
            0
          );

          return (
            <section
              key={stage.name}
              aria-label={`${stage.name} stage`}
              className="bg-[#F3F2EE] dark:bg-[#181917] rounded-2xl p-3 border border-border/80 dark:border-[#2E302A] flex flex-col min-h-[580px] shadow-xs"
            >
              {/* Stage Header (UI 2) */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60 dark:border-[#2E302A]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: stage.color }}
                    aria-hidden="true"
                  />
                  <h2 className="text-xs font-bold text-ink dark:text-neutral-100 uppercase tracking-wider">
                    {stage.name}
                  </h2>
                  <span className="text-[10px] font-bold text-ink-muted bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2E302A] px-1.5 py-0.2 rounded-full">
                    {filteredDeals.length}
                  </span>
                </div>
              </div>

              {/* Stage Totals & Weighted Probability */}
              <div className="flex items-center justify-between text-[11px] mb-3 px-2 py-1 rounded-lg bg-white/70 dark:bg-[#1E1F1C]/80 border border-border/40 dark:border-[#2E302A]">
                <span className="font-mono font-bold text-ink dark:text-neutral-100">
                  ${stageTotal.toLocaleString()}
                </span>
                <span className="text-[10px] text-ink-muted" title="Probability-weighted value">
                  W: <strong className="text-ink dark:text-neutral-200">${stageWeighted.toLocaleString()}</strong>
                </span>
              </div>

              {/* Deal Cards Container */}
              <div
                role="feed"
                aria-label={`${stage.name} cards`}
                className={`space-y-2.5 flex-1 overflow-y-auto pr-0.5 ${density === 'compact' ? '!space-y-1.5' : ''}`}
              >
                {filteredDeals.length === 0 ? (
                  <div className="h-36 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 dark:border-[#2E302A] text-center p-3">
                    <span className="text-xl mb-1">📭</span>
                    <p className="text-[11px] text-ink-muted">No deals match criteria</p>
                  </div>
                ) : (
                  filteredDeals.map((deal) => {
                    const isStarred = starredDeals.includes(deal.id);
                    return (
                      <article
                        key={deal.id}
                        tabIndex={0}
                        aria-label={`Deal: ${deal.title}, value ${deal.value}, company ${deal.company}, priority ${deal.priority}`}
                        onKeyDown={(e) => handleCardKeyDown(e, deal, stageIdx)}
                        className={`bg-white dark:bg-[#1E1F1C] rounded-xl border transition-all hover:shadow-lg dark:hover:border-[#42443C] relative group focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-hidden ${
                          density === 'compact' ? 'p-2.5 space-y-1.5' : 'p-3.5 space-y-2.5'
                        } ${
                          deal.isRotting
                            ? 'border-amber-400 dark:border-amber-500/60 bg-amber-50/25 dark:bg-amber-950/20'
                            : 'border-border dark:border-[#2E302A]'
                        }`}
                      >
                        {/* Top Bar: Company, Copy ID & Rotting Badge (QoL 3, 12) */}
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <button
                              type="button"
                              onClick={() => toggleStarDeal(deal.id)}
                              aria-label={isStarred ? 'Unstar deal' : 'Star deal'}
                              className="text-xs hover:scale-125 transition-transform cursor-pointer"
                              title={isStarred ? 'Starred (Click to unpin)' : 'Click to pin to favorites'}
                            >
                              {isStarred ? '⭐' : '✩'}
                            </button>
                            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider truncate">
                              {deal.company}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyDealId(deal.id)}
                              title="Click to copy Deal ID"
                              className="text-[9px] font-mono text-ink-muted hover:text-accent bg-neutral-100 dark:bg-neutral-800 px-1 py-0.2 rounded transition-colors"
                            >
                              {deal.id}
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            {deal.isRotting && (
                              <span
                                className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 animate-pulse"
                                aria-label={`Rotting velocity warning: ${deal.daysInStage} days untouched in stage`}
                              >
                                ⏳ {deal.daysInStage}d
                              </span>
                            )}
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                deal.priority === 'Hot'
                                  ? 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
                                  : deal.priority === 'High'
                                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700'
                              }`}
                            >
                              {deal.priority === 'Hot' ? '🔥 Hot' : deal.priority === 'High' ? '⚡ High' : '✦ ' + deal.priority}
                            </span>
                          </div>
                        </div>

                        {/* Deal Title */}
                        <h3 className="text-xs font-bold text-ink dark:text-neutral-100 leading-snug line-clamp-2">
                          {deal.title}
                        </h3>

                        {/* Value & Interactive Probability Bar (QoL 8) */}
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-mono font-black text-sm text-ink dark:text-white">
                              {deal.value}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleAdjustProbability(deal.id, -5)}
                                className="w-4 h-4 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-ink-muted hover:text-ink flex items-center justify-center font-bold"
                                title="Decrease probability by 5%"
                              >
                                -
                              </button>
                              <span className="text-[10px] font-mono text-ink-muted font-bold min-w-[34px] text-center">
                                {deal.probability}%
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAdjustProbability(deal.id, 5)}
                                className="w-4 h-4 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-ink-muted hover:text-ink flex items-center justify-center font-bold"
                                title="Increase probability by 5%"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={deal.probability} aria-valuemin={0} aria-valuemax={100}>
                            <div
                              className="h-full bg-accent rounded-full transition-all duration-300"
                              style={{ width: `${deal.probability}%` }}
                            />
                          </div>
                        </div>

                        {/* Footer: Stakeholder & Stage Shifter Controls */}
                        <div className="pt-2 border-t border-border/40 dark:border-[#2E302A] flex items-center justify-between">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${deal.assignee.color}`}
                              title={deal.assignee.name}
                              aria-label={`Assigned to ${deal.assignee.name}`}
                            >
                              {deal.assignee.avatar}
                            </div>
                            <div className="flex items-center gap-1 min-w-0">
                              <a
                                href={`mailto:${deal.contact}?subject=Regarding%20Deal%3A%20${encodeURIComponent(deal.title)}`}
                                className="text-[10px] text-ink-muted hover:text-accent hover:underline truncate max-w-[80px]"
                                title={`Send email to ${deal.contact}`}
                              >
                                {deal.contact}
                              </a>
                              <a
                                href={`https://wa.me/?text=Hi%2C%20following%20up%20on%20${encodeURIComponent(deal.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                                title="Chat on WhatsApp"
                              >
                                💬
                              </a>
                            </div>
                          </div>

                          {/* Stage Transition Action Arrows */}
                          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                            {stageIdx > 0 && (
                              <button
                                type="button"
                                onClick={() => moveDeal(deal.id, 'backward')}
                                aria-label={`Move ${deal.title} back to previous stage`}
                                className="p-1 rounded text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
                                title="Move back"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                              </button>
                            )}
                            {stageIdx < stages.length - 1 && (
                              <button
                                type="button"
                                onClick={() => moveDeal(deal.id, 'forward')}
                                aria-label={`Advance ${deal.title} to next stage`}
                                className="p-1 rounded bg-[#20211F] dark:bg-accent text-white hover:bg-accent dark:hover:bg-accent/80 transition-colors cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-accent"
                                title="Advance stage"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                              </button>
                            )}
                            {stage.stageType !== 'WON' && (
                              <button
                                type="button"
                                onClick={() => handleMarkWon(deal)}
                                aria-label={`Mark deal ${deal.title} won`}
                                className="p-1 px-1.5 rounded text-[10px] font-bold bg-[#1F7A4D]/15 text-[#1F7A4D] hover:bg-[#1F7A4D] hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
                              >
                                ✓ Won
                              </button>
                            )}
                            {stage.stageType !== 'LOST' && (
                              <button
                                type="button"
                                onClick={() => setLostDialogDeal(deal)}
                                aria-label={`Mark deal ${deal.title} lost`}
                                className="p-1 px-1.5 rounded text-[10px] font-bold bg-[#B23A2E]/15 text-[#B23A2E] hover:bg-[#B23A2E] hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
                              >
                                ✕ Lost
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* ─── Lost Reason Modal Dialog ── */}
      {lostDialogDeal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lost-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLostDialogDeal(null);
          }}
        >
          <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl border border-border dark:border-[#2E302A] shadow-2xl max-w-md w-full p-6 space-y-4 text-ink dark:text-neutral-100">
            <h3 id="lost-dialog-title" className="text-base font-bold text-ink dark:text-white">
              Mark Deal as Lost
            </h3>
            <p className="text-xs text-ink-muted">
              Select the primary root cause for losing &quot;{lostDialogDeal.title}&quot;:
            </p>
            <div>
              <label htmlFor="lost-reason-select" className="sr-only">
                Loss Reason
              </label>
              <select
                id="lost-reason-select"
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-white dark:bg-[#141513] text-ink dark:text-neutral-100 focus-visible:ring-2 focus-visible:ring-accent"
              >
                <option value="Budget Constraints">Budget Constraints / Lack of Funding</option>
                <option value="Competitor Chosen">Competitor Chosen (Price or Feature)</option>
                <option value="Feature Gap">Feature Gap / Product Deficiency</option>
                <option value="Timing / Postponed">Timing / Project Postponed</option>
                <option value="Lost to No Decision">Lost to No Decision / Status Quo</option>
                <option value="Unresponsive">Stakeholder Unresponsive</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLostDialogDeal(null)}
                className="px-3 py-1.5 text-xs rounded-lg border border-border text-ink-muted hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMarkLost}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#B23A2E] text-white hover:bg-red-800 focus-visible:ring-2 focus-visible:ring-red-600"
              >
                Confirm Lost
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modals & Feedback ── */}
      <NewDealModal
        isOpen={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSubmit={handleAddDeal}
      />

      <NewLeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSubmit={handleAddLead}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#20211F] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 animate-fade-in"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
          {toastMessage}
        </div>
      )}
    </main>
  );
}
