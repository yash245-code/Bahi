'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft } from 'lucide-react';
import { INITIAL_LEGAL_DOCS } from '@/lib/cms-store';

export default function RefundPage() {
  const doc = INITIAL_LEGAL_DOCS.refund!;

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-ink dark:hover:text-white mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="border-b border-black/10 dark:border-white/10 pb-8 mb-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
              Version {doc.version}
            </span>
            <span className="text-xs text-neutral-400 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" /> Last updated: {doc.lastUpdated}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-ink dark:text-white">
            {doc.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl">{doc.summary}</p>
        </div>

        {/* Content */}
        <div className="rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm leading-relaxed text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-6 whitespace-pre-line">
          {doc.content}
        </div>
      </div>
    </div>
  );
}
