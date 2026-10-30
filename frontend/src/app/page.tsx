'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { ServicesCarousel } from '@/components/landing/ServicesCarousel';
import { LiveWorkflowCard } from '@/components/landing/LiveWorkflowCard';

interface ModuleDetail {
  tag: string;
  title: string;
  desc: string;
  metrics: Array<{ label: string; value: string }>;
  features: string[];
  previewCard: {
    title: string;
    client: string;
    value: string;
    stage: string;
    priority: string;
  };
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<
    'finance' | 'sales' | 'websites' | 'supply-chain' | 'hr' | 'marketing' | 'services' | 'projects' | 'crm' | 'inventory' | 'accounting'
  >('finance');
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
        modules: Math.round(ease * 8),
        uptime: +(90.0 + ease * 9.99).toFixed(2),
        gmv: Math.round(ease * 450),
        latency: Math.round(250 - ease * 165),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounters({ modules: 8, uptime: 99.99, gmv: 450, latency: 85 });
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const modulesData: Record<string, ModuleDetail> = {
    finance: {
      tag: 'Finance & Invoicing',
      title: 'Get Paid on Time and Watch Your Savings Grow',
      desc: 'Send clean bills and track every dollar coming in. See who has paid, who still owes you, connect bank sync, and know your daily profit.',
      metrics: [
        { label: 'Paid Quicker', value: '14 Days Faster' },
        { label: 'Automatic Invoicing', value: '100%' },
        { label: 'Tax Prep Time', value: 'Cut in Half' },
      ],
      features: [
        'Bills created and emailed right away when an order is completed',
        'Easily track cash, card, and bank transfers',
        'Polite automatic reminders sent to customers who forgot to pay',
        'Simple profit and expense summaries so tax season is totally relaxed',
      ],
      previewCard: {
        title: 'Invoice #084',
        client: 'Green Garden Cafe',
        value: '$2,200',
        stage: 'Paid in Full',
        priority: '✓ Money in Bank',
      },
    },
    sales: {
      tag: 'Quotes & POS Checkout',
      title: 'Send Clear Price Quotes and Ring Up Sales Fast',
      desc: 'Create pretty, professional price quotes in seconds, handle fast POS sales, and turn accepted quotes straight into confirmed orders.',
      metrics: [
        { label: 'Quote Speed', value: '< 2 mins' },
        { label: 'Math Mistakes', value: '0' },
        { label: 'Sales Growth', value: '+34%' },
      ],
      features: [
        'Automatic price and tax math so you never make calculation mistakes',
        'Turn accepted price quotes into confirmed orders with 1 click',
        'Send neat PDF receipts straight to your customer’s email or WhatsApp',
        'Clear sales history showing who bought what and when',
      ],
      previewCard: {
        title: 'Price Quote #104',
        client: 'Green Garden Cafe',
        value: '$2,200',
        stage: 'Accepted',
        priority: '⚡ Order Confirmed',
      },
    },
    websites: {
      tag: 'Online Store & Booking',
      title: 'Open Your Digital Storefront to the Whole World',
      desc: 'Launch your modern online shop, publish your product catalog, and take customer bookings 24/7 without technical hurdles.',
      metrics: [
        { label: 'Online Store Hours', value: '24/7 Open' },
        { label: 'Mobile Friendly', value: '100%' },
        { label: 'Setup Time', value: '10 mins' },
      ],
      features: [
        'Clean mobile-friendly product catalog with instant checkout',
        'Accept customer bookings and reservations straight from your site',
        'Automatically syncs online sales with your inventory shelves',
        'Social media sharing links and SEO built in automatically',
      ],
      previewCard: {
        title: 'Online Store Order #312',
        client: 'Liam Walker',
        value: '$180',
        stage: 'New Order',
        priority: '🌐 Placed Online',
      },
    },
    'supply-chain': {
      tag: 'Stock & Warehouses',
      title: 'Always Know What is Sitting on Your Shelves',
      desc: 'Never run out of your best-selling items. Check stock levels across all rooms, reorder on time, and track incoming boxes with zero stress.',
      metrics: [
        { label: 'Count Accuracy', value: '99.9%' },
        { label: 'Packing Speed', value: '2x Faster' },
        { label: 'Lost Items', value: '0' },
      ],
      features: [
        'See stock across all your rooms, stores, or shelves on one screen',
        'Friendly warnings before your most popular products run out',
        'Easy logs showing when boxes arrive and when they go out',
        'Updates automatically every time a customer buys something',
      ],
      previewCard: {
        title: 'Shelf Restock',
        client: 'Wireless Headphones',
        value: '150 in box',
        stage: 'Received',
        priority: '✓ On the Shelf',
      },
    },
    hr: {
      tag: 'Team & Staff',
      title: 'Take Great Care of Your Team with Zero Drama',
      desc: 'Keep staff contact info handy, approve time off with one tap, and see who is at work today without messy paper forms.',
      metrics: [
        { label: 'Vacation Approval', value: 'Instant' },
        { label: 'Lost Paperwork', value: '0' },
        { label: 'Team Happiness', value: '10/10' },
      ],
      features: [
        'Simple staff directory with phone numbers, emails, and job roles',
        'Easy time-off requests: employees tap to ask, managers tap to say yes',
        'See at a glance who is in the shop, working from home, or on holiday',
        'Connects with work hours so paying everyone is fast and fair',
      ],
      previewCard: {
        title: 'Summer Holiday Request',
        client: 'Alex Rivera (Designer)',
        value: '4 Days',
        stage: 'Approved',
        priority: '🌴 Vacation Booked',
      },
    },
    marketing: {
      tag: 'Broadcasts & Promos',
      title: 'Bring Shoppers Back with WhatsApp & Email Promos',
      desc: 'Send promotional announcements, flash sale discount coupons, and SMS alerts that bring customers back again and again.',
      metrics: [
        { label: 'Repeat Buyers', value: '3x More' },
        { label: 'Coupon Redemptions', value: '+42%' },
        { label: 'Setup Time', value: '2 mins' },
      ],
      features: [
        'Send promotional announcements via email, SMS, and WhatsApp',
        'Create seasonal coupon codes and flash discounts in seconds',
        'Collect customer phone numbers and emails automatically at checkout',
        'See which promotion brought in the most sales and repeat shoppers',
      ],
      previewCard: {
        title: 'Flash Sale (20% Off)',
        client: 'All VIP Customers',
        value: '1,420 Sent',
        stage: 'Active',
        priority: '🔥 High Response',
      },
    },
    services: {
      tag: 'Field Jobs & Tickets',
      title: 'Schedule Appointments and Dispatch Jobs with Ease',
      desc: 'Assign repair jobs or customer visits to your team, schedule appointments on a calendar, and track job completion from start to finish.',
      metrics: [
        { label: 'Jobs on Schedule', value: '100%' },
        { label: 'Dispatcher Time', value: 'Saved 2h/day' },
        { label: 'Customer Rating', value: '4.9 / 5' },
      ],
      features: [
        'Visual calendar showing all technician jobs and appointments',
        'One-tap dispatch: assign work tickets to technicians in the field',
        'Customer gets automated SMS notifications when technician is on the way',
        'Signatures and completed job photos attached right to the invoice',
      ],
      previewCard: {
        title: 'Service Ticket #49',
        client: 'Highland Residency',
        value: 'Scheduled 2 PM',
        stage: 'Assigned',
        priority: '🔧 In Field',
      },
    },
    projects: {
      tag: 'Tasks & To-Dos',
      title: 'Finish Every Job on Time with Zero Stress',
      desc: 'Turn big jobs into simple to-do cards. Give tasks to your teammates, set clear due dates, and watch everything get checked off happily.',
      metrics: [
        { label: 'Jobs on Time', value: '98%' },
        { label: 'Team Focus', value: '+30%' },
        { label: 'Forgotten Tasks', value: '0' },
      ],
      features: [
        'Fun to-do columns: Things To Do, Doing Right Now, and Finished!',
        'Assign tasks to teammates with clear due dates and reminders',
        'Track hours spent on client jobs so you charge fairly',
        'See if a job is making money or taking too much time',
      ],
      previewCard: {
        title: 'New Store Launch',
        client: 'Sunny Bakery',
        value: '18 of 20 Done',
        stage: 'Almost Finished',
        priority: '⚡ Finishing Today',
      },
    },
    // Backwards-compatibility aliases
    crm: {
      tag: 'Find & Keep Customers',
      title: 'Never Forget a Customer or Follow-Up',
      desc: 'Keep all your customer phone numbers, emails, and notes in one friendly list. See who wants to buy, what they like, and when to call them back.',
      metrics: [
        { label: 'Happy Customers', value: '100%' },
        { label: 'More Sales Made', value: '+34%' },
        { label: 'Forgotten Calls', value: '0' },
      ],
      features: [
        'Color-coded boards showing where each customer is in their journey',
        'One simple address book for all client contacts and notes',
        'Helpful reminders so you never forget a meeting or phone call',
        'Turn an interested lead into a paying customer with 1 click',
      ],
      previewCard: {
        title: 'Interested Customer',
        client: 'Sarah Johnson',
        value: '$1,500',
        stage: 'Ready to Buy',
        priority: '⭐ Very Interested',
      },
    },
    inventory: {
      tag: 'Stock & Warehouses',
      title: 'Always Know What is Sitting on Your Shelves',
      desc: 'Never run out of your best-selling items. Check stock levels across all shelves and track incoming boxes.',
      metrics: [
        { label: 'Count Accuracy', value: '99.9%' },
        { label: 'Packing Speed', value: '2x Faster' },
        { label: 'Lost Items', value: '0' },
      ],
      features: [
        'See stock across all rooms, stores, or shelves on one screen',
        'Friendly warnings before your most popular products run out',
        'Easy logs showing when boxes arrive and when they go out',
        'Updates automatically every time a customer buys something',
      ],
      previewCard: {
        title: 'Shelf Restock',
        client: 'Wireless Headphones',
        value: '150 in box',
        stage: 'Received',
        priority: '✓ On the Shelf',
      },
    },
    accounting: {
      tag: 'Bills & Money',
      title: 'Get Paid on Time and Watch Your Savings Grow',
      desc: 'Send clear bills and track every dollar coming in. See who has paid and what your profit is.',
      metrics: [
        { label: 'Paid Quicker', value: '14 Days Faster' },
        { label: 'Automatic Invoicing', value: '100%' },
        { label: 'Tax Prep Time', value: 'Cut in Half' },
      ],
      features: [
        'Bills created and emailed right away when an order is completed',
        'Easily track cash, card, and bank payments',
        'Polite automated reminders sent to customers',
        'Simple profit and expense summaries',
      ],
      previewCard: {
        title: 'Invoice #084',
        client: 'Green Garden Cafe',
        value: '$2,200',
        stage: 'Paid in Full',
        priority: '✓ Money in Bank',
      },
    },
  };

