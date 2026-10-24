'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export interface ServiceItem {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  metric: string;
  href: string;
  moduleId?: string;
  accentColor: string;
  badgeBg: string;
  iconBg: string;
  icon: React.ReactNode;
}

export const servicesList: ServiceItem[] = [
  {
    id: 'finance',
    code: 'APP-01',
    name: 'Finance & Invoicing',
    category: 'Finance',
    description: 'Send instant invoices, track daily expenses, connect bank accounts, and see your exact profit.',
    metric: 'Paid 2x Faster',
    href: '/finance',
    moduleId: 'finance',
    accentColor: '#34D399',
    badgeBg: 'rgba(52, 211, 153, 0.15)',
    iconBg: 'from-emerald-500/25 to-teal-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
  {
    id: 'sales',
    code: 'APP-02',
    name: 'Sales & POS',
    category: 'Sales',
    description: 'Create clear price quotes, ring up POS checkout, manage orders, and collect payments easily.',
    metric: '+34% More Sales',
    href: '/sales',
    moduleId: 'sales',
    accentColor: '#C084FC',
    badgeBg: 'rgba(192, 132, 252, 0.15)',
    iconBg: 'from-purple-500/25 to-pink-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.141a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
    ),
  },
  {
    id: 'websites',
    code: 'APP-03',
    name: 'Websites & Store',
    category: 'Websites',
    description: 'Launch your modern digital storefront, show your product catalog, and take bookings 24/7.',
    metric: '24/7 Online',
    href: '/websites',
    moduleId: 'websites',
    accentColor: '#38BDF8',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    iconBg: 'from-cyan-500/25 to-blue-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    id: 'supply-chain',
    code: 'APP-04',
    name: 'Supply Chain',
    category: 'Supply Chain',
    description: 'Count warehouse stock live, get low-inventory warnings, print packing slips, and reorder on time.',
    metric: '99.9% Accuracy',
    href: '/supply-chain',
    moduleId: 'supply-chain',
    accentColor: '#60A5FA',
    badgeBg: 'rgba(96, 165, 250, 0.15)',
    iconBg: 'from-blue-500/25 to-indigo-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    id: 'hr',
    code: 'APP-05',
    name: 'Human Resources',
    category: 'Team & Staff',
    description: 'Keep staff contact cards, track attendance and clock-ins, manage work shifts, and approve leave in 1 tap.',
    metric: 'Instant Approvals',
    href: '/hr',
    moduleId: 'hr',
    accentColor: '#FB7185',
    badgeBg: 'rgba(251, 113, 133, 0.15)',
    iconBg: 'from-rose-500/25 to-red-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    id: 'marketing',
    code: 'APP-06',
    name: 'Marketing',
    category: 'Marketing',
    description: 'Send broadcast promo emails, alert shoppers with WhatsApp/SMS discounts, and turn visitors into buyers.',
    metric: '3x Repeat Buyers',
    href: '/marketing',
    moduleId: 'marketing',
    accentColor: '#FB923C',
    badgeBg: 'rgba(251, 146, 60, 0.15)',
    iconBg: 'from-orange-500/25 to-amber-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.111-1.53-.448a20.024 20.024 0 0 1-1.34-3.77m3.005-.456a48.81 48.81 0 0 0 8.016-1.306A1.875 1.875 0 0 0 19.5 12.6V6.9a1.875 1.875 0 0 0-1.344-1.798 48.774 48.774 0 0 0-7.816-1.262m0 9.18V3.84" />
      </svg>
    ),
  },
  {
    id: 'services',
    code: 'APP-07',
    name: 'Services',
    category: 'Field Work',
    description: 'Book field appointments, dispatch work tickets, manage client repair jobs, and track maintenance contracts.',
    metric: '100% On-Schedule',
    href: '/services',
    moduleId: 'services',
    accentColor: '#2DD4BF',
    badgeBg: 'rgba(45, 212, 191, 0.15)',
    iconBg: 'from-teal-500/25 to-emerald-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.07a4.5 4.5 0 0 0 4.486-6.32l-3.27 3.27-2.5-2.5 3.27-3.27a4.5 4.5 0 0 0-6.32 4.486c.118.58.094 1.193-.07 1.743" />
      </svg>
    ),
  },
  {
    id: 'projects',
    code: 'APP-08',
    name: 'Projects',
    category: 'Projects',
    description: 'Manage client work on clear Kanban boards, set milestones, track deadlines, and deliver results on time.',
    metric: '98% On-Time',
    href: '/projects',
    moduleId: 'projects',
    accentColor: '#FBBF24',
    badgeBg: 'rgba(251, 191, 36, 0.15)',
    iconBg: 'from-amber-500/25 to-yellow-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
  },
];

