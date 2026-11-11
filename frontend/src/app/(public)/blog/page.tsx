'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Newspaper, Clock, ArrowRight } from 'lucide-react';
import { getBlogPosts } from '@/lib/cms-store';

export default function BlogListPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const posts = getBlogPosts();

  const categories = ['All', 'Product', 'Engineering', 'Business Ops', 'Security'];

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return posts;
    return posts.filter((p) => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  const featured = posts.find((p) => p.featured) || posts[0];

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Articles & Insights</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-ink dark:text-white tracking-tight">
            The Bahi Engineering & Operations Blog
          </h1>
          <p className="text-sm sm:text-base text-ink-muted dark:text-neutral-300 leading-relaxed">
            Architectural teardowns, SME playbooks, database design, and operational strategies for modern operators.
          </p>
        </div>

        {/* Featured Post Card */}
        {featured && (
          <div className="mb-16 rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm hover:shadow-xl transition-all">
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-accent text-white">
                    Featured Deep-Dive
                  </span>
                  <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {featured.readTime}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl font-black text-ink dark:text-white leading-tight">
                  <Link href={`/blog/${featured.slug}`} className="hover:text-accent transition-colors">
                    {featured.title}
                  </Link>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
                  {featured.excerpt}
                </p>

                <div className="pt-4 flex items-center gap-3">
                  <img
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-black/10"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-ink dark:text-white">{featured.author.name}</h4>
                    <p className="text-[11px] text-neutral-500">{featured.author.role}</p>
                  </div>
                </div>
              </div>

              <div className="shrink-0 self-end lg:self-center">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 hover:opacity-95"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-ink dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <article
              key={post.slug}
              className="rounded-3xl p-7 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold">
                    {post.category}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-ink dark:text-white leading-snug">
                  <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    {post.author.name}
                  </span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs text-accent font-semibold flex items-center gap-1 hover:opacity-80"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
