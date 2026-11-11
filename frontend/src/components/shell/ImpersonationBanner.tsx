'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldAlert } from 'lucide-react';
import { getImpersonationState, endImpersonation, ImpersonationState } from '@/lib/admin-auth';

export function ImpersonationBanner() {
  const router = useRouter();
  const [impersonation, setImpersonation] = useState<ImpersonationState | null>(null);

  useEffect(() => {
    setImpersonation(getImpersonationState());
    const interval = setInterval(() => {
      setImpersonation(getImpersonationState());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!impersonation || !impersonation.isImpersonating) return null;

  const timeLeftMinutes = Math.max(
    0,
    Math.round((impersonation.expiresAt - Date.now()) / 60000),
  );

  const handleExit = () => {
    endImpersonation();
    router.push('/admin/users');
  };

  return (
    <div className="w-full bg-amber-500 text-black px-4 py-2 font-mono text-xs flex items-center justify-between shadow-md z-50 sticky top-0">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 shrink-0 animate-bounce" />
        <span>
          <strong>STAFF IMPERSONATION ACTIVE:</strong> Viewing workspace &quot;{impersonation.targetTenantName}&quot; as{' '}
          <u>{impersonation.targetUserEmail}</u> ({impersonation.targetUserName}).
        </span>
        <span className="hidden sm:inline bg-black/10 px-2 py-0.5 rounded text-[11px]">
          Session expires in {timeLeftMinutes}m
        </span>
      </div>

      <button
        type="button"
        onClick={handleExit}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Exit Impersonation</span>
      </button>
    </div>
  );
}
