'use client';

import { StatusBadge } from '@/components/ui/StatusBadge';

const billingTiers = [
  { name: 'Starter', price: '$450/mo', activeTenants: 48, mrr: '$21,600', seats: 'Up to 10 seats', modules: 'Sales, Accounting' },
  { name: 'Professional', price: '$1,450/mo', activeTenants: 72, mrr: '$104,400', seats: 'Up to 35 seats', modules: 'CRM, Sales, Inventory, Accounting, Projects' },
  { name: 'Enterprise', price: '$3,800/mo', activeTenants: 28, mrr: '$106,400', seats: 'Unlimited seats', modules: 'All 6 modules + Dedicated Shard + Custom SLAs' },
];

const failedInvoices = [
  { id: 'INV-2026-902', tenant: 'Starlight Retailers', amount: '$1,400', status: 'Payment Failed', retryCount: '2/3 retries', nextRetry: 'Tomorrow at 09:00 UTC' },
  { id: 'INV-2026-884', tenant: 'Kestrel Logistics', amount: '$450', status: 'Card Expired', retryCount: '1/3 retries', nextRetry: 'Sep 12, 2026' },
  { id: 'INV-2026-879', tenant: 'Zephyr Analytics', amount: '$2,350', status: 'Insufficient Funds', retryCount: '3/3 (Final)', nextRetry: 'Manual Intervention' },
];

export default function BillingAdminPage() {
  return (
    <div className="animate-fade-in space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF4F2] text-accent border border-[#EBD2CB]">
              Revenue &amp; Subscriptions
            </span>
            <span className="text-xs text-ink-muted">Stripe Webhook Gateway v2026.1</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Subscriptions &amp; Billing
          </h1>
          <p className="text-sm text-ink-muted mt-0.5">
            Supervise cross-tenant MRR, invoice collection cycles, subscription tier distribution, and failed billing retries.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Triggering automated billing collection sync with Stripe...')}
          className="btn-primary text-xs py-2 cursor-pointer"
        >
          Run Stripe Re-sync
        </button>
      </div>

      {/* Plan Tiers Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {billingTiers.map((tier) => (
          <div key={tier.name} className="card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-ink">{tier.name}</h3>
              <span className="badge badge-info">{tier.activeTenants} Orgs</span>
            </div>
            <div className="text-2xl font-extrabold text-ink font-mono">{tier.price}</div>
            <div className="text-xs text-ink-muted">{tier.seats} • {tier.modules}</div>
            <div className="pt-2 border-t border-border flex justify-between text-xs">
              <span className="text-ink-muted">Total Monthly Contribution</span>
              <span className="font-bold text-accent font-mono">{tier.mrr}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Failed Payments Queue */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <span>Failed Invoice Retries &amp; Dunning Queue</span>
              <span className="badge badge-warning text-[10px]">3 Attention Required</span>
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">Tenants with unpaid cycles pending automated Stripe dunning or manual grace suspension</p>
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {failedInvoices.map((inv) => (
            <div key={inv.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-ink">{inv.id}</span>
                  <span className="font-semibold text-ink">{inv.tenant}</span>
                  <StatusBadge label={inv.status} variant="warning" />
                </div>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  {inv.retryCount} • Scheduled: {inv.nextRetry}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-base text-ink">{inv.amount}</span>
                <button
                  onClick={() => alert(`Retrying charge for ${inv.id}...`)}
                  className="btn-secondary text-xs py-1.5 px-3 cursor-pointer"
                >
                  Force Charge Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
