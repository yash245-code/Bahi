'use client';

import { useState } from 'react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-lg w-full p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <h2 className="text-base font-bold text-ink">Capture New Inbound Lead</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink text-sm p-1 rounded-lg hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-ink font-semibold mb-1">Contact Name *</label>
              <input
                type="text"
                required
                placeholder="Sarah Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
              />
            </div>
            <div>
              <label className="block text-ink font-semibold mb-1">Company / Org *</label>
              <input
                type="text"
                required
                placeholder="TechStart Inc."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-ink font-semibold mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="sarah@techstart.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
              />
            </div>
            <div>
              <label className="block text-ink font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (555) 349-2180"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-ink font-semibold mb-1">Lead Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
              >
                <option value="Inbound Website">Inbound Website</option>
                <option value="Product Trial">Product Trial</option>
                <option value="Referral">Partner Referral</option>
                <option value="Direct Outreach">Direct Outreach</option>
                <option value="Webinar/Event">Webinar / Event</option>
              </select>
            </div>
            <div>
              <label className="block text-ink font-semibold mb-1">Qualification Score ({score}/100)</label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full accent-accent mt-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-ink font-semibold mb-1">Initial Discovery Notes</label>
            <textarea
              rows={3}
              placeholder="Expressed interest in multi-warehouse synchronization and ERP integration..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-[#FAF9F5] focus:bg-white outline-none focus:border-accent text-ink"
            />
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
              Capture Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
