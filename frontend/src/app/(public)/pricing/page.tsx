'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { getActivePlans, PRICING_FAQS, PlanTierData } from '@/lib/plans-data';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [plans, setPlans] = useState<PlanTierData[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    setPlans(getActivePlans());

    const handleUpdate = () => {
      setPlans(getActivePlans());
    };
    window.addEventListener('bahi_plans_updated', handleUpdate);
    return () => window.removeEventListener('bahi_plans_updated', handleUpdate);
  }, []);

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honest, Transparent Pricing</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-ink dark:text-white tracking-tight">
            Simple plans for growing companies
          </h1>
          <p className="text-sm sm:text-base text-ink-muted dark:text-neutral-300 leading-relaxed">
            All plans include SSL encryption, daily backups, automated software upgrades, and unlimited
            free customer portal users.
          </p>

          {/* Billing Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              className={`text-xs font-medium cursor-pointer ${
                billingCycle === 'monthly' ? 'text-ink dark:text-white font-bold' : 'text-neutral-400'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly Billing
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'annual' ? 'monthly' : 'annual')}
              className="relative w-12 h-6 rounded-full bg-black/10 dark:bg-white/10 p-0.5 transition-colors focus:outline-none"
              aria-label="Toggle billing cadence"
            >
              <div
                className={`w-5 h-5 rounded-full bg-accent shadow-sm transition-transform duration-200 ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-xs font-medium cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual' ? 'text-ink dark:text-white font-bold' : 'text-neutral-400'
              }`}
              onClick={() => setBillingCycle('annual')}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards (Loaded directly from single source of truth) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
          {plans.map((plan) => {
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'bg-white dark:bg-[#15171F] border-2 border-accent shadow-2xl scale-[1.02] z-10'
                    : 'bg-white dark:bg-[#111318] border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif font-black text-2xl text-ink dark:text-white">{plan.name}</h3>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300">
                      {plan.trialDays}-Day Free Trial
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 min-h-[36px] leading-relaxed mb-6">
                    {plan.tagline}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-serif font-black text-4xl sm:text-5xl text-ink dark:text-white">
                      ${price}
                    </span>
                    <span className="text-xs text-neutral-400">/ month billed {billingCycle}</span>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-black/5 dark:border-white/5 mb-8">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                      What&apos;s Included:
                    </p>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-200">
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5">
                  <Link
                    href={plan.ctaHref}
                    className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      plan.popular
                        ? 'bg-accent text-white hover:opacity-95 shadow-md shadow-accent/20'
                        : 'bg-black/5 dark:bg-white/10 text-ink dark:text-white hover:bg-black/10 dark:hover:bg-white/15'
                    }`}
                  >
                    <span>{plan.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-ink dark:text-white">Detailed Plan Matrix</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              Compare modular capabilities, storage limits, and API throughput side-by-side.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111318] shadow-sm">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02]">
                  <th className="p-4 sm:p-5 font-semibold text-neutral-500 uppercase tracking-wider">Features & Limits</th>
                  {plans.map((p) => (
                    <th key={p.id} className="p-4 sm:p-5 font-bold text-ink dark:text-white text-center w-1/4">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                <tr>
                  <td className="p-4 font-medium text-neutral-700 dark:text-neutral-300">Team Member Seats</td>
                  {plans.map((p) => (
                    <td key={p.id} className="p-4 text-center font-mono">
                      {p.limits.seats}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium text-neutral-700 dark:text-neutral-300">Encrypted Storage</td>
                  {plans.map((p) => (
                    <td key={p.id} className="p-4 text-center font-mono">
                      {p.limits.storageGb} {typeof p.limits.storageGb === 'number' ? 'GB' : ''}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium text-neutral-700 dark:text-neutral-300">Contact Records</td>
                  {plans.map((p) => (
                    <td key={p.id} className="p-4 text-center font-mono">
                      {p.limits.contacts}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium text-neutral-700 dark:text-neutral-300">Monthly Invoices & Orders</td>
                  {plans.map((p) => (
                    <td key={p.id} className="p-4 text-center font-mono">
                      {p.limits.monthlyInvoices}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium text-neutral-700 dark:text-neutral-300">API Rate Limit</td>
                  {plans.map((p) => (
                    <td key={p.id} className="p-4 text-center font-mono text-[11px]">
                      {p.limits.apiRequestsMonth}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium text-neutral-700 dark:text-neutral-300">PostgreSQL RLS Isolation</td>
                  {plans.map((p) => (
                    <td key={p.id} className="p-4 text-center text-emerald-500 font-bold">
                      ✓ Included
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-ink dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              Everything you need to know about our billing, security, and setup.
            </p>
          </div>

          <div className="space-y-3">
            {PRICING_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#14161C] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-ink dark:text-neutral-100 hover:text-accent"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-accent' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-black/5 dark:border-white/5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
