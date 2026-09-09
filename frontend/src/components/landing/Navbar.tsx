'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export type ModuleKey = 'crm' | 'sales' | 'inventory' | 'accounting' | 'hr' | 'projects';

interface NavbarProps {
  activeModuleTab?: ModuleKey;
  onSelectModuleTab?: (tab: ModuleKey) => void;
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
          const sections = ['hero', 'services', 'stats', 'modules', 'architecture', 'pricing'];
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

  // The 6 Enterprise Modules for Mega-Menu
  const modules: ModuleItem[] = [
    {
      id: 'crm',
      tag: 'PIPELINE',
      name: 'CRM & Deals',
      description: 'Visual pipelines, lead scoring & 360° contact activity logs.',
      color: 'from-orange-500/20 to-amber-500/20 text-[#e8623d]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      ),
    },
    {
      id: 'inventory',
      tag: 'LOGISTICS',
      name: 'Multi-Warehouse Inventory',
      description: 'Real-time stock counts, bin transfers & barcode audits.',
      color: 'from-blue-500/20 to-cyan-500/20 text-[#60A5FA]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      ),
    },
    {
      id: 'accounting',
      tag: 'FINANCE',
      name: 'Ledger & Accounting',
      description: 'Double-entry general ledger, journal entries & real-time P&L.',
      color: 'from-emerald-500/20 to-teal-500/20 text-[#34D399]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      id: 'sales',
      tag: 'BILLING',
      name: 'Invoicing & Sales Orders',
      description: 'Instant quotes, GST invoices, multi-currency & online pay.',
      color: 'from-purple-500/20 to-pink-500/20 text-[#C084FC]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      ),
    },
    {
      id: 'hr',
      tag: 'PEOPLE',
      name: 'HR & Workforce',
      description: 'Employee profiles, department directories & leave approvals.',
      color: 'from-rose-500/20 to-red-500/20 text-[#FB7185]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      ),
    },
    {
      id: 'projects',
      tag: 'AGILE',
      name: 'Sprints & Projects',
      description: 'Sprint task boards, billable timesheets & team velocity.',
      color: 'from-amber-500/20 to-yellow-500/20 text-[#FBBF24]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
    },
  ];

