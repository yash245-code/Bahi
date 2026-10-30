'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileSpreadsheet,
  ShoppingBag,
  Tag,
  BarChart3,
  Plus,
  ArrowLeft,
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  Globe2,
  ChevronDown,
} from 'lucide-react';
import { CurrencyCode, CURRENCIES } from './salesData';

interface SalesNavProps {
  onNewQuote?: () => void;
  onNewOrder?: () => void;
  quotesCount?: number;
  ordersCount?: number;
  pipelineTotal?: string;
  currency?: CurrencyCode;
  onCurrencyChange?: (code: CurrencyCode) => void;
}

export function SalesNav({
  onNewQuote,
  onNewOrder,
  quotesCount = 6,
  ordersCount = 5,
  pipelineTotal = '$22,390',
  currency = 'USD',
  onCurrencyChange,
}: SalesNavProps) {
  const pathname = usePathname();
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const activeCurrency = CURRENCIES[currency] || CURRENCIES.USD;

  const navItems = [
    {
      name: 'Overview',
      href: '/sales',
      exact: true,
      badge: null,
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      name: 'Price Quotes',
      href: '/sales/quotes',
      exact: false,
      badge: `${quotesCount}`,
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
    {
      name: 'Orders',
      href: '/sales/orders',
      exact: false,
      badge: `${ordersCount}`,
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      name: 'Price Lists & Discounts',
      href: '/sales/price-books',
      exact: false,
      badge: '4 Rules',
      icon: <Tag className="w-4 h-4" />,
    },
    {
      name: 'Reports',
      href: '/sales/analytics',
      exact: false,
      badge: 'Live',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  return (
    <header className="space-y-4 pb-2 border-b border-border/80 dark:border-[#2A2B27] relative" role="banner">
      {/* ─── Top Control Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#A8462F]/10 dark:bg-[#A8462F]/20 text-[#A8462F] dark:text-[#D16249] border border-[#A8462F]/25 font-mono inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#A8462F]" />
              Sales &amp; Price Quotes
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] px-2 py-0.5 rounded-md">
              Ready to Use
            </span>
            <span className="inline-flex items-center gap-1 bg-[#1F7A4D]/10 dark:bg-[#1F7A4D]/20 text-[#1F7A4D] dark:text-[#38BD7E] border border-[#1F7A4D]/25 px-2 py-0.5 rounded-full text-[10px] font-bold">
              <TrendingUp className="w-2.5 h-2.5" />
              {pipelineTotal} Potential Deals
            </span>

            {/* Live FX Rates Ticker Badge */}
            <span className="hidden xl:inline-flex items-center gap-1.5 bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium">
              <Globe2 className="w-3 h-3 text-blue-500 animate-spin-slow" />
              <span>Currency Rates: 1 USD = 0.92 EUR • 83.45 INR • 3.67 AED</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-neutral-100 tracking-tight">
            Sales &amp; Price Quotes
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5 max-w-2xl">
            Create price quotes for clients, turn accepted quotes into orders, and see what you sell.
          </p>
        </div>

        {/* Action Controls & Currency Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Multi-Currency Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:border-accent transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title="Change Global Currency"
            >
              <span>{activeCurrency.flag}</span>
              <span className="font-mono">{activeCurrency.code}</span>
              <span className="text-ink-muted font-normal">({activeCurrency.symbol})</span>
              <ChevronDown className="w-3 h-3 text-ink-muted ml-0.5" />
            </button>

            {currencyDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCurrencyDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xl z-50 p-1.5 py-1 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-ink-muted uppercase tracking-wider border-b border-border/60 dark:border-neutral-800">
                    Select Currency
                  </div>
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((cCode) => {
                    const c = CURRENCIES[cCode];
                    const isSelected = currency === cCode;
                    return (
                      <button
                        key={cCode}
                        type="button"
                        onClick={() => {
                          onCurrencyChange?.(cCode);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-accent/10 text-accent font-bold'
                            : 'text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>{c.label}</span>
                        </span>
                        <span className="font-mono text-[11px] text-ink-muted">
                          {c.rate === 1.0 ? 'Base' : `${c.rate}x`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <Link
            href="/applications"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-2xs flex items-center gap-1.5"
            title="Return to All Apps"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-ink-muted" />
            <span className="hidden sm:inline">All Apps</span>
          </Link>

          {onNewOrder && (
            <button
              type="button"
              onClick={onNewOrder}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:border-accent hover:text-accent transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-accent" />
              <span>New Order</span>
            </button>
          )}

          {onNewQuote && (
            <button
              type="button"
              onClick={onNewQuote}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-all shadow-xs flex items-center gap-1.5 cursor-pointer group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
              <span>Create Price Quote</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Sub-Page Tab Bar ─── */}
      <nav aria-label="Sales Module Navigation" className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-border/80 dark:border-[#2A2B27] pt-3">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-accent text-white shadow-xs font-bold'
                  : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white hover:bg-white dark:hover:bg-[#1A1B18]'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-ink-muted/80'}>{item.icon}</span>
              <span>{item.name}</span>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-ink-muted dark:text-neutral-400 border border-border/60 dark:border-neutral-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
