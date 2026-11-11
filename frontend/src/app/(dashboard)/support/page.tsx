'use client';

import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface CustomerTicket {
  id: string;
  subject: string;
  category: 'Billing & Plan' | 'Technical / Bug' | 'Feature Request' | 'Data Migration';
  priority: 'Urgent' | 'High' | 'Normal';
  status: 'Open' | 'In Review' | 'Resolved';
  lastReply: string;
  createdAt: string;
}

interface FeatureFeedback {
  id: string;
  title: string;
  votes: number;
  hasVoted?: boolean;
  status: 'Planned' | 'In Progress' | 'Shipped';
  category: string;
}

export default function CustomerSupportPage() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'feedback'>('tickets');

  // Tickets
  const [tickets, setTickets] = useState<CustomerTicket[]>([
    {
      id: 'TICK-1042',
      subject: 'Assistance setting up Razorpay Webhook Endpoint',
      category: 'Billing & Plan',
      priority: 'Normal',
      status: 'Open',
      lastReply: 'Support team reviewing webhook payloads',
      createdAt: '2026-11-09',
    },
    {
      id: 'TICK-0985',
      subject: 'Bulk contact import CSV mapping question',
      category: 'Technical / Bug',
      priority: 'Normal',
      status: 'Resolved',
      lastReply: 'Resolved by Agent Marcus: UTF-8 encoding confirmed',
      createdAt: '2026-10-22',
    },
  ]);

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Technical / Bug',
    priority: 'Normal',
    message: '',
  });

  // Feature Feedback Board
  const [feedbackItems, setFeedbackItems] = useState<FeatureFeedback[]>([
    { id: 'fb-1', title: 'Barcode scanner mobile camera support in inventory', votes: 48, status: 'In Progress', category: 'Inventory' },
    { id: 'fb-2', title: 'Multi-entity corporate consolidation ledger', votes: 94, status: 'Planned', category: 'Accounting' },
    { id: 'fb-3', title: 'WhatsApp Business direct invoice delivery', votes: 61, status: 'Shipped', category: 'Sales' },
    { id: 'fb-4', title: 'SAML 2.0 / Okta enterprise single sign-on', votes: 32, status: 'Planned', category: 'Security' },
  ]);

  const [newFeedbackTitle, setNewFeedbackTitle] = useState('');
  const [newFeedbackCategory, setNewFeedbackCategory] = useState('CRM');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject.trim()) return;

    setTickets([
      {
        id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: ticketForm.subject,
        category: ticketForm.category as any,
        priority: ticketForm.priority as any,
        status: 'Open',
        lastReply: 'Ticket assigned to tier-1 support queue',
        createdAt: new Date().toISOString().split('T')[0] || '2026-11-10',
      },
      ...tickets,
    ]);

    setTicketForm({ subject: '', category: 'Technical / Bug', priority: 'Normal', message: '' });
    setIsTicketModalOpen(false);
  };

  const handleVote = (id: string) => {
    setFeedbackItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const hasVoted = !item.hasVoted;
          return {
            ...item,
            hasVoted,
            votes: hasVoted ? item.votes + 1 : item.votes - 1,
          };
        }
        return item;
      }),
    );
  };

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackTitle.trim()) return;
    setFeedbackItems([
      {
        id: `fb-${Date.now()}`,
        title: newFeedbackTitle,
        votes: 1,
        hasVoted: true,
        status: 'Planned',
        category: newFeedbackCategory,
      },
      ...feedbackItems,
    ]);
    setNewFeedbackTitle('');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-bold">
            Customer Helpdesk
          </span>
          <h1 className="font-serif text-3xl font-black text-ink dark:text-white mt-1">
            Support & Feature Roadmap
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsTicketModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold shadow-md shadow-accent/20 hover:opacity-95 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Open New Support Ticket</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'tickets' ? 'bg-accent text-white shadow-xs' : 'text-neutral-500 hover:text-ink'
          }`}
        >
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>My Support Tickets ({tickets.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'feedback' ? 'bg-accent text-white shadow-xs' : 'text-neutral-500 hover:text-ink'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Feature Request Board</span>
        </button>
      </div>

      {/* Tickets View */}
      {activeTab === 'tickets' && (
        <div className="rounded-3xl p-8 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5 text-neutral-400 uppercase text-[10px]">
                  <th className="p-3.5">Ticket ID</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 text-ink dark:text-neutral-200">
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td className="p-3.5 font-mono font-bold text-accent">{t.id}</td>
                    <td className="p-3.5 font-semibold text-ink dark:text-white max-w-xs">{t.subject}</td>
                    <td className="p-3.5 text-neutral-500">{t.category}</td>
                    <td className="p-3.5">
                      <span className="font-mono text-[11px]">{t.priority}</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          t.status === 'Resolved'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-sky-500/10 text-sky-500'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-neutral-400 text-[11px]">{t.lastReply}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Feedback Board View */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          {/* Submit new suggestion */}
          <form
            onSubmit={handleAddFeedback}
            className="rounded-3xl p-6 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              required
              placeholder="Suggest a new module capability or workflow improvement..."
              value={newFeedbackTitle}
              onChange={(e) => setNewFeedbackTitle(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs text-ink dark:text-white"
            />
            <select
              value={newFeedbackCategory}
              onChange={(e) => setNewFeedbackCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs text-ink dark:text-white"
            >
              <option>CRM</option>
              <option>Sales</option>
              <option>Inventory</option>
              <option>Accounting</option>
              <option>Security</option>
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold cursor-pointer shrink-0"
            >
              Submit Idea
            </button>
          </form>

          {/* Feedback grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feedbackItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm flex items-start gap-4"
              >
                <button
                  type="button"
                  onClick={() => handleVote(item.id)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center shrink-0 transition-all ${
                    item.hasVoted
                      ? 'bg-accent text-white shadow-xs'
                      : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="font-mono text-xs font-bold mt-1">{item.votes}</span>
                </button>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-accent uppercase font-bold">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        item.status === 'Shipped'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : item.status === 'In Progress'
                            ? 'bg-sky-500/10 text-sky-500'
                            : 'bg-neutral-100 dark:bg-white/10 text-neutral-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-ink dark:text-white leading-snug">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title="Create Support Ticket"
        subtitle="Our engineering support agents reply within 4 hours"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase">Subject *</label>
            <input
              type="text"
              required
              value={ticketForm.subject}
              onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
              placeholder="Brief summary of the issue..."
              className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-500 uppercase">Category</label>
              <select
                value={ticketForm.category}
                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029]"
              >
                <option>Technical / Bug</option>
                <option>Billing & Plan</option>
                <option>Feature Request</option>
                <option>Data Migration</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-500 uppercase">Priority</label>
              <select
                value={ticketForm.priority}
                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029]"
              >
                <option>Normal</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase">Detailed Description *</label>
            <textarea
              rows={4}
              required
              value={ticketForm.message}
              onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
              placeholder="Describe what occurred, steps to reproduce, or attach error messages..."
              className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsTicketModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-accent text-white font-semibold">
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
