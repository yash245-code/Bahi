import React from 'react';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { CookieConsent } from '@/components/public/CookieConsent';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F3] dark:bg-[#050505] text-ink dark:text-[#F7F6F3] transition-colors duration-150">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <CookieConsent />
    </div>
  );
}

