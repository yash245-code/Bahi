'use client';

import { useState } from 'react';
import { CrmNav } from '../components/CrmNav';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';

interface CompanyItem {
  id: string;
  name: string;
  domain: string;
  industry: string;
  tier: 'Strategic' | 'Enterprise' | 'Mid-Market' | 'SMB';
  activeDealsCount: number;
  dealVolume: string;
  dealAmount: number;
  headquarters: string;
  employees: string;
  primaryContact: { name: string; email: string };
}

const initialCompanies: CompanyItem[] = [
  {
    id: 'CMP-101',
    name: 'TechStart Inc.',
    domain: 'techstart.io',
    industry: 'Enterprise Software',
    tier: 'Enterprise',
    activeDealsCount: 2,
    dealVolume: '$38,200',
    dealAmount: 38200,
    headquarters: 'San Francisco, CA',
    employees: '250–500',
    primaryContact: { name: 'Sarah Chen', email: 'sarah@techstart.io' },
  },
  {
    id: 'CMP-102',
    name: 'DataFlow Corp',
    domain: 'dataflow.com',
    industry: 'Supply Chain & Logistics',
    tier: 'Strategic',
    activeDealsCount: 3,
    dealVolume: '$74,500',
    dealAmount: 74500,
    headquarters: 'Chicago, IL',
    employees: '1,000+',
    primaryContact: { name: 'Marcus Rodriguez', email: 'marcus@dataflow.com' },
  },
  {
    id: 'CMP-103',
    name: 'NexGen Systems',
    domain: 'nexgen.dev',
    industry: 'Cloud Infrastructure',
    tier: 'Enterprise',
    activeDealsCount: 2,
    dealVolume: '$52,000',
    dealAmount: 52000,
    headquarters: 'Austin, TX',
    employees: '500–1,000',
    primaryContact: { name: 'Alex Vance', email: 'cto@nexgen.dev' },
  },
  {
    id: 'CMP-104',
    name: 'BrightWave Retailers',
    domain: 'brightwave.co',
    industry: 'E-Commerce & Retail',
    tier: 'Mid-Market',
    activeDealsCount: 1,
    dealVolume: '$18,500',
    dealAmount: 18500,
    headquarters: 'Seattle, WA',
    employees: '100–250',
    primaryContact: { name: 'Lisa Tanaka', email: 'team@brightwave.co' },
  },
  {
    id: 'CMP-105',
    name: 'Summit Digital Group',
    domain: 'summit.io',
    industry: 'Financial Technology',
    tier: 'Strategic',
    activeDealsCount: 2,
    dealVolume: '$67,000',
    dealAmount: 67000,
    headquarters: 'New York, NY',
    employees: '1,500+',
    primaryContact: { name: 'David Okafor', email: 'ops@summit.io' },
  },
  {
    id: 'CMP-106',
    name: 'CloudBase Ltd',
    domain: 'cloudbase.io',
    industry: 'Data & Analytics',
    tier: 'SMB',
    activeDealsCount: 1,
    dealVolume: '$9,400',
    dealAmount: 9400,
    headquarters: 'Denver, CO',
    employees: '25–50',
    primaryContact: { name: 'Emily Zhang', email: 'team@cloudbase.io' },
  },
];

