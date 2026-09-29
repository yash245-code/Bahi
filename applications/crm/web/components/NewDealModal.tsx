'use client';

import { useState } from 'react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-lg w-full p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <h2 className="text-base font-bold text-ink">Create New Opportunity Deal</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink text-sm p-1 rounded-lg hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-ink font-semibold mb-1">Deal Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Enterprise Cloud ERP Migration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-ink font-semibold mb-1">Deal Value ($) *</label>
              <input
                type="number"
                required
                placeholder="25000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
              />
            </div>
            <div>
              <label className="block text-ink font-semibold mb-1">Close Probability (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(e) => setProbability(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-ink font-semibold mb-1">Company / Account *</label>
              <input
                type="text"
                required
                placeholder="e.g. NexGen Dynamics"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
              />
            </div>
            <div>
              <label className="block text-ink font-semibold mb-1">Primary Contact Email</label>
              <input
                type="email"
                placeholder="cto@nexgen.io"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-ink font-semibold mb-1">Pipeline Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
              >
                <option value="New Leads">New Leads</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won (Closed)">Won (Closed)</option>
              </select>
            </div>
            <div>
              <label className="block text-ink font-semibold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
              >
                <option value="Hot">🔥 Hot</option>
                <option value="High">⚡ High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-2"
            >
              Create Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
