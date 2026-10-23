'use client';

import { useState } from 'react';
import { CrmNav } from '../components/CrmNav';
import { CrmAnnouncer } from '../components/CrmAnnouncer';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';

export interface CatalogProduct {
  id: string;
  sku: string;
  name: string;
  category: 'Software License' | 'Implementation' | 'SLA & Support' | 'Seat Expansion';
  unitPrice: number;
  billingTerm: 'Annual' | 'Monthly' | 'One-Time';
  activeDealsCount: number;
  description: string;
}

const initialProducts: CatalogProduct[] = [
  {
    id: 'PRD-01',
    sku: 'ERP-ENT-CORE',
    name: 'Bahi Enterprise Core Platform License',
    category: 'Software License',
    unitPrice: 24000,
    billingTerm: 'Annual',
    activeDealsCount: 7,
    description: 'Multi-entity general ledger, automated reconciliation, and tax compliance suite for up to 100 users.',
  },
  {
    id: 'PRD-02',
    sku: 'WMS-SYNC-MOD',
    name: 'Multi-Warehouse Inventory & Dispatch Module',
    category: 'Software License',
    unitPrice: 12000,
    billingTerm: 'Annual',
    activeDealsCount: 5,
    description: 'Real-time FIFO/LIFO tracking, barcode scanning integration, and automated procurement replenishment triggers.',
  },
  {
    id: 'PRD-03',
    sku: 'SVC-MIGRATE-PRO',
    name: 'Legacy ERP Migration & Architecture Onboarding',
    category: 'Implementation',
    unitPrice: 8500,
    billingTerm: 'One-Time',
    activeDealsCount: 4,
    description: 'White-glove migration of legacy database schemas, historic ledgers, vendor accounts, and automated validation tests.',
  },
  {
    id: 'PRD-04',
    sku: 'SLA-247-CRIT',
    name: 'Mission-Critical 24/7 SLA Support Agreement',
    category: 'SLA & Support',
    unitPrice: 5000,
    billingTerm: 'Annual',
    activeDealsCount: 6,
    description: '15-minute response guarantee, dedicated technical account manager, and customized disaster recovery failover.',
  },
  {
    id: 'PRD-05',
    sku: 'SEAT-EXP-USER',
    name: 'Additional User Seat License Pack (10 Seats)',
    category: 'Seat Expansion',
    unitPrice: 2000,
    billingTerm: 'Annual',
    activeDealsCount: 8,
    description: 'Expansion pack for 10 additional named CRM and finance users with granular role permissioning.',
  },
];

