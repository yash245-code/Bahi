'use client';

import { useState, useEffect, useRef } from 'react';

interface CrmQuickNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (note: { type: string; title: string; entity: string; note: string }) => void;
}

export function CrmQuickNoteModal({ isOpen, onClose, onSaved }: CrmQuickNoteModalProps) {
  const [type, setType] = useState<'Call' | 'Meeting' | 'Email' | 'Note'>('Call');
  const [title, setTitle] = useState('');
  const [entity, setEntity] = useState('');
  const [note, setNote] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleInputRef.current?.focus(), 50);
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (onSaved) {
      onSaved({ type, title, entity, note });
    }

    try {
      const stored = JSON.parse(localStorage.getItem('bahi-crm-recent-activities') || '[]');
      stored.unshift({
        id: Date.now().toString(),
        type,
        title,
        entity: entity || 'General Account',
        time: 'Just now',
        note,
      });
      localStorage.setItem('bahi-crm-recent-activities', JSON.stringify(stored.slice(0, 20)));
    } catch (_) {}

    setTitle('');
    setEntity('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2E302A] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2E302A]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <h3 className="font-bold text-base text-ink dark:text-white">
              Log Activity / Quick Note
            </h3>
            <span className="font-mono text-[10px] text-ink-muted bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
              Press N
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Activity Type Selector */}
        <div className="grid grid-cols-4 gap-2">
          {(['Call', 'Meeting', 'Email', 'Note'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                type === t
                  ? 'bg-accent/15 border-accent text-accent dark:bg-accent/25 shadow-xs font-bold'
                  : 'bg-neutral-50 dark:bg-neutral-900 border-border dark:border-[#2E302A] text-ink-muted hover:text-ink'
              }`}
            >
              <span>{t === 'Call' ? '📞' : t === 'Meeting' ? '🤝' : t === 'Email' ? '✉️' : '📝'}</span>
              <span>{t}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-ink dark:text-neutral-200 mb-1">
              Subject / Interaction Summary <span className="text-accent">*</span>
            </label>
            <input
              ref={titleInputRef}
              type="text"
              required
              placeholder={
                type === 'Call'
                  ? 'e.g. Discovery call with CTO regarding multi-warehouse sync'
                  : type === 'Meeting'
                  ? 'e.g. Executive pricing proposal review with CFO'
                  : type === 'Email'
                  ? 'e.g. Followed up on contract terms and onboarding timeline'
                  : 'e.g. Note on buyer budget constraints and competitor evaluation'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-neutral-100 focus:outline-hidden focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-bold text-ink dark:text-neutral-200 mb-1">
              Associated Company, Deal, or Contact
            </label>
            <input
              type="text"
              placeholder="e.g. Summit Digital or Sarah Chen"
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-neutral-100 focus:outline-hidden focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-bold text-ink dark:text-neutral-200 mb-1">
              Detailed Notes &amp; Action Items
            </label>
            <textarea
              rows={3}
              placeholder="Key takeaways, next scheduled step, customer pain points..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-neutral-100 focus:outline-hidden focus:border-accent"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-ink-muted">
              Auto-saved to Activity Timeline
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary py-2 px-3 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary py-2 px-4 text-xs shadow-xs"
              >
                Save Activity
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
