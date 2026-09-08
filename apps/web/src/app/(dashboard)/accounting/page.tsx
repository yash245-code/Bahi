import { StatusBadge } from '@/components/ui/StatusBadge';

const invoices = [
  { number: 'INV-00048', customer: 'Summit Digital', total: '$22,000', paid: '$22,000', balance: '$0', status: 'Paid', date: 'Sep 6, 2026' },
  { number: 'INV-00047', customer: 'NexGen Systems', total: '$15,000', paid: '$7,500', balance: '$7,500', status: 'Partial', date: 'Sep 4, 2026' },
  { number: 'INV-00046', customer: 'BrightWave', total: '$4,200', paid: '$0', balance: '$4,200', status: 'Sent', date: 'Sep 3, 2026' },
  { number: 'INV-00045', customer: 'Enterprise One', total: '$42,000', paid: '$42,000', balance: '$0', status: 'Paid', date: 'Sep 1, 2026' },
  { number: 'INV-00044', customer: 'DataFlow Corp', total: '$6,800', paid: '$0', balance: '$6,800', status: 'Overdue', date: 'Aug 15, 2026' },
  { number: 'INV-00043', customer: 'Global Reach', total: '$25,000', paid: '$0', balance: '$25,000', status: 'Draft', date: 'Aug 28, 2026' },
];

const recentPayments = [
  { ref: 'PAY-00031', invoice: 'INV-00048', customer: 'Summit Digital', amount: '$22,000', method: 'Bank Transfer', date: 'Sep 6, 2026' },
  { ref: 'PAY-00030', invoice: 'INV-00047', customer: 'NexGen Systems', amount: '$7,500', method: 'Credit Card', date: 'Sep 4, 2026' },
  { ref: 'PAY-00029', invoice: 'INV-00045', customer: 'Enterprise One', amount: '$42,000', method: 'Wire Transfer', date: 'Sep 1, 2026' },
];

const plSummary = [
  { label: 'Revenue', value: '$248,700', change: '+18.2%', positive: true },
  { label: 'Cost of Goods', value: '$98,300', change: '+12.1%', positive: false },
  { label: 'Operating Expenses', value: '$62,400', change: '+5.8%', positive: false },
  { label: 'Net Profit', value: '$88,000', change: '+32.4%', positive: true },
];

const statusVariant = (s: string) => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    Paid: 'success', Partial: 'warning', Sent: 'info', Overdue: 'danger', Draft: 'neutral', Cancelled: 'danger',
  };
  return map[s] || 'neutral';
};

export default function AccountingPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Accounting</h1>
          <p className="page-subtitle">Invoices, payments, and financial overview.</p>
        </div>
        <div className="flex gap-2.5">
          <button className="btn-secondary">Record Payment</button>
          <button className="btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Invoice
          </button>
        </div>
      </div>

      {/* P&L Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {plSummary.map((item) => (
          <div key={item.label} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="stat-label">{item.label}</span>
              <span className={`text-xs font-bold ${item.positive ? 'text-[#1F7A4D]' : 'text-[#B23A2E]'}`}>
                {item.change}
              </span>
            </div>
            <span className="stat-value">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Invoices Table */}
      <h2 className="text-base font-bold text-ink mb-3">Invoices</h2>
      <div className="card overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-[#FAF9F5]">
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Number</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Customer</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Total</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Paid</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Balance</th>
              <th className="text-center px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((inv) => (
              <tr key={inv.number} className="hover:bg-[#FAF9F5] transition-colors cursor-pointer">
                <td className="px-5 py-3.5 font-mono text-sm font-semibold text-accent">{inv.number}</td>
                <td className="px-5 py-3.5 text-ink font-medium">{inv.customer}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-ink">{inv.total}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-[#1F7A4D]">{inv.paid}</td>
                <td className="px-5 py-3.5 text-right font-medium text-ink-muted">{inv.balance}</td>
                <td className="px-5 py-3.5 text-center"><StatusBadge label={inv.status} variant={statusVariant(inv.status)} /></td>
                <td className="px-5 py-3.5 text-right text-ink-muted">{inv.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Payments */}
      <h2 className="text-base font-bold text-ink mb-3">Recent Payments</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-[#FAF9F5]">
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Ref</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Invoice</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Customer</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Amount</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Method</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentPayments.map((pay) => (
              <tr key={pay.ref} className="hover:bg-[#FAF9F5] transition-colors cursor-pointer">
                <td className="px-5 py-3.5 font-mono text-sm font-semibold text-accent">{pay.ref}</td>
                <td className="px-5 py-3.5 text-ink-muted font-mono">{pay.invoice}</td>
                <td className="px-5 py-3.5 text-ink font-medium">{pay.customer}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-[#1F7A4D]">{pay.amount}</td>
                <td className="px-5 py-3.5 text-ink-muted">{pay.method}</td>
                <td className="px-5 py-3.5 text-right text-ink-muted">{pay.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