export function CrmCompaniesView() {
  const [companies] = useState<CompanyItem[]>(initialCompanies);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  const totalVolume = companies.reduce((acc, c) => acc + c.dealAmount, 0);

  const filtered = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || c.tier.toLowerCase() === tierFilter.toLowerCase();
    return matchesSearch && matchesTier;
  });

  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Persistent CRM Navigation Header ─────────── */}
      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
        totalPipelineValue={`$${totalVolume.toLocaleString()}`}
        activeDealsCount={companies.length}
      />

      {/* ── Summary Stats ────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Managed Accounts</span>
          <span className="text-2xl font-black text-ink mt-1 font-mono">{companies.length}</span>
          <span className="text-[11px] text-[#1F7A4D] font-medium block mt-1">100% active standing</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Combined Deal Value</span>
          <span className="text-2xl font-black text-accent mt-1 font-mono">${totalVolume.toLocaleString()}</span>
          <span className="text-[11px] text-ink-muted block mt-1">Across 11 active deals</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Strategic Tier</span>
          <span className="text-2xl font-black text-purple-700 mt-1 font-mono">
            {companies.filter((c) => c.tier === 'Strategic').length}
          </span>
          <span className="text-[11px] text-ink-muted block mt-1">&gt; $60K deal volume</span>
        </div>

        <div className="card p-4">
          <span className="text-ink-muted text-xs font-semibold block">Avg Account Size</span>
          <span className="text-2xl font-black text-[#1F7A4D] mt-1 font-mono">
            ${Math.round(totalVolume / (companies.length || 1)).toLocaleString()}
          </span>
          <span className="text-[11px] text-ink-muted block mt-1">Annual pipeline average</span>
        </div>
      </div>

      {/* ── Search & Filter Controls ─────────────────── */}
      <div className="card p-3 flex flex-wrap items-center justify-between gap-3 bg-white shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[260px] max-w-md">
          <div className="relative w-full">
            <svg className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search companies, domains, industries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#FAF9F5] border border-border rounded-lg text-ink placeholder:text-ink-muted outline-none focus:border-accent focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-ink-muted text-[11px] font-medium mr-1">Tier:</span>
          {['all', 'Strategic', 'Enterprise', 'Mid-Market', 'SMB'].map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                tierFilter.toLowerCase() === t.toLowerCase()
                  ? 'bg-accent text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-ink-muted hover:text-ink border border-border'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Companies Grid ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((company) => (
          <div
            key={company.id}
            className="card p-5 hover:border-accent/60 transition-all shadow-xs space-y-4 group"
          >
            {/* Top Row: Name, Domain, Tier */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FAF4F2] to-[#FAF9F5] border border-[#EBD2CB] flex items-center justify-center font-black text-accent text-sm shadow-xs">
                  {company.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink group-hover:text-accent transition-colors">
                    {company.name}
                  </h3>
                  <a
                    href={`https://${company.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-ink-muted hover:text-accent font-mono"
                  >
                    {company.domain} ↗
                  </a>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                company.tier === 'Strategic'
                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                  : company.tier === 'Enterprise'
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-neutral-100 text-neutral-700 border-neutral-200'
              }`}>
                {company.tier}
              </span>
            </div>

            {/* Industry & Headcount */}
            <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-lg bg-[#FAF9F5] border border-border">
              <div>
                <span className="text-[10px] text-ink-muted block">Industry</span>
                <span className="font-semibold text-ink truncate block">{company.industry}</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-muted block">Headcount</span>
                <span className="font-semibold text-ink">{company.employees}</span>
              </div>
            </div>

            {/* Pipeline Exposure */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="text-ink-muted block text-[11px]">Active Deals</span>
                <span className="font-bold text-ink">{company.activeDealsCount} In Pipeline</span>
              </div>
              <div className="text-right">
                <span className="text-ink-muted block text-[11px]">Deal Volume</span>
                <span className="font-bold text-accent font-mono text-sm">{company.dealVolume}</span>
              </div>
            </div>

            {/* Footer Stakeholder */}
            <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-ink-muted">
              <span>Primary: <strong className="text-ink">{company.primaryContact.name}</strong></span>
              <button
                type="button"
                onClick={() => setDealModalOpen(true)}
                className="text-xs font-semibold text-accent hover:underline cursor-pointer"
              >
                + New Deal
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modals ───────────────────────────────────── */}
      <NewDealModal
        isOpen={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSubmit={() => {}}
      />
      <NewLeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSubmit={() => {}}
      />
    </div>
  );
}
