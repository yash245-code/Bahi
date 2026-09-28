'use client';

import { useState } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';

const initialFlags = [
  { key: 'ai_ledger_auto_reconcile', name: 'AI Ledger Auto-Reconcile', rollout: '25%', status: 'beta', target: 'Enterprise only', enabled: true },
  { key: 'kafka_event_mesh_v2', name: 'Kafka Event Mesh v2 Pipeline', rollout: '100%', status: 'ga', target: 'All tiers', enabled: true },
  { key: 'multi_currency_hedging', name: 'Multi-Currency Forex Hedging', rollout: '10%', status: 'canary', target: 'Enterprise beta opt-in', enabled: true },
  { key: 'warehouse_drone_barcode_scan', name: 'Drone Barcode Scanner API', rollout: '0%', status: 'dev', target: 'Internal testing only', enabled: false },
  { key: 'payroll_direct_ach_payouts', name: 'Direct ACH Payroll Settlement', rollout: '50%', status: 'staged', target: 'Pro & Enterprise', enabled: true },
];

export default function FeatureFlagsAdminPage() {
  const [flags, setFlags] = useState(initialFlags);

  const toggleFlag = (key: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f))
    );
  };

  return (
    <div className="animate-fade-in space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF4F2] text-accent border border-[#EBD2CB]">
              Rollout Engine
            </span>
            <span className="text-xs text-ink-muted">Feature Gates &amp; Tier Entitlements</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Feature Flags &amp; Plans
          </h1>
          <p className="text-sm text-ink-muted mt-0.5">
            Manage canary deployments, percentage-based rollouts, beta module opt-ins, and tier gate overrides.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('New flag modal opened')}
          className="btn-primary text-xs py-2 cursor-pointer"
        >
          + Create Feature Flag
        </button>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="text-sm font-bold text-ink">Active Platform Feature Flags</h3>
        <div className="divide-y divide-border/60">
          {flags.map((flag) => (
            <div key={flag.key} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-ink text-sm">{flag.name}</span>
                  <span className="font-mono text-[10px] text-ink-muted bg-[#FAF9F5] border border-border px-1.5 py-0.2 rounded">
                    {flag.key}
                  </span>
                  <StatusBadge
                    label={flag.status.toUpperCase()}
                    variant={flag.status === 'ga' ? 'success' : flag.status === 'beta' ? 'warning' : 'neutral'}
                  />
                </div>
                <p className="text-xs text-ink-muted">
                  Audience: <span className="font-semibold text-ink">{flag.target}</span> • Rollout:{' '}
                  <span className="font-mono font-bold text-accent">{flag.rollout}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleFlag(flag.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    flag.enabled ? 'bg-accent' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      flag.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
