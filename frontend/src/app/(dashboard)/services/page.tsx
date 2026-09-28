'use client';

import { useState } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface ServiceDefinition {
  code: string;
  name: string;
  category: string;
  version: string;
  status: 'operational' | 'degraded' | 'maintenance';
  p99Latency: string;
  errorRate: string;
  syncStatus: string;
  globalEnabled: boolean;
  tierAccess: {
    starter: boolean;
    professional: boolean;
    enterprise: boolean;
  };
  description: string;
}

interface TenantServiceProfile {
  id: string;
  name: string;
  slug: string;
  tier: 'Starter' | 'Professional' | 'Enterprise';
  status: 'active' | 'suspended' | 'trial';
  seats: number;
  apiUsage: string;
  storage: string;
  enabledModules: Record<string, boolean>;
  moduleStats: Record<string, string>;
}

import { getAllApplications } from '@bahi/applications';

const categoryMap: Record<string, string> = {
  crm: 'Revenue Operations',
  sales: 'Commercial',
  inventory: 'Supply Chain',
  accounting: 'Financial Core',
  hr: 'People Ops',
  projects: 'Productivity',
};

const initialServices: ServiceDefinition[] = getAllApplications().map((app) => ({
  code: app.id,
  name: app.name,
  category: categoryMap[app.id] || 'Business Operations',
  version: `v${app.version}`,
  status: app.id === 'projects' ? 'degraded' : 'operational',
  p99Latency: app.id === 'projects' ? '48ms' : app.id === 'inventory' ? '16ms' : '12ms',
  errorRate: app.id === 'projects' ? '0.12%' : '0.01%',
  syncStatus: app.id === 'projects' ? 'Sync Queue Backlog (94 items)' : 'In-Sync & Connected',
  globalEnabled: true,
  tierAccess: {
    starter: app.plans.includes('starter'),
    professional: app.plans.includes('growth'),
    enterprise: app.plans.includes('enterprise'),
  },
  description: app.description,
}));

