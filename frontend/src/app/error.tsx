'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error in App Router:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F7F6F3] dark:bg-[#050505] text-ink dark:text-neutral-100 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-rose-500">
            HTTP 500 — Application Runtime Error
          </span>
          <h1 className="font-serif text-3xl font-black text-ink dark:text-white">
            Something went wrong
          </h1>
          <p className="text-xs text-neutral-500 leading-relaxed">
            An unexpected error occurred while executing this component. A crash report has been logged to
            the observability service.
          </p>
          {error?.digest && (
            <p className="text-[10px] font-mono text-neutral-400">Error Digest: {error.digest}</p>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Safety</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

