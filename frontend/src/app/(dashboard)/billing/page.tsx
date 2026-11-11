'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  AlertTriangle,
} from 'lucide-react';
import { getActivePlans, PlanTierData } from '@/lib/plans-data';
import { Modal } from '@/components/ui/Modal';

export default function CustomerBillingPage() {
  const [plans, setPlans] = useState<PlanTierData[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState('growth');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState<PlanTierData | null>(null);
  const [hasFailedPayment, setHasFailedPayment] = useState(false);

  useEffect(() => {
    setPlans(getActivePlans());
  }, []);

  const currentPlan = plans.find((p) => p.id === currentPlanId) || plans[1] || {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 79,
    annualPrice: 65,
    trialDays: 14,
    limits: { seats: 15, storageGb: 100, contacts: 15000, monthlyInvoices: 1000 },
  };

  const usageStats = [
    { label: 'Active Team Seats', used: 12, max: currentPlan.limits?.seats || 15, unit: 'Seats' },
    { label: 'Encrypted Cloud Storage', used: 42, max: currentPlan.limits?.storageGb || 100, unit: 'GB' },
    { label: 'Contact Records', used: 1420, max: currentPlan.limits?.contacts || 15000, unit: 'Contacts' },
    { label: 'Invoices Generated This Month', used: 240, max: currentPlan.limits?.monthlyInvoices || 1000, unit: 'Invoices' },
  ];

  const pastInvoices = [
    { id: 'INV-2026-011', date: 'Nov 1, 2026', amount: '$79.00', status: 'Paid', method: 'Visa ending in 4242' },
    { id: 'INV-2026-010', date: 'Oct 1, 2026', amount: '$79.00', status: 'Paid', method: 'Visa ending in 4242' },
    { id: 'INV-2026-009', date: 'Sep 1, 2026', amount: '$79.00', status: 'Paid', method: 'Visa ending in 4242' },
    { id: 'INV-2026-008', date: 'Aug 1, 2026', amount: '$29.00', status: 'Paid', method: 'Visa ending in 4242' },
  ];

  const handleUpgradeConfirm = () => {
    if (selectedNewPlan) {
      setCurrentPlanId(selectedNewPlan.id);
      setIsUpgradeModalOpen(false);
    }
  };

  const downloadFakePdf = (invId: string) => {
    const text = `Bahi Technologies Inc. - Official Tax Invoice ${invId}\nBilled to: Nexus Dynamics\nStatus: Settled in Full via Stripe\nAmount: $79.00 USD`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-bold">
            Subscription & Billing
          </span>
          <h1 className="font-serif text-3xl font-black text-ink dark:text-white mt-1">
            Plan, Usage & Invoices
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setHasFailedPayment(!hasFailedPayment)}
          className="text-[11px] text-neutral-400 hover:text-ink underline self-start sm:self-center"
        >
          {hasFailedPayment ? 'Hide Failed Banner' : 'Simulate Payment Failure'}
        </button>
      </div>

      {/* Failed Payment Banner if triggered */}
      {hasFailedPayment && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-between gap-4 text-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold">Payment Method Failed</span>
              <p className="text-[11px] text-rose-400 mt-0.5">
                We were unable to charge your card ending in 4242 for invoice INV-2026-012. Please update your payment details.
              </p>
            </div>
          </div>
          <button className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-semibold text-xs shrink-0 cursor-pointer">
            Update Payment Card
          </button>
        </div>
      )}

      {/* Current Plan Overview Card */}
      <div className="rounded-3xl p-8 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">
              Active Tier
            </span>
            <span className="text-xs text-neutral-400">Next billing date: Dec 1, 2026</span>
          </div>

          <h2 className="font-serif text-3xl font-black text-ink dark:text-white flex items-baseline gap-2">
            <span>{currentPlan.name} Plan</span>
            <span className="text-sm font-sans font-normal text-neutral-400">
              (${currentPlan.monthlyPrice}/month)
            </span>
          </h2>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Your plan includes CRM, Sales Orders, Inventory, and Double-Entry Accounting with multi-currency
            and PostgreSQL RLS isolation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => {
              const enterprisePlan = plans.find((p) => p.id === 'business') || plans[2] || null;
              setSelectedNewPlan(enterprisePlan);
              setIsUpgradeModalOpen(true);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 hover:opacity-95 transition-all text-center cursor-pointer"
          >
            Upgrade to Enterprise
          </button>
          <button
            type="button"
            onClick={() => alert('Subscription management portal: In a production Stripe deployment, this opens the Stripe Customer Portal.')}
            className="w-full sm:w-auto px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-center"
          >
            Update Payment Method
          </button>
        </div>
      </div>

      {/* Usage vs Limits Grid */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-xl text-ink dark:text-white">Usage Against Plan Limits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {usageStats.map((stat, idx) => {
            const percent = typeof stat.max === 'number' ? Math.round((stat.used / stat.max) * 100) : 10;
            return (
              <div
                key={idx}
                className="rounded-3xl p-6 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-3"
              >
                <span className="text-[11px] font-mono uppercase text-neutral-400 font-semibold block">
                  {stat.label}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif font-black text-2xl text-ink dark:text-white">
                    {stat.used}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    Limit: {stat.max} {stat.unit}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      percent > 85 ? 'bg-rose-500' : percent > 60 ? 'bg-amber-500' : 'bg-accent'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-[10px] text-neutral-400 font-mono block">
                  {percent}% consumed
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice History with Download */}
      <div className="rounded-3xl p-8 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-ink dark:text-white">Invoice History</h3>
            <p className="text-xs text-neutral-500 mt-1">Download official tax invoices and PDF receipts.</p>
          </div>
          <span className="text-xs font-mono text-neutral-400">All prices in USD</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 text-neutral-400 uppercase text-[10px]">
                <th className="p-3">Invoice ID</th>
                <th className="p-3">Billing Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-ink dark:text-neutral-200">
              {pastInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="p-3 font-mono font-bold text-ink dark:text-white">{inv.id}</td>
                  <td className="p-3 text-neutral-500">{inv.date}</td>
                  <td className="p-3 font-mono font-semibold">{inv.amount}</td>
                  <td className="p-3 text-neutral-400 font-mono text-[11px]">{inv.method}</td>
                  <td className="p-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold uppercase">
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => downloadFakePdf(inv.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-black/10 dark:border-white/10 text-neutral-500 hover:text-ink dark:hover:text-white hover:bg-black/5 transition-colors"
                      title="Download Invoice"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade / Proration Modal */}
      <Modal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title="Upgrade Subscription Plan"
        subtitle="Review proration details before confirming"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Target Plan:</span>
              <span className="font-bold text-ink dark:text-white">Enterprise Plan ($199/mo)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Unused Credit (Growth Plan):</span>
              <span className="font-mono text-emerald-500">-$39.50</span>
            </div>
            <div className="flex justify-between border-t border-black/5 dark:border-white/5 pt-2">
              <span className="font-semibold text-ink dark:text-white">Due Immediately Today:</span>
              <span className="font-mono font-bold text-accent text-sm">$159.50</span>
            </div>
          </div>

          <p className="text-neutral-500 text-[11px] leading-relaxed">
            Your card on file ending in 4242 will be charged immediately with prorated credit applied.
            New enterprise features (HR, Projects, Unlimited Seats) unlock instantaneously.
          </p>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpgradeConfirm}
              className="px-5 py-2 rounded-xl bg-accent text-white font-semibold"
            >
              Confirm Upgrade ($159.50)
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
