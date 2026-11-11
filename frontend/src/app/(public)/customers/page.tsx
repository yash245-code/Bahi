'use client';

import React from 'react';
import Link from 'next/link';
import { Quote, Sparkles } from 'lucide-react';

const caseStudies = [
  {
    company: 'Apex Industrial Logistics',
    industry: 'Supply Chain & Third-Party Warehousing',
    logo: 'AL',
    quote:
      'We replaced three legacy systems (QuickBooks, a custom inventory MySQL app, and Salesforce) with Bahi. Our order dispatch time dropped from 4 hours to 18 minutes.',
    author: 'Vikram Sethi',
    role: 'Chief Operating Officer',
    metrics: [
      { label: 'Dispatch Velocity', value: '+420%' },
      { label: 'Annual SaaS Cost Saved', value: '$38,000' },
      { label: 'Inventory Discrepancy', value: '0.02%' },
    ],
  },
  {
    company: 'Zenith Global Dynamics',
    industry: 'Hardware & IT Infrastructure',
    logo: 'ZG',
    quote:
      'The multi-currency quotation engine and automated tax invoicing let us scale our cross-border operations into 12 countries without hiring additional accounting headcount.',
    author: 'Priya Nambiar',
    role: 'Director of Finance',
    metrics: [
      { label: 'International Revenue', value: '+185%' },
      { label: 'Month-End Close', value: '2 Days (was 14)' },
      { label: 'Quotes Converted', value: '+34%' },
    ],
  },
  {
    company: 'Hyperion Design & Build',
    industry: 'Commercial Architecture & Construction',
    logo: 'HB',
    quote:
      'Connecting project timesheets directly to milestone-based customer invoices ended billing disputes permanently. Our clients love the transparent digital sign-off portal.',
    author: 'Marcus Vance',
    role: 'Managing Partner',
    metrics: [
      { label: 'Unbilled Leakage', value: '0%' },
      { label: 'Invoice Payment Speed', value: '8.4 Days' },
      { label: 'Team Adoption', value: '100% in 10 Days' },
    ],
  },
];

export default function CustomersPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proven Customer Impact</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-ink dark:text-white tracking-tight">
            Trusted by operators driving real economic growth
          </h1>
          <p className="text-sm sm:text-base text-ink-muted dark:text-neutral-300 leading-relaxed">
            Discover how small and mid-market organizations use Bahi to streamline daily operations,
            eliminate manual paperwork, and scale their bottom line.
          </p>
        </div>

        {/* Logo Strip */}
        <div className="mb-20 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#111318] p-8">
          <p className="text-center text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-6 font-semibold">
            Powers more than 4,200+ fast-growing enterprises worldwide
          </p>
          <div className="flex flex-wrap items-center justify-around gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="font-serif font-bold text-lg text-ink dark:text-white tracking-wider">APEX LOGISTICS</span>
            <span className="font-sans font-black text-lg text-ink dark:text-white tracking-widest">ZENITH TECH</span>
            <span className="font-serif italic font-bold text-lg text-ink dark:text-white">HYPERION BUILD</span>
            <span className="font-mono font-bold text-lg text-ink dark:text-white">KINETIC MOTORS</span>
            <span className="font-serif font-black text-lg text-ink dark:text-white">VANGUARD LABS</span>
          </div>
        </div>

        {/* Case Studies Cards */}
        <div className="space-y-12">
          {caseStudies.map((cs, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm flex flex-col lg:flex-row gap-8 justify-between items-center"
            >
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 text-accent font-serif font-black flex items-center justify-center text-sm">
                    {cs.logo}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-ink dark:text-white">{cs.company}</h3>
                    <p className="text-xs text-neutral-500">{cs.industry}</p>
                  </div>
                </div>

                <div className="relative pl-6 border-l-2 border-accent">
                  <Quote className="w-6 h-6 text-accent/30 absolute -top-1 -left-3 bg-white dark:bg-[#14161C]" />
                  <p className="font-serif text-lg text-neutral-800 dark:text-neutral-200 leading-relaxed italic">
                    &ldquo;{cs.quote}&rdquo;
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-ink dark:text-white">{cs.author}</p>
                  <p className="text-[11px] text-neutral-500">{cs.role}</p>
                </div>
              </div>

              {/* Metrics Box */}
              <div className="w-full lg:w-72 grid grid-cols-1 gap-4 p-6 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                {cs.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="text-center p-3 rounded-xl bg-white dark:bg-[#1A1C24] shadow-xs">
                    <span className="font-serif font-black text-2xl text-accent">{m.value}</span>
                    <p className="text-[11px] text-neutral-500 font-medium mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center space-y-4">
          <h2 className="font-serif text-3xl font-bold text-ink dark:text-white">
            Ready to achieve similar operational efficiency?
          </h2>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Book a personalized walkthrough with a solutions architect or start your 14-day free trial now.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 hover:opacity-95 transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-ink dark:text-white font-medium text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              Request Custom Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
