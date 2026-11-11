'use client';

import React, { useState } from 'react';
import {
  Send,
  Lock,
} from 'lucide-react';

interface AdminTicket {
  id: string;
  customerEmail: string;
  tenantName: string;
  subject: string;
  category: string;
  priority: 'Urgent' | 'High' | 'Normal';
  assignee: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  messages: { sender: string; isInternal: boolean; text: string; time: string }[];
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<AdminTicket[]>([
    {
      id: 'TICK-1042',
      customerEmail: 'elena@nexusdynamics.io',
      tenantName: 'Nexus Dynamics',
      subject: 'Assistance setting up Razorpay Webhook Endpoint',
      category: 'Billing & Plan',
      priority: 'Normal',
      assignee: 'Karan Patel',
      status: 'In Progress',
      messages: [
        { sender: 'elena@nexusdynamics.io', isInternal: false, text: 'We receive a 400 signature verification error on webhook events from Razorpay.', time: 'Nov 9, 14:20' },
        { sender: 'karan@bahi.app', isInternal: true, text: 'Staff internal note: Verified tenant endpoint secret had an unescaped trailing newline.', time: 'Nov 9, 15:10' },
      ],
    },
    {
      id: 'TICK-0985',
      customerEmail: 'vikram@apexlogistics.com',
      tenantName: 'Apex Industrial',
      subject: 'Custom CSV delimiter for warehouse scanner',
      category: 'Technical',
      priority: 'High',
      assignee: 'Marcus Bell',
      status: 'Open',
      messages: [
        { sender: 'vikram@apexlogistics.com', isInternal: false, text: 'Our Zebra handheld barcode scanners output pipe-delimited records. Can we map this in impex?', time: 'Nov 10, 08:30' },
      ],
    },
  ]);

  const [activeTicket, setActiveTicket] = useState<AdminTicket>(tickets[0]!);
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const cannedResponses = [
    'Thank you for reaching out. We have refreshed your webhook secret in our gateway. Please trigger a test event.',
    'This file format is fully supported. Under Data Import Settings, choose "Custom Separator" and input the pipe character.',
    'Your request has been escalated to our senior systems reliability engineering team.',
  ];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const newMessage = {
      sender: 'admin@bahi.app',
      isInternal: isInternalNote,
      text: replyText,
      time: 'Just now',
    };

    const updated = tickets.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          messages: [...t.messages, newMessage],
          status: isInternalNote ? t.status : ('In Progress' as const),
        };
      }
      return t;
    });

    setTickets(updated);
    setActiveTicket({ ...activeTicket, messages: [...activeTicket.messages, newMessage] });
    setReplyText('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
          Helpdesk Dispatcher
        </span>
        <h1 className="font-serif text-3xl font-black text-white mt-1">
          Support Queue & Internal Staff Notes
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Ticket List */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold px-2 block">
            Open Queue ({tickets.length})
          </span>
          {tickets.map((t) => {
            const isSelected = activeTicket?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setActiveTicket(t)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#151722] border-rose-500 shadow-sm'
                    : 'bg-[#11131A] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-rose-400 font-bold">{t.id}</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      t.priority === 'High' ? 'bg-amber-500/15 text-amber-400' : 'bg-white/5 text-neutral-400'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
                <h4 className="font-semibold text-white text-xs mt-1.5">{t.subject}</h4>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2 font-mono">
                  <span>{t.tenantName}</span>
                  <span>{t.assignee}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ticket Conversation & Notes */}
        <div className="lg:col-span-2 rounded-3xl p-6 sm:p-8 bg-[#11131A] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <span className="font-mono text-xs text-rose-400 font-bold">{activeTicket.id}</span>
              <h2 className="font-serif font-bold text-lg text-white mt-0.5">{activeTicket.subject}</h2>
              <span className="text-xs text-neutral-400">
                Customer: {activeTicket.customerEmail} ({activeTicket.tenantName})
              </span>
            </div>
            <select
              value={activeTicket.status}
              onChange={(e) => {
                const s = e.target.value as any;
                setActiveTicket({ ...activeTicket, status: s });
                setTickets(tickets.map((t) => (t.id === activeTicket.id ? { ...t, status: s } : t)));
              }}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-[#171924] text-xs text-white"
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>

          {/* Messages Stream */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
            {activeTicket.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl text-xs space-y-1.5 ${
                  msg.isInternal
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-100'
                    : msg.sender.includes('@bahi.app')
                      ? 'bg-rose-500/10 border border-rose-500/30 text-white ml-6'
                      : 'bg-white/5 border border-white/5 text-neutral-200 mr-6'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-semibold flex items-center gap-1.5">
                    {msg.isInternal && <Lock className="w-3 h-3 text-amber-400" />}
                    <span>{msg.isInternal ? 'Internal Staff Note' : msg.sender}</span>
                  </span>
                  <span className="opacity-60">{msg.time}</span>
                </div>
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Canned Responses */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">Canned Responses:</span>
            <div className="flex flex-wrap gap-2">
              {cannedResponses.map((cr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setReplyText(cr)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-neutral-300 truncate max-w-xs transition-colors"
                >
                  {cr}
                </button>
              ))}
            </div>
          </div>

          {/* Response Form */}
          <form onSubmit={handleSendReply} className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isInternalNote}
                  onChange={(e) => setIsInternalNote(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className={isInternalNote ? 'text-amber-400 font-bold flex items-center gap-1' : 'text-neutral-400'}>
                  <Lock className="w-3 h-3" /> Private Internal Note (Customer will NOT see this)
                </span>
              </label>
            </div>

            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={isInternalNote ? 'Write private staff notes, ticket context, or internal triage...' : 'Type public reply to customer...'}
              className={`w-full px-4 py-2.5 rounded-xl border text-xs text-white focus:outline-none ${
                isInternalNote ? 'bg-amber-500/5 border-amber-500/30' : 'bg-[#171924] border-white/10'
              }`}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                  isInternalNote ? 'bg-amber-500 text-black font-bold' : 'bg-rose-600 text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isInternalNote ? 'Post Internal Note' : 'Send Customer Reply'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
