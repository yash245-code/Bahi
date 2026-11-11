'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, Clock, Globe, Menu, ExternalLink } from 'lucide-react';
import { getAdminSession } from '@/lib/admin-auth';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const [timeRemaining, setTimeRemaining] = useState('29:54');

  useEffect(() => {
    const timer = setInterval(() => {
      const cur = getAdminSession();
      if (!cur) return;
      const diffMs = cur.expiresAt - Date.now();
      if (diffMs <= 0) {
        setTimeRemaining('Expired');
      } else {
        const mins = Math.floor(diffMs / 60000);
        const secs = Math.floor((diffMs % 60000) / 1000);
        setTimeRemaining(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-14 bg-[#0B0D13] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between z-20 text-xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
          aria-label="Toggle admin sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Security Alert Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[11px] font-bold">
          <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">STAFF ACCESS ENVIRONMENT:</span>
          <span>STRICT AUDIT RECORDING ENABLED</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Session Timeout */}
        <div className="hidden md:flex items-center gap-1.5 font-mono text-[11px] text-neutral-400 bg-white/5 px-2.5 py-1 rounded-md">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Session Inactivity Lock:</span>
          <span className="text-white font-bold">{timeRemaining}</span>
        </div>

        {/* IP Location */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>192.168.1.100 (Internal VPN)</span>
        </div>

        {/* Return to Customer Workspace */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-neutral-200 transition-colors font-medium text-[11px]"
        >
          <span>Customer App</span>
          <ExternalLink className="w-3 h-3 text-neutral-400" />
        </Link>
      </div>
    </header>
  );
}
