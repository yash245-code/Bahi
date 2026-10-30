'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export type ModuleKey =
  | 'finance'
  | 'sales'
  | 'websites'
  | 'supply-chain'
  | 'hr'
  | 'marketing'
  | 'services'
  | 'projects'
  | 'crm'
  | 'inventory'
  | 'accounting';

interface NavbarProps {
  activeModuleTab?: string;
  onSelectModuleTab?: (tab: any) => void;
  latency?: number;
}

interface ModuleItem {
  id: ModuleKey;
  tag: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function Navbar({ activeModuleTab, onSelectModuleTab, latency = 12 }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isModulesOpen, setIsModulesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const modulesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  // 1. Glitch-proof scroll listener with hysteresis deadband and requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Hysteresis deadband: enter scrolled state at > 40px, exit only at < 15px
          // Prevents rapid toggling / blinking around threshold boundary
          setIsScrolled((prev) => {
            if (!prev && scrollY > 40) return true;
            if (prev && scrollY < 15) return false;
            return prev;
          });

          // Stable top-to-bottom section spy with threshold buffer
          const sections = ['hero', 'modules', 'architecture', 'pricing'];
          for (let i = sections.length - 1; i >= 0; i--) {
            const sectionId = sections[i];
            if (!sectionId) continue;
            const el = document.getElementById(sectionId);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 140) {
                setActiveSection(sectionId);
                break;
              }
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener for ⌘K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsModulesOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when command palette opens
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => commandInputRef.current?.focus(), 50);
    } else {
      setCommandSearch('');
    }
  }, [isCommandPaletteOpen]);

  // Mega-menu hover handlers with debounce
  const handleModulesMouseEnter = () => {
    if (modulesTimeoutRef.current) clearTimeout(modulesTimeoutRef.current);
    setIsModulesOpen(true);
  };

  const handleModulesMouseLeave = () => {
    modulesTimeoutRef.current = setTimeout(() => {
      setIsModulesOpen(false);
    }, 150);
  };

  const handleModuleClick = (modId: ModuleKey) => {
    setIsModulesOpen(false);
    setIsMobileMenuOpen(false);
    if (onSelectModuleTab) {
      onSelectModuleTab(modId);
    }
    const el = document.getElementById('modules');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // The 8 App Categories for Mega-Menu
  const modules: ModuleItem[] = [
    {
      id: 'finance',
      tag: 'FINANCE',
      name: 'Finance',
      description: 'Invoicing, expenses, bank sync, and daily profit tracking.',
      color: 'from-emerald-500/20 to-teal-500/20 text-[#34D399]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
      ),
    },
    {
      id: 'sales',
      tag: 'SALES',
      name: 'Sales',
      description: 'Price quotes, POS checkout, orders, and payment collection.',
      color: 'from-purple-500/20 to-pink-500/20 text-[#C084FC]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.141a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      ),
    },
    {
      id: 'websites',
      tag: 'WEB',
      name: 'Websites',
      description: 'Online store, digital catalog, client bookings, and SEO.',
      color: 'from-cyan-500/20 to-blue-500/20 text-[#38BDF8]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
    },
    {
      id: 'supply-chain',
      tag: 'SUPPLY',
      name: 'Supply chain',
      description: 'Warehouse tracking, live inventory, restocking, and packing.',
      color: 'from-blue-500/20 to-indigo-500/20 text-[#60A5FA]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      ),
    },
    {
      id: 'hr',
      tag: 'STAFF',
      name: 'Human Resources',
      description: 'Staff directory, work attendance, shifts, and leave approvals.',
      color: 'from-rose-500/20 to-red-500/20 text-[#FB7185]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      ),
    },
    {
      id: 'marketing',
      tag: 'GROWTH',
      name: 'Marketing',
      description: 'Email broadcasts, SMS promo alerts, discounts, and leads.',
      color: 'from-orange-500/20 to-amber-500/20 text-[#F97316]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.111-1.53-.448a20.024 20.024 0 0 1-1.34-3.77m3.005-.456a48.81 48.81 0 0 0 8.016-1.306A1.875 1.875 0 0 0 19.5 12.6V6.9a1.875 1.875 0 0 0-1.344-1.798 48.774 48.774 0 0 0-7.816-1.262m0 9.18V3.84" />
        </svg>
      ),
    },
    {
      id: 'services',
      tag: 'FIELD',
      name: 'Services',
      description: 'Field service calls, appointments, job orders, and contracts.',
      color: 'from-teal-500/20 to-emerald-500/20 text-[#2DD4BF]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.07a4.5 4.5 0 0 0 4.486-6.32l-3.27 3.27-2.5-2.5 3.27-3.27a4.5 4.5 0 0 0-6.32 4.486c.118.58.094 1.193-.07 1.743" />
        </svg>
      ),
    },
    {
      id: 'projects',
      tag: 'TASKS',
      name: 'Projects',
      description: 'Task kanbans, project milestones, deadlines, and delivery.',
      color: 'from-amber-500/20 to-yellow-500/20 text-[#FBBF24]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
        </svg>
      ),
    },
  ];

  // Standard nav links with smooth scroll targets
  const navLinks = [
    { label: 'Overview', href: '#hero', id: 'hero' },
    { label: 'Apps', href: '#modules', id: 'modules' },
    { label: 'Reliability', href: '#architecture', id: 'architecture' },
    { label: 'Pricing', href: '#pricing', id: 'pricing' },
  ];

  // Search items for command palette
  const commandItems = [
    { title: 'Home Overview', subtitle: 'See the main introduction', action: () => scrollToSection('hero'), tag: 'PAGE' },
    { title: 'All Business Apps', subtitle: 'Explore all 8 application suites', action: () => scrollToSection('modules'), tag: 'APPS' },
    { title: 'Finance', subtitle: 'Invoicing, expenses & bank sync', action: () => handleModuleClick('finance'), tag: 'APP' },
    { title: 'Sales', subtitle: 'Quotes, POS checkout & orders', action: () => handleModuleClick('sales'), tag: 'APP' },
    { title: 'Websites', subtitle: 'Online store & booking pages', action: () => handleModuleClick('websites'), tag: 'APP' },
    { title: 'Supply Chain', subtitle: 'Warehouse inventory & stock tracking', action: () => handleModuleClick('supply-chain'), tag: 'APP' },
    { title: 'Human Resources', subtitle: 'Staff directory & attendance', action: () => handleModuleClick('hr'), tag: 'APP' },
    { title: 'Marketing', subtitle: 'Email, SMS promotions & discounts', action: () => handleModuleClick('marketing'), tag: 'APP' },
    { title: 'Services', subtitle: 'Field appointments & work tickets', action: () => handleModuleClick('services'), tag: 'APP' },
    { title: 'Projects', subtitle: 'Task boards & team deadlines', action: () => handleModuleClick('projects'), tag: 'APP' },
    { title: 'Rock-Solid Safety', subtitle: 'Safe cloud backups that never lose data', action: () => scrollToSection('architecture'), tag: 'SAFETY' },
    { title: 'Simple Pricing', subtitle: 'Plans for small shops and growing teams', action: () => scrollToSection('pricing'), tag: 'PLANS' },
    { title: 'Sign In / Account', subtitle: 'Log in to your workspace', action: () => window.location.href = '/login', tag: 'ACCOUNT' },
    { title: 'Start Free Trial', subtitle: 'Try Bahi free for 14 days', action: () => window.location.href = '/signup', tag: 'START' },
  ];

  const filteredCommands = commandItems.filter(
    (item) =>
      item.title.toLowerCase().includes(commandSearch.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(commandSearch.toLowerCase())
  );

  const scrollToSection = (id: string) => {
    setIsCommandPaletteOpen(false);
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* ─── Sticky Glassmorphism Header (Zero Layout Shift Fixed Height) ─── */}
      <header
        className={`sticky top-0 z-50 h-16 transition-colors duration-300 ease-in-out border-b ${isScrolled
            ? 'bg-[#090A0D]/95 backdrop-blur-2xl shadow-2xl shadow-black/90 border-white/10'
            : 'bg-[#090A0D]/80 backdrop-blur-xl border-white/[0.08]'
          }`}
      >
        {/* Subtle luxury accent line under header */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#FF5C38]/70 via-white/10 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3 sm:gap-4 flex-nowrap">
          {/* ── Left: Logo + Live Atlas Status Badge (Strictly 1 line) ── */}
          <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0 flex-nowrap">
            <Link
              href="/"
              className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C38] rounded-lg flex-shrink-0 whitespace-nowrap py-0.5"
              aria-label="Bahi Home"
            >
              <Image
                src="/images/bahi_logo_nobg.png"
                alt="Bahi"
                width={140}
                height={48}
                priority
                className={`h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105 ${
                  isScrolled ? 'scale-95' : 'scale-100'
                }`}
              />
            </Link>

            {/* Live-Status Badge (Online & Ready - Strictly 1 line) */}
            <div
              className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] shadow-sm select-none whitespace-nowrap flex-shrink-0 backdrop-blur-md"
              title={`All systems online (${latency}ms) and running smoothly`}
            >
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
              </span>
              <span className="font-semibold text-slate-200 whitespace-nowrap">Online &amp; Ready</span>
              <span className="text-white/20">•</span>
              <span className="font-bold text-emerald-400 whitespace-nowrap">Super Fast</span>
            </div>
          </div>

          {/* ── Center: Desktop Navigation Links + Mega-Menu (Strictly 1 line) ── */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-nowrap flex-shrink-0"
            aria-label="Main Navigation"
          >
            {/* Overview link */}
            <a
              href="#hero"
              className={`relative px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap flex-shrink-0 group ${activeSection === 'hero'
                  ? 'text-white bg-white/[0.08]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
            >
              <span>Overview</span>
              <span
                className={`absolute bottom-0.5 left-2 right-2 h-[2px] bg-gradient-to-r from-[#FF5C38] to-[#FFA07A] rounded-full transition-all duration-200 ease-out ${activeSection === 'hero' ? 'opacity-100' : 'w-0 opacity-0 group-hover:w-[calc(100%-1rem)] group-hover:opacity-100'
                  }`}
              />
            </a>

            {/* ─── Mega-Menu Trigger: Apps ────────────────────── */}
            <div
              className="relative flex-shrink-0"
              onMouseEnter={handleModulesMouseEnter}
              onMouseLeave={handleModulesMouseLeave}
            >
              <button
                type="button"
                onClick={() => setIsModulesOpen((prev) => !prev)}
                className={`relative px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center gap-1 whitespace-nowrap flex-shrink-0 group ${isModulesOpen || activeSection === 'modules'
                    ? 'text-white bg-white/[0.08]'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                aria-haspopup="true"
                aria-expanded={isModulesOpen}
              >
                <span>Apps</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-300 group-hover:text-white flex-shrink-0 ${isModulesOpen ? 'rotate-180 text-white' : ''
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
                <span
                  className={`absolute bottom-0.5 left-2 right-2 h-[2px] bg-gradient-to-r from-[#FF5C38] to-[#FFA07A] rounded-full transition-all duration-200 ease-out ${activeSection === 'modules' || isModulesOpen
                      ? 'opacity-100'
                      : 'w-0 opacity-0 group-hover:w-[calc(100%-1rem)] group-hover:opacity-100'
                    }`}
                />
              </button>

              {/* Mega-Menu Dropdown Panel */}
              {isModulesOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[760px] max-w-[94vw] z-50 animate-fade-in"
                  onMouseEnter={handleModulesMouseEnter}
                  onMouseLeave={handleModulesMouseLeave}
                >
                  <div className="rounded-2xl bg-[#232323]/98 backdrop-blur-2xl border border-white/[0.08] shadow-2xl p-5 overflow-hidden relative">
                    {/* Top subtle highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e8623d]/60 to-transparent" />

                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#e8623d]/15 text-[#e8623d] border border-[#e8623d]/25 font-bold">
                          App Suite
                        </span>
                        <span className="text-xs text-[#9A9B93]">8 Connected Apps to Run Your Whole Business</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#6A6C64]">Click to explore</span>
                    </div>

                    {/* 4-Column Grid for the 8 Apps */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {modules.map((mod) => {
                        const isSelected = activeModuleTab === mod.id;
                        return (
                          <button
                            key={mod.id}
                            type="button"
                            onClick={() => handleModuleClick(mod.id)}
                            className={`text-left p-3 rounded-xl border transition-all duration-150 group relative ${isSelected
                                ? 'bg-[#181915] border-[#e8623d]/60 shadow-md shadow-[#e8623d]/10'
                                : 'bg-[#0E0F0C] hover:bg-[#151613] border-white/[0.06] hover:border-white/[0.14]'
                              }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${mod.color} flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform`}>
                                {mod.icon}
                              </div>
                              <span className="text-[9px] font-mono uppercase tracking-wider text-[#7A7C73] px-1.5 py-0.5 rounded bg-[#000000] border border-white/[0.06]">
                                {mod.tag}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white group-hover:text-[#EBD2CB] transition-colors flex items-center justify-between">
                              {mod.name}
                              <svg className="w-3 h-3 text-[#6A6C64] group-hover:text-[#e8623d] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                              </svg>
                            </h4>
                            <p className="text-[11px] text-[#8E9088] leading-snug line-clamp-2 mt-1">
                              {mod.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Dropdown Footer */}
                    <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <a
                        href="#modules"
                        onClick={() => setIsModulesOpen(false)}
                        className="text-[#9A9B93] hover:text-[#e8623d] transition-colors flex items-center gap-1 font-medium"
                      >
                        Explore all 8 apps in detail
                        <span>→</span>
                      </a>
                      <a
                        href="#architecture"
                        onClick={() => setIsModulesOpen(false)}
                        className="text-[#75766E] hover:text-white transition-colors text-[11px] font-mono"
                      >
                        Unbreakable Safety &amp; Reliability ↗
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reliability link */}
            <a
              href="#architecture"
              className={`relative px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap flex-shrink-0 group ${activeSection === 'architecture'
                  ? 'text-white bg-white/[0.05]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
            >
              <span>Reliability</span>
              <span
                className={`absolute bottom-0.5 left-2 right-2 h-[2px] bg-gradient-to-r from-[#FF5C38] to-[#FFA07A] rounded-full transition-all duration-200 ease-out ${activeSection === 'architecture' ? 'opacity-100' : 'w-0 opacity-0 group-hover:w-[calc(100%-1rem)] group-hover:opacity-100'
                  }`}
              />
            </a>

            {/* Pricing link */}
            <a
              href="#pricing"
              className={`relative px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap flex-shrink-0 group ${activeSection === 'pricing'
                  ? 'text-white bg-white/[0.08]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
            >
              <span>Pricing</span>
              <span
                className={`absolute bottom-0.5 left-2 right-2 h-[2px] bg-gradient-to-r from-[#FF5C38] to-[#FFA07A] rounded-full transition-all duration-200 ease-out ${activeSection === 'pricing' ? 'opacity-100' : 'w-0 opacity-0 group-hover:w-[calc(100%-1rem)] group-hover:opacity-100'
                  }`}
              />
            </a>

          </nav>

          {/* ── Right: ⌘K Trigger, Sign In, Primary CTA Button (Strictly 1 line) ── */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 flex-nowrap">
            {/* ⌘K Command Palette Search Bar (Expanded, sleek & clean) */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:flex items-center justify-between gap-3 px-3.5 py-2 w-44 md:w-56 lg:w-64 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-xs transition-all duration-150 whitespace-nowrap flex-shrink-0 group shadow-xs cursor-pointer backdrop-blur-md"
              aria-label="Search apps, sections, or guides (Press ⌘K or Ctrl+K)"
              title="Search (⌘K / Ctrl+K)"
            >
              <div className="flex items-center gap-2 min-w-0">
                <svg
                  className="w-4 h-4 text-slate-400 group-hover:text-[#FF7A59] transition-colors flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <span className="text-xs text-slate-300 group-hover:text-white font-medium truncate">
                  Search...
                </span>
              </div>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.08] border border-white/10 text-slate-300 font-mono group-hover:text-white shadow-2xs flex-shrink-0">
                ⌘K
              </kbd>
            </button>

            {/* Sign In Link (Strictly 1 line) */}
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Sign In
            </Link>

            {/* ─── Primary CTA Button: "Start Free Trial" (Strictly 1 line, never wraps!) ─── */}
            <Link
              href="/signup"
              className="relative group inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-[#FF5C38] via-[#FF6E4A] to-[#FF8C68] hover:from-[#FF4D24] hover:to-[#FF7A52] border border-white/25 shadow-md shadow-[#FF5C38]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 whitespace-nowrap flex-shrink-0 cursor-pointer"
              aria-label="Start Free 14-Day Trial"
            >
              <span className="whitespace-nowrap">Start Free Trial</span>
              <svg
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-lg bg-[#0E0F0C] border border-white/[0.08] text-[#9A9B93] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e8623d] flex-shrink-0"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ─── Mobile Menu Drawer ─────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.08] bg-[#232323]/98 backdrop-blur-2xl px-5 py-4 space-y-3 animate-slide-down">
            {/* Live status badge mobile */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1F7A4D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1F7A4D]"></span>
                </span>
                <span className="font-semibold text-white">All Systems Online</span>
              </div>
              <span className="text-xs text-[#2ECC71] font-semibold">Super Fast</span>
            </div>

            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeSection === link.id
                      ? 'bg-[#e8623d]/15 text-[#e8623d] border border-[#e8623d]/30'
                      : 'text-[#9A9B93] hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.label}
                </a>
              ))}

              {/* Modules section in mobile */}
              <div className="pt-2">
                <div className="text-[11px] font-mono text-[#75766E] uppercase px-3 pb-1 tracking-wider">
                  Applications (8)
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {modules.map((mod) => (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => handleModuleClick(mod.id)}
                      className="flex items-center gap-2 p-2 rounded-lg bg-[#0E0F0C] border border-white/[0.06] text-left"
                    >
                      <div className={`w-6 h-6 rounded bg-gradient-to-br ${mod.color} flex items-center justify-center`}>
                        {mod.icon}
                      </div>
                      <span className="text-xs font-semibold text-white truncate">{mod.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ─── Command Palette Modal (⌘K / Ctrl+K) ─────────────────── */}
      {isCommandPaletteOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-fade-in"
          onClick={() => setIsCommandPaletteOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-[#232323] border border-white/[0.1] shadow-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input row */}
            <div className="flex items-center gap-3.5 px-5 py-4 border-b border-white/[0.06]">
              <svg className="w-5 h-5 text-[#e8623d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                ref={commandInputRef}
                type="text"
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                placeholder="Search apps, sections, or guides..."
                className="w-full bg-transparent text-white placeholder-[#75766E] text-base outline-none font-sans"
              />
              <kbd className="text-[11px] px-2 py-0.5 rounded-md bg-[#000000] border border-white/[0.08] text-[#7A7C73] font-mono">
                ESC
              </kbd>
            </div>

            {/* Results list */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors text-left group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#e8623d] transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#8E9088]">{item.subtitle}</div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#000000] text-[#7A7C73] border border-white/[0.06]">
                      {item.tag}
                    </span>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#75766E] font-mono">
                  No matching apps found for "{commandSearch}"
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-4 py-2.5 bg-[#000000] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#75766E] font-mono">
              <span>Bahi • The Easy Business App</span>
              <span>↑↓ Navigate • ↵ Select • ESC Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
