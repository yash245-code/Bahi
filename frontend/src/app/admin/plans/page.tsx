'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { getActivePlans, saveActivePlans, PlanTierData } from '@/lib/plans-data';
import { Modal } from '@/components/ui/Modal';

export default function AdminPlansManagerPage() {
  const [plans, setPlans] = useState<PlanTierData[]>([]);
  const [coupons] = useState([
    { code: 'FOUNDER20', discount: '20% Off Forever', active: true, redeemed: 142 },
    { code: 'Q4ENTERPRISE', discount: '$50 Off Annual', active: true, redeemed: 38 },
  ]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanTierData | null>(null);

  useEffect(() => {
    setPlans(getActivePlans());
  }, []);

  const handlePriceChange = (id: string, field: 'monthlyPrice' | 'annualPrice', val: number) => {
    const updated = plans.map((p) => (p.id === id ? { ...p, [field]: val } : p));
    setPlans(updated);
    saveActivePlans(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSavePlanModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    const updated = plans.map((p) => (p.id === editingPlan.id ? editingPlan : p));
    setPlans(updated);
    saveActivePlans(updated);
    setEditingPlan(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
            Monetization Engine
          </span>
          <h1 className="font-serif text-3xl font-black text-white mt-1">
            Subscriptions & Plans Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Changes saved here propagate in real-time to the public pricing page and customer upgrade flows.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Plans synchronized! Public pricing page & billing tier contracts updated.</span>
        </div>
      )}

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className="rounded-3xl p-6 bg-[#11131A] border border-white/10 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-black text-xl text-white">{p.name}</h3>
                <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-neutral-400 uppercase">
                  {p.trialDays}d Trial
                </span>
              </div>
              <p className="text-xs text-neutral-400 min-h-[36px]">{p.tagline}</p>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Monthly Rate:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-white">$</span>
                    <input
                      type="number"
                      value={p.monthlyPrice}
                      onChange={(e) => handlePriceChange(p.id, 'monthlyPrice', Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded bg-white/5 border border-white/10 text-right font-mono text-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Annual Mo Rate:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-white">$</span>
                    <input
                      type="number"
                      value={p.annualPrice}
                      onChange={(e) => handlePriceChange(p.id, 'annualPrice', Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded bg-white/5 border border-white/10 text-right font-mono text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] space-y-1 pt-2 border-t border-white/5 text-neutral-400 font-mono">
                <div>Max Seats: {p.limits.seats}</div>
                <div>Storage Limit: {p.limits.storageGb} GB</div>
                <div>Monthly Invoices: {p.limits.monthlyInvoices}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditingPlan(p)}
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-200 transition-colors"
            >
              Edit Features & Limits
            </button>
          </div>
        ))}
      </div>

      {/* Promotional Coupons */}
      <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-white">Active Promotional Coupons</h3>
            <p className="text-xs text-neutral-400 mt-1">Stripe & Razorpay promo codes applied at checkout.</p>
          </div>
        </div>

        <div className="space-y-3">
          {coupons.map((c, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-mono font-bold text-rose-400 text-sm">{c.code}</span>
                <span className="text-neutral-400 ml-3">{c.discount}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-neutral-500 text-[11px]">{c.redeemed} Redeemed</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 uppercase font-bold">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Plan Modal */}
      <Modal
        isOpen={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        title={editingPlan ? `Edit ${editingPlan.name} Tier` : 'Edit Plan'}
        subtitle="Changes sync to public marketing table"
      >
        {editingPlan && (
          <form onSubmit={handleSavePlanModal} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase">Tagline</label>
              <input
                type="text"
                value={editingPlan.tagline}
                onChange={(e) => setEditingPlan({ ...editingPlan, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase">Trial Days</label>
                <input
                  type="number"
                  value={editingPlan.trialDays}
                  onChange={(e) => setEditingPlan({ ...editingPlan, trialDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase">Seats Included</label>
                <input
                  type="text"
                  value={editingPlan.limits.seats}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      limits: { ...editingPlan.limits, seats: (e.target.value as any) },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-neutral-300"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold">
                Save & Propagate
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
