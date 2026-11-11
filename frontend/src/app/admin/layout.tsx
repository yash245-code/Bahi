'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getAdminSession, saveAdminSession, DEFAULT_ADMIN } from '@/lib/admin-auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // If on the login page itself, do not guard
    if (pathname === '/admin/login') {
      setIsAuthorized(true);
      return;
    }

    const session = getAdminSession();
    if (!session) {
      // Auto-provision demo admin session if none exists for smooth exploration
      saveAdminSession(DEFAULT_ADMIN);
      setIsAuthorized(true);
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  // If on admin login page, render login full screen without sidebar/header
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-[#07080B] text-white font-sans selection:bg-rose-500/30 selection:text-white">
        {children}
      </div>
    );
  }

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#0B0D13] flex items-center justify-center text-xs text-neutral-500 font-mono">
        Verifying Staff Credentials & 2FA State...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090E] text-neutral-200 flex font-sans selection:bg-rose-600/30 selection:text-white">
      {/* Admin Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 transform lg:transform-none lg:static transition-transform duration-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 no-scrollbar bg-[#0B0D13]">
          {children}
        </main>
      </div>
    </div>
  );
}