const initialTenants: TenantServiceProfile[] = [
  {
    id: 't-01',
    name: 'Acme Corp',
    slug: 'acme-corp',
    tier: 'Enterprise',
    status: 'active',
    seats: 45,
    apiUsage: '98.4K req/mo',
    storage: '14.2 GB',
    enabledModules: {
      crm: true,
      sales: true,
      inventory: true,
      accounting: true,
      hr: true,
      projects: true,
    },
    moduleStats: {
      crm: '42 Active Leads • 18 Opportunities',
      sales: '23 Orders • $68.2K Vol',
      inventory: '156 SKUs • 2 Warehouses',
      accounting: '18 Invoices • 0 Discrepancies',
      hr: '34 Active Staff • 4 Leaves',
      projects: '8 Active Boards • 67 Tasks',
    },
  },
  {
    id: 't-02',
    name: 'Nexus Logistics Global',
    slug: 'nexus-logistics',
    tier: 'Enterprise',
    status: 'active',
    seats: 80,
    apiUsage: '142.1K req/mo',
    storage: '28.5 GB',
    enabledModules: {
      crm: true,
      sales: true,
      inventory: true,
      accounting: true,
      hr: true,
      projects: false,
    },
    moduleStats: {
      crm: '88 Active Leads • 34 Accounts',
      sales: '112 Orders • $240K Vol',
      inventory: '1,420 SKUs • 8 Hubs',
      accounting: '94 Invoices • Reconciled',
      hr: '76 Active Staff',
      projects: 'Disabled by admin',
    },
  },
  {
    id: 't-03',
    name: 'Finova Global',
    slug: 'finova-global',
    tier: 'Professional',
    status: 'active',
    seats: 25,
    apiUsage: '51.0K req/mo',
    storage: '8.1 GB',
    enabledModules: {
      crm: true,
      sales: true,
      inventory: false,
      accounting: true,
      hr: false,
      projects: true,
    },
    moduleStats: {
      crm: '19 Accounts • 8 Deals',
      sales: '32 Orders • $85K Vol',
      inventory: 'Not subscribed (Pro tier)',
      accounting: '44 Invoices • In-Sync',
      hr: 'Not subscribed (Enterprise only)',
      projects: '4 Boards • 22 Tasks',
    },
  },
  {
    id: 't-04',
    name: 'Starlight Retailers',
    slug: 'starlight-retail',
    tier: 'Professional',
    status: 'active',
    seats: 20,
    apiUsage: '44.5K req/mo',
    storage: '6.4 GB',
    enabledModules: {
      crm: false,
      sales: true,
      inventory: true,
      accounting: true,
      hr: false,
      projects: false,
    },
    moduleStats: {
      crm: 'Inactive',
      sales: '54 Orders • $42K Vol',
      inventory: '310 SKUs • 1 Warehouse',
      accounting: '12 Invoices • 1 Pending Retry',
      hr: 'Inactive',
      projects: 'Inactive',
    },
  },
  {
    id: 't-05',
    name: 'Apex Health Solutions',
    slug: 'apex-health',
    tier: 'Enterprise',
    status: 'trial',
    seats: 60,
    apiUsage: '89.2K req/mo',
    storage: '19.8 GB',
    enabledModules: {
      crm: true,
      sales: true,
      inventory: true,
      accounting: true,
      hr: true,
      projects: true,
    },
    moduleStats: {
      crm: 'Trial Data Seeded (12 Leads)',
      sales: '8 Quotes • Pending Approval',
      inventory: '64 Medical Supplies SKUs',
      accounting: 'Sandbox Mode Active',
      hr: '58 Employees Enrolled',
      projects: '2 Implementation Boards',
    },
  },
  {
    id: 't-06',
    name: 'Horizon Tech Labs',
    slug: 'horizon-tech',
    tier: 'Starter',
    status: 'active',
    seats: 8,
    apiUsage: '12.4K req/mo',
    storage: '2.2 GB',
    enabledModules: {
      crm: false,
      sales: true,
      inventory: false,
      accounting: true,
      hr: false,
      projects: false,
    },
    moduleStats: {
      crm: 'Upgrade required',
      sales: '6 Orders • $11K Vol',
      inventory: 'Upgrade required',
      accounting: '14 Invoices • In-Sync',
      hr: 'Upgrade required',
      projects: 'Upgrade required',
    },
  },
];