  const currentMod: ModuleDetail = (modulesData[activeTab] || modulesData['finance']) as ModuleDetail;

  return (
    <div className="min-h-screen bg-[#232323] text-neutral-50 font-sans selection:bg-accent selection:text-white relative overflow-x-clip">
      {/* ─── Grain / Noise Texture Overlay (Gentle Subtle Vignette) ────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none bg-noise z-40 opacity-15" />

      {/* ─── Subtle Dark Grid Background ──────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none bg-dark-grid z-0 opacity-40" />

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
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0E0F0C] border border-white/[0.08] shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
              </span>
              <span className="text-xs font-semibold text-brand-200">✨ The Easy Business App</span>
              <span className="text-xs text-neutral-400">• Simple for Everyone</span>
            </div>

            {/* Main Headline with Typographic Contrast */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Run Your Entire Business on{' '}
              <span className="block mt-1 font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-white to-brand-200 tracking-normal">
                One Simple App.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-neutral-400 max-w-xl font-normal leading-relaxed">
              Tired of messy papers and 10 confusing apps? Bahi puts your customers, sales, stock, bills, and team in one happy place — so running your business is as easy as playing with blocks.
            </p>

            {/* CTAs with Magnetic Effect */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/signup"
                onMouseMove={handleButtonMouseMove}
                onMouseLeave={handleButtonMouseLeave}
                style={{
                  transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
                }}
                className="btn-primary text-sm py-3.5 px-6 shadow-accent transition-transform duration-100 flex items-center justify-center gap-2.5 group"
              >
                <span>Try It Free for 14 Days</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <Link
                href="/applications"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-neutral-200 hover:text-white bg-[#0E0F0C] hover:bg-[#151613] border border-white/[0.08] hover:border-white/[0.16] transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
                See How It Works
              </Link>
            </div>

            {/* Mini Trust Line */}
            <div className="pt-4 flex items-center gap-6 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-status-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No Credit Card Needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-status-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Ready in 2 Minutes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-status-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>100% Safe &amp; Private</span>
              </div>
            </div>
          </div>

          {/* ── Right Column (~42%): Animated Live Workflow Card ───── */}
          <div className="lg:col-span-5 relative flex justify-center">
            <LiveWorkflowCard />
          </div>
        </div>
      </section>

      {/* ─── Mini Square Cards Services Carousel ──────────────────── */}
      <div id="services">
        <ServicesCarousel
          activeModuleId={activeTab}
          onSelectModule={(mod) => setActiveTab(mod as any)}
        />
      </div>

      {/* ─── Uneven Bento-Grid Stats Bar with Counter-Up ─────────── */}
      <section id="stats" className="relative z-10 py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Card 1: Prominent Feature Bento (5 cols) */}
          <div className="md:col-span-5 rounded-2xl bg-[#0E0F0C] border border-white/[0.08] p-6 hover:border-white/[0.18] transition-all relative overflow-hidden group shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-accent">Real Results</span>
              <span className="text-[10px] font-mono text-neutral-400 bg-[#000000] px-2 py-0.5 rounded border border-white/[0.08]">
                Loved by Owners
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
              ${counters.gmv}M+
            </div>
            <p className="text-sm font-semibold text-white mt-1">Real Sales Handled</p>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Hardworking businesses use Bahi every single day to sell products, make customers smile, and grow.
            </p>
          </div>

          {/* Card 2: Enterprise SLA (3 cols) */}
          <div className="md:col-span-3 rounded-2xl bg-[#0E0F0C] border border-white/[0.08] p-6 hover:border-white/[0.18] transition-all relative group shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-status-success">Always Open</span>
              <span className="flex h-2 w-2 rounded-full bg-status-success" />
            </div>
            <div className="text-4xl font-black text-status-success tracking-tight font-mono">
              {counters.uptime}%
            </div>
            <p className="text-sm font-semibold text-white mt-1">Always Works, Day &amp; Night</p>
            <p className="text-xs text-neutral-400 mt-1">
              Your business never sleeps, and neither does Bahi. Reliable 365 days a year.
            </p>
          </div>

          {/* Card 3: Terracotta Accent Bento (4 cols) */}
          <div className="md:col-span-4 rounded-2xl bg-gradient-to-br from-[#A8462F] to-[#682315] border border-white/20 p-6 text-white hover:brightness-105 transition-all shadow-xl shadow-[#A8462F]/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-white/90">Blink of an Eye</span>
              <span className="text-[10px] font-mono text-white/90 bg-black/25 px-2 py-0.5 rounded border border-white/20">
                Instant
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
              &lt; 0.1s
            </div>
            <p className="text-sm font-bold text-white mt-1">Super Fast &amp; Smooth</p>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              Pages and buttons open right away. No waiting around, no spinning wheels.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Layered & Overlapping Module Showcase ─────────────────── */}
      <section id="modules" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-accent">All The Apps You Need</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            Eight Connected Apps.{' '}
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-200">
              One Happy Business.
            </span>
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base">
            When you make a sale, your stock updates, your bill is sent, and your team gets notified automatically. No lost papers, no confusing spreadsheets.
          </p>
        </div>

        {/* Tab Switcher for the 8 Apps */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {([
            'finance',
            'sales',
            'websites',
            'supply-chain',
            'hr',
            'marketing',
            'services',
            'projects',
          ] as const).map((tabKey) => {
            const isActive = activeTab === tabKey;
            const moduleActiveClasses: Record<string, string> = {
              finance: 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-500/20',
              sales: 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-md shadow-purple-500/20',
              websites: 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/20',
              'supply-chain': 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-md shadow-blue-500/20',
              hr: 'bg-rose-600/30 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-500/20',
              marketing: 'bg-orange-600/30 text-orange-300 border border-orange-500/50 shadow-md shadow-orange-500/20',
              services: 'bg-teal-600/30 text-teal-300 border border-teal-500/50 shadow-md shadow-teal-500/20',
              projects: 'bg-amber-600/30 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/20',
            };
            const tabNames: Record<string, string> = {
              finance: 'Finance',
              sales: 'Sales',
              websites: 'Websites',
              'supply-chain': 'Supply Chain',
              hr: 'Human Resources',
              marketing: 'Marketing',
              services: 'Services',
              projects: 'Projects',
            };
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isActive
                    ? (moduleActiveClasses[tabKey] || 'bg-accent text-white shadow-accent border border-accent/40')
                    : 'bg-[#0E0F0C] text-neutral-400 hover:text-white border border-white/[0.08] hover:border-white/[0.16] hover:bg-[#151613]'
                  }`}
              >
                {tabNames[tabKey] || tabKey}
              </button>
            );
          })}
        </div>

        {/* Layered / Overlapping Card Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Info Card (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0C0D0B] border border-white/[0.08] p-8 sm:p-10 shadow-2xl space-y-5">
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
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <Link
                href={`/${activeTab}`}
                className="inline-flex items-center gap-2 font-bold text-xs text-accent hover:text-brand-400 transition-colors"
              >
                Try this app in Bahi →
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
            <div className="w-full max-w-sm rounded-2xl bg-[#080907] border border-white/[0.06] p-5 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between mb-3 text-xs text-neutral-400">
                <span>Safety &amp; Protection</span>
                <span className="font-mono text-[10px] text-status-success">✓ 100% Safe</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#0E0F0C] border border-white/[0.06] flex justify-between">
                  <span className="text-white font-medium">Saved to Cloud</span>
                  <span className="text-status-success font-semibold">✓ Safe &amp; Sound</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0E0F0C] border border-white/[0.06] flex justify-between">
                  <span className="text-white font-medium">Who Can Edit</span>
                  <span className="text-neutral-300">Manager &amp; Team Only</span>
                </div>
              </div>
            </div>

            {/* Overlapping Top Card with slight positive rotation and hover lift */}
            <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#141512] to-[#0A0B08] border border-white/[0.12] p-6 shadow-2xl shadow-black/80 -mt-20 transform rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 relative z-20 group">
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

              <div className="p-3 rounded-xl bg-[#050604] border border-white/[0.06] flex items-center justify-between text-xs">
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
                Rock-Solid Reliability
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Your Business Numbers Always Match. Guaranteed.
              </h2>
              <p className="text-white/85 text-base leading-relaxed">
                Other software uses messy connections that lose data or make numbers disagree. Bahi keeps all your information in one unbreakable vault — so your stock count, sales total, and bank balance always match up perfectly.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2 bg-black/20 px-3.5 py-2 rounded-xl border border-white/15">
                  <span>🔒 100% Private (Only your team sees your data)</span>
                </div>
                <div className="flex items-center gap-2 bg-black/20 px-3.5 py-2 rounded-xl border border-white/15">
                  <span>⚡ Super Fast (Zero waiting, zero spinning wheels)</span>
                </div>
                <div className="flex items-center gap-2 bg-black/20 px-3.5 py-2 rounded-xl border border-white/15">
                  <span>📑 Saved Forever (Never lose an order or receipt)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-black/30 border border-white/20 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white">Why You Can Sleep Easy with Bahi</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/15">
                  <span className="text-white/75">Always Backed Up</span>
                  <span className="font-medium text-brand-200">Saved every second</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/15">
                  <span className="text-white/75">Bank-Grade Protection</span>
                  <span className="font-bold text-status-success">✓ Locked &amp; Encrypted</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/15">
                  <span className="text-white/75">Runs 24 Hours a Day</span>
                  <span className="font-medium text-white">Never takes a holiday</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/75">Works Everywhere</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-status-success">
                    <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                    Phone, Tablet &amp; Laptop
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ────────────────────────────────────── */}
      <section id="pricing" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-accent">Simple, Honest Pricing</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            Pick the Plan That Fits Your Business.
          </h2>
          <p className="mt-3 text-neutral-400 text-sm">
            Every plan includes all 6 business tools. No hidden fees. Upgrade or cancel anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-6 inline-flex items-center p-1 rounded-xl bg-[#0E0F0C] border border-white/[0.08] text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all ${billingCycle === 'monthly' ? 'bg-[#181915] text-white border border-white/[0.08] shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
            >
              Pay Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all ${billingCycle === 'annual' ? 'bg-accent text-white shadow-accent' : 'text-neutral-400 hover:text-white'
                }`}
            >
              Pay Yearly (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="rounded-2xl bg-[#0C0D0B] border border-white/[0.08] p-8 space-y-6 hover:border-white/[0.18] transition-all shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-white">Starter</h3>
              <p className="text-xs text-neutral-400 mt-1">For small shops, boutiques &amp; solo founders</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white font-mono">
                ${billingCycle === 'annual' ? '29' : '39'}
              </span>
              <span className="text-xs text-neutral-400">/ month</span>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-200 border-t border-white/[0.06] pt-4">
              <li className="flex items-center gap-2">✓ Up to 5 Team Members</li>
              <li className="flex items-center gap-2">✓ All 6 Business Tools Included</li>
              <li className="flex items-center gap-2">✓ 1 Shop or Warehouse Location</li>
              <li className="flex items-center gap-2">✓ Friendly, Helpful Support</li>
            </ul>
            <Link
              href="/signup"
              className="w-full inline-flex items-center justify-center rounded-xl bg-[#141512] hover:bg-[#1C1E18] border border-white/[0.1] hover:border-white/[0.2] text-white text-xs font-semibold py-3 text-center transition-all shadow-sm"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Business Tier (Highlighted with Rust Border) */}
          <div className="rounded-2xl bg-gradient-to-b from-[#141512] via-[#0E0F0C] to-[#080907] border-2 border-accent p-8 space-y-6 relative shadow-2xl shadow-accent/15">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-accent text-white text-[10px] uppercase font-bold tracking-widest shadow-md">
              Most Popular
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Business</h3>
              <p className="text-xs text-brand-200 mt-1">For growing businesses with multiple stores</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white font-mono">
                ${billingCycle === 'annual' ? '79' : '99'}
              </span>
              <span className="text-xs text-neutral-400">/ month</span>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-200 border-t border-white/[0.08] pt-4">
              <li className="flex items-center gap-2">✓ Up to 25 Team Members</li>
              <li className="flex items-center gap-2">✓ Unlimited Stores &amp; Warehouses</li>
              <li className="flex items-center gap-2">✓ 1-Tap Manager Approvals</li>
              <li className="flex items-center gap-2">✓ Fast Priority Help</li>
              <li className="flex items-center gap-2">✓ Automatic Reminders for Late Bills</li>
            </ul>
            <Link
              href="/signup"
              className="w-full btn-primary text-xs py-3 text-center block shadow-accent"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-2xl bg-[#0C0D0B] border border-white/[0.08] p-8 space-y-6 hover:border-white/[0.18] transition-all shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-white">Enterprise</h3>
              <p className="text-xs text-neutral-400 mt-1">For large companies with lots of staff</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white font-mono">Custom</span>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-200 border-t border-white/[0.06] pt-4">
              <li className="flex items-center gap-2">✓ Unlimited Team Members</li>
              <li className="flex items-center gap-2">✓ Private, Super-Fast Server</li>
              <li className="flex items-center gap-2">✓ 99.99% Reliability Promise</li>
              <li className="flex items-center gap-2">✓ Dedicated Personal Account Helper</li>
              <li className="flex items-center gap-2">✓ Custom Setup &amp; Training for Staff</li>
            </ul>
            <a
              href="mailto:sales@bahi.io"
              className="w-full inline-flex items-center justify-center rounded-xl bg-[#141512] hover:bg-[#1C1E18] border border-white/[0.1] hover:border-white/[0.2] text-white text-xs font-semibold py-3 text-center transition-all shadow-sm"
            >
              Talk to Our Friendly Team
            </a>
          </div>
        </div>
      </section>

      {/* ─── Global Footer (Pitch Obsidian) ───────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#000000] py-12 px-6 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <span className="font-bold text-white">Bahi Platform</span>
            <span>• Simple software for hardworking businesses.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link href="/applications" className="hover:text-white transition-colors">
              All Apps
            </Link>
            <Link href="/crm" className="hover:text-white transition-colors">
              Customers
            </Link>
            <Link href="/sales" className="hover:text-white transition-colors">
              Sales
            </Link>
            <Link href="/accounting" className="hover:text-white transition-colors">
              Bills
            </Link>
            <a href="http://localhost:4000/api/docs" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Help &amp; Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