export const navigatorDots = servicesList;

interface ServicesCarouselProps {
  activeModuleId?: string;
  onSelectModule?: (moduleId: string) => void;
}

export function ServicesCarousel({ activeModuleId, onSelectModule }: ServicesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Mouse drag to scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);

  // Calculate active slide index and track scroll position
  const updateScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setActiveSlideIndex(0);
      return;
    }

    // When scrolled at or near the end, highlight the final navigator dot
    if (scrollLeft + clientWidth >= scrollWidth - 25) {
      setActiveSlideIndex(servicesList.length - 1);
    } else {
      const cardWidth = (clientWidth > 640 ? 260 : 230) + (clientWidth > 640 ? 20 : 16);
      const index = Math.round(scrollLeft / cardWidth);
      setActiveSlideIndex(Math.min(Math.max(0, index), servicesList.length - 1));
    }
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons]);

  // Programmatic scroll with seamless looping
  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const scrollAmount = el.clientWidth > 640 ? 560 : 280;

    if (direction === 'right') {
      // If already at or near the end, loop back to the beginning
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 20) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const target = el.scrollLeft + scrollAmount;
        el.scrollTo({
          left: Math.min(target, maxScroll),
          behavior: 'smooth',
        });
      }
    } else {
      // If already at or near the beginning, loop to the end
      if (el.scrollLeft <= 20) {
        el.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        const target = el.scrollLeft - scrollAmount;
        el.scrollTo({
          left: Math.max(0, target),
          behavior: 'smooth',
        });
      }
    }
  };

  // Jump to specific slide index
  const scrollToSlide = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = (el.clientWidth > 640 ? 260 : 230) + (el.clientWidth > 640 ? 20 : 16);
    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = index >= servicesList.length - 1
      ? maxScroll
      : Math.min(index * cardWidth, maxScroll);

    el.scrollTo({
      left: target,
      behavior: 'smooth',
    });
  };

  // Auto-scroll effect (smooth carousel interval)
  useEffect(() => {
    if (!isAutoScrolling || isPaused) return;

    const interval = setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        // Rewind smoothly to start
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const step = el.clientWidth > 640 ? 280 : 246; // one card + gap
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isAutoScrolling, isPaused]);

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftStartRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    el.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleCardClick = (service: ServiceItem) => {
    if (service.moduleId && onSelectModule) {
      onSelectModule(service.moduleId);
      const moduleSection = document.getElementById('modules');
      if (moduleSection) {
        moduleSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="services" className="relative z-10 py-16 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* ─── Section Header & Controls ────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-brand-200">
              Everything in One Place • 8 Core Business Apps
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Every App Your Business Needs.{' '}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-white to-brand-200">
              Nothing Extra to Buy.
            </span>
          </h2>
          <p className="mt-2 text-neutral-400 text-xs sm:text-sm max-w-2xl">
            Swipe or click through the 8 apps below to see how Bahi helps you every day. Tap any card to explore!
          </p>
        </div>

        {/* Carousel Navigation Controls */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
          {/* Auto-play toggle button */}
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              isAutoScrolling
                ? 'bg-accent/20 border-accent/40 text-brand-200'
                : 'bg-[#0E0F0C] border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/[0.16]'
            }`}
            title={isAutoScrolling ? 'Pause Auto-Slide' : 'Enable Auto-Slide'}
          >
            {isAutoScrolling ? (
              <>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span>Auto-Scroll: ON</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Auto-Scroll: PAUSED</span>
              </>
            )}
          </button>

          {/* Left Arrow Button (Loops to end when at beginning) */}
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll left or loop to end"
            className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all bg-[#0E0F0C] border-white/[0.08] text-white hover:bg-accent hover:border-accent hover:border-white/20 shadow-md cursor-pointer active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Right Arrow Button (Loops to start when at end) */}
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll right or loop to start"
            className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all bg-[#0E0F0C] border-white/[0.08] text-white hover:bg-accent hover:border-accent hover:border-white/20 shadow-md cursor-pointer active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Carousel Wrapper (No blurry vignettes so front and last cards remain 100% crystal clear) ─── */}
      <div 
        className="relative group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* ─── Mini Square Cards Carousel Track ─────────────────── */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-2 sm:px-3 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {servicesList.map((service) => {
            const isSelected = activeModuleId === service.id;
            return (
              <div
                key={service.id}
                onClick={() => handleCardClick(service)}
                className={`flex-shrink-0 snap-start aspect-square w-[230px] h-[230px] sm:w-[260px] sm:h-[260px] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#141512] to-[#080907] border-2 border-accent shadow-2xl ring-2 ring-accent/30 -translate-y-1.5'
                    : 'bg-[#0E0F0C] hover:bg-[#141512] border border-white/[0.08] hover:border-white/[0.18] hover:shadow-2xl hover:-translate-y-2'
                }`}
              >
                {/* Ambient dynamic radial glow on hover */}
                <div
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none -z-10"
                  style={{
                    background: `radial-gradient(circle, ${service.accentColor}33 0%, transparent 70%)`,
                  }}
                />

                {/* Card Top: Service Icon & Code Badge */}
                <div className="flex items-start justify-between relative z-10">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${service.iconBg} border border-white/10 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110 shadow-md`}
                    style={{ color: service.accentColor }}
                  >
                    {service.icon}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border tracking-wider"
                      style={{
                        backgroundColor: service.badgeBg,
                        color: service.accentColor,
                        borderColor: `${service.accentColor}40`,
                      }}
                    >
                      {service.code}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium tracking-tight">
                      {service.category}
                    </span>
                  </div>
                </div>

                {/* Card Middle: Title & Punchy Description */}
                <div className="relative z-10 my-auto py-1">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-accent transition-colors">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-400 leading-snug line-clamp-2">
                    {service.description}
                  </p>
                </div>

                {/* Card Bottom: Metric Pill & Action Arrow */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full inline-block shrink-0 animate-pulse"
                      style={{ backgroundColor: service.accentColor }}
                    />
                    <span className="text-[11px] font-semibold text-neutral-200 tracking-tight">
                      {service.metric}
                    </span>
                  </div>

                  {service.moduleId ? (
                    <span
                      className="text-[11px] font-semibold text-accent flex items-center gap-0.5 group-hover:translate-x-1 transition-transform"
                      title="See details"
                    >
                      See details
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </span>
                  ) : (
                    <Link
                      href={service.href}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-semibold text-accent flex items-center gap-0.5 hover:underline group-hover:translate-x-1 transition-transform"
                    >
                      Open
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Pagination Dots & Direct Module Jump ─────────────────── */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-neutral-400">Explore Apps:</span>
          <div className="flex items-center gap-1.5">
            {servicesList.map((service, idx) => (
              <button
                key={service.id}
                onClick={() => scrollToSlide(idx)}
                aria-label={`Jump to ${service.name}`}
                title={service.name}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlideIndex === idx
                    ? 'w-6 bg-accent'
                    : 'w-2 bg-neutral-700 hover:bg-neutral-600'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400">Want to test them live?</span>
          <Link
            href="/applications"
            className="text-accent hover:text-brand-400 font-semibold flex items-center gap-1 transition-colors"
          >
            Try the demo app
            <span className="text-[10px]">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
