'use client';

import { useState, useEffect, useRef } from 'react';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deal: {
    title: string;
    value: number;
    company: string;
    contact: string;
    stage: string;
    priority: 'Hot' | 'High' | 'Medium' | 'Low';
    probability: number;
  }) => void;
}

export function NewDealModal({ isOpen, onClose, onSubmit }: NewDealModalProps) {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [stage, setStage] = useState('New Leads');
  const [priority, setPriority] = useState<'Hot' | 'High' | 'Medium' | 'Low'>('High');
  const [probability, setProbability] = useState('40');

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
    if (!title || !company) return;
    onSubmit({
      title,
      value: Number(value) || 10000,
      company,
      contact: contact || 'contact@' + company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com',
      stage,
      priority,
      probability: Number(probability) || 40,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-deal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl border border-border dark:border-[#2E302A] shadow-2xl max-w-lg w-full p-6 space-y-5 text-ink dark:text-neutral-100">
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2E302A]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <h2 id="new-deal-modal-title" className="text-base font-bold text-ink dark:text-white">
              Create New Opportunity Deal
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close deal modal"
            className="text-ink-muted hover:text-ink dark:hover:text-white text-sm p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-accent focus:outline-hidden"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label htmlFor="deal-title-input" className="block text-ink dark:text-neutral-200 font-semibold mb-1">
              Deal Title *
            </label>
            <input
              id="deal-title-input"
              type="text"
              required
              aria-required="true"
              placeholder="e.g. Enterprise Cloud ERP Migration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] focus:bg-white dark:focus:bg-[#181917] outline-hidden focus-visible:ring-2 focus-visible:ring-accent text-ink dark:text-neutral-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="deal-value-input" className="block text-ink dark:text-neutral-200 font-semibold mb-1">
                Deal Value ($) *
              </label>
              <input
                id="deal-value-input"
                type="number"
                required
                aria-required="true"
                placeholder="25000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] focus:bg-white dark:focus:bg-[#181917] outline-hidden focus-visible:ring-2 focus-visible:ring-accent text-ink dark:text-neutral-100"
              />
            </div>
            <div>
              <label htmlFor="deal-probability-input" className="block text-ink dark:text-neutral-200 font-semibold mb-1">
                Close Probability (%)
              </label>
              <input
                id="deal-probability-input"
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(e) => setProbability(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] focus:bg-white dark:focus:bg-[#181917] outline-hidden focus-visible:ring-2 focus-visible:ring-accent text-ink dark:text-neutral-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="deal-company-input" className="block text-ink dark:text-neutral-200 font-semibold mb-1">
                Company / Account *
              </label>
              <input
                id="deal-company-input"
                type="text"
                required
                aria-required="true"
                placeholder="e.g. NexGen Dynamics"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] focus:bg-white dark:focus:bg-[#181917] outline-hidden focus-visible:ring-2 focus-visible:ring-accent text-ink dark:text-neutral-100"
              />
            </div>
            <div>
              <label htmlFor="deal-contact-input" className="block text-ink dark:text-neutral-200 font-semibold mb-1">
                Primary Contact Email
              </label>
              <input
                id="deal-contact-input"
                type="email"
                placeholder="cto@nexgen.io"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] focus:bg-white dark:focus:bg-[#181917] outline-hidden focus-visible:ring-2 focus-visible:ring-accent text-ink dark:text-neutral-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="deal-stage-select" className="block text-ink dark:text-neutral-200 font-semibold mb-1">
                Pipeline Stage
              </label>
              <select
                id="deal-stage-select"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] focus:bg-white dark:focus:bg-[#181917] outline-hidden focus-visible:ring-2 focus-visible:ring-accent text-ink dark:text-neutral-100"
              >
                <option value="New Leads">New Leads</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won (Closed)">Won (Closed)</option>
              </select>
            </div>
            <div>
              <label htmlFor="deal-priority-select" className="block text-ink dark:text-neutral-200 font-semibold mb-1">
                Priority Level
              </label>
              <select
                id="deal-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] focus:bg-white dark:focus:bg-[#181917] outline-hidden focus-visible:ring-2 focus-visible:ring-accent text-ink dark:text-neutral-100"
              >
                <option value="Hot">🔥 Hot (Immediate close)</option>
                <option value="High">⚡ High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border dark:border-[#2E302A]">
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
              Create Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