export default function ServiceManagementPage() {
  const [services, setServices] = useState<ServiceDefinition[]>(initialServices);
  const [tenants, setTenants] = useState<TenantServiceProfile[]>(initialTenants);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t-01');
  const [tenantSearch, setTenantSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const selectedTenant: TenantServiceProfile =
    tenants.find((t) => t.id === selectedTenantId) || (initialTenants[0] as TenantServiceProfile);

  // Toggle module global kill-switch
  const toggleServiceGlobal = (code: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.code === code) {
          const next = !s.globalEnabled;
          showNotice(`${s.name} ${next ? 'globally enabled' : 'put into maintenance isolation'}`);
          return { ...s, globalEnabled: next };
        }
        return s;
      })
    );
  };

  // Toggle plan tier access for a service
  const toggleTierAccess = (code: string, tier: 'starter' | 'professional' | 'enterprise') => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.code === code) {
          const updated = {
            ...s.tierAccess,
            [tier]: !s.tierAccess[tier],
          };
          showNotice(`Updated tier entitlement for ${s.name} on ${tier.toUpperCase()}`);
          return { ...s, tierAccess: updated };
        }
        return s;
      })
    );
  };

  // Toggle module enablement for the selected tenant
  const toggleTenantModule = (moduleCode: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === selectedTenant.id) {
          const currentState = !!t.enabledModules[moduleCode];
          const nextState = !currentState;
          showNotice(`${nextState ? 'Provisioned' : 'De-provisioned'} ${moduleCode.toUpperCase()} for ${t.name}`);
          return {
            ...t,
            enabledModules: {
              ...t.enabledModules,
              [moduleCode]: nextState,
            },
          };
        }
        return t;
      })
    );
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => {
      setActionNotice((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Filtered tenants
  const filteredTenants = tenants.filter((t) => {
    const matchesQuery =
      t.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.slug.toLowerCase().includes(tenantSearch.toLowerCase());
    const matchesTier = tierFilter === 'all' || t.tier.toLowerCase() === tierFilter.toLowerCase();
    return matchesQuery && matchesTier;
  });

  return (
    <div className="animate-fade-in space-y-8">
      {/* ─── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF4F2] text-accent border border-[#EBD2CB]">
              Service Supervisor
            </span>
            <span className="text-xs text-ink-muted">Registry &amp; Multi-Tenant Provisioning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Service Management
          </h1>
          <p className="text-sm text-ink-muted mt-1 max-w-3xl">
            Configure service registry endpoints, toggle plan tier entitlements, and supervise per-tenant module provisioning with live sync diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => showNotice('Global cluster health probe initiated. 6/6 services responding.')}
            className="btn-secondary text-xs py-2 cursor-pointer"
          >
            <svg className="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Trigger Probe
          </button>
          <button
            type="button"
            onClick={() => showNotice('Global schema sync triggered across all 148 tenant databases.')}
            className="btn-primary text-xs py-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
            Sync Schema
          </button>
        </div>
      </div>

      {/* ─── Real-Time Action Feedback Toast ─────────────── */}
      {actionNotice && (
        <div className="p-3 bg-neutral-900 text-neutral-100 rounded-xl flex items-center justify-between text-xs font-medium shadow-md border border-neutral-800 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-success inline-block" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-neutral-400 hover:text-white text-xs px-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          SECTION 1: SERVICE & MODULE REGISTRY
          ═══════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-ink flex items-center gap-2">
              <span>Platform Service Registry</span>
              <span className="text-xs font-mono font-normal text-ink-muted bg-[#FAF9F5] border border-border px-2 py-0.5 rounded">
                6 Active Units
              </span>
            </h2>
            <p className="text-xs text-ink-muted">
              Global status, runtime telemetry, and plan tier eligibility matrix.
            </p>
          </div>
          <div className="text-xs text-ink-muted font-medium">
            Aggregate SLA: <span className="font-bold text-[#1F7A4D]">99.98%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.code}
              className={`card p-5 relative transition-all ${
                !service.globalEnabled ? 'opacity-70 border-dashed border-amber-400/80 bg-amber-50/20' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-ink">{service.name}</h3>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#FAF9F5] border border-border text-ink-muted">
                      {service.version}
                    </span>
                  </div>
                  <span className="text-[11px] text-ink-muted font-medium">{service.category}</span>
                </div>
                <StatusBadge
                  label={
                    !service.globalEnabled
                      ? 'Isolated'
                      : service.status === 'operational'
                      ? 'Operational'
                      : 'Degraded'
                  }
                  variant={
                    !service.globalEnabled ? 'warning' : service.status === 'operational' ? 'success' : 'danger'
                  }
                />
              </div>

              <p className="text-xs text-ink-muted mb-4 line-clamp-2">
                {service.description}
              </p>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-[#FAF9F5] border border-border text-center text-xs mb-4">
                <div>
                  <span className="text-[10px] text-ink-muted block">p99 Latency</span>
                  <span className="font-mono font-bold text-ink">{service.p99Latency}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted block">Error Rate</span>
                  <span className="font-mono font-bold text-ink">{service.errorRate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted block">Sync Pipe</span>
                  <span className="font-semibold text-[11px] text-[#1F7A4D] truncate block" title={service.syncStatus}>
                    {service.syncStatus.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Plan Tier Entitlements */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-ink-muted uppercase tracking-wider text-[10px]">
                    Plan Entitlements
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleServiceGlobal(service.code)}
                    className={`text-[11px] font-semibold cursor-pointer underline ${
                      service.globalEnabled ? 'text-accent hover:text-[#853526]' : 'text-[#1F7A4D]'
                    }`}
                  >
                    {service.globalEnabled ? 'Emergency Isolate' : 'Restore Service'}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {(['starter', 'professional', 'enterprise'] as const).map((tier) => {
                    const isAllowed = service.tierAccess[tier];
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => toggleTierAccess(service.code, tier)}
                        className={`flex-1 py-1 px-1.5 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                          isAllowed
                            ? 'bg-white border-[#EBD2CB] text-accent shadow-xs'
                            : 'bg-neutral-100 border-border text-neutral-400 line-through'
                        }`}
                        title={`Click to toggle ${tier} access`}
                      >
                        {tier.charAt(0).toUpperCase() + tier.slice(1, 4)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2: PER-TENANT DRILL-DOWN & OVERRIDES
          ═══════════════════════════════════════════════════ */}
      <section className="space-y-4 pt-4 border-t border-border">
        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <span>Per-Tenant Module Drill-Down &amp; Overrides</span>
            <span className="text-xs font-mono font-normal text-ink-muted bg-[#FAF9F5] border border-border px-2 py-0.5 rounded">
              Granular Control
            </span>
          </h2>
          <p className="text-xs text-ink-muted">
            Select a tenant organization to inspect active modules, resource utilization, and toggle services on/off in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── Left: Tenant Search & List (4 cols) ───────── */}
          <div className="lg:col-span-4 card p-4 space-y-3">
            <div className="space-y-2">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tenant orgs..."
                  value={tenantSearch}
                  onChange={(e) => setTenantSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
                />
                <svg className="w-4 h-4 text-ink-muted absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>

              {/* Tier Filter Pills */}
              <div className="flex items-center gap-1 text-[11px]">
                {['all', 'Enterprise', 'Professional', 'Starter'].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setTierFilter(tier)}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                      tierFilter === tier
                        ? 'bg-accent text-white shadow-xs'
                        : 'text-ink-muted hover:text-ink bg-[#FAF9F5]'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Tenant Selector List */}
            <div className="divide-y divide-border/60 max-h-[460px] overflow-y-auto no-scrollbar pt-1">
              {filteredTenants.map((tenant) => {
                const isSelected = tenant.id === selectedTenant.id;
                const activeCount = Object.values(tenant.enabledModules).filter(Boolean).length;
                return (
                  <div
                    key={tenant.id}
                    onClick={() => setSelectedTenantId(tenant.id)}
                    className={`p-3 rounded-lg transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#FAF4F2] border border-[#EBD2CB] shadow-xs'
                        : 'hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink truncate">{tenant.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        tenant.tier === 'Enterprise'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : tenant.tier === 'Professional'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                      }`}>
                        {tenant.tier}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[11px] text-ink-muted">
                      <span>{tenant.seats} Seats • {tenant.storage}</span>
                      <span className="font-semibold text-accent">{activeCount}/6 Modules</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right: Selected Tenant Drill-Down (8 cols) ── */}
          <div className="lg:col-span-8 space-y-4">
            {/* Tenant Overview Card */}
            <div className="card p-5 bg-gradient-to-r from-white via-[#FAF9F5] to-[#FAF4F2]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-ink">{selectedTenant.name}</h3>
                    <StatusBadge
                      label={selectedTenant.status.toUpperCase()}
                      variant={selectedTenant.status === 'active' ? 'success' : 'warning'}
                    />
                  </div>
                  <p className="text-xs text-ink-muted font-mono mt-0.5">
                    tenant_id: {selectedTenant.slug} • Plan: {selectedTenant.tier}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-border text-ink shadow-xs">
                    {selectedTenant.seats} Provisioned Seats
                  </span>
                </div>
              </div>

              {/* Resource Utilization Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs">
                <div>
                  <span className="text-ink-muted text-[11px] block">Monthly API Traffic</span>
                  <span className="font-mono font-bold text-ink text-sm">{selectedTenant.apiUsage}</span>
                </div>
                <div>
                  <span className="text-ink-muted text-[11px] block">Database Footprint</span>
                  <span className="font-mono font-bold text-ink text-sm">{selectedTenant.storage}</span>
                </div>
                <div>
                  <span className="text-ink-muted text-[11px] block">Provisioned Units</span>
                  <span className="font-bold text-accent text-sm">
                    {Object.values(selectedTenant.enabledModules).filter(Boolean).length} of 6 Enabled
                  </span>
                </div>
              </div>
            </div>

            {/* Per-Module Toggle Grid */}
            <div className="card p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h4 className="text-sm font-bold text-ink">
                  Active Service Entitlements for {selectedTenant.name}
                </h4>
                <span className="text-xs text-ink-muted">
                  Toggle switch to immediately provision or revoke module
                </span>
              </div>

              <div className="divide-y divide-border/60">
                {services.map((service) => {
                  const isEnabled = !!selectedTenant.enabledModules[service.code];
                  const usageDetail = selectedTenant.moduleStats[service.code] || 'Active';

                  return (
                    <div
                      key={service.code}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF9F5] px-2 rounded-lg transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-ink">{service.name}</span>
                          <span className="text-[10px] font-mono text-ink-muted px-1.5 py-0.2 rounded bg-white border border-border">
                            {service.version}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                            isEnabled
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}>
                            {isEnabled ? 'Provisioned' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-xs text-ink-muted mt-0.5 truncate">
                          {usageDetail}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs font-mono text-ink-muted">
                          {service.p99Latency}
                        </span>

                        {/* Interactive Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => toggleTenantModule(service.code)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                            isEnabled ? 'bg-accent' : 'bg-neutral-300'
                          }`}
                          title={`Click to ${isEnabled ? 'disable' : 'enable'} ${service.name} for ${selectedTenant.name}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3: DIAGNOSTIC & ISOLATION PROTOCOLS
          ═══════════════════════════════════════════════════ */}
      <section className="card p-6 bg-gradient-to-br from-[#FAF9F5] to-[#FAF4F2] border border-[#EBD2CB] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-ping" />
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider font-sans">
              Diagnostic Controls &amp; Cache Protocol
            </h3>
          </div>
          <span className="text-xs font-mono text-ink-muted">Cluster: US-East Production</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => showNotice('Invalidated all Redis tenant cache keys. Cache warming in progress.')}
            className="p-3.5 rounded-xl bg-white border border-[#E6E3DC] hover:border-accent text-left transition-all cursor-pointer group shadow-xs hover:shadow-sm"
          >
            <p className="text-xs font-bold text-ink group-hover:text-accent">Clear Tenant Caches</p>
            <p className="text-[11px] text-ink-muted mt-0.5">Flush Redis keys across all 148 tenant workspaces</p>
          </button>

          <button
            type="button"
            onClick={() => showNotice('Cross-tenant data consistency check started. 0 isolation leaks detected.')}
            className="p-3.5 rounded-xl bg-white border border-[#E6E3DC] hover:border-accent text-left transition-all cursor-pointer group shadow-xs hover:shadow-sm"
          >
            <p className="text-xs font-bold text-ink group-hover:text-accent">Tenant Data Isolation Audit</p>
            <p className="text-[11px] text-ink-muted mt-0.5">Verify tenant foreign keys and row-level security</p>
          </button>

          <button
            type="button"
            onClick={() => showNotice('Backup snapshot initialized. Exporting shard images to S3 cold vault.')}
            className="p-3.5 rounded-xl bg-white border border-[#E6E3DC] hover:border-accent text-left transition-all cursor-pointer group shadow-xs hover:shadow-sm"
          >
            <p className="text-xs font-bold text-ink group-hover:text-accent">Cold Shard Snapshot</p>
            <p className="text-[11px] text-ink-muted mt-0.5">Trigger immutable MongoDB Atlas cross-region backup</p>
          </button>
        </div>
      </section>
    </div>
  );
}