export function CrmProductsView() {
  const [products, setProducts] = useState<CatalogProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('10000');
  const [newCategory, setNewCategory] = useState<CatalogProduct['category']>('Software License');
  const [newTerm, setNewTerm] = useState<CatalogProduct['billingTerm']>('Annual');
  const [newDesc, setNewDesc] = useState('');
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku || !newName) return;

    const created: CatalogProduct = {
      id: `PRD-${Date.now().toString().slice(-3)}`,
      sku: newSku.toUpperCase(),
      name: newName,
      category: newCategory,
      unitPrice: Number(newPrice) || 5000,
      billingTerm: newTerm,
      activeDealsCount: 0,
      description: newDesc || 'Catalog item for proposals.',
    };

    setProducts((prev) => [created, ...prev]);
    setNewModalOpen(false);
    setNewSku('');
    setNewName('');
    setNewDesc('');
    setAnnouncement(`Added catalog product: ${newName}`);
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <CrmAnnouncer message={announcement} />

      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
        totalPipelineValue={`$272,000`}
        activeDealsCount={11}
      />

      {/* ── Header Telemetry ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-4 border border-border dark:border-[#2E302A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Catalog Products
          </span>
          <div className="text-2xl font-black font-mono text-ink dark:text-white mt-1">
            {products.length} Items
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Active Price Book v2.4</span>
        </div>
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-4 border border-border dark:border-[#2E302A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Recurring License SKUs
          </span>
          <div className="text-2xl font-black font-mono text-accent mt-1">
            {products.filter((p) => p.billingTerm === 'Annual').length} Subscriptions
          </div>
          <span className="text-[11px] text-ink-muted">Annual recurring revenue baseline</span>
        </div>
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-4 border border-border dark:border-[#2E302A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Deals Attached to Catalog
          </span>
          <div className="text-2xl font-black font-mono text-ink dark:text-white mt-1">
            {products.reduce((acc, p) => acc + p.activeDealsCount, 0)} Proposals
          </div>
          <span className="text-[11px] text-ink-muted">Line item tracking</span>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <svg
              className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2"
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
              aria-label="Filter products by SKU or name"
              placeholder="Search products by SKU, title, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border dark:border-[#2E302A] bg-white dark:bg-[#141513] text-ink dark:text-white placeholder:text-ink-muted/60 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            {['all', 'Software License', 'Implementation', 'SLA & Support'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border capitalize transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#20211F] text-white border-[#20211F] dark:bg-white dark:text-[#141513] dark:border-white'
                    : 'bg-white dark:bg-[#1E1F1C] text-ink-muted border-border dark:border-[#2E302A] hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-accent"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* ── Product Catalog Table ── */}
      <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl border border-border dark:border-[#2E302A] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] dark:bg-[#141513] border-b border-border dark:border-[#2E302A] text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                <th className="p-3.5">SKU Code</th>
                <th className="p-3.5">Product Title &amp; Description</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Standard Price</th>
                <th className="p-3.5">Billing Term</th>
                <th className="p-3.5 text-right">Active Deals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-[#2E302A]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/80 dark:hover:bg-[#252722] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-accent">
                    {p.sku}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-ink dark:text-white">{p.name}</div>
                    <div className="text-[11px] text-ink-muted max-w-md mt-0.5 line-clamp-1">{p.description}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-ink dark:text-white text-sm">
                    ${p.unitPrice.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-ink-muted">
                    {p.billingTerm}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-ink dark:text-white">
                    {p.activeDealsCount} deals
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Product Modal ── */}
      {newModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-product-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setNewModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl border border-border dark:border-[#2E302A] shadow-2xl max-w-md w-full p-6 space-y-4 text-ink dark:text-neutral-100">
            <h3 id="add-product-title" className="text-base font-bold text-ink dark:text-white">
              Add Catalog Product
            </h3>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="sku-code" className="font-semibold text-ink dark:text-neutral-200 block mb-1">SKU Code *</label>
                  <input
                    id="sku-code"
                    type="text"
                    required
                    placeholder="e.g. ERP-API-PRO"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label htmlFor="prod-price" className="font-semibold text-ink dark:text-neutral-200 block mb-1">Standard Price ($) *</label>
                  <input
                    id="prod-price"
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="prod-name" className="font-semibold text-ink dark:text-neutral-200 block mb-1">Product Name *</label>
                <input
                  id="prod-name"
                  type="text"
                  required
                  placeholder="e.g. Real-Time Telemetry Analytics Engine"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="prod-cat" className="font-semibold text-ink dark:text-neutral-200 block mb-1">Category</label>
                  <select
                    id="prod-cat"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-white"
                  >
                    <option value="Software License">Software License</option>
                    <option value="Implementation">Implementation Service</option>
                    <option value="SLA & Support">SLA & Support</option>
                    <option value="Seat Expansion">Seat Expansion</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="prod-term" className="font-semibold text-ink dark:text-neutral-200 block mb-1">Billing Term</label>
                  <select
                    id="prod-term"
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-white"
                  >
                    <option value="Annual">Annual Subscription</option>
                    <option value="Monthly">Monthly Recurring</option>
                    <option value="One-Time">One-Time Fee</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="prod-desc" className="font-semibold text-ink dark:text-neutral-200 block mb-1">Description</label>
                <textarea
                  id="prod-desc"
                  rows={2}
                  placeholder="Key features and license terms..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border dark:border-[#2E302A]">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-border dark:border-[#2E302A] text-ink-muted hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-[#853526]"
                >
                  Save Product
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
        onSubmit={() => {}}
      />
      <NewLeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSubmit={() => {}}
      />
    </div>
  );
}
