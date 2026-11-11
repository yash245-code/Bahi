'use client';

import React, { useState } from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
import { getChangelogEntries, saveChangelogEntries, ChangelogEntry } from '@/lib/cms-store';
import { Modal } from '@/components/ui/Modal';

export default function AdminChangelogPage() {
  const [entries, setEntries] = useState<ChangelogEntry[]>(getChangelogEntries());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newBadge, setNewBadge] = useState<ChangelogEntry['badge']>('Feature');
  const [newDesc, setNewDesc] = useState('');
  const [newHighlights, setNewHighlights] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersion || !newTitle) return;

    const entry: ChangelogEntry = {
      version: newVersion,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      title: newTitle,
      badge: newBadge,
      description: newDesc,
      highlights: newHighlights.split('\n').filter((h) => h.trim().length > 0),
    };

    const updated = [entry, ...entries];
    setEntries(updated);
    saveChangelogEntries(updated);
    setIsModalOpen(false);
    setNewVersion('');
    setNewTitle('');
    setNewDesc('');
    setNewHighlights('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
            Release Notes
          </span>
          <h1 className="font-serif text-3xl font-black text-white mt-1">
            Changelog & In-App Announcements
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Release Notes</span>
        </button>
      </div>

      <div className="space-y-4">
        {entries.map((entry, idx) => (
          <div
            key={idx}
            className="rounded-3xl p-6 bg-[#11131A] border border-white/10 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-600 text-white">
                  {entry.version}
                </span>
                <span className="text-xs text-neutral-400 font-mono">{entry.date}</span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                {entry.badge}
              </span>
            </div>

            <h3 className="font-serif font-black text-lg text-white">{entry.title}</h3>
            <p className="text-xs text-neutral-300">{entry.description}</p>

            <div className="pt-2 border-t border-white/5 space-y-1">
              {entry.highlights.map((h, hIdx) => (
                <div key={hIdx} className="flex items-center gap-2 text-xs text-neutral-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Release Notes"
        subtitle="Appears in customer in-app notifications"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase">Version Tag</label>
              <input
                type="text"
                required
                placeholder="v2.5.0"
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase">Release Type</label>
              <select
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
              >
                <option value="Feature">Feature</option>
                <option value="Improvement">Improvement</option>
                <option value="Security">Security</option>
                <option value="Fix">Fix</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase">Release Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Real-Time Webhook Engine & Barcode Scanner"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase">Description</label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Summary of architectural improvements..."
              className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase">Highlights (1 per line)</label>
            <textarea
              rows={4}
              value={newHighlights}
              onChange={(e) => setNewHighlights(e.target.value)}
              placeholder="Added barcode camera scanning support&#10;Zero-latency Postgres RLS query planner"
              className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-white/10 text-neutral-300"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold">
              Broadcast Release
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
