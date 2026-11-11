'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F7F6F3] dark:bg-[#050505] text-ink dark:text-neutral-100 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto shadow-sm">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-accent">
            HTTP 404 — Page Not Found
          </span>
          <h1 className="font-serif text-4xl font-black text-ink dark:text-white">
            Off the Ledger Boundary
          </h1>
          <p className="text-xs text-neutral-500 leading-relaxed">
            The page or record you requested does not exist or may have been migrated to another domain.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 hover:opacity-95 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/applications"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            <span>Open Applications</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
