'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { getBlogPosts, saveBlogPosts, BlogPost, getJobOpenings, saveJobOpenings, JobOpening } from '@/lib/cms-store';
import { Modal } from '@/components/ui/Modal';

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState<'blog' | 'careers'>('blog');
  const [posts, setPosts] = useState<BlogPost[]>(getBlogPosts());
  const [jobs, setJobs] = useState<JobOpening[]>(getJobOpenings());

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    category: 'Product',
    readTime: '5 min read',
    content: '',
  });

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    const post: BlogPost = {
      slug: (newPost.slug || newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')) || `post-${Date.now()}`,
      title: newPost.title,
      excerpt: newPost.excerpt || '',
      category: (newPost.category as any) || 'Product',
      author: {
        name: 'Aiden Vance',
        role: 'Co-Founder & CEO',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      },
      publishedAt: new Date().toISOString().split('T')[0] || '2026-11-10',
      readTime: newPost.readTime || '4 min read',
      content: newPost.content,
    };

    const updated = [post, ...posts];
    setPosts(updated);
    saveBlogPosts(updated);
    setIsBlogModalOpen(false);
  };

  const toggleJobStatus = (id: string) => {
    const updated = jobs.map((j) => (j.id === id ? { ...j, isOpen: !j.isOpen } : j));
    setJobs(updated);
    saveJobOpenings(updated);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
            Content Management
          </span>
          <h1 className="font-serif text-3xl font-black text-white mt-1">
            Marketing CMS, Blog & Careers
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsBlogModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Article</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('blog')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'blog' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Blog & Articles ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('careers')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'careers' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Career Job Listings ({jobs.length})
        </button>
      </div>

      {activeTab === 'blog' && (
        <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/5 text-neutral-400 uppercase text-[10px] font-mono">
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Published Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-200">
                {posts.map((p) => (
                  <tr key={p.slug}>
                    <td className="p-3">
                      <span className="font-semibold text-white block">{p.title}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">/blog/{p.slug}</span>
                    </td>
                    <td className="p-3 font-mono text-rose-400">{p.category}</td>
                    <td className="p-3 text-neutral-300">{p.author.name}</td>
                    <td className="p-3 text-neutral-400 font-mono">{p.publishedAt}</td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = posts.filter((item) => item.slug !== p.slug);
                          setPosts(updated);
                          saveBlogPosts(updated);
                        }}
                        className="text-rose-400 hover:text-rose-300 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'careers' && (
        <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/5 text-neutral-400 uppercase text-[10px] font-mono">
                  <th className="p-3">Role Title</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Public Status</th>
                  <th className="p-3 text-right">Toggle Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-200">
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <td className="p-3 font-semibold text-white">{j.title}</td>
                    <td className="p-3 font-mono text-rose-400">{j.department}</td>
                    <td className="p-3 text-neutral-400">{j.location}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          j.isOpen
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {j.isOpen ? 'Open & Hiring' : 'Hidden / Closed'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => toggleJobStatus(j.id)}
                        className="px-3 py-1 rounded-lg border border-white/10 hover:bg-white/5 text-xs text-neutral-300"
                      >
                        {j.isOpen ? 'Hide Role' : 'Publish Role'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Blog Modal */}
      <Modal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        title="Publish New Knowledge Article"
        subtitle="Saved to CMS and published to public blog"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateBlog} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase">Article Title *</label>
            <input
              type="text"
              required
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="e.g. Optimizing Database Query Plans in PostgreSQL"
              className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase">Category</label>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
              >
                <option>Product</option>
                <option>Engineering</option>
                <option>Business Ops</option>
                <option>Security</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase">Estimated Read Time</label>
              <input
                type="text"
                value={newPost.readTime}
                onChange={(e) => setNewPost({ ...newPost, readTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase">Short Excerpt *</label>
            <input
              type="text"
              required
              value={newPost.excerpt}
              onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase">Markdown Content Body *</label>
            <textarea
              rows={8}
              required
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white font-mono text-xs leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsBlogModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-white/10 text-neutral-300"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold">
              Publish Live Article
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