  // Standard nav links with smooth scroll targets
  const navLinks = [
    { label: 'Overview', href: '#hero', id: 'hero' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Performance', href: '#stats', id: 'stats' },
    // Modules is handled via mega-menu dropdown
    { label: 'Architecture', href: '#architecture', id: 'architecture' },
    { label: 'Pricing', href: '#pricing', id: 'pricing' },
  ];

  // Search items for command palette
  const commandItems = [
    { title: 'Overview', subtitle: 'Hero intro & high-level vision', action: () => scrollToSection('hero'), tag: 'SECTION' },
    { title: 'Core Services Carousel', subtitle: 'Explore modular service previews', action: () => scrollToSection('services'), tag: 'SECTION' },
    { title: 'Performance & Scale Bento', subtitle: 'Uptime, latency & metrics', action: () => scrollToSection('stats'), tag: 'SECTION' },
    { title: 'Enterprise Modules', subtitle: 'Interactive deep-dive', action: () => scrollToSection('modules'), tag: 'SECTION' },
    { title: 'CRM Module', subtitle: 'Pipelines & deal scoring', action: () => handleModuleClick('crm'), tag: 'MODULE' },
    { title: 'Inventory Module', subtitle: 'Warehouses & stock moves', action: () => handleModuleClick('inventory'), tag: 'MODULE' },
    { title: 'Accounting Module', subtitle: 'General ledger & journal balance', action: () => handleModuleClick('accounting'), tag: 'MODULE' },
    { title: 'Invoicing & Sales', subtitle: 'Quotes, invoices & payments', action: () => handleModuleClick('sales'), tag: 'MODULE' },
    { title: 'HR & People', subtitle: 'Directory & leave management', action: () => handleModuleClick('hr'), tag: 'MODULE' },
    { title: 'Sprints & Projects', subtitle: 'Kanban & billable timesheets', action: () => handleModuleClick('projects'), tag: 'MODULE' },
    { title: 'Ledger Architecture', subtitle: 'Atomic MongoDB transactions & security', action: () => scrollToSection('architecture'), tag: 'SECTION' },
    { title: 'Pricing Calculator', subtitle: 'Starter, Growth & Business plans', action: () => scrollToSection('pricing'), tag: 'SECTION' },
    { title: 'Swagger API Docs', subtitle: 'Direct OpenAPI 3.0 specification', action: () => window.open('http://localhost:4000/api/docs', '_blank'), tag: 'DEV' },
    { title: 'Sign In / Dashboard', subtitle: 'Open operational console', action: () => window.location.href = '/dashboard', tag: 'AUTH' },
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
        className={`sticky top-0 z-50 h-16 transition-colors duration-300 ease-in-out ${
          isScrolled
            ? 'bg-[#181917]/95 backdrop-blur-2xl shadow-xl shadow-black/50'
            : 'bg-[#222222]/90 backdrop-blur-xl'
        }`}
      >
        {/* ─── Horizontal 1px Gradient Bottom Border (Orange → Transparent) ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#e8623d]/90 via-[#e8623d]/35 to-transparent pointer-events-none transition-opacity duration-300"
          aria-hidden="true"
        />
        {/* Subtle orange accent glow under border */}
        <div
          className="absolute bottom-0 left-0 w-80 h-[2px] bg-gradient-to-r from-[#e8623d]/40 to-transparent blur-[2px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3 sm:gap-4 flex-nowrap">
          {/* ── Left: Logo + Live Atlas Status Badge (Strictly 1 line) ── */}
          <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0 flex-nowrap">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8623d] rounded-lg flex-shrink-0 whitespace-nowrap"
              aria-label="Bahi ERP Home"
            >
              <div
                className={`w-8 h-8 rounded-xl bg-gradient-to-br from-[#B7624C] via-[#9e412b] to-[#853526] flex items-center justify-center text-white font-black text-sm shadow-md border border-white/20 group-hover:scale-105 transition-transform duration-200 flex-shrink-0 ${
                  isScrolled ? 'scale-95' : 'scale-100'
                }`}
              >
                B
              </div>
              <span className="font-black text-white text-base tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                Bahi
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#e8623d]/20 text-[#EBD2CB] border border-[#e8623d]/35">
                  ERP
                </span>
              </span>
            </Link>

            {/* Live-Status Badge (Atlas Connected + Latency - Strictly 1 line) */}
            <div
              className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1A1B18]/90 border border-[#33352F] text-[11px] shadow-inner select-none whitespace-nowrap flex-shrink-0"
              title="MongoDB Atlas Primary Replica Connection Health"
            >
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1F7A4D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1F7A4D]"></span>
              </span>
              <span className="font-medium text-[#D8CDC8] whitespace-nowrap">Atlas Connected</span>
              <span className="text-[#55564E]">•</span>
              <span className="font-mono text-[#2ECC71] font-semibold whitespace-nowrap">{latency}ms</span>
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
              className={`relative px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap flex-shrink-0 group ${
                activeSection === 'hero'
                  ? 'text-white bg-white/[0.05]'
                  : 'text-[#9A9B93] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <span>Overview</span>
              <span
                className={`absolute bottom-0.5 left-2 right-2 h-[2px] bg-gradient-to-r from-[#e8623d] to-[#ff8c69] rounded-full transition-all duration-200 ease-out ${
                  activeSection === 'hero' ? 'opacity-100' : 'w-0 opacity-0 group-hover:w-[calc(100%-1rem)] group-hover:opacity-100'
                }`}
              />
            </a>

            {/* Services link */}
            <a
              href="#services"
              className={`relative px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap flex-shrink-0 group ${
                activeSection === 'services'
                  ? 'text-white bg-white/[0.05]'
                  : 'text-[#9A9B93] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <span>Services</span>
              <span
                className={`absolute bottom-0.5 left-2 right-2 h-[2px] bg-gradient-to-r from-[#e8623d] to-[#ff8c69] rounded-full transition-all duration-200 ease-out ${
                  activeSection === 'services' ? 'opacity-100' : 'w-0 opacity-0 group-hover:w-[calc(100%-1rem)] group-hover:opacity-100'
                }`}
              />
            </a>

            {/* Performance link */}
            <a
              href="#stats"
              className={`relative px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap flex-shrink-0 group ${
                activeSection === 'stats'
                  ? 'text-white bg-white/[0.05]'
                  : 'text-[#9A9B93] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <span>Performance</span>
              <span
                className={`absolute bottom-0.5 left-2 right-2 h-[2px] bg-gradient-to-r from-[#e8623d] to-[#ff8c69] rounded-full transition-all duration-200 ease-out ${
                  activeSection === 'stats' ? 'opacity-100' : 'w-0 opacity-0 group-hover:w-[calc(100%-1rem)] group-hover:opacity-100'
                }`}
              />
            </a>

            {/* ─── Mega-Menu Trigger: Modules ────────────────────── */}
            <div
              className="relative flex-shrink-0"
              onMouseEnter={handleModulesMouseEnter}
              onMouseLeave={handleModulesMouseLeave}
            >
              <button
                type="button"
                onClick={() => setIsModulesOpen((prev) => !prev)}
                className={`relative px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center gap-1 whitespace-nowrap flex-shrink-0 group ${
                  isModulesOpen || activeSection === 'modules'
                    ? 'text-white bg-white/[0.06]'
                    : 'text-[#9A9B93] hover:text-white hover:bg-white/[0.03]'
                }`}
                aria-haspopup="true"
                aria-expanded={isModulesOpen}
              >
                <span>Modules</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 text-[#9A9B93] group-hover:text-white flex-shrink-0 ${
                    isModulesOpen ? 'rotate-180 text-white' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
                <span
                  className={`absolute bottom-0.5 left-2 right-2 h-[2px] bg-gradient-to-r from-[#e8623d] to-[#ff8c69] rounded-full transition-all duration-200 ease-out ${
                    activeSection === 'modules' || isModulesOpen
                      ? 'opacity-100'
                      : 'w-0 opacity-0 group-hover:w-[calc(100%-1rem)] group-hover:opacity-100'
                  }`}
                />
              </button>

              {/* Mega-Menu Dropdown Panel */}
              {isModulesOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[680px] z-50 animate-fade-in"
                  onMouseEnter={handleModulesMouseEnter}
                  onMouseLeave={handleModulesMouseLeave}
                >
                  <div className="rounded-2xl bg-[#181917]/95 backdrop-blur-2xl border border-[#33352F] shadow-2xl p-5 overflow-hidden relative">
                    {/* Top subtle highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e8623d]/60 to-transparent" />

                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#292A25]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#e8623d]/15 text-[#e8623d] border border-[#e8623d]/25 font-bold">
                          Core Enterprise Suite
                        </span>
                        <span className="text-xs text-[#9A9B93]">6 Integrated Odoo-style Operations Engines</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#6A6C64]">Click to inspect</span>
                    </div>

                    {/* 3-Column Grid for the 6 Modules */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {modules.map((mod) => {
                        const isSelected = activeModuleTab === mod.id;
                        return (
                          <button
                            key={mod.id}
                            type="button"
                            onClick={() => handleModuleClick(mod.id)}
                            className={`text-left p-3 rounded-xl border transition-all duration-150 group relative ${
                              isSelected
                                ? 'bg-[#262723] border-[#e8623d]/50 shadow-md shadow-[#e8623d]/10'
                                : 'bg-[#1E1F1C]/70 hover:bg-[#262723] border-[#2E302A] hover:border-[#42443C]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${mod.color} flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform`}>
                                {mod.icon}
                              </div>
                              <span className="text-[9px] font-mono uppercase tracking-wider text-[#7A7C73] px-1.5 py-0.5 rounded bg-[#141513] border border-[#2B2C27]">
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
                    <div className="mt-3 pt-3 border-t border-[#292A25] flex items-center justify-between text-xs">
                      <a
                        href="#modules"
                        onClick={() => setIsModulesOpen(false)}
                        className="text-[#9A9B93] hover:text-[#e8623d] transition-colors flex items-center gap-1 font-medium"
                      >
                        Explore all module deep-dives
                        <span>→</span>
                      </a>
                      <a
                        href="#architecture"
                        onClick={() => setIsModulesOpen(false)}
                        className="text-[#75766E] hover:text-white transition-colors text-[11px] font-mono"
                      >
                        Atomic MongoDB Ledger Security ↗
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Architecture link */}
            <a
              href="#architecture"
              className={`relative px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap flex-shrink-0 group ${
                activeSection === 'architecture'
                  ? 'text-white bg-white/[0.05]'
                  : 'text-[#9A9B93] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <span>Architecture</span>
              <span
                className={`absolute bottom-0.5 left-2 right-2 h-[2px] bg-gradient-to-r from-[#e8623d] to-[#ff8c69] rounded-full transition-all duration-200 ease-out ${
                  activeSection === 'architecture' ? 'opacity-100' : 'w-0 opacity-0 group-hover:w-[calc(100%-1rem)] group-hover:opacity-100'
                }`}
              />
            </a>

            {/* Pricing link */}
            <a
              href="#pricing"
              className={`relative px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap flex-shrink-0 group ${
                activeSection === 'pricing'
                  ? 'text-white bg-white/[0.05]'
                  : 'text-[#9A9B93] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <span>Pricing</span>
              <span
                className={`absolute bottom-0.5 left-2 right-2 h-[2px] bg-gradient-to-r from-[#e8623d] to-[#ff8c69] rounded-full transition-all duration-200 ease-out ${
                  activeSection === 'pricing' ? 'opacity-100' : 'w-0 opacity-0 group-hover:w-[calc(100%-1rem)] group-hover:opacity-100'
                }`}
              />
            </a>

            {/* ─── API Docs (Distinctly Styled Monospace Dev Link - Strictly 1 line) ── */}
            <div className="h-4 w-[1px] bg-[#33352F] mx-1 flex-shrink-0" aria-hidden="true" />
            <a
              href="http://localhost:4000/api/docs"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] px-2.5 py-1 rounded-md text-[#8E9088] hover:text-[#F7F6F3] bg-[#222320]/70 hover:bg-[#282924] border border-[#343630] hover:border-[#4E5046] transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 group"
              aria-label="NestJS Swagger OpenAPI Documentation"
              title="Open OpenAPI/Swagger Docs in Port 4000"
            >
              <span className="text-[#e8623d] opacity-70 group-hover:opacity-100 transition-opacity">$</span>
              <span className="whitespace-nowrap">api-docs</span>
              <svg
                className="w-3 h-3 text-[#75766E] group-hover:text-[#e8623d] transition-colors flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>
          </nav>

          {/* ── Right: ⌘K Trigger, Sign In, Primary CTA Button (Strictly 1 line) ── */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 flex-nowrap">
            {/* ⌘K Command Palette Trigger (Clean keycap, strictly 1 line) */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#20211E]/80 hover:bg-[#292A26] border border-[#343630] hover:border-[#4B4D43] text-[#9A9B93] hover:text-[#F7F6F3] text-xs font-mono transition-all duration-150 whitespace-nowrap flex-shrink-0 group"
              aria-label="Open Command Palette (Press Command+K or Ctrl+K)"
              title="Command Palette (⌘K / Ctrl+K)"
            >
              <svg
                className="w-3.5 h-3.5 text-[#75766E] group-hover:text-[#e8623d] transition-colors flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <kbd className="text-[10px] px-1 py-0.5 rounded bg-[#151614] border border-[#33352F] text-[#858780] font-mono group-hover:text-[#FAF4F2] whitespace-nowrap">
                ⌘K
              </kbd>
            </button>

            {/* Sign In Link (Strictly 1 line) */}
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-[#9A9B93] hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Sign In
            </Link>

            {/* ─── Primary CTA Button: "Start Free Trial" (Strictly 1 line, never wraps!) ─── */}
            <Link
              href="/dashboard"
              className="relative group inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-[#e8623d] via-[#B7624C] to-[#853526] hover:from-[#f06e4a] hover:to-[#913B26] border border-white/20 shadow-md animate-pulse-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 whitespace-nowrap flex-shrink-0"
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
              className="lg:hidden p-2 rounded-lg bg-[#20211E] border border-[#343630] text-[#9A9B93] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e8623d] flex-shrink-0"
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
          <div className="md:hidden border-t border-[#33352F] bg-[#181917]/95 backdrop-blur-2xl px-5 py-4 space-y-3 animate-slide-down">
            {/* Live status badge mobile */}
            <div className="flex items-center justify-between pb-2 border-b border-[#292A25]">
              <div className="flex items-center gap-2 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1F7A4D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1F7A4D]"></span>
                </span>
                <span className="font-semibold text-white">MongoDB Atlas Cluster</span>
              </div>
              <span className="font-mono text-xs text-[#2ECC71]">{latency}ms latency</span>
            </div>

            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    activeSection === link.id
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
                  Suite Modules
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {modules.map((mod) => (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => handleModuleClick(mod.id)}
                      className="flex items-center gap-2 p-2 rounded-lg bg-[#20211E] border border-[#2E302A] text-left"
                    >
                      <div className={`w-6 h-6 rounded bg-gradient-to-br ${mod.color} flex items-center justify-center`}>
                        {mod.icon}
                      </div>
                      <span className="text-xs font-semibold text-white truncate">{mod.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* API Docs mobile */}
              <div className="pt-2">
                <a
                  href="http://localhost:4000/api/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#20211E] border border-[#343630] font-mono text-xs text-[#9A9B93]"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#e8623d]">$</span>
                    <span>api-docs (Swagger)</span>
                  </span>
                  <span>↗</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ─── Command Palette Modal (⌘K / Ctrl+K) ─────────────────── */}
      {isCommandPaletteOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-fade-in"
          onClick={() => setIsCommandPaletteOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-[#1A1B18] border border-[#383A32] shadow-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input row */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#2D2F28]">
              <svg className="w-5 h-5 text-[#e8623d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                ref={commandInputRef}
                type="text"
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                placeholder="Search modules, sections, docs, or actions..."
                className="w-full bg-transparent text-white placeholder-[#75766E] text-sm outline-none font-sans"
              />
              <kbd className="text-[10px] px-2 py-0.5 rounded bg-[#121311] border border-[#343630] text-[#7A7C73] font-mono">
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
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#252722] transition-colors text-left group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#e8623d] transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#8E9088]">{item.subtitle}</div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#141513] text-[#7A7C73] border border-[#2B2C27]">
                      {item.tag}
                    </span>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#75766E] font-mono">
                  No matching commands for "{commandSearch}"
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-4 py-2.5 bg-[#141513] border-t border-[#292A25] flex items-center justify-between text-[11px] text-[#75766E] font-mono">
              <span>Bahi Operations Engine v1.2</span>
              <span>↑↓ Navigate • ↵ Select • ESC Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
