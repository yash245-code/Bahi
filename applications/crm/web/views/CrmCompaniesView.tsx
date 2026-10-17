'use client';

import { useState, useEffect, useCallback } from 'react';
import { CrmNav } from '../components/CrmNav';
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
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyDomain, setNewCompanyDomain] = useState('');
  const [newCompanyIndustry, setNewCompanyIndustry] = useState('Enterprise Software');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3500);
  };

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
      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
        totalPipelineValue={`$${combinedVolume.toLocaleString()}`}
        activeDealsCount={companies.reduce((sum, c) => sum + c.activeDealsCount, 0)}
      />

      {/* ── KPI Telemetry Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Total Corporate Accounts
          </span>
          <div className="text-2xl font-black font-mono text-ink mt-1">
            {totalAccounts}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Active Directory</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Combined Deal Volume
          </span>
          <div className="text-2xl font-black font-mono text-ink mt-1">
            ${combinedVolume.toLocaleString()}
          </div>
          <span className="text-[11px] text-ink-muted">Across all accounts</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Avg Account Volume
          </span>
          <div className="text-2xl font-black font-mono text-ink mt-1">
            ${avgAccountSize.toLocaleString()}
          </div>
          <span className="text-[11px] text-ink-muted">Annualized pipeline attribution</span>
        </div>
      </div>

      {/* ── Search, Filter & Add Account Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <svg
              className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search companies by name, domain, industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-white text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {['all', 'strategic', 'enterprise', 'mid-market', 'smb'].map((tier) => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border capitalize transition-colors cursor-pointer ${
                  tierFilter === tier
                    ? 'bg-[#20211F] text-white border-[#20211F]'
                    : 'bg-white text-ink-muted border-border hover:bg-neutral-100'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
          <button
            onClick={() => setNewCompanyModalOpen(true)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-[#853526] transition-colors cursor-pointer shadow-xs ml-2"
          >
            + Add Account
          </button>
        </div>
      </div>

      {/* ── Companies Data Table ── */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-border text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                <th className="p-3.5">Company / Domain</th>
                <th className="p-3.5">Industry</th>
                <th className="p-3.5">Tier</th>
                <th className="p-3.5">Active Deals</th>
                <th className="p-3.5">Total Pipeline</th>
                <th className="p-3.5">Account Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ink-muted">
                    No accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-ink">{c.name}</div>
                      <div className="text-[11px] text-ink-muted font-mono">{c.domain}</div>
                    </td>
                    <td className="p-3.5 text-ink-muted">{c.industry}</td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          c.tier === 'Strategic'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : c.tier === 'Enterprise'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {c.tier}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-ink">
                      {c.activeDealsCount}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-ink">
                      {c.dealVolume}
                    </td>
                    <td className="p-3.5 text-ink-muted font-medium">
                      {c.primaryContact.name}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Company Modal ── */}
      {newCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-ink">Register Corporate Account</h3>
            <form onSubmit={handleCreateCompany} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-border bg-white text-ink"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Domain</label>
                <input
                  type="text"
                  placeholder="e.g. acmecorp.com"
                  value={newCompanyDomain}
                  onChange={(e) => setNewCompanyDomain(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-border bg-white text-ink"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Industry</label>
                <input
                  type="text"
                  value={newCompanyIndustry}
                  onChange={(e) => setNewCompanyIndustry(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-border bg-white text-ink"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewCompanyModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-border text-ink-muted hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-[#853526]"
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
        <div className="fixed bottom-6 right-6 z-50 bg-[#20211F] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
