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
  moduleId?: 'crm' | 'sales' | 'inventory' | 'accounting' | 'hr' | 'projects';
  accentColor: string;
  badgeBg: string;
  iconBg: string;
  icon: React.ReactNode;
}

export const servicesList: ServiceItem[] = [
  {
    id: 'crm',
    code: 'MOD-01',
    name: 'CRM & Pipelines',
    category: 'Deals & Leads',
    description: 'Visual Kanban pipelines, lead scoring, deal velocity forecasting, and 360° party sync.',
    metric: '+34% Close Rate',
    href: '/crm',
    moduleId: 'crm',
    accentColor: '#B7624C',
    badgeBg: 'rgba(183, 98, 76, 0.15)',
    iconBg: 'from-[#B7624C]/25 to-[#853526]/10',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    id: 'sales',
    code: 'MOD-02',
    name: 'Sales & Quotes',
    category: 'Proposals & SO',
    description: 'Dynamic quotation generator, multi-tier discount matrix, and 1-click sales order booking.',
    metric: '< 5m Turnaround',
    href: '/sales',
    moduleId: 'sales',
    accentColor: '#D97706',
    badgeBg: 'rgba(217, 119, 6, 0.15)',
    iconBg: 'from-[#D97706]/25 to-[#B45309]/10',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
  {
    id: 'inventory',
    code: 'MOD-03',
    name: 'Multi-Warehouse',
    category: 'Stock & Logistics',
    description: 'Multi-location inventory tracking, stock movements ledger, and zero-stockout reorder alerts.',
    metric: '99.9% Accuracy',
    href: '/inventory',
    moduleId: 'inventory',
    accentColor: '#1F7A4D',
    badgeBg: 'rgba(31, 122, 77, 0.15)',
    iconBg: 'from-[#1F7A4D]/25 to-[#165A38]/10',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    id: 'accounting',
    code: 'MOD-04',
    name: 'Accounting & Ledger',
    category: 'Finance & Invoicing',
    description: 'Automated billing from orders, multi-currency ledger, aging buckets, and reconciliation.',
    metric: '-60% Audit Time',
    href: '/accounting',
    moduleId: 'accounting',
    accentColor: '#C88775',
    badgeBg: 'rgba(200, 135, 117, 0.15)',
    iconBg: 'from-[#C88775]/25 to-[#853526]/10',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    id: 'hr',
    code: 'MOD-05',
    name: 'HR & Workforce',
    category: 'Teams & Leaves',
    description: 'Centralized staff hierarchy, attendance logs, department indexing, and 1-click leave approvals.',
    metric: 'Same-Day Approvals',
    href: '/hr',
    moduleId: 'hr',
    accentColor: '#818CF8',
    badgeBg: 'rgba(129, 140, 248, 0.15)',
    iconBg: 'from-[#818CF8]/25 to-[#4F46E5]/10',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    id: 'projects',
    code: 'MOD-06',
    name: 'Projects & Sprints',
    category: 'Tasks & Timesheets',
    description: 'Sprint delivery boards, billable timesheets, velocity metrics, and budget vs actual burn.',
    metric: '96% On-Time',
    href: '/projects',
    moduleId: 'projects',
    accentColor: '#38BDF8',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    iconBg: 'from-[#38BDF8]/25 to-[#0284C7]/10',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    code: 'MOD-07',
    name: 'Executive BI',
    category: 'Telemetry & GMV',
    description: 'Real-time GMV aggregations, revenue velocity forecasting, and low-latency cluster telemetry.',
    metric: 'P99 < 85ms Latency',
    href: '/dashboard',
    accentColor: '#FB7185',
    badgeBg: 'rgba(251, 113, 133, 0.15)',
    iconBg: 'from-[#FB7185]/25 to-[#E11D48]/10',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    id: 'security',
    code: 'MOD-08',
    name: 'Security & RBAC',
    category: 'Governance & Atlas',
    description: 'Strict row-level tenant isolation, tamper-proof audit trails, and granular RBAC policies.',
    metric: 'SOC2 & TLS 1.3',
    href: '/settings',
    accentColor: '#A78BFA',
    badgeBg: 'rgba(167, 139, 250, 0.15)',
    iconBg: 'from-[#A78BFA]/25 to-[#7C3AED]/10',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
];

interface ServicesCarouselProps {
  activeModuleId?: string;
  onSelectModule?: (moduleId: 'crm' | 'sales' | 'inventory' | 'accounting' | 'hr' | 'projects') => void;
}

export function ServicesCarousel({ activeModuleId, onSelectModule }: ServicesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Mouse drag to scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);

  // Check scroll boundary
  const updateScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    // Calculate approximate active slide
    const cardWidth = 260 + 16; // width + gap
    const index = Math.round(scrollLeft / cardWidth);
    setActiveSlideIndex(Math.min(Math.max(0, index), servicesList.length - 1));
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

  // Programmatic scroll
  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = (el.clientWidth > 640 ? 560 : 280);
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Jump to specific slide index
  const scrollToSlide = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = 260 + 16;
    el.scrollTo({
      left: index * cardWidth,
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
        const step = 276; // one card + gap
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
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#EBD2CB]">
              Full Stack SaaS Suite • 8 Integrated Services
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Every Engine Your Business Runs On.{' '}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#DDB3A7] via-[#FFFFFF] to-[#EBD2CB]">
              Zero Add-Ons.
            </span>
          </h2>
          <p className="mt-2 text-[#9A9B93] text-xs sm:text-sm max-w-2xl">
            Swipe or slide through our mini square cards. Click any service to inspect its live pipeline, telemetry, or launch directly into the dashboard.
          </p>
        </div>

        {/* Carousel Navigation Controls */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
          {/* Auto-play toggle button */}
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              isAutoScrolling
                ? 'bg-accent/20 border-accent/40 text-[#EBD2CB]'
                : 'bg-[#282828] border-[#3A3A3A] text-[#9A9B93] hover:text-white'
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
                <svg className="w-3.5 h-3.5 text-[#9A9B93]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Auto-Scroll: PAUSED</span>
              </>
            )}
          </button>

          {/* Left Arrow Button */}
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
              canScrollLeft
                ? 'bg-[#2A2A2A] border-[#3D3D3D] text-white hover:bg-accent hover:border-accent shadow-md cursor-pointer'
                : 'bg-[#222222] border-[#2E2E2E] text-[#555555] cursor-not-allowed opacity-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
              canScrollRight
                ? 'bg-[#2A2A2A] border-[#3D3D3D] text-white hover:bg-accent hover:border-accent shadow-md cursor-pointer'
                : 'bg-[#222222] border-[#2E2E2E] text-[#555555] cursor-not-allowed opacity-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Carousel Wrapper with Side Vignettes ─────────────────── */}
      <div 
        className="relative group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Vignette Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#222222] via-[#222222]/80 to-transparent z-20 pointer-events-none" />

        {/* Right Vignette Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#222222] via-[#222222]/80 to-transparent z-20 pointer-events-none" />

        {/* ─── Mini Square Cards Carousel Track ─────────────────── */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-2 cursor-grab active:cursor-grabbing select-none"
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
                    ? 'bg-gradient-to-b from-[#2F2F2F] to-[#222222] border-2 border-accent shadow-2xl ring-2 ring-accent/30 -translate-y-1.5'
                    : 'bg-[#252525] hover:bg-[#2B2B2B] border border-[#3A3A3A] hover:border-[#555555] hover:shadow-2xl hover:-translate-y-2'
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
                    <span className="text-[10px] text-[#7E8076] font-medium tracking-tight">
                      {service.category}
                    </span>
                  </div>
                </div>

                {/* Card Middle: Title & Punchy Description */}
                <div className="relative z-10 my-auto py-1">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-accent transition-colors">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#9A9B93] leading-snug line-clamp-2">
                    {service.description}
                  </p>
                </div>

                {/* Card Bottom: Metric Pill & Action Arrow */}
                <div className="flex items-center justify-between pt-2 border-t border-[#333333] relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full inline-block shrink-0 animate-pulse"
                      style={{ backgroundColor: service.accentColor }}
                    />
                    <span className="text-[11px] font-semibold text-[#D5D2CA] tracking-tight">
                      {service.metric}
                    </span>
                  </div>

                  {service.moduleId ? (
                    <span
                      className="text-[11px] font-semibold text-accent flex items-center gap-0.5 group-hover:translate-x-1 transition-transform"
                      title="Inspect Module"
                    >
                      Inspect
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
                      Launch
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
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9A9B93]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#7E8076]">Services Navigator:</span>
          <div className="flex items-center gap-1.5">
            {servicesList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSlide(idx)}
                aria-label={`Jump to service slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlideIndex === idx
                    ? 'w-6 bg-accent'
                    : 'w-2 bg-[#3A3A3A] hover:bg-[#555555]'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#7E8076]">Want to test them live?</span>
          <Link
            href="/dashboard"
            className="text-accent hover:text-[#C88775] font-semibold flex items-center gap-1 transition-colors"
          >
            Launch All Services Sandbox
            <span className="text-[10px]">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
