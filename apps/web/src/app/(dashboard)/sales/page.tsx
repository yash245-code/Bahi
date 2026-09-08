import { StatusBadge } from '@/components/ui/StatusBadge';

const quotations = [
  { number: 'QT-00015', customer: 'TechStart Inc.', total: '$8,700', status: 'Draft', date: 'Sep 7, 2026' },
  { number: 'QT-00014', customer: 'NexGen Systems', total: '$15,000', status: 'Sent', date: 'Sep 5, 2026' },
  { number: 'QT-00013', customer: 'BrightWave', total: '$4,200', status: 'Confirmed', date: 'Sep 3, 2026' },
  { number: 'QT-00012', customer: 'Summit Digital', total: '$22,000', status: 'Confirmed', date: 'Sep 1, 2026' },
  { number: 'QT-00011', customer: 'DataFlow Corp', total: '$6,800', status: 'Expired', date: 'Aug 28, 2026' },
];

const orders = [
  { number: 'SO-00009', customer: 'Summit Digital', total: '$22,000', status: 'Delivered', date: 'Sep 5, 2026' },
  { number: 'SO-00008', customer: 'BrightWave', total: '$4,200', status: 'In Progress', date: 'Sep 3, 2026' },
  { number: 'SO-00007', customer: 'Enterprise One', total: '$42,000', status: 'Confirmed', date: 'Aug 30, 2026' },
];

const statusVariant = (s: string) => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    Draft: 'neutral', Sent: 'info', Confirmed: 'success', Expired: 'danger', Cancelled: 'danger',
    'In Progress': 'warning', Shipped: 'info', Delivered: 'success',
  };
  return map[s] || 'neutral';
};

export default function SalesPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales</h1>
          <p className="page-subtitle">Manage quotations and track sales orders.</p>
        </div>
        <button className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Quotation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card"><span className="stat-label">Open Quotations</span><span className="stat-value">5</span></div>
        <div className="stat-card"><span className="stat-label">Active Orders</span><span className="stat-value">3</span></div>
        <div className="stat-card"><span className="stat-label">Monthly Revenue</span><span className="stat-value text-accent">$68,200</span></div>
      </div>

      {/* Quotations Table */}
      <h2 className="text-base font-bold text-ink mb-3">Recent Quotations</h2>
      <div className="card overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-[#FAF9F5]">
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Number</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Customer</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Total</th>
              <th className="text-center px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {quotations.map((q) => (
              <tr key={q.number} className="hover:bg-[#FAF9F5] transition-colors cursor-pointer">
                <td className="px-5 py-3.5 font-mono text-sm font-semibold text-accent">{q.number}</td>
                <td className="px-5 py-3.5 text-ink font-medium">{q.customer}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-ink">{q.total}</td>
                <td className="px-5 py-3.5 text-center"><StatusBadge label={q.status} variant={statusVariant(q.status)} /></td>
                <td className="px-5 py-3.5 text-right text-ink-muted">{q.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Orders Table */}
      <h2 className="text-base font-bold text-ink mb-3">Sales Orders</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-[#FAF9F5]">
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Number</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Customer</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Total</th>
              <th className="text-center px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.number} className="hover:bg-[#FAF9F5] transition-colors cursor-pointer">
                <td className="px-5 py-3.5 font-mono text-sm font-semibold text-accent">{o.number}</td>
                <td className="px-5 py-3.5 text-ink font-medium">{o.customer}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-ink">{o.total}</td>
                <td className="px-5 py-3.5 text-center"><StatusBadge label={o.status} variant={statusVariant(o.status)} /></td>
                <td className="px-5 py-3.5 text-right text-ink-muted">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
