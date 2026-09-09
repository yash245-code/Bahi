import { StatusBadge } from '@/components/ui/StatusBadge';

const products = [
  { sku: 'PRD-001', name: 'Wireless Keyboard Pro', category: 'Electronics', stock: 342, reorder: 50, price: '$89.99', status: 'In Stock' },
  { sku: 'PRD-002', name: 'Ergonomic Office Chair', category: 'Furniture', stock: 18, reorder: 20, price: '$449.00', status: 'Low Stock' },
  { sku: 'PRD-003', name: 'Ultra-Wide Monitor 34"', category: 'Electronics', stock: 67, reorder: 15, price: '$699.00', status: 'In Stock' },
  { sku: 'PRD-004', name: 'USB-C Hub 7-in-1', category: 'Accessories', stock: 0, reorder: 100, price: '$54.99', status: 'Out of Stock' },
  { sku: 'PRD-005', name: 'Standing Desk Frame', category: 'Furniture', stock: 124, reorder: 30, price: '$329.00', status: 'In Stock' },
  { sku: 'PRD-006', name: 'Noise Cancelling Headset', category: 'Electronics', stock: 8, reorder: 25, price: '$179.00', status: 'Low Stock' },
];

const warehouses = [
  { name: 'WH-MAIN', location: 'New York, NY', products: 156, utilization: 78, status: 'active' as const },
  { name: 'WH-WEST', location: 'Los Angeles, CA', products: 89, utilization: 45, status: 'active' as const },
  { name: 'WH-SOUTH', location: 'Austin, TX', products: 42, utilization: 92, status: 'warning' as const },
];

const recentMoves = [
  { ref: 'SM-00142', type: 'Receipt', product: 'Wireless Keyboard Pro', qty: '+500', warehouse: 'WH-MAIN', date: 'Sep 7, 2026' },
  { ref: 'SM-00141', type: 'Shipment', product: 'Ultra-Wide Monitor 34"', qty: '-12', warehouse: 'WH-WEST', date: 'Sep 6, 2026' },
  { ref: 'SM-00140', type: 'Transfer', product: 'Standing Desk Frame', qty: '30 → WH-SOUTH', warehouse: 'WH-MAIN', date: 'Sep 5, 2026' },
  { ref: 'SM-00139', type: 'Shipment', product: 'Ergonomic Office Chair', qty: '-5', warehouse: 'WH-MAIN', date: 'Sep 5, 2026' },
];

const stockVariant = (s: string) => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    'In Stock': 'success', 'Low Stock': 'warning', 'Out of Stock': 'danger',
  };
  return map[s] || 'neutral';
};

const moveVariant = (s: string) => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    Receipt: 'success', Shipment: 'info', Transfer: 'warning',
  };
  return map[s] || 'neutral';
};

export default function InventoryPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-subtitle">Product catalog, warehouse stock levels, and stock movements.</p>
        </div>
        <div className="flex gap-2.5">
          <button className="btn-secondary">Receive Goods</button>
          <button className="btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="stat-card"><span className="stat-label">Total Products</span><span className="stat-value">156</span></div>
        <div className="stat-card"><span className="stat-label">In Stock</span><span className="stat-value text-[#1F7A4D]">142</span></div>
        <div className="stat-card"><span className="stat-label">Low Stock Alerts</span><span className="stat-value text-[#B8790A]">11</span></div>
        <div className="stat-card"><span className="stat-label">Out of Stock</span><span className="stat-value text-[#B23A2E]">3</span></div>
      </div>

      {/* Warehouses */}
      <h2 className="text-base font-bold text-ink mb-3">Warehouses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {warehouses.map((wh) => (
          <div key={wh.name} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-ink">{wh.name}</h3>
              <StatusBadge label={wh.status === 'warning' ? 'Near Full' : 'Healthy'} variant={wh.status === 'warning' ? 'warning' : 'success'} />
            </div>
            <p className="text-xs text-ink-muted mb-3">{wh.location}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Products</span>
                <span className="font-semibold text-ink">{wh.products}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Utilization</span>
                <span className="font-semibold text-ink">{wh.utilization}%</span>
              </div>
              <div className="w-full h-2 bg-[#FAF9F5] border border-border/80 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${wh.utilization > 85 ? 'bg-[#B8790A]' : 'bg-accent'}`}
                  style={{ width: `${wh.utilization}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Catalog */}
      <h2 className="text-base font-bold text-ink mb-3">Product Catalog</h2>
      <div className="card overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-[#FAF9F5]">
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">SKU</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Product</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Category</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Stock</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Price</th>
              <th className="text-center px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.sku} className="hover:bg-[#FAF9F5] transition-colors cursor-pointer">
                <td className="px-5 py-3.5 font-mono text-sm font-semibold text-accent">{p.sku}</td>
                <td className="px-5 py-3.5 text-ink font-medium">{p.name}</td>
                <td className="px-5 py-3.5 text-ink-muted">{p.category}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-ink">{p.stock}</td>
                <td className="px-5 py-3.5 text-right font-medium text-ink">{p.price}</td>
                <td className="px-5 py-3.5 text-center"><StatusBadge label={p.status} variant={stockVariant(p.status)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Stock Moves */}
      <h2 className="text-base font-bold text-ink mb-3">Recent Stock Moves</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-[#FAF9F5]">
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Ref</th>
              <th className="text-center px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Type</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Product</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Qty</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Warehouse</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentMoves.map((m) => (
              <tr key={m.ref} className="hover:bg-[#FAF9F5] transition-colors cursor-pointer">
                <td className="px-5 py-3.5 font-mono text-sm font-semibold text-accent">{m.ref}</td>
                <td className="px-5 py-3.5 text-center"><StatusBadge label={m.type} variant={moveVariant(m.type)} /></td>
                <td className="px-5 py-3.5 text-ink font-medium">{m.product}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-ink">{m.qty}</td>
                <td className="px-5 py-3.5 text-ink-muted">{m.warehouse}</td>
                <td className="px-5 py-3.5 text-right text-ink-muted">{m.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
