'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AdminSystemSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30);
  const [smtpSender, setSmtpSender] = useState('notifications@bahi.app');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
          Platform Configuration
        </span>
        <h1 className="font-serif text-3xl font-black text-white mt-1">
          System Settings & Environment Policies
        </h1>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>System configuration parameters synced to cluster environment!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Maintenance mode callout */}
        <div className="rounded-3xl p-6 bg-[#11131A] border border-white/10 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Global Maintenance Mode
            </h3>
            <p className="text-xs text-neutral-400 max-w-md">
              When enabled, customer logins and API write requests are temporarily suspended with a 503 Maintenance page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
              maintenanceMode
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-white/5 text-neutral-400 border border-white/10'
            }`}
          >
            {maintenanceMode ? 'Active (Live Block)' : 'Disabled (Operational)'}
          </button>
        </div>

        {/* Security & Inactivity Policy */}
        <div className="rounded-3xl p-8 bg-[#11131A] border border-white/10 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-white">Security & Session Expiry Policy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase">
                Staff Admin Inactivity Timeout (Mins)
              </label>
              <input
                type="number"
                value={sessionTimeoutMinutes}
                onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase">
                System Default Email Sender
              </label>
              <input
                type="email"
                value={smtpSender}
                onChange={(e) => setSmtpSender(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#171924] text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 cursor-pointer"
          >
            Save System Policies
          </button>
        </div>
      </form>
    </div>
  );
}
