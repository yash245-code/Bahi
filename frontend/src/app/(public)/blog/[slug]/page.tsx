'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Clock, ArrowLeft, Share2 } from 'lucide-react';
import { getBlogPosts } from '@/lib/cms-store';

export default function BlogPostDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const posts = getBlogPosts();
  const post = posts.find((p) => p.slug === slug) || posts[0];
  const relatedPosts = posts.filter((p) => p.slug !== post?.slug).slice(0, 2);

  if (!post) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-6">
        <h1 className="font-serif text-2xl font-bold">Article Not Found</h1>
        <Link href="/blog" className="text-accent underline text-xs mt-3 inline-block">
          Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-ink dark:hover:text-white mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <header className="space-y-4 border-b border-black/10 dark:border-white/10 pb-8 mb-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">
              {post.category}
            </span>
            <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
            <span className="text-xs text-neutral-400 font-mono">Published {post.publishedAt}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-black text-ink dark:text-white leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover border border-black/10"
              />
              <div>
                <h4 className="text-xs font-semibold text-ink dark:text-white">{post.author.name}</h4>
                <p className="text-[11px] text-neutral-500">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({ title: post.title, url: window.location.href });
                  }
                }}
                className="p-2 rounded-xl border border-black/10 dark:border-white/10 text-neutral-500 hover:text-ink dark:hover:text-white transition-colors"
                title="Share Article"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <article className="rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm leading-relaxed text-xs sm:text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-line font-sans space-y-6">
          {post.content}
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-black/10 dark:border-white/10">
            <h3 className="font-serif font-bold text-2xl text-ink dark:text-white mb-6">Related Deep Dives</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.slug}
                  className="rounded-2xl p-6 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-3"
                >
                  <span className="text-[10px] font-mono text-accent uppercase font-bold">{rel.category}</span>
                  <h4 className="font-serif font-bold text-base text-ink dark:text-white leading-snug">
                    <Link href={`/blog/${rel.slug}`} className="hover:text-accent">
                      {rel.title}
                    </Link>
                  </h4>
                  <p className="text-xs text-neutral-500 line-clamp-2">{rel.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
