'use client';

import React, { useState, useMemo } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { INITIAL_DOCS, DocArticle } from '@/lib/cms-store';

export default function DocsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<DocArticle>(INITIAL_DOCS[0]!);

  const categories = ['All', 'Getting Started', 'CRM & Sales', 'Inventory & Stock', 'API & Webhooks'];

  const filteredDocs = useMemo(() => {
    return INITIAL_DOCS.filter((doc) => {
      const matchCat = selectedCategory === 'All' || doc.category === selectedCategory;
      const matchSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.description.toLowerCase().includes(search.toLowerCase()) ||
        doc.content.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, search]);

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Knowledge Base & Guides</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-ink dark:text-white tracking-tight">
            Help Center & Technical Reference
          </h1>
          <p className="text-sm text-ink-muted dark:text-neutral-300 leading-relaxed">
            Step-by-step guides, API integration tutorials, and best practices for configuring your Bahi modules.
          </p>

          {/* Search */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search documentation, articles, and APIs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#14161C] text-xs sm:text-sm text-ink dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Two-Pane Knowledge Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Article List */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold px-2 block">
              Articles ({filteredDocs.length})
            </span>
            {filteredDocs.map((doc) => {
              const isSelected = activeArticle?.slug === doc.slug;
              return (
                <div
                  key={doc.slug}
                  onClick={() => setActiveArticle(doc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-[#15171F] border-accent shadow-sm'
                      : 'bg-white dark:bg-[#111318] border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'
                  }`}
                >
                  <span className="text-[10px] font-mono text-accent uppercase font-semibold">
                    {doc.category}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-ink dark:text-white mt-1">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Main Article View */}
          <div className="lg:col-span-2 rounded-3xl p-8 sm:p-10 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-6">
            {activeArticle ? (
              <>
                <div className="border-b border-black/5 dark:border-white/5 pb-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-accent">
                      {activeArticle.category}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      Updated {activeArticle.lastUpdated}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-black text-ink dark:text-white">
                    {activeArticle.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500">{activeArticle.description}</p>
                </div>

                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-line leading-relaxed font-sans">
                  {activeArticle.content}
                </div>

                <div className="pt-8 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Did this article answer your question?</span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 rounded-xl border border-black/10 dark:border-white/10 text-xs font-medium hover:bg-neutral-50">
                      👍 Yes
                    </button>
                    <button className="px-3 py-1 rounded-xl border border-black/10 dark:border-white/10 text-xs font-medium hover:bg-neutral-50">
                      👎 No
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-neutral-400 text-xs">Select an article to read.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
