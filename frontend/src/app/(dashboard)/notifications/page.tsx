'use client';

import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { getChangelogEntries } from '@/lib/cms-store';

export default function NotificationsCenterPage() {
  const [activeTab, setActiveTab] = useState<'alerts' | 'changelog'>('alerts');
  const changelog = getChangelogEntries();

  const [alerts, setAlerts] = useState([
    {
      id: 'alt-1',
      type: 'deal',
      title: 'Deal Stage Advanced to Negotiation',
      message: 'Alexandre Dubois moved "Apex Industrial Fleet Contract ($42,000)" to Final Negotiation.',
      time: '25 mins ago',
      read: false,
    },
    {
      id: 'alt-2',
      type: 'billing',
      title: 'Monthly Subscription Invoice Settled',
      message: 'Invoice INV-2026-011 for $79.00 was successfully processed via Stripe.',
      time: '3 hours ago',
      read: true,
    },
    {
      id: 'alt-3',
      type: 'security',
      title: 'New Session from Paris, France',
      message: 'A successful login was registered from IP 82.165.197.10 on macOS Safari.',
      time: 'Yesterday',
      read: true,
    },
  ]);

  const markAllRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, read: true })));
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-bold">
            Activity Feed
          </span>
          <h1 className="font-serif text-3xl font-black text-ink dark:text-white mt-1">
            Notification Center & Releases
          </h1>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="text-xs text-neutral-500 hover:text-ink dark:hover:text-white underline self-start sm:self-center"
        >
          Mark all alerts as read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'alerts' ? 'bg-accent text-white shadow-xs' : 'text-neutral-500 hover:text-ink'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Workspace Alerts ({alerts.filter((a) => !a.read).length} new)</span>
        </button>
        <button
          onClick={() => setActiveTab('changelog')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'changelog' ? 'bg-accent text-white shadow-xs' : 'text-neutral-500 hover:text-ink'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Product Changelog ({changelog.length})</span>
        </button>
      </div>

      {/* Alerts View */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                !alt.read
                  ? 'bg-white dark:bg-[#14161C] border-accent/40 shadow-sm'
                  : 'bg-neutral-50/70 dark:bg-white/[0.02] border-black/5 dark:border-white/5 opacity-80'
              }`}
            >
              <div
                className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
                  !alt.read ? 'bg-accent/10 text-accent' : 'bg-neutral-200 dark:bg-white/5 text-neutral-400'
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>

              <div className="space-y-1 flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-ink dark:text-white">{alt.title}</h4>
                  <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alt.time}
                  </span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{alt.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Changelog View */}
      {activeTab === 'changelog' && (
        <div className="space-y-8">
          {changelog.map((entry, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-8 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-accent text-white">
                    {entry.version}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">{entry.date}</span>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {entry.badge}
                </span>
              </div>

              <h3 className="font-serif font-black text-xl text-ink dark:text-white">{entry.title}</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {entry.description}
              </p>

              <div className="pt-3 border-t border-black/5 dark:border-white/5 space-y-2">
                <p className="text-[10px] font-mono uppercase text-neutral-400 font-bold">Key Updates:</p>
                {entry.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
