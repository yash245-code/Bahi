'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  FileText,
  Package,
  Receipt,
  Wallet,
  ClipboardCheck,
  BarChart3,
  Check,
} from 'lucide-react';

interface WorkflowStep {
  id: number;
  module: string;
  text: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 1,
    module: 'Find Customers',
    text: 'A new customer says hello on your website',
    icon: Users,
  },
  {
    id: 2,
    module: 'Send Price Quote',
    text: 'You send a price quote, and they click yes!',
    icon: FileText,
  },
  {
    id: 3,
    module: 'Check Stock',
    text: 'Items are saved in your warehouse right away',
    icon: Package,
  },
  {
    id: 4,
    module: 'Send Bill',
    text: 'A neat bill is made and emailed automatically',
    icon: Receipt,
  },
  {
    id: 5,
    module: 'Get Paid',
    text: 'Payment arrives safely in your bank account',
    icon: Wallet,
  },
  {
    id: 6,
    module: 'Pack & Deliver',
    text: 'Your team gets a simple checklist to pack the box',
    icon: ClipboardCheck,
  },
  {
    id: 7,
    module: 'See Results',
    text: 'Your dashboard shows today’s sales and profit',
    icon: BarChart3,
  },
];

export function LiveWorkflowCard() {
  const [done, setDone] = useState<number>(0);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDone(7);
      return;
    }

    let currentDone = 0;
    let pauseTicks = 0;

    const interval = setInterval(() => {
      // Pause if tab is hidden
      if (document.visibilityState === 'hidden') return;

      if (currentDone < 7) {
        currentDone += 1;
        setDone(currentDone);
      } else {
        // Step 7 finished: hold for ~3 ticks (~3.3s), then reset and loop
        pauseTicks += 1;
        if (pauseTicks >= 3) {
          currentDone = 0;
          pauseTicks = 0;
          setDone(0);
        }
      }
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = Math.min(100, Math.round((done / 7) * 100));

  return (
    <div className="relative w-full max-w-xl mx-auto lg:mx-0">
      {/* Ambient Backlight Glow */}
      <div
        className="absolute -inset-2 bg-gradient-to-r from-accent/30 to-brand-700/20 rounded-2xl blur-xl -z-10 opacity-70 pointer-events-none"
        aria-hidden="true"
      />

      <div
        className="rounded-2xl bg-[#050505] border border-white/[0.08] shadow-2xl overflow-hidden"
        role="img"
        aria-label="Animated demo showing one order flowing through Bahi's modules"
      >
        <span className="sr-only">
          Interactive workflow simulation showing a customer order moving through CRM, Quotations, Inventory, Invoicing, Accounts, Sprints and HR, and Reports.
        </span>

        {/* ─── 1. Header Bar ────────────────────────────────────────── */}
        <div className="px-4 py-3 bg-[#050505] border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-status-danger/80 inline-block" aria-hidden="true" />
            <span className="w-3 h-3 rounded-full bg-status-warning/80 inline-block" aria-hidden="true" />
            <span className="w-3 h-3 rounded-full bg-status-success/80 inline-block" aria-hidden="true" />
            <span className="text-[11px] font-mono text-neutral-400 ml-2">Live Demo · How an Order Works</span>
          </div>

          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
            </span>
            <span className="text-[10px] font-mono text-status-success font-bold uppercase tracking-wider">
              Live
            </span>
          </div>
        </div>

        {/* ─── 2. Progress Bar ──────────────────────────────────────── */}
        <div className="h-[2px] w-full bg-white/[0.06] overflow-hidden" aria-hidden="true">
          <div
            className="h-full bg-gradient-to-r from-accent to-brand-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* ─── 3. Steps List ────────────────────────────────────────── */}
        <div className="p-3.5 sm:p-4 bg-[#050505]">
          <ul className="space-y-2">
            {WORKFLOW_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isComplete = idx < done;
              const isActive = idx === done && done < 7;

              let rowStyle = 'border-transparent opacity-40 bg-transparent';
              let iconTileStyle = 'bg-[#101010] text-neutral-400 border border-white/[0.06]';
              let badgeStyle = 'opacity-0 scale-75 bg-transparent border-transparent text-transparent';

              if (isComplete) {
                rowStyle = 'border-accent/40 bg-accent/[0.08] opacity-100 shadow-xs';
                iconTileStyle = 'bg-accent text-white border border-accent/60 shadow-xs';
                badgeStyle = 'opacity-100 scale-100 bg-status-success/20 text-status-success border border-status-success/40';
              } else if (isActive) {
                rowStyle = 'border-white/[0.1] bg-white/[0.03] opacity-100';
                iconTileStyle = 'bg-[#141512] text-neutral-100 border border-white/[0.1]';
                badgeStyle = 'opacity-0 scale-75 bg-transparent border-transparent text-transparent';
              }

              return (
                <li
                  key={step.id}
                  className={`flex items-center justify-between gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border transition-all duration-500 ${rowStyle}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Icon Tile */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-500 ${iconTileStyle}`}
                      aria-hidden="true"
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>

                    {/* Step Content */}
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 font-mono leading-none mb-1">
                        {step.module}
                      </div>
                      <p className="text-xs font-medium text-neutral-200 truncate leading-snug">
                        {step.text}
                      </p>
                    </div>
                  </div>

                  {/* Complete Checkmark Badge */}
                  <div
                    aria-hidden="true"
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${badgeStyle}`}
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ─── 4. Footer ────────────────────────────────────────────── */}
        <div className="px-4 py-3 bg-[#000000] border-t border-white/[0.06] flex items-center justify-between text-xs">
          <span className="text-neutral-400 text-[11px] sm:text-xs">
            Everything talks to each other. You only type things once.
          </span>
          <Link
            href="/applications"
            className="text-accent hover:text-brand-400 font-semibold text-[11px] sm:text-xs flex items-center gap-1 transition-colors"
          >
            <span>See All Apps</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
