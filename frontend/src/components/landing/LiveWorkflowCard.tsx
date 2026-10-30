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
        className="absolute -inset-2 bg-gradient-to-r from-[#FF5C38]/30 via-[#FF8A65]/20 to-amber-500/15 rounded-2xl blur-xl -z-10 opacity-80 pointer-events-none"
        aria-hidden="true"
      />

      <div
        className="rounded-2xl bg-[#0D0E14]/95 border border-white/12 shadow-2xl backdrop-blur-xl overflow-hidden ring-1 ring-white/10"
        role="img"
        aria-label="Animated demo showing one order flowing through Bahi's modules"
      >
        <span className="sr-only">
          Interactive workflow simulation showing a customer order moving through CRM, Quotations, Inventory, Invoicing, Accounts, Sprints and HR, and Reports.
        </span>

        {/* ─── 1. Header Bar ────────────────────────────────────────── */}
        <div className="px-4 py-3 bg-[#11131A] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block shadow-2xs" aria-hidden="true" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block shadow-2xs" aria-hidden="true" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block shadow-2xs" aria-hidden="true" />
            <span className="text-[11px] font-mono text-slate-300 ml-2 font-medium">Live Demo · How an Order Works</span>
          </div>

          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Live
            </span>
          </div>
        </div>

        {/* ─── 2. Progress Bar ──────────────────────────────────────── */}
        <div className="h-[2px] w-full bg-white/[0.08] overflow-hidden" aria-hidden="true">
          <div
            className="h-full bg-gradient-to-r from-[#FF5C38] via-[#FF8A65] to-emerald-400 transition-all duration-500 ease-out shadow-[0_0_8px_#FF5C38]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* ─── 3. Steps List ────────────────────────────────────────── */}
        <div className="p-3.5 sm:p-4 bg-[#0D0E14]">
          <ul className="space-y-2">
            {WORKFLOW_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isComplete = idx < done;
              const isActive = idx === done && done < 7;

              let rowStyle = 'border-white/[0.06] bg-white/[0.02] opacity-80 hover:opacity-100';
              let iconTileStyle = 'bg-white/[0.06] text-slate-300 border border-white/10';
              let labelStyle = 'text-slate-400';
              let textStyle = 'text-slate-200';
              let badgeStyle = 'opacity-0 scale-75 bg-transparent border-transparent text-transparent';

              if (isComplete) {
                rowStyle = 'border-[#FF5C38]/40 bg-[#FF5C38]/[0.12] opacity-100 shadow-sm';
                iconTileStyle = 'bg-gradient-to-br from-[#FF5C38] to-[#E04724] text-white border border-[#FF5C38] shadow-sm';
                labelStyle = 'text-[#FFA085]';
                textStyle = 'text-white font-medium';
                badgeStyle = 'opacity-100 scale-100 bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
              } else if (isActive) {
                rowStyle = 'border-amber-400/50 bg-amber-400/[0.1] opacity-100 shadow-sm ring-1 ring-amber-400/20';
                iconTileStyle = 'bg-amber-500 text-white border border-amber-400 shadow-sm';
                labelStyle = 'text-amber-300';
                textStyle = 'text-white font-medium';
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
                      <div className={`text-[10px] uppercase font-bold tracking-wider font-mono leading-none mb-1 ${labelStyle}`}>
                        {step.module}
                      </div>
                      <p className={`text-xs font-medium truncate leading-snug ${textStyle}`}>
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
        <div className="px-4 py-3 bg-[#090A0D] border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-slate-300 text-[11px] sm:text-xs">
            Everything talks to each other. You only type things once.
          </span>
          <Link
            href="/applications"
            className="text-[#FF7A59] hover:text-[#FFA085] font-bold text-[11px] sm:text-xs flex items-center gap-1 transition-colors"
          >
            <span>See All Apps</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
