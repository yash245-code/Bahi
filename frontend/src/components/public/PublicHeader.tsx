'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Customers', href: '/customers' },
    { label: 'Integrations', href: '/integrations' },
    { label: 'Docs', href: '/docs' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-[#050505]/85 border-b border-black/5 dark:border-white/10 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white font-serif font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
            B
          </div>
          <div>
            <span className="font-serif font-black text-xl text-ink dark:text-white tracking-tight">
              Bahi<span className="text-accent">.</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-neutral-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-accent dark:hover:text-accent ${
                  isActive ? 'text-accent font-bold' : ''
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-3.5 py-1.5 text-xs font-medium rounded-xl text-ink-muted dark:text-neutral-300 hover:text-ink dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-accent text-white shadow-md shadow-accent/20 hover:opacity-95 active:scale-95 transition-all"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#0E0F12] px-6 py-6 space-y-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium py-1 text-ink dark:text-neutral-200 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-medium rounded-xl border border-black/10 dark:border-white/10 text-ink dark:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-semibold rounded-xl bg-accent text-white"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
