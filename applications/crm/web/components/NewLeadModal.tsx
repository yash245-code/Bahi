'use client';

import { useState, useEffect, useRef } from 'react';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lead: {
    name: string;
    company: string;
    email: string;
    phone: string;
    source: string;
    score: number;
    notes?: string;
  }) => void;
}

export function NewLeadModal({ isOpen, onClose, onSubmit }: NewLeadModalProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('Inbound Website');
  const [score, setScore] = useState(70);
  const [notes, setNotes] = useState('');

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
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
    if (!name || !company || !email) return;
    onSubmit({
      name,
      company,
      email,
      phone,
      source,
      score,
      notes,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-lead-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl border border-border dark:border-[#2E302A] shadow-2xl max-w-lg w-full p-6 space-y-5 text-ink dark:text-neutral-100">
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2E302A]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <h2 id="new-lead-modal-title" className="text-base font-bold text-ink dark:text-white">
              Capture New Inbound Lead
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close lead capture dialog"
            className="text-ink-muted hover:text-ink text-sm p-1 rounded-lg hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-accent focus:outline-hidden"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="lead-name-input" className="block text-ink font-semibold mb-1">
                Contact Name *
              </label>
              <input
                id="lead-name-input"
                type="text"
                required
                aria-required="true"
                placeholder="Sarah Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-hidden focus-visible:ring-2 focus-visible:ring-accent text-ink"
              />
            </div>
            <div>
              <label htmlFor="lead-company-input" className="block text-ink font-semibold mb-1">
                Company / Org *
              </label>
              <input
                id="lead-company-input"
                type="text"
                required
                aria-required="true"
                placeholder="TechStart Inc."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-hidden focus-visible:ring-2 focus-visible:ring-accent text-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="lead-email-input" className="block text-ink font-semibold mb-1">
                Email Address *
              </label>
              <input
                id="lead-email-input"
                type="email"
                required
                aria-required="true"
                placeholder="sarah@techstart.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-hidden focus-visible:ring-2 focus-visible:ring-accent text-ink"
              />
            </div>
            <div>
              <label htmlFor="lead-phone-input" className="block text-ink font-semibold mb-1">
                Phone Number
              </label>
              <input
                id="lead-phone-input"
                type="tel"
                placeholder="+1 (555) 349-2180"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-hidden focus-visible:ring-2 focus-visible:ring-accent text-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="lead-source-select" className="block text-ink font-semibold mb-1">
                Lead Source
              </label>
              <select
                id="lead-source-select"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-hidden focus-visible:ring-2 focus-visible:ring-accent text-ink"
              >
                <option value="Inbound Website">Inbound Website</option>
                <option value="Product Trial">Product Trial</option>
                <option value="Referral">Partner Referral</option>
                <option value="Direct Outreach">Direct Outreach</option>
                <option value="Webinar/Event">Webinar / Event</option>
              </select>
            </div>
            <div>
              <label htmlFor="lead-score-range" className="block text-ink font-semibold mb-1">
                Qualification Score ({score}/100)
              </label>
              <input
                id="lead-score-range"
                type="range"
                min="10"
                max="100"
                step="5"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full accent-accent mt-2 focus-visible:ring-2 focus-visible:ring-accent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="lead-notes-input" className="block text-ink font-semibold mb-1">
              Initial Discovery Notes
            </label>
            <textarea
              id="lead-notes-input"
              rows={3}
              placeholder="Expressed interest in multi-warehouse synchronization and ERP integration..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-hidden focus-visible:ring-2 focus-visible:ring-accent text-ink"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2 focus-visible:ring-2 focus-visible:ring-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-2 focus-visible:ring-2 focus-visible:ring-accent"
            >
              Capture Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
