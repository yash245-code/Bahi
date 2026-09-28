'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { ServicesCarousel } from '@/components/landing/ServicesCarousel';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'crm' | 'sales' | 'inventory' | 'accounting' | 'hr' | 'projects'>('crm');
  const [terminalTab, setTerminalTab] = useState<'terminal' | 'schema' | 'telemetry'>('terminal');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Mouse position for cursor-following gradient blob
  const [mousePos, setMousePos] = useState({ x: 400, y: 300 });
  const heroRef = useRef<HTMLDivElement>(null);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  // Magnetic CTA Button Effect
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const handleButtonMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.25;
    const deltaY = (e.clientY - centerY) * 0.25;
    setButtonOffset({ x: deltaX, y: deltaY });
  };
  const handleButtonMouseLeave = () => setButtonOffset({ x: 0, y: 0 });

  // Animated Counter-Up State for Bento Stats
  const [counters, setCounters] = useState({
    modules: 0,
    uptime: 90.0,
    gmv: 0,
    latency: 250,
  });

  useEffect(() => {
    const duration = 1600;
    const steps = 40;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);

      setCounters({
        modules: Math.round(ease * 6),
        uptime: +(90.0 + ease * 9.99).toFixed(2),
        gmv: Math.round(ease * 450),
        latency: Math.round(250 - ease * 165),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounters({ modules: 6, uptime: 99.99, gmv: 450, latency: 85 });
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // Live Typing Terminal Simulation
  const terminalLines = [
    { text: '$ bahi cluster:sync --live --atlas', color: 'text-white font-bold' },
    { text: '✓ Authenticated to cluster0.hquokkc.mongodb.net (12ms)', color: 'text-status-success' },
    { text: '✓ 23 collections & cross-tenant indexes verified', color: 'text-neutral-200' },
    { text: '✓ Multi-tenant session initialized: Acme Corp', color: 'text-brand-400' },
    { text: '→ Core ERP engine ready at port 4000 (P99 < 85ms)', color: 'text-accent font-semibold' },
  ];

  const [visibleLinesCount, setVisibleLinesCount] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLinesCount((prev) => (prev < terminalLines.length ? prev + 1 : 1));
    }, 1800);
    return () => clearInterval(interval);
  }, [terminalLines.length]);

  const modulesData = {
    crm: {
      tag: 'Customer Relationship Management',
      title: 'Precision Pipelines & Inbound Conversions',
      desc: 'Track leads from cold discovery to qualified contract with fluid Kanban columns, automated deal scoring, and 360-degree company directory sync.',
      metrics: [
        { label: 'Avg Close Rate', value: '+34%' },
        { label: 'Deal Velocity', value: '2.4x' },
        { label: 'Pipeline Visibility', value: '100%' },
      ],
      features: [
        'Visual multi-stage Kanban pipelines with close probability forecasting',
        'Shared contact and vendor directory with real-time party indexing',
        'Automatic activity logs (calls, meetings, tasks, follow-up notes)',
        '1-click lead-to-opportunity qualification engine',
      ],
      previewCard: {
        title: 'Enterprise OS Suite',
        client: 'NexGen Systems',
        value: '$15,000',
        stage: 'Qualified (65%)',
        priority: '🔥 Hot Deal',
      },
    },
    sales: {
      tag: 'Sales & Quotation Engine',
      title: 'Turn Signed Proposals into Confirmed Orders',
      desc: 'Generate professional multi-currency quotations, automate line-item tax calculation, and convert approved proposals into confirmed sales orders seamlessly.',
      metrics: [
        { label: 'Quote Turnaround', value: '< 5 min' },
        { label: 'Order Accuracy', value: '99.8%' },
        { label: 'Revenue Growth', value: '+28%' },
      ],
      features: [
        'Dynamic proposal builder with live totals, discounts, and tiered approvals',
        '1-click proposal confirmation to Sales Order (SO-XXXX)',
        'Custom multi-tier discount matrix and manager sign-off workflows',
        'PDF exports, audit trails, and automatic email dispatching',
      ],
      previewCard: {
        title: 'Quote QT-00014',
        client: 'Summit Digital',
        value: '$22,000',
        stage: 'Confirmed',
        priority: '⚡ Order Placed',
      },
    },
    inventory: {
      tag: 'Multi-Warehouse Inventory Control',
      title: 'Zero Stockouts Across Global Warehouses',
      desc: 'Real-time visibility over multi-location stock movements, SKU catalogs, automated reorder thresholds, and inbound/outbound transfer ledgers.',
      metrics: [
        { label: 'Stock Accuracy', value: '99.9%' },
        { label: 'Fulfillment Speed', value: '+45%' },
        { label: 'Shrinkage Reduction', value: '-80%' },
      ],
      features: [
        'Multi-warehouse location mapping (WH-MAIN, WH-WEST, WH-SOUTH)',
        'Stock move ledgers (RECEIPT, SHIPMENT, TRANSFER, AUDIT)',
        'Real-time low stock warnings and automated reorder alerts',
        'Direct synchronization with sales orders and supplier shipments',
      ],
      previewCard: {
        title: 'WH-MAIN Restock',
        client: 'Wireless Keyboard Pro',
        value: '500 units',
        stage: 'Received',
        priority: '✓ In Stock',
      },
    },
    accounting: {
      tag: 'Automated Invoicing & Reconciliation',
      title: 'Instant Cashflow Visibility & Ledger Auditing',
      desc: 'Streamline the entire cash cycle from sales order billing to partial wire payments, overdue aging notices, and real-time P&L ledger tracking.',
      metrics: [
        { label: 'Days Sales Outstanding', value: '-14 Days' },
        { label: 'Automated Billing', value: '94%' },
        { label: 'Reconciliation Time', value: '-60%' },
      ],
      features: [
        'Automated invoice generation directly from confirmed sales orders',
        'Multi-method payment tracking (Bank Transfer, Credit Card, Cash)',
        'Overdue aging buckets and payment status lifecycle',
        'Full financial ledger audit trails and tax compliance reporting',
      ],
      previewCard: {
        title: 'Invoice INV-00048',
        client: 'Summit Digital',
        value: '$22,000',
        stage: 'Paid (Wire)',
        priority: '✓ Reconciled',
      },
    },
    hr: {
      tag: 'Human Resources & Attendance',
      title: 'Unified Workforce Directory & Leave Workflows',
      desc: 'Centralize employee profiles, department headcount indexing, multi-tier leave approvals, and attendance records without messy spreadsheets.',
      metrics: [
        { label: 'Leave Processing', value: 'Same Day' },
        { label: 'Admin Overhead', value: '-40%' },
        { label: 'Employee NPS', value: '88' },
      ],
      features: [
        'Unified staff directory with department and position hierarchy indexing',
        'Multi-type leave management (Annual, Sick, Personal, Unpaid)',
        'Manager routing workflows with 1-click approvals or rejections',
        'Seamless integration with project timesheets and payroll accounting',
      ],
      previewCard: {
        title: 'Annual Leave Req',
        client: 'Sarah Chen (Finance)',
        value: '6 Days',
        stage: 'Approved',
        priority: '🌴 Leave Scheduled',
      },
    },
    projects: {
      tag: 'Project Management & Timesheets',
      title: 'Deliver Client Projects On-Time and On-Budget',
      desc: 'Execute client deliverables with sprint task boards, priority tracking, billable timesheets, and direct profitability analytics.',
      metrics: [
        { label: 'On-Time Delivery', value: '96%' },
        { label: 'Billable Utilization', value: '+22%' },
        { label: 'Sprint Velocity', value: '+30%' },
      ],
      features: [
        'Agile task tracking with status workflows (TODO, IN PROGRESS, DONE)',
        'Granular task priority levels and manager assignments',
        'Billable timesheets linked directly to employees and tasks',
        'Project budget vs actual performance tracking',
      ],
      previewCard: {
        title: 'Mobile App MVP',
        client: 'TechStart Inc.',
        value: '312h Logged',
        stage: 'Sprint 12 (88%)',
        priority: '⚡ Ahead of Plan',
      },
    },
  };

  const currentMod = modulesData[activeTab];

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-50 font-sans selection:bg-accent selection:text-white relative overflow-x-clip">
      {/* ─── Grain / Noise Texture Overlay ────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none bg-noise z-40 opacity-40" />

      {/* ─── Subtle Dark Grid Background ──────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none bg-dark-grid z-0 opacity-50" />

      {/* ─── Redesigned High-Performance Navigation Bar ─────────── */}
      <Navbar
        activeModuleTab={activeTab}
        onSelectModuleTab={(mod) => setActiveTab(mod)}
        latency={12}
      />


      {/* ─── Asymmetric Split Hero Section ────────────────────────── */}
      <section
        id="hero"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="relative z-10 pt-16 pb-20 px-6 max-w-7xl mx-auto overflow-hidden"
      >
        {/* Dynamic cursor-following gradient blob */}
        <div
          className="absolute pointer-events-none rounded-full blur-3xl opacity-25 transition-all duration-300 ease-out"
          style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, #A8462F 0%, rgba(168, 70, 47, 0) 70%)',
            left: `${mousePos.x - 300}px`,
            top: `${mousePos.y - 300}px`,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* ── Left Column (~58%): Headline, Subtext, CTAs ───────── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
              </span>
              <span className="text-xs font-semibold text-brand-200">MongoDB Atlas Cluster Live</span>
              <span className="text-xs text-neutral-400">• Latency: 12ms</span>
            </div>

            {/* Main Headline with Typographic Contrast */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Run Your Entire Enterprise on{' '}
              <span className="block mt-1 font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-white to-brand-200 tracking-normal">
                One Unified Platform.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-neutral-400 max-w-xl font-normal leading-relaxed">
              Consolidate CRM, Quotations, Multi-Warehouse Inventory, Invoicing, HR, and Sprints into a single high-velocity operations OS with zero synchronization lag.
            </p>

            {/* CTAs with Magnetic Effect */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/dashboard"
                onMouseMove={handleButtonMouseMove}
                onMouseLeave={handleButtonMouseLeave}
                style={{
                  transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
                }}
                className="btn-primary text-sm py-3.5 px-6 shadow-accent transition-transform duration-100 flex items-center justify-center gap-2.5 group"
              >
                <span>Start Free 14-Day Trial</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-neutral-50 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors"
              >
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
                Explore Live Demo
              </Link>
            </div>

            {/* Mini Trust Line */}
            <div className="pt-4 flex items-center gap-6 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-status-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-status-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Multi-Tenant Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-status-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>MongoDB Atlas Native</span>
              </div>
            </div>
          </div>

          {/* ── Right Column (~42%): Live Interactive Terminal Widget ─ */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-accent/30 to-brand-700/20 rounded-2xl blur-xl -z-10 opacity-70" />

            <div className="rounded-2xl bg-neutral-950 border border-neutral-700 shadow-2xl overflow-hidden">
              {/* Window Header with Pulsing Dot */}
              <div className="px-4 py-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-status-danger/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-status-warning/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-status-success/80 inline-block" />
                  <span className="text-[11px] font-mono text-neutral-400 ml-2">bahi-engine v1.2</span>
                </div>

                {/* Pulsing MongoDB Indicator */}
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
                  </span>
                  <span className="text-[10px] font-mono text-status-success font-bold">
                    MongoDB Connected
                  </span>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-neutral-800 bg-neutral-900 text-xs font-mono">
                <button
                  onClick={() => setTerminalTab('terminal')}
                  className={`px-4 py-2 border-r border-neutral-800 transition-colors ${
                    terminalTab === 'terminal' ? 'bg-neutral-950 text-accent font-bold' : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  ⚡ Engine Log
                </button>
                <button
                  onClick={() => setTerminalTab('schema')}
                  className={`px-4 py-2 border-r border-neutral-800 transition-colors ${
                    terminalTab === 'schema' ? 'bg-neutral-950 text-accent font-bold' : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  📄 Schema Ledger
                </button>
                <button
                  onClick={() => setTerminalTab('telemetry')}
                  className={`px-4 py-2 transition-colors ${
                    terminalTab === 'telemetry' ? 'bg-neutral-950 text-accent font-bold' : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  📊 Telemetry
                </button>
              </div>

              {/* Window Body with Live Simulated Typing */}
              <div className="p-5 font-mono text-xs min-h-[260px] bg-neutral-950">
                {terminalTab === 'terminal' && (
                  <div className="space-y-2.5">
                    {terminalLines.slice(0, visibleLinesCount).map((l, idx) => (
                      <div key={idx} className={`${l.color} leading-relaxed animate-fade-in`}>
                        {l.text}
                      </div>
                    ))}
                    <div className="flex items-center gap-1 text-neutral-500">
                      <span className="animate-pulse">▋</span>
                      <span className="text-[11px]">listening for operations...</span>
                    </div>
                  </div>
                )}

                {terminalTab === 'schema' && (
                  <div className="space-y-1 text-neutral-200 text-[11px] leading-relaxed">
                    <p className="text-neutral-400">// Multi-Tenant Enterprise Schema (MongoDB)</p>
                    <p><span className="text-accent">model</span> <span className="text-white font-bold">Tenant</span> &#123;</p>
                    <p className="pl-4">id String @id @default(auto()) @map(&quot;_id&quot;)</p>
                    <p className="pl-4">name String</p>
                    <p className="pl-4">users User[]</p>
                    <p className="pl-4">pipelines PipelineStage[]</p>
                    <p className="pl-4">invoices Invoice[]</p>
                    <p>&#125;</p>
                    <p className="text-status-success pt-1">✓ 23 models compiled and synced</p>
                  </div>
                )}

                {terminalTab === 'telemetry' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-neutral-800">
                      <span className="text-neutral-400">Cluster Latency</span>
                      <span className="font-bold text-status-success">12ms (P99)</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-neutral-800">
                      <span className="text-neutral-400">Active Connections</span>
                      <span className="font-bold text-white">42 Concurrent</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-neutral-800">
                      <span className="text-neutral-400">Memory Usage</span>
                      <span className="font-bold text-accent">142 MB / 512 MB</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-neutral-400">Tenant Isolation</span>
                      <span className="font-bold text-status-success">Strict Row-Level</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="px-4 py-2.5 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">Acme Corp • Staging Session</span>
                <Link href="/dashboard" className="text-accent font-semibold hover:underline flex items-center gap-1">
                  Open Live Dashboard ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mini Square Cards Services Carousel ──────────────────── */}
      <div id="services">
        <ServicesCarousel
          activeModuleId={activeTab}
          onSelectModule={(mod) => setActiveTab(mod)}
        />
      </div>

      {/* ─── Uneven Bento-Grid Stats Bar with Counter-Up ─────────── */}
      <section id="stats" className="relative z-10 py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Card 1: Prominent Feature Bento (5 cols) */}
          <div className="md:col-span-5 rounded-2xl bg-neutral-800 border border-neutral-700 p-6 hover:border-neutral-600 transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-accent">Platform Scale</span>
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-700">
                FY 2026
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
              ${counters.gmv}M+
            </div>
            <p className="text-sm font-semibold text-white mt-1">Annual GMV Managed</p>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Powering global transactions across high-volume supply chains and multi-currency billing accounts.
            </p>
          </div>

          {/* Card 2: Enterprise SLA (3 cols) */}
          <div className="md:col-span-3 rounded-2xl bg-neutral-800 border border-neutral-700 p-6 hover:border-neutral-600 transition-all relative group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-status-success">Reliability</span>
              <span className="flex h-2 w-2 rounded-full bg-status-success" />
            </div>
            <div className="text-4xl font-black text-status-success tracking-tight font-mono">
              {counters.uptime}%
            </div>
            <p className="text-sm font-semibold text-white mt-1">Enterprise Uptime SLA</p>
            <p className="text-xs text-neutral-400 mt-1">
              Zero planned maintenance windows with automatic multi-region cluster failover.
            </p>
          </div>

          {/* Card 3: Terracotta Accent Bento (4 cols) */}
          <div className="md:col-span-4 rounded-2xl bg-gradient-to-br from-accent to-brand-800 border border-brand-400/40 p-6 text-white hover:brightness-105 transition-all shadow-accent">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-white/90">Speed SLA</span>
              <span className="text-[10px] font-mono text-white/90 bg-black/20 px-2 py-0.5 rounded border border-white/20">
                P99 Peak
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
              &lt; {counters.latency}ms
            </div>
            <p className="text-sm font-bold text-white mt-1">API Execution Latency</p>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              Engineered with NestJS fast-path routing and MongoDB Atlas replica sets.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Layered & Overlapping Module Showcase ─────────────────── */}
      <section id="modules" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-accent">Unified Business Suite</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            Six Modular Systems.{' '}
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-200">
              One Shared Engine.
            </span>
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base">
            Every department accesses the exact same operational dataset. No disconnected APIs, no sync delays.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {(Object.keys(modulesData) as Array<keyof typeof modulesData>).map((tabKey) => {
            const isActive = activeTab === tabKey;
            const moduleActiveClasses: Record<string, string> = {
              crm: 'bg-module-crm text-white shadow-glow-crm border border-module-crm-border',
              sales: 'bg-module-billing text-white shadow-glow-billing border border-module-billing-border',
              inventory: 'bg-module-inventory text-white shadow-glow-inventory border border-module-inventory-border',
              accounting: 'bg-module-accounting text-white shadow-glow-accounting border border-module-accounting-border',
              hr: 'bg-module-hr text-white shadow-glow-hr border border-module-hr-border',
              projects: 'bg-module-projects text-white shadow-glow-projects border border-module-projects-border',
            };
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
                  isActive
                    ? (moduleActiveClasses[tabKey] || 'bg-accent text-white shadow-accent border border-accent/40')
                    : 'bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 hover:bg-neutral-700'
                }`}
              >
                {tabKey === 'crm' ? 'CRM & Deals' : tabKey === 'hr' ? 'HR & Teams' : tabKey}
              </button>
            );
          })}
        </div>

        {/* Layered / Overlapping Card Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Info Card (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-neutral-800 border border-neutral-700 p-8 sm:p-10 shadow-xl space-y-5">
            <span className="inline-block text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-accent/20 text-brand-200 border border-accent/40">
              {currentMod.tag}
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {currentMod.title}
            </h3>

            <p className="text-neutral-400 text-sm leading-relaxed">
              {currentMod.desc}
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentMod.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                  <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Link to module */}
            <div className="pt-4 border-t border-neutral-700 flex items-center justify-between">
              <Link
                href={`/${activeTab}`}
                className="inline-flex items-center gap-2 font-bold text-xs text-accent hover:text-brand-400 transition-colors"
              >
                Open {activeTab.toUpperCase()} Module in Dashboard →
              </Link>

              <div className="flex items-center gap-4 text-xs">
                {currentMod.metrics.map((m, i) => (
                  <div key={i} className="text-right">
                    <span className="font-bold text-white block">{m.value}</span>
                    <span className="text-[10px] text-neutral-400">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overlapping Tactile Preview Cards (5 Cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[340px]">
            {/* Background Under-Card with slight counter-rotation */}
            <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-700 p-5 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between mb-3 text-xs text-neutral-400">
                <span>Status Audit Log</span>
                <span className="font-mono text-[10px]">#OP-8921</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-neutral-800 border border-neutral-700 flex justify-between">
                  <span className="text-white font-medium">Record Created</span>
                  <span className="text-status-success">✓ Live in MongoDB</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-800 border border-neutral-700 flex justify-between">
                  <span className="text-white font-medium">RBAC Permission</span>
                  <span className="text-neutral-400">Admin Role (Yash)</span>
                </div>
              </div>
            </div>

            {/* Overlapping Top Card with slight positive rotation and hover lift */}
            <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-600 p-6 shadow-2xl -mt-20 transform rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 relative z-20 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-accent/20 text-brand-200 border border-accent/40">
                  {currentMod.previewCard.priority}
                </span>
                <span className="text-xs font-mono font-bold text-accent">
                  {currentMod.previewCard.value}
                </span>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-accent transition-colors">
                {currentMod.previewCard.title}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5 mb-4">
                {currentMod.previewCard.client}
              </p>

              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-between text-xs">
                <span className="text-neutral-400">Stage Status</span>
                <span className="font-semibold text-white">{currentMod.previewCard.stage}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Full Terracotta / Rust Section Wash ───────────────────── */}
      <section
        id="architecture"
        className="relative z-10 py-24 px-6 bg-gradient-to-br from-accent via-brand-700 to-brand-800 text-white my-16 shadow-2xl"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded-full bg-black/25 text-brand-50 border border-white/20">
                Enterprise Ledger Security
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Architected for Zero-Drift Financial Integrity.
              </h2>
              <p className="text-white/85 text-base leading-relaxed">
                Most platforms stitch together separate databases with delayed webhooks. Bahi executes every transaction inside an atomic MongoDB replica transaction—ensuring invoices, stock moves, and lead qualifications reconcile simultaneously.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2 bg-black/20 px-3.5 py-2 rounded-xl border border-white/15">
                  <span>🔒 Multi-Tenant Tenant Isolation</span>
                </div>
                <div className="flex items-center gap-2 bg-black/20 px-3.5 py-2 rounded-xl border border-white/15">
                  <span>⚡ P99 Sub-100ms Queries</span>
                </div>
                <div className="flex items-center gap-2 bg-black/20 px-3.5 py-2 rounded-xl border border-white/15">
                  <span>📑 Double-Entry Ledger Ready</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-black/30 border border-white/20 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white">Production Cluster Health</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/15">
                  <span className="text-white/75">Active Database</span>
                  <span className="font-mono font-bold text-brand-200">cluster0.hquokkc (Atlas)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/15">
                  <span className="text-white/75">Collections Active</span>
                  <span className="font-bold text-white">23 Collections</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/15">
                  <span className="text-white/75">Data Encryption</span>
                  <span className="font-bold text-status-success">TLS 1.3 + AES-256</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/75">Cluster Status</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-status-success">
                    <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                    Optimal (0% Packet Loss)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing Section (Dark Dev-Tool Cards) ────────────────── */}
      <section id="pricing" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-accent">Transparent Pricing</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            Predictable Plans for Scaling Teams.
          </h2>
          <p className="mt-3 text-neutral-400 text-sm">
            All plans include CRM, Sales, Inventory, Accounting, HR, and Projects with unlimited records.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-6 inline-flex items-center p-1 rounded-xl bg-neutral-800 border border-neutral-700 text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-neutral-700 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                billingCycle === 'annual' ? 'bg-accent text-white shadow-accent' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="rounded-2xl bg-neutral-800 border border-neutral-700 p-8 space-y-6 hover:border-neutral-600 transition-all">
            <div>
              <h3 className="text-lg font-bold text-white">Starter</h3>
              <p className="text-xs text-neutral-400 mt-1">For early-stage operations & boutiques</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white font-mono">
                ${billingCycle === 'annual' ? '29' : '39'}
              </span>
              <span className="text-xs text-neutral-400">/ month</span>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-200 border-t border-neutral-700 pt-4">
              <li className="flex items-center gap-2">✓ Up to 5 Team Seats</li>
              <li className="flex items-center gap-2">✓ All 6 Core ERP Modules</li>
              <li className="flex items-center gap-2">✓ 1 Warehouse Location</li>
              <li className="flex items-center gap-2">✓ Community Support</li>
            </ul>
            <Link
              href="/dashboard"
              className="w-full btn-secondary text-xs py-3 text-center block"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Business Tier (Highlighted with Rust Border) */}
          <div className="rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-900 border-2 border-accent p-8 space-y-6 relative shadow-2xl">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-accent text-white text-[10px] uppercase font-bold tracking-widest shadow-md">
              Most Popular
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Business</h3>
              <p className="text-xs text-brand-200 mt-1">For scaling teams with multi-warehouse needs</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white font-mono">
                ${billingCycle === 'annual' ? '79' : '99'}
              </span>
              <span className="text-xs text-neutral-400">/ month</span>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-200 border-t border-neutral-700 pt-4">
              <li className="flex items-center gap-2">✓ Up to 25 Team Seats</li>
              <li className="flex items-center gap-2">✓ Multi-Warehouse Sync (Unlimited)</li>
              <li className="flex items-center gap-2">✓ Custom Approval Routing</li>
              <li className="flex items-center gap-2">✓ Priority API Access & Webhooks</li>
              <li className="flex items-center gap-2">✓ Automated Invoice Aging Reminders</li>
            </ul>
            <Link
              href="/dashboard"
              className="w-full btn-primary text-xs py-3 text-center block shadow-accent"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-2xl bg-neutral-800 border border-neutral-700 p-8 space-y-6 hover:border-neutral-600 transition-all">
            <div>
              <h3 className="text-lg font-bold text-white">Enterprise</h3>
              <p className="text-xs text-neutral-400 mt-1">For organizations requiring dedicated clusters</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white font-mono">Custom</span>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-200 border-t border-neutral-700 pt-4">
              <li className="flex items-center gap-2">✓ Unlimited Team Seats</li>
              <li className="flex items-center gap-2">✓ Dedicated MongoDB Atlas Instance</li>
              <li className="flex items-center gap-2">✓ 99.99% Uptime Guarantee with SLA</li>
              <li className="flex items-center gap-2">✓ Dedicated Account Manager</li>
              <li className="flex items-center gap-2">✓ Custom ERP Module Development</li>
            </ul>
            <a
              href="mailto:sales@bahi.io"
              className="w-full btn-secondary text-xs py-3 text-center block"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* ─── Global Footer (Dark Slate) ───────────────────────────── */}
      <footer className="relative z-10 border-t border-neutral-700 bg-neutral-950 py-12 px-6 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <span className="font-bold text-white">Bahi ERP Platform</span>
            <span>• Built for high-velocity modern enterprises.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/crm" className="hover:text-white transition-colors">
              CRM
            </Link>
            <Link href="/sales" className="hover:text-white transition-colors">
              Sales
            </Link>
            <Link href="/accounting" className="hover:text-white transition-colors">
              Accounting
            </Link>
            <a href="http://localhost:4000/api/docs" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Swagger API
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
