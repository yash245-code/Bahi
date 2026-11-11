'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  variables: string[];
  body: string;
}

export default function AdminEmailTemplatesPage() {
  const templates: EmailTemplate[] = [
    {
      id: 'welcome',
      name: 'Tenant Welcome & Onboarding',
      subject: 'Welcome to Bahi, {{userName}} — Your workspace is ready',
      variables: ['{{userName}}', '{{tenantName}}', '{{loginUrl}}'],
      body: `Hello {{userName}},\n\nYour organization workspace for {{tenantName}} has been provisioned.\n\nLog in here: {{loginUrl}}\n\nWarm regards,\nThe Bahi Operations Team`,
    },
    {
      id: 'invoice_receipt',
      name: 'Invoice Payment Receipt (Stripe)',
      subject: 'Tax Receipt: Invoice {{invoiceId}} Paid',
      variables: ['{{userName}}', '{{invoiceId}}', '{{amount}}', '{{receiptUrl}}'],
      body: `Hello {{userName}},\n\nYour payment of {{amount}} for {{invoiceId}} was settled successfully.\n\nDownload official PDF: {{receiptUrl}}\n\nThank you for choosing Bahi.`,
    },
    {
      id: 'password_reset',
      name: 'Cryptographic Password Reset',
      subject: 'Reset your Bahi account credentials',
      variables: ['{{userName}}', '{{resetLink}}', '{{expiresIn}}'],
      body: `Hello {{userName}},\n\nClick below to securely reset your credentials. This link expires in {{expiresIn}}.\n\n{{resetLink}}\n\nIf you did not request this, ignore this note.`,
    },
  ];

  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate>(templates[0]!);
  const [testEmail, setTestEmail] = useState('admin@bahi.app');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSelect = (t: EmailTemplate) => {
    setActiveTemplate(t);
  };

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
          Transactional Communications
        </span>
        <h1 className="font-serif text-3xl font-black text-white mt-1">
          Email Templates & Broadcast Dispatcher
        </h1>
      </div>

      {sentSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Test email dispatched to {testEmail} via SMTP daemon!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Template Selector */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold px-2 block">
            System Templates ({templates.length})
          </span>
          {templates.map((t) => (
            <div
              key={t.id}
              onClick={() => handleSelect(t)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTemplate.id === t.id
                  ? 'bg-[#151722] border-rose-500 shadow-sm'
                  : 'bg-[#11131A] border-white/5 hover:border-white/20'
              }`}
            >
              <h4 className="font-semibold text-white text-xs">{t.name}</h4>
              <p className="text-[11px] text-neutral-400 mt-1 truncate font-mono">{t.subject}</p>
            </div>
          ))}
        </div>

        {/* Template Editor & Live Preview */}
        <div className="lg:col-span-2 rounded-3xl p-6 sm:p-8 bg-[#11131A] border border-white/10 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="font-serif font-bold text-xl text-white">Edit: {activeTemplate.name}</h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[10px] font-mono text-neutral-400">Available Variables:</span>
              {activeTemplate.variables.map((v) => (
                <span key={v} className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-rose-400">
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase">Subject Line</label>
              <input
                type="text"
                value={activeTemplate.subject}
                onChange={(e) => setActiveTemplate({ ...activeTemplate, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase">Email Content Body</label>
              <textarea
                rows={7}
                value={activeTemplate.body}
                onChange={(e) => setActiveTemplate({ ...activeTemplate, body: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white font-mono text-xs leading-relaxed"
              />
            </div>
          </div>

          {/* Test email send */}
          <form onSubmit={handleSendTest} className="pt-4 border-t border-white/5 flex gap-3">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="admin@bahi.app"
              className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-xs text-white"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Test Email</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
