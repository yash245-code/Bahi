'use client';

import { StatusBadge } from '@/components/ui/StatusBadge';

const servicesTelemetry = [
  { name: 'Core API Gateway', nodes: '4 Instances', uptime: '99.99%', latency: '8ms', status: 'operational' as const },
  { name: 'MongoDB Atlas Primary Replica', nodes: '3 Nodes (us-east-1)', uptime: '100%', latency: '12ms', status: 'operational' as const },
  { name: 'Redis Cache Cluster', nodes: '6 Nodes (Cluster mode)', uptime: '99.98%', latency: '2ms', status: 'operational' as const },
  { name: 'Kafka Sync Event Broker', nodes: '3 Brokers', uptime: '99.95%', latency: '15ms', status: 'operational' as const },
  { name: 'Background Jobs & Cron Workers', nodes: '8 Workers', uptime: '99.88%', latency: '48ms', status: 'warning' as const },
  { name: 'Stripe Billing Webhook Listener', nodes: '2 Instances', uptime: '100%', latency: '19ms', status: 'operational' as const },
];

export default function SystemHealthPage() {
  return (
    <div className="animate-fade-in space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF4F2] text-accent border border-[#EBD2CB]">
              Infrastructure Observability
            </span>
            <span className="text-xs text-ink-muted">US-East Region • 99.98% Aggregated SLA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            System Health &amp; Telemetry
          </h1>
          <p className="text-sm text-ink-muted mt-0.5">
            Real-time status of underlying microservices, database clusters, sync queues, and background processing workers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Diagnostic Ping initiated. All microservice heartbeat checks passed.')}
          className="btn-primary text-xs py-2 cursor-pointer"
        >
          Run Full Cluster Health Check
        </button>
      </div>

      {/* Cluster Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicesTelemetry.map((s) => (
          <div key={s.name} className="card p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink">{s.name}</h3>
                <p className="text-[11px] text-ink-muted font-mono">{s.nodes}</p>
              </div>
              <StatusBadge
                label={s.status === 'operational' ? 'Operational' : 'Queue Lag'}
                variant={s.status === 'operational' ? 'success' : 'warning'}
              />
            </div>

            <div className="pt-2 border-t border-border flex justify-between text-xs">
              <span className="text-ink-muted">30-Day Uptime</span>
              <span className="font-bold text-ink font-mono">{s.uptime}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-ink-muted">p99 Round-trip Latency</span>
              <span className="font-bold font-mono text-[#1F7A4D]">{s.latency}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Incident Log */}
      <div className="card p-5 space-y-3">
        <h3 className="text-sm font-bold text-ink">Recent System Incident &amp; Maintenance History</h3>
        <div className="divide-y divide-border/60 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-ink">Completed: Background Worker Node Scaling</span>
              <p className="text-[11px] text-ink-muted">Worker nodes increased from 6 to 8 to clear Projects sync backlog.</p>
            </div>
            <span className="text-[11px] text-ink-muted font-mono">Today, 14:20 UTC</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-ink">Resolved: Stripe Webhook Retry Delay</span>
              <p className="text-[11px] text-ink-muted">Transient DNS timeout resolved; failed invoice retries queued.</p>
            </div>
            <span className="text-[11px] text-ink-muted font-mono">Yesterday, 19:45 UTC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
