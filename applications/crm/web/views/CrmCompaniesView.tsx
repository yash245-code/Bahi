'use client';

import { useState, useEffect, useCallback } from 'react';
import { CrmNav } from '../components/CrmNav';
import { CrmAnnouncer } from '../components/CrmAnnouncer';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';
import { crmApi } from '../lib/api-client';

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
    name: 'BrightWave Retail',
    domain: 'brightwave.co',
    industry: 'Omnichannel Commerce',
    tier: 'Mid-Market',
    activeDealsCount: 1,
    dealVolume: '$18,500',
    dealAmount: 18500,
    headquarters: 'Seattle, WA',
    employees: '100–250',
    primaryContact: { name: 'Liam Foster', email: 'liam@brightwave.co' },
  },
];

export function CrmCompaniesView() {
  const [companies, setCompanies] = useState<CompanyItem[]>(initialCompanies);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [newCompanyModalOpen, setNewCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(null);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyDomain, setNewCompanyDomain] = useState('');
  const [newCompanyIndustry, setNewCompanyIndustry] = useState('Enterprise Software');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [density, setDensity] = useState<'normal' | 'compact'>('normal');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setAnnouncement(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      showToast(`Copied ${label} to clipboard: ${text}`);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDensity = (localStorage.getItem('bahi-crm-density') as 'normal' | 'compact') || 'normal';
      setDensity(savedDensity);
      const handleDensityChange = (e: any) => {
        if (e.detail?.density) setDensity(e.detail.density);
      };
      window.addEventListener('bahi-crm-density-change', handleDensityChange);
      return () => window.removeEventListener('bahi-crm-density-change', handleDensityChange);
    }
  }, []);

  const loadCompanies = useCallback(async () => {
    try {
      const data = await crmApi.companies.list();
      if (data && data.length > 0) {
        setCompanies(
          data.map((c: any) => ({
            id: c.id,
            name: c.name,
            domain: c.domain || 'N/A',
            industry: c.industry || 'General',
            tier: c.accountTier === 'STRATEGIC' ? 'Strategic' : c.accountTier === 'ENTERPRISE' ? 'Enterprise' : c.accountTier === 'MID_MARKET' ? 'Mid-Market' : 'SMB',
            activeDealsCount: c.dealsCount || 0,
            dealVolume: `$${(c.totalVolume || 0).toLocaleString()}`,
            dealAmount: c.totalVolume || 0,
            headquarters: 'Global HQ',
            employees: c.size || '50-200',
            primaryContact: {
              name: c.owner ? `${c.owner.firstName} ${c.owner.lastName || ''}`.trim() : 'Unassigned',
              email: c.owner?.email || 'N/A',
            },
          }))
        );
      }
    } catch {
      // Keep initialCompanies fallback
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName) return;

    try {
      await crmApi.companies.create({
        name: newCompanyName,
        domain: newCompanyDomain,
        industry: newCompanyIndustry,
        accountTier: 'ENTERPRISE',
      });
      showToast(`Account "${newCompanyName}" registered`);
      loadCompanies();
    } catch {
      const created: CompanyItem = {
        id: `CMP-${Date.now().toString().slice(-3)}`,
        name: newCompanyName,
        domain: newCompanyDomain || 'domain.com',
        industry: newCompanyIndustry,
        tier: 'Enterprise',
        activeDealsCount: 0,
        dealVolume: '$0',
        dealAmount: 0,
        headquarters: 'HQ',
        employees: '50-200',
        primaryContact: { name: 'You', email: 'owner@acmecorp.com' },
      };
      setCompanies((prev) => [created, ...prev]);
      showToast(`Account "${newCompanyName}" registered`);
    } finally {
      setNewCompanyModalOpen(false);
      setNewCompanyName('');
      setNewCompanyDomain('');
    }
  };

  const handleExportCsv = () => {
    const rows = ['ID,Company,Domain,Industry,Tier,ActiveDeals,DealVolume,PrimaryContact'];
    filteredCompanies.forEach((c) => {
      rows.push(
        `"${c.id}","${c.name}","${c.domain}","${c.industry}","${c.tier}",${c.activeDealsCount},"${c.dealVolume}","${c.primaryContact.name} (${c.primaryContact.email})"`
      );
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `companies_accounts_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredCompanies.length} company accounts to CSV.`);
  };

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier =
      tierFilter === 'all' || c.tier.toLowerCase() === tierFilter.toLowerCase();

    return matchesSearch && matchesTier;
  });

  const totalAccounts = companies.length;
  const combinedVolume = companies.reduce((sum, c) => sum + c.dealAmount, 0);
  const avgAccountSize = totalAccounts > 0 ? Math.round(combinedVolume / totalAccounts) : 0;

  return (
    <div className="space-y-6">
      <CrmAnnouncer message={announcement} />

      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
        totalPipelineValue={`$${combinedVolume.toLocaleString()}`}
        activeDealsCount={companies.reduce((sum, c) => sum + c.activeDealsCount, 0)}
      />

      {/* ── KPI Telemetry Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-4 border border-border dark:border-[#2E302A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-[#A0A29C]">
            Total Corporate Accounts
          </span>
          <div className="text-2xl font-black font-mono text-ink dark:text-[#F7F6F3] mt-1">
            {totalAccounts}
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Active Directory</span>
        </div>
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-4 border border-border dark:border-[#2E302A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-[#A0A29C]">
            Combined Deal Volume
          </span>
          <div className="text-2xl font-black font-mono text-ink dark:text-[#F7F6F3] mt-1">
            ${combinedVolume.toLocaleString()}
          </div>
          <span className="text-[11px] text-ink-muted dark:text-[#A0A29C]">Across all accounts</span>
        </div>
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-4 border border-border dark:border-[#2E302A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-[#A0A29C]">
            Avg Account Volume
          </span>
          <div className="text-2xl font-black font-mono text-ink dark:text-[#F7F6F3] mt-1">
            ${avgAccountSize.toLocaleString()}
          </div>
          <span className="text-[11px] text-ink-muted dark:text-[#A0A29C]">Annualized pipeline attribution</span>
        </div>
      </div>

      {/* ── Search, Filter & Add Account Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <svg
              className="w-4 h-4 text-ink-muted dark:text-[#A0A29C] absolute left-3 top-1/2 -translate-y-1/2"
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
              aria-label="Filter companies by name, domain, or industry"
              placeholder="Search companies by name, domain, industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-border dark:border-[#2E302A] bg-white dark:bg-[#1E1F1C] text-ink dark:text-[#F7F6F3] placeholder:text-ink-muted/60 dark:placeholder:text-[#A0A29C]/50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-[#A0A29C] hover:text-ink dark:hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          <span className="text-[11px] font-mono text-ink-muted dark:text-[#A0A29C] whitespace-nowrap hidden sm:inline">
            {filteredCompanies.length} of {companies.length}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            {['all', 'strategic', 'enterprise', 'mid-market', 'smb'].map((tier) => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                aria-pressed={tierFilter === tier}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border capitalize transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent ${
                  tierFilter === tier
                    ? 'bg-[#20211F] text-white dark:bg-white dark:text-[#20211F] border-[#20211F] dark:border-white shadow-2xs'
                    : 'bg-white dark:bg-[#1E1F1C] text-ink-muted dark:text-[#A0A29C] border-border dark:border-[#2E302A] hover:bg-neutral-100 dark:hover:bg-[#252722]'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            aria-label="Export companies to CSV"
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setNewCompanyModalOpen(true)}
            aria-label="Register new corporate account"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-[#853526] transition-colors cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-accent"
          >
            + Add Account
          </button>
        </div>
      </div>

      {/* ── Companies Data Table ── */}
      <div
        role="region"
        aria-label="Companies directory table"
        className="bg-white dark:bg-[#1E1F1C] rounded-2xl border border-border dark:border-[#2E302A] overflow-hidden shadow-xs"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] dark:bg-[#141513] border-b border-border dark:border-[#2E302A] text-[11px] font-bold text-ink-muted dark:text-[#A0A29C] uppercase tracking-wider">
                <th scope="col" className={density === 'compact' ? 'py-2 px-3' : 'p-3.5'}>Company / Domain</th>
                <th scope="col" className={density === 'compact' ? 'py-2 px-3' : 'p-3.5'}>Industry</th>
                <th scope="col" className={density === 'compact' ? 'py-2 px-3' : 'p-3.5'}>Tier</th>
                <th scope="col" className={density === 'compact' ? 'py-2 px-3' : 'p-3.5'}>Active Deals</th>
                <th scope="col" className={density === 'compact' ? 'py-2 px-3' : 'p-3.5'}>Total Pipeline</th>
                <th scope="col" className={density === 'compact' ? 'py-2 px-3' : 'p-3.5'}>Account Owner</th>
                <th scope="col" className={`${density === 'compact' ? 'py-2 px-3' : 'p-3.5'} text-right`}>360 View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-[#2E302A]">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-ink-muted dark:text-[#A0A29C]">
                    No accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/80 dark:hover:bg-[#252722] transition-colors">
                    <td className={density === 'compact' ? 'py-2 px-3' : 'p-3.5'}>
                      <div className="font-bold text-ink dark:text-[#F7F6F3]">{c.name}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-ink-muted dark:text-[#A0A29C] font-mono">
                        <span>{c.domain}</span>
                        {c.domain !== 'N/A' && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(c.domain, 'domain')}
                            title="Copy domain"
                            className="text-ink-muted dark:text-[#A0A29C] hover:text-accent text-[10px] cursor-pointer"
                          >
                            📋
                          </button>
                        )}
                      </div>
                    </td>
                    <td className={`${density === 'compact' ? 'py-2 px-3' : 'p-3.5'} text-ink-muted dark:text-[#A0A29C]`}>{c.industry}</td>
                    <td className={density === 'compact' ? 'py-2 px-3' : 'p-3.5'}>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          c.tier === 'Strategic'
                            ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-800/40'
                            : c.tier === 'Enterprise'
                            ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-800/40'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
                        }`}
                      >
                        {c.tier}
                      </span>
                    </td>
                    <td className={`${density === 'compact' ? 'py-2 px-3' : 'p-3.5'} font-mono font-bold text-ink dark:text-[#F7F6F3]`}>
                      {c.activeDealsCount}
                    </td>
                    <td className={`${density === 'compact' ? 'py-2 px-3' : 'p-3.5'} font-mono font-bold text-ink dark:text-[#F7F6F3]`}>
                      {c.dealVolume}
                    </td>
                    <td className={`${density === 'compact' ? 'py-2 px-3' : 'p-3.5'} text-ink-muted dark:text-[#A0A29C] font-medium`}>
                      <div className="text-ink dark:text-[#F7F6F3]">{c.primaryContact.name}</div>
                      {c.primaryContact.email !== 'N/A' && (
                        <div className="flex items-center gap-1 text-[10px] font-mono">
                          <span>{c.primaryContact.email}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(c.primaryContact.email, 'email')}
                            title="Copy email"
                            className="hover:text-accent cursor-pointer"
                          >
                            📋
                          </button>
                        </div>
                      )}
                    </td>
                    <td className={`${density === 'compact' ? 'py-2 px-3' : 'p-3.5'} text-right`}>
                      <button
                        type="button"
                        onClick={() => setSelectedCompany(c)}
                        aria-label={`View 360 profile for ${c.name}`}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-[#2A2B27] hover:bg-neutral-200 dark:hover:bg-[#343630] text-ink dark:text-[#F7F6F3] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        Profile 360 →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 360 Account Profile Drawer ── */}
      {selectedCompany && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="company-360-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCompany(null);
          }}
        >
          <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl border border-border dark:border-[#2E302A] shadow-2xl max-w-lg w-full p-6 space-y-4 text-ink dark:text-[#F7F6F3]">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2E302A]">
              <div>
                <span className="text-[10px] font-mono text-ink-muted dark:text-[#A0A29C] uppercase">Account 360</span>
                <h3 id="company-360-title" className="text-xl font-bold text-ink dark:text-[#F7F6F3]">
                  {selectedCompany.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                aria-label="Close account modal"
                className="text-ink-muted dark:text-[#A0A29C] hover:text-ink dark:hover:text-white text-sm p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#252722]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF9F5] dark:bg-[#141513] p-3 rounded-xl border border-border dark:border-[#2E302A]">
              <div>
                <span className="text-ink-muted dark:text-[#A0A29C] text-[10px] font-bold uppercase">Industry &amp; Tier</span>
                <div className="font-semibold text-ink dark:text-[#F7F6F3] mt-0.5">{selectedCompany.industry}</div>
                <div className="text-[11px] font-bold text-accent">{selectedCompany.tier} Account</div>
              </div>
              <div>
                <span className="text-ink-muted dark:text-[#A0A29C] text-[10px] font-bold uppercase">Location &amp; Size</span>
                <div className="font-semibold text-ink dark:text-[#F7F6F3] mt-0.5">{selectedCompany.headquarters}</div>
                <div className="text-ink-muted dark:text-[#A0A29C]">{selectedCompany.employees} Employees</div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border dark:border-[#2E302A] text-xs space-y-1">
              <span className="text-ink-muted dark:text-[#A0A29C] text-[10px] font-bold uppercase">Pipeline Impact</span>
              <div className="flex justify-between items-center text-sm font-mono font-bold text-ink dark:text-[#F7F6F3]">
                <span>Total Active Deals: {selectedCompany.activeDealsCount}</span>
                <span className="text-accent text-base">{selectedCompany.dealVolume}</span>
              </div>
              <div className="text-ink-muted dark:text-[#A0A29C] text-[11px] pt-1">
                Primary Sponsor: <strong className="text-ink dark:text-[#F7F6F3]">{selectedCompany.primaryContact.name}</strong> ({selectedCompany.primaryContact.email})
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border dark:border-[#2E302A]">
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="btn-primary text-xs py-2 px-4"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Company Modal ── */}
      {newCompanyModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-account-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setNewCompanyModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl border border-border dark:border-[#2E302A] shadow-2xl max-w-md w-full p-6 space-y-4 text-ink dark:text-[#F7F6F3]">
            <h3 id="add-account-dialog-title" className="text-base font-bold text-ink dark:text-[#F7F6F3]">
              Register Corporate Account
            </h3>
            <form onSubmit={handleCreateCompany} className="space-y-3 text-xs">
              <div>
                <label htmlFor="new-comp-name" className="text-xs font-semibold text-ink dark:text-[#F7F6F3] block mb-1">
                  Company Name *
                </label>
                <input
                  id="new-comp-name"
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-[#F7F6F3] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="new-comp-domain" className="text-xs font-semibold text-ink dark:text-[#F7F6F3] block mb-1">
                  Domain Website
                </label>
                <input
                  id="new-comp-domain"
                  type="text"
                  placeholder="e.g. acmecorp.com"
                  value={newCompanyDomain}
                  onChange={(e) => setNewCompanyDomain(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-[#F7F6F3] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="new-comp-ind" className="text-xs font-semibold text-ink dark:text-[#F7F6F3] block mb-1">
                  Industry
                </label>
                <input
                  id="new-comp-ind"
                  type="text"
                  value={newCompanyIndustry}
                  onChange={(e) => setNewCompanyIndustry(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-[#F7F6F3] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border dark:border-[#2E302A]">
                <button
                  type="button"
                  onClick={() => setNewCompanyModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-border dark:border-[#2E302A] text-ink-muted dark:text-[#A0A29C] hover:bg-neutral-100 dark:hover:bg-[#252722]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-[#853526] focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewDealModal
        isOpen={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSubmit={() => showToast('Deal created')}
      />

      <NewLeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSubmit={() => showToast('Lead captured')}
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
    </div>
  );
}
