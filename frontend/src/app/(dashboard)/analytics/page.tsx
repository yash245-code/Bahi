'use client';

const analyticsMetrics = [
  { label: 'Total API Requests (30d)', value: '18.4M', sub: '+18.2% MoM', peak: '840 req/sec' },
  { label: 'Platform Active Users', value: '4,820', sub: '+240 this week', peak: '1,420 concurrent' },
  { label: 'Total DB Shard Storage', value: '840 GB', sub: '42% total capacity', peak: '2 TB max quota' },
  { label: 'Avg API Response Time', value: '14.2ms', sub: '-1.4ms optimized', peak: '48ms p99' },
];

const topTenantConsumers = [
  { name: 'Nexus Logistics Global', apiCalls: '3.4M req', storage: '28.5 GB', users: 80, tier: 'Enterprise' },
  { name: 'Acme Corp', apiCalls: '2.8M req', storage: '14.2 GB', users: 45, tier: 'Enterprise' },
  { name: 'Apex Health Solutions', apiCalls: '1.9M req', storage: '19.8 GB', users: 60, tier: 'Enterprise' },
  { name: 'Crestline Manufacturing', apiCalls: '1.6M req', storage: '22.1 GB', users: 110, tier: 'Enterprise' },
  { name: 'Finova Global Corp', apiCalls: '940K req', storage: '8.1 GB', users: 25, tier: 'Professional' },
];

export default function AnalyticsAdminPage() {
  return (
    <div className="animate-fade-in space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF4F2] text-accent border border-[#EBD2CB]">
              Platform Telemetry
            </span>
            <span className="text-xs text-ink-muted">Aggregate Usage Across All Tenants</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Usage &amp; Analytics
          </h1>
          <p className="text-sm text-ink-muted mt-0.5">
            Monitor cluster API ingress, storage consumption by tenant, active user trends, and slow queries.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Exporting 30-day cross-tenant analytics CSV...')}
          className="btn-secondary text-xs py-2 cursor-pointer"
        >
          Export CSV Dump
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsMetrics.map((m) => (
          <div key={m.label} className="stat-card">
            <span className="stat-label">{m.label}</span>
            <div className="stat-value text-2xl sm:text-3xl mt-1">{m.value}</div>
            <div className="flex justify-between text-[11px] text-ink-muted mt-1">
              <span>{m.sub}</span>
              <span className="font-mono text-accent">{m.peak}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Consuming Tenants */}
      <div className="card p-5 space-y-4">
        <h3 className="text-sm font-bold text-ink">Highest Platform Resource Consumers (30-Day Window)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-border text-[11px] uppercase tracking-wider text-ink-muted font-bold">
                <th className="py-2.5 px-3">Organization</th>
                <th className="py-2.5 px-3">Tier</th>
                <th className="py-2.5 px-3">API Requests</th>
                <th className="py-2.5 px-3">DB Storage</th>
                <th className="py-2.5 px-3">Active Seats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {topTenantConsumers.map((c) => (
                <tr key={c.name} className="hover:bg-[#FAF9F5]">
                  <td className="py-3 px-3 font-bold text-ink">{c.name}</td>
                  <td className="py-3 px-3 font-semibold text-accent">{c.tier}</td>
                  <td className="py-3 px-3 font-mono">{c.apiCalls}</td>
                  <td className="py-3 px-3 font-mono">{c.storage}</td>
                  <td className="py-3 px-3 font-mono">{c.users} users</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
