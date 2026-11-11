'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Briefcase, Wrench, Store, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const solutions = [
  {
    icon: <Truck className="w-6 h-6 text-orange-500" />,
    id: 'wholesale',
    audience: 'Wholesale & Distribution',
    title: 'High-Volume Order Fulfillment & Multi-Location Stock',
    desc: 'Automate high-velocity replenishment cycles, client-specific wholesale price lists, and delivery route tracking with real-time stock reservations.',
    metrics: [{ val: '45%', label: 'Faster Picking' }, { val: '99.8%', label: 'Order Accuracy' }],
    useCases: [
      'Tiered bulk price contracts and customer trade credit terms',
      'Instant lot tracking with barcode verification',
      'Automated reorder point requisitions sent to suppliers',
    ],
  },
  {
    icon: <Briefcase className="w-6 h-6 text-purple-500" />,
    id: 'services',
    audience: 'Professional & Tech Services',
    title: 'Project Timesheets to Automated Retainer Invoicing',
    desc: 'Unify client onboarding, project milestone delivery, billable hours tracking, and automated recurring retainers in a single workflow.',
    metrics: [{ val: '100%', label: 'Billable Capture' }, { val: '12 hrs/mo', label: 'Admin Saved' }],
    useCases: [
      'Visual Gantt and Kanban project milestones tied to contract scope',
      'Automatic retainer draw-down and rollover management',
      'One-click client portal access for task review and quote approval',
    ],
  },
  {
    icon: <Wrench className="w-6 h-6 text-blue-500" />,
    id: 'field-ops',
    audience: 'Field Operations & Maintenance',
    title: 'Service Dispatch, Asset Maintenance & Mobile Work Orders',
    desc: 'Equip technicians with real-time customer histories, spare part consumption logging, and immediate digital invoice sign-offs on site.',
    metrics: [{ val: '32%', label: 'First-Time Fix Rate' }, { val: '0', label: 'Paper Work Orders' }],
    useCases: [
      'Mobile-friendly equipment maintenance logs and SLA tracking',
      'Direct warehouse deduction when spare parts are consumed',
      'On-site photo attachments and digital customer signature capture',
    ],
  },
  {
    icon: <Store className="w-6 h-6 text-emerald-500" />,
    id: 'retail',
    audience: 'Modern Retail & Multi-Channel Brands',
    title: 'Unified Offline & Digital Sales with Synchronized Ledger',
    desc: 'Synchronize showroom sales orders, web store transactions, and central warehouse stock in one single ledger without night-time batch reconciliations.',
    metrics: [{ val: 'Zero', label: 'Overselling Events' }, { val: 'Real-Time', label: 'P&L Visibility' }],
    useCases: [
      'Centralized catalog synchronization across digital and retail channels',
      'Real-time tax invoices compliant with domestic VAT/GST regulations',
      'Customer lifetime value and return behavior analytics in CRM',
    ],
  },
];

export default function SolutionsPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tailored Industry Solutions</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-ink dark:text-white tracking-tight">
            Engineered for how your industry actually works
          </h1>
          <p className="text-sm sm:text-base text-ink-muted dark:text-neutral-300 leading-relaxed">
            Choose the operational blueprint pre-configured for your business model. Enable only the modules
            you need today, scale seamlessly tomorrow.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="space-y-16">
          {solutions.map((sol, index) => (
            <div
              key={sol.id}
              className={`rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm flex flex-col lg:flex-row items-center gap-10 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/5 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                  {sol.icon}
                  <span>{sol.audience}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink dark:text-white">
                  {sol.title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {sol.desc}
                </p>

                <div className="space-y-2.5 pt-2">
                  {sol.useCases.map((uc, uIdx) => (
                    <div key={uIdx} className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-200">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      <span>{uc}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href={`/signup?solution=${sol.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 hover:opacity-95 transition-all"
                  >
                    <span>Launch {sol.audience} Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Stats Card */}
              <div className="w-full lg:w-80 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 p-8 flex flex-col justify-around gap-6 text-center">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                  Proven Impact Metrics
                </h4>
                {sol.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="space-y-1">
                    <span className="font-serif font-black text-4xl text-accent">{m.val}</span>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

